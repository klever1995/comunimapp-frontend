// styles/notificationStyles.ts
import { Platform, StyleSheet } from 'react-native';

export const notificationStyles = StyleSheet.create({
  // Contenedor Ultra Moderno
  modernContainer: {
    flex: 1,
    backgroundColor: '#fffffff8',
  },

  // Header Glassmorphism Style
  modernHeader: {
    backgroundColor: '#FFFFFF',
    paddingTop: 16,
    paddingBottom: 0,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  modernBackButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  modernHeaderTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: -0.5,
  },
  headerBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 28,
    alignItems: 'center',
  },
  headerBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFF',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  modernActionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  // Filtros Ultra Modernos
  modernFilters: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  modernFilterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  modernFilterActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
    ...Platform.select({
      ios: {
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  modernFilterText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  modernFilterTextActive: {
    color: '#FFF',
  },
  modernFilterBadge: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 24,
    alignItems: 'center',
  },
  modernFilterBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  modernFilterBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
  },
  modernFilterBadgeTextActive: {
    color: '#FFF',
  },

  // ScrollView Moderno
  modernScrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
  },

  // Lista Moderna
  modernList: {
    paddingHorizontal: 20,
    gap: 16,
  },

  // Card Ultra Moderna con Glassmorphism
  modernCard: {
    position: 'relative',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  modernCardUnread: {
    ...Platform.select({
      ios: {
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  glowEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    opacity: 0.6,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
  },

  // Icono Ultra Moderno con Efectos
  modernIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  iconGlow: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 18,
    opacity: 0.2,
  },
  pulseDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFF',
  },

  // Contenido de la Card
  modernContent: {
    flex: 1,
    gap: 8,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  modernTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    lineHeight: 20,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  modernTime: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  modernMessage: {
    fontSize: 14,
    lineHeight: 20,
    color: '#475569',
  },

  // Footer de la Card
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  modernBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 6,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  modernBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  modernDeleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Indicador Lateral
  sideIndicator: {
    position: 'absolute',
    left: 0,
    top: '50%',
    width: 4,
    height: '40%',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    transform: [{ translateY: -20 }],
  },

  // Estado Vacío Ultra Moderno
  modernEmpty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
    paddingHorizontal: 40,
  },
  emptyIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 3,
    borderColor: '#E2E8F0',
  },
  modernEmptyTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'center',
  },
  modernEmptySubtitle: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
  },

  // Loading Ultra Moderno
  modernLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    gap: 24,
  },
  loadingCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  modernLoadingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
  },

  // Footer Ultra Moderno
  modernFooter: {
    backgroundColor: '#ffffff8c',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    alignItems: 'center',
  },
  footerIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  modernFooterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },

  // Toast Ultra Moderno
  modernToast: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    zIndex: 10000,
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  modernToastContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  toastIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modernToastText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
    lineHeight: 20,
  },
});