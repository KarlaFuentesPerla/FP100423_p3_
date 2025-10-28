# 📧 Configuración de Supabase para Enlaces de Confirmación

## ✅ **Configuración CORRECTA para enlaces de email (no códigos OTP)**

### 1. **Configurar Email Auth en Supabase Dashboard**

1. Ve a [supabase.com](https://supabase.com) y entra a tu proyecto
2. Ve a **Authentication** → **Settings** → **Auth**
3. En la sección **Email Auth**, configura:
   - ✅ **Enable email confirmations** (HABILITADO)
   - ✅ **Enable email change confirmations** (HABILITADO)
   - **Email confirmation URL**: `exp://127.0.0.1:8081/--/auth/callback`

### 2. **Configurar Site URL (CRÍTICO para enlaces)**

1. En **Authentication** → **Settings** → **URL Configuration**
2. Configura estas URLs EXACTAMENTE así:
   - **Site URL**: `exp://127.0.0.1:8081`
   - **Redirect URLs**: 
     - `exp://127.0.0.1:8081/--/auth/callback`
     - `exp://192.168.0.20:8085/--/auth/callback` (reemplaza con tu IP local)

### 3. **Configurar Email Templates (IMPORTANTE)**

1. Ve a **Authentication** → **Email Templates**
2. En **Confirm signup**, personaliza:
   - **Subject**: "Confirma tu cuenta en Sabor Veggie"
   - **Body**: 
   ```html
   <h2>¡Bienvenida a Sabor Veggie! 🍃</h2>
   <p>Gracias por registrarte. Para activar tu cuenta, haz clic en el siguiente enlace:</p>
   <p><a href="{{ .ConfirmationURL }}" style="background-color: #e48fb4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Confirmar Email</a></p>
   <p>Si no puedes hacer clic en el enlace, copia y pega esta URL en tu navegador:</p>
   <p>{{ .ConfirmationURL }}</p>
   <p>¡Esperamos verte pronto en la comunidad veggie!</p>
   ```

### 4. **Configurar Google OAuth (Para el botón de Google)**

1. Ve a **Authentication** → **Providers** → **Google**
2. **HABILITA** Google OAuth
3. Configura:
   - **Client ID**: (necesitas crear uno en Google Console)
   - **Client Secret**: (necesitas crear uno en Google Console)
   - **Redirect URL**: `https://askippbttqmzldbvtiij.supabase.co/auth/v1/callback`

## 🔄 **Cómo funciona el flujo de enlaces:**

1. **Usuario se registra** → Supabase envía email con enlace
2. **Usuario abre email** → Hace clic en el enlace de confirmación
3. **Enlace redirige** → A la app (si está configurado correctamente)
4. **Usuario regresa a la app** → Presiona "Ya verifiqué mi email"
5. **App verifica** → Si el email fue confirmado, permite acceso

## 🚨 **Problemas comunes y soluciones:**

### **❌ "El enlace no abre la app"**
- **Causa**: URLs mal configuradas en Supabase
- **Solución**: Verifica que Site URL sea `exp://127.0.0.1:8081`

### **❌ "No llega el email"**
- **Causa 1**: Email va a spam
- **Solución**: Revisa la carpeta de spam
- **Causa 2**: SMTP no configurado
- **Solución**: Configura un proveedor de email en Supabase

### **❌ "Enlace dice 'This site can't be reached'"
- **Causa**: URL de redirección incorrecta
- **Solución**: Asegúrate de que Expo esté corriendo en el puerto 8081

### **❌ "Botón de Google no aparece"**
- **Causa**: Google OAuth no está habilitado
- **Solución**: Ve a Authentication → Providers → Google y habilítalo

## 📱 **Para probar:**

1. **Registro**: Debería enviar email con enlace
2. **Abrir email**: Hacer clic en el enlace debería abrir la app
3. **Verificación**: Presionar "Ya verifiqué" debería funcionar
4. **Google**: El botón debería aparecer y funcionar

## 🔧 **Configuración alternativa (sin verificación):**

Si quieres que funcione sin verificación de email:

1. Ve a **Authentication** → **Settings** → **Auth**
2. **DESHABILITA** "Enable email confirmations"
3. Los usuarios podrán registrarse e iniciar sesión inmediatamente

## 📋 **Checklist de verificación:**

- [ ] Email confirmations habilitado en Supabase
- [ ] Site URL configurado como `exp://127.0.0.1:8081`
- [ ] Redirect URLs configuradas correctamente
- [ ] Email template personalizado con enlace
- [ ] Google OAuth habilitado (opcional)
- [ ] App corriendo en puerto 8081

---

**Nota**: La app ahora está configurada para manejar enlaces de confirmación en lugar de códigos OTP. El flujo es más simple y user-friendly.
