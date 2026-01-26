import { SafeArea } from '@/components/ui/safe-area';
import { useAuth } from '@/hooks/useAuth';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { loginStyles } from '../styles/index';

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

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <SafeArea>
      <ImageBackground
        source={require('@/assets/images/fondo4.jpg')}
        style={loginStyles.backgroundImage}
        resizeMode="cover"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={loginStyles.keyboardAvoid}
        >
          <View style={loginStyles.mainContainer}>
            
            <View style={loginStyles.header}>
              <Image
                source={require('@/assets/images/logo3.png')}
                style={loginStyles.logo}
                resizeMode="contain"
              />
              <Text style={loginStyles.title}>Sistema de Alerta y Reporte</Text>
              <Text style={loginStyles.subtitle}>
                Accede para reportar y monitorear zonas de vulnerabilidad de forma segura.
              </Text>
            </View>

            <View style={loginStyles.formContainer}>
              <View style={loginStyles.inputContainer}>
                <View style={loginStyles.labelContainer}>
                  <Image
                    source={require('@/assets/images/correo.png')}
                    style={loginStyles.inputIcon}
                    resizeMode="contain"
                  />
                  <Text style={loginStyles.inputLabel}>Correo electrónico</Text>
                </View>
                <TextInput
                  style={loginStyles.input}
                  placeholder="tu@correo.com"
                  placeholderTextColor="rgba(255, 255, 255, 0.9)"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  editable={!isLoading}
                />
                <View style={loginStyles.inputUnderline} />
              </View>

              <View style={loginStyles.inputContainer}>
                <View style={loginStyles.labelContainer}>
                  <Image
                    source={require('@/assets/images/contraseña.png')}
                    style={loginStyles.inputIcon}
                    resizeMode="contain"
                  />
                  <Text style={loginStyles.inputLabel}>Contraseña</Text>
                </View>
                <View style={loginStyles.passwordInputRow}>
                  <TextInput
                    style={[loginStyles.input, { flex: 1 }]}
                    placeholder="Ingresa tu contraseña"
                    placeholderTextColor="rgba(255, 255, 255, 0.9)"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    editable={!isLoading}
                  />
                  <TouchableOpacity
                    style={loginStyles.eyeButton}
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
                <View style={loginStyles.inputUnderline} />
              </View>

              <TouchableOpacity
                style={[loginStyles.loginButton, isLoading && loginStyles.loginButtonDisabled]}
                onPress={handleLogin}
                disabled={isLoading}
                activeOpacity={0.9}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <View style={loginStyles.buttonContent}>
                    <Text style={loginStyles.loginButtonText}>Iniciar sesión</Text>
                    <Image
                      source={require('@/assets/images/login.png')}
                      style={loginStyles.loginIcon}
                      resizeMode="contain"
                    />
                  </View>
                )}
              </TouchableOpacity>

              <View style={loginStyles.signupContainer}>
                <Text style={loginStyles.signupText}>¿No tienes cuenta? </Text>
                <TouchableOpacity onPress={handleRegisterRedirect}>
                  <Text style={loginStyles.signupLink}>Registrarse</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={loginStyles.footer}>
              <Text style={loginStyles.footerText}>Sistema seguro y protegido</Text>
            </View>

          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeArea>
  );
}