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
import { useProfile } from '../hooks/useProfile';
import { useRandomRecipe } from '../hooks/useRandomRecipe';

export default function HomeScreen({ navigation }: any) {
  const { profile, loading: profileLoading, isPremium, isFree } = useProfile();
  const { randomRecipe, generateRandomRecipe, loading: recipeLoading } = useRandomRecipe();
  const [welcomeMessage, setWelcomeMessage] = useState('');

  useEffect(() => {
    if (profile) {
      const name = profile.full_name || profile.email?.split('@')[0] || 'Usuario';
      setWelcomeMessage(`¡Hola ${name}! 👋`);
    }
  }, [profile]);

  const handleGenerateRecipe = async () => {
    await generateRandomRecipe();
  };

  const handleUpgradeToPremium = () => {
    Alert.alert(
      '🌟 Actualizar a Premium',
      '¿Quieres actualizar tu plan a Premium para disfrutar de todas las funcionalidades?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Actualizar', 
          onPress: () => {
            // Simular actualización a premium
            Alert.alert(
              '¡Felicidades! 🎉',
              'Tu plan ha sido actualizado a Premium. Ahora puedes subir recetas, comentar y disfrutar de ingredientes ilimitados.',
              [{ text: 'Continuar' }]
            );
          }
        }
      ]
    );
  };

  if (profileLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e48fb4" />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header con saludo personalizado */}
        <View style={styles.header}>
          <Text style={styles.title}>{welcomeMessage}</Text>
          <Text style={styles.subtitle}>
            {isFree() 
              ? 'Plan Free - Disfruta de recetas básicas' 
              : 'Plan Premium - Acceso completo 🌟'
            }
          </Text>
        </View>

        {/* Botón de receta aleatoria */}
        <TouchableOpacity
          style={[styles.mainButton, styles.recipeButton]}
          onPress={handleGenerateRecipe}
          disabled={recipeLoading}
        >
          {recipeLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Text style={styles.mainButtonText}>🍀 Receta del Día</Text>
              <Text style={styles.mainButtonSubtext}>
                {isFree() 
                  ? 'Receta con máximo 3 ingredientes' 
                  : 'Receta con hasta 10 ingredientes'
                }
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Botones de funcionalidades */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.featureButton}
            onPress={() => navigation.navigate('Dashboard')}
          >
            <Text style={styles.featureButtonIcon}>🏠</Text>
            <Text style={styles.featureButtonText}>Dashboard</Text>
            <Text style={styles.featureButtonSubtext}>
              Pantalla principal
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.featureButton}
            onPress={() => navigation.navigate('RandomRecipe')}
          >
            <Text style={styles.featureButtonIcon}>🎲</Text>
            <Text style={styles.featureButtonText}>Receta Aleatoria</Text>
            <Text style={styles.featureButtonSubtext}>
              {isFree() ? '3 ingredientes' : 'Hasta 10 ingredientes'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.featureButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.featureButtonIcon}>👤</Text>
            <Text style={styles.featureButtonText}>Mi Perfil</Text>
            <Text style={styles.featureButtonSubtext}>
              Ver favoritos y recetas
            </Text>
          </TouchableOpacity>

          {isPremium() ? (
            <TouchableOpacity
              style={styles.featureButton}
              onPress={() => navigation.navigate('NuevaReceta')}
            >
              <Text style={styles.featureButtonIcon}>➕</Text>
              <Text style={styles.featureButtonText}>Nueva Receta</Text>
              <Text style={styles.featureButtonSubtext}>
                Subir receta propia
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.featureButton, styles.premiumButton]}
              onPress={handleUpgradeToPremium}
            >
              <Text style={styles.featureButtonIcon}>🌟</Text>
              <Text style={styles.featureButtonText}>Actualizar a Premium</Text>
              <Text style={styles.featureButtonSubtext}>
                Subir recetas y comentar
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Características según el plan */}
        <View style={styles.features}>
          <Text style={styles.featureTitle}>
            {isPremium() ? '🌟 Características Premium:' : '✨ Características Free:'}
          </Text>
          
          {isFree() ? (
            <>
              <Text style={styles.feature}>• 1 receta aleatoria por día</Text>
              <Text style={styles.feature}>• Máximo 3 ingredientes</Text>
              <Text style={styles.feature}>• Recetas públicas</Text>
              <Text style={styles.feature}>• Favoritos básicos</Text>
            </>
          ) : (
            <>
              <Text style={styles.feature}>• Recetas ilimitadas</Text>
              <Text style={styles.feature}>• Hasta 10 ingredientes</Text>
              <Text style={styles.feature}>• Subir recetas propias</Text>
              <Text style={styles.feature}>• Comentar recetas</Text>
              <Text style={styles.feature}>• Favoritos ilimitados</Text>
            </>
          )}
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
  content: {
    padding: 20,
  },
  header: {
    backgroundColor: '#e48fb4',
    padding: 24,
    borderRadius: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    marginBottom: 8,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  mainButton: {
    backgroundColor: '#e48fb4',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  recipeButton: {
    backgroundColor: '#4CAF50',
  },
  mainButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  mainButtonSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  featureButton: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    width: '48%',
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  premiumButton: {
    backgroundColor: '#FFD700',
  },
  featureButtonIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  featureButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  featureButtonSubtext: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  features: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#e48fb4',
  },
  feature: {
    fontSize: 16,
    marginBottom: 8,
    color: '#666',
  },
});

