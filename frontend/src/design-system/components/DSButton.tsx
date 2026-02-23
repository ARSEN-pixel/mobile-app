/**
 * SpendWise Premium - Button Components
 * 
 * Primary, Secondary, Tertiary, Ghost, Danger buttons with icon support.
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  ViewStyle,
  TextStyle,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDesignSystem } from '../hooks/useDesignSystem';
import { Spacing, Radius, Typography, Duration, Layout } from '../tokens';
import * as Haptics from 'expo-haptics';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface DSButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function DSButton({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
}: DSButtonProps) {
  const { colors } = useDesignSystem();
  const scaleValue = React.useRef(new Animated.Value(1)).current;
  
  const handlePressIn = () => {
    Animated.timing(scaleValue, {
      toValue: 0.97,
      duration: Duration.fast,
      useNativeDriver: true,
    }).start();
  };
  
  const handlePressOut = () => {
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: Duration.fast,
      useNativeDriver: true,
    }).start();
  };
  
  const handlePress = () => {
    if (!disabled && !loading) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onPress();
    }
  };
  
  const getBackgroundColor = () => {
    if (disabled) return colors.border.primary;
    switch (variant) {
      case 'primary': return colors.primary.default;
      case 'secondary': return colors.surface.primary;
      case 'tertiary': return colors.primary.subtle;
      case 'ghost': return 'transparent';
      case 'danger': return colors.error.default;
      default: return colors.primary.default;
    }
  };
  
  const getTextColor = () => {
    if (disabled) return colors.text.disabled;
    switch (variant) {
      case 'primary': return colors.primary.text;
      case 'secondary': return colors.text.primary;
      case 'tertiary': return colors.primary.default;
      case 'ghost': return colors.primary.default;
      case 'danger': return '#FFFFFF';
      default: return colors.primary.text;
    }
  };
  
  const getBorderColor = () => {
    if (disabled) return 'transparent';
    if (variant === 'secondary') return colors.border.primary;
    return 'transparent';
  };
  
  const getSizeStyles = (): { container: ViewStyle; text: TextStyle; iconSize: number } => {
    switch (size) {
      case 'sm':
        return {
          container: { paddingVertical: Spacing.xs, paddingHorizontal: Spacing.sm, minHeight: 36 },
          text: { ...Typography.label.sm },
          iconSize: 16,
        };
      case 'lg':
        return {
          container: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl, minHeight: 52 },
          text: { ...Typography.label.lg },
          iconSize: 22,
        };
      default: // md
        return {
          container: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.lg, minHeight: 44 },
          text: { ...Typography.label.md },
          iconSize: 18,
        };
    }
  };
  
  const sizeStyles = getSizeStyles();
  const textColor = getTextColor();
  
  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <TouchableOpacity
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={1}
        style={[
          styles.button,
          sizeStyles.container,
          {
            backgroundColor: getBackgroundColor(),
            borderColor: getBorderColor(),
            borderWidth: variant === 'secondary' ? 1 : 0,
          },
          fullWidth && styles.fullWidth,
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator size="small" color={textColor} />
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <Ionicons
                name={icon}
                size={sizeStyles.iconSize}
                color={textColor}
                style={styles.iconLeft}
              />
            )}
            <Text style={[sizeStyles.text, { color: textColor }, textStyle]}>
              {title}
            </Text>
            {icon && iconPosition === 'right' && (
              <Ionicons
                name={icon}
                size={sizeStyles.iconSize}
                color={textColor}
                style={styles.iconRight}
              />
            )}
          </>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

// ============================================
// ICON BUTTON
// ============================================
interface DSIconButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  variant?: 'filled' | 'tonal' | 'outlined' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export function DSIconButton({
  icon,
  onPress,
  variant = 'ghost',
  size = 'md',
  color,
  disabled = false,
  loading = false,
  style,
}: DSIconButtonProps) {
  const { colors } = useDesignSystem();
  
  const handlePress = () => {
    if (!disabled && !loading) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };
  
  const getSize = () => {
    switch (size) {
      case 'sm': return { container: 32, icon: 18 };
      case 'lg': return { container: 52, icon: 26 };
      default: return { container: 44, icon: 22 };
    }
  };
  
  const getBackgroundColor = () => {
    if (disabled) return colors.border.secondary;
    switch (variant) {
      case 'filled': return colors.primary.default;
      case 'tonal': return colors.primary.subtle;
      case 'outlined': return 'transparent';
      default: return 'transparent';
    }
  };
  
  const getIconColor = () => {
    if (disabled) return colors.icon.disabled;
    if (color) return color;
    switch (variant) {
      case 'filled': return colors.primary.text;
      case 'tonal': return colors.primary.default;
      case 'outlined': return colors.icon.primary;
      default: return colors.icon.primary;
    }
  };
  
  const sizes = getSize();
  
  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        styles.iconButton,
        {
          width: sizes.container,
          height: sizes.container,
          borderRadius: sizes.container / 2,
          backgroundColor: getBackgroundColor(),
          borderColor: variant === 'outlined' ? colors.border.primary : 'transparent',
          borderWidth: variant === 'outlined' ? 1 : 0,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getIconColor()} />
      ) : (
        <Ionicons name={icon} size={sizes.icon} color={getIconColor()} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.md,
    minWidth: Layout.buttonMinWidth,
  },
  fullWidth: {
    width: '100%',
  },
  iconLeft: {
    marginRight: Spacing.xs,
  },
  iconRight: {
    marginLeft: Spacing.xs,
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
