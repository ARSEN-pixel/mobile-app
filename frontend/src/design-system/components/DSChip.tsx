/**
 * SpendWise Premium - Chip & Category Components
 * 
 * Category chips/cards, filter chips, selectable chips.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDesignSystem } from '../hooks/useDesignSystem';
import { Spacing, Radius, Typography, Elevation } from '../tokens';
import * as Haptics from 'expo-haptics';

// ============================================
// CATEGORY ICON
// ============================================
interface DSCategoryIconProps {
  icon: string;
  color: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function DSCategoryIcon({ icon, color, size = 'md' }: DSCategoryIconProps) {
  const getSizes = () => {
    switch (size) {
      case 'sm': return { container: 32, icon: 16 };
      case 'lg': return { container: 52, icon: 26 };
      case 'xl': return { container: 64, icon: 32 };
      default: return { container: 44, icon: 22 };
    }
  };
  
  const sizes = getSizes();
  
  return (
    <View
      style={[
        styles.categoryIcon,
        {
          width: sizes.container,
          height: sizes.container,
          borderRadius: sizes.container / 2,
          backgroundColor: color + '18',
        },
      ]}
    >
      <Ionicons name={icon as any} size={sizes.icon} color={color} />
    </View>
  );
}

// ============================================
// CATEGORY CHIP (Compact, for filters)
// ============================================
interface DSCategoryChipProps {
  name: string;
  icon: string;
  color: string;
  selected?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export function DSCategoryChip({
  name,
  icon,
  color,
  selected = false,
  onPress,
  style,
}: DSCategoryChipProps) {
  const { colors } = useDesignSystem();
  
  const handlePress = () => {
    Haptics.selectionAsync();
    onPress?.();
  };
  
  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={!onPress}
      activeOpacity={0.7}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? color + '20' : colors.surface.primary,
          borderColor: selected ? color : colors.border.primary,
        },
        style,
      ]}
    >
      <DSCategoryIcon icon={icon} color={color} size="sm" />
      <Text
        style={[
          styles.chipText,
          { color: selected ? color : colors.text.primary },
        ]}
        numberOfLines={1}
      >
        {name}
      </Text>
    </TouchableOpacity>
  );
}

// ============================================
// CATEGORY CARD (Larger, for selection)
// ============================================
interface DSCategoryCardProps {
  name: string;
  icon: string;
  color: string;
  selected?: boolean;
  favorite?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
  style?: ViewStyle;
}

export function DSCategoryCard({
  name,
  icon,
  color,
  selected = false,
  favorite = false,
  onPress,
  onLongPress,
  style,
}: DSCategoryCardProps) {
  const { colors } = useDesignSystem();
  
  const handlePress = () => {
    Haptics.selectionAsync();
    onPress?.();
  };
  
  return (
    <TouchableOpacity
      onPress={handlePress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
      style={[
        styles.categoryCard,
        {
          backgroundColor: selected ? color + '15' : colors.surface.primary,
          borderColor: selected ? color : 'transparent',
          ...Elevation.sm,
          shadowColor: colors.shadow,
        },
        style,
      ]}
    >
      {favorite && (
        <View style={[styles.favoriteBadge, { backgroundColor: colors.warning.default }]}>
          <Ionicons name="star" size={10} color="#FFFFFF" />
        </View>
      )}
      <DSCategoryIcon icon={icon} color={color} size="md" />
      <Text
        style={[
          styles.categoryCardText,
          { color: colors.text.primary },
        ]}
        numberOfLines={1}
      >
        {name}
      </Text>
      {selected && (
        <View style={[styles.checkmark, { backgroundColor: color }]}>
          <Ionicons name="checkmark" size={12} color="#FFFFFF" />
        </View>
      )}
    </TouchableOpacity>
  );
}

// ============================================
// FILTER CHIP
// ============================================
interface DSFilterChipProps {
  label: string;
  selected?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  onRemove?: () => void;
  style?: ViewStyle;
}

export function DSFilterChip({
  label,
  selected = false,
  icon,
  onPress,
  onRemove,
  style,
}: DSFilterChipProps) {
  const { colors } = useDesignSystem();
  
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.filterChip,
        {
          backgroundColor: selected ? colors.primary.subtle : colors.surface.primary,
          borderColor: selected ? colors.primary.default : colors.border.primary,
        },
        style,
      ]}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={16}
          color={selected ? colors.primary.default : colors.icon.secondary}
          style={styles.filterChipIcon}
        />
      )}
      <Text
        style={[
          styles.filterChipText,
          { color: selected ? colors.primary.default : colors.text.primary },
        ]}
      >
        {label}
      </Text>
      {onRemove && selected && (
        <TouchableOpacity onPress={onRemove} style={styles.filterChipRemove}>
          <Ionicons name="close-circle" size={18} color={colors.primary.default} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Category Icon
  categoryIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Category Chip
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    paddingLeft: Spacing.xxs,
    paddingRight: Spacing.sm,
    borderRadius: Radius.full,
    borderWidth: 1,
    gap: Spacing.xs,
  },
  chipText: {
    ...Typography.label.sm,
  },
  // Category Card
  categoryCard: {
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 2,
    minWidth: 80,
  },
  categoryCardText: {
    ...Typography.label.sm,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  favoriteBadge: {
    position: 'absolute',
    top: Spacing.xs,
    right: Spacing.xs,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    position: 'absolute',
    bottom: -8,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Filter Chip
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  filterChipIcon: {
    marginRight: Spacing.xxs,
  },
  filterChipText: {
    ...Typography.label.sm,
  },
  filterChipRemove: {
    marginLeft: Spacing.xxs,
  },
});
