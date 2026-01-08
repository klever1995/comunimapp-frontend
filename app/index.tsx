import { SafeArea } from '@/components/ui/safe-area';
import { useAuth } from '@/hooks/useAuth';
import { router } from 'expo-router';
import React, { useState } from 'react';

import {
  ActivityIndicator,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { loginStyles } from './styles/index';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      alert('Por favor completa todos los campos');
      return;
    }

    setIsLoading(true);

    try {
      const user = await login({ email, password });

      switch (user.role) {
        case 'admin':
          router.replace('/admin/home');
          break;
        case 'encargado':
          router.replace('/encargado/welcome');
          break;
        case 'reportante':
          router.replace('/reportante/welcome');
          break;
        default:
          router.replace('/');
      }
    } catch (error) {
      // manejado en useAuth
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterRedirect = () => {
    router.push('/register');
  };

  const handleForgotPassword = () => {
    alert('Funcionalidad de recuperación de contraseña en desarrollo');
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <SafeArea>
      <KeyboardAwareScrollView
        contentContainerStyle={loginStyles.scrollContent}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={20}
        showsVerticalScrollIndicator={false}
        style={loginStyles.container}
      >
        {/* Header */}
        <View style={loginStyles.header}>
          <Image
            source={require('@/assets/images/logo.png')}
            style={loginStyles.logo}
            resizeMode="contain"
          />
          <Text style={loginStyles.title}>Sistema de Alerta y Reporte</Text>
          <Text style={loginStyles.subtitle}>
            Accede para reportar y monitorear zonas de vulnerabilidad de forma segura.
          </Text>
        </View>

        {/* Formulario */}
        <View style={loginStyles.formContainer}>
          {/* Correo */}
          <View style={loginStyles.inputGroup}>
            <Text style={loginStyles.inputLabel}>Correo electrónico</Text>

            <View style={loginStyles.inputWithIconContainer}>
              <Image
                source={require('@/assets/images/correo.png')}
                style={loginStyles.leftIcon}
                resizeMode="contain"
              />
              <TextInput
                style={[loginStyles.input, { paddingLeft: 44 }]}
                placeholder="tu@correo.com"
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
          <View style={loginStyles.inputGroup}>
            <Text style={loginStyles.inputLabel}>Contraseña</Text>

            <View style={loginStyles.inputWithIconContainer}>
              <Image
                source={require('@/assets/images/contraseña.png')}
                style={loginStyles.leftIcon}
                resizeMode="contain"
              />

              <TextInput
                style={[loginStyles.input, { paddingLeft: 44, paddingRight: 44 }]}
                placeholder="Ingresa tu contraseña"
                placeholderTextColor="#94a3b8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!isLoading}
              />

              <TouchableOpacity
                style={loginStyles.eyeIconContainer}
                onPress={toggleShowPassword}
                disabled={isLoading}
              >
                <Image
                  source={
                    showPassword
                      ? require('@/assets/images/ver.png')
                      : require('@/assets/images/no_ver.png')
                  }
                  style={loginStyles.eyeIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={loginStyles.divider} />

          {/* Botón */}
          <TouchableOpacity
            style={[loginStyles.loginButton, isLoading && loginStyles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <View style={loginStyles.loginButtonContent}>
                <Text style={loginStyles.loginButtonText}>Iniciar sesión</Text>
                <Image
                  source={require('@/assets/images/login.png')}
                  style={loginStyles.loginIcon}
                  resizeMode="contain"
                />
              </View>
            )}
          </TouchableOpacity>

          <View style={loginStyles.linksContainer}>
            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={loginStyles.linkText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleRegisterRedirect}>
              <Text style={loginStyles.linkText}>
                ¿No tienes cuenta?{' '}
                <Text style={loginStyles.registerHighlight}>Registrarse</Text>
              </Text>
            </TouchableOpacity>
          </View>

          <View style={loginStyles.securityContainer}>
            <Text style={loginStyles.securityText}>Sistema seguro y protegido</Text>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeArea>
  );
}
