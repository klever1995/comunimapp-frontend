// app/reportante/home-map.tsx
import { useAuth } from '@/hooks/useAuth';
import { db, auth as firebaseAuth } from '@/lib/firebase'; // IMPORT FIREBASE AUTH
import { homeMapStyles } from '../../styles/admin/home-mapStyles';
import { router } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useState, useMemo } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import MapView, { Marker, Heatmap, PROVIDER_GOOGLE } from 'react-native-maps';


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

export default function HomeMapScreen({ navigation }: any) {
  const { authState: { user } } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: -0.22985,
    longitude: -78.52495,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [firebaseReady, setFirebaseReady] = useState(false);

  // 👉 PEGA EL CÓDIGO AQUÍ:
  const [showHeatmap, setShowHeatmap] = useState(false);

  const heatmapPoints = useMemo(() => {
    return reports.map(report => ({
      latitude: report.location.latitude,
      longitude: report.location.longitude,
      // Peso según prioridad: alta=3, media=2, baja=1
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

    // Crear query para obtener solo los reportes de este usuario
    const q = query(
      collection(db, 'reports'),
      where('reporter_uid', '==', user.id)
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
      console.error('Error escuchando reportes:', error);
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

  return (
    <View style={homeMapStyles.container}>
      {/* Header CON CONTADOR */}
      <View style={homeMapStyles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={homeMapStyles.headerTitle}>Mapa de zonas</Text>
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
          // CAMBIO 1: Loading centrado en toda la pantalla
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#FFFFFF'
          }}>
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={{ marginTop: 10, color: '#64748b' }}>
              Cargando reportes...
            </Text>
          </View>
        ) : reports.length === 0 ? (
          <View style={homeMapStyles.mapContainer}>
            <View style={homeMapStyles.mapPlaceholder}>
              <Image
                source={require('@/assets/images/map-icon.png')}
                style={homeMapStyles.mapIcon}
                resizeMode="contain"
              />
              <Text style={homeMapStyles.mapPlaceholderText}>
                No hay reportes registrados
                {'\n'}
                <Text style={{ fontSize: 14, color: '#94a3b8' }}>
                  Tus reportes aparecerán aquí
                </Text>
              </Text>
            </View>
          </View>
        ) : (
            <MapView
              style={homeMapStyles.mapContainer}
              provider={PROVIDER_GOOGLE}
              region={mapRegion}
              showsUserLocation
              showsMyLocationButton
            >
              {/* 1. Capa de Calor: Se muestra solo si showHeatmap es true */}
              {showHeatmap && reports.length > 0 && (
                <Heatmap
                  points={heatmapPoints}
                  radius={50}
                  opacity={0.8}
                  gradient={{
                    colors: ['#34d399', '#fbbf24', '#ef4444'], // Verde -> Amarillo -> Rojo
                    startPoints: [0.2, 0.5, 0.8],
                    colorMapSize: 2000,
                  }}
                />
              )}

              {/* 2. Marcadores: Se muestran solo si showHeatmap es false */}
              {!showHeatmap && reports.map((report) => (
                <Marker
                  key={report.id}
                  coordinate={{
                    latitude: report.location.latitude,
                    longitude: report.location.longitude,
                  }}
                  pinColor={getPriorityColor(report.priority)}
                  onPress={() => setSelectedReport(report)}
                />
              ))}
            </MapView>
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

          {/* 👉 PEGA EL CÓDIGO DEL BOTÓN AQUÍ: */}
        <TouchableOpacity
          style={[
            homeMapStyles.heatmapToggleButton, 
            showHeatmap && homeMapStyles.heatmapToggleButtonActive
          ]}
          onPress={() => setShowHeatmap(!showHeatmap)}
        >
          <Image
            source={require('@/assets/images/map-icon.png')}
            style={[
              { width: 24, height: 24 },
              { tintColor: showHeatmap ? '#FFFFFF' : '#2563EB' }
            ]}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <Text style={homeMapStyles.toggleLabel}>
          {showHeatmap ? 'PUNTOS' : 'CALOR'}
        </Text>
        
        </View>
      </View>

      {/* Modal detalle */}
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
        </View>
      )}
    </View>

    
  );
}