import React, { useState } from 'react'
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
    View,
} from 'react-native'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export default function LoginScreen({ navigation }: any) {
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone')
  const { signInWithPhone } = useAuth()

  const formatPhoneNumber = (text: string) => {
    // Remover todos los caracteres no numéricos
    const cleaned = text.replace(/\D/g, '')
    
    // Formatear como +52 123 456 7890
    if (cleaned.length <= 2) {
      return cleaned
    } else if (cleaned.length <= 5) {
      return `+${cleaned.slice(0, 2)} ${cleaned.slice(2)}`
    } else if (cleaned.length <= 8) {
      return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5)}`
    } else {
      return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8, 12)}`
    }
  }

  const handlePhoneChange = (text: string) => {
    const formatted = formatPhoneNumber(text)
    setPhone(formatted)
  }

  const sendOtpByPhone = async () => {
    if (!phone) {
      return Alert.alert('Teléfono requerido', 'Ingresa tu número de teléfono para recibir el código.')
    }
    
    const cleanPhone = phone.replace(/\D/g, '')
    if (cleanPhone.length < 10) {
      return Alert.alert('Teléfono inválido', 'Ingresa un número de teléfono válido.')
    }

    setLoading(true)
    const { error } = await signInWithPhone(`+${cleanPhone}`)
    setLoading(false)

    if (error) {
      Alert.alert('Error', error.message)
    } else {
      navigation.navigate('OTPVerification', { phone: `+${cleanPhone}` })
    }
  }

  const sendOtpByEmail = async () => {
    if (!email) {
      return Alert.alert('Correo requerido', 'Ingresa tu correo para recibir el código.')
    }
    
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({ email })
    setLoading(false)
    
    if (error) {
      Alert.alert('Error', error.message)
    } else {
      Alert.alert('Código enviado 💌', 'Revisa tu correo electrónico para el código de verificación.')
    }
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>🍃 Recetas Vegetarianas</Text>
          <Text style={styles.subtitle}>Inicia sesión para acceder a recetas deliciosas</Text>

          {/* Selector de método de autenticación */}
          <View style={styles.authMethodSelector}>
            <TouchableOpacity
              style={[
                styles.methodButton,
                authMethod === 'phone' && styles.methodButtonActive
              ]}
              onPress={() => setAuthMethod('phone')}
            >
              <Text style={[
                styles.methodButtonText,
                authMethod === 'phone' && styles.methodButtonTextActive
              ]}>
                📱 Teléfono
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.methodButton,
                authMethod === 'email' && styles.methodButtonActive
              ]}
              onPress={() => setAuthMethod('email')}
            >
              <Text style={[
                styles.methodButtonText,
                authMethod === 'email' && styles.methodButtonTextActive
              ]}>
                📧 Email
              </Text>
            </TouchableOpacity>
          </View>

          {authMethod === 'phone' ? (
            <>
              <TextInput
                placeholder="+52 123 456 7890"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={handlePhoneChange}
                style={styles.input}
                maxLength={18}
              />
              <TouchableOpacity
                style={[styles.sendButton, loading && styles.sendButtonDisabled]}
                onPress={sendOtpByPhone}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.sendButtonText}>Enviar código por SMS</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TextInput
                placeholder="tu@email.com"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                style={styles.input}
              />
              <TouchableOpacity
                style={[styles.sendButton, loading && styles.sendButtonDisabled]}
                onPress={sendOtpByEmail}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.sendButtonText}>Enviar código por email</Text>
                )}
              </TouchableOpacity>
            </>
          )}

          <Text style={styles.privacyText}>
            Al continuar, aceptas nuestros términos de servicio y política de privacidad
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: '#7f8c8d',
  },
  authMethodSelector: {
    flexDirection: 'row',
    backgroundColor: '#e9ecef',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  methodButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  methodButtonActive: {
    backgroundColor: '#4CAF50',
  },
  methodButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6c757d',
  },
  methodButtonTextActive: {
    color: 'white',
  },
  input: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: 'white',
    marginBottom: 16,
  },
  sendButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  sendButtonDisabled: {
    backgroundColor: '#a5d6a7',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  privacyText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#7f8c8d',
    lineHeight: 18,
  },
})
