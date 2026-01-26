import { Platform, StyleSheet } from 'react-native';

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
    paddingTop: Platform.OS === 'ios' ? 45 : 3, 
    paddingBottom: 1,
    backgroundColor: 'rgba(37, 99, 235, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },

headerTitle: {
  fontSize: 20, // Un poco más pequeño para ahorrar espacio
  fontWeight: '800',
  color: '#FFFFFF', // Texto blanco para contraste
  letterSpacing: -0.5,
},

  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10, // Espaciado controlado entre elementos
  },
  notificationButton: {
    padding: 8,
    position: 'relative',
    marginRight: 10,
  },

    notificationBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#F97316',
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },

notificationIcon: {
  width: 24,
  height: 24,
  tintColor: '#FFFFFF', // Icono blanco
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


   // Leyenda de Cristal con bordes extra redondeados
  legendContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 16,
    width: 140,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

    legendTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 16,
    color: '#64748B',
    marginBottom: 5,
  },

  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },

  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 8,
    marginRight: 5,
  },
  legendText: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 14,
    color: '#475569',
  },

  // Botón flotante para ver detalles
  floatingReportButton: {
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


logoutButton: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#FFFFFF', 
  paddingHorizontal: 10,
  paddingVertical: 4, // Padding vertical mínimo
  borderRadius: 8,
},

  logoutIcon: {
    width: 18,
    height: 18,
    tintColor: '#EF4444',
    marginRight: 5,
  },

logoutText: {
  fontFamily: 'Roboto_700Bold',
  fontSize: 14,
  color: '#EF4444',
},

  // Botón Heatmap Modernizado
  heatmapToggleButton: {
    position: 'absolute',
    bottom: 110,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  heatmapToggleButtonActive: {
    backgroundColor: '#2563EB',
  },
  toggleLabel: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    fontSize: 9,
    fontWeight: '900',
    color: '#2563EB',
    textAlign: 'center',
    width: 56,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 6,
    paddingVertical: 2,
  },
});

export default homeMapStyles