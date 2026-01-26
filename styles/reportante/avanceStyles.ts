import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

export const avanceStyles = StyleSheet.create({
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
  
  // STATS CARDS - SOBREPUESTAS AL HEADER
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 24,
    marginTop: -10,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    width: (width - 64) / 3,
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
  
  // CONTENEDOR DEL SCROLL
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 40,
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
  
  // HEADER ORIGINAL (alternativo)
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
  
  // INFORMACIÓN DEL REPORTE
  reportInfoCard: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  reportInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationIcon: {
    width: 18,
    height: 18,
    marginRight: 8,
    resizeMode: 'contain',
  },
  reportLocation: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 16,
    color: '#1e293b',
    flex: 1,
  },
  reportDescription: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 12,
  },
  reportStatusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  statusLabel: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 13,
    color: '#475569',
  },
  statusValue: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 13,
    color: '#2563EB',
    textTransform: 'capitalize',
  },
  
  // LISTA DE ACTUALIZACIONES
  updatesList: {
    gap: 16,
  },
  updateCard: {
    backgroundColor: '#FFFFFF',
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
  updateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  updateTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  updateIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
    resizeMode: 'contain',
  },
  updateTypeText: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 15,
    color: '#1e293b',
    textTransform: 'capitalize',
  },
  updateDate: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
    color: '#64748b',
    textAlign: 'right',
  },
  updateMessage: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
    marginBottom: 12,
  },
  
  // ESTILO PARA EL BADGE DE TIPO DE ACTUALIZACIÓN (nuevo)
  updateTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  
  // CAMBIO DE ESTADO
  statusChangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  statusChangeIcon: {
    width: 16,
    height: 16,
    marginRight: 8,
    resizeMode: 'contain',
  },
  statusChangeText: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 13,
    color: '#0369a1',
  },
  
  // IMÁGENES
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
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
  
  // CONTENEDOR DE FECHA
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
  
  // LOADING Y ESTADOS DE ERROR
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

export default avanceStyles;