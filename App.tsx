import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Linking from 'expo-linking';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import Dashboard from './app/Dashboard';
import EmailVerification from './app/emailVerification';
import NuevaReceta from './app/NuevaReceta';
import Profile from './app/ProfileScreen';
import RandomRecipeScreen from './app/RandomRecipeScreen';
import UnifiedLoginScreen from './app/UnifiedLoginScreen';
import { AuthManagerProvider, useAuthManager } from './components/AuthManager';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { user, loading, isInitialized } = useAuthManager();

  // Mostrar loading mientras se inicializa la autenticación
  if (!isInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fef6f9' }}>
        <Text style={{ fontSize: 18, color: '#E48FB4', fontWeight: 'bold' }}>Cargando...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{
          headerStyle: { backgroundColor: '#e48fb4' },
          headerTintColor: 'white'
        }}
      >
        {user ? (
          // Usuario autenticado - mostrar pantallas principales
          <>
            <Stack.Screen 
              name="Dashboard" 
              component={Dashboard}
              options={{ 
                title: 'Mi Cocina',
                headerLeft: () => null, // Deshabilitar botón de retroceso
                gestureEnabled: false // Deshabilitar gestos de retroceso
              }}
            />
            <Stack.Screen 
              name="NuevaReceta" 
              component={NuevaReceta}
              options={{ 
                title: 'Nueva Receta'
              }}
            />
            <Stack.Screen 
              name="Profile" 
              component={Profile}
              options={{ 
                title: 'Mi Perfil'
              }}
            />
            <Stack.Screen 
              name="RandomRecipe" 
              component={RandomRecipeScreen}
              options={{ 
                title: 'Receta del Día'
              }}
            />
            <Stack.Screen 
              name="EmailVerification" 
              component={EmailVerification} 
              options={{ 
                title: 'Verificar Email'
              }} 
            />
          </>
        ) : (
          // Usuario no autenticado - mostrar pantallas de login
          <>
            <Stack.Screen 
              name="Login" 
              component={UnifiedLoginScreen} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="EmailVerification" 
              component={EmailVerification} 
              options={{ 
                title: 'Verificar Email'
              }} 
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  useEffect(() => {
    // Manejar deep links de autenticación de forma más simple
    const handleDeepLink = async (event: { url: string }) => {
      const url = event.url;
      console.log('Deep link received:', url);
      
      // Solo procesar enlaces de autenticación
      if (url.includes('auth/callback') || url.includes('confirmation_token') || url.includes('access_token')) {
        console.log('Processing auth deep link...');
        // El AuthManager se encargará de actualizar el estado
      }
    };

    // Escuchar deep links cuando la app está abierta
    const subscription = Linking.addEventListener('url', handleDeepLink);

    // Verificar si la app se abrió con un deep link
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    return () => {
      subscription?.remove();
    };
  }, []);

  return (
    <AuthManagerProvider>
      <AppNavigator />
    </AuthManagerProvider>
  );
}
