/**
 * SpendWise Premium - Navigation Components
 * 
 * AppBar, TopBar, SegmentedControl.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDesignSystem } from '../hooks/useDesignSystem';
import { Spacing, Radius, Typography, Layout, Elevation, Border } from '../tokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ============================================
// APP BAR / TOP BAR
// ============================================
interface DSAppBarProps {
  title: string;
  subtitle?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  secondRightIcon?: keyof typeof Ionicons.glyphMap;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  onSecondRightPress?: () => void;
  showBorder?: boolean;
  transparent?: boolean;
  style?: ViewStyle;
}

export function DSAppBar({
  title,
  subtitle,
  leftIcon,
  rightIcon,
  secondRightIcon,
  onLeftPress,
  onRightPress,
  onSecondRightPress,
  showBorder = true,
  transparent = false,
  style,
}: DSAppBarProps) {
  const { colors, isDark } = useDesignSystem();
  const insets = useSafeAreaInsets();
  
  return (
    <View
      style={[
        styles.appBar,
        {
          backgroundColor: transparent ? 'transparent' : colors.surface.primary,
          borderBottomColor: colors.border.primary,
          borderBottomWidth: showBorder ? Border.hairline : 0,
          paddingTop: insets.top,
        },
        style,
      ]}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Left Section */}
      <View style={styles.appBarLeft}>
        {leftIcon && onLeftPress && (
          <TouchableOpacity
            onPress={onLeftPress}
            style={styles.appBarIconButton}
          >
            <Ionicons name={leftIcon} size={24} color={colors.icon.primary} />
          </TouchableOpacity>
        )}
      </View>
      
      {/* Center Section */}
      <View style={styles.appBarCenter}>
        <Text style={[styles.appBarTitle, { color: colors.text.primary }]} numberOfLines={1}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.appBarSubtitle, { color: colors.text.secondary }]} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>
      
      {/* Right Section */}
      <View style={styles.appBarRight}>
        {secondRightIcon && onSecondRightPress && (
          <TouchableOpacity
            onPress={onSecondRightPress}
            style={styles.appBarIconButton}
          >
            <Ionicons name={secondRightIcon} size={24} color={colors.icon.primary} />
          </TouchableOpacity>
        )}
        {rightIcon && onRightPress && (
          <TouchableOpacity
            onPress={onRightPress}
            style={styles.appBarIconButton}
          >
            <Ionicons name={rightIcon} size={24} color={colors.icon.primary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

// ============================================
// SEGMENTED CONTROL
// ============================================
interface Segment {
  key: string;
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

interface DSSegmentedControlProps {
  segments: Segment[];
  selectedKey: string;
  onChange: (key: string) => void;
  size?: 'sm' | 'md';
  fullWidth?: boolean;
  style?: ViewStyle;
}

export function DSSegmentedControl({
  segments,
  selectedKey,
  onChange,
  size = 'md',
  fullWidth = false,
  style,
}: DSSegmentedControlProps) {
  const { colors } = useDesignSystem();
  
  const isSmall = size === 'sm';
  
  return (
    <View
      style={[
        styles.segmentedControl,
        {
          backgroundColor: colors.background.secondary,
          padding: isSmall ? 2 : 3,
        },
        fullWidth && { alignSelf: 'stretch' },
        style,
      ]}
    >
      {segments.map((segment) => {
        const isSelected = segment.key === selectedKey;
        return (
          <TouchableOpacity
            key={segment.key}
            onPress={() => onChange(segment.key)}
            style={[
              styles.segment,
              {
                backgroundColor: isSelected ? colors.surface.primary : 'transparent',
                paddingVertical: isSmall ? Spacing.xs : Spacing.sm,
                paddingHorizontal: isSmall ? Spacing.sm : Spacing.md,
                ...isSelected ? { ...Elevation.xs, shadowColor: colors.shadow } : {},
              },
              fullWidth && { flex: 1 },
            ]}
          >
            {segment.icon && (
              <Ionicons
                name={segment.icon}
                size={isSmall ? 14 : 16}
                color={isSelected ? colors.primary.default : colors.text.secondary}
                style={styles.segmentIcon}
              />
            )}
            <Text
              style={[
                isSmall ? styles.segmentTextSm : styles.segmentText,
                { color: isSelected ? colors.primary.default : colors.text.secondary },
              ]}
            >
              {segment.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ============================================
// BOTTOM SHEET HANDLE
// ============================================
export function DSBottomSheetHandle() {
  const { colors } = useDesignSystem();
  
  return (
    <View style={styles.handleContainer}>
      <View style={[styles.handle, { backgroundColor: colors.border.primary }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  // App Bar
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: Layout.headerHeight,
    paddingHorizontal: Spacing.sm,
  },
  appBarLeft: {
    width: 56,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  appBarCenter: {
    flex: 1,
    alignItems: 'center',
  },
  appBarRight: {
    width: 56,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  appBarIconButton: {
    width: Layout.iconButtonSize,
    height: Layout.iconButtonSize,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Layout.iconButtonSize / 2,
  },
  appBarTitle: {
    ...Typography.title.sm,
  },
  appBarSubtitle: {
    ...Typography.caption.md,
    marginTop: 2,
  },
  // Segmented Control
  segmentedControl: {
    flexDirection: 'row',
    borderRadius: Radius.md,
    alignSelf: 'flex-start',
  },
  segment: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.sm,
  },
  segmentIcon: {
    marginRight: Spacing.xxs,
  },
  segmentText: {
    ...Typography.label.md,
  },
  segmentTextSm: {
    ...Typography.label.sm,
  },
  // Bottom Sheet Handle
  handleContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
  },
});
