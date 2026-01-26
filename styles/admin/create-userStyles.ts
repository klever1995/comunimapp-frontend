// app/styles/admin/create-userStyles.ts - VERSIÓN FUTURISTA
import { StyleSheet } from 'react-native';

export const createUserStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0F24',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 0,
  },
  header: {
    alignItems: 'center',
    marginBottom: 0,
    marginTop: 25,
  },
  title: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 26,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 32,
    textShadowColor: 'rgba(0, 212, 255, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 15,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 10,
    marginBottom: 25,
    opacity: 0.9,
  },
  formContainer: {
    width: '100%',
    marginTop: 5,
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 12,
    paddingLeft: 4,
  },
  sectionTitleText: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 18,
    color: '#E2E8F0',
  },
  inputGroup: {
    marginBottom: 18,
  },
  inputLabel: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 15,
    color: '#E2E8F0',
    marginBottom: 6,
  },
  input: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    color: '#FFFFFF',
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    height: 48,
  },
  // Selector de rol - ESTILO FUTURISTA
  roleSelector: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
  },
  roleButtonText: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 14,
    color: '#94A3B8',
  },
  roleButtonTextActive: {
    fontFamily: 'Roboto_700Bold',
    color: '#FFFFFF',
  },
  // Campos con iconos - ESTILO FUTURISTA
  inputWithIconContainer: {
    position: 'relative',
    width: '100%',
  },
  leftIcon: {
    width: 20,
    height: 20,
    position: 'absolute',
    left: 14,
    top: 14,
    zIndex: 2,
    tintColor: '#94A3B8',
  },
  eyeIconContainer: {
    position: 'absolute',
    right: 14,
    top: 12,
    padding: 4,
    zIndex: 2,
  },
  eyeIcon: {
    width: 22,
    height: 22,
    tintColor: '#94A3B8',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 20,
  },
  // Botones de acción - ESTILO FUTURISTA
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 16,
    color: '#94A3B8',
  },
  createButton: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#00D4FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    overflow: 'hidden',
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 16,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  createIcon: {
    width: 20,
    height: 20,
    marginLeft: 8,
    tintColor: '#FFFFFF',
  },
  // Información de seguridad - ESTILO FUTURISTA
  securityContainer: {
    marginTop: 24,
    marginBottom: 40,
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  securityText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default createUserStyles;