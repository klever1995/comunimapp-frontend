import { SafeArea } from '@/components/ui/safe-area';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { useLocalSearchParams } from 'expo-router';
import { collection, doc, getDoc, onSnapshot, query, Timestamp, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { avanceStyles } from '../styles/encargado/avanceStyles';

// Tipos basados en Firestore
type CaseUpdate = {
  id: string;
  message: string;
  update_type: 'avance' | 'cambio_estado' | 'comentario';
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

export default function EncargadoAvancesScreen({ navigation }: any) {
  const { reportId } = useLocalSearchParams<{ reportId: string }>();
  const { authState } = useAuth();
  const { user, token } = authState;
  
  const [updates, setUpdates] = useState<CaseUpdate[]>([]);
  const [reportInfo, setReportInfo] = useState<ReportInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Función para obtener el icono según el tipo de actualización
  const getUpdateTypeIcon = (type: string) => {
    switch (type) {
      case 'avance':
        return require('@/assets/images/check.png');
      case 'cambio_estado':
        return require('@/assets/images/filtrar.png');
      case 'comentario':
        return require('@/assets/images/nombre.png');
      default:
        return require('@/assets/images/check.png');
    }
  };

  // Función para obtener texto amigable del tipo de actualización
  const getUpdateTypeText = (type: string) => {
    switch (type) {
      case 'avance':
        return 'Avance';
      case 'cambio_estado':
        return 'Cambio de estado';
      case 'comentario':
        return 'Comentario';
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
        year: 'numeric',
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

  // Función para eliminar un avance
  const handleDeleteUpdate = async (updateId: string) => {
    if (!token || !user?.id) {
      Alert.alert('Error', 'No estás autenticado');
      return;
    }

    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de eliminar este avance?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            setDeletingId(updateId);
            try {
              const response = await fetch(`http://192.168.1.145:8000/cases/updates/${updateId}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              });

              if (!response.ok) {
                throw new Error('Error al eliminar el avance');
              }

              Alert.alert('Éxito', 'Avance eliminado correctamente');
            } catch (error) {
              console.error('Error eliminando avance:', error);
              Alert.alert('Error', 'No se pudo eliminar el avance');
            } finally {
              setDeletingId(null);
            }
          },
        },
      ]
    );
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
        // Encargado solo puede ver reportes asignados a él
        if (reportData.assigned_to !== user.id && user.role !== 'admin') {
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

  // Efecto para escuchar actualizaciones en tiempo real
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
            update_type?: 'avance' | 'cambio_estado' | 'comentario';
            new_status?: string;
            images?: string[];
            created_at?: Timestamp;
            report_id?: string;
            encargado_id?: string;
          };
          
          // CORRECCIÓN DEFINITIVA: Tipado explícito con Timestamp
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
      <SafeArea >
        <View style={avanceStyles.errorContainer}>
          <Text style={avanceStyles.errorText}>
            {error}
          </Text>
          <TouchableOpacity 
            style={avanceStyles.retryButton} 
            onPress={() => navigation.goBack()}
          >
            <Text style={avanceStyles.retryButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeArea>
    );
  }

  return (
    <SafeArea>
      <ScrollView 
        contentContainerStyle={avanceStyles.scrollContent}
        style={avanceStyles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={avanceStyles.header}>
          <Text style={avanceStyles.title}>Avances del Reporte</Text>
          <Text style={avanceStyles.subtitle}>
            Gestión de actualizaciones realizadas
          </Text>
        </View>

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
                  {reportInfo.assigned_to === user?.id ? 'Tú' : 'Encargado'}
                </Text>
              </View>
            )}
          </View>
        )}

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
              const isOwner = update.encargado_id === user?.id;

              return (
                <View key={update.id} style={avanceStyles.updateCard}>
                  {/* Encabezado con tipo y fecha */}
                  <View style={avanceStyles.updateHeader}>
                    <View style={avanceStyles.updateTypeContainer}>
                      <Image
                        source={getUpdateTypeIcon(update.update_type)}
                        style={avanceStyles.updateIcon}
                      />
                      <Text style={avanceStyles.updateTypeText}>
                        {getUpdateTypeText(update.update_type)}
                      </Text>
                    </View>
                    <Text style={avanceStyles.updateDate}>
                      {formatDate(update.created_at)}
                    </Text>
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
                        source={require('@/assets/images/filtrar.png')}
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
                        <Image
                          key={imgIndex}
                          source={{ uri: img }}
                          style={avanceStyles.imageThumbnail}
                        />
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
                        {update.encargado_id === user?.id ? 'Tú' : 'Encargado'}
                      </Text>
                    </View>
                  )}

                  {/* Botón de eliminar (solo si es el creador) */}
                  {isOwner && (
                    <TouchableOpacity
                      style={{
                        backgroundColor: '#dc2626',
                        borderRadius: 8,
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: 12,
                        alignSelf: 'flex-end',
                      }}
                      onPress={() => handleDeleteUpdate(update.id)}
                      disabled={deletingId === update.id}
                    >
                      {deletingId === update.id ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <>
                          <Image
                            source={require('@/assets/images/borrar.png')}
                            style={{ width: 16, height: 16, marginRight: 6, tintColor: '#FFFFFF' }}
                          />
                          <Text style={{
                            fontFamily: 'Roboto_600SemiBold',
                            fontSize: 13,
                            color: '#FFFFFF',
                          }}>
                            Eliminar
                          </Text>
                        </>
                      )}
                    </TouchableOpacity>
                  )}
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeArea>
  );
}