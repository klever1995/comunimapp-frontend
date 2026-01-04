import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { router } from 'expo-router';
import { collection, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { historyStyles } from '../styles/reportante/historyStyles';

// Tipo para los reportes (basado en Firebase)
type Report = {
  id: string;
  description: string;
  location: {
    address: string;
    city: string;
  };
  images: string[];
  priority: 'alta' | 'media' | 'baja';
  status: string;
  created_at: string;
  assigned_to: string | null;
  reporter_uid: string | null;
  is_anonymous_public?: boolean;
};

export default function HistoryScreen() {
  const { authState } = useAuth();
  const { user } = authState;
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta': return '#EF4444'; // rojo
      case 'media': return '#fa8f15ff'; // naranja
      case 'baja': return '#22C55E'; // verde
      default: return '#9CA3AF'; // gris neutro
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Fecha inválida';
    }
  };

  const applyFilters = useCallback(() => {
    let filtered = [...reports];
    if (selectedStatus !== 'todos') {
      filtered = filtered.filter(report => report.status === selectedStatus);
    }
    if (selectedDate) {
      filtered = filtered.filter(report => {
        try {
          const reportDate = new Date(report.created_at).toDateString();
          const selected = new Date(selectedDate).toDateString();
          return reportDate === selected;
        } catch {
          return true;
        }
      });
    }
    setFilteredReports(filtered);
  }, [reports, selectedStatus, selectedDate]);

  const handleDeleteReport = async (reportId: string, isAssigned: boolean) => {
    if (isAssigned) {
      Alert.alert('No permitido', 'Este reporte ya está asignado a un encargado');
      return;
    }
    if (!user?.id) {
      Alert.alert('Error', 'No estás autenticado');
      return;
    }
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de eliminar este reporte?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            setDeletingId(reportId);
            try {
              await deleteDoc(doc(db, 'reports', reportId));
            } catch (error) {
              console.error('Error eliminando:', error);
              Alert.alert('Error', 'No se pudo eliminar el reporte');
            } finally {
              setDeletingId(null);
            }
          },
        },
      ]
    );
  };

  const handleViewAdvances = (reportId: string) => {
    router.push(`/reportante/avances?reportId=${reportId}`);
  };

  useEffect(() => {
    if (!user?.id) {
      setReports([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const q = query(
      collection(db, 'reports'),
      where('reporter_uid', '==', user.id)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const reportsData: Report[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        reportsData.push({
          id: doc.id,
          description: data.description || '',
          location: data.location || { address: 'Sin ubicación', city: '' },
          images: data.images || [],
          priority: data.priority || 'media',
          status: data.status || 'pendiente',
          created_at: data.created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
          assigned_to: data.assigned_to || null,
          reporter_uid: data.reporter_uid || null,
          is_anonymous_public: data.is_anonymous_public || false,
        });
      });
      reportsData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setReports(reportsData);
      setLoading(false);
    }, (error) => {
      console.error('Error escuchando reportes:', error);
      Alert.alert('Error', 'No se pudieron cargar los reportes');
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user?.id]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  if (loading) {
    return (
      <View style={historyStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={historyStyles.loadingText}>Cargando reportes...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={historyStyles.emptyContainer}>
        <Text style={historyStyles.emptyText}>
          No estás autenticado. Por favor inicia sesión.
        </Text>
      </View>
    );
  }

  return (
    <View style={historyStyles.container}>
      <ScrollView 
        contentContainerStyle={historyStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={historyStyles.header}>
          <Text style={historyStyles.title}>Historial de Reportes</Text>
          <Text style={historyStyles.subtitle}>
            Revisa tus reportes anteriores y su estado actual
          </Text>
        </View>

        {/* Filtros */}
        <View style={historyStyles.filtersContainer}>
          <TouchableOpacity 
            style={historyStyles.filterButton}
            onPress={() => Alert.alert('Filtrar por estado', 'Próximamente')}
          >
            <Image 
              source={require('@/assets/images/filtrar.png')}
              style={{ width: 20, height: 20, resizeMode: 'contain' }}
            />
            <Text style={historyStyles.filterButtonText}>
              {selectedStatus === 'todos' ? 'Estado' : selectedStatus}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={historyStyles.filterButton}
            onPress={() => Alert.alert('Filtrar por fecha', 'Próximamente')}
          >
            <Image 
              source={require('@/assets/images/calendar.png')}
              style={{ width: 20, height: 20, resizeMode: 'contain' }}
            />
            <Text style={historyStyles.filterButtonText}>
              {selectedDate ? 'Fecha selec.' : 'Fecha'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Lista de Reportes */}
        <View style={historyStyles.reportList}>
          {filteredReports.length === 0 ? (
            <View style={historyStyles.emptyContainer}>
              <Text style={historyStyles.emptyText}>
                {reports.length === 0 
                  ? 'No tienes reportes registrados' 
                  : 'No hay reportes con los filtros aplicados'}
              </Text>
            </View>
          ) : (
            filteredReports.map((report) => {
              const isAssigned = report.assigned_to !== null;
              const isAnonymous = report.is_anonymous_public === true;

              return (
                <View 
                  key={report.id} 
                  style={[
                    historyStyles.reportCard,
                    { borderLeftWidth: 5, borderLeftColor: getPriorityColor(report.priority) }
                  ]}
                >
                  {/* Icono de usuario anónimo/no anónimo */}
                  <View style={historyStyles.userIconContainer}>
                    <Image
                      source={isAnonymous 
                        ? require('@/assets/images/anonimo.png')
                        : require('@/assets/images/nombre.png')
                      }
                      style={{ width: 24, height: 24, resizeMode: 'contain' }}
                    />
                  </View>

                  {/* Encabezado con ubicación y prioridad */}
                  <View style={historyStyles.reportHeader}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                      <Image
                        source={require('@/assets/images/location.png')}
                        style={{ width: 16, height: 16, marginRight: 6, resizeMode: 'contain' }}
                      />
                      <Text
                        style={{ flexShrink: 1, fontFamily: 'Roboto_700Bold', fontSize: 16, color: '#1e293b' }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {report.location.address || 'Sin ubicación'}
                      </Text>
                    </View>
                  </View>

                  {/* Descripción */}
                  <Text style={historyStyles.descriptionText}>
                    {report.description}
                  </Text>

                  {/* Imágenes */}
                  {report.images && report.images.length > 0 && (
                    <View style={historyStyles.imagesContainer}>
                      {report.images.slice(0, 3).map((img, index) => (
                        <Image
                          key={index}
                          source={{ uri: img }}
                          style={{ width: 60, height: 60, borderRadius: 8, backgroundColor: '#e2e8f0', resizeMode: 'cover' }}
                        />
                      ))}
                      {report.images.length > 3 && (
                        <View style={historyStyles.imagePlaceholder}>
                          <Image
                            source={require('@/assets/images/image.png')}
                            style={historyStyles.imagePlaceholderIcon}
                          />
                          <Text style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>
                            +{report.images.length - 3}
                          </Text>
                        </View>
                      )}
                    </View>
                  )}

                  {/* Pie: Fecha y Estado */}
                  <View style={historyStyles.reportFooter}>
                    <View style={historyStyles.dateContainer}>
                      <Image
                        source={require('@/assets/images/calendar.png')}
                        style={historyStyles.dateIcon}
                      />
                      <Text style={historyStyles.dateText}>
                        {formatDate(report.created_at)}
                      </Text>
                    </View>
                    <View style={historyStyles.statusContainer}>
                      <Text style={historyStyles.statusText}>
                        {report.status.replace('_', ' ')}
                      </Text>
                    </View>
                  </View>

                  {/* Botones de acción */}
                  <View style={historyStyles.actionsContainer}>
                    <TouchableOpacity
                      style={[historyStyles.actionButton, historyStyles.advancesButton]}
                      onPress={() => handleViewAdvances(report.id)}
                    >
                      <Image
                        source={require('@/assets/images/check.png')}
                        style={{ width: 18, height: 18, resizeMode: 'contain' }}
                      />
                      <Text style={historyStyles.actionButtonText}>Ver Avances</Text>
                    </TouchableOpacity>

                    {!isAssigned && (
                      <TouchableOpacity
                        style={[historyStyles.actionButton, historyStyles.deleteButton]}
                        onPress={() => handleDeleteReport(report.id, isAssigned)}
                        disabled={deletingId === report.id}
                      >
                        {deletingId === report.id ? (
                          <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                          <>
                            <Image
                              source={require('@/assets/images/borrar.png')}
                              style={{ width: 18, height: 18, resizeMode: 'contain' }}
                            />
                            <Text style={historyStyles.actionButtonText}>Eliminar</Text>
                          </>
                        )}
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
}
