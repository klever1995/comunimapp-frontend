// app/styles/admin/userStyles.ts
import { StyleSheet } from 'react-native';

export const userStyles = StyleSheet.create({
  // Contenedor principal
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  // Header
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 12,
    resizeMode: 'contain', // ✅ AÑADIDO
  },
  title: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 26,
    color: '#1e293b',
    textAlign: 'center',
    lineHeight: 32,
  },
  subtitle: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 10,
  },

  // Top Bar
  topBar: {
    marginBottom: 16,
  },
  filtersContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  filterIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain', // ✅ AÑADIDO
  },
  filterButtonText: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 14,
    color: '#334155',
    marginLeft: 8,
  },
  counterContainer: {
    marginBottom: 16,
  },
  counterText: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },

  // Botón Crear Usuario
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 24,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  createIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
    tintColor: '#FFFFFF',
    resizeMode: 'contain', // ✅ AÑADIDO
  },
  createButtonText: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },

  // Lista de Usuarios
  userList: {
    gap: 16,
  },
  userCard: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  roleIcon: {
    width: 40,
    height: 40,
    marginRight: 12,
    resizeMode: 'contain', // ✅ AÑADIDO
  },
  userTextContainer: {
    flex: 1,
  },
  username: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 18,
    color: '#1e293b',
    marginBottom: 2,
  },
  youBadge: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 14,
    color: '#64748b',
  },
  email: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#64748b',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 11,
    color: '#FFFFFF',
  },

  // Detalles del Usuario
  userDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 13,
    color: '#64748b',
    width: 100,
  },
  detailValue: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 13,
    color: '#1e293b',
    flex: 1,
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  roleBadgeText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 11,
    color: '#FFFFFF',
  },

  // Botones de Acción
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  actionIcon: {
    width: 16,
    height: 16,
    marginRight: 6,
    tintColor: '#FFFFFF',
    resizeMode: 'contain', // ✅ AÑADIDO
  },
  actionButtonText: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 12,
    color: '#FFFFFF',
  },

  // Estados de carga y vacío
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#64748b',
    marginTop: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 15,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 22,
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  errorText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 15,
    color: '#dc2626',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 22,
  },

  // Modales
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 20,
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalContent: {
    maxHeight: 400,
    marginBottom: 20,
  },
  modalSection: {
    marginBottom: 20,
  },
  modalSectionTitle: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 16,
    color: '#1e293b',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 4,
  },
  modalDetailLabel: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 14,
    color: '#64748b',
  },
  modalDetailValue: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 14,
    color: '#1e293b',
  },
  modalUserInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalUserName: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 18,
    color: '#1e293b',
    marginBottom: 4,
  },
  modalUserRole: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 14,
    color: '#64748b',
  },
  modalActionsList: {
    marginBottom: 20,
  },
  modalActionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  modalActionIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
    resizeMode: 'contain', // ✅ AÑADIDO
  },
  modalActionText: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
    color: '#1e293b',
  },
  modalCloseButton: {
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
  },
  modalCloseText: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 16,
    color: '#64748b',
  },
});

export default userStyles;