import React, { useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput } from 'react-native';

export default function NuevaReceta({ navigation }: any) {
  const [titulo, setTitulo] = useState('');
  const [ingredientes, setIngredientes] = useState('');
  const [instrucciones, setInstrucciones] = useState('');

  const handleGuardar = () => {
    console.log('Receta guardada:', { titulo, ingredientes, instrucciones });
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🍽️ Nueva Receta</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Título de la receta"
        value={titulo}
        onChangeText={setTitulo}
      />
      
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Ingredientes (uno por línea)"
        value={ingredientes}
        onChangeText={setIngredientes}
        multiline
        numberOfLines={6}
      />
      
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Instrucciones paso a paso"
        value={instrucciones}
        onChangeText={setInstrucciones}
        multiline
        numberOfLines={8}
      />
      
      <Button title="Guardar Receta" onPress={handleGuardar} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fef6f9',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#e48fb4',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 12,
    borderColor: '#e48fb4',
    borderWidth: 1,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
});