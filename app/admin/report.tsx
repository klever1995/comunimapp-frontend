// app/admin/report.tsx - VERSIÓN CON TIEMPO REAL Y DISEÑO MEJORADO
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { reportStyles } from '@/styles/admin/reportStyles';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { collection, onSnapshot, query } from 'firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react'; // AÑADIDO: useCallback
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

// AÑADIDO: Tipo para opciones de fecha
type DateFilterOption = {
  label: string;
  value: string | null;
};

export default function AdminReportScreen() {
  const { authState: { user, token } } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [selectedDateOption, setSelectedDateOption] = useState<string>('todos'); // AÑADIDO: Estado para fecha
  const [encargados, setEncargados] = useState<User[]>([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [assigning, setAssigning] = useState(false);
  
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [showImageModal, setShowImageModal] = useState<boolean>(false);
  const [showStatusFilterModal, setShowStatusFilterModal] = useState(false);
  const [showDateFilterModal, setShowDateFilterModal] = useState(false); // AÑADIDO: Modal para fecha

  // AÑADIDO: Opciones de filtro de fecha
  const dateOptions: DateFilterOption[] = [
    { label: 'Todos', value: 'todos' },
    { label: 'Hoy', value: 'hoy' },
    { label: 'Ayer', value: 'ayer' },
    { label: 'Última semana', value: 'semana' },
    { label: 'Este mes', value: 'mes' },
  ];

  // AÑADIDO: Función para obtener rango de fechas
  const getDateRange = (option: string) => {
    const now = new Date();
    const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    switch (option) {
      case 'hoy': {
        const start = startOfDay(now);
        const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
        return { start, end };
      }
      case 'ayer': {
        const start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const startOfYesterday = startOfDay(start);
        const end = new Date(startOfYesterday.getTime() + 24 * 60 * 60 * 1000);
        return { start: startOfYesterday, end };
      }
      case 'semana': {
        const start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return { start, end: now };
      }
      case 'mes': {
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        return { start, end: now };
      }
      default:
        return null;
    }
  };

  // Cargar reportes en tiempo real con Firestore
  useEffect(() => {
    if (!user?.id) {
      setReports([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    
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

  // AÑADIDO: Función para aplicar filtros (con fecha)
  const applyFilters = useCallback(() => {
    let filtered = [...reports];
    
    // Filtro por estado
    if (selectedStatus !== 'todos') {
      filtered = filtered.filter(report => report.status === selectedStatus);
    }
    
    // Filtro por fecha
    if (selectedDateOption !== 'todos') {
      const dateRange = getDateRange(selectedDateOption);
      if (dateRange) {
        filtered = filtered.filter(report => {
          try {
            const reportDate = report.created_at?.toDate?.() || new Date();
            return reportDate >= dateRange.start && reportDate <= dateRange.end;
          } catch {
            return false;
          }
        });
      }
    }
    
    setFilteredReports(filtered);
  }, [reports, selectedStatus, selectedDateOption]);

  // AÑADIDO: Efecto para aplicar filtros
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

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
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Fecha inválida';
    }
  };

  // Calcular conteos por prioridad para las stats cards
  const priorityCounts = {
    alta: reports.filter(r => r.priority === 'alta').length,
    media: reports.filter(r => r.priority === 'media').length,
    baja: reports.filter(r => r.priority === 'baja').length,
  };

  // Función para abrir visor de imágenes
  const openImageGallery = (images: string[], startIndex: number) => {
    setSelectedImages(images);
    setSelectedImageIndex(startIndex);
    setShowImageModal(true);
  };

  // Función para asignar reporte a encargado
  const handleAssignReport = async (encargadoId: string) => {
    if (!selectedReport || !token) return;

    setAssigning(true);
    
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
      } else {
        const error = await response.json();
        Alert.alert('Error', error.detail || 'Error al asignar reporte');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'No se pudo asignar el reporte');
    }finally {
    // NUEVO: Terminar estado de carga (siempre se ejecuta)
    setAssigning(false);
  }
};

  // Función para cambiar estado
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
      } else {
        const error = await response.json();
        Alert.alert('Error', error.detail || 'Error al cambiar estado');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'No se pudo cambiar el estado');
    }
  };

  // Función para eliminar reporte
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
      {/* Header con gradiente - NUEVO */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={reportStyles.headerContainer}
      >
        <Text style={reportStyles.headerTitle}>Gestión de Reportes</Text>
        <Text style={reportStyles.headerSubtitle}>
          Administra todos los reportes del sistema 
        </Text>
      </LinearGradient>

      {/* 3 Cards de urgencia - NUEVO */}
      <View style={reportStyles.statsContainer}>
        <View style={[reportStyles.statCard, { borderColor: '#EF4444' }]}>
          <Text style={[reportStyles.statValue, { color: '#EF4444' }]}>
            {priorityCounts.alta}
          </Text>
          <Text style={[reportStyles.statLabel, { color: '#EF4444' }]}>Alta</Text>
        </View>
        
        <View style={[reportStyles.statCard, { borderColor: '#fa8f15ff' }]}>
          <Text style={[reportStyles.statValue, { color: '#fa8f15ff' }]}>
            {priorityCounts.media}
          </Text>
          <Text style={[reportStyles.statLabel, { color: '#fa8f15ff' }]}>Media</Text>
        </View>
        
        <View style={[reportStyles.statCard, { borderColor: '#22C55E' }]}>
          <Text style={[reportStyles.statValue, { color: '#22C55E' }]}>
            {priorityCounts.baja}
          </Text>
          <Text style={[reportStyles.statLabel, { color: '#22C55E' }]}>Baja</Text>
        </View>
      </View>

      {/* Modal para filtro de estado - MEJORADO */}
      <Modal
        visible={showStatusFilterModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowStatusFilterModal(false)}
      >
        <TouchableOpacity 
          style={reportStyles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowStatusFilterModal(false)}
        >
          <View style={reportStyles.modalContent}>
            <Text style={reportStyles.modalTitle}>Filtrar por estado</Text>
            {['todos', 'pendiente', 'asignado', 'en_proceso', 'resuelto', 'cerrado'].map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  reportStyles.modalOption,
                  selectedStatus === status && reportStyles.modalOptionSelected
                ]}
                onPress={() => {
                  setSelectedStatus(status);
                  setShowStatusFilterModal(false);
                }}
              >
                <Text style={[
                  reportStyles.modalOptionText,
                  selectedStatus === status && reportStyles.modalOptionTextSelected
                ]}>
                  {status === 'todos' ? 'Todos los estados' : status.replace('_', ' ')}
                </Text>
                {selectedStatus === status && (
                  <Image
                    source={require('@/assets/images/check.png')}
                    style={reportStyles.modalCheckIcon}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* AÑADIDO: Modal para filtro de fecha */}
      <Modal
        visible={showDateFilterModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDateFilterModal(false)}
      >
        <TouchableOpacity 
          style={reportStyles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowDateFilterModal(false)}
        >
          <View style={reportStyles.modalContent}>
            <Text style={reportStyles.modalTitle}>Filtrar por fecha</Text>
            {dateOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  reportStyles.modalOption,
                  selectedDateOption === option.value && reportStyles.modalOptionSelected
                ]}
                onPress={() => {
                  setSelectedDateOption(option.value || 'todos');
                  setShowDateFilterModal(false);
                }}
              >
                <Text style={[
                  reportStyles.modalOptionText,
                  selectedDateOption === option.value && reportStyles.modalOptionTextSelected
                ]}>
                  {option.label}
                </Text>
                {selectedDateOption === option.value && (
                  <Image
                    source={require('@/assets/images/check.png')}
                    style={reportStyles.modalCheckIcon}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      <ScrollView 
        contentContainerStyle={reportStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Filtros desplegables - MEJORADO */}
        <View style={reportStyles.filtersContainer}>
          <TouchableOpacity 
            style={reportStyles.filterDropdown}
            onPress={() => setShowStatusFilterModal(true)}
          >
            <View style={reportStyles.filterDropdownLeft}>
              <Image 
                source={require('@/assets/images/filtrar.png')}
                style={reportStyles.filterIcon}
              />
              <Text style={reportStyles.filterDropdownText}>
                {selectedStatus === 'todos' ? 'Estado' : selectedStatus.replace('_', ' ')}
              </Text>
            </View>
            <Image 
              source={require('@/assets/images/nombre.png')}
              style={reportStyles.filterArrowIcon}
            />
          </TouchableOpacity>

          {/* CAMBIO: "Tiempo real" cambiado a "Fecha" */}
          <TouchableOpacity 
            style={reportStyles.filterDropdown}
            onPress={() => setShowDateFilterModal(true)}
          >
            <View style={reportStyles.filterDropdownLeft}>
              <Image 
                source={require('@/assets/images/calendar.png')} 
                style={reportStyles.filterIcon}
              />
              <Text style={reportStyles.filterDropdownText}>
                {dateOptions.find(opt => opt.value === selectedDateOption)?.label || 'Fecha'}
              </Text>
            </View>
            <Image 
              source={require('@/assets/images/nombre.png')}
              style={reportStyles.filterArrowIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Contador de resultados - MEJORADO */}
        <View style={reportStyles.resultsCounter}>
          <Text style={reportStyles.resultsCounterText}>
            {filteredReports.length} {filteredReports.length === 1 ? 'resultado' : 'resultados'} 
            {' '}de {reports.length} reportes totales
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

                  {/* Imágenes - CON VISOR MODAL */}
                  {report.images && report.images.length > 0 && (
                    <View style={reportStyles.imagesContainer}>
                      {report.images.slice(0, 3).map((img, index) => (
                        <TouchableOpacity
                          key={index}
                          onPress={() => openImageGallery(report.images, index)}
                          activeOpacity={0.7}
                        >
                          <Image
                            source={{ uri: img }}
                            style={reportStyles.imageThumbnail}
                          />
                        </TouchableOpacity>
                      ))}
                      {report.images.length > 3 && (
                        <TouchableOpacity
                          style={reportStyles.imagePlaceholder}
                          onPress={() => openImageGallery(report.images, 3)}
                          activeOpacity={0.7}
                        >
                          <Image
                            source={require('@/assets/images/image.png')}
                            style={reportStyles.imagePlaceholderIcon}
                          />
                          <Text style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>
                            +{report.images.length - 3}
                          </Text>
                        </TouchableOpacity>
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
                      style={[
                        reportStyles.actionButton, 
                        reportStyles.assignButton,
                        // NUEVO: Estilo cuando está deshabilitado
                        report.status !== 'pendiente' && { opacity: 0.5 }
                      ]}
                      onPress={() => {
                        setSelectedReport(report);
                        setShowAssignModal(true);
                      }}
                      // NUEVO: Deshabilitar cuando no esté en estado pendiente
                      disabled={report.status !== 'pendiente'}
                    >
                      <Image
                        source={require('@/assets/images/asignar.png')}
                        style={{ width: 16, height: 16, resizeMode: 'contain' }}
                      />
                      <Text style={reportStyles.actionButtonText}>Asignar</Text>
                    </TouchableOpacity>

                    {/* Botón: Cambiar Estado */}
                    <TouchableOpacity
                      style={[reportStyles.actionButton, reportStyles.statusButton]}
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
                      style={[reportStyles.actionButton, reportStyles.advancesButton]}
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
                      style={[reportStyles.actionButton, reportStyles.deleteButton]}
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
        animationType="fade"
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
                    style={[
                      reportStyles.modalItem,
                      assigning && { opacity: 0.5 } // Añade opacidad cuando está cargando
                    ]}
                    onPress={() => handleAssignReport(encargado.id)}
                    disabled={assigning} 
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
            
            {/* AÑADE ESTO JUSTO AQUÍ - OVERLAY DE CARGA */}
            {assigning && (
              <View style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 16,
                zIndex: 10,
              }}>
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text style={{ 
                  marginTop: 10, 
                  color: '#3B82F6', 
                  fontFamily: 'Roboto_500Medium',
                  fontSize: 16 
                }}>
                  Asignando reporte...
                </Text>
              </View>
            )}
            
            <TouchableOpacity
              style={[
                reportStyles.modalCancelButton,
                assigning && { opacity: 0.5 } // También deshabilitar botón cancelar
              ]}
              onPress={() => setShowAssignModal(false)}
              disabled={assigning}
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
        animationType="fade"
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

      {/* Modal para visor de imágenes */}
      <Modal
        visible={showImageModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowImageModal(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 40,
              right: 20,
              zIndex: 10,
              padding: 10,
            }}
            onPress={() => setShowImageModal(false)}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 24 }}>✕</Text>
          </TouchableOpacity>
          
          {selectedImages.length > 0 && (
            <Image
              source={{ uri: selectedImages[selectedImageIndex] }}
              style={{
                width: '95%',
                height: '70%',
                resizeMode: 'contain',
              }}
            />
          )}
          
          {selectedImages.length > 1 && (
            <View style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 20,
              gap: 20,
            }}>
              <TouchableOpacity
                onPress={() => setSelectedImageIndex(prev => 
                  prev > 0 ? prev - 1 : selectedImages.length - 1
                )}
                disabled={selectedImages.length <= 1}
              >
                <Text style={{ color: '#FFFFFF', fontSize: 24 }}>◀</Text>
              </TouchableOpacity>
              
              <Text style={{ color: '#FFFFFF', fontSize: 16 }}>
                {selectedImageIndex + 1} / {selectedImages.length}
              </Text>
              
              <TouchableOpacity
                onPress={() => setSelectedImageIndex(prev => 
                  prev < selectedImages.length - 1 ? prev + 1 : 0
                )}
                disabled={selectedImages.length <= 1}
              >
                <Text style={{ color: '#FFFFFF', fontSize: 24 }}>▶</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}