// app/styles/encargado/crear-avanceStyles.ts - VERSIÓN FUTURISTA
import { StyleSheet } from 'react-native';

export const crearAvanceStyles = StyleSheet.create({
  // Contenedor principal - FONDO OSCURO
  container: {
    flex: 1,
    backgroundColor: '#0A0F24',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  
  // Header - ESTILO FUTURISTA
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
  
  // Sección de fotos - ESTILO FUTURISTA
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
  
  // Sección de mensaje - ESTILO FUTURISTA
  messageSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  messageTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 16,
    color: '#E2E8F0',
    marginBottom: 10,
  },
  messageInput: {
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
  
  // Sección de tipo de actualización - ESTILO FUTURISTA
  updateTypeSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  updateTypeTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 16,
    color: '#E2E8F0',
    marginBottom: 12,
  },
  updateTypeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  updateTypeButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 14,
    padding: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    minHeight: 110,
  },
  updateTypeButtonSelected: {
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    borderColor: '#00D4FF',
  },
  updateTypeIcon: {
    width: 24,
    height: 24,
    marginBottom: 8,
    resizeMode: 'contain',
  },
  updateTypeLabel: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 11,
    color: '#94A3B8',
    marginBottom: 4,
    textAlign: 'center',
    width: '100%',
  },
  updateTypeButtonSelectedText: {
    color: '#FFFFFF',
  },
  updateTypeDescription: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
  },
  
  // Sección de estado - ESTILO FUTURISTA
  statusSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statusTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 16,
    color: '#E2E8F0',
    marginBottom: 12,
  },
  statusOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statusButton: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  statusButtonSelected: {
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    borderColor: '#00D4FF',
  },
  statusIcon: {
    width: 20,
    height: 20,
    marginBottom: 6,
  },
  statusLabel: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
  },
  statusButtonSelectedText: {
    color: '#FFFFFF',
  },
  
  // Información del reporte - ESTILO FUTURISTA
  reportInfoSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  reportInfoTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 16,
    color: '#E2E8F0',
    marginBottom: 12,
  },
  reportInfoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  reportInfoHeader: {
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
  reportInfoText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    flex: 1,
  },
  reportDescription: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#CBD5E1',
    lineHeight: 20,
    marginTop: 10,
  },
  
  // Botón de enviar - ESTILO FUTURISTA CON GRADIENTE
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
  
  // Estado de carga - ESTILO FUTURISTA
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
  
  // Mensajes de error/éxito - ESTILO FUTURISTA
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
  
  // Divisores - ESTILO FUTURISTA
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 20,
    marginVertical: 15,
  },
});

export default crearAvanceStyles;