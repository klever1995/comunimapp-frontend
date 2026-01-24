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
});
