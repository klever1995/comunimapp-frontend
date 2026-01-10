import { SafeArea } from '@/components/ui/safe-area';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { crearAvanceStyles } from '../../styles/encargado/crear-avanceStyles';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// Tipos según el endpoint
enum UpdateType {
  AVANCE = 'avance',
  OBSERVACION = 'observacion',
  CAMBIO_ESTADO = 'cambio_estado',
  CIERRE = 'cierre'
}

enum ReportStatus {
  PENDIENTE = 'pendiente',
  ASIGNADO = 'asignado',
  EN_PROCESO = 'en_proceso',
  RESUELTO = 'resuelto',
  CERRADO = 'cerrado'
}

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

export default function CrearAvanceScreen() {
  const { reportId } = useLocalSearchParams<{ reportId: string }>();
  const { authState: { user, token } } = useAuth();
  
  // Estados del formulario
  const [message, setMessage] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [updateType, setUpdateType] = useState<UpdateType>(UpdateType.AVANCE);
  const [newStatus, setNewStatus] = useState<ReportStatus | null>(null);
  
  // Información del reporte
  const [reportInfo, setReportInfo] = useState<ReportInfo | null>(null);
  
  // Estados de UI
  const [isLoading, setIsLoading] = useState(false);
  const [loadingReport, setLoadingReport] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Cargar información del reporte
  useEffect(() => {
    const loadReportInfo = async () => {
      if (!reportId || !user?.id) {
        setErrorMessage('Datos incompletos');
        setLoadingReport(false);
        return;
      }

      try {
        const reportDoc = await getDoc(doc(db, 'reports', reportId));
        
        if (!reportDoc.exists()) {
          setErrorMessage('Reporte no encontrado');
          setLoadingReport(false);
          return;
        }

        const reportData = reportDoc.data();
        
        // Verificar que el usuario tenga permiso para crear avances en este reporte
        if (reportData.assigned_to !== user.id && user.role !== 'admin') {
          setErrorMessage('No tienes permisos para crear avances en este reporte');
          setLoadingReport(false);
          return;
        }

        setReportInfo({
          id: reportDoc.id,
          description: reportData.description || '',
          location: reportData.location || { address: 'Sin ubicación', city: '' },
          status: reportData.status || 'pendiente',
          assigned_to: reportData.assigned_to || null,
        });
        
        // Inicializar el estado actual como opción pre-seleccionada
        setNewStatus(reportData.status as ReportStatus);
        
      } catch (error) {
        console.error('Error cargando reporte:', error);
        setErrorMessage('Error al cargar información del reporte');
      } finally {
        setLoadingReport(false);
      }
    };

    loadReportInfo();
  }, [reportId, user?.id]);

  // Seleccionar imágenes
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      allowsMultipleSelection: true,
    });

    if (!result.canceled && result.assets) {
      const newImages = result.assets.map(asset => asset.uri);
      setImages([...images, ...newImages].slice(0, 5));
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  // Validar formulario
  const validateForm = (): boolean => {
    if (message.length < 5) {
      setErrorMessage('El mensaje debe tener al menos 5 caracteres');
      return false;
    }
    
    return true;
  };

  // Enviar avance
  const submitAvance = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const formData = new FormData();
      
      formData.append('report_id', reportId!);
      formData.append('message', message);
      formData.append('update_type', updateType);
      
      // Solo enviar new_status si es cambio_estado y hay un estado seleccionado
      if (updateType === UpdateType.CAMBIO_ESTADO && newStatus) {
        formData.append('new_status', newStatus);
      }
      
      images.forEach((uri, index) => {
        const filename = uri.split('/').pop() || `image_${index}.jpg`;
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';
        
        formData.append('images', {
          uri,
          name: filename,
          type,
        } as any);
      });

      const response = await fetch(`${API_URL}/cases/updates`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        const msg = data.detail && typeof data.detail === 'object' ? JSON.stringify(data.detail) : data.detail;
        throw new Error(msg || 'Error al crear el avance');
      }
      
      setSuccessMessage('¡Avance creado exitosamente!');
      
      setTimeout(() => {
        router.back();
      }, 2000);

    } catch (error: any) {
      setErrorMessage(error.message || 'Error al enviar el avance');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Obtener icono según tipo de actualización
  const getUpdateTypeIcon = (type: UpdateType) => {
  switch (type) {
    case UpdateType.AVANCE:
      return require('@/assets/images/check.png');
    case UpdateType.OBSERVACION:
      return require('@/assets/images/ver.png');
    case UpdateType.CAMBIO_ESTADO:
      return require('@/assets/images/recarga.png');
    case UpdateType.CIERRE:
      return require('@/assets/images/check.png');
    default:
      return require('@/assets/images/check.png');
  }
};

  // Obtener texto amigable para tipo de actualización
  const getUpdateTypeText = (type: UpdateType) => {
    switch (type) {
        case UpdateType.AVANCE: return 'Avance';
        case UpdateType.OBSERVACION: return 'Observación';
        case UpdateType.CAMBIO_ESTADO: return 'Cambio de estado';
        case UpdateType.CIERRE: return 'Cierre';
        default: return type;
    }
    };

  // Obtener color según estado
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pendiente':
        return '#f97316';
      case 'asignado':
        return '#f59e0b';
      case 'en_proceso':
        return '#2563EB';
      case 'resuelto':
        return '#22c55e';
      case 'cerrado':
        return '#dc2626';
      default:
        return '#64748b';
    }
  };

  // Estados visibles para selector (MOSTRANDO SOLO 3 ESTADOS)
  const getVisibleStatuses = () => {
    // Definir los 3 estados que queremos mostrar en el selector
    const estadosParaSelector: ReportStatus[] = [
      ReportStatus.EN_PROCESO,
      ReportStatus.RESUELTO,
      ReportStatus.CERRADO
    ];
    
    // Si hay estado actual, excluirlo de la lista
    const currentStatus = reportInfo?.status as ReportStatus;
    return currentStatus 
      ? estadosParaSelector.filter(status => status !== currentStatus)
      : estadosParaSelector;
  };

  if (loadingReport) {
    return (
      <View style={crearAvanceStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={{ marginTop: 10, color: '#64748b' }}>
          Cargando información del reporte...
        </Text>
      </View>
    );
  }

  if (errorMessage && !reportInfo) {
    return (
      <View style={crearAvanceStyles.errorContainer}>
        <Text style={crearAvanceStyles.errorText}>
          {errorMessage}
        </Text>
        <TouchableOpacity 
          style={crearAvanceStyles.sendButton}
          onPress={() => router.back()}
        >
          <Text style={crearAvanceStyles.sendButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeArea>
    <ScrollView 
      contentContainerStyle={crearAvanceStyles.scrollContent}
      showsVerticalScrollIndicator={false}
      style={crearAvanceStyles.container}
    >
      <View style={crearAvanceStyles.header}>
        <Text style={crearAvanceStyles.headerTitle}>Nuevo Avance</Text>
        <Text style={crearAvanceStyles.headerSubtitle}>
          Agrega una actualización al reporte asignado
        </Text>
      </View>

      {successMessage ? (
        <View style={[crearAvanceStyles.messageContainer, crearAvanceStyles.successContainer]}>
          <Text style={[crearAvanceStyles.messageText, crearAvanceStyles.successText]}>
            {successMessage}
          </Text>
        </View>
      ) : null}
      
      {errorMessage ? (
        <View style={[crearAvanceStyles.messageContainer, crearAvanceStyles.errorContainer]}>
          <Text style={[crearAvanceStyles.messageText, crearAvanceStyles.errorText]}>
            {errorMessage}
          </Text>
        </View>
      ) : null}

      {/* Información del reporte */}
      {reportInfo && (
        <View style={crearAvanceStyles.reportInfoSection}>
          <Text style={crearAvanceStyles.reportInfoTitle}>Reporte asignado</Text>
          <View style={crearAvanceStyles.reportInfoCard}>
            <View style={crearAvanceStyles.reportInfoHeader}>
              <Image
                source={require('@/assets/images/location.png')}
                style={crearAvanceStyles.locationIcon}
                resizeMode="contain"
              />
              <Text style={crearAvanceStyles.reportInfoText}>
                {reportInfo.location.address}
                {reportInfo.location.city ? `, ${reportInfo.location.city}` : ''}
              </Text>
            </View>
            <Text style={crearAvanceStyles.reportDescription}>
              {reportInfo.description}
            </Text>
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between',
              marginTop: 12,
              paddingTop: 12,
              borderTopWidth: 1,
              borderTopColor: '#e2e8f0'
            }}>
              <Text style={{
                fontFamily: 'Montserrat_500Medium',
                fontSize: 13,
                color: '#64748b',
              }}>
                Estado actual:
              </Text>
              <Text style={{
                fontFamily: 'Roboto_600SemiBold',
                fontSize: 13,
                color: getStatusColor(reportInfo.status),
              }}>
                {reportInfo.status.replace('_', ' ')}
              </Text>
            </View>
          </View>
        </View>
      )}

      <View style={crearAvanceStyles.divider} />

      {/* Sección de fotos */}
      <View style={crearAvanceStyles.photosSection}>
        <Text style={crearAvanceStyles.photosTitle}>Agregar foto (opcional)</Text>
        <View style={crearAvanceStyles.photosContainer}>
          <TouchableOpacity 
            style={crearAvanceStyles.addPhotoButton}
            onPress={pickImage}
            disabled={images.length >= 5}
          >
            <Image
              source={require('@/assets/images/camera.png')}
              style={crearAvanceStyles.addPhotoIcon}
              resizeMode="contain"
            />
            <Text style={crearAvanceStyles.addPhotoText}>
              {images.length}/5 fotos
            </Text>
          </TouchableOpacity>
          
          {images.map((uri, index) => (
            <View key={index} style={crearAvanceStyles.photoItem}>
              <Image 
                source={{ uri }} 
                style={crearAvanceStyles.photoImage} 
                resizeMode="cover"
              />
              <TouchableOpacity 
                style={crearAvanceStyles.removePhotoButton}
                onPress={() => removeImage(index)}
              >
                <Text style={crearAvanceStyles.removePhotoText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      <View style={crearAvanceStyles.divider} />

      {/* Sección de mensaje */}
      <View style={crearAvanceStyles.messageSection}>
        <Text style={crearAvanceStyles.messageTitle}>Mensaje del avance</Text>
        <TextInput
          style={crearAvanceStyles.messageInput}
          placeholder="Describe los avances realizados, observaciones o comentarios (mínimo 5 caracteres)"
          placeholderTextColor="#94a3b8"
          value={message}
          onChangeText={setMessage}
          multiline
          maxLength={1000}
        />
        <Text style={[
          crearAvanceStyles.characterCount,
          message.length < 5 ? crearAvanceStyles.characterCountError : 
          message.length >= 5 ? crearAvanceStyles.characterCountValid : {}
        ]}>
          {message.length}/1000 caracteres • {message.length < 5 ? 
            `Faltan ${5 - message.length} caracteres` : '✓ Válido'}
        </Text>
      </View>

      {/* Sección de tipo de actualización */}
      <View style={crearAvanceStyles.updateTypeSection}>
        <Text style={crearAvanceStyles.updateTypeTitle}>Tipo de actualización</Text>
        <View style={crearAvanceStyles.updateTypeOptions}>
          {/* Mostrar solo 3 opciones: AVANCE, OBSERVACION, CAMBIO_ESTADO */}
          {[UpdateType.AVANCE, UpdateType.OBSERVACION, UpdateType.CAMBIO_ESTADO].map((type) => (
            <TouchableOpacity 
              key={type}
              style={[
                crearAvanceStyles.updateTypeButton,
                updateType === type && crearAvanceStyles.updateTypeButtonSelected
              ]}
              onPress={() => setUpdateType(type)}
            >
              <Image
                source={getUpdateTypeIcon(type)}
                style={[
                  crearAvanceStyles.updateTypeIcon,
                  {tintColor: updateType === type ? '#2563EB' : '#94a3b8'}
                ]}
                resizeMode="contain"
              />
              <Text style={[
                crearAvanceStyles.updateTypeLabel,
                updateType === type && crearAvanceStyles.updateTypeButtonSelectedText
              ]}>
                {getUpdateTypeText(type)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Sección de cambio de estado (SOLO cuando se selecciona CAMBIO_ESTADO) */}
      {updateType === UpdateType.CAMBIO_ESTADO && (
        <View style={crearAvanceStyles.statusSection}>
          <Text style={crearAvanceStyles.statusTitle}>Seleccionar nuevo estado</Text>
          <Text style={{
            fontFamily: 'Montserrat_400Regular',
            fontSize: 13,
            color: '#64748b',
            marginBottom: 15,
          }}>
            Estado actual: <Text style={{color: getStatusColor(reportInfo?.status || '')}}>
              {reportInfo?.status?.replace('_', ' ') || 'No disponible'}
            </Text>
          </Text>
          <View style={crearAvanceStyles.statusOptions}>
            {getVisibleStatuses().map((status) => (
              <TouchableOpacity 
                key={status}
                style={[
                  crearAvanceStyles.statusButton,
                  newStatus === status && crearAvanceStyles.statusButtonSelected
                ]}
                onPress={() => setNewStatus(status === newStatus ? null : status)}
              >
                <Text style={[
                  crearAvanceStyles.statusLabel,
                  newStatus === status && crearAvanceStyles.statusButtonSelectedText
                ]}>
                  {status.replace('_', ' ')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={{
            fontFamily: 'Montserrat_400Regular',
            fontSize: 12,
            color: '#94a3b8',
            marginTop: 10,
            fontStyle: 'italic',
          }}>
            * Selecciona el nuevo estado del reporte
          </Text>
        </View>
      )}

      {/* Botón de enviar */}
      <TouchableOpacity
        style={[
          crearAvanceStyles.sendButton,
          (message.length < 5 || isLoading || (updateType === UpdateType.CAMBIO_ESTADO && !newStatus)) && crearAvanceStyles.sendButtonDisabled
        ]}
        onPress={submitAvance}
        disabled={message.length < 5 || isLoading || (updateType === UpdateType.CAMBIO_ESTADO && !newStatus)}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <>
            <Image
              source={require('@/assets/images/send.png')}
              style={crearAvanceStyles.sendIcon}
              resizeMode="contain"
            />
            <Text style={crearAvanceStyles.sendButtonText}>
              Enviar {updateType === UpdateType.CAMBIO_ESTADO ? 'cambio de estado' : 'avance'}
            </Text>
          </>
        )}
      </TouchableOpacity>

      {isLoading && (
        <View style={crearAvanceStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={{marginTop: 10, color: '#64748b'}}>
            Enviando avance...
          </Text>
        </View>
      )}
    </ScrollView>
    </SafeArea>
  );
}