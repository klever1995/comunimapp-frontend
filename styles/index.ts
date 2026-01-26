import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

export const loginStyles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  keyboardAvoid: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: 25,
    paddingVertical: 20,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: height * 0.02,
    marginBottom: 10,
  },
  logo: {
    width: width * 0.32, 
    height: width * 0.32,
    marginBottom: 15,
  },
  title: {
    fontFamily: 'Roboto_700Bold',
    fontSize: width * 0.06, 
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: width * 0.07,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: width * 0.035, 
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: width * 0.045,
    paddingHorizontal: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  formContainer: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.55)', 
    borderRadius: 22,
    paddingHorizontal: 25,
    paddingVertical: 35, // Un poco más de espacio vertical al quitar el link
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 15,
  },
  inputContainer: {
    marginBottom: 25,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputIcon: {
    width: 22,
    height: 22,
    tintColor: '#FFFFFF',
    marginRight: 12,
  },
  inputLabel: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 15,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  input: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 17,
    color: '#FFFFFF',
    height: 45,
  },
  inputUnderline: {
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
  },
  passwordInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  eyeButton: {
    padding: 10,
    position: 'absolute',
    right: 0,
  },
  eyeIcon: {
    width: 24,
    height: 24,
    tintColor: '#FFFFFF',
  },
  loginButton: {
    backgroundColor: '#2563EB',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10, // Espacio arriba del botón
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  loginButtonDisabled: {
    backgroundColor: '#93C5FD',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 18,
    color: '#FFFFFF',
    marginRight: 12,
  },
  loginIcon: {
    width: 22,
    height: 22,
    tintColor: '#FFFFFF',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  signupText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 15,
    color: '#FFFFFF',
  },
  signupLink: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 15,
    color: '#FDE047', 
    textDecorationLine: 'underline',
    marginLeft: 5,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    width: '100%',
    marginTop: 10,
  },
  footerText: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 13,
    color: '#FFFFFF',
    letterSpacing: 1,
    textAlign: 'center',
  },
});

export default loginStyles;