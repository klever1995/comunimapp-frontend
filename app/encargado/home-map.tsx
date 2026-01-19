import { useAuth } from '@/hooks/useAuth';
import { db, auth as firebaseAuth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker, Heatmap, PROVIDER_GOOGLE } from 'react-native-maps';
import { homeMapStyles } from '../../styles/encargado/home-mapStyles';


interface Report {
  id: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
    city: string;
  };
  priority: 'alta' | 'media' | 'baja';
  status: string;
  created_at: string;
}

export default function EncargadoHomeMapScreen({ navigation }: any) {
  const { authState: { user } } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  // Estado para alternar entre vista de marcadores y calor
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [mapRegion, setMapRegion] = useState({
    latitude: -0.22985,
    longitude: -78.52495,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [firebaseReady, setFirebaseReady] = useState(false);
  
  // Transformar reportes en puntos de calor con peso por prioridad
  const heatmapPoints = useMemo(() => {
    return reports.map(report => ({
      latitude: report.location.latitude,
      longitude: report.location.longitude,
      // Prioridad alta pesa más en el mapa de calor
      weight: report.priority === 'alta' ? 3 : report.priority === 'media' ? 2 : 1
    }));
  }, [reports]);

  useEffect(() => {
    // Esperar a que Firebase Auth esté listo
    const unsubscribeAuth = onAuthStateChanged(firebaseAuth, (firebaseUser) => {
      if (firebaseUser) {
        setFirebaseReady(true);
      } else {
        setFirebaseReady(false);
        setReports([]);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user?.id || !firebaseReady) return;

    setLoading(true);

    // CAMBIO CLAVE: Obtener reportes asignados a este encargado
    const q = query(
      collection(db, 'reports'),
      where('assigned_to', '==', user.id)
    );

    // Escuchar cambios en tiempo real
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const reportsData: Report[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        reportsData.push({
          id: doc.id,
          description: data.description || '',
          location: data.location || { latitude: 0, longitude: 0, address: '', city: '' },
          priority: data.priority || 'media',
          status: data.status || 'pendiente',
          created_at: data.created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
        });
      });

      setReports(reportsData);

      // Actualizar región del mapa si hay reportes
      if (reportsData.length > 0 && reportsData[0].location) {
        setMapRegion({
          latitude: reportsData[0].location.latitude,
          longitude: reportsData[0].location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      }

      setLoading(false);
    }, (error) => {
      console.error('Error escuchando reportes asignados:', error);
      setLoading(false);
    });

    // Limpiar listener al desmontar
    return () => unsubscribe();
  }, [user?.id, firebaseReady]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta': return '#ef4444';
      case 'media': return '#f97316';
      case 'baja': return '#22c55e';
      default: return '#94a3b8';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'alta': return '🔴';
      case 'media': return '🟠';
      case 'baja': return '🟢';
      default: return '⚪';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Navegar a la pantalla de detalles/historial del reporte
  const handleViewReportDetails = (reportId: string) => {
    navigation.navigate('ReportDetails', { reportId });
  };

  return (
    <View style={homeMapStyles.container}>
      {/* Header */}
      <View style={homeMapStyles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={homeMapStyles.headerTitle}>Reportes asignados</Text>
          {reports.length > 0 && (
            <View style={homeMapStyles.reportCountBadge}>
              <Text style={homeMapStyles.reportCountText}>{reports.length}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          style={homeMapStyles.notificationButton}
          onPress={() => navigation.navigate('Notifications')}
        >
          <View style={homeMapStyles.notificationBadge} />
          <Image
            source={require('@/assets/images/notifications.png')}
            style={homeMapStyles.notificationIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* Contenido del mapa */}
      <View style={homeMapStyles.contentContainer}>
        {loading ? (
          <View style={homeMapStyles.loadingContainer}>
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={{ marginTop: 10, color: '#64748b' }}>
              Cargando reportes asignados...
            </Text>
          </View>
        ) : reports.length === 0 ? (
          <View style={homeMapStyles.loadingContainer}>
            <View style={homeMapStyles.mapPlaceholder}>
              <Image
                source={require('@/assets/images/map-icon.png')}
                style={homeMapStyles.mapIcon}
                resizeMode="contain"
              />
              <Text style={homeMapStyles.mapPlaceholderText}>
                No hay reportes asignados
                {'\n'}
                <Text style={{ fontSize: 14, color: '#94a3b8' }}>
                  Los reportes que te asignen aparecerán aquí
                </Text>
              </Text>
            </View>
          </View>
        ) : (

        <> 
    {/* Leyenda */}
        <MapView
          style={homeMapStyles.mapContainer}
          provider={PROVIDER_GOOGLE}
          region={mapRegion}
          showsUserLocation
          showsMyLocationButton
        >
          {/* Capa de Calor condicional */}
          {showHeatmap && reports.length > 0 ? (
            <Heatmap
              points={heatmapPoints}
              radius={50}
              opacity={0.8}
              gradient={{
                colors: ['#34d399', '#fbbf24', '#ef4444'], // Escala: Verde -> Amarillo -> Rojo
                startPoints: [0.2, 0.5, 0.8],
                colorMapSize: 2000,
              }}
            />
          ) : (
            /* Marcadores normales */
            reports.map((report) => (
              <Marker
                key={report.id}
                coordinate={{
                  latitude: report.location.latitude,
                  longitude: report.location.longitude,
                }}
                pinColor={getPriorityColor(report.priority)}
                onPress={() => setSelectedReport(report)}
              />
            ))
          )}
        </MapView>
        </> // Cierre del fragmento
        )}
        
        {/* Leyenda */}
        <View style={homeMapStyles.legendContainer}>
          <Text style={homeMapStyles.legendTitle}>Prioridades</Text>

          <View style={homeMapStyles.legendItem}>
            <View style={[homeMapStyles.legendColor, { backgroundColor: '#ef4444' }]} />
            <Text style={homeMapStyles.legendText}>Alta prioridad</Text>
          </View>

          <View style={homeMapStyles.legendItem}>
            <View style={[homeMapStyles.legendColor, { backgroundColor: '#f97316' }]} />
            <Text style={homeMapStyles.legendText}>Media prioridad</Text>
          </View>

          <View style={homeMapStyles.legendItem}>
            <View style={[homeMapStyles.legendColor, { backgroundColor: '#22c55e' }]} />
            <Text style={homeMapStyles.legendText}>Baja prioridad</Text>
          </View>
        </View>

        {/* Botón flotante para ver historial (si hay reporte seleccionado) */}
        {selectedReport && (
          <TouchableOpacity
            style={homeMapStyles.floatingButton}
            onPress={() => handleViewReportDetails(selectedReport.id)}
          >
            <Image
              source={require('@/assets/images/check.png')}
              style={homeMapStyles.floatingButtonIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Modal detalle del reporte */}
      {selectedReport && (
        <View style={homeMapStyles.reportDetailModal}>
          <View style={homeMapStyles.reportDetailHeader}>
            <Text style={homeMapStyles.reportDetailTitle}>
              {getPriorityIcon(selectedReport.priority)} Reporte #{selectedReport.id.substring(0, 8)}
            </Text>
            <TouchableOpacity onPress={() => setSelectedReport(null)}>
              <Text style={homeMapStyles.reportDetailClose}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={homeMapStyles.reportDetailContent}>
            <Text style={homeMapStyles.reportDetailDescription}>
              {selectedReport.description}
            </Text>

            <View style={homeMapStyles.reportDetailInfo}>
              <Text style={homeMapStyles.reportDetailLabel}>Ubicación:</Text>
              <Text style={homeMapStyles.reportDetailText}>
                {selectedReport.location.address}, {selectedReport.location.city}
              </Text>
            </View>

            <View style={homeMapStyles.reportDetailInfo}>
              <Text style={homeMapStyles.reportDetailLabel}>Prioridad:</Text>
              <Text
                style={[
                  homeMapStyles.reportDetailText,
                  { color: getPriorityColor(selectedReport.priority), fontWeight: 'bold' },
                ]}
              >
                {selectedReport.priority.toUpperCase()}
              </Text>
            </View>

            <View style={homeMapStyles.reportDetailInfo}>
              <Text style={homeMapStyles.reportDetailLabel}>Estado:</Text>
              <Text style={homeMapStyles.reportDetailText}>
                {selectedReport.status.replace('_', ' ').toUpperCase()}
              </Text>
            </View>

            <View style={homeMapStyles.reportDetailInfo}>
              <Text style={homeMapStyles.reportDetailLabel}>Fecha:</Text>
              <Text style={homeMapStyles.reportDetailText}>
                {formatDate(selectedReport.created_at)}
              </Text>
            </View>
          </View>

          {/* BOTÓN ELIMINADO - Líneas 202-214 removidas */}
        </View>
      )}
    </View>
  );
}