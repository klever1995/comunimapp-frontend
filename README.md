### 📢 Sistema de Gestión de Reportes Ciudadanos
**Proyecto UCE - Facultad de Ingeniería y Ciencias Aplicadas**

### 📋 Descripción del Proyecto

Aplicación móvil multiplataforma desarrollada con React Native (Expo) para el sistema de reportes ciudadanos. Permite a reportantes, encargados y administradores gestionar reportes, visualizar mapas en tiempo real, recibir notificaciones push y más, todo desde un dispositivo móvil.

### 📱 Características Principales

#### 👥 Roles de Usuario
* **Reportante:** Crear reportes, adjuntar imágenes, ver historial, seguir avances.
* **Encargado:** Asignar reportes, actualizar estados, subir avances con fotos.
* **Administrador:** Dashboard completo, gestión de usuarios, métricas con IA, mapas interactivos.

#### 🛠️ Funcionalidades Clave
* Autenticación híbrida (Firebase Auth + JWT personalizado)
* Geolocalización y mapas interactivos (Google Maps SDK)
* Notificaciones push con Expo Notifications
* Subida de imágenes a Cloudinary
* Sincronización en tiempo real con Firestore
* Dashboard administrativo con métricas e IA (Gemini API)
* UI moderna con tema claro/oscuro automático
### 🏗️ Arquitectura y Tecnologías

|Componente              | Tecnología                        |
|-------------------------|-----------------------------------|
| Framework               | React Native (Expo)               |
| Navegación              | React Navigation                  |
| Estado Global           | React Context (AuthContext)       |
| Persistencia            | AsyncStorage                      |
| Firebase                | Firebase SDK (JS)                 |
| Notificaciones          | Expo Notifications                |
| Mapas                   | Expo Location + Google Maps SDK   |
| Imágenes                | Expo Image Picker + Cloudinary    |
| Tipado                  | TypeScript                        |
| UI                      | React Native Paper + Custom Styles|
| Build                   | EAS (Expo Application Services)   |

### 📁 Estructura del Proyecto

```text
app/
├── /app
│   ├── (admin)              # Pantallas de administrador
│   ├── (encargado)          # Pantallas de encargado
│   ├── (reportante)         # Pantallas de reportante
│   ├── (auth)               # Login, registro, verificación
│   ├── _layout.tsx          # Layout raíz con providers
│   └── index.tsx            # Pantalla de inicio
├── /assets
│   ├── /fonts               # Fuentes personalizadas
│   └── /images              # Íconos, splash, logos
├── /components              # Componentes reutilizables
├── /constants               # Constantes, colores, configs
├── /hooks                   # Hooks personalizados (useAuth, useColorScheme)
├── /lib                     # Configuraciones externas
│   └── firebase.ts          # Inicialización de Firebase
├── /services                # Llamadas a API, helpers
├── /types                   # Tipos TypeScript globales
└── app.json                 # Configuración de Expo
├── google-services.json     # Config Firebase para Android
└── package.json             # Dependencias del proyecto

```

### 🔧 Instalación y Configuración

#### 1. Clonar el repositorio
```bash
git clone https://github.com/klever1995/comunimapp-frontend.git
cd ComunimappMobile
```
#### 2. Instalar dependencias
```bash
npm install
```
o tambien puedes usar
```bash
yarn install
```
#### 3. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
EXPO_PUBLIC_API_URL=https://tu-backend.onrender.com
EXPO_PUBLIC_PROJECT_ID=tu-project-id-expo
```
#### 4. Configurar Firebase (Android)
* Agrega tu google-services.json en la raíz del proyecto.
* Asegúrate de que el package en app.json coincida con el de Firebase.

#### 5. Ejecutar en desarrollo
```bash
# iOS
npx expo start --ios

# Android
npx expo start --android

# Web
npx expo start --web
```
### 🔧 Build para Producción
#### Con EAS (Recomendado)
```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login
eas login

# Configurar build
eas build:configure

# Build para Android
eas build --platform android

# Build para iOS
eas build --platform ios
```
#### Build local (APK)
```bash
npx expo prebuild
cd android && ./gradlew assembleRelease
```
### 📱 Flujos de Navegación por Rol
#### Reportante
Login → Welcome → Home (Mapa) → Crear Reporte → Historial → Ver Avances
#### Encargado
Login → Welcome → Home (Reportes asignados) → Mapa → Crear Avance → Historial
#### Administrador
Login → Dashboard → Gestión de Usuarios → Mapas Globales → Estadísticas → Crear Usuario

### 🔐 Autenticación Híbrida (Frontend)
El frontend maneja tres tipos de tokens:
1.	**JWT (access_token):** Para autorización en la API.
2.	**Firebase Custom Token:** Para autenticar el SDK de Firebase en el cliente.
3.	**UUID (verification_token):** Para verificación de email (vía link).
#### Flujo de login:
1.	Usuario ingresa email/contraseña.
2.	Se valida con Firebase Auth.
3.	Backend devuelve JWT.
4.	Cliente solicita Firebase Custom Token.
5.	Se registra token FCM para notificaciones.
6.	Se guarda sesión en AsyncStorage.
### 🗺️ Integración con Mapas
* Google Maps SDK para Android/iOS.
* Expo Location para obtener ubicación en tiempo real.
* Marcadores dinámicos según estado de reporte (pendiente, asignado, resuelto).
* Mapa interactivo con clústeres para alta densidad de reportes.
### 📸 Subida de Imágenes
1.	Usuario selecciona foto con Expo Image Picker.
2.	Se muestra previsualización.
3.	Se sube a Cloudinary desde el frontend o backend (según tamaño).
4.	Se guarda URL en Firestore.
### 🔔 Notificaciones Push
* Expo Notifications para manejo de permisos y tokens.
* Token FCM se envía al backend para registrar dispositivo.
* Notificaciones en tiempo real al cambiar estado de reporte, asignar caso, etc.
* Manejo de clics para redirigir a pantallas específicas.
### 🧪 Pruebas y Debugging
#### Comandos útiles:
```bash
# Limpiar cache de Expo
npx expo start --clear

# Ver logs de Metro
npx expo start --verbose

# Ejecutar en dispositivo físico
npx expo start --tunnel
```
#### Herramientas recomendadas:
* React Native Debugger
* Flipper (para Firestore, AsyncStorage)
* Expo Go (para desarrollo rápido)
### 📄 Scripts Disponibles
```json
{
  "start": "expo start",
  "android": "expo start --android",
  "ios": "expo start --ios",
  "web": "expo start --web",
  "prebuild": "expo prebuild",
  "build:android": "eas build --platform android",
  "build:ios": "eas build --platform ios"
}
```
### 🐛 Solución de Problemas Comunes

|Problema             | Solución                      |
|-------------------------|-----------------------------------|
| Firebase no se inicializa               | Verificar google-services.json y credenciales en lib/firebase.ts               |
| Notificaciones no llegan              | Revisar token FCM en Firestore y permisos del dispositivo                  |
| Mapas no cargan           | Verificar API Key de Google Maps en app.json      |
| Imágenes no se suben            | Revisar credenciales de Cloudinary y permisos de cámara/galería                      |
| Error de red en producción              | Verificar EXPO_PUBLIC_API_URL y CORS en el backend                 |

### 🤝 Contribución
1.	Fork el proyecto.
2.	Crea una rama (git checkout -b feature/nueva-funcionalidad).
3.	Commit cambios (git commit -m 'Agrega nueva funcionalidad').
4.	Push a la rama (git push origin feature/nueva-funcionalidad).
5.	Abre un Pull Request.

### 📄 Licencia
© 2026 Universidad Central del Ecuador - Facultad de Ingeniería y Ciencias Aplicadas

*Proyecto académico para fines educativos.*

