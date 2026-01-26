import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

export const userStyles = StyleSheet.create({
  // Contenedor principal - IGUAL A LAS OTRAS PANTALLAS
  container: {
    flex: 1,
    backgroundColor: '#e0ebf7ff',
  },
  
  // HEADER CON GRADIENTE - NUEVO (IGUAL A OTRAS PANTALLAS)
  headerContainer: {
    backgroundColor: '#667eea',
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  
  // STATS CARDS - MÁS ANCHOS
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16, // Reducido para más espacio
    marginTop: -10,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    width: (width - 48) / 3, // Más ancho
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  statValue: {
    fontSize: 23,
    fontFamily: 'Inter_900Black',
    color: '#1E293B',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13, // RESTAURADO a 13 (original)
    fontFamily: 'Inter_900Black',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  
  // CONTENEDOR DEL SCROLL - SIN PADDING HORIZONTAL
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 16,
    paddingBottom: 40,
  },
  
  // CONTADOR DE RESULTADOS - MEJORADO
  resultsCounter: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  resultsCounterText: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 14,
    color: '#64748b',
  },
  
  // FILTROS DESPLEGABLES - MÁS ANCHOS
  filtersContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16, // Reducido
    marginBottom: 16,
  },
  filterDropdown: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  filterDropdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  filterIcon: {
    width: 18,
    height: 18,
    marginRight: 10,
    tintColor: '#64748b',
  },
  filterArrowIcon: {
    width: 16,
    height: 16,
    tintColor: '#64748b',
    marginLeft: 8,
  },
  filterDropdownText: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 15,
    color: '#334155',
    flex: 1,
  },
  
  // HEADER ORIGINAL (mantenido por compatibilidad)
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
    resizeMode: 'contain',
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
  
  // TOP BAR (original - mantenido)
  topBar: {
    marginBottom: 16,
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
  
  // BOTÓN CREAR USUARIO - MÁS ANCHO
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 24,
    marginHorizontal: 16, // Reducido
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  createIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
    tintColor: '#FFFFFF',
    resizeMode: 'contain',
  },
  createButtonText: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  
  // LISTA DE USUARIOS - MUCHO MÁS ANCHA
  userList: {
    gap: 16,
    paddingHorizontal: 16, // Reducido para que los cards sean más anchos
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    padding: 20, // Aumentado
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    position: 'relative',
    marginHorizontal: 0, // Sin márgenes laterales
    width: '100%', // Ocupa todo el ancho disponible
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
    resizeMode: 'contain',
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
    fontSize: 12, // RESTAURADO a 12 (probable original)
    color: '#FFFFFF',
  },
  
  // DETALLES DEL USUARIO
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
    fontSize: 12, // RESTAURADO a 12 (probable original)
    color: '#FFFFFF',
  },
  
  // BOTONES DE ACCIÓN - CON ESTILOS ESPECÍFICOS
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  toggleButton: {
    backgroundColor: '#F97316',
  },
  deleteButton: {
    backgroundColor: '#DC2626',
  },
  actionIcon: {
    width: 16,
    height: 16,
    marginRight: 6,
    tintColor: '#FFFFFF',
    resizeMode: 'contain',
  },
  actionButtonText: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 14, // RESTAURADO a 14 (original)
    color: '#FFFFFF',
  },
  
  // MODALES PARA FILTROS - NUEVO (IGUAL A OTRAS PANTALLAS)
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  modalTitle: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 16,
    color: '#1e293b',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalOptionSelected: {
    backgroundColor: '#f8fafc',
  },
  modalOptionText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    color: '#334155',
    flex: 1,
  },
  modalOptionTextSelected: {
    fontFamily: 'Roboto_600SemiBold',
    color: '#2563EB',
  },
  modalCheckIcon: {
    width: 18,
    height: 18,
    tintColor: '#2563EB',
  },
  
  // MODALES ORIGINALES (mantenidos para compatibilidad)
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxHeight: '80%',
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
    resizeMode: 'contain',
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
  
  // ESTADOS DE CARGA Y ERROR
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 14,
    color: '#64748b',
    marginTop: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontFamily: 'Roboto_400Regular',
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
    fontFamily: 'Roboto_400Regular',
    fontSize: 15,
    color: '#dc2626',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 16,
  },
  retryButtonText: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
});

export default userStyles;