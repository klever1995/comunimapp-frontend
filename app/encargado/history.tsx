import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react';
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
import { historyStyles } from '../../styles/encargado/historyStyles';

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

type DateFilterOption = {
  label: string;
  value: string | null;
  getDateRange?: () => { start: Date; end: Date } | null;
};

export default function EncargadoHistoryScreen() {
  const { authState } = useAuth();
  const { user } = authState;
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [selectedDateOption, setSelectedDateOption] = useState<string>('todos');
  
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [showImageModal, setShowImageModal] = useState<boolean>(false);
  
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta': return '#EF4444';
      case 'media': return '#fa8f15ff';
      case 'baja': return '#22C55E';
      default: return '#9CA3AF';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
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

  const dateOptions: DateFilterOption[] = [
    { label: 'Todos', value: 'todos' },
    { label: 'Hoy', value: 'hoy' },
    { label: 'Ayer', value: 'ayer' },
    { label: 'Última semana', value: 'semana' },
    { label: 'Este mes', value: 'mes' },
  ];

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

  const applyFilters = useCallback(() => {
    let filtered = [...reports];
    
    if (selectedStatus !== 'todos') {
      filtered = filtered.filter(report => report.status === selectedStatus);
    }
    
    if (selectedDateOption !== 'todos') {
      const dateRange = getDateRange(selectedDateOption);
      if (dateRange) {
        filtered = filtered.filter(report => {
          try {
            const reportDate = new Date(report.created_at);
            return reportDate >= dateRange.start && reportDate <= dateRange.end;
          } catch {
            return false;
          }
        });
      }
    }
    
    setFilteredReports(filtered);
  }, [reports, selectedStatus, selectedDateOption]);

  const handleViewAdvances = (reportId: string) => {
    router.push(`/encargado/avances?reportId=${reportId}`);
  };

  const handleCreateAdvance = (reportId: string) => {
    router.push(`/encargado/crear-avance?reportId=${reportId}`);
  };

  const openImageGallery = (images: string[], startIndex: number) => {
    setSelectedImages(images);
    setSelectedImageIndex(startIndex);
    setShowImageModal(true);
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
      where('assigned_to', '==', user.id)
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
      console.error('Error escuchando reportes asignados:', error);
      Alert.alert('Error', 'No se pudieron cargar los reportes');
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user?.id]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const priorityCounts = {
    alta: reports.filter(r => r.priority === 'alta').length,
    media: reports.filter(r => r.priority === 'media').length,
    baja: reports.filter(r => r.priority === 'baja').length,
  };

  if (loading) {
    return (
      <View style={historyStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={historyStyles.loadingText}>Cargando reportes asignados...</Text>
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
      {/* Header con gradiente - COMPACTO */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={historyStyles.headerContainer}
      >
        <Text style={historyStyles.headerTitle}>Reportes Asignados</Text>
        <Text style={historyStyles.headerSubtitle}>
          Gestiona los reportes asignados a ti y sus avances
        </Text>
      </LinearGradient>

      {/* 3 Cards de urgencia */}
      <View style={historyStyles.statsContainer}>
        <View style={[historyStyles.statCard, { borderColor: '#EF4444' }]}>
          <Text style={[historyStyles.statValue, { color: '#EF4444' }]}>
            {priorityCounts.alta}
          </Text>
          <Text style={[historyStyles.statLabel, { color: '#EF4444' }]}>Alta</Text>
        </View>
        
        <View style={[historyStyles.statCard, { borderColor: '#fa8f15ff' }]}>
          <Text style={[historyStyles.statValue, { color: '#fa8f15ff' }]}>
            {priorityCounts.media}
          </Text>
          <Text style={[historyStyles.statLabel, { color: '#fa8f15ff' }]}>Media</Text>
        </View>
        
        <View style={[historyStyles.statCard, { borderColor: '#22C55E' }]}>
          <Text style={[historyStyles.statValue, { color: '#22C55E' }]}>
            {priorityCounts.baja}
          </Text>
          <Text style={[historyStyles.statLabel, { color: '#22C55E' }]}>Baja</Text>
        </View>
      </View>

      {/* Modal para filtro de estado */}
      <Modal
        visible={showStatusModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowStatusModal(false)}
      >
        <TouchableOpacity 
          style={historyStyles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowStatusModal(false)}
        >
          <View style={historyStyles.modalContent}>
            <Text style={historyStyles.modalTitle}>Filtrar por estado</Text>
            {['todos', 'asignado', 'en_proceso', 'resuelto', 'cerrado'].map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  historyStyles.modalOption,
                  selectedStatus === status && historyStyles.modalOptionSelected
                ]}
                onPress={() => {
                  setSelectedStatus(status);
                  setShowStatusModal(false);
                }}
              >
                <Text style={[
                  historyStyles.modalOptionText,
                  selectedStatus === status && historyStyles.modalOptionTextSelected
                ]}>
                  {status === 'todos' ? 'Todos los estados' : status.replace('_', ' ')}
                </Text>
                {selectedStatus === status && (
                  <Image
                    source={require('@/assets/images/check.png')}
                    style={historyStyles.modalCheckIcon}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal para filtro de fecha */}
      <Modal
        visible={showDateModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDateModal(false)}
      >
        <TouchableOpacity 
          style={historyStyles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowDateModal(false)}
        >
          <View style={historyStyles.modalContent}>
            <Text style={historyStyles.modalTitle}>Filtrar por fecha</Text>
            {dateOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  historyStyles.modalOption,
                  selectedDateOption === option.value && historyStyles.modalOptionSelected
                ]}
                onPress={() => {
                  setSelectedDateOption(option.value || 'todos');
                  setShowDateModal(false);
                }}
              >
                <Text style={[
                  historyStyles.modalOptionText,
                  selectedDateOption === option.value && historyStyles.modalOptionTextSelected
                ]}>
                  {option.label}
                </Text>
                {selectedDateOption === option.value && (
                  <Image
                    source={require('@/assets/images/check.png')}
                    style={historyStyles.modalCheckIcon}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      <ScrollView 
        contentContainerStyle={historyStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Filtros desplegables */}
        <View style={historyStyles.filtersContainer}>
          <TouchableOpacity 
            style={historyStyles.filterDropdown}
            onPress={() => setShowStatusModal(true)}
          >
            <View style={historyStyles.filterDropdownLeft}>
              <Image 
                source={require('@/assets/images/filtrar.png')}
                style={historyStyles.filterIcon}
              />
              <Text style={historyStyles.filterDropdownText}>
                {selectedStatus === 'todos' ? 'Estado' : selectedStatus.replace('_', ' ')}
              </Text>
            </View>
            <Image 
              source={require('@/assets/images/nombre.png')}
              style={historyStyles.filterArrowIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={historyStyles.filterDropdown}
            onPress={() => setShowDateModal(true)}
          >
            <View style={historyStyles.filterDropdownLeft}>
              <Image 
                source={require('@/assets/images/calendar.png')}
                style={historyStyles.filterIcon}
              />
              <Text style={historyStyles.filterDropdownText}>
                {dateOptions.find(opt => opt.value === selectedDateOption)?.label || 'Fecha'}
              </Text>
            </View>
            <Image 
              source={require('@/assets/images/nombre.png')}
              style={historyStyles.filterArrowIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Contador de resultados */}
        <View style={historyStyles.resultsCounter}>
          <Text style={historyStyles.resultsCounterText}>
            {filteredReports.length} {filteredReports.length === 1 ? 'resultado' : 'resultados'}
          </Text>
        </View>

        {/* Lista de Reportes */}
        <View style={historyStyles.reportList}>
          {filteredReports.length === 0 ? (
            <View style={historyStyles.emptyContainer}>
              <Text style={historyStyles.emptyText}>
                {reports.length === 0 
                  ? 'No tienes reportes asignados' 
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
                    historyStyles.reportCard,
                    { borderLeftWidth: 5, borderLeftColor: getPriorityColor(report.priority) }
                  ]}
                >
                  <View style={historyStyles.userIconContainer}>
                    <Image
                      source={isAnonymous 
                        ? require('@/assets/images/anonimo.png')
                        : require('@/assets/images/nombre.png')
                      }
                      style={{ width: 24, height: 24, resizeMode: 'contain' }}
                    />
                  </View>

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

                  <Text style={historyStyles.descriptionText}>
                    {report.description}
                  </Text>

                  {report.images && report.images.length > 0 && (
                    <View style={historyStyles.imagesContainer}>
                      {report.images.slice(0, 3).map((img, index) => (
                        <TouchableOpacity
                          key={index}
                          onPress={() => openImageGallery(report.images, index)}
                          activeOpacity={0.7}
                        >
                          <Image
                            source={{ uri: img }}
                            style={{ width: 80, height: 80, borderRadius: 8, backgroundColor: '#e2e8f0', resizeMode: 'cover' }}
                          />
                        </TouchableOpacity>
                      ))}
                      {report.images.length > 3 && (
                        <TouchableOpacity
                          style={historyStyles.imagePlaceholder}
                          onPress={() => openImageGallery(report.images, 3)}
                          activeOpacity={0.7}
                        >
                          <Image
                            source={require('@/assets/images/image.png')}
                            style={historyStyles.imagePlaceholderIcon}
                          />
                          <Text style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>
                            +{report.images.length - 3}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}

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

                  {/* Botones de acción - ENCARGADO: Ver Avances y Agregar Avance */}
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

                    <TouchableOpacity
                      style={[historyStyles.actionButton, historyStyles.createAdvanceButton]}
                      onPress={() => handleCreateAdvance(report.id)}
                    >
                      <Image
                        source={require('@/assets/images/reportW.png')}
                        style={{ width: 18, height: 18, resizeMode: 'contain' }}
                      />
                      <Text style={historyStyles.actionButtonText}>Agregar Avance</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

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