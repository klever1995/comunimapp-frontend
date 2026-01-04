// app/styles/admin/create-userStyles.ts
import { StyleSheet } from 'react-native';

export const createUserStyles = StyleSheet.create({
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
  sectionTitle: {
    marginTop: 16,
    marginBottom: 12,
    paddingLeft: 4,
  },
  sectionTitleText: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 18,
    color: '#1e293b',
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
  // Selector de rol
  roleSelector: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
  },
  roleButtonText: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 14,
    color: '#64748b',
  },
  roleButtonTextActive: {
    fontFamily: 'Roboto_700Bold',
    color: '#FFFFFF',
  },
  // Campos con iconos
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
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 24,
  },
  // Botones de acción
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 16,
    color: '#64748b',
  },
  createButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  createButtonDisabled: {
    opacity: 0.7,
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
  },
  createIcon: {
    width: 20,
    height: 20,
    marginLeft: 8,
    tintColor: '#FFFFFF',
  },
  // Información de seguridad
  securityContainer: {
    marginTop: 24,
    marginBottom: 40,
    alignItems: 'center',
  },
  securityText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
  },
});

export default createUserStyles;