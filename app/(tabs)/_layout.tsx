import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function TabLayout() {
  return (
    <Tabs
  screenOptions={{
    tabBarActiveTintColor: '#FFFFFF', 
    tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.5)',
    headerShown: false,
    tabBarButton: HapticTab,

    tabBarStyle: {
      position: 'absolute', // 👈 CLAVE: Elimina el bloque blanco inferior
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(30, 58, 138, 0.95)', // Azul profundo de tu paleta
      borderTopWidth: 0,
      elevation: 0,
      height: Platform.OS === 'ios' ? 80 : 60, // Altura ajustada y compacta
      paddingBottom: Platform.OS === 'ios' ? 25 : 8,
    },
  }}>

      <Tabs.Screen
        name="index"
        options={{
          title: 'Mapa',
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="map.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="reportes"
        options={{
          title: 'Reportes',
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="list.bullet.rectangle.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="usuarios"
        options={{
          title: 'Usuarios',
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="person.2.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="estadisticas"
        options={{
          title: 'Estadísticas',
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="chart.bar.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}