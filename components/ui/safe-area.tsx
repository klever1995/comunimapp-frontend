import React, { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SafeAreaProps {
  children: ReactNode;
  style?: object;
}
export const SafeArea: React.FC<SafeAreaProps> = ({ children, style }) => {
  return (
    <SafeAreaView style={[styles.safeArea, style]} edges={['top', 'bottom']}>
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000ff', 
  },
});
