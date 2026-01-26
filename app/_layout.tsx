import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider } from '@/hooks/useAuth';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

// 👉 IMPORTS CORRECTOS DE FUENTES (ESTO ES LO QUE FALTABA)
import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto';

import {
  Montserrat_400Regular,
  Montserrat_600SemiBold,
} from '@expo-google-fonts/montserrat';

// Evita que el splash se oculte antes de tiempo
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // ✅ CARGA CORRECTA DE FUENTES (SIN require)
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
    Montserrat_400Regular,
    Montserrat_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  SplashScreen.hideAsync();

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen
            name="modal"
            options={{ presentation: 'modal', title: 'Modal' }}
          />
          <Stack.Screen name="register" options={{ headerShown: false }} />
          <Stack.Screen name="notification" options={{ headerShown: false }} />

          <Stack.Screen name="admin/home" options={{ headerShown: false }} />
          <Stack.Screen name="admin/home-map" options={{ headerShown: false }} />
          <Stack.Screen name="admin/report" options={{ headerShown: false }} />
          <Stack.Screen name="admin/users" options={{ headerShown: false }} />
          <Stack.Screen name="admin/estadistic" options={{ headerShown: false }} />
          <Stack.Screen name="admin/avances" options={{ headerShown: false }} />
          <Stack.Screen name="admin/create-user" options={{ headerShown: false }} />

          <Stack.Screen name="encargado/welcome" options={{ headerShown: false }} />
          <Stack.Screen name="encargado/home" options={{ headerShown: false }} />
          <Stack.Screen name="encargado/home-map" options={{ headerShown: false }} />
          <Stack.Screen name="encargado/history" options={{ headerShown: false }} />
          <Stack.Screen name="encargado/avances" options={{ headerShown: false }} />
          <Stack.Screen name="encargado/crear-avance" options={{ headerShown: false }} />

          <Stack.Screen name="reportante/welcome" options={{ headerShown: false }} />
          <Stack.Screen name="reportante/home" options={{ headerShown: false }} />
          <Stack.Screen name="reportante/home-map" options={{ headerShown: false }} />
          <Stack.Screen name="reportante/report" options={{ headerShown: false }} />
          <Stack.Screen name="reportante/history" options={{ headerShown: false }} />
          <Stack.Screen name="reportante/avances" options={{ headerShown: false }} />
        </Stack>

        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}
