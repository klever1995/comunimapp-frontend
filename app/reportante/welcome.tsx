// app/reportante/welcome.tsx
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
import { welcomeStyles } from '../../styles/reportante/welcomeStyles';

export default function ReportanteWelcomeScreen() {
  
  const handleContinue = () => {
    router.replace('/reportante/home');
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
            <Text style={welcomeStyles.roleText}>REPORTANTE</Text>
          </View>
        </View>

        {/* Contenido de Bienvenida */}
        <View style={welcomeStyles.contentContainer}>
          <Text style={welcomeStyles.welcomeTitle}>
            ¡Bienvenido/a a la comunidad de protección!
          </Text>
          
          <Text style={welcomeStyles.welcomeText}>
            Como <Text style={welcomeStyles.highlightText}>reportante</Text>, tu papel es fundamental 
            en la prevención de la trata infantil en Ecuador.
          </Text>
          
          <Text style={welcomeStyles.welcomeText}>
            Esta plataforma te permite <Text style={welcomeStyles.highlightText}>reportar situaciones sospechosas </Text> 
             de forma segura y anónima, contribuyendo a la protección de niñas, niños y adolescentes 
            en zonas vulnerables.
          </Text>
          
          <View style={welcomeStyles.missionContainer}>
            <Text style={welcomeStyles.missionTitle}>Tu Misión:</Text>
            <Text style={welcomeStyles.missionText}>
              • Reportar actividades sospechosas en tu comunidad
              {'\n'}• Visualizar zonas de riesgo identificadas
              {'\n'}• Contribuir al monitoreo comunitario
              {'\n'}• Actuar como vigilante responsable
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
            Cada reporte cuenta. Juntos protegemos el futuro.
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </SafeArea>
  );
}