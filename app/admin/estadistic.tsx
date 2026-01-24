import { useAuth } from "@/hooks/useAuth";
import { estadisticStyles } from "@/styles/admin/estadisticStyles";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  RefreshControl,
  ScrollView, // Importamos Modal
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;
// ASEGURA TU IP AQUI
const METRICS_API_URL = "http://192.168.110.236:8000";

const CHART_COLORS = [
  "#F59E0B",
  "#3B82F6",
  "#8B5CF6",
  "#10B981",
  "#64748B",
  "#EF4444",
];

interface AIAnalysis {
  titulo: string;
  mensaje: string;
  color_alerta: string;
}

interface KPIData {
  total_reportes: number;
  casos_activos: number;
  tasa_resolucion: number;
  tasa_resolucion_label: string;
  tasa_transparencia: number;
  tasa_evidencia: number;
  mensaje_alerta: string;
}

interface GraphData {
  por_estado: Record<string, number>;
  por_prioridad: Record<string, number>;
  top_zonas_riesgo: Record<string, number>;
  anonimato: { anonimos: number; publicos: number };
}

interface DashboardResponse {
  kpis_negocio: KPIData;
  ai_analisis: AIAnalysis;
  graficas: GraphData;
}

export default function AdminEstadisticScreen() {
  const { authState } = useAuth();
  const { token, user } = authState;

  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  // ESTADO NUEVO: Controla la ventana flotante
  const [modalVisible, setModalVisible] = useState(false);

  const [timeFilter, setTimeFilter] = useState("historico");
  const [statusFilter, setStatusFilter] = useState("todos");

  const fetchMetrics = async (
    range = timeFilter,
    statusType = statusFilter,
    useAi = false,
    isBackgroundRefresh = false,
  ) => {
    if (!token) return;

    try {
      if (!isBackgroundRefresh && !useAi) console.log("Solitando datos...");
      if (useAi) setAiLoading(true);

      const url = `${METRICS_API_URL}/metrics/dashboard?range=${range}&status_type=${statusType}&analyze_ai=${useAi}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const json = await response.json();

        setData((prevData) => {
          // SI ES PETICION CON IA (BOTON):
          if (useAi) {
            // 1. Abrimos el modal para mostrar el resultado INMEDIATAMENTE
            setModalVisible(true);
            return json;
          }

          // SI ES REFRESCO AUTOMATICO:
          // Protegemos el mensaje de la IA para que no se borre
          if (
            prevData &&
            prevData.ai_analisis &&
            prevData.ai_analisis.titulo !== "Análisis IA Pendiente"
          ) {
            return {
              ...json,
              ai_analisis: prevData.ai_analisis,
            };
          }
          return json;
        });
      } else {
        console.error(`Error servidor: ${response.status}`);
      }
    } catch (error) {
      console.error("Error de red:", error);
    } finally {
      if (!isBackgroundRefresh) {
        setLoading(false);
        setRefreshing(false);
      }
      if (useAi) setAiLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      let intervalId: any;
      if (token && user?.role === "admin") {
        fetchMetrics(timeFilter, statusFilter, false);
        intervalId = setInterval(() => {
          fetchMetrics(timeFilter, statusFilter, false, true);
        }, 20000);
      }
      return () => {
        if (intervalId) clearInterval(intervalId);
      };
    }, [token, user, timeFilter, statusFilter]),
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchMetrics(timeFilter, statusFilter, false);
  };

  const handleGenerateAI = () => {
    fetchMetrics(timeFilter, statusFilter, true);
  };

  const handleFilterChange = (type: "time" | "status", value: string) => {
    setLoading(true);
    if (type === "time") setTimeFilter(value);
    else setStatusFilter(value);
  };

  if (loading && !data && !refreshing) {
    return (
      <View style={estadisticStyles.centerContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={{ marginTop: 10, color: "#64748B" }}>
          Cargando datos...
        </Text>
      </View>
    );
  }

  if (user?.role !== "admin") {
    return (
      <View style={estadisticStyles.centerContainer}>
        <Text style={{ color: "#EF4444", fontSize: 18, fontWeight: "bold" }}>
          Acceso Restringido
        </Text>
      </View>
    );
  }

  if (!data && !loading) {
    return (
      <View style={estadisticStyles.centerContainer}>
        <Text style={{ color: "#EF4444", marginBottom: 10 }}>
          Error de conexión.
        </Text>
        <TouchableOpacity
          onPress={() => fetchMetrics()}
          style={{ padding: 10, backgroundColor: "#E2E8F0", borderRadius: 8 }}
        >
          <Text>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const kpis = data!.kpis_negocio;
  const graficas = data!.graficas;
  const ai = data!.ai_analisis;

  // COLORES DINAMICOS
  const isDefault = ai?.titulo === "Análisis IA Pendiente";
  const aiColor = isDefault
    ? "#F3F4F6"
    : ai?.color_alerta === "red"
      ? "#FEE2E2"
      : ai?.color_alerta === "yellow"
        ? "#FEF3C7"
        : "#D1FAE5";
  const aiBorder = isDefault
    ? "#9CA3AF"
    : ai?.color_alerta === "red"
      ? "#EF4444"
      : ai?.color_alerta === "yellow"
        ? "#F59E0B"
        : "#10B981";
  const aiText = isDefault
    ? "#4B5563"
    : ai?.color_alerta === "red"
      ? "#991B1B"
      : ai?.color_alerta === "yellow"
        ? "#92400E"
        : "#065F46";

  const pieChartData = graficas?.por_estado
    ? Object.keys(graficas.por_estado).map((key, index) => {
        const labels: Record<string, string> = {
          pendiente: "Pendiente",
          asignado: "Asignado",
          en_proceso: "En Proceso",
          resuelto: "Resuelto",
          cerrado: "Cerrado",
          finalizado: "Finalizado",
        };
        return {
          name: labels[key] || key,
          population: graficas.por_estado[key],
          color: CHART_COLORS[index % CHART_COLORS.length],
          legendFontColor: "#64748B",
          legendFontSize: 11,
        };
      })
    : [];

  const riskZones = graficas?.top_zonas_riesgo
    ? Object.entries(graficas.top_zonas_riesgo).sort((a, b) => b[1] - a[1])
    : [];

  return (
    <View style={estadisticStyles.container}>
      {/* --- MODAL FLOTANTE (PANTALLA EMERGENTE) --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={localStyles.modalOverlay}>
          <View style={[localStyles.modalContent, { borderColor: aiBorder }]}>
            {/* Cabecera del Modal */}
            <View
              style={[localStyles.modalHeader, { backgroundColor: aiColor }]}
            >
              <Text style={{ fontSize: 24 }}>✨</Text>
              <Text style={[localStyles.modalTitle, { color: aiText }]}>
                {ai?.titulo || "Análisis Completado"}
              </Text>
            </View>

            {/* Cuerpo del Modal */}
            <View style={localStyles.modalBody}>
              <Text style={localStyles.modalMessage}>{ai?.mensaje}</Text>

              <View style={{ marginTop: 20, flexDirection: "row", gap: 10 }}>
                <View style={[localStyles.badge, { backgroundColor: aiColor }]}>
                  <Text style={{ color: aiText, fontWeight: "bold" }}>
                    {ai?.color_alerta?.toUpperCase() || "INFO"}
                  </Text>
                </View>
              </View>
            </View>

            {/* Botón Cerrar */}
            <TouchableOpacity
              style={localStyles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={localStyles.closeButtonText}>Entendido</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView
        contentContainerStyle={estadisticStyles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <Text style={estadisticStyles.headerTitle}>Dashboard Admin</Text>
        <Text style={estadisticStyles.headerSubtitle}>
          Bienvenido, {user?.username}
        </Text>

        {/* TARJETA PERSISTENTE (Lo que queda cuando cierras el modal) */}
        <View
          style={{
            backgroundColor: aiColor,
            padding: 15,
            borderRadius: 12,
            borderLeftWidth: 5,
            borderLeftColor: aiBorder,
            marginBottom: 15,
            marginTop: 5,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <View style={{ flex: 1, paddingRight: 10 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 5,
                }}
              >
                <Text style={{ fontSize: 16, marginRight: 5 }}>✨</Text>
                <Text
                  style={{ fontWeight: "bold", fontSize: 16, color: aiText }}
                >
                  {ai?.titulo || "Análisis Inteligente"}
                </Text>
              </View>
              <Text style={{ color: aiText, fontSize: 14, lineHeight: 20 }}>
                {ai?.mensaje || "Presiona para generar reporte."}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleGenerateAI}
              disabled={aiLoading}
              style={{
                backgroundColor: "white",
                paddingHorizontal: 15,
                paddingVertical: 10,
                borderRadius: 25,
                borderWidth: 1,
                borderColor: aiBorder,
                opacity: aiLoading ? 0.7 : 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {aiLoading ? (
                <ActivityIndicator size="small" color={aiBorder} />
              ) : (
                <Text
                  style={{ color: aiBorder, fontWeight: "bold", fontSize: 12 }}
                >
                  Generar
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            marginBottom: 10,
            backgroundColor: "white",
            padding: 5,
            borderRadius: 12,
          }}
        >
          {["dia", "semana", "mes", "historico"].map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => handleFilterChange("time", f)}
              style={{
                paddingVertical: 8,
                backgroundColor: timeFilter === f ? "#2563EB" : "transparent",
                borderRadius: 10,
                flex: 1,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: timeFilter === f ? "white" : "#64748B",
                  fontWeight: "600",
                  fontSize: 12,
                  textTransform: "capitalize",
                }}
              >
                {f === "historico" ? "Total" : f}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={estadisticStyles.kpiContainer}>
          <View style={estadisticStyles.kpiCard}>
            <Text style={estadisticStyles.kpiValue}>{kpis.total_reportes}</Text>
            <Text style={estadisticStyles.kpiLabel}>Total</Text>
          </View>
          <View style={estadisticStyles.kpiCard}>
            <Text
              style={[
                estadisticStyles.kpiValue,
                { color: kpis.tasa_resolucion > 50 ? "#10B981" : "#F59E0B" },
              ]}
            >
              {kpis.tasa_resolucion_label}
            </Text>
            <Text style={estadisticStyles.kpiLabel}>Resolución</Text>
          </View>
        </View>

        <View style={estadisticStyles.kpiContainer}>
          <View style={estadisticStyles.kpiCard}>
            <Text style={[estadisticStyles.kpiValue, { color: "#3B82F6" }]}>
              {kpis.casos_activos}
            </Text>
            <Text style={estadisticStyles.kpiLabel}>Activos</Text>
          </View>
          <View style={estadisticStyles.kpiCard}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              <View style={{ alignItems: "center" }}>
                <Text
                  style={{ fontSize: 18, fontWeight: "bold", color: "#10B981" }}
                >
                  {graficas?.anonimato?.publicos ?? 0}
                </Text>
                <Text style={{ fontSize: 10, color: "#64748B" }}>Públicos</Text>
              </View>
              <View
                style={{ width: 1, height: 25, backgroundColor: "#E2E8F0" }}
              />
              <View style={{ alignItems: "center" }}>
                <Text
                  style={{ fontSize: 18, fontWeight: "bold", color: "#64748B" }}
                >
                  {graficas?.anonimato?.anonimos ?? 0}
                </Text>
                <Text style={{ fontSize: 10, color: "#64748B" }}>Anónimos</Text>
              </View>
            </View>
            <Text style={[estadisticStyles.kpiLabel, { marginTop: 5 }]}>
              Privacidad
            </Text>
          </View>
        </View>

        <View style={estadisticStyles.chartCard}>
          <Text style={estadisticStyles.chartTitle}>Prioridad</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              marginTop: 10,
            }}
          >
            {Object.entries(graficas?.por_prioridad ?? {}).map(
              ([prio, count]) => {
                const color =
                  prio === "alta"
                    ? "#EF4444"
                    : prio === "media"
                      ? "#F59E0B"
                      : "#3B82F6";
                return (
                  <View key={prio} style={{ alignItems: "center" }}>
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: color,
                        marginBottom: 5,
                      }}
                    />
                    <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                      {count}
                    </Text>
                    <Text
                      style={{
                        color: "#64748B",
                        fontSize: 12,
                        textTransform: "capitalize",
                      }}
                    >
                      {prio}
                    </Text>
                  </View>
                );
              },
            )}
          </View>
        </View>

        <View style={estadisticStyles.chartCard}>
          <Text style={estadisticStyles.chartTitle}>Distribución</Text>
          {pieChartData.length > 0 ? (
            <PieChart
              data={pieChartData}
              width={screenWidth - 60}
              height={200}
              chartConfig={{
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor={"population"}
              backgroundColor={"transparent"}
              paddingLeft={"15"}
              center={[0, 0]}
              absolute
            />
          ) : (
            <Text style={estadisticStyles.noDataText}>No hay datos</Text>
          )}
        </View>

        <View style={estadisticStyles.riskCard}>
          <View style={estadisticStyles.riskHeader}>
            <Text style={estadisticStyles.chartTitle}>Zonas Activas</Text>
          </View>
          {riskZones.length > 0 ? (
            riskZones.map(([city, count], index) => {
              const percentage = (count / (kpis.total_reportes || 1)) * 100;
              const barWidth = Math.min(percentage * 2, 100);
              return (
                <View key={index} style={estadisticStyles.riskRow}>
                  <View style={estadisticStyles.riskInfo}>
                    <Text style={estadisticStyles.riskCity}>{city}</Text>
                    <View style={estadisticStyles.progressBarBg}>
                      <View
                        style={[
                          estadisticStyles.progressBarFill,
                          {
                            width: `${barWidth}%`,
                            backgroundColor: count > 5 ? "#EF4444" : "#3B82F6",
                          },
                        ]}
                      />
                    </View>
                  </View>
                  <Text style={estadisticStyles.riskCount}>{count}</Text>
                </View>
              );
            })
          ) : (
            <Text style={estadisticStyles.noDataText}>Sin actividad</Text>
          )}
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

// ESTILOS EXTRA PARA EL MODAL
const localStyles = StyleSheet.create({
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
});
