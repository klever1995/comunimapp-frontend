import { Dimensions, StyleSheet } from "react-native";

const screenWidth = Dimensions.get("window").width;

export const estadisticStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  headerTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1E293B",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 20,
  },

  // Estilos de KPIs
  kpiContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  kpiCard: {
    backgroundColor: "white",
    width: "48%",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
  },
  alertCard: {
    backgroundColor: "#EF4444",
  },
  textWhite: {
    color: "white",
  },

  kpiValue: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1E293B",
  },
  kpiLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#64748B",
    marginTop: 4,
  },

  // Estilos de Gráficas
  chartCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    alignItems: "center",
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  noDataText: {
    color: "#94A3B8",
    marginVertical: 20,
  },

  // Estilos Zonas de Riesgo
  riskCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    elevation: 2,
  },
  riskHeader: {
    marginBottom: 12,
  },
  riskRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  riskInfo: {
    flex: 1,
    marginRight: 10,
  },
  riskCity: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 4,
  },
  riskCount: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#EF4444",
  },

  progressBarBg: {
    height: 6,
    backgroundColor: "#F1F5F9",
    borderRadius: 3,
    width: "100%",
  },
  progressBarFill: {
    height: 6,
    backgroundColor: "#EF4444",
    borderRadius: 3,
  },

  // ================== NUEVOS ESTILOS AÑADIDOS ==================
  
  // MODAL ESTILOS
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 20,
    borderWidth: 2,
    overflow: "hidden",
    elevation: 10,
  },
  modalHeader: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
    textAlign: "center",
  },
  modalBody: {
    padding: 20,
    alignItems: "center",
  },
  modalMessage: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    color: "#1F2937",
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 15,
  },
  closeButton: {
    backgroundColor: "#1F2937",
    padding: 15,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },

  // HEADER SIMPLE ROW (para el encabezado)
  headerSimpleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 1,
    marginTop: 1,
  },
  userTag: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  userTagText: {
    fontSize: 13,
    color: "#64748B",
    marginLeft: 6,
    fontWeight: "500",
  },
  contextIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },

  // SEGMENT CONTAINER (filtros de tiempo)
  segmentContainer: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    padding: 4,
    borderRadius: 14,
    marginBottom: 8,
    marginTop: -5,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  activeSegmentButton: {
    backgroundColor: "#2563EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#64748B",
  },
  activeSegmentText: {
    color: "white",
    fontWeight: "700",
  },
});

export default estadisticStyles;