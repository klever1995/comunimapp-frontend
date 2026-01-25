// app/modal.tsx
import { SafeArea } from '@/components/ui/safe-area';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
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
import { registerStyles } from '../styles/registerStyles';

export default function RegisterScreen() {
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async () => {
    // Validaciones (EXACTAMENTE IGUAL)
    if (!nombreCompleto.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      alert('Por favor completa todos los campos');
      return;
    }

    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+(\.[^\s@]+)*$/;
    if (!emailRegex.test(email.trim())) {
      alert('Por favor ingresa un correo electrónico válido');
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
      alert(`¡Registro exitoso! Por favor ingrese a su correo para validar su cuenta`);
      router.back();
      
    } catch (error: any) {
      alert(error.message || 'Error en el registro. Intenta nuevamente.');
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
      {/* Contenedor principal SIN ScrollView */}
      <View style={registerStyles.container}>
        {/* Fondo con gradiente futurista */}
        <LinearGradient
          colors={['#0A0F24', '#0D1B2A', '#1B263B']}
          style={registerStyles.backgroundGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        
        {/* Partículas decorativas (estáticas) */}
        <View style={registerStyles.particlesContainer}>
          <View style={registerStyles.particle1} />
          <View style={registerStyles.particle2} />
          <View style={registerStyles.particle3} />
        </View>

        {/* Header moderno COMPACTADO */}
        <View style={registerStyles.header}>
          <Text style={registerStyles.title}>
            Crear <Text style={registerStyles.titleGradient}>Cuenta</Text>
          </Text>
          <Text style={registerStyles.subtitle}>
            Únete a la red de monitoreo de protección infantil
          </Text>
        </View>

        {/* Tarjeta de formulario con efecto glassmorphism */}
        <BlurView intensity={20} tint="dark" style={registerStyles.blurCard}>
          <View style={registerStyles.formContainer}>
            {/* Campo: Nombre completo */}
            <View style={registerStyles.inputGroup}>
              <Text style={registerStyles.inputLabel}>NOMBRE COMPLETO</Text>
              <View style={registerStyles.inputContainer}>
                <Image
                  source={require('@/assets/images/nombre.png')}
                  style={registerStyles.leftIcon}
                  resizeMode="contain"
                />
                <TextInput
                  style={registerStyles.input}
                  placeholder="Ingresa tu nombre completo"
                  placeholderTextColor="#64748B"
                  value={nombreCompleto}
                  onChangeText={setNombreCompleto}
                  autoCapitalize="words"
                  editable={!isLoading}
                />
              </View>
            </View>

            {/* Campo: Correo electrónico */}
            <View style={registerStyles.inputGroup}>
              <Text style={registerStyles.inputLabel}>CORREO ELECTRÓNICO</Text>
              <View style={registerStyles.inputContainer}>
                <Image
                  source={require('@/assets/images/correo.png')}
                  style={registerStyles.leftIcon}
                  resizeMode="contain"
                />
                <TextInput
                  style={registerStyles.input}
                  placeholder="correo@ejemplo.com"
                  placeholderTextColor="#64748B"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  editable={!isLoading}
                />
              </View>
            </View>

            {/* Campo: Contraseña */}
            <View style={registerStyles.inputGroup}>
              <Text style={registerStyles.inputLabel}>CONTRASEÑA</Text>
              <View style={registerStyles.inputContainer}>
                <Image
                  source={require('@/assets/images/contraseña.png')}
                  style={registerStyles.leftIcon}
                  resizeMode="contain"
                />
                <TextInput
                  style={registerStyles.input}
                  placeholder="Mínimo 6 caracteres"
                  placeholderTextColor="#64748B"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  editable={!isLoading}
                />
                <TouchableOpacity
                  style={registerStyles.eyeButton}
                  onPress={toggleShowPassword}
                  disabled={isLoading}
                >
                  <Image
                    source={showPassword
                      ? require('@/assets/images/ver.png')
                      : require('@/assets/images/no_ver.png')
                    }
                    style={registerStyles.eyeIcon}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Campo: Confirmar Contraseña */}
            <View style={registerStyles.inputGroup}>
              <Text style={registerStyles.inputLabel}>CONFIRMAR CONTRASEÑA</Text>
              <View style={registerStyles.inputContainer}>
                <Image
                  source={require('@/assets/images/contraseña.png')}
                  style={registerStyles.leftIcon}
                  resizeMode="contain"
                />
                <TextInput
                  style={registerStyles.input}
                  placeholder="Repite tu contraseña"
                  placeholderTextColor="#64748B"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  editable={!isLoading}
                />
                <TouchableOpacity
                  style={registerStyles.eyeButton}
                  onPress={toggleShowConfirmPassword}
                  disabled={isLoading}
                >
                  <Image
                    source={showConfirmPassword
                      ? require('@/assets/images/ver.png')
                      : require('@/assets/images/no_ver.png')
                    }
                    style={registerStyles.eyeIcon}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Separador decorativo COMPACTADO */}
            <View style={registerStyles.dividerContainer}>
              <View style={registerStyles.dividerLine} />
              <View style={registerStyles.dividerLine} />
            </View>

            {/* Botón de Registro con gradiente */}
            <TouchableOpacity
              style={[registerStyles.registerButton, isLoading && registerStyles.registerButtonDisabled]}
              onPress={handleRegister}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={isLoading ? ['#475569', '#475569'] : ['#00D4FF', '#0066FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={registerStyles.buttonGradient}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <View style={registerStyles.buttonContent}>
                    <Text style={registerStyles.buttonText}>CREAR CUENTA</Text>
                    <Image
                      source={require('@/assets/images/registro.png')}
                      style={registerStyles.buttonIcon}
                      resizeMode="contain"
                    />
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Enlace para iniciar sesión COMPACTADO */}
            <View style={registerStyles.linksContainer}>
              <TouchableOpacity onPress={handleLoginRedirect}>
                <Text style={registerStyles.linkText}>
                  ¿Ya tienes cuenta?{' '}
                  <Text style={registerStyles.linkHighlight}>Iniciar Sesión</Text>
                </Text>
              </TouchableOpacity>
            </View>

            {/* Mensaje de seguridad COMPACTADO */}
            <View style={registerStyles.securityContainer}>
              <Text style={registerStyles.securityText}>
                Tus datos están protegidos
              </Text>
            </View>
          </View>
        </BlurView>
      </View>
    </SafeArea>
  );
}