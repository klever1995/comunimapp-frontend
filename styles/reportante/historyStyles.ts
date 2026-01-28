import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

export const historyStyles = StyleSheet.create({
  // Contenedor principal
  container: {
    flex: 1,
    backgroundColor: '#e0ebf7ff',
  },
  
  // HEADER CON GRADIENTE 
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
  
  // STATS CARDS 
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
    fontSize: 14, 
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
  
  // FILTROS - MÁS ANCHOS
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
  
  // CONTADOR DE RESULTADOS
  resultsCounter: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  resultsCounterText: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 14,
    color: '#64748b',
  },
  
  // LISTA DE REPORTES - MÁS ANCHA
  reportList: {
    gap: 16,
    paddingHorizontal: 16,
  },
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
    marginHorizontal: 0, 
    width: '100%', 
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
  
  // IMÁGENES
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  imagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderIcon: {
    width: 24,
    height: 24,
    opacity: 0.5,
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
  },
  dateText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 13,
    color: '#64748b',
  },
  statusContainer: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#f8fafc',
    borderRadius: 20,
  },
  statusText: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 12,
    color: '#475569',
    textTransform: 'capitalize',
  },
  
  // BOTONES DE ACCIÓN
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
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
  advancesButton: {
    backgroundColor: '#2563EB',
  },
  deleteButton: {
    backgroundColor: '#dc2626',
  },
  actionButtonText: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 6,
  },
  
  // ICONO DE USUARIO ANÓNIMO
  userIconContainer: {
    position: 'absolute',
    top: 16, 
    right: 16, 
  },
  
  // MODALES
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