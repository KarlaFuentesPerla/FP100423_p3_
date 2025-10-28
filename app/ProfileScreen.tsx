import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { supabase } from '../lib/supabase';

interface Profile {
  id: string;
  email: string;
  full_name: string;
  plan: 'free' | 'premium';
  created_at: string;
}

interface Recipe {
  id: string;
  title: string;
  description: string;
  created_at: string;
}

interface Favorite {
  recipe_id: string;
  recipes: Recipe;
}

export default function Profile({ navigation }: any) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Cargar perfil
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileData) {
        setProfile(profileData);

        // Cargar favoritos (solo si la tabla existe)
        let favoritesData = [];
        try {
          const { data, error: favoritesError } = await supabase
            .from('favorites')
            .select(`
              recipe_id,
              recipes (
                id,
                title,
                description,
                created_at
              )
            `)
            .eq('user_id', user.id);
          
          if (favoritesError) {
            console.log('Favorites not available:', favoritesError);
            favoritesData = [];
          } else {
            favoritesData = data || [];
          }
        } catch (err) {
          console.log('Favorites table not accessible:', err);
          favoritesData = [];
        }

        setFavorites(
          (favoritesData as any[]).map(fav => ({
            recipe_id: fav.recipe_id,
            recipes: fav.recipes
          })) || []
        );

        // Cargar recetas del usuario (solo si es premium)
        if (profileData.plan === 'premium') {
          const { data: recipesData, error: recipesError } = await supabase
            .from('recipes')
            .select('id, title, description, created_at')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (recipesError) {
            console.error('Error cargando recetas del usuario:', recipesError);
            setUserRecipes([]);
          } else {
            setUserRecipes(recipesData || []);
          }
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      Alert.alert('Error', 'No se pudo cargar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadProfileData();
    setRefreshing(false);
  };

  const upgradeToPremium = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({ plan: 'premium' })
        .eq('id', user.id);

      if (error) {
        Alert.alert('Error', 'No se pudo actualizar el plan');
      } else {
        Alert.alert(
          '¡Felicidades! 🎉',
          'Tu plan ha sido actualizado a Premium. Ahora puedes subir recetas, comentar y disfrutar de ingredientes ilimitados.',
          [
            {
              text: 'Continuar',
              onPress: () => {
                loadProfileData();
                navigation.navigate('Inicio');
              }
            }
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el plan');
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error', 'No se pudo cerrar sesión');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e48fb4" />
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {profile?.full_name?.charAt(0)?.toUpperCase() || profile?.email?.charAt(0)?.toUpperCase() || 'U'}
          </Text>
        </View>
        <Text style={styles.name}>{profile?.full_name || 'Usuario'}</Text>
        <Text style={styles.email}>{profile?.email}</Text>
        
        <View style={[styles.planBadge, profile?.plan === 'premium' ? styles.premiumBadge : styles.freeBadge]}>
          <Text style={[styles.planText, profile?.plan === 'premium' ? styles.premiumText : styles.freeText]}>
            {profile?.plan === 'premium' ? '🌟 Premium' : '🆓 Free'}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* Estadísticas */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{favorites.length}</Text>
            <Text style={styles.statLabel}>Favoritos</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userRecipes.length}</Text>
            <Text style={styles.statLabel}>Recetas Subidas</Text>
          </View>
        </View>

        {/* Botón de actualización a Premium */}
        {profile?.plan === 'free' && (
          <TouchableOpacity style={styles.upgradeButton} onPress={upgradeToPremium}>
            <Text style={styles.upgradeButtonText}>🌟 Actualizar a Premium</Text>
          </TouchableOpacity>
        )}

        {/* Recetas Favoritas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>❤️ Recetas Favoritas</Text>
          {favorites.length === 0 ? (
            <Text style={styles.emptyText}>No tienes recetas favoritas aún</Text>
          ) : (
            favorites.map((favorite) => (
              <TouchableOpacity 
                key={favorite.recipe_id} 
                style={styles.recipeItem}
                onPress={() => navigation.navigate('RecipeDetail', { recipeId: favorite.recipes.id })}
              >
                <Text style={styles.recipeTitle}>{favorite.recipes.title}</Text>
                <Text style={styles.recipeDescription} numberOfLines={2}>
                  {favorite.recipes.description}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Recetas Subidas (solo Premium) */}
        {profile?.plan === 'premium' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📝 Mis Recetas</Text>
            {userRecipes.length === 0 ? (
              <Text style={styles.emptyText}>No has subido recetas aún</Text>
            ) : (
              userRecipes.map((recipe) => (
                <TouchableOpacity 
                  key={recipe.id} 
                  style={styles.recipeItem}
                  onPress={() => navigation.navigate('RecipeDetail', { recipeId: recipe.id })}
                >
                  <Text style={styles.recipeTitle}>{recipe.title}</Text>
                  <Text style={styles.recipeDescription} numberOfLines={2}>
                    {recipe.description}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}

        {/* Botón de cerrar sesión */}
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fef6f9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fef6f9',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#e48fb4',
    padding: 24,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#e48fb4',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 16,
  },
  planBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  freeBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  premiumBadge: {
    backgroundColor: '#FFD700',
  },
  planText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  freeText: {
    color: 'white',
  },
  premiumText: {
    color: '#8B4513',
  },
  content: {
    padding: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e48fb4',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  upgradeButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  upgradeButtonText: {
    color: '#8B4513',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
  recipeItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  recipeDescription: {
    fontSize: 14,
    color: '#666',
  },
  logoutButton: {
    backgroundColor: '#ff6b6b',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
