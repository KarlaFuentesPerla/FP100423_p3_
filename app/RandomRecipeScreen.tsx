import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useFavorites } from '../hooks/useFavorites';
import { useProfile } from '../hooks/useProfile';
import { useRandomRecipe } from '../hooks/useRandomRecipe';

export default function RandomRecipeScreen({ navigation }: any) {
  const {
    randomRecipe,
    userIngredients,
    availableIngredients,
    matchingRecipes,
    loading,
    searchLoading,
    error,
    ingredientsLoaded,
    generateRandomRecipe,
    addIngredient,
    removeIngredient,
    searchRecipesByIngredients,
    getMaxIngredients,
    canAddMoreIngredients,
    isPremium,
    isFree,
    setRandomRecipe
  } = useRandomRecipe();


  const { isFavorite, toggleFavorite } = useFavorites();
  const { profile } = useProfile();
  const [showIngredientsModal, setShowIngredientsModal] = useState(false);

  const handleGenerateRecipe = async () => {
    // Si hay ingredientes seleccionados, generar receta aleatoria de las coincidencias
    if (userIngredients.length > 0 && matchingRecipes.length > 0) {
      // Seleccionar una receta aleatoria de las que coinciden con los ingredientes
      const randomIndex = Math.floor(Math.random() * matchingRecipes.length);
      const selectedRecipe = matchingRecipes[randomIndex];
      
      // Transformar la receta al formato esperado por randomRecipe
      const transformedRecipe = {
        id: selectedRecipe.id,
        title: selectedRecipe.title,
        description: selectedRecipe.description,
        ingredients: selectedRecipe.ingredients,
        instructions: selectedRecipe.instructions,
        prep_time: selectedRecipe.prep_time,
        cook_time: selectedRecipe.cook_time,
        servings: selectedRecipe.servings,
        difficulty: selectedRecipe.difficulty,
        is_public: selectedRecipe.is_public,
        user_id: selectedRecipe.user_id,
        created_at: selectedRecipe.created_at
      };
      
      // Establecer la receta aleatoria
      setRandomRecipe(transformedRecipe);
    } else if (userIngredients.length === 0) {
      Alert.alert(
        'Selecciona ingredientes primero',
        'Para generar una receta aleatoria, primero selecciona algunos ingredientes.'
      );
    } else {
      Alert.alert(
        'No hay recetas disponibles',
        'No se encontraron recetas con los ingredientes seleccionados.'
      );
    }
  };

  const handleToggleFavorite = async () => {
    if (!randomRecipe) return;
    
    const success = await toggleFavorite(randomRecipe.id);
    if (success) {
      Alert.alert(
        'Favorito actualizado',
        isFavorite(randomRecipe.id) ? 'Receta eliminada de favoritos' : 'Receta agregada a favoritos'
      );
    }
  };

  const handleAddIngredient = async (ingredientId: number) => {
    if (!canAddMoreIngredients()) {
      Alert.alert(
        'Límite alcanzado',
        `Los usuarios ${isFree() ? 'Free' : 'Premium'} pueden tener máximo ${getMaxIngredients()} ingredientes.`
      );
      return;
    }

    const success = await addIngredient(ingredientId);
    if (success) {
      Alert.alert('Ingrediente agregado', 'El ingrediente se ha agregado a tu lista');
    }
  };

  const handleRemoveIngredient = async (ingredientId: string) => {
    const success = await removeIngredient(ingredientId);
    if (success) {
      Alert.alert('Ingrediente eliminado', 'El ingrediente se ha eliminado de tu lista');
    }
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'hard': return '#F44336';
      default: return '#666';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Fácil';
      case 'medium': return 'Intermedio';
      case 'hard': return 'Difícil';
      default: return difficulty;
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>🍀 Receta del Día</Text>
      <Text style={styles.subtitle}>
        {isFree() 
          ? 'Receta con máximo 3 ingredientes' 
          : 'Receta con hasta 10 ingredientes'
        }
      </Text>
    </View>
  );

  const renderIngredientsSection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>🥬 Mis Ingredientes</Text>
        <Text style={styles.ingredientCount}>
          {userIngredients.length}/{getMaxIngredients()}
        </Text>
      </View>
      
      {userIngredients.length === 0 ? (
        <Text style={styles.emptyText}>No tienes ingredientes seleccionados</Text>
      ) : (
        <View style={styles.ingredientsList}>
          {userIngredients.map((ingredient) => (
            <TouchableOpacity
              key={ingredient.id}
              style={styles.ingredientChip}
              onPress={() => handleRemoveIngredient(ingredient.id)}
            >
              <Text style={styles.ingredientChipText}>{ingredient.name}</Text>
              <Text style={styles.removeIcon}>×</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <TouchableOpacity
        style={styles.addIngredientButton}
        onPress={() => setShowIngredientsModal(true)}
      >
        <Text style={styles.addIngredientButtonText}>
          {canAddMoreIngredients() ? '+ Agregar Ingrediente' : 'Límite alcanzado'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderPremiumMessage = () => (
    <TouchableOpacity style={styles.premiumCard}>
      <View style={styles.premiumCardContent}>
        <Text style={styles.premiumIcon}>👑</Text>
        <Text style={styles.premiumTitle}>¡Desbloquea Premium!</Text>
        <Text style={styles.premiumDescription}>
          Ve más recetas y accede a contenido exclusivo
        </Text>
        <Text style={styles.premiumSubtext}>
          +10 ingredientes • Recetas ilimitadas • Sin anuncios
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderMatchingRecipes = () => {
    console.log('renderMatchingRecipes - userIngredients:', userIngredients.length, 'matchingRecipes:', matchingRecipes.length);
    if (userIngredients.length === 0) return null;
    
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🍽️ Recetas con tus ingredientes</Text>
          {searchLoading && <ActivityIndicator size="small" color="#e48fb4" />}
        </View>
        
        {matchingRecipes.length === 0 && !searchLoading ? (
          <Text style={styles.emptyText}>
            No se encontraron recetas con los ingredientes seleccionados
          </Text>
        ) : (
          <View>
            {matchingRecipes.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.recipeCard}
                onPress={() => {
                  Alert.alert(item.title, item.description);
                }}
              >
                <View style={styles.recipeCardHeader}>
                  <Text style={styles.recipeCardTitle}>{item.title}</Text>
                  <TouchableOpacity
                    style={styles.recipeFavoriteButton}
                    onPress={() => toggleFavorite(item.id)}
                  >
                    <Text style={styles.recipeFavoriteButtonText}>
                      {isFavorite(item.id) ? '❤️' : '🤍'}
                    </Text>
                  </TouchableOpacity>
                </View>
                
                <Text style={styles.recipeCardDescription} numberOfLines={2}>
                  {item.description}
                </Text>
                
                <View style={styles.recipeCardInfo}>
                  <Text style={styles.recipeCardIngredientCount}>
                    {item.ingredients.length} ingredientes
                  </Text>
                  <Text style={styles.recipeCardTime}>
                    {item.prep_time + item.cook_time} min
                  </Text>
                </View>
                
                <View style={styles.recipeCardIngredients}>
                  {item.ingredients.slice(0, 3).map((ingredient, index) => (
                    <Text key={index} style={styles.recipeCardIngredient}>
                      • {ingredient}
                    </Text>
                  ))}
                  {item.ingredients.length > 3 && (
                    <Text style={styles.recipeCardMore}>
                      +{item.ingredients.length - 3} más...
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
            
            {/* Mostrar mensaje de Premium si es usuario Free y hay más de 3 recetas */}
            {isFree() && matchingRecipes.length === 3 && (
              renderPremiumMessage()
            )}
          </View>
        )}
      </View>
    );
  };

  const renderGenerateButton = () => (
    <TouchableOpacity
      style={[styles.generateButton, loading && styles.generateButtonDisabled]}
      onPress={handleGenerateRecipe}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text style={styles.generateButtonText}>
          🎲 {userIngredients.length > 0 ? 'Receta Aleatoria de Mis Ingredientes' : 'Generar Receta Aleatoria'}
        </Text>
      )}
    </TouchableOpacity>
  );

  const renderRandomRecipe = () => {
    if (!randomRecipe) return null;
    
    return (
      <View style={styles.recipeContainer}>
        <View style={styles.recipeHeader}>
          <Text style={styles.recipeTitle}>{randomRecipe.title}</Text>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={handleToggleFavorite}
          >
            <Text style={styles.favoriteButtonText}>
              {isFavorite(randomRecipe.id) ? '❤️' : '🤍'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.recipeDescription}>{randomRecipe.description}</Text>

        <View style={styles.recipeInfo}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>⏱️ Prep</Text>
            <Text style={styles.infoValue}>{formatTime(randomRecipe.prep_time)}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>🔥 Cocción</Text>
            <Text style={styles.infoValue}>{formatTime(randomRecipe.cook_time)}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>👥 Porciones</Text>
            <Text style={styles.infoValue}>{randomRecipe.servings}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>📊 Dificultad</Text>
            <Text style={[styles.infoValue, { color: getDifficultyColor(randomRecipe.difficulty) }]}>
              {getDifficultyText(randomRecipe.difficulty)}
            </Text>
          </View>
        </View>

        <View style={styles.ingredientsSection}>
          <Text style={styles.sectionTitle}>🥘 Ingredientes</Text>
          {randomRecipe.ingredients.map((ingredient, index) => (
            <Text key={index} style={styles.ingredientItem}>
              • {ingredient}
            </Text>
          ))}
        </View>

        <View style={styles.instructionsSection}>
          <Text style={styles.sectionTitle}>👨‍🍳 Instrucciones</Text>
          {randomRecipe.instructions.map((instruction, index) => (
            <View key={index} style={styles.instructionItem}>
              <Text style={styles.instructionNumber}>{index + 1}</Text>
              <Text style={styles.instructionText}>{instruction}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderError = () => {
    if (!error) return null;
    
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  };

  const renderModal = () => (
    <Modal
      visible={showIngredientsModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Agregar Ingredientes</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowIngredientsModal(false)}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.ingredientsContainer}>
          <Text style={styles.ingredientsCount}>
            {availableIngredients.length} ingredientes disponibles
          </Text>
          
          <ScrollView style={styles.ingredientsScrollView}>
            {availableIngredients.map((ingredient, index) => {
              const isSelected = userIngredients.some(ui => ui.id === ingredient.id);
              const canSelect = !isSelected && canAddMoreIngredients();

              return (
                <TouchableOpacity
                  key={ingredient.id}
                  style={[
                    styles.ingredientItem,
                    isSelected && styles.ingredientItemSelected,
                    !canSelect && styles.ingredientItemDisabled
                  ]}
                  onPress={() => canSelect && handleAddIngredient(ingredient.id)}
                  disabled={!canSelect}
                >
                  <Text style={[
                    styles.ingredientItemText,
                    isSelected && styles.ingredientItemTextSelected,
                    !canSelect && styles.ingredientItemTextDisabled
                  ]}>
                    {ingredient.name}
                  </Text>
                  {isSelected && <Text style={styles.ingredientCheckmark}>✓</Text>}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {renderHeader()}
      {renderIngredientsSection()}
      {renderMatchingRecipes()}
      {renderError()}
      {renderRandomRecipe()}
      {renderGenerateButton()}
      {renderModal()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fef6f9',
  },
  header: {
    backgroundColor: '#e48fb4',
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  section: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  ingredientCount: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
  ingredientChip: {
    backgroundColor: '#e48fb4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ingredientChipText: {
    color: 'white',
    fontSize: 14,
    marginRight: 4,
  },
  removeIcon: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addIngredientButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addIngredientButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  generateButton: {
    backgroundColor: '#e48fb4',
    margin: 16,
    marginBottom: 40,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  generateButtonDisabled: {
    backgroundColor: '#f0a8c4',
  },
  generateButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  errorText: {
    color: '#c62828',
    fontSize: 16,
  },
  recipeContainer: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recipeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  recipeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 12,
  },
  favoriteButton: {
    padding: 8,
  },
  favoriteButtonText: {
    fontSize: 24,
  },
  recipeDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    lineHeight: 24,
  },
  recipeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingVertical: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  ingredientsSection: {
    marginBottom: 20,
  },
  instructionsSection: {
    marginBottom: 20,
  },
  ingredientItem: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    paddingLeft: 8,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  instructionNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e48fb4',
    marginRight: 12,
    minWidth: 24,
  },
  instructionText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    lineHeight: 24,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
  },
  recipeCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#e48fb4',
  },
  recipeCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  recipeCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 12,
  },
  recipeFavoriteButton: {
    padding: 4,
  },
  recipeFavoriteButtonText: {
    fontSize: 20,
  },
  recipeCardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  recipeCardInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  recipeCardIngredientCount: {
    fontSize: 12,
    color: '#e48fb4',
    fontWeight: '600',
  },
  recipeCardTime: {
    fontSize: 12,
    color: '#666',
  },
  recipeCardIngredients: {
    marginTop: 4,
  },
  recipeCardIngredient: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  recipeCardMore: {
    fontSize: 12,
    color: '#e48fb4',
    fontStyle: 'italic',
    marginTop: 4,
  },
  ingredientsContainer: {
    flex: 1,
    padding: 16,
  },
  ingredientsCount: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '600',
  },
  ingredientsScrollView: {
    flex: 1,
  },
  ingredientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  ingredientItemSelected: {
    backgroundColor: '#e8f5e8',
  },
  ingredientItemDisabled: {
    backgroundColor: '#f5f5f5',
  },
  ingredientItemText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  ingredientItemTextSelected: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  ingredientItemTextDisabled: {
    color: '#ccc',
  },
  ingredientCheckmark: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  premiumCard: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  premiumCardContent: {
    padding: 20,
    alignItems: 'center',
  },
  premiumIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  premiumTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 8,
    textAlign: 'center',
  },
  premiumDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 22,
  },
  premiumSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
