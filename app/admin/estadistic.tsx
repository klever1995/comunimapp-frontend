import { estadisticStyles } from "@/styles/admin/estadisticStyles";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { PieChart } from "react-native-chart-kit";

// Importación del hook de autenticación para obtener el token y usuario
import { useAuth } from "@/hooks/useAuth";

// --- CONFIGURACIÓN DE CONSTANTES ---
const screenWidth = Dimensions.get("window").width;
// Dirección IP del backend. Asegurar que el celular esté en la misma red
const METRICS_API_URL = "http://192.168.110.236:8000";

const CHART_COLORS = [
  "#F59E0B",
  "#3B82F6",
  "#8B5CF6",
  "#10B981",
  "#64748B",
  "#EF4444",
];

// --- DEFINICIÓN DE TIPOS DE DATOS ---
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
  graficas: GraphData;
}

export default function AdminEstadisticScreen() {
  // Extracción del estado de autenticación
  const { authState } = useAuth();
  const { token, user } = authState;

  // --- ESTADO LOCAL DEL COMPONENTE ---
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true); // Control de carga inicial
  const [refreshing, setRefreshing] = useState(false); // Control del gesto de recarga manual

  // Persistencia de los filtros seleccionados
  const [timeFilter, setTimeFilter] = useState("historico");
  const [statusFilter, setStatusFilter] = useState("todos");

  // --- FUNCIÓN DE PETICIÓN DE DATOS ---
  // Lógica principal para conectar con el endpoint de métricas
  const fetchMetrics = async (
    range = timeFilter,
    statusType = statusFilter,
    isBackgroundRefresh = false,
  ) => {
    // Validación de seguridad para evitar peticiones sin sesión
    if (!token) return;

    try {
      // Registro en consola solo para depuración manual
      if (!isBackgroundRefresh) console.log("Petición de nuevas métricas...");

      const url = `${METRICS_API_URL}/metrics/dashboard?range=${range}&status_type=${statusType}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`, // Envío del token para autorización
        },
      });

      if (response.ok) {
        const json = await response.json();
        setData(json); // Actualización de los datos en la vista
      } else {
        console.error("Error en respuesta del servidor:", response.status);
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    } finally {
      // Finalización de la animación de carga solo si es manual o inicial
      if (!isBackgroundRefresh) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  };

  // --- CICLO DE VIDA Y ACTUALIZACIÓN AUTOMÁTICA ---
  // Configuración del comportamiento al enfocar la pantalla
  useFocusEffect(
    useCallback(() => {
      // Variable para control del intervalo de tiempo
      let intervalId: any;

      // Verificación de rol de administrador antes de iniciar procesos
      if (token && user?.role === "admin") {
        // 1. Carga inmediata de datos al entrar
        fetchMetrics(timeFilter, statusFilter);

        // 2. Establecimiento del intervalo de 20 segundos
        // Sincronización con el tiempo de vida del caché en backend (15s)
        intervalId = setInterval(() => {
          // Ejecución en modo silencioso (true) para no interrumpir la UI
          fetchMetrics(timeFilter, statusFilter, true);
        }, 20000);
      }

      // 3. Limpieza del intervalo al salir
      // Detención del reloj para optimización de batería y recursos
      return () => {
        if (intervalId) {
          clearInterval(intervalId);
        }
      };
    }, [token, user, timeFilter, statusFilter]), // Reinicio del efecto al cambiar filtros
  );

  // Manejo del evento de recarga manual por gesto
  const onRefresh = () => {
    setRefreshing(true);
    if (token) fetchMetrics(timeFilter, statusFilter);
  };

  // Gestión del cambio de filtros por parte del usuario
  const handleFilterChange = (type: "time" | "status", value: string) => {
    setLoading(true); // Indicación visual de cambio
    if (type === "time") {
      setTimeFilter(value);
      // El cambio de estado dispara automáticamente el efecto de carga
    } else {
      setStatusFilter(value);
    }
  };

  // --- RENDERIZADO CONDICIONAL ---

  // Visualización de carga inicial
  if (loading && !data && !refreshing) {
    return (
      <View style={estadisticStyles.centerContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={{ marginTop: 10, color: "#64748B" }}>
          Sincronización de datos...
        </Text>
      </View>
    );
  }

  // Restricción de acceso por rol
  if (user?.role !== "admin") {
    return (
      <View style={estadisticStyles.centerContainer}>
        <Text style={{ color: "#EF4444", fontSize: 18, fontWeight: "bold" }}>
          Acceso Restringido
        </Text>
        <Text style={{ color: "#64748B", marginTop: 5 }}>
          Vista disponible solo para administradores.
        </Text>
      </View>
    );
  }

  // Manejo de estado sin datos o error de conexión
  if (!data && !loading) {
    return (
      <View style={estadisticStyles.centerContainer}>
        <Text style={{ color: "#EF4444", marginBottom: 10 }}>
          Fallo de conexión con el servidor.
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

  // --- PREPARACIÓN DE VISTAS ---
  const kpis = data!.kpis_negocio;
  const graficas = data!.graficas;

  // Adaptación de datos para la librería de gráficas
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

  // Ordenamiento de zonas de riesgo por volumen
  const riskZones = graficas?.top_zonas_riesgo
    ? Object.entries(graficas.top_zonas_riesgo).sort((a, b) => b[1] - a[1])
    : [];

  // --- ESTRUCTURA VISUAL PRINCIPAL ---
  return (
    <View style={estadisticStyles.container}>
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

        {/* Sección de filtros temporales */}
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

        {/* Visualización de tarjetas KPI */}
        <View style={estadisticStyles.kpiContainer}>
          <View style={estadisticStyles.kpiCard}>
            <Text style={estadisticStyles.kpiValue}>{kpis.total_reportes}</Text>
            <Text style={estadisticStyles.kpiLabel}>Total Reportes</Text>
          </View>
          <View style={estadisticStyles.kpiCard}>
            <Text
              style={[
                estadisticStyles.kpiValue,
                // Cambio de color según cumplimiento de meta
                { color: kpis.tasa_resolucion > 50 ? "#10B981" : "#F59E0B" },
              ]}
            >
              {kpis.tasa_resolucion_label}
            </Text>
            <Text style={estadisticStyles.kpiLabel}>Tasa Resolución</Text>
          </View>
        </View>

        <View style={estadisticStyles.kpiContainer}>
          <View style={estadisticStyles.kpiCard}>
            <Text style={[estadisticStyles.kpiValue, { color: "#3B82F6" }]}>
              {kpis.casos_activos}
            </Text>
            <Text style={estadisticStyles.kpiLabel}>Casos Activos</Text>
          </View>

          {/* Tarjeta de métricas de privacidad */}
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
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "#10B981",
                  }}
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
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "#64748B",
                  }}
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

        {/* Gráfica de distribución por prioridad */}
        <View style={estadisticStyles.chartCard}>
          <Text style={estadisticStyles.chartTitle}>
            Distribución por Prioridad
          </Text>
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

        {/* Gráfica circular de estados */}
        <View style={estadisticStyles.chartCard}>
          <Text style={estadisticStyles.chartTitle}>Estado de Incidentes</Text>
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
            <Text style={estadisticStyles.noDataText}>
              No hay datos disponibles
            </Text>
          )}
        </View>

        {/* Lista de zonas de riesgo */}
        <View style={estadisticStyles.riskCard}>
          <View style={estadisticStyles.riskHeader}>
            <Text style={estadisticStyles.chartTitle}>
              Zonas de Mayor Actividad
            </Text>
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
            <Text style={estadisticStyles.noDataText}>
              Sin actividad reciente
            </Text>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}
