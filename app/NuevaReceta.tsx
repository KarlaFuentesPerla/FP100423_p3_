import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useAuthManager } from '../components/AuthManager';
import { supabase } from '../lib/supabase';

export default function NuevaReceta({ navigation }: any) {
  const { user } = useAuthManager();
  const [titulo, setTitulo] = useState('');
  const [ingredientes, setIngredientes] = useState('');
  const [instrucciones, setInstrucciones] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGuardar = async () => {
    if (!user) {
      Alert.alert('Error', 'Debes estar autenticado para crear recetas');
      return;
    }

    if (!titulo.trim() || !ingredientes.trim() || !instrucciones.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
      return;
    }

    setLoading(true);
    try {
      // Crear la receta en la base de datos
      const { data: recipeData, error: recipeError } = await supabase
        .from('recipes')
        .insert({
          user_id: user.id,
          title: titulo.trim(),
          description: descripcion.trim() || 'Receta creada por el usuario',
          steps: instrucciones.trim(),
          is_public: true
        })
        .select()
        .single();

      if (recipeError) {
        console.error('Error creando receta:', recipeError);
        Alert.alert('Error', 'No se pudo crear la receta. Inténtalo de nuevo.');
        return;
      }

      // Procesar ingredientes
      const ingredientesList = ingredientes
        .split('\n')
        .map(ing => ing.trim())
        .filter(ing => ing.length > 0);

      if (ingredientesList.length > 0) {
        // Obtener o crear ingredientes
        const ingredientesData = [];
        for (const ingrediente of ingredientesList) {
          // Buscar si el ingrediente ya existe
          const { data: existingIngredient } = await supabase
            .from('ingredients')
            .select('id')
            .eq('name', ingrediente)
            .single();

          let ingredientId;
          if (existingIngredient) {
            ingredientId = existingIngredient.id;
          } else {
            // Crear nuevo ingrediente
            const { data: newIngredient, error: newIngredientError } = await supabase
              .from('ingredients')
              .insert({ name: ingrediente })
              .select()
              .single();

            if (newIngredientError) {
              console.error('Error creando ingrediente:', newIngredientError);
              continue;
            }
            ingredientId = newIngredient.id;
          }

          ingredientesData.push({
            recipe_id: recipeData.id,
            ingredient_id: ingredientId,
            quantity: '1' // Cantidad por defecto
          });
        }

        // Insertar relaciones receta-ingrediente
        if (ingredientesData.length > 0) {
          const { error: relationError } = await supabase
            .from('recipe_ingredients')
            .insert(ingredientesData);

          if (relationError) {
            console.error('Error creando relaciones:', relationError);
          }
        }
      }

      Alert.alert(
        '¡Receta creada! 🎉',
        'Tu receta ha sido guardada exitosamente y aparecerá en tu perfil.',
        [
          {
            text: 'Ver en Perfil',
            onPress: () => navigation.navigate('Profile')
          },
          {
            text: 'Crear Otra',
            onPress: () => {
              setTitulo('');
              setIngredientes('');
              setInstrucciones('');
              setDescripcion('');
            }
          }
        ]
      );

    } catch (error: any) {
      console.error('Error inesperado:', error);
      Alert.alert('Error', 'Ocurrió un error inesperado. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
      <Text style={styles.title}>🍽️ Nueva Receta</Text>
        <Text style={styles.subtitle}>Comparte tu creatividad culinaria</Text>
      </View>
      
      <View style={styles.form}>
        <Text style={styles.label}>Título de la receta *</Text>
      <TextInput
        style={styles.input}
          placeholder="Ej: Ensalada de quinoa con aguacate"
        value={titulo}
        onChangeText={setTitulo}
      />
      
        <Text style={styles.label}>Descripción (opcional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe brevemente tu receta..."
          value={descripcion}
          onChangeText={setDescripcion}
          multiline
          numberOfLines={3}
        />
        
        <Text style={styles.label}>Ingredientes *</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
          placeholder="Escribe cada ingrediente en una línea separada:&#10;Quinoa&#10;Aguacate&#10;Tomate&#10;Limón"
        value={ingredientes}
        onChangeText={setIngredientes}
        multiline
        numberOfLines={6}
      />
      
        <Text style={styles.label}>Instrucciones paso a paso *</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
          placeholder="Describe cómo preparar la receta paso a paso..."
        value={instrucciones}
        onChangeText={setInstrucciones}
        multiline
        numberOfLines={8}
      />
      
        <TouchableOpacity 
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleGuardar}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.saveButtonText}>💾 Guardar Receta</Text>
          )}
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
  header: {
    backgroundColor: '#e48fb4',
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 2,
    borderColor: '#e48fb4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    backgroundColor: 'white',
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#e48fb4',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 40,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  saveButtonDisabled: {
    backgroundColor: '#f0a8c4',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});