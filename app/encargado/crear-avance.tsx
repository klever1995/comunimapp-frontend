// app/encargado/crear-avance.tsx - MODIFICADO SIN BORDE INFERIOR
import { SafeArea } from '@/components/ui/safe-area';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
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
import { registerStyles } from '../../styles/registerStyles';

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
      <SafeArea>
        <View style={[registerStyles.container, {justifyContent: 'center'}]}>
          <LinearGradient
            colors={['#0A0F24', '#0D1B2A', '#1B263B']}
            style={registerStyles.backgroundGradient}
          />
          <ActivityIndicator size="large" color="#00D4FF" />
          <Text style={{ marginTop: 15, color: '#CBD5E1', fontSize: 14 }}>
            Cargando información del reporte...
          </Text>
        </View>
      </SafeArea>
    );
  }

  if (errorMessage && !reportInfo) {
    return (
      <SafeArea>
        <View style={[registerStyles.container, {justifyContent: 'center'}]}>
          <LinearGradient
            colors={['#0A0F24', '#0D1B2A', '#1B263B']}
            style={registerStyles.backgroundGradient}
          />
          <Text style={{ color: '#FF416C', fontSize: 16, textAlign: 'center', marginBottom: 20 }}>
            {errorMessage}
          </Text>
          <TouchableOpacity 
            style={[registerStyles.registerButton, {width: '60%'}]}
            onPress={() => router.back()}
          >
            <LinearGradient
              colors={['#00D4FF', '#0066FF']}
              style={registerStyles.buttonGradient}
            >
              <Text style={registerStyles.buttonText}>Volver</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeArea>
    );
  }

  return (
    <SafeArea>
      <View style={[registerStyles.container, { paddingBottom: 0 }]}>
        {/* Fondo con gradiente */}
        <LinearGradient
          colors={['#0A0F24', '#0D1B2A', '#1B263B']}
          style={registerStyles.backgroundGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        
        {/* Partículas decorativas */}
        <View style={registerStyles.particlesContainer}>
          <View style={registerStyles.particle1} />
          <View style={registerStyles.particle2} />
          <View style={registerStyles.particle3} />
        </View>

        {/* Header moderno */}
        <View style={registerStyles.header}>
          <Text style={registerStyles.title}>
            Nuevo <Text style={registerStyles.titleGradient}>Avance</Text>
          </Text>
          <Text style={registerStyles.subtitle}>
            Agrega una actualización al reporte asignado
          </Text>
        </View>

        <ScrollView 
          contentContainerStyle={{ paddingBottom: 0 }}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
        >
          {/* Mensajes de éxito/error */}
          {successMessage ? (
            <View style={[crearAvanceStyles.messageContainer, crearAvanceStyles.successContainer, {marginHorizontal: 20}]}>
              <Text style={[crearAvanceStyles.messageText, crearAvanceStyles.successText]}>
                {successMessage}
              </Text>
            </View>
          ) : null}
          
          {errorMessage ? (
            <View style={[crearAvanceStyles.messageContainer, crearAvanceStyles.errorContainer, {marginHorizontal: 20}]}>
              <Text style={[crearAvanceStyles.messageText, crearAvanceStyles.errorText]}>
                {errorMessage}
              </Text>
            </View>
          ) : null}

          {/* Información del reporte */}
          {reportInfo && (
            <View style={registerStyles.inputGroup}>
              <Text style={registerStyles.inputLabel}>REPORTE ASIGNADO</Text>
              <View style={[
                registerStyles.inputContainer,
                { flexDirection: 'column', alignItems: 'flex-start', padding: 16, height: 'auto' }
              ]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, width: '100%' }}>
                  <Image
                    source={require('@/assets/images/location.png')}
                    style={registerStyles.leftIcon}
                    resizeMode="contain"
                  />
                  <Text style={[registerStyles.input, { flex: 1 }]}>
                    {reportInfo.location.address}
                    {reportInfo.location.city ? `, ${reportInfo.location.city}` : ''}
                  </Text>
                </View>
                
                <Text style={{
                  fontFamily: 'Montserrat_400Regular',
                  fontSize: 14,
                  color: '#CBD5E1',
                  lineHeight: 20,
                  marginBottom: 12,
                }}>
                  {reportInfo.description}
                </Text>
                
                <View style={{ 
                  flexDirection: 'row', 
                  justifyContent: 'space-between',
                  width: '100%',
                  marginTop: 12,
                  paddingTop: 12,
                  borderTopWidth: 1,
                  borderTopColor: 'rgba(255, 255, 255, 0.1)'
                }}>
                  <Text style={{
                    fontFamily: 'Montserrat_500Medium',
                    fontSize: 13,
                    color: '#94A3B8',
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

          {/* Sección de fotos */}
          <View style={registerStyles.inputGroup}>
            <Text style={registerStyles.inputLabel}>AGREGAR FOTOS (OPCIONAL)</Text>
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

          {/* Sección de mensaje */}
          <View style={registerStyles.inputGroup}>
            <Text style={registerStyles.inputLabel}>MENSAJE DEL AVANCE</Text>
            <View style={[
              registerStyles.inputContainer,
              { height: 'auto', minHeight: 120, alignItems: 'flex-start' }
            ]}>
              <TextInput
                style={[
                  registerStyles.input,
                  { 
                    flex: 1, 
                    textAlignVertical: 'top',
                    paddingTop: 14,
                    minHeight: 100 
                  }
                ]}
                placeholder="Describe los avances realizados, observaciones o comentarios (mínimo 5 caracteres)"
                placeholderTextColor="#64748B"
                value={message}
                onChangeText={setMessage}
                multiline
                maxLength={1000}
              />
            </View>
            <Text style={{
              fontSize: 12,
              color: message.length >= 5 ? '#00D4FF' : '#FF416C',
              marginTop: 6,
              fontFamily: 'Roboto_400Regular'
            }}>
              {message.length}/1000 • {message.length < 5 ? 
                `Faltan ${5 - message.length} caracteres` : '✓ Mensaje válido'}
            </Text>
          </View>

          {/* Sección de tipo de actualización */}
          <View style={registerStyles.inputGroup}>
            <Text style={registerStyles.inputLabel}>TIPO DE ACTUALIZACIÓN</Text>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
              {[UpdateType.AVANCE, UpdateType.OBSERVACION, UpdateType.CAMBIO_ESTADO].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={{
                    flex: 1,
                    backgroundColor: updateType === type 
                      ? 'rgba(0, 212, 255, 0.1)' 
                      : 'rgba(255, 255, 255, 0.05)',
                    borderWidth: 2,
                    borderColor: updateType === type 
                      ? '#00D4FF' 
                      : 'rgba(255, 255, 255, 0.1)',
                    borderRadius: 12,
                    padding: 12,
                    alignItems: 'center'
                  }}
                  onPress={() => setUpdateType(type)}
                >
                  <Image
                    source={getUpdateTypeIcon(type)}
                    style={{
                      width: 24,
                      height: 24,
                      tintColor: updateType === type ? '#00D4FF' : '#94A3B8',
                      marginBottom: 6
                    }}
                    resizeMode="contain"
                  />
                  <Text style={{
                    fontFamily: 'Roboto_600SemiBold',
                    fontSize: 12,
                    color: updateType === type ? '#FFFFFF' : '#94A3B8',
                    textAlign: 'center'
                  }}>
                    {getUpdateTypeText(type)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Sección de cambio de estado (SOLO cuando se selecciona CAMBIO_ESTADO) */}
          {updateType === UpdateType.CAMBIO_ESTADO && (
            <View style={registerStyles.inputGroup}>
              <Text style={registerStyles.inputLabel}>SELECCIONAR NUEVO ESTADO</Text>
              <Text style={{
                fontFamily: 'Montserrat_400Regular',
                fontSize: 13,
                color: '#94A3B8',
                marginBottom: 12,
              }}>
                Estado actual: <Text style={{color: getStatusColor(reportInfo?.status || '')}}>
                  {reportInfo?.status?.replace('_', ' ') || 'No disponible'}
                </Text>
              </Text>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                {getVisibleStatuses().map((status) => (
                  <TouchableOpacity 
                    key={status}
                    style={{
                      flex: 1,
                      backgroundColor: newStatus === status 
                        ? 'rgba(0, 212, 255, 0.1)' 
                        : 'rgba(255, 255, 255, 0.05)',
                      borderWidth: 2,
                      borderColor: newStatus === status 
                        ? '#00D4FF' 
                        : 'rgba(255, 255, 255, 0.1)',
                      borderRadius: 12,
                      padding: 12,
                      alignItems: 'center'
                    }}
                    onPress={() => setNewStatus(status === newStatus ? null : status)}
                  >
                    <Text style={{
                      fontFamily: newStatus === status ? 'Roboto_600SemiBold' : 'Roboto_500Medium',
                      fontSize: 13,
                      color: newStatus === status ? '#FFFFFF' : '#94A3B8',
                    }}>
                      {status.replace('_', ' ')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={{
                fontFamily: 'Montserrat_400Regular',
                fontSize: 11,
                color: '#64748B',
                marginTop: 8,
                fontStyle: 'italic',
              }}>
                * Selecciona el nuevo estado del reporte
              </Text>
            </View>
          )}

          {/* Botón de enviar */}
          <TouchableOpacity
            style={[
              registerStyles.registerButton,
              (message.length < 5 || isLoading || (updateType === UpdateType.CAMBIO_ESTADO && !newStatus)) && 
                registerStyles.registerButtonDisabled,
              { marginTop: 20, marginBottom: 20 }
            ]}
            onPress={submitAvance}
            disabled={message.length < 5 || isLoading || (updateType === UpdateType.CAMBIO_ESTADO && !newStatus)}
          >
            <LinearGradient
              colors={isLoading || message.length < 5 || (updateType === UpdateType.CAMBIO_ESTADO && !newStatus) 
                ? ['#475569', '#475569'] 
                : ['#00D4FF', '#0066FF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={registerStyles.buttonGradient}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <View style={registerStyles.buttonContent}>
                  <Text style={registerStyles.buttonText}>
                    ENVIAR {updateType === UpdateType.CAMBIO_ESTADO ? 'CAMBIO DE ESTADO' : 'AVANCE'}
                  </Text>
                  <Image
                    source={require('@/assets/images/send.png')}
                    style={registerStyles.buttonIcon}
                    resizeMode="contain"
                  />
                </View>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeArea>
  );
}