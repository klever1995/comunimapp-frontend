// styles/encargado/welcomeStyles.ts
import { Dimensions, Platform, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

export const welcomeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',

  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },

  // Header con Estilo Moderno (Sin Gradiente)
  headerGradient: {
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#1e40afd8',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    ...Platform.select({
      ios: {
        shadowColor: '#1E40AF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  logoWrapper: {
    width: 160,
    height: 160,
    backgroundColor: 'transparent',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  logoImage: {
    width: 160,
    height: 160,
  },
  roleBadgeNew: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0EA5E9',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    gap: 8,
  },
  roleTextNew: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
    letterSpacing: 1.5,
  },

  // Contenido Principal
  mainContent: {
    paddingHorizontal: 20,
    paddingTop: 30,
  },

  // Título de Bienvenida
  welcomeHeader: {
    marginBottom: 24,
    alignItems: 'center',
  },
  welcomeTitleNew: {
    fontSize: 28,
    color: '#F5F7FA',
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 36,
  },
  titleUnderline: {
    width: 60,
    height: 4,
    backgroundColor: '#0EA5E9',
    borderRadius: 2,
    marginTop: 12,
  },

  // Cards de Descripción
  descriptionCard: {
    backgroundColor: '#ffffffea',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#0EA5E9',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#3c4858',
    textAlign: 'justify',
  },
  highlightTextNew: {
    fontWeight: '700',
    color: '#1E40AF',
  },

  // Funciones Principales
  functionsContainer: {
    backgroundColor: '#ffffffea',
    padding: 20,
    borderRadius: 16,
    marginTop: 8,
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  functionsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  functionsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  functionsList: {
    gap: 16,
  },
  functionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  functionIconContainer: {
    width: 36,
    height: 36,
    backgroundColor: '#e0f2fe',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  functionText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
    color: '#475569',
    paddingTop: 7,
  },

  // Botón Continuar (Sin Gradiente)
  continueButtonWrapper: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    backgroundColor: '#1e40afe0',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#1E40AF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  continueButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    gap: 12,
  },
  continueButtonTextNew: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFF',
    letterSpacing: 0.5,
  },

  // Footer
  footerNew: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 8,
  },
  footerTextNew: {
    fontSize: 13,
    color: '#d4d4d4',
    fontWeight: '500',
  },

  // Imagen de Fondo Decorativa
  backgroundImageContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    opacity: 0.25,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
});