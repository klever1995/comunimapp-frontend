import { SafeArea } from '@/components/ui/safe-area';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { avanceStyles } from '@/styles/admin/avanceStyles';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import { collection, doc, getDoc, onSnapshot, query, Timestamp, where } from 'firebase/firestore';
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

// Tipos basados en Firestore - CORREGIDO: 3 tipos igual que otras pantallas
type CaseUpdate = {
  id: string;
  message: string;
  update_type: 'avance' | 'cambio_estado' | 'observacion'; // CAMBIADO: 'observacion' en lugar de 'comentario'
  new_status?: string;
  images: string[];
  created_at: string;
  report_id: string;
  encargado_id?: string;
};

type ReportInfo = {
  id: string;
  description: string;
  location: {
    address: string;
    city: string;
  };
  status: string;
  assigned_to: string | null;
  reporter_uid?: string | null;
  is_anonymous_public?: boolean;
};

export default function AdminAvancesScreen() {
  const { reportId } = useLocalSearchParams<{ reportId: string }>();
  const { authState } = useAuth();
  const { user, token } = authState;
  
  const [updates, setUpdates] = useState<CaseUpdate[]>([]);
  const [reportInfo, setReportInfo] = useState<ReportInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [showImageModal, setShowImageModal] = useState<boolean>(false);

  // Función para obtener el icono según el tipo de actualización - CORREGIDO
  const getUpdateTypeIcon = (type: string) => {
    switch (type) {
      case 'avance':
        return require('@/assets/images/check.png');
      case 'cambio_estado':
        return require('@/assets/images/recarga.png'); // CAMBIADO: recarga en lugar de filtrar
      case 'observacion': // CAMBIADO: observacion en lugar de comentario
        return require('@/assets/images/ver.png');
      default:
        return require('@/assets/images/check.png');
    }
  };

  // Función para obtener texto amigable del tipo de actualización - CORREGIDO
  const getUpdateTypeText = (type: string) => {
    switch (type) {
      case 'avance':
        return 'Avance';
      case 'cambio_estado':
        return 'Cambio de estado';
      case 'observacion': // CAMBIADO: observacion en lugar de comentario
        return 'Observación';
      default:
        return type;
    }
  };

  // Función para formatear fecha
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  // Función para obtener el color según el estado
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pendiente':
        return '#f97316';
      case 'asignado':
        return '#3B82F6';
      case 'en_proceso':
        return '#8B5CF6';
      case 'resuelto':
        return '#10B981';
      case 'cerrado':
        return '#6B7280';
      case 'cancelado':
        return '#dc2626';
      default:
        return '#64748b';
    }
  };

  // Función para obtener color según tipo de actualización - CORREGIDO
  const getUpdateTypeColor = (type: string) => {
    switch (type) {
      case 'avance':
        return '#2563EB'; // Azul
      case 'cambio_estado':
        return '#f97316'; // Naranja
      case 'observacion': // CAMBIADO: observacion
        return '#8b5cf6'; // Violeta
      default:
        return '#64748b';
    }
  };

  // Función para eliminar un avance (Admin puede eliminar cualquier avance)
  const handleDeleteUpdate = async (updateId: string) => {
    if (!token || !user?.id) {
      Alert.alert('Error', 'No estás autenticado');
      return;
    }

    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de eliminar este avance? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            setDeletingId(updateId);
            try {
              const response = await fetch(`${API_URL}/cases/updates/${updateId}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              });

              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Error al eliminar el avance');
              }

              Alert.alert('Éxito', 'Avance eliminado correctamente');
            } catch (error) {
              console.error('Error eliminando avance:', error);
              Alert.alert('Error', error instanceof Error ? error.message : 'No se pudo eliminar el avance');
            } finally {
              setDeletingId(null);
            }
          },
        },
      ]
    );
  };

  // Función para abrir visor de imágenes
  const openImageGallery = (images: string[], startIndex: number) => {
    setSelectedImages(images);
    setSelectedImageIndex(startIndex);
    setShowImageModal(true);
  };

  // Calcular conteos por tipo de actualización - CORREGIDO
  const updateTypeCounts = {
    avance: updates.filter(u => u.update_type === 'avance').length,
    cambio_estado: updates.filter(u => u.update_type === 'cambio_estado').length,
    observacion: updates.filter(u => u.update_type === 'observacion').length, // CAMBIADO
  };

  // Efecto para cargar información del reporte
  useEffect(() => {
    if (!reportId || !user?.id) {
      setError('Datos incompletos');
      setLoading(false);
      return;
    }

    const loadReportInfo = async () => {
      try {
        const reportDoc = await getDoc(doc(db, 'reports', reportId));
        
        if (!reportDoc.exists()) {
          setError('Reporte no encontrado');
          setLoading(false);
          return;
        }

        const reportData = reportDoc.data();
        
        // ADMIN puede ver cualquier reporte sin restricciones
        setReportInfo({
          id: reportDoc.id,
          description: reportData.description || '',
          location: reportData.location || { address: 'Sin ubicación', city: '' },
          status: reportData.status || 'pendiente',
          assigned_to: reportData.assigned_to || null,
          reporter_uid: reportData.reporter_uid || null,
          is_anonymous_public: reportData.is_anonymous_public || false,
        });
      } catch (error) {
        console.error('Error cargando reporte:', error);
        setError('Error al cargar información del reporte');
        setLoading(false);
      }
    };

    loadReportInfo();
  }, [reportId, user?.id]);

  // Efecto para escuchar actualizaciones en tiempo real - CORREGIDO
  useEffect(() => {
    if (!reportId) return;

    setLoading(true);
    setError(null);

    // Crear query para obtener las actualizaciones de este reporte
    const q = query(
      collection(db, 'case_updates'),
      where('report_id', '==', reportId)
    );

    // Escuchar cambios en tiempo real
    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const updatesData: CaseUpdate[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data() as {
            message?: string;
            update_type?: 'avance' | 'cambio_estado' | 'observacion'; // CAMBIADO
            new_status?: string;
            images?: string[];
            created_at?: Timestamp;
            report_id?: string;
            encargado_id?: string;
          };
          
          const createdAt = data.created_at instanceof Timestamp 
            ? data.created_at.toDate().toISOString() 
            : new Date().toISOString();
          
          updatesData.push({
            id: doc.id,
            message: data.message || '',
            update_type: data.update_type || 'avance',
            new_status: data.new_status,
            images: data.images || [],
            created_at: createdAt,
            report_id: data.report_id || reportId,
            encargado_id: data.encargado_id,
          });
        });

        // Ordenar por fecha (más reciente primero)
        updatesData.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        setUpdates(updatesData);
        setLoading(false);
      },
      (error) => {
        console.error('Error escuchando actualizaciones:', error);
        setError('Error al cargar los avances');
        setLoading(false);
      }
    );

    // Limpiar listener al desmontar
    return () => unsubscribe();
  }, [reportId]);

  // Renderizado de carga
  if (loading) {
    return (
      <SafeArea>
        <View style={avanceStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={avanceStyles.loadingText}>Cargando avances...</Text>
        </View>
      </SafeArea>
    );
  }

  // Renderizado de error
  if (error) {
    return (
      <SafeArea>
        <View style={avanceStyles.errorContainer}>
          <Text style={avanceStyles.errorText}>
            {error}
          </Text>
          <TouchableOpacity 
            style={avanceStyles.retryButton} 
            onPress={() => window.history.back()}
          >
            <Text style={avanceStyles.retryButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeArea>
    );
  }

  return (
    <SafeArea>
      <View style={avanceStyles.container}>
        {/* Header con gradiente - NUEVO */}
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={avanceStyles.headerContainer}
        >
          <Text style={avanceStyles.headerTitle}>Avances del Reporte</Text>
          <Text style={avanceStyles.headerSubtitle}>
            Gestión de actualizaciones realizadas
          </Text>
        </LinearGradient>

        {/* 3 Cards de tipos de actualización - NUEVO */}
        <View style={avanceStyles.statsContainer}>
          {/* Card Avances */}
          <View style={[avanceStyles.statCard, { borderColor: getUpdateTypeColor('avance') }]}>
            <Text style={[avanceStyles.statValue, { color: getUpdateTypeColor('avance') }]}>
              {updateTypeCounts.avance}
            </Text>
            <Text style={[avanceStyles.statLabel, { color: getUpdateTypeColor('avance') }]}>
              Avances
            </Text>
          </View>
          
          {/* Card Cambios de Estado */}
          <View style={[avanceStyles.statCard, { borderColor: getUpdateTypeColor('cambio_estado') }]}>
            <Text style={[avanceStyles.statValue, { color: getUpdateTypeColor('cambio_estado') }]}>
              {updateTypeCounts.cambio_estado}
            </Text>
            <Text style={[avanceStyles.statLabel, { color: getUpdateTypeColor('cambio_estado') }]}>
              Cambios
            </Text>
          </View>
          
          {/* Card Observaciones */}
          <View style={[avanceStyles.statCard, { borderColor: getUpdateTypeColor('observacion') }]}>
            <Text style={[avanceStyles.statValue, { color: getUpdateTypeColor('observacion') }]}>
              {updateTypeCounts.observacion}
            </Text>
            <Text style={[avanceStyles.statLabel, { color: getUpdateTypeColor('observacion') }]}>
              Observación
            </Text>
          </View>
        </View>

        <ScrollView 
          contentContainerStyle={avanceStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Información del reporte */}
          {reportInfo && (
            <View style={avanceStyles.reportInfoCard}>
              <View style={avanceStyles.reportInfoHeader}>
                <Image
                  source={require('@/assets/images/location.png')}
                  style={avanceStyles.locationIcon}
                />
                <Text style={avanceStyles.reportLocation}>
                  {reportInfo.location.address}
                  {reportInfo.location.city ? `, ${reportInfo.location.city}` : ''}
                </Text>
              </View>

              <Text style={avanceStyles.reportDescription}>
                {reportInfo.description}
              </Text>

              <View style={avanceStyles.reportStatusContainer}>
                <Text style={avanceStyles.statusLabel}>Estado actual:</Text>
                <Text 
                  style={[
                    avanceStyles.statusValue,
                    { color: getStatusColor(reportInfo.status) }
                  ]}
                >
                  {reportInfo.status.replace('_', ' ').toUpperCase()}
                </Text>
              </View>

              {reportInfo.assigned_to && (
                <View style={[avanceStyles.reportStatusContainer, { paddingTop: 8, borderTopWidth: 0 }]}>
                  <Text style={avanceStyles.statusLabel}>Asignado a:</Text>
                  <Text style={[avanceStyles.statusValue, { color: '#64748b' }]}>
                    {reportInfo.assigned_to.substring(0, 8)}...
                  </Text>
                </View>
              )}

              {reportInfo.reporter_uid && !reportInfo.is_anonymous_public && (
                <View style={[avanceStyles.reportStatusContainer, { paddingTop: 8, borderTopWidth: 0 }]}>
                  <Text style={avanceStyles.statusLabel}>Reportante:</Text>
                  <Text style={[avanceStyles.statusValue, { color: '#64748b' }]}>
                    {reportInfo.reporter_uid.substring(0, 8)}...
                  </Text>
                </View>
              )}

              {reportInfo.is_anonymous_public && (
                <View style={[avanceStyles.reportStatusContainer, { paddingTop: 8, borderTopWidth: 0 }]}>
                  <Text style={avanceStyles.statusLabel}>Reportante:</Text>
                  <Text style={[avanceStyles.statusValue, { color: '#64748b' }]}>
                    Anónimo
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Contador de resultados - NUEVO */}
          <View style={avanceStyles.resultsCounter}>
            <Text style={avanceStyles.resultsCounterText}>
              {updates.length} {updates.length === 1 ? 'actualización' : 'actualizaciones'} en total
            </Text>
          </View>

          {/* Lista de avances */}
          <View style={avanceStyles.updatesList}>
            {updates.length === 0 ? (
              <View style={avanceStyles.emptyContainer}>
                <Text style={avanceStyles.emptyText}>
                  No hay avances registrados para este reporte
                  {'\n'}
                  <Text style={{ fontSize: 14 }}>
                    Aún no se han realizado actualizaciones
                  </Text>
                </Text>
              </View>
            ) : (
              updates.map((update) => {
                return (
                  <View 
                    key={update.id} 
                    style={[
                      avanceStyles.updateCard,
                      { 
                        borderLeftWidth: 5,
                        borderLeftColor: getUpdateTypeColor(update.update_type),
                        borderRightWidth: 0,
                      }
                    ]}
                  >
                    {/* Encabezado con tipo y fecha - MEJORADO */}
                    <View style={avanceStyles.updateHeader}>
                      <View style={avanceStyles.updateTypeContainer}>
                        <View style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          backgroundColor: `${getUpdateTypeColor(update.update_type)}15`,
                          paddingHorizontal: 10,
                          paddingVertical: 4,
                          borderRadius: 20,
                          alignSelf: 'flex-start'
                        }}>
                          <Image
                            source={getUpdateTypeIcon(update.update_type)}
                            style={[avanceStyles.updateIcon, { 
                              tintColor: getUpdateTypeColor(update.update_type),
                              marginRight: 6 
                            }]}
                          />
                          <Text style={[
                            avanceStyles.updateTypeText,
                            { color: getUpdateTypeColor(update.update_type) }
                          ]}>
                            {getUpdateTypeText(update.update_type)}
                          </Text>
                        </View>
                      </View>
                      <View style={avanceStyles.dateContainer}>
                        <Image
                          source={require('@/assets/images/calendar.png')}
                          style={avanceStyles.dateIcon}
                        />
                        <Text style={avanceStyles.dateText}>
                          {formatDate(update.created_at)}
                        </Text>
                      </View>
                    </View>

                    {/* Mensaje */}
                    {update.message && (
                      <Text style={avanceStyles.updateMessage}>
                        {update.message}
                      </Text>
                    )}

                    {/* Cambio de estado (si aplica) */}
                    {update.new_status && (
                      <View style={avanceStyles.statusChangeContainer}>
                        <Image
                          source={require('@/assets/images/recordatorio.png')} // CAMBIADO: recordatorio en lugar de filtrar
                          style={avanceStyles.statusChangeIcon}
                        />
                        <Text style={avanceStyles.statusChangeText}>
                          Estado cambiado a: {update.new_status.replace('_', ' ').toUpperCase()}
                        </Text>
                      </View>
                    )}

                    {/* Imágenes (si hay) - CON VISOR MODAL */}
                    {update.images && update.images.length > 0 && (
                      <View style={avanceStyles.imagesContainer}>
                        {update.images.map((img, imgIndex) => (
                          <TouchableOpacity
                            key={imgIndex}
                            onPress={() => openImageGallery(update.images, imgIndex)}
                            activeOpacity={0.7}
                          >
                            <Image
                              source={{ uri: img }}
                              style={avanceStyles.imageThumbnail}
                            />
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}

                    {/* Información del encargado (si existe) */}
                    {update.encargado_id && (
                      <View style={{ 
                        flexDirection: 'row', 
                        alignItems: 'center', 
                        marginTop: 12,
                        paddingTop: 12,
                        borderTopWidth: 1,
                        borderTopColor: '#e2e8f0'
                      }}>
                        <Image
                          source={require('@/assets/images/nombre.png')}
                          style={{ width: 16, height: 16, marginRight: 6 }}
                        />
                        <Text style={{
                          fontFamily: 'Montserrat_400Regular',
                          fontSize: 12,
                          color: '#64748b'
                        }}>
                          Encargado: {update.encargado_id.substring(0, 8)}...
                        </Text>
                      </View>
                    )}

                    {/* Botón de eliminar (ADMIN siempre puede eliminar) - ESTILO MEJORADO */}
                    <TouchableOpacity
                      style={avanceStyles.deleteButton}
                      onPress={() => handleDeleteUpdate(update.id)}
                      disabled={deletingId === update.id}
                    >
                      {deletingId === update.id ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <>
                          <Image
                            source={require('@/assets/images/borrar.png')}
                            style={avanceStyles.deleteButtonIcon}
                          />
                          <Text style={avanceStyles.deleteButtonText}>
                            Eliminar
                          </Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </View>
                );
              })
            )}
          </View>
        </ScrollView>

        {/* Modal para visor de imágenes - NUEVO */}
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
    </SafeArea>
  );
}