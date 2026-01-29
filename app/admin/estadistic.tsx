import { useAuth } from "@/hooks/useAuth";
import { estadisticStyles } from "@/styles/admin/estadisticStyles";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { PieChart } from "react-native-chart-kit";
const METRICS_API_URL = process.env.EXPO_PUBLIC_API_URL;
const screenWidth = Dimensions.get("window").width;

const etiquetasAlerta: Record<string, string> = {
  red: "CRÍTICO",
  yellow: "ADVERTENCIA",
  green: "ÓPTIMO",
  blue: "INFORMATIVO",
};

const filterLabels: Record<string, string> = {
  dia: "Día",
  semana: "Semana",
  mes: "Mes",
  historico: "Total",
};
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
              <Ionicons
                name="sparkles-sharp"
                size={25}
                color={aiText}
                style={{ marginRight: -2 }}
              />
              <Text style={[localStyles.modalTitle, { color: aiText }]}>
                {ai?.titulo || "Análisis Completado"}
              </Text>
            </View>

            {/* Cuerpo del Modal */}
            <View style={localStyles.modalBody}>
              <Text style={localStyles.modalMessage}>{ai?.mensaje}</Text>

              <View style={{ marginTop: 20, flexDirection: "row", gap: 10 }}>
                <View style={[localStyles.badge, { backgroundColor: aiColor }]}>
                  <Text
                    style={{ color: aiText, fontWeight: "bold", fontSize: 12 }}
                  >
                    {/* Aquí hacemos la magia: buscamos la traducción o usamos "INFO" por defecto */}
                    {etiquetasAlerta[ai?.color_alerta?.toLowerCase()] || "INFO"}
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
        <View style={localStyles.headerSimpleRow}>
          <View>
            <Text style={estadisticStyles.headerTitle}>Panel de Control</Text>
            <View style={localStyles.userTag}>
              <Ionicons
                name="person-circle-outline"
                size={14}
                color="#64748B"
              />
              <Text style={localStyles.userTagText}>{user?.username}</Text>
            </View>
          </View>

          {/* Icono de contexto: Indica que esta es la sección de métricas */}
          <View style={localStyles.contextIconCircle}>
            <Ionicons name="stats-chart" size={20} color="#2563EB" />
          </View>
        </View>
        {/* TARJETA PERSISTENTE (Lo que queda cuando cierras el modal) */}
        <View
          style={{
            backgroundColor: aiColor,
            padding: 16,
            borderRadius: 12,
            borderLeftWidth: 5,
            borderLeftColor: aiBorder,
            marginBottom: 15,
            marginTop: 5,
            elevation: 2,
          }}
        >
          {/* NIVEL 1: Fila superior (Icono + Título + Botón) */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 5, // Espacio entre el header y el mensaje de abajo
            }}
          >
            {/* Contenedor del Título (Se encoge si choca con el botón) */}
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "flex-start",
                paddingRight: 10,
              }}
            >
              <Ionicons
                name="sparkles-sharp"
                size={18}
                color={aiText}
                style={{ marginRight: 8, marginTop: 2 }}
              />
              <Text
                style={{
                  fontWeight: "700",
                  fontSize: 16,
                  color: aiText,
                  lineHeight: 20,
                  flex: 1, // Esto obliga al título a saltar de línea si llega al botón
                }}
              >
                {ai?.titulo || "Análisis Inteligente"}
              </Text>
            </View>

            {/* Botón Generar (Posición fija a la derecha) */}
            <TouchableOpacity
              onPress={handleGenerateAI}
              disabled={aiLoading}
              style={{
                backgroundColor: "white",
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: aiBorder,
                minWidth: 85,
                alignItems: "center",
                opacity: aiLoading ? 0.7 : 1,
              }}
            >
              {aiLoading ? (
                <ActivityIndicator size="small" color={aiBorder} />
              ) : (
                <Text
                  style={{ color: aiBorder, fontWeight: "800", fontSize: 11 }}
                >
                  GENERAR
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* NIVEL 2: Mensaje inferior (Ocupa todo el ancho disponible) */}
          <Text
            style={{
              color: aiText,
              fontSize: 14,
              lineHeight: 20,
              opacity: 0.9,
              width: "100%", // Asegura que use todo el ancho de la tarjeta
            }}
          >
            {ai?.mensaje || "Presiona para generar reporte."}
          </Text>
        </View>
        <View style={localStyles.segmentContainer}>
          {Object.keys(filterLabels).map((f) => {
            const isActive = timeFilter === f;
            return (
              <TouchableOpacity
                key={f}
                activeOpacity={0.7}
                onPress={() => handleFilterChange("time", f)}
                style={[
                  localStyles.segmentButton,
                  isActive && localStyles.activeSegmentButton,
                  // Si quieres usar el color dinámico de tu IA:
                  // isActive && { backgroundColor: aiColor }
                ]}
              >
                <Text
                  style={[
                    localStyles.segmentText,
                    isActive && localStyles.activeSegmentText,
                  ]}
                >
                  {filterLabels[f]}
                </Text>
              </TouchableOpacity>
            );
          })}
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
            <Text style={estadisticStyles.kpiLabel}>Tasa de Resolución</Text>
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
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              marginBottom: 15,
            }}
          >
            <Text style={estadisticStyles.chartTitle}>
              Análisis de Prioridades
            </Text>
            <Ionicons name="stats-chart-outline" size={18} color="#94A3B8" />
          </View>

          {(() => {
            // Colores modernos de alta fidelidad (vivos pero profesionales)
            const profColors: Record<string, string> = {
              baja: "#3B82F6", // Blue 500
              media: "#F59E0B", // Amber 500
              alta: "#F43F5E", // Rose 500
            };

            const priorityOrder = ["baja", "media", "alta"];
            const rawData = graficas?.por_prioridad ?? {};

            const sortedEntries = priorityOrder
              .filter((prio) => rawData[prio] !== undefined)
              .map((prio) => [prio, rawData[prio]]);

            const total = sortedEntries.reduce(
              (acc, [_, count]) => acc + (count as number),
              0,
            );

            if (total === 0)
              return <Text style={estadisticStyles.noDataText}>Sin datos</Text>;

            return (
              <View style={{ width: "100%" }}>
                {/* BARRA ÚNICA: Diseño limpio tipo cápsula */}
                <View
                  style={{
                    height: 14,
                    flexDirection: "row",
                    backgroundColor: "#F1F5F9",
                    borderRadius: 10,
                    overflow: "hidden",
                    width: "100%",
                  }}
                >
                  {sortedEntries.map(([prio, count], index) => {
                    const widthPct = ((count as number) / total) * 100;
                    if (widthPct === 0) return null;

                    return (
                      <View
                        key={prio}
                        style={{
                          width: `${widthPct}%`,
                          backgroundColor: profColors[prio as string],
                          borderRightWidth:
                            index < sortedEntries.length - 1 ? 2 : 0,
                          borderRightColor: "white",
                        }}
                      />
                    );
                  })}
                </View>

                {/* LEYENDA: Estilo de Dashboard Moderno */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 22,
                  }}
                >
                  {sortedEntries.map(([prio, count]) => {
                    const color = profColors[prio as string];
                    const percentage = (
                      ((count as number) / total) *
                      100
                    ).toFixed(0);

                    return (
                      <View
                        key={prio}
                        style={{ flex: 1, alignItems: "center" }}
                      >
                        {/* Etiqueta con fondo suave (Tint) */}
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            backgroundColor: `${color}15`, // 15% de opacidad del color original
                            paddingHorizontal: 8,
                            paddingVertical: 3,
                            borderRadius: 12,
                            marginBottom: 6,
                          }}
                        >
                          <View
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: 3,
                              backgroundColor: color,
                              marginRight: 5,
                            }}
                          />
                          <Text
                            style={{
                              fontSize: 10,
                              fontWeight: "700",
                              color: color,
                              textTransform: "uppercase",
                            }}
                          >
                            {prio}
                          </Text>
                        </View>

                        {/* Valor Principal */}
                        <Text
                          style={{
                            fontSize: 18,
                            fontWeight: "800",
                            color: "#1E293B",
                          }}
                        >
                          {count}
                        </Text>

                        {/* Subtexto de porcentaje */}
                        <Text
                          style={{
                            fontSize: 11,
                            color: "#64748B",
                            fontWeight: "500",
                          }}
                        >
                          {percentage}%
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            );
          })()}
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
          <View
            style={[
              estadisticStyles.riskHeader,
              {
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              },
            ]}
          >
            <Text style={estadisticStyles.chartTitle}>Zonas Activas</Text>
            <Ionicons name="location-outline" size={18} color="#64748B" />
          </View>

          {riskZones.length > 0 ? (
            riskZones.map(([city, count], index) => {
              // Cálculo del porcentaje real basado en el total
              const totalReportes = kpis.total_reportes || 1;
              const percentage = (count / totalReportes) * 100;

              // Color dinámico profesional: Rojo Rose para alertas (>5), Azul Indigo para normales
              const barColor = count > 5 ? "#F43F5E" : "#3B82F6";

              return (
                <View
                  key={index}
                  style={[estadisticStyles.riskRow, { marginBottom: 18 }]}
                >
                  <View style={estadisticStyles.riskInfo}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginBottom: 6,
                      }}
                    >
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Text
                          style={[
                            estadisticStyles.riskCity,
                            { color: "#1E293B", fontSize: 14 },
                          ]}
                        >
                          {city}
                        </Text>
                      </View>
                      <Text
                        style={[
                          estadisticStyles.riskCount,
                          { color: barColor, fontWeight: "800" },
                        ]}
                      >
                        {count}{" "}
                        <Text
                          style={{
                            fontSize: 10,
                            color: "#94A3B8",
                            fontWeight: "400",
                          }}
                        >
                          u.
                        </Text>
                      </Text>
                    </View>

                    {/* Barra de progreso estilizada */}
                    <View
                      style={[
                        estadisticStyles.progressBarBg,
                        { height: 8, backgroundColor: "#F1F5F9" },
                      ]}
                    >
                      <View
                        style={[
                          estadisticStyles.progressBarFill,
                          {
                            width: `${Math.min(percentage, 100)}%`, // Ancho real basado en datos
                            backgroundColor: barColor,
                            height: 8,
                            borderRadius: 4,
                          },
                        ]}
                      />
                    </View>
                  </View>
                </View>
              );
            })
          ) : (
            <View style={{ padding: 20, alignItems: "center" }}>
              <Ionicons name="map-outline" size={30} color="#CBD5E1" />
              <Text style={[estadisticStyles.noDataText, { marginTop: 8 }]}>
                Sin actividad en zonas
              </Text>
            </View>
          )}
        </View>
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

  //encabexado
  headerSimpleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 1, // Espacio para que respiren las tarjetas de abajo
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
    backgroundColor: "#EFF6FF", // Azul pálido muy suave
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },

  // fechas:
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
    backgroundColor: "#2563EB", // El azul fuerte que elegiste
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
    color: "white", // ¡Aquí está el cambio!
    fontWeight: "700",
  },
});
