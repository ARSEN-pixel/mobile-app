/**
 * SpendWise Premium - Feedback Components
 * 
 * Toast, Snackbar, Banner, Empty State, Skeleton.
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDesignSystem } from '../hooks/useDesignSystem';
import { Spacing, Radius, Typography, Duration, Elevation } from '../tokens';
import { DSButton } from './DSButton';

// ============================================
// EMPTY STATE
// ============================================
interface DSEmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  action?: {
    label: string;
    onPress: () => void;
  };
  style?: ViewStyle;
}

export function DSEmptyState({
  icon,
  title,
  description,
  action,
  style,
}: DSEmptyStateProps) {
  const { colors } = useDesignSystem();
  
  return (
    <View style={[styles.emptyState, style]}>
      <View style={[styles.emptyIconContainer, { backgroundColor: colors.primary.subtle }]}>
        <Ionicons name={icon} size={48} color={colors.primary.default} />
      </View>
      <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>{title}</Text>
      {description && (
        <Text style={[styles.emptyDescription, { color: colors.text.secondary }]}>
          {description}
        </Text>
      )}
      {action && (
        <DSButton
          title={action.label}
          onPress={action.onPress}
          variant="primary"
          style={styles.emptyButton}
        />
      )}
    </View>
  );
}

// ============================================
// SKELETON COMPONENTS
// ============================================
interface DSSkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function DSSkeleton({
  width = '100%',
  height = 16,
  borderRadius = Radius.sm,
  style,
}: DSSkeletonProps) {
  const { colors } = useDesignSystem();
  const opacity = useRef(new Animated.Value(0.3)).current;
  
  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: Duration.slow,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: Duration.slow,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);
  
  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: colors.border.primary,
          opacity,
        },
        style,
      ]}
    />
  );
}

export function DSSkeletonCard() {
  const { colors } = useDesignSystem();
  
  return (
    <View style={[styles.skeletonCard, { backgroundColor: colors.surface.primary }]}>
      <View style={styles.skeletonRow}>
        <DSSkeleton width={44} height={44} borderRadius={22} />
        <View style={styles.skeletonTextContainer}>
          <DSSkeleton width="60%" height={16} />
          <DSSkeleton width="40%" height={12} style={styles.skeletonMargin} />
        </View>
        <DSSkeleton width={80} height={18} />
      </View>
    </View>
  );
}

export function DSSkeletonList({ count = 5 }: { count?: number }) {
  return (
    <View style={styles.skeletonList}>
      {Array.from({ length: count }).map((_, index) => (
        <DSSkeletonCard key={index} />
      ))}
    </View>
  );
}

// ============================================
// BANNER
// ============================================
type BannerType = 'info' | 'success' | 'warning' | 'error';

interface DSBannerProps {
  type: BannerType;
  title: string;
  message?: string;
  action?: {
    label: string;
    onPress: () => void;
  };
  onDismiss?: () => void;
  style?: ViewStyle;
}

export function DSBanner({
  type,
  title,
  message,
  action,
  onDismiss,
  style,
}: DSBannerProps) {
  const { colors } = useDesignSystem();
  
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return { bg: colors.success.subtle, icon: 'checkmark-circle', color: colors.success.default };
      case 'warning':
        return { bg: colors.warning.subtle, icon: 'warning', color: colors.warning.default };
      case 'error':
        return { bg: colors.error.subtle, icon: 'close-circle', color: colors.error.default };
      default:
        return { bg: colors.info.subtle, icon: 'information-circle', color: colors.info.default };
    }
  };
  
  const typeStyles = getTypeStyles();
  
  return (
    <View style={[styles.banner, { backgroundColor: typeStyles.bg }, style]}>
      <Ionicons name={typeStyles.icon as any} size={24} color={typeStyles.color} />
      <View style={styles.bannerContent}>
        <Text style={[styles.bannerTitle, { color: colors.text.primary }]}>{title}</Text>
        {message && (
          <Text style={[styles.bannerMessage, { color: colors.text.secondary }]}>{message}</Text>
        )}
      </View>
      {action && (
        <TouchableOpacity onPress={action.onPress}>
          <Text style={[styles.bannerAction, { color: typeStyles.color }]}>{action.label}</Text>
        </TouchableOpacity>
      )}
      {onDismiss && (
        <TouchableOpacity onPress={onDismiss} style={styles.bannerDismiss}>
          <Ionicons name="close" size={20} color={colors.icon.secondary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

// ============================================
// TOAST (use with a toast provider)
// ============================================
interface DSToastProps {
  message: string;
  type?: 'default' | 'success' | 'error';
  action?: {
    label: string;
    onPress: () => void;
  };
  visible: boolean;
  onDismiss: () => void;
}

export function DSToast({
  message,
  type = 'default',
  action,
  visible,
  onDismiss,
}: DSToastProps) {
  const { colors } = useDesignSystem();
  const translateY = useRef(new Animated.Value(100)).current;
  
  useEffect(() => {
    Animated.spring(translateY, {
      toValue: visible ? 0 : 100,
      useNativeDriver: true,
      damping: 15,
      mass: 1,
    }).start();
    
    if (visible) {
      const timer = setTimeout(onDismiss, 4000);
      return () => clearTimeout(timer);
    }
  }, [visible]);
  
  const getIconColor = () => {
    switch (type) {
      case 'success': return colors.success.default;
      case 'error': return colors.error.default;
      default: return colors.icon.inverse;
    }
  };
  
  const getIcon = () => {
    switch (type) {
      case 'success': return 'checkmark-circle';
      case 'error': return 'close-circle';
      default: return null;
    }
  };
  
  const icon = getIcon();
  
  return (
    <Animated.View
      style={[
        styles.toast,
        {
          backgroundColor: colors.surface.inverse,
          transform: [{ translateY }],
          ...Elevation.lg,
          shadowColor: colors.shadow,
        },
      ]}
    >
      {icon && (
        <Ionicons name={icon as any} size={20} color={getIconColor()} style={styles.toastIcon} />
      )}
      <Text style={[styles.toastMessage, { color: colors.text.inverse }]}>{message}</Text>
      {action && (
        <TouchableOpacity onPress={action.onPress}>
          <Text style={[styles.toastAction, { color: colors.primary.light }]}>{action.label}</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // Empty State
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    ...Typography.title.md,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  emptyDescription: {
    ...Typography.body.md,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  emptyButton: {
    marginTop: Spacing.md,
  },
  // Skeleton
  skeletonCard: {
    padding: Spacing.md,
    marginVertical: Spacing.xxs,
    borderRadius: Radius.md,
  },
  skeletonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skeletonTextContainer: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  skeletonMargin: {
    marginTop: Spacing.xs,
  },
  skeletonList: {
    padding: Spacing.md,
  },
  // Banner
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radius.md,
  },
  bannerContent: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  bannerTitle: {
    ...Typography.label.md,
  },
  bannerMessage: {
    ...Typography.caption.md,
    marginTop: 2,
  },
  bannerAction: {
    ...Typography.label.sm,
    marginLeft: Spacing.sm,
  },
  bannerDismiss: {
    marginLeft: Spacing.sm,
    padding: Spacing.xxs,
  },
  // Toast
  toast: {
    position: 'absolute',
    bottom: Spacing.xl,
    left: Spacing.md,
    right: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radius.md,
  },
  toastIcon: {
    marginRight: Spacing.sm,
  },
  toastMessage: {
    ...Typography.body.md,
    flex: 1,
  },
  toastAction: {
    ...Typography.label.md,
    marginLeft: Spacing.sm,
  },
});
