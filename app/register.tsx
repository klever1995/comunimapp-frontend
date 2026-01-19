// app/modal.tsx
import { SafeArea } from '@/components/ui/safe-area';
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
    // Validaciones
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

    // Esta nueva regex acepta dominios con varios puntos como .edu.ec
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+(\.[^\s@]+)*$/;

    if (!emailRegex.test(email.trim())) {
      alert('Por favor ingresa un correo electrónico válido');
      return;
    }

    setIsLoading(true);

    try {
      // IMPORTANTE: Cambia por tu URL real
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
            username: email, // Campo requerido por el backend
        }),
        });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error en el registro');
      }

      const userData = await response.json();
      
      // Registro exitoso
      alert(`¡Registro exitoso! Por favor ingrese a su correo para validar su cuenta`);
      
      // Redirigir al login
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
      <KeyboardAwareScrollView
        contentContainerStyle={registerStyles.scrollContent}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={20}
        showsVerticalScrollIndicator={false}
        style={registerStyles.container}
      >
        {/* Header SIN LOGO */}
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
              <Image
                source={require('@/assets/images/nombre.png')}
                style={registerStyles.leftIcon}
                resizeMode="contain"
              />
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
              <Image
                source={require('@/assets/images/correo.png')}
                style={registerStyles.leftIcon}
                resizeMode="contain"
              />
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
              <Image
                source={require('@/assets/images/contraseña.png')}
                style={registerStyles.leftIcon}
                resizeMode="contain"
              />
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

          {/* Confirmar Contraseña */}
          <View style={registerStyles.inputGroup}>
            <Text style={registerStyles.inputLabel}>Confirmar Contraseña</Text>
            <View style={registerStyles.inputWithIconContainer}>
              <Image
                source={require('@/assets/images/contraseña.png')}
                style={registerStyles.leftIcon}
                resizeMode="contain"
              />
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
                <Image
                  source={require('@/assets/images/registro.png')}
                  style={registerStyles.loginIcon}
                  resizeMode="contain"
                />
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
            <Text style={registerStyles.securityText}>
              Tu información será tratada de forma segura y confidencial
            </Text>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeArea>
  );
}