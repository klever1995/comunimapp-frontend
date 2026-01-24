// app/styles/registerStyles.ts
import { Platform, StyleSheet } from 'react-native';

export const registerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 0,
  },
  header: {
    alignItems: 'center',
    marginBottom: 0,
    marginTop: 30, 
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
    marginBottom: 25,
  },
  formContainer: {
    width: '100%',
    marginTop: 5,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 15,
    color: '#334155',
    marginBottom: 6,
  },
  input: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    color: '#1e293b',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    height: 48,
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 24,
  },
  loginButton: {
    backgroundColor: '#2563EB',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  loginButtonDisabled: {
    backgroundColor: '#93c5fd',
  },
  loginButtonText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  linksContainer: {
    marginTop: 24,
    alignItems: 'center',
    gap: 12,
  },
  linkText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 13,
    color: '#64748b',
  },
  registerHighlight: {
    color: '#2563EB',
    fontFamily: 'Montserrat_600SemiBold',
  },
  securityContainer: {
    marginTop: 32,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  securityText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 13,
    color: '#94a3b8',
    fontStyle: 'italic',
  },

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
  },
  leftIconNew: {
    position: 'absolute',
    left: 14,
    top: 14,
    zIndex: 2,
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
  },
  loginButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  loginIcon: {
    width: 20,
    height: 20,
    marginLeft: 8,
  },

  // Estilos del Toast Mejorado
  toastContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    zIndex: 9999,
    gap: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  toastText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: 20,
  },
});

export default registerStyles;