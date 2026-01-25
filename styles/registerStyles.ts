// app/styles/registerStyles.ts
import { StyleSheet } from 'react-native';

export const registerStyles = StyleSheet.create({
  // Contenedor principal
  container: {
    flex: 1,
    backgroundColor: '#0A0F24',
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
  },
  
  // Fondo con gradiente
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  
  // Partículas decorativas
  particlesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  particle1: {
    position: 'absolute',
    top: '10%',
    left: '5%',
    width: 70,
    height: 70,
    backgroundColor: 'rgba(0, 212, 255, 0.04)',
    borderRadius: 35,
  },
  particle2: {
    position: 'absolute',
    top: '65%',
    right: '3%',
    width: 100,
    height: 100,
    backgroundColor: 'rgba(106, 13, 173, 0.04)',
    borderRadius: 50,
  },
  particle3: {
    position: 'absolute',
    bottom: '15%',
    left: '15%',
    width: 60,
    height: 60,
    backgroundColor: 'rgba(255, 65, 108, 0.04)',
    borderRadius: 30,
  },
  
  // Header
  header: {
    alignItems: 'center',
    marginBottom: 25,
    zIndex: 2,
  },
  title: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 34,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  titleGradient: {
    color: '#00D4FF',
  },
  subtitle: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 15,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 15,
  },
  
  // Tarjeta de formulario
  blurCard: {
    borderRadius: 20,
    overflow: 'hidden',
    zIndex: 2,
    marginTop: 5,
  },
  formContainer: {
    width: '100%',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  
  // Grupos de inputs
  inputGroup: {
    marginBottom: 18,
  },
  inputLabel: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 13,
    color: '#E2E8F0',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  
  // Contenedor de input
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 14,
    height: 52,
  },
  
  // Elementos del input
  leftIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
    tintColor: '#94A3B8',
  },
  input: {
    flex: 1,
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    color: '#FFFFFF',
    height: '100%',
    paddingVertical: 0,
  },
  eyeIcon: {
    width: 22,
    height: 22,
    tintColor: '#94A3B8',
  },
  eyeButton: {
    padding: 4,
  },
  
  // Separador
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  
  // Botón de registro
  registerButton: {
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 5,
    shadowColor: '#00D4FF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerButtonDisabled: {
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 16,
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  buttonIcon: {
    width: 20,
    height: 20,
    marginLeft: 8,
    tintColor: '#FFFFFF',
  },
  
  // Enlaces
  linksContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
  },
  linkHighlight: {
    color: '#00D4FF',
    fontFamily: 'Montserrat_600SemiBold',
  },
  
  // Mensaje de seguridad
  securityContainer: {
    marginTop: 22,
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
    lineHeight: 16,
  },
});

export default registerStyles;