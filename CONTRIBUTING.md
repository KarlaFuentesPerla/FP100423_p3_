# Guía de Contribución

¡Gracias por tu interés en contribuir a Recetas Vegetarianas! 🥗

## Cómo Contribuir

### 1. Fork y Clone
```bash
# Fork el repositorio en GitHub
# Luego clona tu fork
git clone https://github.com/tu-usuario/recetas-vegetarianas.git
cd recetas-vegetarianas
```

### 2. Configurar el Entorno
```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp env.example .env
# Edita .env con tus datos de Supabase
```

### 3. Crear una Rama
```bash
# Crear rama para tu feature
git checkout -b feature/nombre-de-tu-feature

# O para bugfix
git checkout -b fix/descripcion-del-bug
```

### 4. Hacer Cambios
- Sigue las convenciones de código existentes
- Añade tests si es necesario
- Actualiza documentación si es relevante

### 5. Commit y Push
```bash
# Commit con mensaje descriptivo
git commit -m "feat: añadir nueva funcionalidad de búsqueda"

# Push a tu fork
git push origin feature/nombre-de-tu-feature
```

### 6. Crear Pull Request
- Ve a GitHub y crea un Pull Request
- Describe claramente los cambios
- Menciona issues relacionados si los hay

## Convenciones de Código

### Commits
Usa [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: nueva funcionalidad
fix: corrección de bug
docs: cambios en documentación
style: cambios de formato
refactor: refactorización de código
test: añadir o modificar tests
chore: tareas de mantenimiento
```

### TypeScript
- Usa tipos explícitos
- Evita `any` cuando sea posible
- Documenta interfaces complejas

### React Native
- Usa hooks cuando sea apropiado
- Optimiza re-renders
- Sigue las mejores prácticas de performance

### Estilos
- Usa StyleSheet.create()
- Mantén consistencia con la paleta de colores
- Usa valores de spacing consistentes

## Estructura de Archivos

```
app/           # Pantallas principales
components/    # Componentes reutilizables
hooks/         # Custom hooks
lib/           # Configuraciones y utilidades
types/         # Definiciones de TypeScript
utils/         # Funciones auxiliares
```

## Testing

### Antes de Enviar PR
```bash
# Verificar tipos
npm run type-check

# Ejecutar linter
npm run lint

# Probar en dispositivo/emulador
npm run android
npm run ios
```

### Tests Recomendados
- [ ] Funcionalidad nueva funciona correctamente
- [ ] No hay regresiones en funcionalidad existente
- [ ] UI se ve bien en diferentes tamaños de pantalla
- [ ] Performance no se ve afectada

## Tipos de Contribuciones

### 🐛 Bug Reports
- Usa el template de bug report
- Incluye pasos para reproducir
- Especifica versión y plataforma

### ✨ Feature Requests
- Usa el template de feature request
- Describe el caso de uso
- Considera la implementación

### 📝 Documentación
- Mejora README
- Añade comentarios al código
- Crea guías de usuario

### 🎨 UI/UX
- Mejora diseño existente
- Añade nuevas pantallas
- Optimiza experiencia de usuario

## Proceso de Review

### Criterios de Aceptación
- [ ] Código sigue convenciones establecidas
- [ ] Funcionalidad funciona como se espera
- [ ] Tests pasan (si aplica)
- [ ] Documentación actualizada
- [ ] No introduce vulnerabilidades

### Feedback
- Mantén feedback constructivo
- Sé específico en sugerencias
- Celebra buenas contribuciones

## Configuración de Desarrollo

### VS Code (Recomendado)
Extensiones útiles:
- ES7+ React/Redux/React-Native snippets
- TypeScript Importer
- Prettier - Code formatter
- ESLint

### Configuración
```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## Comunicación

### Issues
- Usa labels apropiados
- Asigna a ti mismo si vas a trabajar en ello
- Cierra issues cuando estén resueltos

### Pull Requests
- Mantén PRs pequeños y enfocados
- Responde a feedback rápidamente
- Actualiza PR si hay cambios en main

### Discord/Slack
- Únete a nuestro canal de desarrollo
- Pregunta dudas antes de empezar trabajo grande
- Comparte progreso en features complejas

## Reconocimiento

### Contributors
Todos los contribuidores serán reconocidos en:
- README.md
- Changelog
- Release notes

### Hall of Fame
Contribuidores destacados aparecerán en:
- Sección especial del README
- Documentación de agradecimientos

## Preguntas Frecuentes

### ¿Cómo empiezo?
1. Mira los issues con label "good first issue"
2. Pregunta en Discord si necesitas ayuda
3. Empieza con algo pequeño

### ¿Qué si no estoy seguro?
- Pregunta en Discord
- Abre un issue de discusión
- Crea un draft PR para feedback

### ¿Cómo reporto un bug?
- Usa el template de bug report
- Incluye logs y screenshots
- Especifica pasos para reproducir

---

**¡Gracias por contribuir y hacer esta app mejor para todos!** 🙏
