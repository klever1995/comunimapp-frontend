import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
        screenOptions={{
            tabBarActiveTintColor: '#FFFFFF', // Icono activo blanco
            tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.5)',
            headerShown: false,
            tabBarStyle: {
              position: 'absolute',
              backgroundColor: 'rgba(37, 99, 235, 0.9)', // Mismo azul del header
              borderTopWidth: 0,
              // Altura ajustada: Más delgada y compacta
              height: Platform.OS === 'ios' ? 75 : 55, 
              paddingBottom: Platform.OS === 'ios' ? 25 : 8,
              elevation: 0,
        },
      }}>

      <Tabs.Screen
        name="index"
        options={{
          title: 'Mapa',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="map.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="reportes" // Asegúrate de que el nombre coincida con tu archivo
        options={{
          title: 'Reportes',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="list.bullet.rectangle.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="usuarios"
        options={{
          title: 'Usuarios',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.2.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="estadisticas"
        options={{
          title: 'Estadísticas',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="chart.bar.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}