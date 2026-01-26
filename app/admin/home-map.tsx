import { useAuth } from '@/hooks/useAuth';
import { db, auth as firebaseAuth } from '@/lib/firebase';
import { homeMapStyles } from '@/styles/admin/home-mapStyles';
import { router } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, query } from 'firebase/firestore';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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
  assigned_to?: string;
  reporter_uid?: string;
  is_anonymous_public?: boolean;
}

export default function AdminHomeMapScreen({ navigation }: any) {
  const { authState: { user }, logout } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [firebaseReady, setFirebaseReady] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [mapRegion, setMapRegion] = useState({
    latitude: -0.22985,
    longitude: -78.52495,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  // Cálculo optimizado de puntos para el mapa de calor
  const heatmapPoints = useMemo(() => {
    return reports.map(report => ({
      latitude: report.location.latitude,
      longitude: report.location.longitude,
      weight: report.priority === 'alta' ? 3 : report.priority === 'media' ? 2 : 1
    }));
  }, [reports]);

  useEffect(() => {
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

    // IMPORTANTE: Admin ve TODOS los reportes sin filtro
    const q = query(collection(db, 'reports'));

    
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
          assigned_to: data.assigned_to,
          reporter_uid: data.reporter_uid,
          is_anonymous_public: data.is_anonymous_public || false,
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



    // Función para manejar el logout
    const handleLogout = async () => {
      Alert.alert(
        'Cerrar sesión',
        '¿Estás seguro de que quieres cerrar sesión?',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Cerrar sesión',
            style: 'destructive',
            onPress: async () => {
              try {
                // Cerrar sesión en Firebase
                await firebaseAuth.signOut();
                // Limpiar autenticación de tu contexto
                await logout();
                // Navegar a la pantalla de login (Expo Router)
                router.replace('/');
              } catch (error) {
                console.error('Error al cerrar sesión:', error);
                Alert.alert('Error', 'No se pudo cerrar sesión. Intenta nuevamente.');
              }
            },
          },
        ]
      );
    };


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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Navegar a la pantalla de detalles del reporte
  const handleViewReportDetails = (reportId: string) => {
    navigation.navigate('ReportDetails', { reportId });
  };

  return (
    <View style={homeMapStyles.container}>
      {/* Header CON BOTÓN DE LOGOUT */}
      <View style={homeMapStyles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={homeMapStyles.headerTitle}>Todos los Reportes</Text>
          {reports.length > 0 && (
            <View style={homeMapStyles.reportCountBadge}>
              <Text style={homeMapStyles.reportCountText}>{reports.length}</Text>
            </View>
          )}
        </View>

        <View style={homeMapStyles.headerRightContainer}>
          {/* Botón de Notificaciones */}
          <TouchableOpacity
            style={homeMapStyles.notificationButton}
            onPress={() => router.push('/notification')}
          >
            <View style={homeMapStyles.notificationBadge} />
            <Image
              source={require('@/assets/images/notifications.png')}
              style={homeMapStyles.notificationIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>

          {/* Botón de Logout */}
          <TouchableOpacity
            style={homeMapStyles.logoutButton}
            onPress={handleLogout}
          >
            <Image
              source={require('@/assets/images/logout.png')}
              style={homeMapStyles.logoutIcon}
              resizeMode="contain"
            />
            <Text style={homeMapStyles.logoutText}>Salir</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Contenido del mapa */}
      <View style={homeMapStyles.contentContainer}>
        {loading ? (
          <View style={homeMapStyles.loadingContainer}>
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={{ marginTop: 10, color: '#64748b' }}>Cargando todos los reportes...</Text>
          </View>
        ) : reports.length === 0 ? (
          <View style={homeMapStyles.placeholderContainer}>
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
                    Los reportes creados aparecerán aquí automáticamente
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
            {showHeatmap ? (
              <Heatmap
                points={heatmapPoints}
                radius={50}
                opacity={0.8}
                gradient={{
                  colors: ['#34d399', '#fbbf24', '#ef4444'],
                  startPoints: [0.2, 0.5, 0.8],
                  colorMapSize: 2000,
                }}
              />
            ) : (
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
        )}

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

        {/* Botón de Alternancia de Mapa de Calor */}
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
        <Text style={homeMapStyles.toggleLabel}>{showHeatmap ? 'PUNTOS' : 'CALOR'}</Text>

        {/* Botón flotante para ver detalles (si hay reporte seleccionado) */}
        {selectedReport && !showHeatmap && (
          <TouchableOpacity
            style={homeMapStyles.floatingReportButton}
            onPress={() => handleViewReportDetails(selectedReport.id)}
          >
            <Image
              source={require('@/assets/images/ver.png')}
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
                {selectedReport.location.address || 'Sin dirección'}
                {selectedReport.location.city ? `, ${selectedReport.location.city}` : ''}
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

            {selectedReport.assigned_to && (
              <View style={homeMapStyles.reportDetailInfo}>
                <Text style={homeMapStyles.reportDetailLabel}>Asignado a:</Text>
                <Text style={homeMapStyles.reportDetailText}>
                  {selectedReport.assigned_to.substring(0, 8)}...
                </Text>
              </View>
            )}

            {selectedReport.reporter_uid && (
              <View style={homeMapStyles.reportDetailInfo}>
                <Text style={homeMapStyles.reportDetailLabel}>Reportante:</Text>
                <Text style={homeMapStyles.reportDetailText}>
                  {selectedReport.is_anonymous_public ? 'Anónimo' : selectedReport.reporter_uid.substring(0, 8) + '...'}
                </Text>
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );
}