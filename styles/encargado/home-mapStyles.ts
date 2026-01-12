import { StyleSheet } from 'react-native';

// Copia exacta de los estilos del reportante, podemos modificarlos después
export const homeMapStyles = StyleSheet.create({
  // Contenedor principal
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 22,
    color: '#1e293b',
  },
  notificationButton: {
    padding: 8,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#F97316',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  notificationIcon: {
    width: 24,
    height: 24,
    tintColor: '#64748b',
  },
  
  // Contenido del mapa
  contentContainer: {
    flex: 1,
    position: 'relative',
  },
  
  // Mapa real
  mapContainer: {
    flex: 1,
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  
  // Placeholder cuando no hay reportes
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  mapPlaceholder: {
    width: '90%',
    height: '70%',
    backgroundColor: '#e2e8f0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#cbd5e1',
    borderStyle: 'dashed',
  },
  mapIcon: {
    width: 80,
    height: 80,
    tintColor: '#94a3b8',
  },
  mapPlaceholderText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  
  // Leyenda de prioridades
  legendContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 16,
    width: 180,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  legendTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 16,
    color: '#1e293b',
    marginBottom: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 10,
  },
  legendText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#475569',
  },
  
  // Botón flotante
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#2563EB',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  floatingButtonIcon: {
    width: 28,
    height: 28,
    tintColor: '#FFFFFF',
  },
  
  // Modal de detalles del reporte
  reportDetailModal: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    zIndex: 1000,
  },
  reportDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 10,
  },
  reportDetailTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 18,
    color: '#1e293b',
    flex: 1,
  },
  reportDetailClose: {
    fontSize: 20,
    color: '#64748b',
    paddingHorizontal: 10,
    fontFamily: 'Roboto_700Bold',
  },
  reportDetailContent: {
    marginTop: 5,
  },
  reportDetailDescription: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 15,
    color: '#475569',
    lineHeight: 22,
    marginBottom: 15,
  },
  reportDetailInfo: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  reportDetailLabel: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 14,
    color: '#64748b',
    width: 80,
  },
  reportDetailText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#1e293b',
    flex: 1,
  },
  
  // Estados de carga
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  loadingText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 15,
    color: '#64748b',
    marginTop: 10,
  },
  
  // Contador de reportes
  reportCountBadge: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 10,
  },
  reportCountText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 12,
    color: '#FFFFFF',
  },

headerRightContainer: {
  flexDirection: 'row',
  alignItems: 'center',
},
logoutButton: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 12,
  paddingVertical: 8,
  backgroundColor: '#fef2f2',
  borderRadius: 8,
  borderWidth: 1,
  borderColor: '#dc2626',
  marginLeft: 8,
},
logoutIcon: {
  width: 18,
  height: 18,
  tintColor: '#dc2626',
  marginRight: 6,
},
logoutText: {
  fontFamily: 'Roboto_600SemiBold',
  fontSize: 14,
  color: '#dc2626',
  marginLeft: 2,
},
});

export default homeMapStyles;