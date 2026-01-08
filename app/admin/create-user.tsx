// app/admin/create-user.tsx - VERSIÓN CORREGIDA
import { createUserStyles } from '@/app/styles/admin/create-userStyles';
import { SafeArea } from '@/components/ui/safe-area';
import { useAuth } from '@/hooks/useAuth';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

type UserRole = 'admin' | 'encargado' | 'reportante';

export default function AdminCreateUserScreen() {
  const { authState: { token } } = useAuth();
  
  // Estados básicos (ELIMINADO: nombreCompleto)
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('reportante');
  
  // Estados específicos para encargado
  const [organization, setOrganization] = useState('');
  const [phone, setPhone] = useState('');
  const [zone, setZone] = useState('');
  
  // Estados de UI
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const getRoleText = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'encargado': return 'Encargado';
      case 'reportante': return 'Reportante';
      default: return role;
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'admin': return '#2563EB';
      case 'encargado': return '#F97316';
      case 'reportante': return '#10B981';
      default: return '#64748b';
    }
  };

  const handleRegister = async () => {
    // Validaciones básicas (ELIMINADO: nombreCompleto)
    if (!email.trim() || !username.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Por favor ingresa un correo electrónico válido');
      return;
    }

    // Validaciones específicas por rol
    if (selectedRole === 'encargado' && !organization.trim()) {
      Alert.alert('Error', 'Los encargados deben proporcionar una organización');
      return;
    }

    setIsLoading(true);

    try {
      let endpoint = '';
      let requestBody: any = {
        username: username,
        email: email,
        password: password,
        // ELIMINADO: nombre_completo
      };

      // Agregar campos específicos según rol
      switch (selectedRole) {
        case 'admin':
          endpoint = '/register/admin';
          break;
        case 'encargado':
          endpoint = '/register/encargado';
          requestBody.organization = organization;
          requestBody.phone = phone || null;
          requestBody.zone = zone || null;
          break;
        case 'reportante':
          endpoint = '/register/reportante';
          break;
      }

      const response = await fetch(`${API_URL}/auth${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error en el registro');
      }

      const userData = await response.json();
      
      Alert.alert(
        'Usuario creado exitosamente',
        `El usuario ${userData.username} ha sido creado como ${getRoleText(selectedRole)}. ${
          selectedRole !== 'admin' 
            ? 'Se ha enviado un correo de verificación al usuario.' 
            : 'El usuario admin no requiere verificación.'
        }`,
        [
          {
            text: 'Continuar',
            onPress: () => router.back()
          }
        ]
      );
      
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error en el registro. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
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
        contentContainerStyle={createUserStyles.scrollContent}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={20}
        showsVerticalScrollIndicator={false}
        style={createUserStyles.container}
      >
        {/* Header */}
        <View style={createUserStyles.header}>
          <Text style={createUserStyles.title}>Crear Nuevo Usuario</Text>
          <Text style={createUserStyles.subtitle}>
            Completa el formulario para registrar un nuevo usuario en el sistema
          </Text>
        </View>

        {/* Formulario */}
        <View style={createUserStyles.formContainer}>
          {/* Selector de Rol */}
          <View style={createUserStyles.inputGroup}>
            <Text style={createUserStyles.inputLabel}>Tipo de Usuario *</Text>
            <View style={createUserStyles.roleSelector}>
              {(['reportante', 'encargado', 'admin'] as UserRole[]).map((role) => (
                <TouchableOpacity
                  key={role}
                  style={[
                    createUserStyles.roleButton,
                    selectedRole === role && {
                      backgroundColor: getRoleColor(role),
                      borderColor: getRoleColor(role),
                    }
                  ]}
                  onPress={() => setSelectedRole(role)}
                  disabled={isLoading}
                >
                  <Text style={[
                    createUserStyles.roleButtonText,
                    selectedRole === role && createUserStyles.roleButtonTextActive
                  ]}>
                    {getRoleText(role)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Información Básica */}
          <View style={createUserStyles.sectionTitle}>
            <Text style={createUserStyles.sectionTitleText}>Información Básica</Text>
          </View>

          {/* Nombre de usuario (ÚNICO campo de nombre) */}
          <View style={createUserStyles.inputGroup}>
            <Text style={createUserStyles.inputLabel}>Nombre de usuario *</Text>
            <View style={createUserStyles.inputWithIconContainer}>
              <Image
                source={require('@/assets/images/nombre.png')}
                style={createUserStyles.leftIcon}
                resizeMode="contain"
              />
              <TextInput
                style={[createUserStyles.input, { paddingLeft: 44 }]}
                placeholder="Ingresa el nombre de usuario"
                placeholderTextColor="#94a3b8"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                editable={!isLoading}
              />
            </View>
          </View>

          {/* Correo */}
          <View style={createUserStyles.inputGroup}>
            <Text style={createUserStyles.inputLabel}>Correo electrónico *</Text>
            <View style={createUserStyles.inputWithIconContainer}>
              <Image
                source={require('@/assets/images/correo.png')}
                style={createUserStyles.leftIcon}
                resizeMode="contain"
              />
              <TextInput
                style={[createUserStyles.input, { paddingLeft: 44 }]}
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

          {/* Campos específicos para Encargado */}
          {selectedRole === 'encargado' && (
            <>
              <View style={createUserStyles.sectionTitle}>
                <Text style={createUserStyles.sectionTitleText}>Información de Encargado</Text>
              </View>

              {/* Organización (obligatorio para encargado) */}
              <View style={createUserStyles.inputGroup}>
                <Text style={createUserStyles.inputLabel}>Organización *</Text>
                <View style={createUserStyles.inputWithIconContainer}>
                  <Image
                    source={require('@/assets/images/nombre.png')}
                    style={createUserStyles.leftIcon}
                    resizeMode="contain"
                  />
                  <TextInput
                    style={[createUserStyles.input, { paddingLeft: 44 }]}
                    placeholder="Nombre de la organización"
                    placeholderTextColor="#94a3b8"
                    value={organization}
                    onChangeText={setOrganization}
                    editable={!isLoading}
                  />
                </View>
              </View>

              {/* Teléfono (opcional) */}
              <View style={createUserStyles.inputGroup}>
                <Text style={createUserStyles.inputLabel}>Teléfono</Text>
                <View style={createUserStyles.inputWithIconContainer}>
                  <Image
                    source={require('@/assets/images/nombre.png')}
                    style={createUserStyles.leftIcon}
                    resizeMode="contain"
                  />
                  <TextInput
                    style={[createUserStyles.input, { paddingLeft: 44 }]}
                    placeholder="Número de teléfono"
                    placeholderTextColor="#94a3b8"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    editable={!isLoading}
                  />
                </View>
              </View>

              {/* Zona (opcional) */}
              <View style={createUserStyles.inputGroup}>
                <Text style={createUserStyles.inputLabel}>Zona asignada</Text>
                <View style={createUserStyles.inputWithIconContainer}>
                  <Image
                    source={require('@/assets/images/location.png')}
                    style={createUserStyles.leftIcon}
                    resizeMode="contain"
                  />
                  <TextInput
                    style={[createUserStyles.input, { paddingLeft: 44 }]}
                    placeholder="Zona o sector asignado"
                    placeholderTextColor="#94a3b8"
                    value={zone}
                    onChangeText={setZone}
                    editable={!isLoading}
                  />
                </View>
              </View>
            </>
          )}

          {/* Contraseña */}
          <View style={createUserStyles.sectionTitle}>
            <Text style={createUserStyles.sectionTitleText}>Seguridad</Text>
          </View>

          {/* Contraseña */}
          <View style={createUserStyles.inputGroup}>
            <Text style={createUserStyles.inputLabel}>Contraseña *</Text>
            <View style={createUserStyles.inputWithIconContainer}>
              <Image
                source={require('@/assets/images/contraseña.png')}
                style={createUserStyles.leftIcon}
                resizeMode="contain"
              />
              <TextInput
                style={[createUserStyles.input, { paddingLeft: 44, paddingRight: 44 }]}
                placeholder="Ingresa la contraseña"
                placeholderTextColor="#94a3b8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!isLoading}
              />
              <TouchableOpacity
                style={createUserStyles.eyeIconContainer}
                onPress={toggleShowPassword}
                disabled={isLoading}
              >
                <Image
                  source={showPassword
                    ? require('@/assets/images/ver.png')
                    : require('@/assets/images/no_ver.png')
                  }
                  style={createUserStyles.eyeIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirmar Contraseña */}
          <View style={createUserStyles.inputGroup}>
            <Text style={createUserStyles.inputLabel}>Confirmar Contraseña *</Text>
            <View style={createUserStyles.inputWithIconContainer}>
              <Image
                source={require('@/assets/images/contraseña.png')}
                style={createUserStyles.leftIcon}
                resizeMode="contain"
              />
              <TextInput
                style={[createUserStyles.input, { paddingLeft: 44, paddingRight: 44 }]}
                placeholder="Confirma la contraseña"
                placeholderTextColor="#94a3b8"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                editable={!isLoading}
              />
              <TouchableOpacity
                style={createUserStyles.eyeIconContainer}
                onPress={toggleShowConfirmPassword}
                disabled={isLoading}
              >
                <Image
                  source={showConfirmPassword
                    ? require('@/assets/images/ver.png')
                    : require('@/assets/images/no_ver.png')
                  }
                  style={createUserStyles.eyeIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={createUserStyles.divider} />

          {/* Botones de acción */}
          <View style={createUserStyles.actionsContainer}>
            <TouchableOpacity
              style={createUserStyles.cancelButton}
              onPress={handleCancel}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <Text style={createUserStyles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                createUserStyles.createButton,
                isLoading && createUserStyles.createButtonDisabled,
                { backgroundColor: getRoleColor(selectedRole) }
              ]}
              onPress={handleRegister}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <View style={createUserStyles.createButtonContent}>
                  <Text style={createUserStyles.createButtonText}>Crear Usuario</Text>
                  <Image
                    source={require('@/assets/images/nombre.png')}
                    style={createUserStyles.createIcon}
                    resizeMode="contain"
                  />
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View style={createUserStyles.securityContainer}>
            <Text style={createUserStyles.securityText}>
              * Campos obligatorios
            </Text>
            <Text style={[createUserStyles.securityText, { marginTop: 8 }]}>
              Los usuarios {selectedRole !== 'admin' ? 'recibirán un correo de verificación' : 'admin no requieren verificación'}
            </Text>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeArea>
  );
}