/**
 * SpendWise Premium - Card Components
 * 
 * Premium card variants: flat, elevated, outline, KPI
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ViewStyle,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDesignSystem } from '../hooks/useDesignSystem';
import { Spacing, Radius, Elevation, Typography, Duration } from '../tokens';
import * as Haptics from 'expo-haptics';

// ============================================
// BASE CARD
// ============================================
export type CardVariant = 'flat' | 'elevated' | 'outline';

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  style?: ViewStyle;
  onPress?: () => void;
  disabled?: boolean;
  padding?: keyof typeof Spacing | number;
}

export function DSCard({
  children,
  variant = 'flat',
  style,
  onPress,
  disabled = false,
  padding = 'md',
}: CardProps) {
  const { colors } = useDesignSystem();
  const scaleValue = React.useRef(new Animated.Value(1)).current;
  
  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.98,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };
  
  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };
  
  const handlePress = () => {
    if (onPress && !disabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };
  
  const getBackgroundColor = () => {
    switch (variant) {
      case 'elevated': return colors.surface.elevated;
      case 'outline': return colors.surface.primary;
      default: return colors.surface.primary;
    }
  };
  
  const getElevation = () => {
    switch (variant) {
      case 'elevated': return { ...Elevation.md, shadowColor: colors.shadow };
      case 'outline': return Elevation.none;
      default: return { ...Elevation.sm, shadowColor: colors.shadow };
    }
  };
  
  const paddingValue = typeof padding === 'number' ? padding : Spacing[padding];
  
  const cardStyle: ViewStyle[] = [
    styles.card,
    {
      backgroundColor: getBackgroundColor(),
      padding: paddingValue,
      borderColor: variant === 'outline' ? colors.border.primary : 'transparent',
      borderWidth: variant === 'outline' ? 1 : 0,
    },
    getElevation(),
    disabled && { opacity: 0.5 },
    style,
  ];
  
  if (onPress) {
    return (
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
      >
        <Animated.View style={[cardStyle, { transform: [{ scale: scaleValue }] }]}>
          {children}
        </Animated.View>
      </Pressable>
    );
  }
  
  return <View style={cardStyle}>{children}</View>;
}

// ============================================
// KPI CARD
// ============================================
interface KPICardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };
  onPress?: () => void;
  style?: ViewStyle;
}

export function DSKPICard({
  title,
  value,
  subtitle,
  icon,
  iconColor,
  trend,
  onPress,
  style,
}: KPICardProps) {
  const { colors } = useDesignSystem();
  
  const getTrendColor = () => {
    if (!trend) return colors.text.tertiary;
    switch (trend.direction) {
      case 'up': return colors.error.default;
      case 'down': return colors.success.default;
      default: return colors.text.tertiary;
    }
  };
  
  const getTrendIcon = () => {
    if (!trend) return null;
    switch (trend.direction) {
      case 'up': return 'arrow-up';
      case 'down': return 'arrow-down';
      default: return 'remove';
    }
  };
  
  return (
    <DSCard variant="elevated" onPress={onPress} style={[styles.kpiCard, style]}>
      <View style={styles.kpiHeader}>
        {icon && (
          <View style={[styles.kpiIconContainer, { backgroundColor: (iconColor || colors.primary.default) + '15' }]}>
            <Ionicons name={icon} size={20} color={iconColor || colors.primary.default} />
          </View>
        )}
        {trend && (
          <View style={[styles.trendBadge, { backgroundColor: getTrendColor() + '15' }]}>
            <Ionicons name={getTrendIcon() as any} size={12} color={getTrendColor()} />
            <Text style={[styles.trendText, { color: getTrendColor() }]}>
              {Math.abs(trend.value).toFixed(1)}%
            </Text>
          </View>
        )}
      </View>
      <Text style={[styles.kpiValue, { color: colors.text.primary }]} numberOfLines={1}>
        {value}
      </Text>
      <Text style={[styles.kpiTitle, { color: colors.text.secondary }]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.kpiSubtitle, { color: colors.text.tertiary }]}>{subtitle}</Text>
      )}
    </DSCard>
  );
}

// ============================================
// CHART CARD
// ============================================
interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: {
    label: string;
    onPress: () => void;
  };
  legend?: React.ReactNode;
  style?: ViewStyle;
}

export function DSChartCard({
  title,
  subtitle,
  children,
  action,
  legend,
  style,
}: ChartCardProps) {
  const { colors } = useDesignSystem();
  
  return (
    <DSCard variant="flat" style={[styles.chartCard, style]}>
      <View style={styles.chartHeader}>
        <View>
          <Text style={[styles.chartTitle, { color: colors.text.primary }]}>{title}</Text>
          {subtitle && (
            <Text style={[styles.chartSubtitle, { color: colors.text.secondary }]}>{subtitle}</Text>
          )}
        </View>
        {action && (
          <Pressable onPress={action.onPress}>
            <Text style={[styles.chartAction, { color: colors.primary.default }]}>
              {action.label}
            </Text>
          </Pressable>
        )}
      </View>
      <View style={styles.chartContent}>
        {children}
      </View>
      {legend && (
        <View style={styles.chartLegend}>
          {legend}
        </View>
      )}
    </DSCard>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
  },
  // KPI Card
  kpiCard: {
    minWidth: 140,
  },
  kpiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  kpiIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: Radius.full,
    gap: 2,
  },
  trendText: {
    ...Typography.label.xs,
  },
  kpiValue: {
    ...Typography.title.md,
    marginBottom: 2,
  },
  kpiTitle: {
    ...Typography.label.sm,
  },
  kpiSubtitle: {
    ...Typography.caption.sm,
    marginTop: 2,
  },
  // Chart Card
  chartCard: {
    padding: Spacing.md,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  chartTitle: {
    ...Typography.title.sm,
  },
  chartSubtitle: {
    ...Typography.caption.md,
    marginTop: 2,
  },
  chartAction: {
    ...Typography.label.sm,
  },
  chartContent: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  chartLegend: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
  },
});
