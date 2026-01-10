// app/styles/admin/homeStyles.ts
import { StyleSheet } from 'react-native';

export const homeStyles = StyleSheet.create({
  // Contenedor principal (para el Tab Navigator)
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  
  // Navegación inferior (Tabs)
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    height: 60,
    paddingBottom: 5,
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
    color: '#2563EB',
  },
  tabLabelInactive: {
    color: '#94a3b8',
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
    tintColor: '#cbd5e1',
  },
  emptyStateTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 20,
    color: '#64748b',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyStateText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 15,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default homeStyles;