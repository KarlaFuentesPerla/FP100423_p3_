# 🔧 Configuración de Supabase para Expo

## Pasos para configurar Supabase correctamente:

### 1. **Configurar Email Auth en Supabase Dashboard**

1. Ve a [supabase.com](https://supabase.com) y entra a tu proyecto
2. Ve a **Authentication** → **Settings** → **Auth**
3. En la sección **Email Auth**, asegúrate de que esté habilitado:
   - ✅ Enable email confirmations
   - ✅ Enable email change confirmations

### 2. **Configurar Site URL**

1. En **Authentication** → **Settings** → **URL Configuration**
2. Agrega estas URLs:
   - **Site URL**: `exp://127.0.0.1:8081`
   - **Redirect URLs**: 
     - `exp://127.0.0.1:8081/--/auth/callback`
     - `exp://192.168.0.20:8085/--/auth/callback` (para tu IP local)

### 3. **Configurar Google OAuth (Opcional)**

1. Ve a **Authentication** → **Providers** → **Google**
2. Habilita Google OAuth
3. Necesitarás:
   - **Client ID** de Google Console
   - **Client Secret** de Google Console

### 4. **Configurar Email Templates**

1. Ve a **Authentication** → **Email Templates**
2. Personaliza el template de confirmación de email
3. Asegúrate de que el enlace de confirmación funcione

### 5. **Verificar Configuración**

1. Ve a **Authentication** → **Users**
2. Intenta crear un usuario de prueba
3. Verifica que llegue el email de confirmación

## 🚨 **Problemas Comunes:**

### **Email no llega:**
- Verifica la carpeta de spam
- Revisa que el email esté habilitado en Supabase
- Verifica que la URL del sitio esté configurada

### **Google OAuth no funciona:**
- Verifica que las URLs de redirección estén configuradas
- Asegúrate de que Google OAuth esté habilitado
- Verifica las credenciales de Google

### **"This site can't be reached":**
- Verifica que la URL de redirección sea correcta
- Asegúrate de que Expo esté corriendo en el puerto correcto

## 📱 **Para probar:**

1. **Registro con email**: Debería enviar código de verificación
2. **Login con email**: Debería funcionar sin verificación
3. **Google OAuth**: Debería abrir navegador y redirigir

## 🔧 **Si nada funciona:**

Puedes usar solo autenticación con email/contraseña sin verificación:
1. Ve a **Authentication** → **Settings** → **Auth**
2. Deshabilita "Enable email confirmations"
3. Los usuarios podrán registrarse sin verificación



