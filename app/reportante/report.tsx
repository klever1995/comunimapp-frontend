// app/reportante/report.tsx - CON DISEÑO MEJORADO
import { useAuth } from '@/hooks/useAuth';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { reportStyles } from '../../styles/reportante/reportStyles';

// Importar estilos del registro
import { registerStyles } from '../../styles/registerStyles';

// Prioridades según el endpoint
enum ReportPriority {
  BAJA = 'BAJA',
  MEDIA = 'MEDIA',
  ALTA = 'ALTA'
}

export default function ReportScreen() {
  const { authState: { user, token } } = useAuth();
  
  // Estados del formulario
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [address, setAddress] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [priority, setPriority] = useState<ReportPriority>(ReportPriority.MEDIA);
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  
  // Estados de ubicación
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [mapRegion, setMapRegion] = useState({
    latitude: -0.22985,
    longitude: -78.52495,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  
  // Estados de UI
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Función para obtener ubicación actual
  const getCurrentLocation = async () => {
    setIsGettingLocation(true);
    
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permiso denegado',
          'Necesitamos permisos de ubicación para obtener tu ubicación actual.',
          [{ text: 'OK' }]
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = location.coords;
      
      setLatitude(latitude);
      setLongitude(longitude);
      setMapRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      const [addressResult] = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (addressResult) {
      const isPlusCode = /^[A-Z0-9]{4}\+[A-Z0-9]{2,}$/i.test(addressResult.name || '');

      const address =
        addressResult.street ||
        (!isPlusCode
          ? (addressResult.name || '').split(',')[0].replace(/Piso\s*\d+/i, '').trim()
          : '');

      const cityName = addressResult.city || addressResult.region || '';

      setAddress(address || '');
      setCity(cityName);

      console.log('ADDRESS RESULT COMPLETO:', addressResult);
    } else {
      setAddress('');
      setCity('');
    }

    } catch (error) {
      Alert.alert(
        'Error',
        'No se pudo obtener la ubicación. Intenta nuevamente.',
        [{ text: 'OK' }]
      );
      console.error('Error obteniendo ubicación:', error);
    } finally {
      setIsGettingLocation(false);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

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

  const changeLocation = () => {
    setShowMap(true);
  };

  const handleMapPress = async (event: any) => {
  const { latitude, longitude } = event.nativeEvent.coordinate;

  setLatitude(latitude);
  setLongitude(longitude);
  setMapRegion({
    ...mapRegion,
    latitude,
    longitude,
  });

  try {
    const [addressResult] = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    if (addressResult) {
    const isPlusCode = /^[A-Z0-9]{4}\+[A-Z0-9]{2,}$/i.test(addressResult.name || '');

    const address =
      addressResult.street ||
      (!isPlusCode
        ? (addressResult.name || '').split(',')[0].replace(/Piso\s*\d+/i, '').trim()
        : '');

    const cityName = addressResult.city || addressResult.region || '';

    setAddress(address || '');
    setCity(cityName);

    console.log('ADDRESS RESULT COMPLETO:', addressResult);
  } else {
    setAddress('');
    setCity('');
  }

  } catch (e) {
    setAddress('');
    setCity('');
  }

  setShowMap(false);
};

  const validateForm = (): boolean => {
    if (description.length < 10) {
      setErrorMessage('La descripción debe tener al menos 10 caracteres');
      return false;
    }
    
    if (!latitude || !longitude) {
      setErrorMessage('Debes seleccionar una ubicación válida');
      return false;
    }
    
    return true;
  };

  const submitReport = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const formData = new FormData();
      
      formData.append('description', description);
      formData.append('latitude', String(latitude));
      formData.append('longitude', String(longitude));
      formData.append('address', address || "");
      formData.append('city', city || "");
      formData.append('is_anonymous', String(isAnonymous));
      
      // CORRECCIÓN FINAL: El backend exige minúsculas según tu log de error
      formData.append('priority', priority.toLowerCase()); 
      
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

      const response = await fetch(`${API_URL}/reports/`, {
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
        throw new Error(msg || 'Error al crear el reporte');
      }
      
      setSuccessMessage('¡Reporte creado exitosamente! Será revisado por un administrador.');
      
      setTimeout(() => {
        resetForm();
        router.back();
      }, 2000);

    } catch (error: any) {
      setErrorMessage(error.message || 'Error al enviar el reporte');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setDescription('');
    setImages([]);
    setAddress('');
    setCity('');
    setIsAnonymous(false);
    setPriority(ReportPriority.MEDIA);
  };

  return (
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
          Nuevo <Text style={registerStyles.titleGradient}>Reporte</Text>
        </Text>
        <Text style={registerStyles.subtitle}>
          Describe la situación observada de forma clara y precisa
        </Text>
      </View>

      <ScrollView 
        contentContainerStyle={{ paddingBottom: 0 }}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
      >
        {/* Mensajes de éxito/error */}
        {successMessage ? (
          <View style={[reportStyles.messageContainer, reportStyles.successContainer]}>
            <Text style={[reportStyles.messageText, reportStyles.successText]}>
              {successMessage}
            </Text>
          </View>
        ) : null}
        
        {errorMessage ? (
          <View style={[reportStyles.messageContainer, reportStyles.errorContainer]}>
            <Text style={[reportStyles.messageText, reportStyles.errorText]}>
              {errorMessage}
            </Text>
          </View>
        ) : null}

        {/* Sección de fotos */}
        <View style={reportStyles.photosSection}>
          <Text style={[registerStyles.inputLabel, { marginBottom: 12 }]}>AGREGAR FOTOS</Text>
          <View style={reportStyles.photosContainer}>
            <TouchableOpacity 
              style={reportStyles.addPhotoButton}
              onPress={pickImage}
              disabled={images.length >= 5}
            >
              <Image
                source={require('@/assets/images/camera.png')}
                style={reportStyles.addPhotoIcon}
                resizeMode="contain"
              />
              <Text style={reportStyles.addPhotoText}>
                {images.length}/5 fotos
              </Text>
            </TouchableOpacity>
            
            {images.map((uri, index) => (
              <View key={index} style={reportStyles.photoItem}>
                <Image 
                  source={{ uri }} 
                  style={reportStyles.photoImage} 
                  resizeMode="cover"
                />
                <TouchableOpacity 
                  style={reportStyles.removePhotoButton}
                  onPress={() => removeImage(index)}
                >
                  <Text style={reportStyles.removePhotoText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Sección de ubicación */}
        <View style={registerStyles.inputGroup}>
          <Text style={registerStyles.inputLabel}>UBICACIÓN DETECTADA</Text>
          <View style={registerStyles.inputContainer}>
            <Image
              source={require('@/assets/images/location.png')}
              style={registerStyles.leftIcon}
              resizeMode="contain"
            />
            <Text style={[registerStyles.input, { flex: 1 }]}>
              {address || 'Obteniendo ubicación...'}
            </Text>
            <TouchableOpacity 
              onPress={changeLocation}
              disabled={isGettingLocation}
              style={{ padding: 6 }}
            >
              {isGettingLocation ? (
                <ActivityIndicator size="small" color="#00D4FF" />
              ) : (
                <Image
                  source={require('@/assets/images/edit.png')}
                  style={[registerStyles.leftIcon, { marginRight: 0 }]}
                  resizeMode="contain"
                />
              )}
            </TouchableOpacity>
          </View>
          
          {/* Coordenadas y ciudad */}
          <View style={{ marginTop: 12, gap: 8 }}>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={[registerStyles.inputLabel, { fontSize: 11, marginBottom: 4 }]}>LATITUD</Text>
                <Text style={{ color: '#CBD5E1', fontSize: 13 }}>
                  {latitude ? latitude.toFixed(6) : 'Obteniendo...'}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[registerStyles.inputLabel, { fontSize: 11, marginBottom: 4 }]}>LONGITUD</Text>
                <Text style={{ color: '#CBD5E1', fontSize: 13 }}>
                  {longitude ? longitude.toFixed(6) : 'Obteniendo...'}
                </Text>
              </View>
            </View>
            
            <View style={{ gap: 8 }}>
              <View>
                <Text style={[registerStyles.inputLabel, { fontSize: 11, marginBottom: 4 }]}>DIRECCIÓN (OPCIONAL)</Text>
                <TextInput
                  style={[
                    registerStyles.input,
                    { 
                      backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                      borderRadius: 8, 
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      fontSize: 14 
                    }
                  ]}
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Referencia del lugar"
                  placeholderTextColor="#64748B"
                />
              </View>
              
              <View>
                <Text style={[registerStyles.inputLabel, { fontSize: 11, marginBottom: 4 }]}>CIUDAD</Text>
                <TextInput
                  style={[
                    registerStyles.input,
                    { 
                      backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                      borderRadius: 8, 
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      fontSize: 14 
                    }
                  ]}
                  value={city}
                  onChangeText={setCity}
                  placeholder="Ej: Quito"
                  placeholderTextColor="#64748B"
                />
              </View>
            </View>
          </View>
        </View>

        {/* Mapa modal */}
        {showMap && (
          <View style={reportStyles.mapModal}>
            <View style={reportStyles.mapHeader}>
              <Text style={reportStyles.mapTitle}>Selecciona una ubicación</Text>
              <TouchableOpacity onPress={() => setShowMap(false)}>
                <Text style={reportStyles.mapClose}>Cerrar</Text>
              </TouchableOpacity>
            </View>
            
            <MapView
              style={reportStyles.map}
              region={mapRegion}
              onPress={handleMapPress}
              showsUserLocation
              showsMyLocationButton
            >
              {latitude && longitude && (
                <Marker
                  coordinate={{ latitude, longitude }}
                  title="Ubicación seleccionada"
                />
              )}
            </MapView>
            
            <View style={reportStyles.mapInstructions}>
              <Text style={reportStyles.mapInstructionsText}>
                Toca en el mapa para seleccionar una ubicación
              </Text>
            </View>
          </View>
        )}

        {/* Sección de descripción */}
        <View style={registerStyles.inputGroup}>
          <Text style={registerStyles.inputLabel}>DESCRIPCIÓN</Text>
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
              placeholder="Describe brevemente lo que observaste (mínimo 10 caracteres)"
              placeholderTextColor="#64748B"
              value={description}
              onChangeText={setDescription}
              multiline
              maxLength={500}
            />
          </View>
          <Text style={{
            fontSize: 12,
            color: description.length >= 10 ? '#00D4FF' : '#FF416C',
            marginTop: 6,
            fontFamily: 'Roboto_400Regular'
          }}>
            {description.length}/500 • {description.length < 10 ? 
              `Faltan ${10 - description.length} caracteres` : '✓ Descripción válida'}
          </Text>
        </View>

        {/* Sección anónima */}
        <View style={registerStyles.inputGroup}>
          <TouchableOpacity 
            style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}
            onPress={() => setIsAnonymous(!isAnonymous)}
          >
            <View style={{
              width: 22,
              height: 22,
              borderRadius: 6,
              borderWidth: 2,
              borderColor: isAnonymous ? '#00D4FF' : '#64748B',
              backgroundColor: isAnonymous ? 'rgba(0, 212, 255, 0.1)' : 'transparent',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {isAnonymous && (
                <Image
                  source={require('@/assets/images/anonimo.png')}
                  style={{ width: 14, height: 14, tintColor: '#00D4FF' }}
                  resizeMode="contain"
                />
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{
                fontFamily: 'Roboto_600SemiBold',
                fontSize: 14,
                color: '#E2E8F0',
                marginBottom: 2
              }}>
                Reporte anónimo
              </Text>
              <Text style={{
                fontFamily: 'Montserrat_400Regular',
                fontSize: 12,
                color: '#94A3B8',
                lineHeight: 16
              }}>
                Tu identidad no será visible en el reporte público
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Sección de prioridad */}
        <View style={registerStyles.inputGroup}>
          <Text style={registerStyles.inputLabel}>PRIORIDAD DEL REPORTE</Text>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
            {[ReportPriority.BAJA, ReportPriority.MEDIA, ReportPriority.ALTA].map((p) => (
              <TouchableOpacity
                key={p}
                style={{
                  flex: 1,
                  backgroundColor: priority === p 
                    ? p === ReportPriority.ALTA ? 'rgba(239, 68, 68, 0.1)' 
                    : p === ReportPriority.MEDIA ? 'rgba(249, 115, 22, 0.1)' 
                    : 'rgba(34, 197, 94, 0.1)'
                    : 'rgba(255, 255, 255, 0.05)',
                  borderWidth: 2,
                  borderColor: priority === p 
                    ? p === ReportPriority.ALTA ? '#EF4444' 
                    : p === ReportPriority.MEDIA ? '#F97316' 
                    : '#22C55E'
                    : 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 12,
                  padding: 12,
                  alignItems: 'center'
                }}
                onPress={() => setPriority(p)}
              >
                <Image
                  source={require('@/assets/images/priority.png')}
                  style={{
                    width: 24,
                    height: 24,
                    tintColor: p === ReportPriority.ALTA ? '#EF4444' 
                      : p === ReportPriority.MEDIA ? '#F97316' 
                      : '#22C55E',
                    marginBottom: 6
                  }}
                  resizeMode="contain"
                />
                <Text style={{
                  fontFamily: 'Roboto_700Bold',
                  fontSize: 13,
                  color: priority === p ? '#FFFFFF' : '#94A3B8',
                  marginBottom: 2
                }}>
                  {p.charAt(0) + p.slice(1).toLowerCase()}
                </Text>
                <Text style={{
                  fontFamily: 'Montserrat_400Regular',
                  fontSize: 10,
                  color: priority === p ? '#CBD5E1' : '#64748B',
                  textAlign: 'center'
                }}>
                  {p === ReportPriority.ALTA ? '¡Urgente!' 
                    : p === ReportPriority.MEDIA ? 'Prioridad normal' 
                    : 'Situación no urgente'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Botón de envío */}
        <TouchableOpacity
          style={[
            registerStyles.registerButton,
            (description.length < 10 || isLoading) && registerStyles.registerButtonDisabled,
            { marginTop: 20, marginBottom: 20 }
          ]}
          onPress={submitReport}
          disabled={description.length < 10 || isLoading}
        >
          <LinearGradient
            colors={isLoading || description.length < 10 ? ['#475569', '#475569'] : ['#00D4FF', '#0066FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={registerStyles.buttonGradient}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <View style={registerStyles.buttonContent}>
                <Text style={registerStyles.buttonText}>ENVIAR REPORTE</Text>
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
  );
}