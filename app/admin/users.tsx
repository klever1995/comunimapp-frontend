// app/admin/users.tsx - CON FILTRO DE FECHA EN LUGAR DE "TIEMPO REAL"
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { userStyles } from '@/styles/admin/userStyles';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { collection, onSnapshot, query } from 'firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'encargado' | 'reportante';
  is_active: boolean;
  is_verified: boolean;
  created_at: any; // Firestore timestamp
  organization?: string;
  phone?: string;
  zone?: string;
}

type UserRole = 'admin' | 'encargado' | 'reportante';

// NUEVO: Tipo para opciones de filtro por rol
type FilterOption = {
  label: string;
  value: string;
};

// AÑADIDO: Tipo para opciones de fecha
type DateFilterOption = {
  label: string;
  value: string | null;
};

export default function AdminUsersScreen() {
  const { authState: { user, token } } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<string>('todos');
  const [selectedDateOption, setSelectedDateOption] = useState<string>('todos'); // AÑADIDO: Estado para fecha
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showActionsModal, setShowActionsModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showRoleFilterModal, setShowRoleFilterModal] = useState(false);
  const [showDateFilterModal, setShowDateFilterModal] = useState(false); // AÑADIDO: Modal para fecha

  // NUEVO: Opciones de filtro por rol
  const roleOptions: FilterOption[] = [
    { label: 'Todos', value: 'todos' },
    { label: 'Administradores', value: 'admin' },
    { label: 'Encargados', value: 'encargado' },
    { label: 'Reportantes', value: 'reportante' },
  ];

  // AÑADIDO: Opciones de filtro de fecha (igual que en reportes)
  const dateOptions: DateFilterOption[] = [
    { label: 'Todos', value: 'todos' },
    { label: 'Hoy', value: 'hoy' },
    { label: 'Ayer', value: 'ayer' },
    { label: 'Última semana', value: 'semana' },
    { label: 'Este mes', value: 'mes' },
  ];

  // AÑADIDO: Función para obtener rango de fechas
  const getDateRange = (option: string) => {
    const now = new Date();
    const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    switch (option) {
      case 'hoy': {
        const start = startOfDay(now);
        const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
        return { start, end };
      }
      case 'ayer': {
        const start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const startOfYesterday = startOfDay(start);
        const end = new Date(startOfYesterday.getTime() + 24 * 60 * 60 * 1000);
        return { start: startOfYesterday, end };
      }
      case 'semana': {
        const start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return { start, end: now };
      }
      case 'mes': {
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        return { start, end: now };
      }
      default:
        return null;
    }
  };

  // Calcular conteos por rol para las stats cards - NUEVO
  const roleCounts = {
    admin: users.filter(u => u.role === 'admin').length,
    encargado: users.filter(u => u.role === 'encargado').length,
    reportante: users.filter(u => u.role === 'reportante').length,
  };

  // Cargar usuarios en tiempo real con Firestore
  useEffect(() => {
    if (!user?.id) {
      setUsers([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    
    const q = query(collection(db, 'users'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const usersData: User[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        usersData.push({
          id: doc.id,
          username: data.username || '',
          email: data.email || '',
          role: data.role || 'reportante',
          is_active: data.is_active !== false,
          is_verified: data.is_verified || false,
          created_at: data.created_at,
          organization: data.organization,
          phone: data.phone,
          zone: data.zone,
        });
      });
      
      usersData.sort((a, b) => {
        const dateA = a.created_at?.toDate?.() || new Date(0);
        const dateB = b.created_at?.toDate?.() || new Date(0);
        return dateB.getTime() - dateA.getTime();
      });
      
      setUsers(usersData);
      setLoading(false);
    }, (error) => {
      console.error('Error escuchando usuarios:', error);
      Alert.alert('Error', 'No se pudieron cargar los usuarios');
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [user?.id]);

  // Aplicar filtros - MEJORADO CON FILTRO DE FECHA
  const applyFilters = useCallback(() => {
    let filtered = [...users];
    
    // Filtro por rol
    if (selectedRole !== 'todos') {
      filtered = filtered.filter(user => user.role === selectedRole);
    }
    
    // AÑADIDO: Filtro por fecha
    if (selectedDateOption !== 'todos') {
      const dateRange = getDateRange(selectedDateOption);
      if (dateRange) {
        filtered = filtered.filter(user => {
          try {
            const userDate = user.created_at?.toDate?.() || new Date();
            return userDate >= dateRange.start && userDate <= dateRange.end;
          } catch {
            return false;
          }
        });
      }
    }
    
    setFilteredUsers(filtered);
  }, [users, selectedRole, selectedDateOption]); // AÑADIDO: selectedDateOption

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return '#2563EB';
      case 'encargado': return '#F97316';
      case 'reportante': return '#10B981';
      default: return '#64748b';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return require('@/assets/images/nombre.png');
      case 'encargado': return require('@/assets/images/nombre.png');
      case 'reportante': return require('@/assets/images/nombre.png');
      default: return require('@/assets/images/nombre.png');
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'encargado': return 'Encargado';
      case 'reportante': return 'Reportante';
      default: return role;
    }
  };

  const formatDate = (timestamp: any) => {
    try {
      const date = timestamp?.toDate?.() || new Date();
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return 'Fecha inválida';
    }
  };

  // Función para activar/desactivar usuario
  const handleToggleActive = async (userId: string, currentActive: boolean) => {
    if (!token || !userId) return;
    
    if (userId === user?.id) {
      Alert.alert('Acción no permitida', 'No puedes desactivar tu propia cuenta');
      return;
    }

    const newActiveState = !currentActive;
    setActionLoading(`toggle-${userId}`);
    
    try {
      const response = await fetch(`${API_URL}/users/${userId}/toggle-active?is_active=${newActiveState}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        Alert.alert('Éxito', `Usuario ${newActiveState ? 'activado' : 'desactivado'} correctamente`);
      } else {
        const error = await response.json();
        Alert.alert('Error', error.detail || `Error al ${newActiveState ? 'activar' : 'desactivar'} usuario`);
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'No se pudo cambiar el estado del usuario');
    } finally {
      setActionLoading(null);
    }
  };

  // Función para eliminar usuario
  const handleDeleteUser = (userId: string) => {
    if (userId === user?.id) {
      Alert.alert('Acción no permitida', 'No puedes eliminar tu propia cuenta');
      return;
    }

    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: async () => {
            setActionLoading(`delete-${userId}`);
            try {
              const response = await fetch(`${API_URL}/users/${userId}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${token}`,
                },
              });
              
              if (response.ok) {
                Alert.alert('Éxito', 'Usuario eliminado correctamente');
              } else {
                const error = await response.json();
                Alert.alert('Error', error.detail || 'Error al eliminar usuario');
              }
            } catch (error) {
              console.error('Error:', error);
              Alert.alert('Error', 'No se pudo eliminar el usuario');
            } finally {
              setActionLoading(null);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={userStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={userStyles.loadingText}>Cargando usuarios...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={userStyles.errorContainer}>
        <Text style={userStyles.errorText}>
          No estás autenticado. Por favor inicia sesión.
        </Text>
      </View>
    );
  }

  return (
    <View style={userStyles.container}>
      {/* Header con gradiente - NUEVO */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={userStyles.headerContainer}
      >
        <Text style={userStyles.headerTitle}>Gestión de Usuarios</Text>
        <Text style={userStyles.headerSubtitle}>
          Administra todos los usuarios del sistema 
        </Text>
      </LinearGradient>

      {/* 3 Cards de roles - NUEVO */}
      <View style={userStyles.statsContainer}>
        <View style={[userStyles.statCard, { borderColor: getRoleColor('admin') }]}>
          <Text style={[userStyles.statValue, { color: getRoleColor('admin') }]}>
            {roleCounts.admin}
          </Text>
          <Text style={[userStyles.statLabel, { color: getRoleColor('admin') }]}>Admin</Text>
        </View>
        
        <View style={[userStyles.statCard, { borderColor: getRoleColor('encargado') }]}>
          <Text style={[userStyles.statValue, { color: getRoleColor('encargado') }]}>
            {roleCounts.encargado}
          </Text>
          <Text style={[userStyles.statLabel, { color: getRoleColor('encargado') }]}>Encargado</Text>
        </View>
        
        <View style={[userStyles.statCard, { borderColor: getRoleColor('reportante') }]}>
          <Text style={[userStyles.statValue, { color: getRoleColor('reportante') }]}>
            {roleCounts.reportante}
          </Text>
          <Text style={[userStyles.statLabel, { color: getRoleColor('reportante') }]}>Reportante</Text>
        </View>
      </View>

      {/* Modal para filtro de rol - NUEVO */}
      <Modal
        visible={showRoleFilterModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRoleFilterModal(false)}
      >
        <TouchableOpacity 
          style={userStyles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowRoleFilterModal(false)}
        >
          <View style={userStyles.modalContent}>
            <Text style={userStyles.modalTitle}>Filtrar por rol</Text>
            {roleOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  userStyles.modalOption,
                  selectedRole === option.value && userStyles.modalOptionSelected
                ]}
                onPress={() => {
                  setSelectedRole(option.value);
                  setShowRoleFilterModal(false);
                }}
              >
                <Text style={[
                  userStyles.modalOptionText,
                  selectedRole === option.value && userStyles.modalOptionTextSelected
                ]}>
                  {option.label}
                </Text>
                {selectedRole === option.value && (
                  <Image
                    source={require('@/assets/images/check.png')}
                    style={userStyles.modalCheckIcon}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* AÑADIDO: Modal para filtro de fecha (igual que en reportes) */}
      <Modal
        visible={showDateFilterModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDateFilterModal(false)}
      >
        <TouchableOpacity 
          style={userStyles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowDateFilterModal(false)}
        >
          <View style={userStyles.modalContent}>
            <Text style={userStyles.modalTitle}>Filtrar por fecha</Text>
            {dateOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  userStyles.modalOption,
                  selectedDateOption === option.value && userStyles.modalOptionSelected
                ]}
                onPress={() => {
                  setSelectedDateOption(option.value || 'todos');
                  setShowDateFilterModal(false);
                }}
              >
                <Text style={[
                  userStyles.modalOptionText,
                  selectedDateOption === option.value && userStyles.modalOptionTextSelected
                ]}>
                  {option.label}
                </Text>
                {selectedDateOption === option.value && (
                  <Image
                    source={require('@/assets/images/check.png')}
                    style={userStyles.modalCheckIcon}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      <ScrollView 
        contentContainerStyle={userStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Filtros desplegables - MEJORADO CON FILTRO DE FECHA */}
        <View style={userStyles.filtersContainer}>
          <TouchableOpacity 
            style={userStyles.filterDropdown}
            onPress={() => setShowRoleFilterModal(true)}
          >
            <View style={userStyles.filterDropdownLeft}>
              <Image 
                source={require('@/assets/images/filtrar.png')}
                style={userStyles.filterIcon}
              />
              <Text style={userStyles.filterDropdownText}>
                {selectedRole === 'todos' ? 'Rol' : getRoleText(selectedRole)}
              </Text>
            </View>
            <Image 
              source={require('@/assets/images/nombre.png')}
              style={userStyles.filterArrowIcon}
            />
          </TouchableOpacity>

          {/* CAMBIO: "Tiempo real" cambiado a "Fecha" */}
          <TouchableOpacity 
            style={userStyles.filterDropdown}
            onPress={() => setShowDateFilterModal(true)}
          >
            <View style={userStyles.filterDropdownLeft}>
              <Image 
                source={require('@/assets/images/calendar.png')} 
                style={userStyles.filterIcon}
              />
              <Text style={userStyles.filterDropdownText}>
                {dateOptions.find(opt => opt.value === selectedDateOption)?.label || 'Fecha'}
              </Text>
            </View>
            <Image 
              source={require('@/assets/images/nombre.png')}
              style={userStyles.filterArrowIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Contador de resultados - MEJORADO */}
        <View style={userStyles.resultsCounter}>
          <Text style={userStyles.resultsCounterText}>
            {filteredUsers.length} {filteredUsers.length === 1 ? 'usuario' : 'usuarios'} 
            {' '}de {users.length} totales
          </Text>
        </View>

        {/* Botón Crear Usuario */}
        <TouchableOpacity 
          style={userStyles.createButton}
          onPress={() => router.push('/admin/create-user')}
        >
          <Image
            source={require('@/assets/images/agregar.png')}
            style={userStyles.createIcon}
          />
          <Text style={userStyles.createButtonText}>Crear Nuevo Usuario</Text>
        </TouchableOpacity>

        {/* Lista de Usuarios */}
        <View style={userStyles.userList}>
          {filteredUsers.length === 0 ? (
            <View style={userStyles.emptyContainer}>
              <Text style={userStyles.emptyText}>
                {users.length === 0 
                  ? 'No hay usuarios registrados en el sistema' 
                  : 'No hay usuarios con los filtros aplicados'}
              </Text>
            </View>
          ) : (
            filteredUsers.map((userItem) => {
              const isCurrentUser = userItem.id === user?.id;

              return (
                <View 
                  key={userItem.id} 
                  style={[
                    userStyles.userCard,
                    { borderLeftWidth: 5, borderLeftColor: getRoleColor(userItem.role) }
                  ]}
                >
                  {/* Encabezado con información básica */}
                  <View style={userStyles.userHeader}>
                    <View style={userStyles.userInfo}>
                      <Image
                        source={getRoleIcon(userItem.role)}
                        style={userStyles.roleIcon}
                      />
                      <View style={userStyles.userTextContainer}>
                        <Text style={userStyles.username}>
                          {userItem.username}
                          {isCurrentUser && (
                            <Text style={userStyles.youBadge}> (Tú)</Text>
                          )}
                        </Text>
                        <Text style={userStyles.email} numberOfLines={1}>
                          {userItem.email}
                        </Text>
                      </View>
                    </View>
                    
                    {/* Estado activo/inactivo */}
                    <View style={[
                      userStyles.statusBadge,
                      { backgroundColor: userItem.is_active ? '#10B981' : '#EF4444' }
                    ]}>
                      <Text style={userStyles.statusText}>
                        {userItem.is_active ? 'Activo' : 'Inactivo'}
                      </Text>
                    </View>
                  </View>

                  {/* Información adicional */}
                  <View style={userStyles.userDetails}>
                    <View style={userStyles.detailRow}>
                      <Text style={userStyles.detailLabel}>Rol:</Text>
                      <View style={[userStyles.roleBadge, { backgroundColor: getRoleColor(userItem.role) }]}>
                        <Text style={userStyles.roleBadgeText}>
                          {getRoleText(userItem.role)}
                        </Text>
                      </View>
                    </View>
                    
                    {userItem.organization && (
                      <View style={userStyles.detailRow}>
                        <Text style={userStyles.detailLabel}>Organización:</Text>
                        <Text style={userStyles.detailValue}>{userItem.organization}</Text>
                      </View>
                    )}
                    
                    <View style={userStyles.detailRow}>
                      <Text style={userStyles.detailLabel}>Registrado:</Text>
                      <Text style={userStyles.detailValue}>{formatDate(userItem.created_at)}</Text>
                    </View>
                    
                    <View style={userStyles.detailRow}>
                      <Text style={userStyles.detailLabel}>Verificado:</Text>
                      <Text style={[
                        userStyles.detailValue,
                        { color: userItem.is_verified ? '#10B981' : '#F97316' }
                      ]}>
                        {userItem.is_verified ? 'Sí' : 'No'}
                      </Text>
                    </View>
                  </View>

                  {/* Botones de acción */}
                  <View style={userStyles.actionsContainer}>
                    {/* Botón: Desactivar/Activar */}
                    <TouchableOpacity
                      style={[userStyles.actionButton, userStyles.toggleButton]}
                      onPress={() => handleToggleActive(userItem.id, userItem.is_active)}
                      disabled={isCurrentUser || actionLoading === `toggle-${userItem.id}`}
                    >
                      {actionLoading === `toggle-${userItem.id}` ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <>
                          <Image
                            source={userItem.is_active 
                              ? require('@/assets/images/anonimo.png')
                              : require('@/assets/images/nombre.png')
                            }
                            style={userStyles.actionIcon}
                          />
                          <Text style={userStyles.actionButtonText}>
                            {userItem.is_active ? 'Desactivar' : 'Activar'}
                          </Text>
                        </>
                      )}
                    </TouchableOpacity>

                    {/* Botón: Eliminar */}
                    <TouchableOpacity
                      style={[userStyles.actionButton, userStyles.deleteButton]}
                      onPress={() => handleDeleteUser(userItem.id)}
                      disabled={isCurrentUser || actionLoading === `delete-${userItem.id}`}
                    >
                      {actionLoading === `delete-${userItem.id}` ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <>
                          <Image
                            source={require('@/assets/images/borrar.png')}
                            style={userStyles.actionIcon}
                          />
                          <Text style={userStyles.actionButtonText}>Eliminar</Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
}