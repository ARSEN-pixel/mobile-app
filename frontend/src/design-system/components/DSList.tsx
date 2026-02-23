/**
 * SpendWise Premium - List Components
 * 
 * Transaction row, swipeable list item, section headers.
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
import { Spacing, Radius, Typography, Layout, Border } from '../tokens';
import { DSCategoryIcon } from './DSChip';
import * as Haptics from 'expo-haptics';

// ============================================
// SECTION HEADER
// ============================================
interface DSSectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onPress: () => void;
  };
  style?: ViewStyle;
}

export function DSSectionHeader({
  title,
  subtitle,
  action,
  style,
}: DSSectionHeaderProps) {
  const { colors } = useDesignSystem();
  
  return (
    <View style={[styles.sectionHeader, { backgroundColor: colors.background.primary }, style]}>
      <View>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.sectionSubtitle, { color: colors.text.secondary }]}>{subtitle}</Text>
        )}
      </View>
      {action && (
        <TouchableOpacity onPress={action.onPress}>
          <Text style={[styles.sectionAction, { color: colors.primary.default }]}>
            {action.label}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ============================================
// TRANSACTION ROW
// ============================================
interface DSTransactionRowProps {
  title: string;
  amount: number;
  category: {
    name: string;
    icon: string;
    color: string;
  };
  date?: string;
  paymentMethod?: string;
  onPress?: () => void;
  onLongPress?: () => void;
  selected?: boolean;
  showCheckbox?: boolean;
  style?: ViewStyle;
}

export function DSTransactionRow({
  title,
  amount,
  category,
  date,
  paymentMethod,
  onPress,
  onLongPress,
  selected = false,
  showCheckbox = false,
  style,
}: DSTransactionRowProps) {
  const { colors } = useDesignSystem();
  
  const formatCurrency = (value: number) => {
    return `${value.toLocaleString('ro-RO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} RON`;
  };
  
  const handlePress = () => {
    onPress?.();
  };
  
  const handleLongPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onLongPress?.();
  };
  
  return (
    <TouchableOpacity
      onPress={handlePress}
      onLongPress={handleLongPress}
      activeOpacity={0.7}
      style={[
        styles.transactionRow,
        {
          backgroundColor: selected ? colors.interactive.selected : colors.surface.primary,
        },
        style,
      ]}
    >
      {showCheckbox && (
        <View
          style={[
            styles.checkbox,
            {
              borderColor: selected ? colors.primary.default : colors.border.primary,
              backgroundColor: selected ? colors.primary.default : 'transparent',
            },
          ]}
        >
          {selected && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
        </View>
      )}
      
      <DSCategoryIcon icon={category.icon} color={category.color} size="md" />
      
      <View style={styles.transactionContent}>
        <Text style={[styles.transactionTitle, { color: colors.text.primary }]} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.transactionMeta}>
          <Text style={[styles.transactionCategory, { color: colors.text.secondary }]}>
            {category.name}
          </Text>
          {date && (
            <>
              <Text style={[styles.metaDot, { color: colors.text.tertiary }]}> • </Text>
              <Text style={[styles.transactionDate, { color: colors.text.tertiary }]}>{date}</Text>
            </>
          )}
          {paymentMethod && (
            <>
              <Text style={[styles.metaDot, { color: colors.text.tertiary }]}> • </Text>
              <Text style={[styles.transactionMethod, { color: colors.text.tertiary }]}>
                {paymentMethod}
              </Text>
            </>
          )}
        </View>
      </View>
      
      <Text style={[styles.transactionAmount, { color: colors.text.primary }]}>
        -{formatCurrency(amount)}
      </Text>
    </TouchableOpacity>
  );
}

// ============================================
// LIST ITEM (Settings style)
// ============================================
interface DSListItemProps {
  title: string;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  showChevron?: boolean;
  destructive?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export function DSListItem({
  title,
  subtitle,
  icon,
  iconColor,
  onPress,
  rightElement,
  showChevron = true,
  destructive = false,
  disabled = false,
  style,
}: DSListItemProps) {
  const { colors } = useDesignSystem();
  
  const textColor = destructive ? colors.error.default : colors.text.primary;
  const finalIconColor = iconColor || (destructive ? colors.error.default : colors.primary.default);
  
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || !onPress}
      activeOpacity={0.7}
      style={[
        styles.listItem,
        { backgroundColor: colors.surface.primary },
        disabled && { opacity: 0.5 },
        style,
      ]}
    >
      {icon && (
        <View style={[styles.listItemIcon, { backgroundColor: finalIconColor + '15' }]}>
          <Ionicons name={icon} size={20} color={finalIconColor} />
        </View>
      )}
      
      <View style={styles.listItemContent}>
        <Text style={[styles.listItemTitle, { color: textColor }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.listItemSubtitle, { color: colors.text.secondary }]}>
            {subtitle}
          </Text>
        )}
      </View>
      
      {rightElement || (onPress && showChevron && (
        <Ionicons name="chevron-forward" size={20} color={colors.icon.tertiary} />
      ))}
    </TouchableOpacity>
  );
}

// ============================================
// DATE HEADER (for grouped lists)
// ============================================
interface DSDateHeaderProps {
  label: string;
  total?: number;
  currency?: string;
  style?: ViewStyle;
}

export function DSDateHeader({ label, total, currency = 'RON', style }: DSDateHeaderProps) {
  const { colors } = useDesignSystem();
  
  const formatCurrency = (value: number) => {
    return `${value.toLocaleString('ro-RO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;
  };
  
  return (
    <View style={[styles.dateHeader, { backgroundColor: colors.background.primary }, style]}>
      <Text style={[styles.dateLabel, { color: colors.text.primary }]}>{label}</Text>
      {total !== undefined && (
        <Text style={[styles.dateTotal, { color: colors.text.secondary }]}>
          -{formatCurrency(total)}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  sectionTitle: {
    ...Typography.title.sm,
  },
  sectionSubtitle: {
    ...Typography.caption.md,
    marginTop: 2,
  },
  sectionAction: {
    ...Typography.label.md,
  },
  // Transaction Row
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minHeight: Layout.listItemHeight,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  transactionContent: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  transactionTitle: {
    ...Typography.body.md,
    fontWeight: '500',
  },
  transactionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  transactionCategory: {
    ...Typography.caption.md,
  },
  metaDot: {
    ...Typography.caption.md,
  },
  transactionDate: {
    ...Typography.caption.md,
  },
  transactionMethod: {
    ...Typography.caption.md,
  },
  transactionAmount: {
    ...Typography.body.md,
    fontWeight: '600',
  },
  // List Item
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minHeight: Layout.listItemCompactHeight,
  },
  listItemIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listItemContent: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  listItemTitle: {
    ...Typography.body.md,
    fontWeight: '500',
  },
  listItemSubtitle: {
    ...Typography.caption.md,
    marginTop: 2,
  },
  // Date Header
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  dateLabel: {
    ...Typography.label.sm,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  dateTotal: {
    ...Typography.label.sm,
  },
});
