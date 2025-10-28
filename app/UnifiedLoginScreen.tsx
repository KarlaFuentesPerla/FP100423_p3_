import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useAuthManager } from '../components/AuthManager';

export default function UnifiedLoginScreen({ navigation }: any) {
  const { signInWithEmail, signInWithOtp, loading: authLoading } = useAuthManager();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const handleAuth = async () => {
    if (!email) {
      Alert.alert('Error', 'Por favor ingresa tu correo electrónico');
      return;
    }

    setLoading(true);
    try {
      if (isRegister) {
        // Registro con OTP
        const redirectTo = Linking.createURL('/auth/callback');
        const { error } = await signInWithOtp(email);

        if (error) {
          Alert.alert('Error', error.message);
        } else {
          Alert.alert(
            '¡Registro exitoso! 🎉',
            'Te enviamos un correo de confirmación 🌸\n\nHaz clic en el enlace para activar tu cuenta.',
            [
              {
                text: 'Entendido',
                onPress: () => navigation.navigate('EmailVerification', { email })
              }
            ]
          );
        }
      } else {
        // Login con contraseña
        if (!password) {
          Alert.alert('Error', 'Por favor ingresa tu contraseña');
          return;
        }

        const { error } = await signInWithEmail(email, password);

        if (error) {
          Alert.alert('Error', error.message);
        } else {
          // La navegación se manejará automáticamente por el AppNavigator
          console.log('Login exitoso, navegando automáticamente...');
        }
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Ocurrió un error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const redirectTo = Linking.createURL('/auth/callback');
      console.log('Google OAuth redirectTo:', redirectTo);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });

      if (error) {
        console.error('Google OAuth error:', error);
        Alert.alert('Error', error.message);
        return;
      }

      if (data.url) {
        console.log('Opening Google OAuth URL:', data.url);
        
        // Abrir el navegador para autenticación
        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          redirectTo,
          {
            showInRecents: true,
          }
        );

        console.log('Google OAuth result:', result);

        if (result.type === 'success') {
          // La autenticación fue exitosa
          console.log('Google OAuth success, checking session...');
          
          // Verificar la sesión después de un breve delay
          setTimeout(async () => {
            const { data: sessionData } = await supabase.auth.getSession();
            if (sessionData.session) {
              Alert.alert('¡Éxito!', 'Has iniciado sesión con Google');
              navigation.navigate('Dashboard');
            } else {
              Alert.alert('Error', 'No se pudo establecer la sesión');
            }
          }, 1000);
        } else if (result.type === 'cancel') {
          console.log('Google OAuth cancelled by user');
        } else {
          console.log('Google OAuth failed:', result);
          Alert.alert('Error', 'No se pudo completar la autenticación con Google');
        }
      } else {
        Alert.alert('Error', 'No se pudo obtener la URL de autenticación');
      }
    } catch (error: any) {
      console.error('Google OAuth exception:', error);
      Alert.alert('Error', error.message || 'Ocurrió un error inesperado');
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Por favor ingresa tu correo electrónico primero');
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert(
          'Email enviado 📧',
          'Se ha enviado un enlace para restablecer tu contraseña a tu correo electrónico'
        );
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Ocurrió un error inesperado');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>🍃 Sabor Veggie</Text>
          <Text style={styles.subtitle}>
            {isRegister ? 'Únete a la comunidad veggie' : 'Inicia sesión para acceder a tus recetas'}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          {!isRegister && (
            <TouchableOpacity
              style={styles.forgotPasswordButton}
              onPress={handleForgotPassword}
            >
              <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.authButton, loading && styles.authButtonDisabled]}
            onPress={handleAuth}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.authButtonText}>
                {isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'}
              </Text>
            )}
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>o</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleSignIn}
          >
            <Text style={styles.googleButtonText}>🔍 Continuar con Google</Text>
          </TouchableOpacity>

          <View style={styles.toggleContainer}>
            <Text style={styles.toggleText}>
              {isRegister ? '¿Ya tienes cuenta? ' : '¿No tienes cuenta? '}
            </Text>
            <TouchableOpacity onPress={() => setIsRegister(!isRegister)}>
              <Text style={styles.toggleLink}>
                {isRegister ? 'Iniciar Sesión' : 'Regístrate'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fef6f9',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#e48fb4',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: '#999',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#e48fb4',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    color: '#333',
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#e48fb4',
    fontSize: 14,
  },
  authButton: {
    backgroundColor: '#e48fb4',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  authButtonDisabled: {
    backgroundColor: '#f0a8c4',
  },
  authButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 16,
    color: '#666',
  },
  toggleLink: {
    fontSize: 16,
    color: '#e48fb4',
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#999',
    fontSize: 16,
  },
  googleButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  googleButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
