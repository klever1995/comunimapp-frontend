import { StyleSheet, Platform } from 'react-native';

export const homeMapStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9', // Fondo gris muy tenue para resaltar el cristal
  },
  
  // Header con efecto cristal y alineación corregida
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)', // Glassmorphism
    paddingVertical: 15,
    paddingHorizontal: 16, // Padding ajustado para que nada se salga
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 100,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
    flexShrink: 1, // Permite que el título se ajuste si hay poco espacio
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10, // Espaciado controlado entre elementos
  },

  // Botón de Notificación Moderno
  notificationButton: {
    width: 42,
    height: 42,
    backgroundColor: 'rgba(37, 99, 235, 0.1)', // Fondo azul tenue
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
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

  // Botón Salir Corregido
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)', // Fondo rojo tenue
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  logoutIcon: {
    width: 18,
    height: 18,
    tintColor: '#EF4444',
  },
  logoutText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 13,
    color: '#EF4444',
  },

  // Contenido y Mapa
  contentContainer: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
    width: '100%',
  },
  
  // Leyenda de Cristal con bordes extra redondeados
  legendContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 18,
    borderRadius: 25, // Bordes muy redondeados
    width: 165,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  legendTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  legendText: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 13,
    color: '#334155',
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

  // Modal de Detalles Rediseñado
  reportDetailModal: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 30, // Bordes redondeados modernos
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 20,
    zIndex: 1000,
  },
  reportDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(226, 232, 240, 0.6)',
  },
  reportDetailTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 20,
    color: '#0F172A',
  },
  reportDetailDescription: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 15,
    color: '#475569',
    lineHeight: 22,
    marginBottom: 15,
  },
  reportDetailLabel: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 12,
    color: '#94A3B8',
    width: 90,
    textTransform: 'uppercase',
  },
  reportDetailText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: '#1E293B',
    flex: 1,
  },

  // Badge y Carga
  reportCountBadge: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginLeft: 6,
  },
  reportCountText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 11,
    color: '#FFFFFF',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
});

export default homeMapStyles;