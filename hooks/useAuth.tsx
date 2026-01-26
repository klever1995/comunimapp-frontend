import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { signInWithCustomToken } from 'firebase/auth';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Alert, Platform } from 'react-native';
import { auth as firebaseAuth } from '../lib/firebase';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

type UserRole = 'reportante' | 'encargado' | 'admin';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  organization?: string | null;
  phone?: string | null;
  zone?: string | null;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  phone?: string;
  organization?: string;
  zone?: string;
}

interface LoginResponse {
  user: User;
  access_token: string;
}

interface AuthContextType {
  authState: AuthState;
  login: (credentials: LoginCredentials) => Promise<User>;
  register: (credentials: RegisterCredentials, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  verifyToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ==============================================
// CONFIGURACIÓN DE NOTIFICACIONES
// ==============================================
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldShowAlert: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
  });

  const STORAGE_KEY = '@Comunimapp_auth';

// ==============================================
// 1. SOLICITAR PERMISOS DE NOTIFICACIONES
// ==============================================
const requestNotificationPermissions = async (): Promise<boolean> => {
  console.log('[DEBUG PERMISOS] Función llamada, verificando dispositivo...'); // AÑADE
  if (!Device.isDevice) {
    console.log('[DEBUG PERMISOS] No es un dispositivo físico, retornando false.'); // AÑADE
    return false;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  console.log('[DEBUG PERMISOS] Estado actual de permisos:', existingStatus); // AÑADE
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    console.log('[DEBUG PERMISOS] Solicitando permisos...'); // AÑADE
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
    console.log('[DEBUG PERMISOS] Nuevo estado después de solicitar:', finalStatus); // AÑADE
  }

  if (finalStatus !== 'granted') {
    console.log('[DEBUG PERMISOS] Permisos NO otorgados, mostrando alerta.'); // AÑADE
    Alert.alert(
      'Permisos necesarios',
      'Debes habilitar las notificaciones para recibir alertas importantes.',
      [{ text: 'OK' }]
    );
    return false;
  }

  console.log('[DEBUG PERMISOS] Permisos OTORGADOS. Configurando canal Android...'); // AÑADE
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  console.log('[DEBUG PERMISOS] Retornando TRUE.'); // AÑADE
  return true;
};

// ==============================================
// 2. OBTENER Y REGISTRAR TOKEN FCM (CON DEBUG)
// ==============================================
const registerFCMToken = async (accessToken: string, userId: string): Promise<void> => {
  console.log('[DEBUG registerFCMToken] INICIO. UserId:', userId);
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      console.log('[DEBUG registerFCMToken] Permisos denegados. Saliendo.');
      return;
    }

    console.log('[DEBUG registerFCMToken] Permisos OK. Obteniendo token...');
    let expoPushToken;
    let fcmToken;
    try {
      // Intentamos obtener el token nativo de Google (FCM) directamente
      // Este es el que funcionará con tu archivo JSON en Python
      const deviceToken = await Notifications.getDevicePushTokenAsync();
      fcmToken = deviceToken.data;
      
      console.log('[LOG VICTORIA] TOKEN NATIVO DE GOOGLE OBTENIDO:', fcmToken);
    } catch (googleError) {
      console.error('[ERROR] No se pudo obtener el token de Google:', googleError);
      
      // Si falla el de Google, intentamos el de Expo como plan B
      try {
        const expoToken = await Notifications.getExpoPushTokenAsync({
          projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
        });
        fcmToken = expoToken.data;
      } catch (expoError) {
        console.error('[ERROR CRÍTICO] Fallaron ambos métodos de token');
        return;
      }
    }

    const deviceName = Device.deviceName || 'Desconocido';
    const deviceModel = Device.modelId || 'Desconocido';
    const osVersion = Device.osVersion || 'Desconocido';

    console.log('[DEBUG registerFCMToken] Enviando token al backend...');

    const response = await fetch(`${API_URL}/auth/register-fcm-token`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        fcm_token: fcmToken,
        device_type: Platform.OS,
        device_name: deviceName,
        device_model: deviceModel,
        os_version: osVersion,
      }),
    });

    const responseText = await response.text();
    console.log('[DEBUG registerFCMToken] Respuesta backend:', responseText);

    if (!response.ok) {
      let errorDetail = responseText;
      try {
        const errorJson = JSON.parse(responseText);
        errorDetail = errorJson.detail || errorJson.message || responseText;
      } catch (e) {}
      console.error(`[ERROR registerFCMToken] Backend: ${response.status}`, errorDetail);
      throw new Error(`Error ${response.status}: ${errorDetail}`);
    }

    console.log('[DEBUG registerFCMToken] ÉXITO: Token guardado para', userId);

  } catch (outerError: any) {
    console.error('[ERROR GENERAL en registerFCMToken]:', outerError.message);
  }
};

  // ==============================================
  // 3. REGISTRAR TOKEN AL CARGAR LA APP (SI HAY USUARIO)
  // ==============================================
  useEffect(() => {
    const registerTokenOnLoad = async () => {
      if (authState.user && authState.token) {
        await registerFCMToken(authState.token, authState.user.id);
      }
    };

    registerTokenOnLoad();
  }, [authState.user, authState.token]);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setAuthState({
          user: parsed.user,
          token: parsed.token,
          isLoading: false,
        });
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } catch {
      setAuthState({ user: null, token: null, isLoading: false });
    }
  };

  const saveAuthData = async (user: User, token: string) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token }));
    setAuthState({ user, token, isLoading: false });
  };

  const clearAuthData = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setAuthState({ user: null, token: null, isLoading: false });
  };

  const handleApiError = (error: any): string => {
    if (error.message === 'Network request failed') {
      return 'Error de conexión. Verifica tu internet.';
    }
    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 422: return 'Correo o contraseña incorrectos';
        case 404: return data?.detail || 'Usuario no encontrado';
        case 401: return data?.detail || 'Contraseña incorrecta';
        case 403: return data?.detail || 'Acceso denegado. Cuenta no verificada o desactivada';
        case 400: return data?.detail || 'Datos inválidos';
        default: return `Error ${status}: ${data?.detail || 'Error en el servidor'}`;
      }
    }
    return error.message || 'Error inesperado. Intenta nuevamente.';
  };

  const login = async (credentials: LoginCredentials): Promise<User> => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(credentials),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('El servidor respondió con un formato no válido');
      }

      const data: LoginResponse = await response.json();

      if (!response.ok) {
        const error = new Error((data as any).detail || 'Error de autenticación');
        (error as any).response = { status: response.status, data };
        throw error;
      }

      // ==========================
      // AUTENTICACIÓN CON FIREBASE
      // ==========================
      try {
        const tokenResponse = await fetch(`${API_URL}/auth/firebase-token`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${data.access_token}`, 'Content-Type': 'application/json', Accept: 'application/json' },
        });

        if (!tokenResponse.ok) throw new Error('No se pudo obtener el token de Firebase');

        const tokenData = await tokenResponse.json();
        const firebaseCustomToken = tokenData.firebaseCustomToken;
        await signInWithCustomToken(firebaseAuth, firebaseCustomToken);
      } catch (firebaseError: any) {
        console.warn('Error autenticando en Firebase:', firebaseError.message || firebaseError);
      }

      // ==========================
      // REGISTRAR TOKEN FCM DESPUÉS DE LOGIN
      // ==========================
      console.log('[DEBUG LOGIN] Punto 1: Antes de llamar a registerFCMToken');
      await registerFCMToken(data.access_token, data.user.id);
      console.log('[DEBUG LOGIN] Punto 2: Después de llamar a registerFCMToken');

      await saveAuthData(data.user, data.access_token);
      return data.user;

    } catch (error: any) {
      const errorMessage = handleApiError(error);
      Alert.alert('Error de inicio de sesión', errorMessage, [{ text: 'OK' }]);
      throw new Error(errorMessage);
    }
  };

  const register = async (credentials: RegisterCredentials, role: UserRole) => {
    let endpoint = '';
    switch (role) {
      case 'reportante': endpoint = '/auth/register/reportante'; break;
      case 'encargado': endpoint = '/auth/register/encargado'; break;
      case 'admin': endpoint = '/auth/register/admin'; break;
      default: throw new Error('Rol no válido');
    }

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      if (!response.ok) {
        const error = new Error(data.detail || 'Error en registro');
        (error as any).response = { status: response.status, data };
        throw error;
      }

      if (role === 'admin') {
        await saveAuthData(data, data.access_token || '');
        // Registrar token FCM para admin también
        await registerFCMToken(data.access_token || '', data.id || data.user?.id);
      } else {
        Alert.alert('Registro exitoso', 'Por favor verifica tu correo electrónico para activar tu cuenta.', [{ text: 'OK' }]);
      }

    } catch (error: any) {
      const errorMessage = handleApiError(error);
      Alert.alert('Error de registro', errorMessage, [{ text: 'OK' }]);
      throw new Error(errorMessage);
    }
  };

  const verifyToken = async () => {
    try {
      if (!authState.token) return false;

      const response = await fetch(`${API_URL}/auth/verify-token`, {
        headers: { Authorization: `Bearer ${authState.token}`, Accept: 'application/json' },
      });

      if (!response.ok) {
        const error = new Error('Token inválido');
        (error as any).response = { status: response.status };
        throw error;
      }

      return true;
    } catch (error: any) {
      const errorMessage = handleApiError(error);
      console.log('Error verificando token:', errorMessage);
      await clearAuthData();
      return false;
    }
  };

  const logout = async () => {
    await clearAuthData();
  };

  return (
    <AuthContext.Provider value={{ authState, login, register, logout, verifyToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};