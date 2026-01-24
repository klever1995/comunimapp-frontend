// app/modal.tsx
import { SafeArea } from '@/components/ui/safe-area';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { registerStyles } from '../styles/registerStyles';

// Componente de Notificación Mejorado
const Toast = ({ visible, message, type, onHide }: {
  visible: boolean;
  message: string;
  type: 'success' | 'error' | 'warning';
  onHide: () => void;
}) => {
  const [fadeAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(3000),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => onHide());
    }
  }, [visible]);

  if (!visible) return null;

  const config = {
    success: {
      bg: '#10B981',
      icon: 'checkmark-circle' as const,
    },
    error: {
      bg: '#EF4444',
      icon: 'close-circle' as const,
    },
    warning: {
      bg: '#F59E0B',
      icon: 'warning' as const,
    },
  };

  const { bg, icon } = config[type];

  return (
    <Animated.View
      style={[
        registerStyles.toastContainer,
        { backgroundColor: bg, opacity: fadeAnim },
      ]}
    >
      <Ionicons name={icon} size={24} color="#FFF" />
      <Text style={registerStyles.toastText}>{message}</Text>
    </Animated.View>
  );
};

export default function RegisterScreen() {
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Estados para Toast
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    type: 'success' as 'success' | 'error' | 'warning',
  });

  const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
    setToast({ visible: true, message, type });
  };

  const hideToast = () => {
    setToast({ ...toast, visible: false });
  };

  const handleRegister = async () => {
    // Validaciones
    if (!nombreCompleto.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      showToast('Por favor completa todos los campos', 'warning');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Las contraseñas no coinciden', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('La contraseña debe tener al menos 6 caracteres', 'warning');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+(\.[^\s@]+)*$/;

    if (!emailRegex.test(email.trim())) {
      showToast('Por favor ingresa un correo electrónico válido', 'warning');
      return;
    }

    setIsLoading(true);

    try {
      const API_URL = process.env.EXPO_PUBLIC_API_URL;
      
      const response = await fetch(`${API_URL}/auth/register/reportante`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            nombre_completo: nombreCompleto,
            email: email,
            password: password,
            username: email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error en el registro');
      }

      const userData = await response.json();
      
      // Registro exitoso
      showToast('¡Registro exitoso! Revisa tu correo para validar tu cuenta', 'success');
      
      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        router.back();
      }, 3000);
      
    } catch (error: any) {
      showToast(error.message || 'Error en el registro. Intenta nuevamente.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    router.back();
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <SafeArea>
      {/* Toast Notification */}
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />

      <KeyboardAwareScrollView
        contentContainerStyle={registerStyles.scrollContent}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={20}
        showsVerticalScrollIndicator={false}
        style={registerStyles.container}
      >
        {/* Header */}
        <View style={registerStyles.header}>
          <Text style={registerStyles.title}>Crear cuenta</Text>
          <Text style={registerStyles.subtitle}>
            Regístrate para contribuir de forma segura al monitoreo de zonas de vulnerabilidad
          </Text>
        </View>

        {/* Formulario */}
        <View style={registerStyles.formContainer}>
          {/* Nombre completo */}
          <View style={registerStyles.inputGroup}>
            <Text style={registerStyles.inputLabel}>Nombre completo</Text>
            <View style={registerStyles.inputWithIconContainer}>
              <Ionicons name="person-outline" size={20} color="#64748B" style={registerStyles.leftIconNew} />
              <TextInput
                style={[registerStyles.input, { paddingLeft: 44 }]}
                placeholder="Ingresa tu nombre completo"
                placeholderTextColor="#94a3b8"
                value={nombreCompleto}
                onChangeText={setNombreCompleto}
                autoCapitalize="words"
                editable={!isLoading}
              />
            </View>
          </View>

          {/* Correo */}
          <View style={registerStyles.inputGroup}>
            <Text style={registerStyles.inputLabel}>Correo electrónico</Text>
            <View style={registerStyles.inputWithIconContainer}>
              <Ionicons name="mail-outline" size={20} color="#64748B" style={registerStyles.leftIconNew} />
              <TextInput
                style={[registerStyles.input, { paddingLeft: 44 }]}
                placeholder="correo@ejemplo.com"
                placeholderTextColor="#94a3b8"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!isLoading}
              />
            </View>
          </View>

          {/* Contraseña */}
          <View style={registerStyles.inputGroup}>
            <Text style={registerStyles.inputLabel}>Contraseña</Text>
            <View style={registerStyles.inputWithIconContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#64748B" style={registerStyles.leftIconNew} />
              <TextInput
                style={[registerStyles.input, { paddingLeft: 44, paddingRight: 44 }]}
                placeholder="Ingresa tu contraseña"
                placeholderTextColor="#94a3b8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!isLoading}
              />
              <TouchableOpacity
                style={registerStyles.eyeIconContainer}
                onPress={toggleShowPassword}
                disabled={isLoading}
              >
                <Ionicons
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={22}
                  color="#64748B"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirmar Contraseña */}
          <View style={registerStyles.inputGroup}>
            <Text style={registerStyles.inputLabel}>Confirmar Contraseña</Text>
            <View style={registerStyles.inputWithIconContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#64748B" style={registerStyles.leftIconNew} />
              <TextInput
                style={[registerStyles.input, { paddingLeft: 44, paddingRight: 44 }]}
                placeholder="Confirma tu contraseña"
                placeholderTextColor="#94a3b8"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                editable={!isLoading}
              />
              <TouchableOpacity
                style={registerStyles.eyeIconContainer}
                onPress={toggleShowConfirmPassword}
                disabled={isLoading}
              >
                <Ionicons
                  name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={22}
                  color="#64748B"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={registerStyles.divider} />

          {/* Botón de Registro */}
          <TouchableOpacity
            style={[registerStyles.loginButton, isLoading && registerStyles.loginButtonDisabled]}
            onPress={handleRegister}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <View style={registerStyles.loginButtonContent}>
                <Text style={registerStyles.loginButtonText}>Registrarse</Text>
                <Ionicons name="arrow-forward-circle" size={20} color="#FFF" />
              </View>
            )}
          </TouchableOpacity>

          <View style={registerStyles.linksContainer}>
            <TouchableOpacity onPress={handleLoginRedirect}>
              <Text style={registerStyles.linkText}>
                ¿Ya tienes cuenta?{' '}
                <Text style={registerStyles.registerHighlight}>Iniciar Sesión</Text>
              </Text>
            </TouchableOpacity>
          </View>

          <View style={registerStyles.securityContainer}>
            <Ionicons name="shield-checkmark-outline" size={16} color="#94a3b8" />
            <Text style={registerStyles.securityText}>
              Tu información será tratada de forma segura y confidencial
            </Text>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeArea>
  );
}