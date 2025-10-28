# 🔗 Configuración de Deep Links para Supabase

## ✅ **SOLUCIÓN COMPLETA para enlaces de confirmación**

### 1. **Configurar URLs en Supabase Dashboard**

1. Ve a [supabase.com](https://supabase.com) y entra a tu proyecto
2. Ve a **Authentication** → **Settings** → **URL Configuration**
3. Configura estas URLs EXACTAMENTE así:
   - **Site URL**: `recetasvegetarianas://auth/callback`
   - **Redirect URLs**: 
     - `recetasvegetarianas://auth/callback`
     - `exp://127.0.0.1:8081/--/auth/callback` (para desarrollo)
     - `https://localhost:8081` (para expo-router)

### 2. **Configurar Email Auth**

1. En **Authentication** → **Settings** → **Auth**
2. Configura:
   - ✅ **Enable email confirmations** (HABILITADO)
   - ✅ **Enable email change confirmations** (HABILITADO)
   - **Email confirmation URL**: `recetasvegetarianas://auth/callback`

### 3. **Configurar Email Templates**

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

### 4. **Configurar Google OAuth (Opcional)**

1. Ve a **Authentication** → **Providers** → **Google**
2. **HABILITA** Google OAuth
3. Configura:
   - **Client ID**: (crear en Google Console)
   - **Client Secret**: (crear en Google Console)
   - **Redirect URL**: `https://askippbttqmzldbvtiij.supabase.co/auth/v1/callback`

## 🔄 **Cómo funciona el flujo corregido:**

1. **Usuario se registra** → Supabase envía email con enlace
2. **Usuario abre email** → Hace clic en el enlace de confirmación
3. **Enlace redirige** → A `recetasvegetarianas://auth/callback` (abre la app)
4. **App detecta el deep link** → Verifica automáticamente el email
5. **Usuario es redirigido** → A la pantalla principal

## 🚨 **Problemas comunes y soluciones:**

### **❌ "Página en blanco al hacer clic en el enlace"**
- **Causa**: URLs mal configuradas en Supabase
- **Solución**: Cambia Site URL a `recetasvegetarianas://auth/callback`

### **❌ "App no se abre al hacer clic en el enlace"**
- **Causa**: Deep link no configurado correctamente
- **Solución**: Verifica que el scheme esté en app.json

### **❌ "Email no verificado después de hacer clic"**
- **Causa**: App no detecta el deep link
- **Solución**: Reinicia la app después de hacer clic en el enlace

## 📱 **Para probar:**

1. **Registro**: Debería enviar email con enlace
2. **Abrir email**: Hacer clic debería abrir la app automáticamente
3. **Verificación automática**: App debería detectar la verificación
4. **Navegación**: Usuario debería ser redirigido al inicio

## 🔧 **Configuración alternativa (sin deep links):**

Si los deep links no funcionan, puedes deshabilitar la verificación:

1. Ve a **Authentication** → **Settings** → **Auth**
2. **DESHABILITA** "Enable email confirmations"
3. Los usuarios podrán registrarse sin verificación

## 📋 **Checklist de verificación:**

- [ ] Site URL configurado como `recetasvegetarianas://auth/callback`
- [ ] Redirect URLs incluyen el scheme de la app
- [ ] Email confirmations habilitado
- [ ] Email template personalizado
- [ ] App.json tiene el scheme configurado
- [ ] App se abre al hacer clic en enlaces

---

**Nota**: Esta configuración usa deep links nativos que funcionan mejor que las URLs de Expo para la verificación de email.
