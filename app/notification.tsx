// app/notifications.tsx
import { SafeArea } from '@/components/ui/safe-area';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { notificationStyles } from '@/styles/notificationStyles';
import { router } from 'expo-router';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

interface Notification {
  id: string;
  title: string;
  message: string;
  notification_type: 'reporte_asignado' | 'avance_subido' | 'reporte_resuelto' | 'sistema' | 'recordatorio' | 'nuevo_avance' | 'asignacion_caso' | 'cambio_estado';
  is_read: boolean;
  created_at: any; // Firestore timestamp
  user_id: string;
  data?: {
    report_id?: string;
    encargado_id?: string;
    reportante_id?: string;
    priority?: string;
  };
}

export default function NotificationsScreen() {
  const { authState: { user, token } } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'todos' | 'no_leidos'>('todos');

  // Escuchar notificaciones en tiempo real
  useEffect(() => {
    if (!user?.id) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    // Construir query base: notificaciones del usuario actual
    let q = query(
      collection(db, 'notifications'),
      where('user_id', '==', user.id),
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const notificationsData: Notification[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        notificationsData.push({
          id: doc.id,
          title: data.title || 'Notificación',
          message: data.message || '',
          notification_type: data.notification_type || 'sistema',
          is_read: data.is_read || false,
          created_at: data.created_at,
          user_id: data.user_id,
          data: data.data || {},
        });
      });

        notificationsData.sort((a, b) => {
    const dateA = a.created_at?.toDate?.() || new Date(0);
    const dateB = b.created_at?.toDate?.() || new Date(0);
    return dateB.getTime() - dateA.getTime(); // Orden descendente
  });

      setNotifications(notificationsData);
      setLoading(false);
      setRefreshing(false);
    }, (error) => {
      console.error('Error escuchando notificaciones:', error);
      Alert.alert('Error', 'No se pudieron cargar las notificaciones');
      setLoading(false);
      setRefreshing(false);
    });

    return () => unsubscribe();
  }, [user?.id]);

  // Filtrar notificaciones según el filtro seleccionado
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'no_leidos') {
      return !notification.is_read;
    }
    return true; // 'todos'
  });

  // Marcar notificación como leída
  const markAsRead = async (notificationId: string) => {
    if (!token) return;
    
    try {
      const response = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const error = await response.json();
        console.error('Error marcando como leída:', error);
      }
      // El onSnapshot actualizará automáticamente
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Marcar todas como leídas
  const markAllAsRead = async () => {
    if (!token || notifications.length === 0) return;
    
    Alert.alert(
      'Marcar todas como leídas',
      '¿Quieres marcar todas las notificaciones como leídas?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sí, marcar todas', 
          onPress: async () => {
            try {
              const response = await fetch(`${API_URL}/notifications/mark-all-read`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${token}`,
                },
              });
              
              if (response.ok) {
                Alert.alert('Éxito', 'Todas las notificaciones marcadas como leídas');
              } else {
                const error = await response.json();
                Alert.alert('Error', error.detail || 'Error al marcar notificaciones');
              }
            } catch (error) {
              console.error('Error:', error);
              Alert.alert('Error', 'No se pudieron marcar las notificaciones');
            }
          }
        }
      ]
    );
  };

  // Eliminar notificación
  const deleteNotification = (notificationId: string) => {
    Alert.alert(
      'Eliminar notificación',
      '¿Estás seguro de que quieres eliminar esta notificación?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: async () => {
            if (!token) return;
            
            try {
              const response = await fetch(`${API_URL}/notifications/${notificationId}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${token}`,
                },
              });
              
              if (response.ok) {
                // El onSnapshot actualizará automáticamente
              } else {
                const error = await response.json();
                Alert.alert('Error', error.detail || 'Error al eliminar notificación');
              }
            } catch (error) {
              console.error('Error:', error);
              Alert.alert('Error', 'No se pudo eliminar la notificación');
            }
          }
        }
      ]
    );
  };

  // Eliminar todas las notificaciones
  const deleteAllNotifications = () => {
    Alert.alert(
      'Eliminar todas',
      '¿Estás seguro de que quieres eliminar TODAS las notificaciones? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar todas', 
          style: 'destructive',
          onPress: async () => {
            if (!token) return;
            
            try {
              const response = await fetch(`${API_URL}/notifications/`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${token}`,
                },
              });
              
              if (response.ok) {
                Alert.alert('Éxito', 'Todas las notificaciones han sido eliminadas');
              } else {
                const error = await response.json();
                Alert.alert('Error', error.detail || 'Error al eliminar notificaciones');
              }
            } catch (error) {
              console.error('Error:', error);
              Alert.alert('Error', 'No se pudieron eliminar las notificaciones');
            }
          }
        }
      ]
    );
  };

  // Obtener icono según tipo de notificación
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'reporte_asignado':
        return require('@/assets/images/asignado.png');
      case 'avance_subido':
        return require('@/assets/images/send.png');
      case 'reporte_resuelto':
        return require('@/assets/images/resuelto.png');
      case 'recordatorio':
        return require('@/assets/images/recordatorio.png');
      default:
        return require('@/assets/images/mensaje.png');
    }
  };

  // Obtener color según tipo de notificación
  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'reporte_asignado':
        return '#3B82F6'; // Azul
      case 'avance_subido':
        return '#10B981'; // Verde
      case 'reporte_resuelto':
        return '#8B5CF6'; // Violeta
      case 'recordatorio':
        return '#F59E0B'; // Ámbar
      default:
        return '#2563EB'; // Azul primario
    }
  };

  // Formatear fecha
  const formatDate = (timestamp: any) => {
    try {
      const date = timestamp?.toDate?.() || new Date();
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 60) {
        return `Hace ${diffMins} min${diffMins !== 1 ? 's' : ''}`;
      } else if (diffHours < 24) {
        return `Hace ${diffHours} hora${diffHours !== 1 ? 's' : ''}`;
      } else if (diffDays < 7) {
        return `Hace ${diffDays} día${diffDays !== 1 ? 's' : ''}`;
      } else {
        return date.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });
      }
    } catch {
      return 'Reciente';
    }
  };

  // Contar notificaciones no leídas
  const unreadCount = notifications.filter(n => !n.is_read).length;

  // Función para recargar
  const onRefresh = () => {
    setRefreshing(true);
    // El onSnapshot se actualizará automáticamente
  };

const handleNotificationPress = (notification: Notification) => {
  console.log('🔥 NOTIFICACIÓN COMPLETA:', notification);

  // Marcar como leída
  if (!notification.is_read) {
    markAsRead(notification.id);
  }

  // USAR LOS TIPOS CORRECTOS QUE VIENEN DE TU BACKEND
  if (user?.role === 'reportante') {
    if (notification.notification_type === 'nuevo_avance' || notification.notification_type === 'cambio_estado') {
      // Para avances, intentar navegar a avances
      const reportId = notification.data?.report_id;
      if (reportId) {
        router.push(`/reportante/avances?reportId=${reportId}`);
      } else {
        // Si no hay reportId, ir al historial
        router.push('/reportante/history');
      }
    } else if (notification.notification_type === 'asignacion_caso') {
      // Para asignación, ir al historial
      router.push('/reportante/history');
    } else {
      // Para otros tipos, ir al historial
      router.push('/reportante/history');
    }
    return;
  }
  
  if (user?.role === 'encargado' && notification.notification_type === 'asignacion_caso') {
  router.push('/encargado/history');
  return;
}
  
if (user?.role === 'admin') {
  if (notification.notification_type === 'nuevo_avance' || 
      notification.notification_type === 'cambio_estado') {
    const reportId = notification.data?.report_id;
    if (reportId) {
      router.push(`/admin/avances?reportId=${reportId}`);
    } else {
      router.push('/admin/report');
    }
  } else if (notification.notification_type === 'asignacion_caso') {
    router.push('/admin/report');
  } else {
    router.push('/admin/report');
  }
  return;
}
  
  // Rol no reconocido
  router.push('/');
};

  if (loading && !refreshing) {
    return (
        <SafeArea>
      <View style={notificationStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={notificationStyles.loadingText}>Cargando notificaciones...</Text>
      </View>
      </SafeArea>
    );
  }

  return (
    <SafeArea>
    <View style={notificationStyles.container}>
      {/* Header */}
      <View style={notificationStyles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity 
            style={notificationStyles.backButton}
            onPress={() => router.back()}
          >
            <Image
              source={require('@/assets/images/volver.png')}
              style={notificationStyles.backIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={notificationStyles.headerTitle}>Notificaciones</Text>
          {unreadCount > 0 && (
            <View style={notificationStyles.unreadBadge}>
              <Text style={notificationStyles.unreadBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        
        <View style={notificationStyles.headerActions}>
          {notifications.length > 0 && (
            <>
              <TouchableOpacity onPress={markAllAsRead}>
                <Image
                  source={require('@/assets/images/checkall.png')}
                  style={notificationStyles.headerIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={deleteAllNotifications}>
                <Image
                  source={require('@/assets/images/borrarN.png')}
                  style={notificationStyles.headerIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      {/* Filtros */}
      <View style={notificationStyles.filtersContainer}>
        <TouchableOpacity
          style={[
            notificationStyles.filterButton,
            filter === 'todos' && notificationStyles.filterButtonActive
          ]}
          onPress={() => setFilter('todos')}
        >
          <Text style={[
            notificationStyles.filterButtonText,
            filter === 'todos' && notificationStyles.filterButtonTextActive
          ]}>
            Todos ({notifications.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            notificationStyles.filterButton,
            filter === 'no_leidos' && notificationStyles.filterButtonActive
          ]}
          onPress={() => setFilter('no_leidos')}
        >
          <Text style={[
            notificationStyles.filterButtonText,
            filter === 'no_leidos' && notificationStyles.filterButtonTextActive
          ]}>
            No leídas ({unreadCount})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Contenido */}
      <ScrollView
        style={notificationStyles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2563EB']}
            tintColor="#2563EB"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {filteredNotifications.length === 0 ? (
          <View style={notificationStyles.emptyContainer}>
            <Image
              source={require('@/assets/images/vacio.png')}
              style={notificationStyles.emptyIcon}
              resizeMode="contain"
            />
            <Text style={notificationStyles.emptyTitle}>
              {filter === 'no_leidos' 
                ? 'No hay notificaciones no leídas' 
                : 'No hay notificaciones'}
            </Text>
            <Text style={notificationStyles.emptySubtitle}>
              {filter === 'no_leidos'
                ? '¡Estás al día con todas tus notificaciones!'
                : 'Aquí aparecerán tus notificaciones importantes'}
            </Text>
          </View>
        ) : (
          <View style={notificationStyles.notificationsList}>
            {filteredNotifications.map((notification) => {
              const isUnread = !notification.is_read;
              
              return (
                <TouchableOpacity
                  key={notification.id}
                  style={[
                    notificationStyles.notificationCard,
                    isUnread && notificationStyles.notificationCardUnread
                  ]}
                  onPress={() => handleNotificationPress(notification)}
                  activeOpacity={0.7}
                >
                  {/* Indicador de no leído */}
                  {isUnread && (
                    <View style={notificationStyles.unreadIndicator} />
                  )}

                  {/* Icono */}
                  <View style={[
                    notificationStyles.iconContainer,
                    { backgroundColor: getNotificationColor(notification.notification_type) + '20' }
                  ]}>
                    <Image
                      source={getNotificationIcon(notification.notification_type)}
                      style={[
                        notificationStyles.icon,
                        { tintColor: getNotificationColor(notification.notification_type) }
                      ]}
                      resizeMode="contain"
                    />
                  </View>

                  {/* Contenido */}
                  <View style={notificationStyles.notificationContent}>
                    <View style={notificationStyles.notificationHeader}>
                      <Text style={notificationStyles.notificationTitle}>
                        {notification.title}
                      </Text>
                      <Text style={notificationStyles.notificationTime}>
                        {formatDate(notification.created_at)}
                      </Text>
                    </View>
                    
                    <Text style={notificationStyles.notificationMessage}>
                      {notification.message}
                    </Text>

                    {/* Tipo de notificación */}
                    <View style={notificationStyles.notificationTypeContainer}>
                      <View style={[
                        notificationStyles.notificationTypeBadge,
                        { backgroundColor: getNotificationColor(notification.notification_type) }
                      ]}>
                        <Text style={notificationStyles.notificationTypeText}>
                          {notification.notification_type.replace('_', ' ').toUpperCase()}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Botón eliminar */}
                  <TouchableOpacity
                    style={notificationStyles.deleteButton}
                    onPress={() => deleteNotification(notification.id)}
                  >
                    <Image
                      source={require('@/assets/images/borrarN.png')}
                      style={notificationStyles.deleteIcon}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Pie de página */}
      {notifications.length > 0 && (
        <View style={notificationStyles.footer}>
          <Text style={notificationStyles.footerText}>
            {unreadCount > 0 
              ? `Tienes ${unreadCount} notificación${unreadCount !== 1 ? 'es' : ''} sin leer`
              : 'Todas las notificaciones leídas'
            }
          </Text>
        </View>
      )}
    </View>
    </SafeArea>
  );
}