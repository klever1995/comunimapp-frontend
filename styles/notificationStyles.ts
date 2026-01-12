// styles/notificationStyles.ts
import { StyleSheet } from 'react-native';

export const notificationStyles = StyleSheet.create({
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
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: '#1e293b',
  },
  headerTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 24,
    color: '#1e293b',
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: '#F97316',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginLeft: 10,
  },
  unreadBadgeText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 12,
    color: '#FFFFFF',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerIcon: {
    width: 24,
    height: 24,
    tintColor: '#64748b',
  },
  
  // Filtros
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#e2e8f0',
    marginRight: 12,
  },
  filterButtonActive: {
    backgroundColor: '#2563EB',
  },
  filterButtonText: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 14,
    color: '#64748b',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  
  // Contenido
  content: {
    flex: 1,
  },
  
  // Lista de notificaciones
  notificationsList: {
    padding: 20,
    paddingTop: 10,
  },
  
  // Tarjeta de notificación
  notificationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    flexDirection: 'row',
    position: 'relative',
  },
  notificationCardUnread: {
    backgroundColor: '#f0f9ff',
    borderColor: '#2563EB20',
  },
  unreadIndicator: {
    position: 'absolute',
    top: 16,
    left: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563EB',
  },
  
  // Icono
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  icon: {
    width: 24,
    height: 24,
  },
  
  // Contenido de notificación
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  notificationTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 16,
    color: '#1e293b',
    flex: 1,
    marginRight: 12,
  },
  notificationTime: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
    color: '#94a3b8',
  },
  notificationMessage: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 12,
  },
  
  // Tipo de notificación
  notificationTypeContainer: {
    flexDirection: 'row',
  },
  notificationTypeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  notificationTypeText: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 10,
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  
  // Botón eliminar
  deleteButton: {
    padding: 8,
    marginLeft: 8,
    alignSelf: 'flex-start',
  },
  deleteIcon: {
    width: 16,
    height: 16,
    tintColor: '#94a3b8',
  },
  
  // Estado vacío
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    width: 120,
    height: 120,
    tintColor: '#cbd5e1',
    marginBottom: 24,
  },
  emptyTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 20,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 20,
  },
  
  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 16,
    color: '#64748b',
    marginTop: 16,
  },
  
  // Footer
  footer: {
    padding: 16,
    backgroundColor: '#f8fafc',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    alignItems: 'center',
  },
  footerText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
});

export default notificationStyles;