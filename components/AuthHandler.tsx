import * as Linking from 'expo-linking';
import { useEffect } from 'react';
import { useAuthManager } from './AuthManager';

export default function AuthHandler() {
  const { refreshSession } = useAuthManager();

  useEffect(() => {
    // Manejar deep links cuando la app se abre desde un enlace
    const handleDeepLink = (url: string) => {
      console.log('Deep link recibido:', url);
      
      // Verificar si es un enlace de autenticación de Supabase
      if (url.includes('#access_token=') || url.includes('#error=')) {
        console.log('Procesando enlace de autenticación...');
        
        // Forzar actualización de la sesión
        refreshSession();
      }
    };

    // Escuchar enlaces cuando la app está abierta
    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    // Manejar enlaces cuando la app se abre desde un estado cerrado
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink(url);
      }
    });

    return () => {
      subscription?.remove();
    };
  }, [refreshSession]);

  return null; // Este componente no renderiza nada
}