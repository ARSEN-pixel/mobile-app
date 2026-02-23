// SpendWise Premium - Category Icon Component

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BorderRadius } from '../constants/theme';

interface CategoryIconProps {
  icon: string;
  color: string;
  size?: 'small' | 'medium' | 'large';
}

export function CategoryIcon({ icon, color, size = 'medium' }: CategoryIconProps) {
  const getSize = () => {
    switch (size) {
      case 'small': return { container: 32, icon: 16 };
      case 'medium': return { container: 44, icon: 22 };
      case 'large': return { container: 56, icon: 28 };
      default: return { container: 44, icon: 22 };
    }
  };
  
  const sizes = getSize();
  
  return (
    <View 
      style={[
        styles.container, 
        { 
          backgroundColor: color + '20', 
          width: sizes.container, 
          height: sizes.container,
          borderRadius: sizes.container / 2,
        }
      ]}
    >
      <Ionicons 
        name={icon as keyof typeof Ionicons.glyphMap} 
        size={sizes.icon} 
        color={color} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
