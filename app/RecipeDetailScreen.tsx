import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useFavorites } from '../hooks/useFavorites';
import { supabase } from '../lib/supabase';

interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prep_time: number;
  cook_time: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  created_at: string;
}

interface RecipeDetailScreenProps {
  route: {
    params: {
      recipeId: string;
    };
  };
  navigation: any;
}

export default function RecipeDetailScreen({ route, navigation }: RecipeDetailScreenProps) {
  const { recipeId } = route.params;
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [ingredients, setIngredients] = useState<any[]>([]);
  
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    loadRecipe();
  }, [recipeId]);

  const loadRecipe = async () => {
    try {
      setLoading(true);

      // Cargar datos básicos de la receta
      const { data: recipeData, error: recipeError } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', recipeId)
        .single();

      if (recipeError) {
        console.error('Error cargando receta:', recipeError);
        Alert.alert('Error', 'No se pudo cargar la receta');
        return;
      }

      if (recipeData) {
        // Cargar ingredientes de la receta
        const { data: ingredientsData, error: ingredientsError } = await supabase
          .from('recipe_ingredients')
          .select(`
            quantity,
            ingredients (
              id,
              name
            )
          `)
          .eq('recipe_id', recipeId);

        if (ingredientsError) {
          console.error('Error cargando ingredientes:', ingredientsError);
        }

        // Transformar la receta al formato esperado
        const transformedRecipe: Recipe = {
          id: recipeData.id.toString(),
          title: recipeData.title,
          description: recipeData.description,
          ingredients: ingredientsData?.map(ing => `${ing.quantity} de ${ing.ingredients.name}`) || [],
          instructions: recipeData.steps ? recipeData.steps.split('\n').filter(step => step.trim()) : [],
          prep_time: 15, // Valor por defecto
          cook_time: 30, // Valor por defecto
          servings: 4, // Valor por defecto
          difficulty: 'medium' as const, // Valor por defecto
          created_at: recipeData.created_at || new Date().toISOString()
        };

        setRecipe(transformedRecipe);
        setIngredients(ingredientsData || []);
      }
    } catch (error) {
      console.error('Error inesperado:', error);
      Alert.alert('Error', 'Ocurrió un error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!recipe) return;
    
    const success = await toggleFavorite(recipe.id);
    if (success) {
      const isNowFavorite = isFavorite(recipe.id);
      Alert.alert(
        isNowFavorite ? 'Agregado a favoritos' : 'Eliminado de favoritos',
        isNowFavorite 
          ? 'La receta se agregó a tus favoritos' 
          : 'La receta se eliminó de tus favoritos'
      );
    } else {
      Alert.alert('Error', 'No se pudo actualizar la receta');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e48fb4" />
        <Text style={styles.loadingText}>Cargando receta...</Text>
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No se pudo cargar la receta</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{recipe.title}</Text>
        <Text style={styles.description}>{recipe.description}</Text>
        
        <TouchableOpacity 
          style={[styles.favoriteButton, isFavorite(recipe.id) && styles.favoriteButtonActive]}
          onPress={handleToggleFavorite}
        >
          <Text style={styles.favoriteButtonText}>
            {isFavorite(recipe.id) ? '❤️ En Favoritos' : '🤍 Agregar a Favoritos'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🥘 Ingredientes</Text>
        {ingredients.length > 0 ? (
          ingredients.map((ingredient, index) => (
            <View key={index} style={styles.ingredientItem}>
              <Text style={styles.ingredientText}>
                • {ingredient.quantity} de {ingredient.ingredients.name}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No hay ingredientes disponibles</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📝 Instrucciones</Text>
        {recipe.instructions.length > 0 ? (
          recipe.instructions.map((instruction, index) => (
            <View key={index} style={styles.instructionItem}>
              <Text style={styles.stepNumber}>{index + 1}</Text>
              <Text style={styles.instructionText}>{instruction}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No hay instrucciones disponibles</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ℹ️ Información</Text>
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Tiempo de preparación:</Text>
            <Text style={styles.infoValue}>{recipe.prep_time} minutos</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Tiempo de cocción:</Text>
            <Text style={styles.infoValue}>{recipe.cook_time} minutos</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Porciones:</Text>
            <Text style={styles.infoValue}>{recipe.servings} personas</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Dificultad:</Text>
            <Text style={styles.infoValue}>
              {recipe.difficulty === 'easy' ? 'Fácil' : 
               recipe.difficulty === 'medium' ? 'Media' : 'Difícil'}
            </Text>
          </View>
        </View>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fef6f9',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#e48fb4',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    backgroundColor: '#e48fb4',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 16,
  },
  favoriteButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  favoriteButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  favoriteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  ingredientItem: {
    marginBottom: 8,
  },
  ingredientText: {
    fontSize: 16,
    color: '#333',
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  stepNumber: {
    backgroundColor: '#e48fb4',
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    width: 24,
    height: 24,
    borderRadius: 12,
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 12,
    marginTop: 2,
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
  infoContainer: {
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
});
