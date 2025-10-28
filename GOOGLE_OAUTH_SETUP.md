# 🔐 Configuración de Google OAuth para Supabase

## 🚨 **PROBLEMA:** Google OAuth se queda cargando y no regresa a la app

## ✅ **SOLUCIÓN PASO A PASO:**

### 1. **Configurar Google OAuth en Supabase Dashboard**

1. Ve a [supabase.com](https://supabase.com) y entra a tu proyecto
2. Ve a **Authentication** → **Providers** → **Google**
3. **HABILITA** Google OAuth
4. Configura:
   - **Client ID**: (necesitas crear uno en Google Console)
   - **Client Secret**: (necesitas crear uno en Google Console)
   - **Redirect URL**: `https://askippbttqmzldbvtiij.supabase.co/auth/v1/callback`

### 2. **Crear credenciales en Google Console**

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Ve a **APIs & Services** → **Credentials**
4. Haz clic en **Create Credentials** → **OAuth 2.0 Client IDs**
5. Configura:
   - **Application type**: Web application
   - **Name**: Sabor Veggie App
   - **Authorized redirect URIs**: 
     - `https://askippbttqmzldbvtiij.supabase.co/auth/v1/callback`
6. Copia el **Client ID** y **Client Secret**

### 3. **Configurar URLs en Supabase**

1. Ve a **Authentication** → **Settings** → **URL Configuration**
2. Configura estas URLs:
   - **Site URL**: `recetasvegetarianas://auth/callback`
   - **Redirect URLs**: 
     - `recetasvegetarianas://auth/callback`
     - `exp://127.0.0.1:8081/--/auth/callback`
     - `https://localhost:8081`

### 4. **Verificar configuración de la app**

Tu `app.json` debe tener:
```json
{
  "expo": {
    "scheme": "recetasvegetarianas",
    "deepLinks": true,
    "linking": {
      "schemes": ["recetasvegetarianas"]
    }
  }
}
```

## 🔄 **Cómo funciona Google OAuth:**

1. **Usuario presiona "Continuar con Google"** → Se abre navegador
2. **Usuario se autentica con Google** → Google redirige a Supabase
3. **Supabase procesa la autenticación** → Redirige a la app
4. **App recibe deep link** → Procesa la sesión
5. **Usuario es redirigido** → A la pantalla principal

## 🚨 **Problemas comunes y soluciones:**

### **❌ "Se queda cargando después de Google"**
- **Causa 1**: Google OAuth no está habilitado en Supabase
- **Solución**: Habilita Google OAuth en Authentication → Providers
- **Causa 2**: Credenciales incorrectas
- **Solución**: Verifica Client ID y Client Secret en Supabase

### **❌ "No regresa a la app"**
- **Causa**: URLs de redirección mal configuradas
- **Solución**: Verifica que Redirect URLs incluyan el scheme de la app

### **❌ "Error de configuración"**
- **Causa**: Redirect URI no coincide
- **Solución**: Asegúrate de que la URL en Google Console sea exactamente:
  `https://askippbttqmzldbvtiij.supabase.co/auth/v1/callback`

## 📱 **Para probar:**

1. **Configura Google OAuth** en Supabase con las credenciales
2. **Reinicia la app** con `expo start --clear`
3. **Presiona "Continuar con Google"**
4. **Autentícate con Google**
5. **Debería regresar a la app** automáticamente

## 🔧 **Debugging:**

Revisa los logs en la consola para ver:
- `Google OAuth redirectTo: recetasvegetarianas://auth/callback`
- `Opening Google OAuth URL: https://...`
- `Google OAuth result: { type: 'success' }`
- `Deep link received: recetasvegetarianas://auth/callback`
- `✅ Usuario autenticado: email@example.com`

## 📋 **Checklist de verificación:**

- [ ] Google OAuth habilitado en Supabase
- [ ] Client ID y Client Secret configurados
- [ ] Redirect URI en Google Console correcto
- [ ] Site URL configurado como `recetasvegetarianas://auth/callback`
- [ ] Redirect URLs incluyen el scheme de la app
- [ ] App.json tiene deepLinks habilitado
- [ ] App se reinicia después de cambios

---

**Nota**: El código ya está optimizado para manejar Google OAuth correctamente. Solo necesitas configurar las credenciales en Supabase.
