# 🍃 Recetas Vegetarianas - Configuración OTP

## Configuración de Supabase

### 1. Crear proyecto en Supabase
1. Ve a [supabase.com](https://supabase.com)
2. Crea una nueva cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Espera a que se complete la configuración

### 2. Configurar autenticación por teléfono
1. En el dashboard de Supabase, ve a **Authentication** > **Settings**
2. En la sección **Phone Auth**, habilita:
   - ✅ Enable phone confirmations
   - ✅ Enable phone change confirmations
3. Configura tu proveedor SMS (Twilio recomendado):
   - Ve a **Authentication** > **Settings** > **Phone Auth**
   - Agrega tu configuración de Twilio

### 3. Configurar variables de entorno
1. Copia `env.example` a `.env`
2. Agrega tus credenciales de Supabase:
```bash
EXPO_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anonima-aqui
```

### 4. Configurar Twilio (opcional pero recomendado)
1. Crea una cuenta en [Twilio](https://twilio.com)
2. Obtén tu Account SID y Auth Token
3. En Supabase, ve a **Authentication** > **Settings** > **Phone Auth**
4. Configura Twilio con tus credenciales

## Funcionalidades implementadas

### ✅ Autenticación OTP
- **Por teléfono**: Envío de código SMS
- **Por email**: Envío de código por correo
- **Verificación**: Pantalla de 6 dígitos con auto-focus
- **Reenvío**: Función para reenviar código con countdown

### ✅ Navegación
- **Flujo condicional**: Login → OTP → Dashboard
- **Estado persistente**: Mantiene sesión del usuario
- **Logout**: Función para cerrar sesión

### ✅ UI/UX
- **Diseño moderno**: Interfaz limpia y atractiva
- **Responsive**: Adaptado para móviles
- **Loading states**: Indicadores de carga
- **Error handling**: Manejo de errores con alertas

## Estructura del proyecto

```
├── contexts/
│   └── AuthContext.tsx          # Contexto de autenticación
├── screens/
│   ├── LoginScreen.tsx          # Pantalla de login
│   └── OTPVerificationScreen.tsx # Verificación OTP
├── navigation/
│   └── AppNavigator.tsx         # Navegación principal
├── lib/
│   └── supabase.ts              # Configuración Supabase
└── app/
    └── dashboard.tsx            # Dashboard principal
```

## Comandos útiles

```bash
# Instalar dependencias
npm install

# Iniciar en desarrollo
npm start

# Ejecutar en Android
npm run android

# Ejecutar en iOS
npm run ios
```

## Próximos pasos

1. **Configurar base de datos**: Crear tablas para recetas
2. **Implementar CRUD**: Agregar, editar, eliminar recetas
3. **Subir imágenes**: Integrar almacenamiento de imágenes
4. **Notificaciones**: Push notifications para nuevas recetas
5. **Offline**: Sincronización offline con Supabase

## Troubleshooting

### Error: "Invalid phone number"
- Asegúrate de incluir el código de país (+52 para México)
- Verifica que el número tenga al menos 10 dígitos

### Error: "OTP not sent"
- Verifica tu configuración de Twilio
- Revisa los logs en Supabase Dashboard
- Asegúrate de que la autenticación por teléfono esté habilitada

### Error: "Session not found"
- Verifica que las variables de entorno estén configuradas
- Reinicia la aplicación después de cambiar las variables

