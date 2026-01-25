import { SafeArea } from '@/components/ui/safe-area';
import { useAuth } from '@/hooks/useAuth';
import { registerStyles } from '@/styles/registerStyles';
import { LinearGradient } from 'expo-linear-gradient';
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
  
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('reportante');
  
  const [organization, setOrganization] = useState('');
  const [phone, setPhone] = useState('');
  const [zone, setZone] = useState('');
  
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
      case 'admin': return '#00D4FF';
      case 'encargado': return '#F97316';
      case 'reportante': return '#10B981';
      default: return '#64748b';
    }
  };

  const handleRegister = async () => {
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Por favor ingresa un correo electrónico válido');
      return;
    }

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
      };

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
    <View style={[registerStyles.container, { paddingBottom: 0 }]}>
      <LinearGradient
        colors={['#0A0F24', '#0D1B2A', '#1B263B']}
        style={registerStyles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <View style={registerStyles.particlesContainer}>
        <View style={registerStyles.particle1} />
        <View style={registerStyles.particle2} />
        <View style={registerStyles.particle3} />
      </View>

      <View style={registerStyles.header}>
        <Text style={registerStyles.title}>
          Crear <Text style={registerStyles.titleGradient}>Usuario</Text>
        </Text>
        <Text style={registerStyles.subtitle}>
          Completa el formulario para registrar un nuevo usuario en el sistema
        </Text>
      </View>

      <KeyboardAwareScrollView
        contentContainerStyle={{ paddingBottom: 20 }}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={20}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
      >
        <View style={registerStyles.inputGroup}>
          <Text style={registerStyles.inputLabel}>TIPO DE USUARIO</Text>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
            {(['reportante', 'encargado', 'admin'] as UserRole[]).map((role) => (
              <TouchableOpacity
                key={role}
                style={{
                  flex: 1,
                  backgroundColor: selectedRole === role 
                    ? getRoleColor(role) === '#00D4FF' ? 'rgba(0, 212, 255, 0.1)' 
                    : getRoleColor(role) === '#F97316' ? 'rgba(249, 115, 22, 0.1)' 
                    : 'rgba(16, 185, 129, 0.1)'
                    : 'rgba(255, 255, 255, 0.05)',
                  borderWidth: 1,
                  borderColor: selectedRole === role 
                    ? getRoleColor(role) 
                    : 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 12,
                  padding: 12,
                  alignItems: 'center'
                }}
                onPress={() => setSelectedRole(role)}
                disabled={isLoading}
              >
                <Text style={{
                  fontFamily: selectedRole === role ? 'Roboto_600SemiBold' : 'Roboto_500Medium',
                  fontSize: 13,
                  color: selectedRole === role ? getRoleColor(role) : '#94A3B8',
                  textAlign: 'center'
                }}>
                  {getRoleText(role)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Text style={[registerStyles.inputLabel, { marginTop: 20, marginBottom: 12 }]}>
          INFORMACIÓN BÁSICA
        </Text>

        <View style={registerStyles.inputGroup}>
          <Text style={registerStyles.inputLabel}>NOMBRE DE USUARIO</Text>
          <View style={registerStyles.inputContainer}>
            <Image
              source={require('@/assets/images/nombre.png')}
              style={registerStyles.leftIcon}
              resizeMode="contain"
            />
            <TextInput
              style={registerStyles.input}
              placeholder="Ingresa el nombre de usuario"
              placeholderTextColor="#64748B"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              editable={!isLoading}
            />
          </View>
        </View>

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

        {selectedRole === 'encargado' && (
          <>
            <Text style={[registerStyles.inputLabel, { marginTop: 20, marginBottom: 12 }]}>
              INFORMACIÓN DE ENCARGADO
            </Text>

            <View style={registerStyles.inputGroup}>
              <Text style={registerStyles.inputLabel}>ORGANIZACIÓN</Text>
              <View style={registerStyles.inputContainer}>
                <Image
                  source={require('@/assets/images/organization.png')}
                  style={registerStyles.leftIcon}
                  resizeMode="contain"
                />
                <TextInput
                  style={registerStyles.input}
                  placeholder="Nombre de la organización"
                  placeholderTextColor="#64748B"
                  value={organization}
                  onChangeText={setOrganization}
                  editable={!isLoading}
                />
              </View>
            </View>

            <View style={registerStyles.inputGroup}>
              <Text style={registerStyles.inputLabel}>TELÉFONO</Text>
              <View style={registerStyles.inputContainer}>
                <Image
                  source={require('@/assets/images/phone.png')}
                  style={registerStyles.leftIcon}
                  resizeMode="contain"
                />
                <TextInput
                  style={registerStyles.input}
                  placeholder="Número de teléfono"
                  placeholderTextColor="#64748B"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  editable={!isLoading}
                />
              </View>
            </View>

            <View style={registerStyles.inputGroup}>
              <Text style={registerStyles.inputLabel}>ZONA ASIGNADA</Text>
              <View style={registerStyles.inputContainer}>
                <Image
                  source={require('@/assets/images/location.png')}
                  style={registerStyles.leftIcon}
                  resizeMode="contain"
                />
                <TextInput
                  style={registerStyles.input}
                  placeholder="Zona o sector asignado"
                  placeholderTextColor="#64748B"
                  value={zone}
                  onChangeText={setZone}
                  editable={!isLoading}
                />
              </View>
            </View>
          </>
        )}

        <Text style={[registerStyles.inputLabel, { marginTop: 20, marginBottom: 12 }]}>
          SEGURIDAD
        </Text>

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
              placeholder="Ingresa la contraseña"
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
              placeholder="Confirma la contraseña"
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

        <View style={[registerStyles.securityContainer, { marginTop: 20 }]}>
          <Text style={registerStyles.securityText}>
            Campos obligatorios
          </Text>
          <Text style={[registerStyles.securityText, { marginTop: 8 }]}>
            Los usuarios {selectedRole !== 'admin' ? 'recibirán un correo de verificación' : 'admin no requieren verificación'}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 12, marginTop: 30, marginHorizontal: 20 }}>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.15)',
              borderRadius: 14,
              paddingVertical: 16,
              alignItems: 'center'
            }}
            onPress={handleCancel}
            disabled={isLoading}
          >
            <Text style={{
              fontFamily: 'Roboto_600SemiBold',
              fontSize: 16,
              color: '#94A3B8'
            }}>
              Cancelar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              registerStyles.registerButton,
              isLoading && registerStyles.registerButtonDisabled,
              { flex: 2 }
            ]}
            onPress={handleRegister}
            disabled={isLoading}
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
                  <Text style={registerStyles.buttonText}>CREAR USUARIO</Text>
                  <Image
                    source={require('@/assets/images/agregar.png')}
                    style={registerStyles.buttonIcon}
                    resizeMode="contain"
                  />
                </View>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </View>
    </SafeArea>
  );
}