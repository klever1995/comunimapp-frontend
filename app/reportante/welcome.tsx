// app/reportante/welcome.tsx
import { SafeArea } from '@/components/ui/safe-area';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { welcomeStyles } from '../../styles/reportante/welcomeStyles';

const { width } = Dimensions.get('window');

export default function ReportanteWelcomeScreen() {
  
  const handleContinue = () => {
    router.replace('/reportante/home');
  };

  return (
    <SafeArea>
      <View style={{ flex: 1, position: 'relative' }}>
        {/* Imagen de Fondo Decorativa */}
        <View style={welcomeStyles.backgroundImageContainer}>
          <Image
            source={require('@/assets/images/fondo_welcome.jpg')}
            style={welcomeStyles.backgroundImage}
            resizeMode="cover"
          />
        </View>

        <KeyboardAwareScrollView
          contentContainerStyle={welcomeStyles.scrollContent}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid
          showsVerticalScrollIndicator={false}
          style={welcomeStyles.container}
        >
          {/* Header Moderno */}
          <View style={welcomeStyles.headerGradient}>
            <View style={welcomeStyles.logoWrapper}>
              <Image
                source={require('@/assets/images/salvum.jpeg')}
                style={welcomeStyles.logoImage}
                resizeMode="contain"
              />
            </View>
            
            <View style={welcomeStyles.roleBadgeNew}>
              <Ionicons name="megaphone" size={18} color="#FFF" />
              <Text style={welcomeStyles.roleTextNew}>REPORTANTE</Text>
            </View>
          </View>

          {/* Contenido Principal */}
          <View style={welcomeStyles.mainContent}>
            {/* Título de Bienvenida */}
            <View style={welcomeStyles.welcomeHeader}>
              <Text style={welcomeStyles.welcomeTitleNew}>
                ¡Bienvenido/a a la{'\n'}comunidad de protección!
              </Text>
              <View style={welcomeStyles.titleUnderline} />
            </View>
            
            {/* Descripción del Rol */}
            

            <View style={welcomeStyles.descriptionCard}>
              <Text style={welcomeStyles.descriptionText}>
                Esta plataforma te permite <Text style={welcomeStyles.highlightTextNew}>reportar situaciones sospechosas</Text> de forma segura y anónima, contribuyendo a la protección de niñas, niños y adolescentes en zonas vulnerables.
              </Text>
            </View>
            
            {/* Funciones Principales */}
            <View style={welcomeStyles.functionsContainer}>
              <View style={welcomeStyles.functionsTitleRow}>
                <Ionicons name="flag" size={24} color="#0003b4" />
                <Text style={welcomeStyles.functionsTitle}>Tu Misión:</Text>
              </View>
              
              <View style={welcomeStyles.functionsList}>
                {[
                  { icon: 'alert-circle-outline', text: 'Reportar actividades sospechosas en tu comunidad' },
                  { icon: 'map-outline', text: 'Visualizar zonas de riesgo identificadas' },
                  { icon: 'people-outline', text: 'Contribuir al monitoreo comunitario' },
                  { icon: 'shield-checkmark-outline', text: 'Actuar como vigilante responsable' },
                ].map((item, index) => (
                  <View key={index} style={welcomeStyles.functionItem}>
                    <View style={welcomeStyles.functionIconContainer}>
                      <Ionicons name={item.icon as any} size={20} color="#0003b4" />
                    </View>
                    <Text style={welcomeStyles.functionText}>{item.text}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Botón Continuar Mejorado */}
          <TouchableOpacity
            onPress={handleContinue}
            activeOpacity={0.8}
            style={welcomeStyles.continueButtonWrapper}
          >
            <View style={welcomeStyles.continueButtonContent}>
              <Text style={welcomeStyles.continueButtonTextNew}>Continuar al Panel</Text>
              <Ionicons name="arrow-forward-circle" size={24} color="#ffffff" />
            </View>
          </TouchableOpacity>

          {/* Footer Mejorado */}
          <View style={welcomeStyles.footerNew}>
            <Ionicons name="shield-checkmark-outline" size={20} color="#b1b1b1" />
            <Text style={welcomeStyles.footerTextNew}>
              Juntos protegemos el futuro
            </Text>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </SafeArea>
  );
}