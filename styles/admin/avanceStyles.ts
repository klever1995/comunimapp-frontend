// app/styles/admin/avanceStyles.ts
import { StyleSheet } from 'react-native';

export const avanceStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
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
    marginBottom: 8,
  },
  reportInfoCard: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  reportInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationIcon: {
    width: 18,
    height: 18,
    marginRight: 8,
    resizeMode: 'contain', // ✅ AÑADIDO
  },
  reportLocation: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 16,
    color: '#1e293b',
    flex: 1,
  },
  reportDescription: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 12,
  },
  reportStatusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  statusLabel: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 13,
    color: '#475569',
  },
  statusValue: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 13,
    color: '#2563EB',
    textTransform: 'capitalize',
  },
  updatesList: {
    gap: 16,
  },
  updateCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  updateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  updateTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  updateIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
    resizeMode: 'contain', // ✅ AÑADIDO
  },
  updateTypeText: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 15,
    color: '#1e293b',
    textTransform: 'capitalize',
  },
  updateDate: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
    color: '#64748b',
    textAlign: 'right',
  },
  updateMessage: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
    marginBottom: 12,
  },
  statusChangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  statusChangeIcon: {
    width: 16,
    height: 16,
    marginRight: 8,
    resizeMode: 'contain', // ✅ AÑADIDO
  },
  statusChangeText: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 13,
    color: '#0369a1',
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  imageThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#e2e8f0',
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderIcon: {
    width: 24,
    height: 24,
    opacity: 0.5,
    resizeMode: 'contain', // ✅ AÑADIDO
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#64748b',
    marginTop: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 15,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 22,
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  errorText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 15,
    color: '#dc2626',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 16,
  },
  retryButtonText: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
});

export default avanceStyles;