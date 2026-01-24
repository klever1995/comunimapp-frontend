// app/notifications.tsx
import { SafeArea } from '@/components/ui/safe-area';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { notificationStyles } from '@/styles/notificationStyles';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
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
  created_at: any;
  user_id: string;
  data?: {
    report_id?: string;
    encargado_id?: string;
    reportante_id?: string;
    priority?: string;
  };
}

// Componente de Toast Mejorado
const Toast = ({ visible, message, type, onHide }: {
  visible: boolean;
  message: string;
  type: 'success' | 'error' | 'warning';
  onHide: () => void;
}) => {
  const [fadeAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(2500),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => onHide());
    }
  }, [visible]);

  if (!visible) return null;

  const config = {
    success: { bg: '#10B981', icon: 'checkmark-circle' as const },
    error: { bg: '#EF4444', icon: 'close-circle' as const },
    warning: { bg: '#F59E0B', icon: 'warning' as const },
  };

  const { bg, icon } = config[type];

  return (
    <Animated.View
      style={[
        notificationStyles.toastContainer,
        { backgroundColor: bg, opacity: fadeAnim },
      ]}
    >
      <Ionicons name={icon} size={24} color="#FFF" />
      <Text style={notificationStyles.toastText}>{message}</Text>
    </Animated.View>
  );
};

export default function NotificationsScreen() {
  const { authState: { user, token } } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'todos' | 'no_leidos'>('todos');
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    type: 'success' as 'success' | 'error' | 'warning',
  });

  const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
    setToast({ visible: true, message, type });
  };

  const hideToast = () => {
    setToast({ ...toast, visible: false });
  };

  useEffect(() => {
    if (!user?.id) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    
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
        return dateB.getTime() - dateA.getTime();
      });

      setNotifications(notificationsData);
      setLoading(false);
      setRefreshing(false);
    }, (error) => {
      console.error('Error escuchando notificaciones:', error);
      showToast('No se pudieron cargar las notificaciones', 'error');
      setLoading(false);
      setRefreshing(false);
    });

    return () => unsubscribe();
  }, [user?.id]);

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'no_leidos') {
      return !notification.is_read;
    }
    return true;
  });

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
        console.error('Error marcando como leída');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!token || notifications.length === 0) return;
    
    try {
      const response = await fetch(`${API_URL}/notifications/mark-all-read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        showToast('Todas marcadas como leídas', 'success');
      } else {
        showToast('Error al marcar notificaciones', 'error');
      }
    } catch (error) {
      showToast('Error al marcar notificaciones', 'error');
    }
  };

  const deleteNotification = async (notificationId: string) => {
    if (!token) return;
    
    try {
      const response = await fetch(`${API_URL}/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        showToast('Notificación eliminada', 'success');
      } else {
        showToast('Error al eliminar', 'error');
      }
    } catch (error) {
      showToast('Error al eliminar', 'error');
    }
  };

  const deleteAllNotifications = async () => {
    if (!token) return;
    
    try {
      const response = await fetch(`${API_URL}/notifications/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        showToast('Todas eliminadas correctamente', 'success');
      } else {
        showToast('Error al eliminar', 'error');
      }
    } catch (error) {
      showToast('Error al eliminar', 'error');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'reporte_asignado':
      case 'asignacion_caso':
        return 'document-text';
      case 'avance_subido':
      case 'nuevo_avance':
        return 'cloud-upload';
      case 'reporte_resuelto':
        return 'checkmark-circle';
      case 'cambio_estado':
        return 'swap-horizontal';
      case 'recordatorio':
        return 'alarm';
      default:
        return 'notifications';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'reporte_asignado':
      case 'asignacion_caso':
        return '#3B82F6';
      case 'avance_subido':
      case 'nuevo_avance':
        return '#10B981';
      case 'reporte_resuelto':
        return '#8B5CF6';
      case 'cambio_estado':
        return '#06B6D4';
      case 'recordatorio':
        return '#F59E0B';
      default:
        return '#2563EB';
    }
  };

  const formatDate = (timestamp: any) => {
    try {
      const date = timestamp?.toDate?.() || new Date();
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return 'Ahora';
      if (diffMins < 60) return `Hace ${diffMins} min`;
      if (diffHours < 24) return `Hace ${diffHours}h`;
      if (diffDays < 7) return `Hace ${diffDays}d`;
      
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
      });
    } catch {
      return 'Reciente';
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const onRefresh = () => {
    setRefreshing(true);
  };

  const handleNotificationPress = (notification: Notification) => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }

    if (user?.role === 'reportante') {
      if (notification.notification_type === 'nuevo_avance' || notification.notification_type === 'cambio_estado') {
        const reportId = notification.data?.report_id;
        if (reportId) {
          router.push(`/reportante/avances?reportId=${reportId}`);
        } else {
          router.push('/reportante/history');
        }
      } else {
        router.push('/reportante/history');
      }
      return;
    }
    
    if (user?.role === 'encargado' && notification.notification_type === 'asignacion_caso') {
      router.push('/encargado/history');
      return;
    }
    
    if (user?.role === 'admin') {
      if (notification.notification_type === 'nuevo_avance' || notification.notification_type === 'cambio_estado') {
        const reportId = notification.data?.report_id;
        if (reportId) {
          router.push(`/admin/avances?reportId=${reportId}`);
        } else {
          router.push('/admin/report');
        }
      } else {
        router.push('/admin/report');
      }
      return;
    }
    
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
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />

      <View style={notificationStyles.container}>
        {/* Header Moderno */}
        <View style={notificationStyles.header}>
          <View style={notificationStyles.headerLeft}>
            <TouchableOpacity 
              style={notificationStyles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#1e293b" />
            </TouchableOpacity>
            <View>
              <Text style={notificationStyles.headerTitle}>Notificaciones</Text>
              {unreadCount > 0 && (
                <Text style={notificationStyles.headerSubtitle}>
                  {unreadCount} sin leer
                </Text>
              )}
            </View>
          </View>
          
          <View style={notificationStyles.headerActions}>
            {notifications.length > 0 && (
              <>
                <TouchableOpacity 
                  style={notificationStyles.actionButton}
                  onPress={markAllAsRead}
                >
                  <Ionicons name="checkmark-done" size={22} color="#2563EB" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={notificationStyles.actionButton}
                  onPress={deleteAllNotifications}
                >
                  <Ionicons name="trash-outline" size={22} color="#EF4444" />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        {/* Filtros Modernos */}
        <View style={notificationStyles.filtersContainer}>
          <TouchableOpacity
            style={[
              notificationStyles.filterButton,
              filter === 'todos' && notificationStyles.filterButtonActive
            ]}
            onPress={() => setFilter('todos')}
          >
            <Ionicons 
              name="list" 
              size={18} 
              color={filter === 'todos' ? '#FFF' : '#64748b'} 
            />
            <Text style={[
              notificationStyles.filterButtonText,
              filter === 'todos' && notificationStyles.filterButtonTextActive
            ]}>
              Todos
            </Text>
            <View style={[
              notificationStyles.filterBadge,
              filter === 'todos' && notificationStyles.filterBadgeActive
            ]}>
              <Text style={[
                notificationStyles.filterBadgeText,
                filter === 'todos' && notificationStyles.filterBadgeTextActive
              ]}>
                {notifications.length}
              </Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              notificationStyles.filterButton,
              filter === 'no_leidos' && notificationStyles.filterButtonActive
            ]}
            onPress={() => setFilter('no_leidos')}
          >
            <Ionicons 
              name="mail-unread" 
              size={18} 
              color={filter === 'no_leidos' ? '#FFF' : '#64748b'} 
            />
            <Text style={[
              notificationStyles.filterButtonText,
              filter === 'no_leidos' && notificationStyles.filterButtonTextActive
            ]}>
              No leídas
            </Text>
            <View style={[
              notificationStyles.filterBadge,
              filter === 'no_leidos' && notificationStyles.filterBadgeActive
            ]}>
              <Text style={[
                notificationStyles.filterBadgeText,
                filter === 'no_leidos' && notificationStyles.filterBadgeTextActive
              ]}>
                {unreadCount}
              </Text>
            </View>
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
              <View style={notificationStyles.emptyIconContainer}>
                <Ionicons name="notifications-off-outline" size={80} color="#CBD5E1" />
              </View>
              <Text style={notificationStyles.emptyTitle}>
                {filter === 'no_leidos' 
                  ? '¡Todo al día!' 
                  : 'Sin notificaciones'}
              </Text>
              <Text style={notificationStyles.emptySubtitle}>
                {filter === 'no_leidos'
                  ? 'Has leído todas tus notificaciones'
                  : 'Aquí aparecerán tus notificaciones importantes'}
              </Text>
            </View>
          ) : (
            <View style={notificationStyles.notificationsList}>
              {filteredNotifications.map((notification) => {
                const isUnread = !notification.is_read;
                const color = getNotificationColor(notification.notification_type);
                
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
                    {/* Icono con fondo de color */}
                    <View style={[
                      notificationStyles.iconContainer,
                      { backgroundColor: color + '15' }
                    ]}>
                      <Ionicons 
                        name={getNotificationIcon(notification.notification_type) as any}
                        size={24} 
                        color={color}
                      />
                      {isUnread && (
                        <View style={[notificationStyles.unreadDot, { backgroundColor: color }]} />
                      )}
                    </View>

                    {/* Contenido */}
                    <View style={notificationStyles.notificationContent}>
                      <View style={notificationStyles.notificationHeader}>
                        <Text style={notificationStyles.notificationTitle} numberOfLines={1}>
                          {notification.title}
                        </Text>
                        <Text style={notificationStyles.notificationTime}>
                          {formatDate(notification.created_at)}
                        </Text>
                      </View>
                      
                      <Text style={notificationStyles.notificationMessage} numberOfLines={2}>
                        {notification.message}
                      </Text>

                      {/* Badge de tipo */}
                      <View style={[
                        notificationStyles.typeBadge,
                        { backgroundColor: color + '20' }
                      ]}>
                        <Text style={[notificationStyles.typeBadgeText, { color }]}>
                          {notification.notification_type.replace('_', ' ')}
                        </Text>
                      </View>
                    </View>

                    {/* Botón eliminar */}
                    <TouchableOpacity
                      style={notificationStyles.deleteButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                    >
                      <Ionicons name="close-circle" size={20} color="#94a3b8" />
                    </TouchableOpacity>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </ScrollView>

        {/* Footer con contador */}
        {notifications.length > 0 && (
          <View style={notificationStyles.footer}>
            <Ionicons 
              name={unreadCount > 0 ? "mail-unread" : "checkmark-done"} 
              size={16} 
              color="#64748b" 
            />
            <Text style={notificationStyles.footerText}>
              {unreadCount > 0 
                ? `${unreadCount} notificación${unreadCount !== 1 ? 'es' : ''} sin leer`
                : 'Todas las notificaciones leídas'
              }
            </Text>
          </View>
        )}
      </View>
    </SafeArea>
  );
}