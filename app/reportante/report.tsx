// app/reportante/report.tsx
import { useAuth } from '@/hooks/useAuth';
import * as ImagePicker from 'expo-image-picker';
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
import { reportStyles } from '../styles/reportante/reportStyles';

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

      const response = await fetch('http://192.168.1.145:8000/reports/', {
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
    <ScrollView 
      contentContainerStyle={reportStyles.scrollContent}
      showsVerticalScrollIndicator={false}
      style={reportStyles.container}
    >
      <View style={reportStyles.header}>
        <Text style={reportStyles.headerTitle}>Nuevo Reporte</Text>
        <Text style={reportStyles.headerSubtitle}>
          Describe la situación observada de forma clara y precisa
        </Text>
      </View>

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

      <View style={reportStyles.photosSection}>
        <Text style={reportStyles.photosTitle}>Agregar foto</Text>
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

      <View style={reportStyles.divider} />

      <View style={reportStyles.locationSection}>
        <Text style={reportStyles.locationTitle}>Ubicación detectada</Text>
        <View style={reportStyles.locationCard}>
          <View style={reportStyles.locationHeader}>
            <Image
              source={require('@/assets/images/location.png')}
              style={reportStyles.locationIcon}
              resizeMode="contain"
            />
            <Text style={reportStyles.locationText}>
              {address || 'Obteniendo ubicación...'}
            </Text>
            <TouchableOpacity 
              style={reportStyles.changeLocationButton}
              onPress={changeLocation}
              disabled={isGettingLocation}
            >
              {isGettingLocation ? (
                <ActivityIndicator size="small" color="#2563EB" />
              ) : (
                <>
                  <Image
                    source={require('@/assets/images/edit.png')}
                    style={reportStyles.editIcon}
                    resizeMode="contain"
                  />
                  <Text style={reportStyles.changeLocationText}>
                    Cambiar
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
          
          <View style={reportStyles.coordinatesContainer}>
            <View style={reportStyles.coordinateRow}>
              <Text style={reportStyles.coordinateLabel}>Latitud:</Text>
              <Text style={reportStyles.coordinateValue}>
                {latitude ? latitude.toFixed(6) : 'Obteniendo...'}
              </Text>
            </View>
            <View style={reportStyles.coordinateRow}>
              <Text style={reportStyles.coordinateLabel}>Longitud:</Text>
              <Text style={reportStyles.coordinateValue}>
                {longitude ? longitude.toFixed(6) : 'Obteniendo...'}
              </Text>
            </View>
            
            <View style={reportStyles.coordinateRow}>
              <Text style={reportStyles.coordinateLabel}>Dirección:</Text>
              <TextInput
                style={[reportStyles.coordinateValue, {padding: 0}]}
                value={address}
                onChangeText={setAddress}
                placeholder="Referencia del lugar (opcional)"
                placeholderTextColor="#94a3b8"
              />
            </View>
            <View style={reportStyles.coordinateRow}>
              <Text style={reportStyles.coordinateLabel}>Ciudad:</Text>
              <TextInput
                style={[reportStyles.coordinateValue, {padding: 0}]}
                value={city}
                onChangeText={setCity}
                placeholder="Ej: Quito"
                placeholderTextColor="#94a3b8"
              />
            </View>
          </View>
        </View>
      </View>

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

      <View style={reportStyles.descriptionSection}>
        <Text style={reportStyles.descriptionTitle}>Ingrese descripción</Text>
        <TextInput
          style={reportStyles.descriptionInput}
          placeholder="Describe brevemente lo que observaste (mínimo 10 caracteres)"
          placeholderTextColor="#94a3b8"
          value={description}
          onChangeText={setDescription}
          multiline
          maxLength={500}
        />
        <Text style={[
          reportStyles.characterCount,
          description.length < 10 ? reportStyles.characterCountError : 
          description.length >= 10 ? reportStyles.characterCountValid : {}
        ]}>
          {description.length}/500 caracteres • {description.length < 10 ? 
            `Faltan ${10 - description.length} caracteres` : '✓ Válido'}
        </Text>
      </View>

      <View style={reportStyles.anonymousSection}>
        <View style={reportStyles.anonymousRow}>
          <TouchableOpacity 
            style={reportStyles.checkboxContainer}
            onPress={() => setIsAnonymous(!isAnonymous)}
          >
            <View style={[
              reportStyles.checkbox,
              isAnonymous && reportStyles.checkboxChecked
            ]}>
              {isAnonymous && (
                <Image
                  source={require('@/assets/images/anonimo.png')}
                  style={reportStyles.checkIcon}
                  resizeMode="contain"
                />
              )}
            </View>
          </TouchableOpacity>
          
          <View style={reportStyles.anonymousContent}>
            <Text style={reportStyles.anonymousTitle}>
              Realizar reporte de forma anónima
            </Text>
            <Text style={reportStyles.anonymousText}>
              Tu identidad no será visible en el reporte público
            </Text>
          </View>
        </View>
      </View>

      <View style={reportStyles.prioritySection}>
        <Text style={reportStyles.priorityTitle}>Prioridad del reporte</Text>
        <View style={reportStyles.priorityOptions}>
          <TouchableOpacity 
            style={[
              reportStyles.priorityButton,
              priority === ReportPriority.BAJA && reportStyles.priorityButtonSelected
            ]}
            onPress={() => setPriority(ReportPriority.BAJA)}
          >
            <Image
              source={require('@/assets/images/priority.png')}
              style={[
                reportStyles.priorityIcon,
                {tintColor: priority === ReportPriority.BAJA ? '#22c55e' : '#94a3b8'}
              ]}
              resizeMode="contain"
            />
            <Text style={[
              reportStyles.priorityLabel,
              priority === ReportPriority.BAJA && reportStyles.priorityButtonSelectedText
            ]}>
              Baja
            </Text>
            <Text style={reportStyles.priorityDescription}>
              Situación no urgente
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              reportStyles.priorityButton,
              priority === ReportPriority.MEDIA && reportStyles.priorityButtonSelected
            ]}
            onPress={() => setPriority(ReportPriority.MEDIA)}
          >
            <Image
              source={require('@/assets/images/priority.png')}
              style={[
                reportStyles.priorityIcon,
                {tintColor: priority === ReportPriority.MEDIA ? '#f97316' : '#94a3b8'}
              ]}
              resizeMode="contain"
            />
            <Text style={[
              reportStyles.priorityLabel,
              priority === ReportPriority.MEDIA && reportStyles.priorityButtonSelectedText
            ]}>
              Media
            </Text>
            <Text style={reportStyles.priorityDescription}>
              Prioridad normal
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              reportStyles.priorityButton,
              priority === ReportPriority.ALTA && reportStyles.priorityButtonSelected
            ]}
            onPress={() => setPriority(ReportPriority.ALTA)}
          >
            <Image
              source={require('@/assets/images/priority.png')}
              style={[
                reportStyles.priorityIcon,
                {tintColor: priority === ReportPriority.ALTA ? '#ef4444' : '#94a3b8'}
              ]}
              resizeMode="contain"
            />
            <Text style={[
              reportStyles.priorityLabel,
              priority === ReportPriority.ALTA && reportStyles.priorityButtonSelectedText
            ]}>
              Alta
            </Text>
            <Text style={reportStyles.priorityDescription}>
              ¡Urgente!
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={[
          reportStyles.sendButton,
          (description.length < 10 || isLoading) && reportStyles.sendButtonDisabled
        ]}
        onPress={submitReport}
        disabled={description.length < 10 || isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <>
            <Image
              source={require('@/assets/images/send.png')}
              style={reportStyles.sendIcon}
              resizeMode="contain"
            />
            <Text style={reportStyles.sendButtonText}>
              Enviar reporte
            </Text>
          </>
        )}
      </TouchableOpacity>

      {isLoading && (
        <View style={reportStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={{marginTop: 10, color: '#64748b'}}>
            Enviando reporte...
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

