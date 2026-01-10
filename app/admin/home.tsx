// app/admin/home.tsx
import { SafeArea } from '@/components/ui/safe-area';
import { homeStyles } from '@/styles/admin/homeStyles';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Image, Text } from 'react-native';

// Importamos las pantallas del admin
import AdminEstadisticScreen from './estadistic';
import AdminHomeMapScreen from './home-map';
import AdminReportScreen from './report';
import AdminUsersScreen from './users';

const Tab = createBottomTabNavigator();

// Navegador principal con tabs para el admin
export default function AdminHomeTabs() {
  return (
    <SafeArea>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconSource;
            
            if (route.name === 'Mapa') {
              iconSource = require('@/assets/images/map-icon.png');
            } else if (route.name === 'Reportes') {
              iconSource = require('@/assets/images/history.png');
            } else if (route.name === 'Usuarios') {
              iconSource = require('@/assets/images/nombre.png');
            } else if (route.name === 'Estadisticas') {
              iconSource = require('@/assets/images/estadistica.png');
            }
            
            // Si la imagen no existe, usa un placeholder
            try {
              return (
                <Image
                  source={iconSource}
                  style={[
                    homeStyles.tabIcon,
                    { tintColor: focused ? '#2563EB' : '#94a3b8' }
                  ]}
                  resizeMode="contain"
                />
              );
            } catch {
              // Fallback si no encuentra la imagen
              return (
                <Text style={{ 
                  color: focused ? '#2563EB' : '#94a3b8',
                  fontSize: 20 
                }}>
                  {route.name === 'Mapa' ? '🗺️' : 
                   route.name === 'Reportes' ? '📋' :
                   route.name === 'Usuarios' ? '👥' : '📊'}
                </Text>
              );
            }
          },
          tabBarLabel: ({ focused }) => {
            let label = '';
            if (route.name === 'Mapa') label = 'Mapa';
            if (route.name === 'Reportes') label = 'Reportes';
            if (route.name === 'Usuarios') label = 'Usuarios';
            if (route.name === 'Estadisticas') label = 'Estadísticas';
            
            return (
              <Text style={[
                homeStyles.tabLabel,
                focused ? homeStyles.tabLabelActive : homeStyles.tabLabelInactive
              ]}>
                {label}
              </Text>
            );
          },
          tabBarStyle: homeStyles.tabBar,
          tabBarItemStyle: homeStyles.tabItem,
          headerShown: false,
        })}
      >
        <Tab.Screen 
          name="Mapa" 
          component={AdminHomeMapScreen}
          options={{ title: 'Mapa de todos los reportes' }}
        />
        <Tab.Screen 
          name="Reportes" 
          component={AdminReportScreen}
          options={{ title: 'Gestión de reportes' }}
        />
        <Tab.Screen 
          name="Usuarios" 
          component={AdminUsersScreen}
          options={{ title: 'Gestión de usuarios' }}
        />
        <Tab.Screen 
          name="Estadisticas" 
          component={AdminEstadisticScreen}
          options={{ title: 'Estadísticas y métricas' }}
        />
      </Tab.Navigator>
    </SafeArea>
  );
}