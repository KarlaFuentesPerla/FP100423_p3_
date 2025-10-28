import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function AuthHandler() {
  const router = useRouter();

  useEffect(() => {
    // Manejar deep links de autenticación
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          return;
        }

        if (data.session) {
          // Usuario autenticado, navegar al inicio
          router.replace('/Inicio');
        }
      } catch (error) {
        console.error('Error handling auth callback:', error);
      }
    };

    // Verificar si hay una sesión activa al cargar
    handleAuthCallback();

    // Escuchar cambios en el estado de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          router.replace('/Inicio');
        } else if (event === 'SIGNED_OUT') {
          router.replace('/Login');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  return null;
}
