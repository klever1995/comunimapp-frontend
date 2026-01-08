// app/admin/users.tsx - VERSIÓN CON TIEMPO REAL
import { userStyles } from '@/app/styles/admin/userStyles';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { router } from 'expo-router';
import { collection, onSnapshot, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
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

export default function AdminUsersScreen() {
  const { authState: { user, token } } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<string>('todos');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showActionsModal, setShowActionsModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Cargar usuarios en tiempo real con Firestore
  useEffect(() => {
    if (!user?.id) {
      setUsers([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    
    // Obtener usuarios en tiempo real con Firestore
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
          is_active: data.is_active !== false, // default true
          is_verified: data.is_verified || false,
          created_at: data.created_at,
          organization: data.organization,
          phone: data.phone,
          zone: data.zone,
        });
      });
      
      // Ordenar por fecha de creación (más recientes primero)
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

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...users];
    if (selectedRole !== 'todos') {
      filtered = filtered.filter(user => user.role === selectedRole);
    }
    setFilteredUsers(filtered);
  }, [users, selectedRole]);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return '#2563EB'; // Azul institucional
      case 'encargado': return '#F97316'; // Naranja alertas
      case 'reportante': return '#10B981'; // Verde para reportantes
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
    
    // No permitir desactivarse a sí mismo
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
        // No necesitamos fetchUsers() porque onSnapshot actualizará automáticamente
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
    // No permitir eliminarse a sí mismo
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
    <ScrollView 
      contentContainerStyle={userStyles.scrollContent}
      style={userStyles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={userStyles.header}>
        <View style={userStyles.headerTitleContainer}>
          <Text style={userStyles.title}>Gestión de Usuarios</Text>
        </View>
        <Text style={userStyles.subtitle}>
          Administra todos los usuarios del sistema (tiempo real)
        </Text>
      </View>

      {/* Filtros y Contador */}
      <View style={userStyles.topBar}>
        <View style={userStyles.filtersContainer}>
          <TouchableOpacity 
            style={userStyles.filterButton}
            onPress={() => {
              Alert.alert(
                'Filtrar por rol',
                '',
                [
                  { text: 'Todos', onPress: () => setSelectedRole('todos') },
                  { text: 'Administradores', onPress: () => setSelectedRole('admin') },
                  { text: 'Encargados', onPress: () => setSelectedRole('encargado') },
                  { text: 'Reportantes', onPress: () => setSelectedRole('reportante') },
                  { text: 'Cancelar', style: 'cancel' }
                ]
              );
            }}
          >
            <Image 
              source={require('@/assets/images/filtrar.png')}
              style={userStyles.filterIcon}
            />
            <Text style={userStyles.filterButtonText}>
              {selectedRole === 'todos' ? 'Rol' : getRoleText(selectedRole)}
            </Text>
          </TouchableOpacity>

          {/* Botón informativo de tiempo real */}
          <TouchableOpacity 
            style={[userStyles.filterButton]}
            onPress={() => {
              Alert.alert('Información', 'Los usuarios se actualizan automáticamente en tiempo real');
            }}
          >
            <Image 
              source={require('@/assets/images/nombre.png')}
              style={userStyles.filterIcon}
            />
            <Text style={userStyles.filterButtonText}>
              Tiempo real
            </Text>
          </TouchableOpacity>
        </View>

        <View style={userStyles.counterContainer}>
          <Text style={userStyles.counterText}>
            {filteredUsers.length} de {users.length} usuarios
          </Text>
        </View>
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

                {/* Botones de acción - SOLO ACTIVAR/DESACTIVAR Y ELIMINAR */}
                <View style={userStyles.actionsContainer}>
                  {/* Botón: Desactivar/Activar - COLOR TOMATE */}
                  <TouchableOpacity
                    style={[userStyles.actionButton, { 
                      backgroundColor: '#F97316', // Color tomate
                      opacity: isCurrentUser ? 0.5 : 1,
                      flex: 1,
                      marginRight: 5
                    }]}
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

                  {/* Botón: Eliminar - COLOR ROJO */}
                  <TouchableOpacity
                    style={[userStyles.actionButton, { 
                      backgroundColor: '#DC2626', // Rojo
                      opacity: isCurrentUser ? 0.5 : 1,
                      flex: 1,
                      marginLeft: 5
                    }]}
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
  );
}