import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

export const reportStyles = StyleSheet.create({
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
  
  // STATS CARDS - MÁS ANCHOS (igual que usuarios)
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: -10,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    width: (width - 48) / 3,
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
    fontSize: 10,
    fontFamily: 'Inter_900Black',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  
  // CONTENEDOR DEL SCROLL - SIN PADDING HORIZONTAL (igual que usuarios)
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
  
  // FILTROS DESPLEGABLES - MÁS ANCHOS (igual que usuarios)
  filtersContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
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
  title: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 26,
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 32,
  },
  subtitle: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  
  // CONTENEDOR DE CONTADOR (original - mantenido)
  counterContainer: {
    marginBottom: 16,
  },
  counterText: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  
  // LISTA DE REPORTES - IGUAL QUE USUARIOS
  reportList: {
    gap: 16,
    paddingHorizontal: 16,
  },
  
  // TARJETA DE REPORTE - MÁS ANCHA (igual que usuarios)
  reportCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    position: 'relative',
    marginHorizontal: 0,
    width: '100%',
  },
  
  // BADGES DE PRIORIDAD Y ESTADO
  statusBadges: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 11,
    color: '#FFFFFF',
  },
  
  // ENCABEZADO DE TARJETA
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  
  // DESCRIPCIÓN
  descriptionText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 12,
  },
  
  // INFORMACIÓN ADICIONAL
  infoContainer: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  infoLabel: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 13,
    color: '#64748b',
    width: 100,
  },
  infoValue: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 13,
    color: '#1e293b',
    flex: 1,
  },
  
  // IMÁGENES - MEJORADO
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  imageThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#e2e8f0',
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderIcon: {
    width: 24,
    height: 24,
    opacity: 0.5,
    resizeMode: 'contain',
  },
  
  // FOOTER DE TARJETA
  reportFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateIcon: {
    width: 14,
    height: 14,
    marginRight: 6,
    opacity: 0.7,
    resizeMode: 'contain',
  },
  dateText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 13,
    color: '#64748b',
  },
  
  // BOTONES DE ACCIÓN - 4 BOTONES PARA ADMIN
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
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
  assignButton: {
    backgroundColor: '#3B82F6',
  },
  statusButton: {
    backgroundColor: '#8B5CF6',
  },
  advancesButton: {
    backgroundColor: '#10B981',
  },
  deleteButton: {
    backgroundColor: '#EF4444',
  },
  actionButtonText: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 12,
    color: '#FFFFFF',
    marginLeft: 4,
  },
  
  // ICONO DE USUARIO ANÓNIMO
  userIconContainer: {
    marginLeft: 8,
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
  
  // MODALES PARA ASIGNAR/CAMBIAR ESTADO (originales - mantenidos)
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxHeight: '80%',
  },
  modalSubtitle: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalList: {
    maxHeight: 300,
    marginBottom: 20,
  },
  modalItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalItemContent: {
    flex: 1,
  },
  modalItemText: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
    color: '#1e293b',
  },
  modalItemSubtext: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  modalCancelButton: {
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
  },
  modalCancelText: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 16,
    color: '#64748b',
  },
  
  // LOADING Y ESTADOS DE ERROR
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
});

export default reportStyles;