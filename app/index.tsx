import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recetas Veggies 🍃💚</Text>
      <Text style={styles.subtitle}>¡Bienvenida a tu app de recetas vegetarianas!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f6f6f6',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3c9a5f',
  },
  subtitle: {
    fontSize: 18,
    marginTop: 10,
    color: '#666',
  },
});
