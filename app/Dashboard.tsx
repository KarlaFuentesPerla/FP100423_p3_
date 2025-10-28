import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuthManager } from '../components/AuthManager';
import { supabase } from '../lib/supabase';

const Dashboard = ({ navigation }: any) => {
  const { user, loading: authLoading, isInitialized } = useAuthManager();
  const [userPlan, setUserPlan] = useState('free');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState('Usuario');
  const [profileLoaded, setProfileLoaded] = useState(false);

  const initializeDashboard = useCallback(async () => {
    if (!isInitialized || !user || profileLoaded) return;
    
    try {
      setError(null);
      setLoading(true);
      
      // Establecer nombre de usuario
      const displayName = user.user_metadata?.full_name || 
                         user.email?.split('@')[0] || 
                         'Usuario';
      setUserName(displayName);

      // Intentar cargar perfil de forma simple
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('plan')
        .eq('id', user.id)
        .maybeSingle();
      
      if (profileError) {
        console.log('Profile error (creating if needed):', profileError);
        
        // Si no existe el perfil, crearlo
        if (profileError.code === 'PGRST116' || !profile) {
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              email: user.email,
              full_name: displayName,
              plan: 'free'
            });
          
          if (insertError) {
            console.log('Could not create profile, using default:', insertError);
          }
        }
      }
      
      setUserPlan(profile?.plan || 'free');
      setProfileLoaded(true);
      
    } catch (error: any) {
      console.error('Dashboard initialization error:', error);
      setError('Error al inicializar el dashboard');
      setUserPlan('free');
    } finally {
      setLoading(false);
    }
  }, [user, isInitialized, profileLoaded]);

  useEffect(() => {
    if (isInitialized && user && !profileLoaded) {
      initializeDashboard();
    }
  }, [isInitialized, user, profileLoaded, initializeDashboard]);

  // Si no hay usuario autenticado, mostrar error
  if (isInitialized && !user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorEmoji}>🔒</Text>
        <Text style={styles.errorTitle}>No autorizado</Text>
        <Text style={styles.errorText}>Por favor, inicia sesión para acceder al dashboard</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.retryButtonText}>🔑 Ir al Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isPremium = userPlan === 'premium';
  const isFree = userPlan === 'free';

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingEmoji}>🍳</Text>
        <Text style={styles.loadingText}>Preparando tu cocina...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorEmoji}>😔</Text>
        <Text style={styles.errorTitle}>¡Ups! Algo salió mal</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={initializeDashboard}>
          <Text style={styles.retryButtonText}>🔄 Intentar de nuevo</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header con saludo personalizado */}
      <View style={styles.header}>
        <Text style={styles.greeting}>¡Hola, {userName}! 👋</Text>
        <Text style={styles.subtitle}>Bienvenida a tu cocina vegetariana</Text>
      </View>

      {/* Plan Badge mejorado */}
      <View style={[styles.planCard, isPremium ? styles.premiumCard : styles.freeCard]}>
        <View style={styles.planHeader}>
          <Text style={styles.planEmoji}>{isPremium ? '🌟' : '🆓'}</Text>
          <Text style={[styles.planText, isPremium ? styles.premiumText : styles.freeText]}>
            {isPremium ? 'PREMIUM' : 'GRATIS'}
          </Text>
        </View>
        <Text style={styles.planDescription}>
          {isPremium ? 'Disfruta de todas las características' : 'Plan básico con funciones limitadas'}
        </Text>
      </View>

      {/* Botones de acción principales */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.primaryButton]}
          onPress={() => navigation.navigate('RandomRecipe')}
        >
          <Text style={styles.actionButtonEmoji}>🎲</Text>
          <Text style={styles.actionButtonText}>Receta Aleatoria</Text>
          <Text style={styles.actionButtonSubtext}>Descubre algo nuevo</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={() => navigation.navigate('Explore')}
        >
          <Text style={styles.actionButtonEmoji}>🔍</Text>
          <Text style={styles.actionButtonText}>Explorar</Text>
          <Text style={styles.actionButtonSubtext}>Ver todas las recetas</Text>
        </TouchableOpacity>

        {isPremium && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.premiumButton]}
            onPress={() => navigation.navigate('NuevaReceta')}
          >
            <Text style={styles.actionButtonEmoji}>✨</Text>
            <Text style={styles.actionButtonText}>Crear Receta</Text>
            <Text style={styles.actionButtonSubtext}>Comparte tu creatividad</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Características del plan */}
      <View style={styles.featuresContainer}>
        <Text style={styles.featuresTitle}>
          {isPremium ? '🌟 Características Premium' : '🆓 Características Gratuitas'}
        </Text>
        
        <View style={styles.featuresGrid}>
          {isFree ? (
            <>
              <View style={styles.featureItem}>
                <Text style={styles.featureEmoji}>🎲</Text>
                <Text style={styles.featureText}>1 receta aleatoria por día</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureEmoji}>🥬</Text>
                <Text style={styles.featureText}>Máximo 3 ingredientes</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureEmoji}>👀</Text>
                <Text style={styles.featureText}>Ver recetas públicas</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureEmoji}>❤️</Text>
                <Text style={styles.featureText}>Favoritos básicos</Text>
              </View>
            </>
          ) : (
            <>
              <View style={styles.featureItem}>
                <Text style={styles.featureEmoji}>♾️</Text>
                <Text style={styles.featureText}>Recetas ilimitadas</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureEmoji}>🥕</Text>
                <Text style={styles.featureText}>Hasta 10 ingredientes</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureEmoji}>✨</Text>
                <Text style={styles.featureText}>Crear recetas</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureEmoji}>💬</Text>
                <Text style={styles.featureText}>Comentar recetas</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureEmoji}>❤️</Text>
                <Text style={styles.featureText}>Favoritos ilimitados</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureEmoji}>🏷️</Text>
                <Text style={styles.featureText}>Categorías desbloqueadas</Text>
              </View>
            </>
          )}
        </View>
      </View>

      {/* Botones de navegación */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.navButtonEmoji}>👤</Text>
          <Text style={styles.navButtonText}>Mi Perfil</Text>
        </TouchableOpacity>

        {isFree && (
          <TouchableOpacity 
            style={[styles.navButton, styles.upgradeButton]}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.navButtonEmoji}>🌟</Text>
            <Text style={styles.navButtonText}>Actualizar a Premium</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

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
    padding: 20
  },
  loadingEmoji: {
    fontSize: 48,
    marginBottom: 16
  },
  loadingText: {
    fontSize: 18,
    color: '#E48FB4',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fef6f9',
    padding: 20
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: 16
  },
  errorTitle: {
    fontSize: 24,
    color: '#FF6B6B',
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center'
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24
  },
  retryButton: {
    backgroundColor: '#E48FB4',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  header: {
    padding: 20,
    paddingTop: 40,
    alignItems: 'center'
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E48FB4',
    textAlign: 'center',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center'
  },
  planCard: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  freeCard: {
    backgroundColor: '#F5F5F5',
    borderLeftWidth: 4,
    borderLeftColor: '#E0E0E0'
  },
  premiumCard: {
    backgroundColor: '#FFF8DC',
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700'
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  planEmoji: {
    fontSize: 24,
    marginRight: 12
  },
  planText: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  freeText: {
    color: '#666'
  },
  premiumText: {
    color: '#8B4513'
  },
  planDescription: {
    fontSize: 14,
    color: '#666',
    marginLeft: 36
  },
  actionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20
  },
  actionButton: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center'
  },
  primaryButton: {
    borderLeftWidth: 4,
    borderLeftColor: '#7FC69A'
  },
  secondaryButton: {
    borderLeftWidth: 4,
    borderLeftColor: '#E48FB4'
  },
  premiumButton: {
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
    backgroundColor: '#FFF8DC'
  },
  actionButtonEmoji: {
    fontSize: 32,
    marginBottom: 8
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4
  },
  actionButtonSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center'
  },
  featuresContainer: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center'
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  featureItem: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center'
  },
  featureEmoji: {
    fontSize: 24,
    marginBottom: 8
  },
  featureText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16
  },
  navigationContainer: {
    padding: 20,
    paddingBottom: 40
  },
  navButton: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  upgradeButton: {
    backgroundColor: '#FFF8DC',
    borderWidth: 1,
    borderColor: '#FFD700'
  },
  navButtonEmoji: {
    fontSize: 20,
    marginRight: 12
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333'
  }
});

export default Dashboard;