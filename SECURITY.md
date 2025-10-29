# Política de Seguridad

## Versiones Soportadas

| Versión | Soportada          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reportar una Vulnerabilidad

Si descubres una vulnerabilidad de seguridad, por favor sigue estos pasos:

### 1. No Divulgues Públicamente
- **NO** abras un issue público en GitHub
- **NO** publiques en redes sociales
- **NO** compartas en foros públicos

### 2. Reporta de Forma Privada
Envía un email a: **security@tu-dominio.com** con la siguiente información:

- Descripción detallada de la vulnerabilidad
- Pasos para reproducir el problema
- Impacto potencial
- Tu información de contacto

### 3. Proceso de Respuesta
- **24 horas**: Confirmación de recepción
- **72 horas**: Evaluación inicial
- **7 días**: Plan de corrección
- **30 días**: Corrección implementada

### 4. Reconocimiento
Si reportas una vulnerabilidad válida, serás reconocido en:
- Changelog de la versión
- Sección de agradecimientos
- (Opcional) Hall of Fame de seguridad

## Mejores Prácticas de Seguridad

### Para Desarrolladores
- Mantén las dependencias actualizadas
- Usa variables de entorno para datos sensibles
- Implementa validación de entrada
- Sigue el principio de menor privilegio

### Para Usuarios
- Mantén la aplicación actualizada
- No compartas credenciales de acceso
- Usa contraseñas seguras
- Reporta comportamientos sospechosos

## Configuración de Seguridad

### Variables de Entorno
```bash
# NUNCA subas estas variables al repositorio
EXPO_PUBLIC_SUPABASE_URL=your-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-key
```

### Base de Datos
- Row Level Security (RLS) habilitado
- Políticas de acceso configuradas
- Validación de datos en el servidor

### Autenticación
- JWT tokens con expiración
- Validación de sesiones
- Protección contra ataques de fuerza bruta

## Contacto de Seguridad

Para reportar vulnerabilidades o preguntas de seguridad:

- **Email**: security@tu-dominio.com
- **PGP Key**: [Disponible bajo solicitud]
- **Response Time**: 24-48 horas

---

**Gracias por ayudar a mantener segura esta aplicación.**
