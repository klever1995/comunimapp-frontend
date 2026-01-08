import AsyncStorage from '@react-native-async-storage/async-storage';
import { signInWithCustomToken } from 'firebase/auth';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Alert } from 'react-native';
import { auth as firebaseAuth } from '../lib/firebase'; // Asegúrate de la ruta correcta

const API_URL = process.env.EXPO_PUBLIC_API_URL;

/*=======================
   TIPOS
======================= */

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

/* =======================
   CONTEXTO
======================= */

interface AuthContextType {
  authState: AuthState;
  login: (credentials: LoginCredentials) => Promise<User>;
  register: (credentials: RegisterCredentials, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  verifyToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* =======================
   PROVIDER
======================= */

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
  });

  const STORAGE_KEY = '@Comunimapp_auth';

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
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ user, token })
    );
    setAuthState({ user, token, isLoading: false });
  };

  const clearAuthData = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setAuthState({ user: null, token: null, isLoading: false });
  };

  /* =======================
     MANEJO DE ERRORES
  ======================= */

  const handleApiError = (error: any): string => {
    if (error.message === 'Network request failed') {
      return 'Error de conexión. Verifica tu internet.';
    }

    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 422:
          return 'Correo o contraseña incorrectos';
        case 404:
          return data?.detail || 'Usuario no encontrado';
        case 401:
          return data?.detail || 'Contraseña incorrecta';
        case 403:
          return data?.detail || 'Acceso denegado. Cuenta no verificada o desactivada';
        case 400:
          return data?.detail || 'Datos inválidos';
        default:
          return `Error ${status}: ${data?.detail || 'Error en el servidor'}`;
      }
    }

    return error.message || 'Error inesperado. Intenta nuevamente.';
  };

  /* =======================
     LOGIN
  ======================= */

  const login = async (credentials: LoginCredentials): Promise<User> => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('El servidor respondió con un formato no válido');
      }

      const data: LoginResponse = await response.json();

      if (!response.ok) {
        const error = new Error((data as any).detail || 'Error de autenticación');
        (error as any).response = {
          status: response.status,
          data,
        };
        throw error;
      }

      // ==========================
      //  NUEVO: Obtener Custom Token para Firebase
      // ==========================
      try {
        const tokenResponse = await fetch(`${API_URL}/auth/firebase-token`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${data.access_token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });

        if (!tokenResponse.ok) {
          throw new Error('No se pudo obtener el token de Firebase');
        }

        const tokenData = await tokenResponse.json();
        const firebaseCustomToken = tokenData.firebaseCustomToken;
        console.log('Firebase Custom Token:', firebaseCustomToken);

        // Autenticar en Firebase
        await signInWithCustomToken(firebaseAuth, firebaseCustomToken);
      } catch (firebaseError: any) {
        console.warn('Error autenticando en Firebase:', firebaseError.message || firebaseError);
      }
      // ==========================

      await saveAuthData(data.user, data.access_token);
      return data.user;

    } catch (error: any) {
      const errorMessage = handleApiError(error);

      Alert.alert(
        'Error de inicio de sesión',
        errorMessage,
        [{ text: 'OK' }]
      );

      throw new Error(errorMessage);
    }
  };

  /* =======================
     REGISTER
  ======================= */

  const register = async (
    credentials: RegisterCredentials,
    role: UserRole
  ) => {
    let endpoint = '';

    switch (role) {
      case 'reportante':
        endpoint = '/auth/register/reportante';
        break;
      case 'encargado':
        endpoint = '/auth/register/encargado';
        break;
      case 'admin':
        endpoint = '/auth/register/admin';
        break;
      default:
        throw new Error('Rol no válido');
    }

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        const error = new Error(data.detail || 'Error en registro');
        (error as any).response = {
          status: response.status,
          data,
        };
        throw error;
      }

      if (role === 'admin') {
        await saveAuthData(data, data.access_token || '');
      } else {
        Alert.alert(
          'Registro exitoso',
          'Por favor verifica tu correo electrónico para activar tu cuenta.',
          [{ text: 'OK' }]
        );
      }

    } catch (error: any) {
      const errorMessage = handleApiError(error);
      Alert.alert('Error de registro', errorMessage, [{ text: 'OK' }]);
      throw new Error(errorMessage);
    }
  };

  /* =======================
     VERIFY TOKEN
  ======================= */

  const verifyToken = async () => {
    try {
      if (!authState.token) return false;

      const response = await fetch(
        `${API_URL}/auth/verify-token`,
        {
          headers: {
            Authorization: `Bearer ${authState.token}`,
            Accept: 'application/json',
          },
        }
      );

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
    <AuthContext.Provider
      value={{ authState, login, register, logout, verifyToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* =======================
   HOOK
======================= */

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
