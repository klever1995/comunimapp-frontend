import { SafeArea } from '@/components/ui/safe-area';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { collection, doc, getDoc, onSnapshot, query, Timestamp, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { avanceStyles } from '../../styles/reportante/avanceStyles';

// Tipos basados en Firestore - CORREGIDO (quitar 'comentario' si no existe)
type CaseUpdate = {
  id: string;
  message: string;
  update_type: 'avance' | 'cambio_estado' | 'observacion'; // QUITADO 'comentario'
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
};

interface User {
  id: string;
  username: string;
}

export default function AvancesScreen() {
  const { reportId } = useLocalSearchParams<{ reportId: string }>();
  const { authState } = useAuth();
  const { user } = authState;

  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [showImageModal, setShowImageModal] = useState<boolean>(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  
  const [updates, setUpdates] = useState<CaseUpdate[]>([]);
  const [reportInfo, setReportInfo] = useState<ReportInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener el icono según el tipo de actualización - CORREGIDO
  const getUpdateTypeIcon = (type: string) => {
    switch (type) {
      case 'avance':
        return require('@/assets/images/check.png');
      case 'cambio_estado':
        return require('@/assets/images/recarga.png');
      case 'observacion': // SOLO 3 TIPOS
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
      case 'observacion': // SOLO 3 TIPOS
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

  // Función para abrir visor de imágenes
const openImageGallery = (images: string[], startIndex: number) => {
  setSelectedImages(images);
  setSelectedImageIndex(startIndex);
  setShowImageModal(true);
};

  // Función para obtener el color según el estado
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pendiente':
        return '#f97316';
      case 'en_proceso':
        return '#2563EB';
      case 'resuelto':
        return '#22c55e';
      case 'cancelado':
        return '#dc2626';
      default:
        return '#64748b';
    }
  };

  const getUserName = (userId: string | null) => {
  if (!userId) return 'No asignado';
  const user = allUsers.find(u => u.id === userId);
  return user ? user.username : 'Encargado';
};

  // Calcular conteos por tipo de actualización - CORREGIDO (SOLO 3)
  const updateTypeCounts = {
    avance: updates.filter(u => u.update_type === 'avance').length,
    cambio_estado: updates.filter(u => u.update_type === 'cambio_estado').length,
    observacion: updates.filter(u => u.update_type === 'observacion').length, // SOLO 3
  };

  // Función para obtener color según tipo de actualización - CORREGIDO
  const getUpdateTypeColor = (type: string) => {
    switch (type) {
      case 'avance':
        return '#2563EB'; // Azul
      case 'cambio_estado':
        return '#f97316'; // Naranja
      case 'observacion': // SOLO 3
        return '#8b5cf6'; // Violeta
      default:
        return '#64748b';
    }
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
        
        // Verificar que el usuario tenga permiso para ver este reporte
        if (reportData.reporter_uid !== user.id && user.role !== 'admin') {
          setError('No tienes permisos para ver este reporte');
          setLoading(false);
          return;
        }

        setReportInfo({
          id: reportDoc.id,
          description: reportData.description || '',
          location: reportData.location || { address: 'Sin ubicación', city: '' },
          status: reportData.status || 'pendiente',
          assigned_to: reportData.assigned_to || null,
        });
      } catch (error) {
        console.error('Error cargando reporte:', error);
        setError('Error al cargar información del reporte');
        setLoading(false);
      }
    };

    loadReportInfo();
  }, [reportId, user?.id]);

  // Cargar todos los usuarios para mostrar nombres
  useEffect(() => {
    if (authState.token) {
      fetchAllUsers();
    }
  }, [authState.token]);

  const fetchAllUsers = async () => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/users/`, {
        headers: { 'Authorization': `Bearer ${authState.token}` },
      });
      const data = await response.json();
      setAllUsers(data);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
    }
  };

  // Efecto para escuchar actualizaciones en tiempo real - CORREGIDO (SOLO 3 TIPOS)
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
            update_type?: 'avance' | 'cambio_estado' | 'observacion'; // SOLO 3
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
            onPress={() => router.back()}
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
        {/* Header con gradiente */}
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={avanceStyles.headerContainer}
        >
          <Text style={avanceStyles.headerTitle}>Avances del Reporte</Text>
          <Text style={avanceStyles.headerSubtitle}>
            Seguimiento de las actualizaciones realizadas por el encargado
          </Text>
        </LinearGradient>

        {/* 3 Cards de tipos de actualización - CORREGIDO (SOLO 3) */}
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
          
          {/* Card Observaciones - AHORA ES LA TERCERA */}
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
                  {reportInfo.status.replace('_', ' ')}
                </Text>
              </View>

              {reportInfo.assigned_to && (
                <View style={[avanceStyles.reportStatusContainer, { paddingTop: 8, borderTopWidth: 0 }]}>
                  <Text style={avanceStyles.statusLabel}>Asignado a:</Text>
                  <Text style={[avanceStyles.statusValue, { color: '#64748b' }]}>
                    {getUserName(reportInfo.assigned_to)}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Contador de resultados */}
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
                    El encargado aún no ha realizado actualizaciones
                  </Text>
                </Text>
              </View>
            ) : (
              updates.map((update) => (
                <View 
                  key={update.id} 
                  style={[
                    avanceStyles.updateCard,
                    { 
                      borderLeftWidth: 5, // LÍNEA VERTICAL A LA DERECHA
                      borderLeftColor: getUpdateTypeColor(update.update_type),
                      borderRightWidth: 0, // Asegurar que solo sea izquierda
                    }
                  ]}
                >
                  {/* Encabezado con tipo y fecha - AHORA CON ICONO AL LADO DEL TEXTO */}
                  <View style={avanceStyles.updateHeader}>
                    <View style={avanceStyles.updateTypeContainer}>
                      <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: `${getUpdateTypeColor(update.update_type)}15`, // Color con transparencia
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
                        source={require('@/assets/images/recordatorio.png')}
                        style={avanceStyles.statusChangeIcon}
                      />
                      <Text style={avanceStyles.statusChangeText}>
                        Estado cambiado a: {update.new_status.replace('_', ' ')}
                      </Text>
                    </View>
                  )}

                  {/* Imágenes (si hay) */}
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
                         Actualizado por: {getUserName(update.encargado_id)}
                      </Text>
                    </View>
                  )}
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </View>
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
    </SafeArea>
  );
}