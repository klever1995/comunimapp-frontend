// app/encargado/welcome.tsx
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
import { welcomeStyles } from '../../styles/encargado/welcomeStyles';

const { width } = Dimensions.get('window');

export default function EncargadoWelcomeScreen() {
  
  const handleContinue = () => {
    router.replace('/encargado/home');
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
            <Ionicons name="shield-checkmark" size={18} color="#FFF" />
            <Text style={welcomeStyles.roleTextNew}>ENCARGADO</Text>
          </View>
        </View>

        {/* Contenido Principal */}
        <View style={welcomeStyles.mainContent}>
          {/* Título de Bienvenida */}
          <View style={welcomeStyles.welcomeHeader}>
            <Text style={welcomeStyles.welcomeTitleNew}>
              ¡Bienvenido/a,{'\n'}Gestor de Casos!
            </Text>
            <View style={welcomeStyles.titleUnderline} />
          </View>
          
          {/* Descripción del Rol */}
          <View style={welcomeStyles.descriptionCard}>
            <Text style={welcomeStyles.descriptionText}>
              Como <Text style={welcomeStyles.highlightTextNew}>encargado</Text>, tu rol es clave para dar seguimiento a los casos reportados, actualizando su estado y documentando cada avance hasta lograr su resolución completa.
            </Text>
          </View>

          <View style={welcomeStyles.descriptionCard}>
            <Text style={welcomeStyles.descriptionText}>
              Esta plataforma te brinda las herramientas para <Text style={welcomeStyles.highlightTextNew}>gestionar eficientemente cada caso, registrar progresos</Text> y asegurar que toda situación reportada tenga un proceso documentado y un cierre adecuado.
            </Text>
          </View>
          
          {/* Funciones Principales */}
          <View style={welcomeStyles.functionsContainer}>
            <View style={welcomeStyles.functionsTitleRow}>
              <Ionicons name="checkmark-circle" size={24} color="#0EA5E9" />
              <Text style={welcomeStyles.functionsTitle}>Tu Función Principal:</Text>
            </View>
            
            <View style={welcomeStyles.functionsList}>
              {[
                { icon: 'folder-open-outline', text: 'Gestionar casos asignados para seguimiento' },
                { icon: 'refresh-circle-outline', text: 'Actualizar el estado y progreso de cada reporte' },
                { icon: 'document-text-outline', text: 'Documentar avances y acciones realizadas' },
                { icon: 'checkmark-done-circle-outline', text: 'Asegurar el cierre completo de cada situación' },
                { icon: 'filing-outline', text: 'Mantener registros organizados del proceso' },
              ].map((item, index) => (
                <View key={index} style={welcomeStyles.functionItem}>
                  <View style={welcomeStyles.functionIconContainer}>
                    <Ionicons name={item.icon as any} size={20} color="#0EA5E9" />
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
            <Ionicons name="arrow-forward-circle" size={24} color="#FFF" />
          </View>
        </TouchableOpacity>

        {/* Footer Mejorado */}
        <View style={welcomeStyles.footerNew}>
          <Ionicons name="shield-checkmark-outline" size={20} color="#64748B" />
          <Text style={welcomeStyles.footerTextNew}>
            Sistema seguro y protegido
          </Text>
        </View>
      </KeyboardAwareScrollView>
      </View>
    </SafeArea>
  );
}