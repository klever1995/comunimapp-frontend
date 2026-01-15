import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider } from '@/hooks/useAuth';
import { 
  Montserrat_400Regular, 
  Montserrat_600SemiBold 
} from '@expo-google-fonts/montserrat';
import { 
  Roboto_400Regular, 
  Roboto_500Medium, 
  Roboto_700Bold, 
  useFonts 
} from '@expo-google-fonts/roboto';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import 'react-native-reanimated';
import "../global.css"; // Configuración de Tailwind

// Evita que el splash se oculte antes de tiempo
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // ✅ CARGA CORRECTA DE FUENTES
  const [fontsLoaded, fontError] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
    Montserrat_400Regular,
    Montserrat_600SemiBold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          {/* Configuración de rutas */}
          <Stack.Screen name="index" />
          <Stack.Screen
            name="modal"
            options={{ presentation: 'modal', title: 'Modal', headerShown: true }}
          />
          <Stack.Screen name="register" />
          
          {/* Admin Routes */}
          <Stack.Screen name="admin/home" />
          <Stack.Screen name="admin/home-map" />
          <Stack.Screen name="admin/report" />
          <Stack.Screen name="admin/users" />
          <Stack.Screen name="admin/estadistic" />
          <Stack.Screen name="admin/avances" />
          <Stack.Screen name="admin/create-user" />

          {/* Encargado Routes */}
          <Stack.Screen name="encargado/welcome" />
          <Stack.Screen name="encargado/home" />
          <Stack.Screen name="encargado/home-map" />
          <Stack.Screen name="encargado/history" />
          <Stack.Screen name="encargado/avances" />
          <Stack.Screen name="encargado/crear-avance" />

          {/* Reportante Routes */}
          <Stack.Screen name="reportante/welcome" />
          <Stack.Screen name="reportante/home" />
          <Stack.Screen name="reportante/home-map" />
          <Stack.Screen name="reportante/report" />
          <Stack.Screen name="reportante/history" />
          <Stack.Screen name="reportante/avances" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}