// app/styles/reportante/reportStyles.ts
import { StyleSheet } from 'react-native';

export const reportStyles = StyleSheet.create({
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
  
  // Sección de ubicación
  locationSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  locationTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 18,
    color: '#1e293b',
    marginBottom: 15,
  },
  locationCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  locationHeader: {
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
  locationText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 16,
    color: '#1e293b',
    flex: 1,
  },
  changeLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  editIcon: {
    width: 16,
    height: 16,
    tintColor: '#2563EB',
    marginRight: 6,
  },
  changeLocationText: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 14,
    color: '#2563EB',
  },
  coordinatesContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  coordinateRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  coordinateLabel: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 13,
    color: '#64748b',
    width: 80,
  },
  coordinateValue: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 13,
    color: '#475569',
    flex: 1,
  },
  
  // Sección de descripción
  descriptionSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  descriptionTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 18,
    color: '#1e293b',
    marginBottom: 15,
  },
  descriptionInput: {
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
  
  // Sección de anonimato
  anonymousSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  anonymousRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxContainer: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  checkIcon: {
    width: 14,
    height: 14,
    tintColor: '#FFFFFF',
  },
  anonymousContent: {
    flex: 1,
  },
  anonymousTitle: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 16,
    color: '#1e293b',
    marginBottom: 4,
  },
  anonymousText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
  },
  anonymousIcon: {
    width: 20,
    height: 20,
    tintColor: '#64748b',
    marginRight: 10,
  },
  
  // Sección de prioridad
  prioritySection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  priorityTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 18,
    color: '#1e293b',
    marginBottom: 15,
  },
  priorityOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  priorityButton: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  priorityButtonSelected: {
    backgroundColor: '#dbeafe',
    borderColor: '#2563EB',
  },
  priorityIcon: {
    width: 24,
    height: 24,
    marginBottom: 8,
  },
  priorityLabel: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: '#475569',
    marginBottom: 4,
  },
  priorityButtonSelectedText: {
    color: '#2563EB',
  },
  priorityDescription: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 11,
    color: '#94a3b8',
    textAlign: 'center',
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

  // Modal/Mapa
mapModal: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: '#FFFFFF',
  zIndex: 1000,
},
mapHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 20,
  paddingVertical: 15,
  backgroundColor: '#FFFFFF',
  borderBottomWidth: 1,
  borderBottomColor: '#e2e8f0',
},
mapTitle: {
  fontFamily: 'Roboto_700Bold',
  fontSize: 18,
  color: '#1e293b',
},
mapClose: {
  fontFamily: 'Montserrat_600SemiBold',
  fontSize: 16,
  color: '#2563EB',
},
map: {
  flex: 1,
},
mapInstructions: {
  padding: 15,
  backgroundColor: '#f8fafc',
  borderTopWidth: 1,
  borderTopColor: '#e2e8f0',
},
mapInstructionsText: {
  fontFamily: 'Montserrat_400Regular',
  fontSize: 14,
  color: '#64748b',
  textAlign: 'center',
},
});

export default reportStyles;