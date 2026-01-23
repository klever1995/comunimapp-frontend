import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
// Asegúrate de haber instalado esto: npm install react-native-chart-kit react-native-svg
import { PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

// Tu URL directa de Render
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function AdminEstadisticScreen() {
  // CORRECCIÓN AQUÍ: Agregamos <any> para que TypeScript no moleste
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // --- LÓGICA DE CONEXIÓN (Todo en uno) ---
  const fetchMetrics = async () => {
    try {
      console.log("Conectando a:", `${API_URL}/metrics`);
      const response = await fetch(`${API_URL}/metrics`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const json = await response.json();
      console.log("Datos recibidos:", json); // Para ver en consola si llega
      setData(json);
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Cargar datos al entrar
  useEffect(() => {
    fetchMetrics();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchMetrics();
  };

  // --- PANTALLA DE CARGA ---
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={{ marginTop: 10, color: "#64748B" }}>
          Cargando métricas...
        </Text>
      </View>
    );
  }

  // --- PANTALLA SI NO HAY DATOS ---
  if (!data) {
    return (
      <View style={styles.centerContainer}>
        <Text style={{ color: "#EF4444", marginBottom: 10 }}>
          No se pudo conectar al servidor.
        </Text>
        <Text style={{ fontSize: 12, color: "#94A3B8" }}>
          Verifica tu internet o que Render esté activo.
        </Text>
      </View>
    );
  }

  // --- PREPARAR GRÁFICA (Protegido con ?) ---
  const pieData = data.graficas?.por_estado
    ? Object.keys(data.graficas.por_estado).map((key, index) => {
        const colors = ["#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6"];
        return {
          name: key.charAt(0).toUpperCase() + key.slice(1),
          population: data.graficas.por_estado[key],
          color: colors[index % colors.length],
          legendFontColor: "#64748B",
          legendFontSize: 12,
        };
      })
    : [];

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Estadísticas</Text>

        {/* 1. TARJETAS KPI */}
        <View style={styles.cardsRow}>
          <View style={styles.card}>
            <Text style={styles.cardValue}>
              {data.kpis_negocio?.total_reportes || 0}
            </Text>
            <Text style={styles.cardLabel}>Total</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardValue}>
              {data.kpis_negocio?.casos_activos || 0}
            </Text>
            <Text style={styles.cardLabel}>Activos</Text>
          </View>
          <View
            style={[
              styles.card,
              data.kpis_negocio?.mensaje_alerta === "Critico" &&
                styles.cardAlert,
            ]}
          >
            <Text
              style={[
                styles.cardValue,
                data.kpis_negocio?.mensaje_alerta === "Critico" &&
                  styles.textWhite,
              ]}
            >
              {Math.round(data.kpis_negocio?.tiempo_promedio_espera_horas || 0)}
              h
            </Text>
            <Text
              style={[
                styles.cardLabel,
                data.kpis_negocio?.mensaje_alerta === "Critico" &&
                  styles.textWhite,
              ]}
            >
              Espera
            </Text>
          </View>
        </View>

        {/* 2. GRÁFICA DE PASTEL */}
        <View style={styles.chartContainer}>
          <Text style={styles.subtitle}>Estado de Reportes</Text>
          {pieData.length > 0 ? (
            <PieChart
              data={pieData}
              width={screenWidth - 40}
              height={220}
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
            <Text style={{ padding: 20, color: "#94A3B8" }}>
              No hay datos suficientes
            </Text>
          )}
        </View>

        {/* 3. LISTA RECIENTE */}
        <Text style={styles.subtitle}>Últimos Reportes</Text>
        {data.feed_tiempo_real?.map((item: any) => (
          <View key={item.id} style={styles.itemRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemDesc}>{item.description}</Text>
              <Text style={styles.itemDate}>
                {item.date
                  ? new Date(item.date).toLocaleDateString()
                  : "Fecha N/A"}{" "}
                • {item.status}
              </Text>
            </View>
            <View
              style={[
                styles.badge,
                {
                  backgroundColor:
                    item.priority === "alta" ? "#FEE2E2" : "#E0E7FF",
                },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  { color: item.priority === "alta" ? "#EF4444" : "#4338CA" },
                ]}
              >
                {item.priority}
              </Text>
            </View>
          </View>
        ))}

        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  scrollContent: { padding: 16 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1E293B",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
    color: "#334155",
  },

  cardsRow: { flexDirection: "row", justifyContent: "space-between" },
  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    width: "31%",
    alignItems: "center",
    elevation: 2,
  },
  cardAlert: { backgroundColor: "#EF4444" },
  cardValue: { fontSize: 18, fontWeight: "bold", color: "#1E293B" },
  cardLabel: { fontSize: 12, color: "#64748B", marginTop: 4 },
  textWhite: { color: "white" },

  chartContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 10,
    marginTop: 10,
    alignItems: "center",
    elevation: 2,
  },

  itemRow: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemDesc: { fontSize: 14, fontWeight: "500", color: "#334155" },
  itemDate: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 4,
    textTransform: "capitalize",
  },

  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText: { fontSize: 10, fontWeight: "bold", textTransform: "uppercase" },
});
