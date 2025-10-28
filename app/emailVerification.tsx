import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Linking,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { supabase } from '../lib/supabase';

export default function EmailVerificationScreen({ route, navigation }: any) {
  const { email } = route.params;
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Solo escuchar cambios en el estado de autenticación, no verificar automáticamente
  useEffect(() => {
    // Escuchar cambios en el estado de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email_confirmed_at);
        
        // Solo verificar si el usuario se acaba de registrar y confirmar
        if (event === 'SIGNED_IN' && session?.user?.email_confirmed_at) {
          setIsVerified(true);
          Alert.alert(
            '¡Email verificado! 🎉',
            'Tu cuenta ha sido verificada correctamente',
            [
              {
                text: 'Continuar',
                onPress: () => navigation.navigate('Inicio')
              }
            ]
          );
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleResend = async () => {
    setResendLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        setCountdown(60);
        Alert.alert(
          'Email reenviado 📧', 
          'Se ha enviado un nuevo enlace de confirmación a tu correo'
        );
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Ocurrió un error inesperado');
    } finally {
      setResendLoading(false);
    }
  };

  const handleOpenEmail = () => {
    Alert.alert(
      'Abrir correo',
      '¿Quieres abrir tu aplicación de correo para verificar el email?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Abrir', 
          onPress: () => {
            // Intentar abrir la app de correo
            Linking.openURL('mailto:');
          }
        }
      ]
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Text style={styles.title}>📧 Verifica tu Email</Text>
        <Text style={styles.subtitle}>
          Hemos enviado un enlace de confirmación a{'\n'}
          <Text style={styles.email}>{email}</Text>
        </Text>

        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>¿Qué hacer ahora?</Text>
          <Text style={styles.instructionsText}>
            1. Revisa tu correo electrónico{'\n'}
            2. Busca el email de "Sabor Veggie"{'\n'}
            3. Haz clic en el enlace de confirmación{'\n'}
            4. Regresa a la app y presiona "Ya verifiqué"
          </Text>
        </View>

        <TouchableOpacity
          style={styles.openEmailButton}
          onPress={handleOpenEmail}
        >
          <Text style={styles.openEmailButtonText}>📱 Abrir Correo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.verifyButton, isVerified && styles.verifyButtonSuccess]}
          onPress={async () => {
            setLoading(true);
            try {
              // Forzar una actualización de la sesión
              const { data: { session }, error } = await supabase.auth.getSession();
              
              if (error) {
                Alert.alert('Error', 'Error al verificar el estado de la sesión');
                return;
              }

              if (session?.user?.email_confirmed_at) {
                Alert.alert(
                  '¡Email verificado! 🎉',
                  'Tu cuenta ha sido verificada correctamente',
                  [
                    {
                      text: 'Continuar',
                      onPress: () => navigation.navigate('Inicio')
                    }
                  ]
                );
              } else {
                Alert.alert(
                  'Email no verificado',
                  'Por favor:\n\n1. Revisa tu correo (incluyendo spam)\n2. Haz clic en el enlace de confirmación\n3. Regresa a la app y presiona este botón nuevamente\n\nSi el enlace no funciona, presiona "Reenviar enlace"',
                  [
                    { text: 'Entendido', style: 'default' }
                  ]
                );
              }
            } catch (error) {
              Alert.alert('Error', 'Error al verificar el email');
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.verifyButtonText}>✅ Ya verifiqué mi email</Text>
          )}
        </TouchableOpacity>

        <View style={styles.resendContainer}>
          {countdown > 0 ? (
            <Text style={styles.countdownText}>
              Reenviar enlace en {countdown}s
            </Text>
          ) : (
            <TouchableOpacity
              onPress={handleResend}
              disabled={resendLoading}
              style={styles.resendButton}
            >
              {resendLoading ? (
                <ActivityIndicator size="small" color="#e48fb4" />
              ) : (
                <Text style={styles.resendButtonText}>Reenviar enlace</Text>
              )}
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Cambiar email</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fef6f9',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#e48fb4',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
    lineHeight: 22,
  },
  email: {
    fontWeight: 'bold',
    color: '#e48fb4',
  },
  instructionsContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  instructionsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  openEmailButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#e48fb4',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  openEmailButtonText: {
    color: '#e48fb4',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  verifyButton: {
    backgroundColor: '#e48fb4',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  verifyButtonSuccess: {
    backgroundColor: '#4CAF50',
  },
  verifyButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  countdownText: {
    color: '#999',
    fontSize: 16,
  },
  resendButton: {
    paddingVertical: 8,
  },
  resendButtonText: {
    color: '#e48fb4',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  backButtonText: {
    color: '#999',
    fontSize: 16,
  },
});

