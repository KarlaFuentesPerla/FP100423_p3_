# 🔧 Configuración CORREGIDA de Supabase para Expo

## ✅ **SOLUCIÓN RÁPIDA - Sigue estos pasos:**

### 1. **Configurar Email Auth en Supabase Dashboard**

1. Ve a [supabase.com](https://supabase.com) y entra a tu proyecto
2. Ve a **Authentication** → **Settings** → **Auth**
3. En la sección **Email Auth**, configura:
   - ✅ **Enable email confirmations** (HABILITADO)
   - ✅ **Enable email change confirmations** (HABILITADO)
   - **Email confirmation URL**: `exp://127.0.0.1:8081/--/auth/callback`

### 2. **Configurar Site URL (MUY IMPORTANTE)**

1. En **Authentication** → **Settings** → **URL Configuration**
2. Configura estas URLs EXACTAMENTE así:
   - **Site URL**: `exp://127.0.0.1:8081`
   - **Redirect URLs**: 
     - `exp://127.0.0.1:8081/--/auth/callback`
     - `exp://192.168.0.20:8085/--/auth/callback` (reemplaza con tu IP local)

### 3. **Configurar Google OAuth (Para que aparezca el botón)**

1. Ve a **Authentication** → **Providers** → **Google**
2. **HABILITA** Google OAuth
3. Configura:
   - **Client ID**: (necesitas crear uno en Google Console)
   - **Client Secret**: (necesitas crear uno en Google Console)
   - **Redirect URL**: `https://askippbttqmzldbvtiij.supabase.co/auth/v1/callback`

### 4. **Configurar Email Templates**

1. Ve a **Authentication** → **Email Templates**
2. En **Confirm signup**, personaliza:
   - **Subject**: "Confirma tu cuenta en Sabor Veggie"
   - **Body**: Incluye el enlace de confirmación
3. Asegúrate de que el enlace sea: `{{ .ConfirmationURL }}`

### 5. **Verificar Configuración de Email**

1. Ve a **Authentication** → **Settings** → **SMTP Settings**
2. Asegúrate de que esté configurado un proveedor de email
3. Si no tienes uno, usa el de Supabase (puede ir a spam)

## 🚨 **PROBLEMAS COMUNES Y SOLUCIONES:**

### **❌ "No aparece el botón de Google"**
- **Causa**: Google OAuth no está habilitado en Supabase
- **Solución**: Ve a Authentication → Providers → Google y habilítalo

### **❌ "No llega el email de verificación"**
- **Causa 1**: URLs mal configuradas
- **Solución**: Verifica que Site URL sea `exp://127.0.0.1:8081`
- **Causa 2**: Email va a spam
- **Solución**: Revisa la carpeta de spam
- **Causa 3**: SMTP no configurado
- **Solución**: Configura un proveedor de email en Supabase

### **❌ "This site can't be reached"**
- **Causa**: URL de redirección incorrecta
- **Solución**: Asegúrate de que Expo esté corriendo en el puerto 8081

## 📱 **Para probar la app:**

1. **Registro con email**: Debería enviar código de verificación
2. **Login con email**: Debería funcionar sin verificación
3. **Google OAuth**: Debería abrir navegador y redirigir
4. **Botón de Google**: Debería aparecer en la pantalla

## 🔧 **Configuración alternativa (sin verificación de email):**

Si quieres que funcione sin verificación de email:

1. Ve a **Authentication** → **Settings** → **Auth**
2. **DESHABILITA** "Enable email confirmations"
3. Los usuarios podrán registrarse e iniciar sesión inmediatamente

## 📋 **Checklist de verificación:**

- [ ] Google OAuth habilitado en Supabase
- [ ] Site URL configurado como `exp://127.0.0.1:8081`
- [ ] Redirect URLs configuradas correctamente
- [ ] Email confirmations habilitado
- [ ] SMTP configurado (o usando el de Supabase)
- [ ] App corriendo en puerto 8081

## 🆘 **Si nada funciona:**

1. **Deshabilita** la verificación de email temporalmente
2. **Usa solo** autenticación con email/contraseña
3. **Configura Google OAuth** más tarde cuando tengas las credenciales

---

**Nota**: La app ahora tiene una pantalla unificada que maneja tanto login como registro, y el botón de Google debería aparecer correctamente.
