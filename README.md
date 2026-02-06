<div align="center">
  <p><span style="font-size: 2em;"><strong>UNIVERSIDAD CENTRAL DEL ECUADOR</strong></span></p>
  <p><span style="font-size: 1.5em;"><strong>FACULTAD DE INGENIERÍA Y CIENCIAS APLICADAS</strong></span></p>
</div>

<p><strong>PROYECTO: SALVUM (SISTEMA DE REPORTES CIUDADANOS)</strong></p>

<p><strong>Tabla de Arquitectura y Tecnologías Frontend</strong></p>

| Componente | Tecnología | Propósito |
| :--- | :--- | :--- |
| **Framework Móvil** | React Native (Expo) | Desarrollo de app multiplataforma (iOS/Android) con hot reload |
| **Navegación** | React Navigation (Stack) | Gestión de rutas y flujos de pantallas por rol de usuario |
| **Estado Global** | React Context (AuthContext) | Manejo centralizado de autenticación, usuario y token JWT |
| **Persistencia Local** | AsyncStorage | Almacenamiento seguro de sesiones de usuario en el dispositivo |
| **Conexión Firebase** | Firebase SDK (JavaScript) | Integración con Auth, Firestore y FCM desde el cliente |
| **Notificaciones Push** | Expo Notifications | Solicitud de permisos, registro de tokens FCM y recepción de notificaciones |
| **Geolocalización** | Expo Location + Google Maps SDK | Obtención de coordenadas y visualización de mapas interactivos |
| **UI/Componentes** | React Native Paper / Custom Styles | Interfaz de usuario consistente y responsive |
| **Llamadas a API** | Fetch API + Interceptores | Comunicación con el backend FastAPI (login, reportes, updates) |
| **Gestión de Imágenes** | Expo Image Picker + Cloudinary SDK | Selección, previsualización y subida de fotos desde la galería/cámara |
| **Tipado Estático** | TypeScript | Validación de tipos, autocompletado y mayor robustez en desarrollo |
| **Manejo de Fuentes** | Expo Font (Google Fonts) | Carga de fuentes personalizadas (Roboto, Montserrat) |
| **Splash Screen** | Expo Splash Screen | Pantalla de carga personalizada durante la inicialización |
| **Build y Distribución** | EAS (Expo Application Services) | Construcción de binaries nativos y despliegue a stores |

<br>

<p><strong>Link del Repositorio Frontend:</strong></p>
<p>https://github.com/klever1995/comunimapp-frontend.git</p>
