// app/encargado/welcome.tsx
import { SafeArea } from '@/components/ui/safe-area';
import { router } from 'expo-router';
import React from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { welcomeStyles } from '../styles/encargado/welcomeStyles';

export default function EncargadoWelcomeScreen() {
  
  const handleContinue = () => {
    router.replace('/encargado/home');
  };

  return (
    <SafeArea>
      <KeyboardAwareScrollView
        contentContainerStyle={welcomeStyles.scrollContent}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        showsVerticalScrollIndicator={false}
        style={welcomeStyles.container}
      >
        {/* Header con Logo y Rol */}
        <View style={welcomeStyles.header}>
          <View style={welcomeStyles.logoContainer}>
            <Image
              source={require('@/assets/images/bienvenida.png')}
              style={welcomeStyles.logo}
              resizeMode="contain"
            />
          </View>
          
          <View style={welcomeStyles.roleBadge}>
            <Text style={welcomeStyles.roleText}>ENCARGADO</Text>
          </View>
        </View>

        {/* Contenido de Bienvenida */}
        <View style={welcomeStyles.contentContainer}>
          <Text style={welcomeStyles.welcomeTitle}>
            ¡Bienvenido/a, Gestor de Casos!
          </Text>
          
          <Text style={welcomeStyles.welcomeText}>
          Como <Text style={welcomeStyles.highlightText}>encargado</Text>, tu rol es clave para dar seguimiento 
          a los casos reportados, actualizando su estado y documentando cada avance hasta lograr su resolución completa.
        </Text>

        <Text style={welcomeStyles.welcomeText}>
          Esta plataforma te brinda las herramientas para <Text style={welcomeStyles.highlightText}>gestionar 
          eficientemente cada caso, registrar progresos</Text> y asegurar que toda situación reportada 
          tenga un proceso documentado y un cierre adecuado.
        </Text>
          
          <View style={welcomeStyles.missionContainer}>
            <Text style={welcomeStyles.missionTitle}>Tu Función Principal:</Text>
            <Text style={welcomeStyles.missionText}>
              • Gestionar casos asignados para seguimiento
              {'\n'}• Actualizar el estado y progreso de cada reporte
              {'\n'}• Documentar avances y acciones realizadas
              {'\n'}• Asegurar el cierre completo de cada situación
              {'\n'}• Mantener registros organizados del proceso
            </Text>
          </View>
        </View>

        {/* Botón Continuar */}
        <TouchableOpacity
          style={welcomeStyles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={welcomeStyles.continueButtonText}>Continuar al Panel</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={welcomeStyles.footer}>
          <Text style={welcomeStyles.footerText}>
            Tu gestión meticulosa garantiza que cada caso tenga un final seguro.
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </SafeArea>
  );
}