// app/styles/reportante/reportStyles.ts - VERSIÓN MEJORADA
import { StyleSheet } from 'react-native';

export const reportStyles = StyleSheet.create({
  // Contenedor principal - USANDO DISEÑO FUTURISTA
  container: {
    flex: 1,
    backgroundColor: '#0A0F24',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  
  // Header - MANTENIENDO para compatibilidad
  header: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
    backgroundColor: 'transparent',
  },
  headerTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 5,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#94A3B8',
  },
  
  // Sección de fotos - MEJORADO con diseño futurista
  photosSection: {
    paddingHorizontal: 20,
    paddingTop: 15,
    marginBottom: 15,
  },
  photosTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 16,
    color: '#E2E8F0',
    marginBottom: 12,
  },
  photosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  addPhotoButton: {
    width: 90,
    height: 90,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoIcon: {
    width: 28,
    height: 28,
    tintColor: '#94a3b8',
    marginBottom: 6,
  },
  addPhotoText: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 11,
    color: '#94a3b8',
  },
  photoItem: {
    width: 90,
    height: 90,
    borderRadius: 14,
    position: 'relative',
    overflow: 'hidden',
  },
  photoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
  },
  removePhotoButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#ef4444',
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  removePhotoText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  
  // Sección de ubicación - MEJORADA
  locationSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  locationTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 16,
    color: '#E2E8F0',
    marginBottom: 12,
  },
  locationCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationIcon: {
    width: 20,
    height: 20,
    tintColor: '#00D4FF',
    marginRight: 10,
  },
  locationText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 15,
    color: '#FFFFFF',
    flex: 1,
  },
  changeLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
  },
  editIcon: {
    width: 16,
    height: 16,
    tintColor: '#00D4FF',
    marginRight: 6,
  },
  changeLocationText: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 13,
    color: '#00D4FF',
  },
  coordinatesContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  coordinateRow: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'center',
  },
  coordinateLabel: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 12,
    color: '#94A3B8',
    width: 80,
  },
  coordinateValue: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 13,
    color: '#FFFFFF',
    flex: 1,
  },
  
  // Sección de descripción - MEJORADA
  descriptionSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  descriptionTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 16,
    color: '#E2E8F0',
    marginBottom: 10,
  },
  descriptionInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    fontFamily: 'Montserrat_400Regular',
    fontSize: 15,
    color: '#FFFFFF',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'right',
    marginTop: 6,
  },
  characterCountError: {
    color: '#ff6b6b',
  },
  characterCountValid: {
    color: '#00D4FF',
  },
  
  // Sección de anonimato - MEJORADA
  anonymousSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
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
    borderColor: '#94A3B8',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    borderColor: '#00D4FF',
  },
  checkIcon: {
    width: 14,
    height: 14,
    tintColor: '#00D4FF',
  },
  anonymousContent: {
    flex: 1,
  },
  anonymousTitle: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 15,
    color: '#E2E8F0',
    marginBottom: 4,
  },
  anonymousText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 13,
    color: '#94A3B8',
    lineHeight: 18,
  },
  
  // Sección de prioridad - MEJORADA
  prioritySection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  priorityTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 16,
    color: '#E2E8F0',
    marginBottom: 12,
  },
  priorityOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  priorityButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 14,
    padding: 14,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  priorityButtonSelected: {
    backgroundColor: 'rgba(0, 212, 255, 0.08)',
    borderColor: '#00D4FF',
  },
  priorityIcon: {
    width: 24,
    height: 24,
    marginBottom: 8,
  },
  priorityLabel: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 13,
    color: '#94A3B8',
    marginBottom: 4,
  },
  priorityButtonSelectedText: {
    color: '#FFFFFF',
  },
  priorityDescription: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
  },
  
  // Botón de enviar - MEJORADO con gradiente
  sendButton: {
    borderRadius: 14,
    overflow: 'hidden',
    marginHorizontal: 20,
    marginTop: 10,
    shadowColor: '#00D4FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendIcon: {
    width: 20,
    height: 20,
    tintColor: '#FFFFFF',
    marginRight: 10,
  },
  sendButtonText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  
  // Estado de carga
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10, 15, 36, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  
  // Mensajes de error/éxito - MEJORADOS
  messageContainer: {
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
  },
  successContainer: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  errorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  messageText: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  successText: {
    color: '#22C55E',
  },
  errorText: {
    color: '#EF4444',
  },
  
  // Divisores
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 20,
    marginVertical: 15,
  },

  // Modal/Mapa - MEJORADO
  mapModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0A0F24',
    zIndex: 1000,
  },
  mapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#1B263B',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  mapTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  mapClose: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 16,
    color: '#00D4FF',
  },
  map: {
    flex: 1,
  },
  mapInstructions: {
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  mapInstructionsText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
  },
});

export default reportStyles;