// app/styles/admin/homeStyles.ts
import { StyleSheet } from 'react-native';

export const homeStyles = StyleSheet.create({
  // Contenedor principal (para el Tab Navigator)
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  
// Navegación inferior (Tabs) compacta y azul
  tabBar: {
    backgroundColor: 'rgba(37, 99, 235, 0.9)',
    borderTopWidth: 0, // Eliminamos la línea gris/blanca superior
    height: 50, // Altura compacta ajustada
    paddingBottom: 5,
    elevation: 0, // Elimina sombras grises en Android
  },

  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  tabIcon: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
  tabLabel: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 11,
  },
  tabLabelActive: {
    color: '#FFFFFF',
  },
  tabLabelInactive: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  
  
  // Estado vacío (si necesitas para otras pantallas de tabs)
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateIcon: {
    width: 100,
    height: 100,
    marginBottom: 20,
    tintColor:  'rgba(255, 255, 255, 0.8)',
  },
  emptyStateTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyStateText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default homeStyles;

