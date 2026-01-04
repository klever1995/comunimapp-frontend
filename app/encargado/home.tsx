// app/encargado/home.tsx
import { SafeArea } from '@/components/ui/safe-area';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Image, Text } from 'react-native';
import { homeStyles } from '../styles/encargado/homeStyles';

// Importamos las pantallas del encargado (las crearemos después)
import EncargadoHistoryScreen from './history'; // Por crear
import EncargadoHomeMapScreen from './home-map'; // Por crear

const Tab = createBottomTabNavigator();

// Navegador principal con tabs para el encargado
export default function EncargadoHomeTabs() {
  return (
    <SafeArea>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconSource;
            
            if (route.name === 'Home') {
              iconSource = require('@/assets/images/home.png');
            } else if (route.name === 'History') {
              iconSource = require('@/assets/images/history.png');
            }
            
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
          },
          tabBarLabel: ({ focused }) => {
            let label = '';
            if (route.name === 'Home') label = 'Inicio';
            if (route.name === 'History') label = 'Historial';
            
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
          name="Home" 
          component={EncargadoHomeMapScreen}
          options={{ title: 'Mapa de reportes asignados' }}
        />
        <Tab.Screen 
          name="History" 
          component={EncargadoHistoryScreen}
          options={{ title: 'Historial de reportes' }}
        />
      </Tab.Navigator>
    </SafeArea>
  );
}