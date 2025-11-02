LINKS PARA LOS VIDEOS:
FUNCIÓN DE LA APP: https://youtu.be/8p3AUlgjLfM
¿CÓMO SE HIZO?: https://youtu.be/pLXW2eqx8pg

DENTRO DEL REPOSITORIO SE ENCUENTRAN ARCHIVOS CON NOMBRE: Capex y opex, documentación y diagrama. Esa es la documentación.

# 🥗 Recetas Vegetarianas

Una aplicación móvil desarrollada con React Native y Expo para descubrir, crear y compartir recetas vegetarianas deliciosas.

## ✨ Características

- **🔐 Autenticación OTP** 
- **📱 Interfaz moderna** con diseño atractivo y paleta de colores suave
- **🍽️ Recetas del día** con ingredientes seleccionables
- **❤️ Sistema de favoritos** para guardar recetas
- **👤 Perfil de usuario** con recetas creadas y favoritas
- **🎲 Generador de recetas aleatorias** inteligente
- **📝 Creación de recetas** personalizadas
- **🗑️ Eliminación de recetas** creadas por el usuario
- **🔄 Sincronización en tiempo real** con Supabase

## 🛠️ Tecnologías

- **React Native** con Expo
- **TypeScript** para tipado estático
- **Supabase** para backend, autenticación y base de datos
- **React Navigation** para navegación
- **React Hooks** para manejo de estado
- **Row Level Security (RLS)** para seguridad de datos

## 🚀 Instalación

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/recetas-vegetarianas.git
   cd recetas-vegetarianas
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno:**
   ```bash
   cp env.example .env
   ```
   
   Edita el archivo `.env` con tus credenciales de Supabase:
   ```
   EXPO_PUBLIC_SUPABASE_URL=tu_url_de_supabase
   EXPO_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
   ```

4. **Configura la base de datos:**
   - Ejecuta el script `database-setup.sql` en tu proyecto de Supabase
   - Las políticas RLS se configuran automáticamente

5. **Inicia la aplicación:**
   ```bash
   npx expo start
   ```

## 📱 Funcionalidades Principales

### 🔐 Autenticación Segura

### 🍽️ Recetas del Día
- **Selección de ingredientes** de una amplia base de datos
- **Generación inteligente** de recetas basadas en ingredientes seleccionados
- **Límite de 3 recetas** para usuarios Free
- **Mensaje de upgrade** a Premium para más recetas
- **Scroll optimizado** y UI responsiva

### ❤️ Sistema de Favoritos
- **Agregar/eliminar** recetas de favoritos
- **Visualización organizada** en el perfil del usuario
- **Navegación directa** a detalles de recetas
- **Sincronización automática** con la base de datos

### 👤 Perfil de Usuario Completo
- **Información del perfil** con plan de suscripción
- **Recetas favoritas** con opción de eliminar
- **Recetas creadas** por el usuario
- **Eliminación segura** de recetas propias
- **Estadísticas** de recetas creadas

### 🎲 Generador Inteligente
- **Genera recetas aleatorias** de ingredientes seleccionados
- **Interfaz intuitiva** y responsiva
- **Filtrado automático** por disponibilidad de ingredientes

### 📝 Creación de Recetas
- **Formulario completo** con validación
- **Procesamiento automático** de ingredientes
- **Creación de ingredientes** nuevos automáticamente
- **Relaciones receta-ingrediente** automáticas
- **Guardado seguro** en la base de datos

## 🗄️ Base de Datos

### Tablas Principales
- **users** - Usuarios autenticados (Supabase Auth)
- **profiles** - Perfiles de usuario con información adicional
- **recipes** - Recetas del sistema y creadas por usuarios
- **ingredients** - Ingredientes disponibles
- **recipe_ingredients** - Relación many-to-many receta-ingrediente
- **favorites** - Recetas favoritas de usuarios

### Políticas RLS (Row Level Security)
- **Acceso controlado** por usuario autenticado
- **Recetas públicas** visibles para todos los usuarios
- **Usuarios solo pueden modificar** sus propias recetas
- **Políticas granulares** para cada operación (SELECT, INSERT, UPDATE, DELETE)

## 🎨 Diseño y UX

- **Paleta de colores** suave y apetitosa (#e48fb4, #fef6f9)
- **Componentes reutilizables** y consistentes
- **Navegación intuitiva** con React Navigation
- **Responsive design** para diferentes tamaños de pantalla
- **Animaciones suaves** y transiciones
- **Feedback visual** claro para todas las acciones

## 📦 Estructura del Proyecto

```
recetas-vegetarianas/
├── app/                    # Pantallas principales
│   ├── Dashboard.tsx      # Pantalla principal con estadísticas
│   ├── NuevaReceta.tsx    # Crear recetas personalizadas
│   ├── ProfileScreen.tsx  # Perfil de usuario completo
│   ├── RandomRecipeScreen.tsx # Recetas del día
│   ├── RecipeDetailScreen.tsx # Detalles de recetas
│   └── emailVerification.tsx # Verificación de email
├── components/            # Componentes reutilizables
│   ├── AuthManager.tsx   # Manejo centralizado de autenticación
│   ├── AuthHandler.tsx   # Manejo de deep links
│   └── ui/               # Componentes de UI
├── hooks/                # Custom hooks
│   ├── useFavorites.ts   # Hook de favoritos
│   ├── useProfile.ts     # Hook de perfil
│   └── useRandomRecipe.ts # Hook de recetas aleatorias
├── lib/                  # Configuración
│   └── supabase.ts       # Cliente de Supabase
├── utils/                # Utilidades
└── database-setup.sql    # Script de configuración de BD
```

## 🔧 Configuración de Supabase

1. **Crea un proyecto en Supabase**
2. **Ejecuta el script de base de datos:**
   ```sql
   -- Ejecuta database-setup.sql en el SQL Editor de Supabase
   ```
3. **Configura la autenticación:**
   - Habilita el proveedor de email
   - Configura las URLs de redirección: `recetasvegetarianas://auth/callback`
4. **Las políticas RLS** se configuran automáticamente con el script

## 🚀 Despliegue

### Expo Go (Desarrollo)
```bash
npx expo start
```

### Build para Producción
```bash
# Android
npx expo build:android

# iOS
npx expo build:ios
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 📞 Soporte

Si tienes preguntas o necesitas ayuda, por favor abre un issue en GitHub.

---

¡Disfruta cocinando recetas vegetarianas deliciosas! 🥗✨
