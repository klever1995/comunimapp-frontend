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
  Dimensions,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const { width } = Dimensions.get('window');

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

// Componente de Toast Ultra Moderno
const ModernToast = ({ visible, message, type, onHide }: {
  visible: boolean;
  message: string;
  type: 'success' | 'error' | 'warning';
  onHide: () => void;
}) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(-100));

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(fadeAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();

      setTimeout(() => {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: -100,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => onHide());
      }, 3000);
    }
  }, [visible]);

  if (!visible) return null;

  const config = {
    success: { bg: ['#10B981', '#059669'], icon: 'checkmark-circle', gradient: true },
    error: { bg: ['#EF4444', '#DC2626'], icon: 'close-circle', gradient: true },
    warning: { bg: ['#F59E0B', '#D97706'], icon: 'warning', gradient: true },
  };

  const { bg, icon } = config[type];

  return (
    <Animated.View
      style={[
        notificationStyles.modernToast,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={[notificationStyles.modernToastContent, { backgroundColor: bg[0] }]}>
        <View style={notificationStyles.toastIconContainer}>
          <Ionicons name={icon as any} size={24} color="#FFF" />
        </View>
        <Text style={notificationStyles.modernToastText}>{message}</Text>
      </View>
    </Animated.View>
  );
};

// Componente de Notificación Animada
const AnimatedNotificationCard = ({ 
  notification, 
  onPress, 
  onDelete, 
  index 
}: { 
  notification: Notification; 
  onPress: () => void; 
  onDelete: () => void;
  index: number;
}) => {
  const [scaleAnim] = useState(new Animated.Value(0));
  const isUnread = !notification.is_read;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      delay: index * 50,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  const getNotificationConfig = (type: string) => {
    const configs: Record<string, any> = {
      'asignacion_caso': {
        icon: 'document-text',
        color: '#3B82F6',
        gradient: ['#3B82F6', '#2563EB'],
        bgGradient: ['#EFF6FF', '#DBEAFE'],
      },
      'nuevo_avance': {
        icon: 'trending-up',
        color: '#10B981',
        gradient: ['#10B981', '#059669'],
        bgGradient: ['#ECFDF5', '#D1FAE5'],
      },
      'reporte_resuelto': {
        icon: 'checkmark-done-circle',
        color: '#8B5CF6',
        gradient: ['#8B5CF6', '#7C3AED'],
        bgGradient: ['#F5F3FF', '#EDE9FE'],
      },
      'cambio_estado': {
        icon: 'git-compare',
        color: '#06B6D4',
        gradient: ['#06B6D4', '#0891B2'],
        bgGradient: ['#ECFEFF', '#CFFAFE'],
      },
      'recordatorio': {
        icon: 'alarm',
        color: '#F59E0B',
        gradient: ['#F59E0B', '#D97706'],
        bgGradient: ['#FFFBEB', '#FEF3C7'],
      },
    };
    return configs[type] || configs['asignacion_caso'];
  };

  const config = getNotificationConfig(notification.notification_type);

  const formatDate = (timestamp: any) => {
    try {
      const date = timestamp?.toDate?.() || new Date();
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);

      if (diffMins < 1) return 'Ahora mismo';
      if (diffMins < 60) return `Hace ${diffMins}m`;
      if (diffHours < 24) return `Hace ${diffHours}h`;
      
      return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
    } catch {
      return 'Reciente';
    }
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[
          notificationStyles.modernCard,
          isUnread && notificationStyles.modernCardUnread,
        ]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        {/* Glow effect para no leídas */}
        {isUnread && (
          <View style={[notificationStyles.glowEffect, { backgroundColor: config.color }]} />
        )}

        {/* Contenedor principal con glassmorphism */}
        <View style={notificationStyles.cardContent}>
          {/* Icono con gradiente */}
          <View style={[notificationStyles.modernIconContainer, { backgroundColor: config.bgGradient[0] }]}>
            <View style={[notificationStyles.iconGlow, { backgroundColor: config.color }]} />
            <Ionicons name={config.icon} size={28} color={config.color} />
            {isUnread && (
              <View style={[notificationStyles.pulseDot, { backgroundColor: config.color }]} />
            )}
          </View>

          {/* Contenido */}
          <View style={notificationStyles.modernContent}>
            <View style={notificationStyles.contentHeader}>
              <Text style={notificationStyles.modernTitle} numberOfLines={1}>
                {notification.title}
              </Text>
              <View style={notificationStyles.timeContainer}>
                <Ionicons name="time-outline" size={12} color="#94A3B8" />
                <Text style={notificationStyles.modernTime}>
                  {formatDate(notification.created_at)}
                </Text>
              </View>
            </View>
            
            <Text style={notificationStyles.modernMessage} numberOfLines={2}>
              {notification.message}
            </Text>

            {/* Footer con badge y actions */}
            <View style={notificationStyles.cardFooter}>
              <View style={[notificationStyles.modernBadge, { backgroundColor: config.bgGradient[1] }]}>
                <View style={[notificationStyles.badgeDot, { backgroundColor: config.color }]} />
                <Text style={[notificationStyles.modernBadgeText, { color: config.color }]}>
                  {notification.notification_type.replace('_', ' ')}
                </Text>
              </View>

              <TouchableOpacity
                style={notificationStyles.modernDeleteButton}
                onPress={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                <Ionicons name="trash-outline" size={18} color="#94A3B8" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Indicador lateral para no leídas */}
        {isUnread && (
          <View style={[notificationStyles.sideIndicator, { backgroundColor: config.color }]} />
        )}
      </TouchableOpacity>
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
      console.error('Error:', error);
      showToast('Error al cargar notificaciones', 'error');
      setLoading(false);
      setRefreshing(false);
    });

    return () => unsubscribe();
  }, [user?.id]);

  const filteredNotifications = notifications.filter(n => 
    filter === 'no_leidos' ? !n.is_read : true
  );

  const markAsRead = async (notificationId: string) => {
    if (!token) return;
    try {
      await fetch(`${API_URL}/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` },
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!token || notifications.length === 0) return;
    try {
      const response = await fetch(`${API_URL}/notifications/mark-all-read`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        showToast('✓ Todas marcadas como leídas', 'success');
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
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        showToast('Notificación eliminada', 'success');
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
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        showToast('✓ Todas eliminadas', 'success');
      }
    } catch (error) {
      showToast('Error al eliminar', 'error');
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleNotificationPress = (notification: Notification) => {
    if (!notification.is_read) markAsRead(notification.id);

    if (user?.role === 'reportante') {
      if (notification.notification_type === 'nuevo_avance' || notification.notification_type === 'cambio_estado') {
        const reportId = notification.data?.report_id;
        router.push(reportId ? `/reportante/avances?reportId=${reportId}` : '/reportante/history');
      } else {
        router.push('/reportante/history');
      }
    } else if (user?.role === 'encargado') {
      router.push('/encargado/history');
    } else if (user?.role === 'admin') {
      const reportId = notification.data?.report_id;
      router.push(reportId ? `/admin/avances?reportId=${reportId}` : '/admin/report');
    }
  };

  if (loading && !refreshing) {
    return (
      <SafeArea>
        <View style={notificationStyles.modernLoading}>
          <View style={notificationStyles.loadingCircle}>
            <ActivityIndicator size="large" color="#2563EB" />
          </View>
          <Text style={notificationStyles.modernLoadingText}>Cargando notificaciones...</Text>
        </View>
      </SafeArea>
    );
  }

  return (
    <SafeArea>
      <ModernToast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />

      <View style={notificationStyles.modernContainer}>
        {/* Header Ultra Moderno */}
        <View style={notificationStyles.modernHeader}>
          <View style={notificationStyles.headerTopRow}>
            <TouchableOpacity 
              style={notificationStyles.modernBackButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#1E293B" />
            </TouchableOpacity>

            <View style={notificationStyles.headerCenter}>
              <Text style={notificationStyles.modernHeaderTitle}>Notificaciones</Text>
              {unreadCount > 0 && (
                <View style={notificationStyles.headerBadge}>
                  <Text style={notificationStyles.headerBadgeText}>{unreadCount}</Text>
                </View>
              )}
            </View>

            <View style={notificationStyles.headerActions}>
              {notifications.length > 0 && (
                <>
                  <TouchableOpacity 
                    style={notificationStyles.modernActionButton}
                    onPress={markAllAsRead}
                  >
                    <Ionicons name="checkmark-done" size={20} color="#2563EB" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={notificationStyles.modernActionButton}
                    onPress={deleteAllNotifications}
                  >
                    <Ionicons name="trash" size={20} color="#EF4444" />
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>

          {/* Filtros Modernos con Glassmorphism */}
          <View style={notificationStyles.modernFilters}>
            <TouchableOpacity
              style={[
                notificationStyles.modernFilterButton,
                filter === 'todos' && notificationStyles.modernFilterActive,
              ]}
              onPress={() => setFilter('todos')}
            >
              <Ionicons 
                name="apps" 
                size={18} 
                color={filter === 'todos' ? '#FFF' : '#64748B'} 
              />
              <Text style={[
                notificationStyles.modernFilterText,
                filter === 'todos' && notificationStyles.modernFilterTextActive,
              ]}>
                Todos
              </Text>
              <View style={[
                notificationStyles.modernFilterBadge,
                filter === 'todos' && notificationStyles.modernFilterBadgeActive,
              ]}>
                <Text style={[
                  notificationStyles.modernFilterBadgeText,
                  filter === 'todos' && notificationStyles.modernFilterBadgeTextActive,
                ]}>
                  {notifications.length}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                notificationStyles.modernFilterButton,
                filter === 'no_leidos' && notificationStyles.modernFilterActive,
              ]}
              onPress={() => setFilter('no_leidos')}
            >
              <Ionicons 
                name="notifications" 
                size={18} 
                color={filter === 'no_leidos' ? '#FFF' : '#64748B'} 
              />
              <Text style={[
                notificationStyles.modernFilterText,
                filter === 'no_leidos' && notificationStyles.modernFilterTextActive,
              ]}>
                No leídas
              </Text>
              <View style={[
                notificationStyles.modernFilterBadge,
                filter === 'no_leidos' && notificationStyles.modernFilterBadgeActive,
              ]}>
                <Text style={[
                  notificationStyles.modernFilterBadgeText,
                  filter === 'no_leidos' && notificationStyles.modernFilterBadgeTextActive,
                ]}>
                  {unreadCount}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Contenido */}
        <ScrollView
          style={notificationStyles.modernScrollView}
          contentContainerStyle={notificationStyles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => setRefreshing(true)}
              colors={['#2563EB']}
              tintColor="#2563EB"
            />
          }
          showsVerticalScrollIndicator={false}
        >
          {filteredNotifications.length === 0 ? (
            <View style={notificationStyles.modernEmpty}>
              <View style={notificationStyles.emptyIconCircle}>
                <Ionicons name="notifications-off" size={48} color="#94A3B8" />
              </View>
              <Text style={notificationStyles.modernEmptyTitle}>
                {filter === 'no_leidos' ? '¡Todo al día!' : 'Sin notificaciones'}
              </Text>
              <Text style={notificationStyles.modernEmptySubtitle}>
                {filter === 'no_leidos'
                  ? 'Has leído todas tus notificaciones'
                  : 'Tus notificaciones aparecerán aquí'}
              </Text>
            </View>
          ) : (
            <View style={notificationStyles.modernList}>
              {filteredNotifications.map((notification, index) => (
                <AnimatedNotificationCard
                  key={notification.id}
                  notification={notification}
                  onPress={() => handleNotificationPress(notification)}
                  onDelete={() => deleteNotification(notification.id)}
                  index={index}
                />
              ))}
            </View>
          )}
        </ScrollView>

        {/* Footer Moderno */}
        {notifications.length > 0 && (
          <View style={notificationStyles.modernFooter}>
            <View style={notificationStyles.footerIndicator}>
              <View style={[
                notificationStyles.footerDot,
                { backgroundColor: unreadCount > 0 ? '#10B981' : '#94A3B8' }
              ]} />
              <Text style={notificationStyles.modernFooterText}>
                {unreadCount > 0 
                  ? `${unreadCount} sin leer` 
                  : 'Todo leído'}
              </Text>
            </View>
          </View>
        )}
      </View>
    </SafeArea>
  );
}