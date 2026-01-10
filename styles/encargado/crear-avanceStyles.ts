import { StyleSheet } from 'react-native';

export const crearAvanceStyles = StyleSheet.create({
  // Contenedor principal
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  
  // Header
  header: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 24,
    color: '#1e293b',
    marginBottom: 5,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#64748b',
  },
  
  // Sección de fotos
  photosSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 20,
  },
  photosTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 18,
    color: '#1e293b',
    marginBottom: 15,
  },
  photosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  addPhotoButton: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoIcon: {
    width: 32,
    height: 32,
    tintColor: '#94a3b8',
    marginBottom: 8,
  },
  addPhotoText: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 12,
    color: '#64748b',
  },
  photoItem: {
    width: 100,
    height: 100,
    borderRadius: 12,
    position: 'relative',
  },
  photoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  removePhotoButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#ef4444',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  removePhotoText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  
  // Sección de mensaje
  messageSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  messageTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 18,
    color: '#1e293b',
    marginBottom: 15,
  },
  messageInput: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    fontFamily: 'Montserrat_400Regular',
    fontSize: 15,
    color: '#1e293b',
    minHeight: 120,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'right',
    marginTop: 5,
  },
  characterCountError: {
    color: '#ef4444',
  },
  characterCountValid: {
    color: '#22c55e',
  },
  
  // Sección de tipo de actualización - SOLO ESTO MODIFICADO
  updateTypeSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  updateTypeTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 18,
    color: '#1e293b',
    marginBottom: 15,
  },
  updateTypeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  updateTypeButton: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    minHeight: 110, // AÑADIDO: Altura mínima
  },
  updateTypeButtonSelected: {
    backgroundColor: '#dbeafe',
    borderColor: '#2563EB',
  },
  updateTypeIcon: {
    width: 24,
    height: 24,
    marginBottom: 8,
    resizeMode: 'contain', // AÑADIDO
  },
  updateTypeLabel: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 11, // REDUCIDO de 14 a 12
    color: '#475569',
    marginBottom: 4,
    textAlign: 'center', // AÑADIDO
    width: '100%', // AÑADIDO
  },
  updateTypeButtonSelectedText: {
    color: '#2563EB',
  },
  updateTypeDescription: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 11,
    color: '#94a3b8',
    textAlign: 'center',
  },
  
  // Sección de estado
  statusSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  statusTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 18,
    color: '#1e293b',
    marginBottom: 15,
  },
  statusOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statusButton: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  statusButtonSelected: {
    backgroundColor: '#dbeafe',
    borderColor: '#2563EB',
  },
  statusIcon: {
    width: 20,
    height: 20,
    marginBottom: 6,
  },
  statusLabel: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 13,
    color: '#475569',
    textAlign: 'center',
  },
  statusButtonSelectedText: {
    color: '#2563EB',
  },
  
  // Información del reporte
  reportInfoSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  reportInfoTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 18,
    color: '#1e293b',
    marginBottom: 15,
  },
  reportInfoCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  reportInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationIcon: {
    width: 20,
    height: 20,
    tintColor: '#2563EB',
    marginRight: 10,
  },
  reportInfoText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 16,
    color: '#1e293b',
    flex: 1,
  },
  reportDescription: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    marginTop: 10,
  },
  
  // Botón de enviar
  sendButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 18,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  sendButtonDisabled: {
    backgroundColor: '#93c5fd',
  },
  sendIcon: {
    width: 20,
    height: 20,
    tintColor: '#FFFFFF',
    marginRight: 10,
  },
  sendButtonText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  
  // Estado de carga
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  
  // Mensajes de error/éxito
  messageContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  successContainer: {
    backgroundColor: '#dcfce7',
    borderWidth: 1,
    borderColor: '#86efac',
  },
  errorContainer: {
    backgroundColor: '#fee',
    borderWidth: 1,
    borderColor: '#fca5a5',
  },
  messageText: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 14,
    textAlign: 'center',
  },
  successText: {
    color: '#166534',
  },
  errorText: {
    color: '#b91c1c',
  },
  
  // Divisores
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 20,
    marginVertical: 20,
  },
});

export default crearAvanceStyles;