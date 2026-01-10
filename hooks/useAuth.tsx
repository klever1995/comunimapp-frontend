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
    if (!Device.isDevice) {
      console.warn('Debes usar un dispositivo físico para notificaciones push');
      return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      Alert.alert(
        'Permisos necesarios',
        'Debes habilitar las notificaciones para recibir alertas importantes.',
        [{ text: 'OK' }]
      );
      return false;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return true;
  };

  // ==============================================
  // 2. OBTENER Y REGISTRAR TOKEN FCM
  // ==============================================
  const registerFCMToken = async (accessToken: string, userId: string): Promise<void> => {
    try {
      const hasPermission = await requestNotificationPermissions();
      if (!hasPermission) return;

      const expoPushToken = await Notifications.getExpoPushTokenAsync({
        projectId: process.env.EXPO_PUBLIC_PROJECT_ID, // Asegúrate de tener esta variable en tu .env
      });

      const deviceName = Device.deviceName || 'Desconocido';
      const deviceModel = Device.modelId || 'Desconocido';
      const osVersion = Device.osVersion || 'Desconocido';

      const response = await fetch(`${API_URL}/auth/register-fcm-token`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          fcm_token: expoPushToken.data,
          device_type: Platform.OS,
          device_name: deviceName,
          device_model: deviceModel,
          os_version: osVersion,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: No se pudo registrar el token FCM`);
      }

      console.log('✅ Token FCM registrado exitosamente');
    } catch (error: any) {
      console.warn('⚠️ Error registrando token FCM:', error.message || error);
      // No mostramos alerta al usuario para no interrumpir el flujo principal
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
      await registerFCMToken(data.access_token, data.user.id);

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