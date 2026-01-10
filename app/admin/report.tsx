// app/admin/report.tsx - VERSIÓN CON TIEMPO REAL
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { reportStyles } from '@/styles/admin/reportStyles';
import { router } from 'expo-router';
import { collection, onSnapshot, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

interface Report {
  id: string;
  description: string;
  location: {
    address: string;
    city: string;
  };
  images: string[];
  priority: 'alta' | 'media' | 'baja';
  status: string;
  created_at: any; // Firestore timestamp
  assigned_to: string | null;
  reporter_uid: string | null;
  is_anonymous_public?: boolean;
}

interface User {
  id: string;
  username: string;
  role: string;
  organization?: string;
}

type ReportStatus = 'pendiente' | 'asignado' | 'en_proceso' | 'resuelto' | 'cerrado';

export default function AdminReportScreen() {
  const { authState: { user, token } } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [encargados, setEncargados] = useState<User[]>([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  // Cargar reportes en tiempo real con Firestore
  useEffect(() => {
    if (!user?.id) {
      setReports([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    
    // IMPORTANTE: Admin ve TODOS los reportes (sin filtro)
    const q = query(collection(db, 'reports'));
    
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
          created_at: data.created_at,
          assigned_to: data.assigned_to || null,
          reporter_uid: data.reporter_uid || null,
          is_anonymous_public: data.is_anonymous_public || false,
        });
      });
      // Ordenar por fecha (más recientes primero)
      reportsData.sort((a, b) => {
        const dateA = a.created_at?.toDate?.() || new Date(0);
        const dateB = b.created_at?.toDate?.() || new Date(0);
        return dateB.getTime() - dateA.getTime();
      });
      setReports(reportsData);
      setLoading(false);
    }, (error) => {
      console.error('Error escuchando reportes:', error);
      Alert.alert('Error', 'No se pudieron cargar los reportes');
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [user?.id]);

  // Cargar encargados (solo una vez al inicio)
  useEffect(() => {
    if (token) {
      fetchEncargados();
    }
  }, [token]);

  const fetchEncargados = async () => {
    try {
      const response = await fetch(`${API_URL}/users/?role=encargado`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setEncargados(data);
    } catch (error) {
      console.error('Error cargando encargados:', error);
    }
  };

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...reports];
    if (selectedStatus !== 'todos') {
      filtered = filtered.filter(report => report.status === selectedStatus);
    }
    setFilteredReports(filtered);
  }, [reports, selectedStatus]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta': return '#EF4444';
      case 'media': return '#fa8f15ff';
      case 'baja': return '#22C55E';
      default: return '#9CA3AF';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendiente': return '#F59E0B';
      case 'asignado': return '#3B82F6';
      case 'en_proceso': return '#8B5CF6';
      case 'resuelto': return '#10B981';
      case 'cerrado': return '#6B7280';
      default: return '#9CA3AF';
    }
  };

  const formatDate = (timestamp: any) => {
    try {
      const date = timestamp?.toDate?.() || new Date();
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

  // Función para asignar reporte a encargado (usa el endpoint FastAPI)
  const handleAssignReport = async (encargadoId: string) => {
    if (!selectedReport || !token) return;
    
    try {
      const response = await fetch(`${API_URL}/reports/${selectedReport.id}/assign?encargado_id=${encargadoId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        Alert.alert('Éxito', 'Reporte asignado correctamente');
        setShowAssignModal(false);
        // No necesitamos fetchReports() porque onSnapshot actualizará automáticamente
      } else {
        const error = await response.json();
        Alert.alert('Error', error.detail || 'Error al asignar reporte');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'No se pudo asignar el reporte');
    }
  };

  // Función para cambiar estado (usa el endpoint FastAPI)
  const handleChangeStatus = async (newStatus: ReportStatus) => {
    if (!selectedReport || !token) return;
    
    try {
      const response = await fetch(`${API_URL}/reports/${selectedReport.id}/status?new_status=${newStatus}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        Alert.alert('Éxito', 'Estado actualizado correctamente');
        setShowStatusModal(false);
        // No necesitamos fetchReports() porque onSnapshot actualizará automáticamente
      } else {
        const error = await response.json();
        Alert.alert('Error', error.detail || 'Error al cambiar estado');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'No se pudo cambiar el estado');
    }
  };

  // Función para eliminar reporte (usa el endpoint FastAPI)
  const handleDeleteReport = (reportId: string) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que quieres eliminar este reporte? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`${API_URL}/reports/${reportId}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${token}`,
                },
              });
              
              if (response.ok) {
                Alert.alert('Éxito', 'Reporte eliminado correctamente');
                // No necesitamos fetchReports() porque onSnapshot actualizará automáticamente
              } else {
                const error = await response.json();
                Alert.alert('Error', error.detail || 'Error al eliminar reporte');
              }
            } catch (error) {
              console.error('Error:', error);
              Alert.alert('Error', 'No se pudo eliminar el reporte');
            }
          }
        }
      ]
    );
  };

  // Función para ver avances
  const handleViewAdvances = (reportId: string) => {
    router.push(`/admin/avances?reportId=${reportId}`);
    // TODO: Navegar a /admin/avances?reportId=${reportId}
  };

  if (loading) {
    return (
      <View style={reportStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={reportStyles.loadingText}>Cargando todos los reportes...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={reportStyles.emptyContainer}>
        <Text style={reportStyles.emptyText}>
          No estás autenticado. Por favor inicia sesión.
        </Text>
      </View>
    );
  }

  return (
    <View style={reportStyles.container}>
      <ScrollView 
        contentContainerStyle={reportStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={reportStyles.header}>
          <Text style={reportStyles.title}>Gestión de Reportes</Text>
          <Text style={reportStyles.subtitle}>
            Administra todos los reportes del sistema (tiempo real)
          </Text>
        </View>

        {/* Filtros */}
        <View style={reportStyles.filtersContainer}>
          <TouchableOpacity 
            style={reportStyles.filterButton}
            onPress={() => {
              Alert.alert(
                'Filtrar por estado',
                '',
                [
                  { text: 'Todos', onPress: () => setSelectedStatus('todos') },
                  { text: 'Pendiente', onPress: () => setSelectedStatus('pendiente') },
                  { text: 'Asignado', onPress: () => setSelectedStatus('asignado') },
                  { text: 'En proceso', onPress: () => setSelectedStatus('en_proceso') },
                  { text: 'Resuelto', onPress: () => setSelectedStatus('resuelto') },
                  { text: 'Cerrado', onPress: () => setSelectedStatus('cerrado') },
                  { text: 'Cancelar', style: 'cancel' }
                ]
              );
            }}
          >
            <Image 
              source={require('@/assets/images/filtrar.png')}
              style={{ width: 20, height: 20, resizeMode: 'contain' }}
            />
            <Text style={reportStyles.filterButtonText}>
              {selectedStatus === 'todos' ? 'Estado' : selectedStatus.replace('_', ' ')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[reportStyles.filterButton]}
            onPress={() => {
              // Botón informativo ya que es tiempo real
              Alert.alert('Información', 'Los reportes se actualizan automáticamente en tiempo real');
            }}
          >
            <Image 
              source={require('@/assets/images/edit.png')}
              style={{ width: 20, height: 20, resizeMode: 'contain' }}
            />
            <Text style={reportStyles.filterButtonText}>
              Tiempo real
            </Text>
          </TouchableOpacity>
        </View>

        {/* Contador */}
        <View style={reportStyles.counterContainer}>
          <Text style={reportStyles.counterText}>
            Mostrando {filteredReports.length} de {reports.length} reportes
          </Text>
        </View>

        {/* Lista de Reportes */}
        <View style={reportStyles.reportList}>
          {filteredReports.length === 0 ? (
            <View style={reportStyles.emptyContainer}>
              <Text style={reportStyles.emptyText}>
                {reports.length === 0 
                  ? 'No hay reportes en el sistema' 
                  : 'No hay reportes con los filtros aplicados'}
              </Text>
            </View>
          ) : (
            filteredReports.map((report) => {
              const isAnonymous = report.is_anonymous_public === true;

              return (
                <View 
                  key={report.id} 
                  style={[
                    reportStyles.reportCard,
                    { borderLeftWidth: 5, borderLeftColor: getPriorityColor(report.priority) }
                  ]}
                >
                  {/* Prioridad y Status */}
                  <View style={reportStyles.statusBadges}>
                    <View style={[reportStyles.priorityBadge, { backgroundColor: getPriorityColor(report.priority) }]}>
                      <Text style={reportStyles.badgeText}>
                        {report.priority.toUpperCase()}
                      </Text>
                    </View>
                    <View style={[reportStyles.statusBadge, { backgroundColor: getStatusColor(report.status) }]}>
                      <Text style={reportStyles.badgeText}>
                        {report.status.replace('_', ' ').toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  {/* Encabezado con ubicación */}
                  <View style={reportStyles.reportHeader}>
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
                    
                    {/* Icono de anonimato */}
                    <View style={reportStyles.userIconContainer}>
                      <Image
                        source={isAnonymous 
                          ? require('@/assets/images/anonimo.png')
                          : require('@/assets/images/nombre.png')
                        }
                        style={{ width: 20, height: 20, resizeMode: 'contain' }}
                      />
                    </View>
                  </View>

                  {/* Descripción */}
                  <Text style={reportStyles.descriptionText}>
                    {report.description}
                  </Text>

                  {/* Información adicional */}
                  <View style={reportStyles.infoContainer}>
                    <View style={reportStyles.infoRow}>
                      <Text style={reportStyles.infoLabel}>Reportante:</Text>
                      <Text style={reportStyles.infoValue}>
                        {isAnonymous ? 'Anónimo' : (report.reporter_uid ? report.reporter_uid.substring(0, 8) + '...' : 'No disponible')}
                      </Text>
                    </View>
                    {report.assigned_to && (
                      <View style={reportStyles.infoRow}>
                        <Text style={reportStyles.infoLabel}>Asignado a:</Text>
                        <Text style={reportStyles.infoValue}>
                          {report.assigned_to.substring(0, 8)}...
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Imágenes */}
                  {report.images && report.images.length > 0 && (
                    <View style={reportStyles.imagesContainer}>
                      {report.images.slice(0, 3).map((img, index) => (
                        <Image
                          key={index}
                          source={{ uri: img }}
                          style={reportStyles.imageThumbnail}
                        />
                      ))}
                      {report.images.length > 3 && (
                        <View style={reportStyles.imagePlaceholder}>
                          <Image
                            source={require('@/assets/images/image.png')}
                            style={reportStyles.imagePlaceholderIcon}
                          />
                          <Text style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>
                            +{report.images.length - 3}
                          </Text>
                        </View>
                      )}
                    </View>
                  )}

                  {/* Pie: Fecha */}
                  <View style={reportStyles.reportFooter}>
                    <View style={reportStyles.dateContainer}>
                      <Image
                        source={require('@/assets/images/calendar.png')}
                        style={reportStyles.dateIcon}
                      />
                      <Text style={reportStyles.dateText}>
                        {formatDate(report.created_at)}
                      </Text>
                    </View>
                  </View>

                  {/* Botones de acción - 4 BOTONES PARA ADMIN */}
                  <View style={reportStyles.actionsContainer}>
                    {/* Botón: Asignar */}
                    <TouchableOpacity
                      style={[reportStyles.actionButton, { backgroundColor: '#3B82F6' }]}
                      onPress={() => {
                        setSelectedReport(report);
                        setShowAssignModal(true);
                      }}
                    >
                      <Image
                        source={require('@/assets/images/asignar.png')}
                        style={{ width: 16, height: 16, resizeMode: 'contain' }}
                      />
                      <Text style={reportStyles.actionButtonText}>Asignar</Text>
                    </TouchableOpacity>

                    {/* Botón: Cambiar Estado */}
                    <TouchableOpacity
                      style={[reportStyles.actionButton, { backgroundColor: '#8B5CF6' }]}
                      onPress={() => {
                        setSelectedReport(report);
                        setShowStatusModal(true);
                      }}
                    >
                      <Image
                        source={require('@/assets/images/recargaW.png')}
                        style={{ width: 16, height: 16, resizeMode: 'contain' }}
                      />
                      <Text style={reportStyles.actionButtonText}>Estado</Text>
                    </TouchableOpacity>

                    {/* Botón: Ver Avances */}
                    <TouchableOpacity
                      style={[reportStyles.actionButton, { backgroundColor: '#10B981' }]}
                      onPress={() => handleViewAdvances(report.id)}
                    >
                      <Image
                        source={require('@/assets/images/check.png')}
                        style={{ width: 16, height: 16, resizeMode: 'contain' }}
                      />
                      <Text style={reportStyles.actionButtonText}>Avances</Text>
                    </TouchableOpacity>

                    {/* Botón: Eliminar */}
                    <TouchableOpacity
                      style={[reportStyles.actionButton, { backgroundColor: '#EF4444' }]}
                      onPress={() => handleDeleteReport(report.id)}
                    >
                      <Image
                        source={require('@/assets/images/borrar.png')}
                        style={{ width: 16, height: 16, resizeMode: 'contain' }}
                      />
                      <Text style={reportStyles.actionButtonText}>Eliminar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Modal para asignar reporte */}
      <Modal
        visible={showAssignModal}
        transparent={true}
        animationType="slide"
      >
        <View style={reportStyles.modalOverlay}>
          <View style={reportStyles.modalContainer}>
            <Text style={reportStyles.modalTitle}>Asignar Reporte</Text>
            <Text style={reportStyles.modalSubtitle}>
              Selecciona un encargado para el reporte
            </Text>
            
            <ScrollView style={reportStyles.modalList}>
              {encargados.length === 0 ? (
                <Text style={reportStyles.emptyText}>No hay encargados disponibles</Text>
              ) : (
                encargados.map((encargado) => (
                  <TouchableOpacity
                    key={encargado.id}
                    style={reportStyles.modalItem}
                    onPress={() => handleAssignReport(encargado.id)}
                  >
                    <View style={reportStyles.modalItemContent}>
                      <Text style={reportStyles.modalItemText}>{encargado.username}</Text>
                      {encargado.organization && (
                        <Text style={reportStyles.modalItemSubtext}>{encargado.organization}</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
            
            <TouchableOpacity
              style={reportStyles.modalCancelButton}
              onPress={() => setShowAssignModal(false)}
            >
              <Text style={reportStyles.modalCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal para cambiar estado */}
      <Modal
        visible={showStatusModal}
        transparent={true}
        animationType="slide"
      >
        <View style={reportStyles.modalOverlay}>
          <View style={reportStyles.modalContainer}>
            <Text style={reportStyles.modalTitle}>Cambiar Estado</Text>
            <Text style={reportStyles.modalSubtitle}>
              Selecciona el nuevo estado del reporte
            </Text>
            
            <View style={reportStyles.modalList}>
              {(['pendiente', 'asignado', 'en_proceso', 'resuelto', 'cerrado'] as ReportStatus[]).map((status) => (
                <TouchableOpacity
                  key={status}
                  style={reportStyles.modalItem}
                  onPress={() => handleChangeStatus(status)}
                >
                  <View style={[reportStyles.statusIndicator, { backgroundColor: getStatusColor(status) }]} />
                  <Text style={reportStyles.modalItemText}>
                    {status.replace('_', ' ').toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <TouchableOpacity
              style={reportStyles.modalCancelButton}
              onPress={() => setShowStatusModal(false)}
            >
              <Text style={reportStyles.modalCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}