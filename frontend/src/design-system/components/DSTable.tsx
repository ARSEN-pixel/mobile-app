/**
 * SpendWise Premium - Table Components
 * 
 * Spreadsheet-style tables for expenses and category breakdowns.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDesignSystem } from '../hooks/useDesignSystem';
import { Spacing, Radius, Typography, Border } from '../tokens';
import { DSCategoryIcon } from './DSChip';

// ============================================
// TABLE HEADER
// ============================================
interface Column {
  key: string;
  label: string;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
}

interface DSTableProps {
  columns: Column[];
  data: any[];
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  renderCell?: (key: string, value: any, row: any) => React.ReactNode;
  onRowPress?: (row: any) => void;
  style?: ViewStyle;
}

export function DSTable({
  columns,
  data,
  sortKey,
  sortDirection,
  onSort,
  renderCell,
  onRowPress,
  style,
}: DSTableProps) {
  const { colors } = useDesignSystem();
  
  const getAlignStyle = (align?: string) => {
    switch (align) {
      case 'center': return { textAlign: 'center' as const };
      case 'right': return { textAlign: 'right' as const };
      default: return { textAlign: 'left' as const };
    }
  };
  
  return (
    <View style={[styles.tableContainer, style]}>
      {/* Header */}
      <View style={[styles.tableHeader, { borderBottomColor: colors.border.primary }]}>
        {columns.map((column) => (
          <TouchableOpacity
            key={column.key}
            onPress={() => column.sortable && onSort?.(column.key)}
            disabled={!column.sortable}
            style={[
              styles.tableHeaderCell,
              { width: column.width || 'auto', flex: column.width ? 0 : 1 },
            ]}
          >
            <Text
              style={[
                styles.tableHeaderText,
                { color: colors.text.secondary },
                getAlignStyle(column.align),
              ]}
            >
              {column.label}
            </Text>
            {column.sortable && sortKey === column.key && (
              <Ionicons
                name={sortDirection === 'asc' ? 'arrow-up' : 'arrow-down'}
                size={12}
                color={colors.primary.default}
                style={styles.sortIcon}
              />
            )}
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Body */}
      <ScrollView style={styles.tableBody}>
        {data.map((row, rowIndex) => (
          <TouchableOpacity
            key={rowIndex}
            onPress={() => onRowPress?.(row)}
            disabled={!onRowPress}
            activeOpacity={0.7}
            style={[
              styles.tableRow,
              {
                backgroundColor: rowIndex % 2 === 0 
                  ? colors.surface.primary 
                  : colors.background.secondary,
                borderBottomColor: colors.border.secondary,
              },
            ]}
          >
            {columns.map((column) => (
              <View
                key={column.key}
                style={[
                  styles.tableCell,
                  { width: column.width || 'auto', flex: column.width ? 0 : 1 },
                ]}
              >
                {renderCell ? (
                  renderCell(column.key, row[column.key], row)
                ) : (
                  <Text
                    style={[
                      styles.tableCellText,
                      { color: colors.text.primary },
                      getAlignStyle(column.align),
                    ]}
                    numberOfLines={1}
                  >
                    {row[column.key]}
                  </Text>
                )}
              </View>
            ))}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

// ============================================
// CATEGORY BREAKDOWN TABLE
// ============================================
interface CategoryBreakdownRow {
  category: {
    name: string;
    icon: string;
    color: string;
  };
  amount: number;
  percentage: number;
}

interface DSCategoryTableProps {
  data: CategoryBreakdownRow[];
  currency?: string;
  onRowPress?: (row: CategoryBreakdownRow) => void;
  style?: ViewStyle;
}

export function DSCategoryTable({
  data,
  currency = 'RON',
  onRowPress,
  style,
}: DSCategoryTableProps) {
  const { colors } = useDesignSystem();
  const [sortKey, setSortKey] = useState<'amount' | 'percentage'>('amount');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  
  const handleSort = (key: 'amount' | 'percentage') => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };
  
  const sortedData = [...data].sort((a, b) => {
    const multiplier = sortDir === 'asc' ? 1 : -1;
    return (a[sortKey] - b[sortKey]) * multiplier;
  });
  
  const formatCurrency = (value: number) => {
    return `${value.toLocaleString('ro-RO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;
  };
  
  return (
    <View style={[styles.categoryTable, style]}>
      {/* Header */}
      <View style={[styles.categoryTableHeader, { borderBottomColor: colors.border.primary }]}>
        <Text style={[styles.categoryTableHeaderText, { color: colors.text.secondary, flex: 2 }]}>
          Categorie
        </Text>
        <TouchableOpacity
          onPress={() => handleSort('amount')}
          style={styles.sortableHeader}
        >
          <Text style={[styles.categoryTableHeaderText, { color: colors.text.secondary }]}>
            Sumă
          </Text>
          {sortKey === 'amount' && (
            <Ionicons
              name={sortDir === 'asc' ? 'arrow-up' : 'arrow-down'}
              size={12}
              color={colors.primary.default}
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleSort('percentage')}
          style={styles.sortableHeader}
        >
          <Text style={[styles.categoryTableHeaderText, { color: colors.text.secondary }]}>
            %
          </Text>
          {sortKey === 'percentage' && (
            <Ionicons
              name={sortDir === 'asc' ? 'arrow-up' : 'arrow-down'}
              size={12}
              color={colors.primary.default}
            />
          )}
        </TouchableOpacity>
      </View>
      
      {/* Rows */}
      {sortedData.map((row, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => onRowPress?.(row)}
          disabled={!onRowPress}
          activeOpacity={0.7}
          style={[
            styles.categoryTableRow,
            {
              borderBottomColor: colors.border.secondary,
              borderBottomWidth: index !== sortedData.length - 1 ? Border.hairline : 0,
            },
          ]}
        >
          <View style={styles.categoryTableCell}>
            <DSCategoryIcon icon={row.category.icon} color={row.category.color} size="sm" />
            <Text
              style={[styles.categoryTableCellText, { color: colors.text.primary }]}
              numberOfLines={1}
            >
              {row.category.name}
            </Text>
          </View>
          <Text
            style={[
              styles.categoryTableCellText,
              styles.amountCell,
              { color: colors.text.primary },
            ]}
          >
            {formatCurrency(row.amount)}
          </Text>
          <Text
            style={[
              styles.categoryTableCellText,
              styles.percentCell,
              { color: colors.text.secondary },
            ]}
          >
            {row.percentage.toFixed(1)}%
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  // Generic Table
  tableContainer: {
    borderRadius: Radius.md,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: Border.thin,
  },
  tableHeaderCell: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tableHeaderText: {
    ...Typography.label.sm,
    fontWeight: '600',
  },
  sortIcon: {
    marginLeft: Spacing.xxs,
  },
  tableBody: {
    maxHeight: 400,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: Border.hairline,
  },
  tableCell: {
    justifyContent: 'center',
  },
  tableCellText: {
    ...Typography.body.sm,
  },
  // Category Table
  categoryTable: {
    borderRadius: Radius.md,
  },
  categoryTableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: Border.thin,
  },
  categoryTableHeaderText: {
    ...Typography.label.sm,
    fontWeight: '600',
  },
  sortableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
    gap: Spacing.xxs,
  },
  categoryTableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  categoryTableCell: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  categoryTableCellText: {
    ...Typography.body.sm,
  },
  amountCell: {
    flex: 1,
    textAlign: 'right',
    fontWeight: '500',
  },
  percentCell: {
    flex: 1,
    textAlign: 'right',
  },
});
