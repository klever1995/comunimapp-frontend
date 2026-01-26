// app/reportante/home.tsx
import { SafeArea } from '@/components/ui/safe-area';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Image, Text } from 'react-native';
import { homeStyles } from '../../styles/reportante/homeStyles';

// Importamos las pantallas
import HistoryScreen from './history';
import HomeMapScreen from './home-map'; // Usa ESTA importación
import ReportScreen from './report';

const Tab = createBottomTabNavigator();

// Navegador principal con tabs
export default function ReportanteHomeTabs() {
  return (
    <SafeArea>
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconSource;
          
          if (route.name === 'Home') {
            iconSource = require('@/assets/images/home.png');
          } else if (route.name === 'Report') {
            iconSource = require('@/assets/images/report.png');
          } else if (route.name === 'History') {
            iconSource = require('@/assets/images/history.png');
          }
          
          return (
            <Image
              source={iconSource}
              style={[
                homeStyles.tabIcon,
                { tintColor: focused ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.4)' }
              ]}
              resizeMode="contain"
            />
          );
        },
        tabBarLabel: ({ focused }) => {
          let label = '';
          if (route.name === 'Home') label = 'Inicio';
          if (route.name === 'Report') label = 'Reportar';
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
        component={HomeMapScreen}
        options={{ title: 'Mapa de zonas' }}
      />
      <Tab.Screen 
        name="Report" 
        component={ReportScreen}
        options={{ title: 'Nuevo Reporte' }}
      />
      <Tab.Screen 
        name="History" 
        component={HistoryScreen}
        options={{ title: 'Historial' }}
      />
    </Tab.Navigator>
    </SafeArea>
  );
}