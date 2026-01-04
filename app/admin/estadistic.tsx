import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function AdminEstadisticScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Estadísticas</Text>
      <Text style={styles.text}>Pantalla de estadísticas (en construcción)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#64748b',
  },
});