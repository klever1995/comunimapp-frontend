import { StyleSheet, Platform } from 'react-native';

export const homeMapStyles = StyleSheet.create({
  // Contenedor principal
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC', // Gris muy claro para resaltar las tarjetas blancas
  },
  
  // Header con Efecto Cristal
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)', // Glassmorphism
    paddingVertical: 18,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 8,
    zIndex: 100,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800', // Montserrat ExtraBold
    color: '#0F172A',
    letterSpacing: -0.8,
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  // Botones Modernos
  notificationButton: {
    padding: 10,
    backgroundColor: 'rgba(37, 99, 235, 0.08)',
    borderRadius: 14,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#F97316',
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
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

  // Mapa
  contentContainer: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
    width: '100%',
  },
  
  // Leyenda Flotante Moderna
  legendContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    padding: 18,
    borderRadius: 24, // Bordes mucho más redondeados
    width: 170,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  legendTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
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

  // Botón de Alternancia (Heatmap)
  heatmapToggleButton: {
    position: 'absolute',
    bottom: 110,
    right: 20,
    width: 58,
    height: 58,
    borderRadius: 20, // Forma más cuadrada-redondeada moderna
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  heatmapToggleButtonActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  toggleLabel: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    fontSize: 9,
    fontWeight: '900',
    color: '#1E293B',
    textAlign: 'center',
    width: 58,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 6,
    paddingVertical: 2,
    overflow: 'hidden',
  },

  // Botón Flotante Principal
  floatingReportButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#2563EB',
    width: 64,
    height: 64,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },

  // Modal de Detalle (Rediseño Total)
  reportDetailModal: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderRadius: 30, // Mucho más redondo
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.15,
    shadowRadius: 35,
    elevation: 20,
    zIndex: 1000,
  },
  reportDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(226, 232, 240, 0.5)',
  },
  reportDetailTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 20,
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  reportDetailDescription: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 15,
    color: '#475569',
    lineHeight: 24,
    marginBottom: 20,
  },
  reportDetailLabel: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 12,
    color: '#94A3B8',
    width: 90,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  reportDetailText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: '#1E293B',
    flex: 1,
  },

  // Contador de Reportes (Badge del Header)
  reportCountBadge: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  reportCountText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 11,
    color: '#FFFFFF',
  },

  // Estados de Carga
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
});

export default homeMapStyles;