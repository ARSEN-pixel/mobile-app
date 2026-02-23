// SpendWise Premium - Transactions Screen

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/hooks/useTheme';
import { useStore } from '../src/store/useStore';
import { Card } from '../src/components/Card';
import { Button } from '../src/components/Button';
import { CategoryIcon } from '../src/components/CategoryIcon';
import { EmptyState } from '../src/components/EmptyState';
import { t } from '../src/constants/translations';
import { Spacing, Typography, BorderRadius, PaymentMethods } from '../src/constants/theme';
import { format, parseISO, isToday, isYesterday, startOfDay } from 'date-fns';
import { ro } from 'date-fns/locale';
import axios from 'axios';
import * as Haptics from 'expo-haptics';
import type { Expense } from '../src/types';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || '';

interface GroupedExpense {
  type: 'header' | 'item';
  date?: string;
  dateLabel?: string;
  total?: number;
  expense?: Expense;
}

export default function TransactionsScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const { user, categories, expenses, setExpenses, deleteExpense } = useStore();
  
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedExpenses, setSelectedExpenses] = useState<Set<string>>(new Set());
  
  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString('ro-RO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} RON`;
  };
  
  const getCategoryById = (categoryId: string) => {
    return categories.find(c => c.id === categoryId);
  };
  
  const getDateLabel = (dateString: string) => {
    const date = parseISO(dateString);
    if (isToday(date)) return t.common.today;
    if (isYesterday(date)) return t.common.yesterday;
    return format(date, 'EEEE, d MMMM', { locale: ro });
  };
  
  // Filter and group expenses
  const groupedData = useMemo(() => {
    let filtered = [...expenses];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(e => 
        e.title.toLowerCase().includes(query) ||
        e.notes?.toLowerCase().includes(query) ||
        e.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(e => selectedCategories.includes(e.category_id));
    }
    
    // Apply payment method filter
    if (selectedMethods.length > 0) {
      filtered = filtered.filter(e => selectedMethods.includes(e.payment_method));
    }
    
    // Sort by date descending
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    // Group by date
    const groups: GroupedExpense[] = [];
    let currentDate = '';
    let currentDayTotal = 0;
    let headerIndex = -1;
    
    filtered.forEach((expense) => {
      const expenseDate = expense.date.substring(0, 10);
      
      if (expenseDate !== currentDate) {
        // Update previous header with total
        if (headerIndex >= 0) {
          groups[headerIndex].total = currentDayTotal;
        }
        
        currentDate = expenseDate;
        currentDayTotal = expense.amount;
        headerIndex = groups.length;
        
        groups.push({
          type: 'header',
          date: expenseDate,
          dateLabel: getDateLabel(expenseDate),
          total: 0,
        });
      } else {
        currentDayTotal += expense.amount;
      }
      
      groups.push({
        type: 'item',
        expense,
      });
    });
    
    // Update last header with total
    if (headerIndex >= 0) {
      groups[headerIndex].total = currentDayTotal;
    }
    
    return groups;
  }, [expenses, searchQuery, selectedCategories, selectedMethods]);
  
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/api/expenses?user_id=${user?.id}`);
      setExpenses(response.data);
    } catch (error) {
      console.error('Error refreshing:', error);
    }
    setRefreshing(false);
  }, [user?.id]);
  
  const toggleExpenseSelection = (expenseId: string) => {
    const newSelected = new Set(selectedExpenses);
    if (newSelected.has(expenseId)) {
      newSelected.delete(expenseId);
    } else {
      newSelected.add(expenseId);
    }
    setSelectedExpenses(newSelected);
    Haptics.selectionAsync();
  };
  
  const handleLongPress = (expenseId: string) => {
    if (!isSelectionMode) {
      setIsSelectionMode(true);
      setSelectedExpenses(new Set([expenseId]));
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };
  
  const cancelSelection = () => {
    setIsSelectionMode(false);
    setSelectedExpenses(new Set());
  };
  
  const selectAll = () => {
    const allIds = expenses.map(e => e.id);
    setSelectedExpenses(new Set(allIds));
    Haptics.selectionAsync();
  };
  
  const handleBulkDelete = () => {
    Alert.alert(
      t.transactions.deleteSelected,
      `Ștergi ${selectedExpenses.size} cheltuieli?`,
      [
        { text: t.common.cancel, style: 'cancel' },
        {
          text: t.common.delete,
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.post(`${BACKEND_URL}/api/expenses/bulk-delete`, {
                expense_ids: Array.from(selectedExpenses),
              });
              selectedExpenses.forEach(id => deleteExpense(id));
              cancelSelection();
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } catch (error) {
              console.error('Error bulk deleting:', error);
              Alert.alert('Eroare', 'Nu s-au putut șterge cheltuielile');
            }
          },
        },
      ]
    );
  };
  
  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedMethods([]);
    setShowFilters(false);
  };
  
  const renderItem = ({ item }: { item: GroupedExpense }) => {
    if (item.type === 'header') {
      return (
        <View style={[styles.dateHeader, { backgroundColor: colors.background }]}>
          <Text style={[styles.dateHeaderText, { color: colors.text }]}>
            {item.dateLabel}
          </Text>
          <Text style={[styles.dateHeaderTotal, { color: colors.textSecondary }]}>
            -{formatCurrency(item.total || 0)}
          </Text>
        </View>
      );
    }
    
    const expense = item.expense!;
    const category = getCategoryById(expense.category_id);
    const isSelected = selectedExpenses.has(expense.id);
    
    return (
      <TouchableOpacity
        style={[
          styles.expenseItem,
          { backgroundColor: colors.surface },
          isSelected && { backgroundColor: colors.primary + '15' },
        ]}
        onPress={() => {
          if (isSelectionMode) {
            toggleExpenseSelection(expense.id);
          } else {
            router.push({ pathname: '/add', params: { expenseId: expense.id } });
          }
        }}
        onLongPress={() => handleLongPress(expense.id)}
        activeOpacity={0.7}
      >
        {isSelectionMode && (
          <View style={[
            styles.checkbox,
            { borderColor: colors.border },
            isSelected && { backgroundColor: colors.primary, borderColor: colors.primary },
          ]}>
            {isSelected && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
          </View>
        )}
        
        <CategoryIcon 
          icon={category?.icon || 'help-circle'} 
          color={category?.color || colors.textTertiary} 
          size="medium" 
        />
        
        <View style={styles.expenseDetails}>
          <Text style={[styles.expenseTitle, { color: colors.text }]} numberOfLines={1}>
            {expense.title}
          </Text>
          <View style={styles.expenseMeta}>
            <Text style={[styles.expenseCategory, { color: colors.textSecondary }]}>
              {category?.name || 'Necunoscut'}
            </Text>
            {expense.payment_method && (
              <>
                <Text style={[styles.metaDot, { color: colors.textTertiary }]}> • </Text>
                <Text style={[styles.expenseMethod, { color: colors.textTertiary }]}>
                  {PaymentMethods.find(m => m.id === expense.payment_method)?.name}
                </Text>
              </>
            )}
          </View>
        </View>
        
        <Text style={[styles.expenseAmount, { color: colors.text }]}>
          -{formatCurrency(expense.amount)}
        </Text>
      </TouchableOpacity>
    );
  };
  
  const hasActiveFilters = selectedCategories.length > 0 || selectedMethods.length > 0;
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        {isSelectionMode ? (
          <>
            <TouchableOpacity onPress={cancelSelection} style={styles.headerButton}>
              <Text style={[styles.cancelText, { color: colors.primary }]}>
                {t.common.cancel}
              </Text>
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              {selectedExpenses.size} selectate
            </Text>
            <TouchableOpacity onPress={selectAll} style={styles.headerButton}>
              <Text style={[styles.selectAllText, { color: colors.primary }]}>
                {t.transactions.selectAll}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={[styles.screenTitle, { color: colors.text }]}>
              {t.transactions.title}
            </Text>
            <TouchableOpacity 
              onPress={() => setShowFilters(true)}
              style={[
                styles.filterButton,
                hasActiveFilters && { backgroundColor: colors.primary + '15' },
              ]}
            >
              <Ionicons 
                name="filter" 
                size={20} 
                color={hasActiveFilters ? colors.primary : colors.textSecondary} 
              />
              {hasActiveFilters && (
                <View style={[styles.filterBadge, { backgroundColor: colors.primary }]}>
                  <Text style={styles.filterBadgeText}>
                    {selectedCategories.length + selectedMethods.length}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </>
        )}
      </View>
      
      {/* Search Bar */}
      {!isSelectionMode && (
        <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
          <Ionicons name="search" size={20} color={colors.textTertiary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={t.transactions.search}
            placeholderTextColor={colors.textTertiary}
          />
          {searchQuery && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          )}
        </View>
      )}
      
      {/* Selection Actions */}
      {isSelectionMode && selectedExpenses.size > 0 && (
        <View style={[styles.selectionActions, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          <TouchableOpacity 
            style={styles.selectionAction}
            onPress={handleBulkDelete}
          >
            <Ionicons name="trash" size={22} color={colors.error} />
            <Text style={[styles.selectionActionText, { color: colors.error }]}>
              {t.common.delete}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* Transactions List */}
      {groupedData.length === 0 ? (
        <EmptyState
          icon="receipt-outline"
          title={searchQuery || hasActiveFilters ? t.transactions.noResults : t.dashboard.noTransactions}
          description={searchQuery || hasActiveFilters ? 'Încearcă să schimbi filtrele' : t.dashboard.addFirst}
          actionTitle={searchQuery || hasActiveFilters ? t.transactions.clearFilters : t.nav.add}
          onAction={() => {
            if (searchQuery || hasActiveFilters) {
              setSearchQuery('');
              clearFilters();
            } else {
              router.push('/add');
            }
          }}
        />
      ) : (
        <FlashList
          data={groupedData}
          renderItem={renderItem}
          estimatedItemSize={70}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
          }
          contentContainerStyle={styles.listContent}
          keyExtractor={(item, index) => 
            item.type === 'header' ? `header-${item.date}` : `item-${item.expense?.id || index}`
          }
          getItemType={(item) => item.type}
        />
      )}
      
      {/* Filter Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        transparent
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {t.transactions.filter}
              </Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.filterSection}>
              <Text style={[styles.filterSectionTitle, { color: colors.text }]}>
                {t.add.category}
              </Text>
              <View style={styles.filterChips}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.filterChip,
                      { borderColor: colors.border },
                      selectedCategories.includes(category.id) && {
                        backgroundColor: category.color + '20',
                        borderColor: category.color,
                      },
                    ]}
                    onPress={() => {
                      if (selectedCategories.includes(category.id)) {
                        setSelectedCategories(prev => prev.filter(id => id !== category.id));
                      } else {
                        setSelectedCategories(prev => [...prev, category.id]);
                      }
                      Haptics.selectionAsync();
                    }}
                  >
                    <CategoryIcon icon={category.icon} color={category.color} size="small" />
                    <Text style={[
                      styles.filterChipText,
                      { color: selectedCategories.includes(category.id) ? category.color : colors.text },
                    ]}>
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.filterSection}>
              <Text style={[styles.filterSectionTitle, { color: colors.text }]}>
                {t.add.paymentMethod}
              </Text>
              <View style={styles.filterChips}>
                {PaymentMethods.map((method) => (
                  <TouchableOpacity
                    key={method.id}
                    style={[
                      styles.filterChip,
                      { borderColor: colors.border },
                      selectedMethods.includes(method.id) && {
                        backgroundColor: colors.primary + '20',
                        borderColor: colors.primary,
                      },
                    ]}
                    onPress={() => {
                      if (selectedMethods.includes(method.id)) {
                        setSelectedMethods(prev => prev.filter(id => id !== method.id));
                      } else {
                        setSelectedMethods(prev => [...prev, method.id]);
                      }
                      Haptics.selectionAsync();
                    }}
                  >
                    <Ionicons 
                      name={method.icon as any} 
                      size={18} 
                      color={selectedMethods.includes(method.id) ? colors.primary : colors.textSecondary} 
                    />
                    <Text style={[
                      styles.filterChipText,
                      { color: selectedMethods.includes(method.id) ? colors.primary : colors.text },
                    ]}>
                      {method.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.filterActions}>
              <Button
                title={t.transactions.clearFilters}
                variant="outline"
                onPress={clearFilters}
                style={{ flex: 1, marginRight: Spacing.sm }}
              />
              <Button
                title={t.transactions.applyFilters}
                onPress={() => setShowFilters(false)}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  headerButton: {
    paddingHorizontal: Spacing.sm,
  },
  headerTitle: {
    ...Typography.headlineMedium,
  },
  cancelText: {
    ...Typography.bodyMedium,
    fontWeight: '500',
  },
  selectAllText: {
    ...Typography.bodyMedium,
    fontWeight: '500',
  },
  screenTitle: {
    ...Typography.displaySmall,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  searchInput: {
    flex: 1,
    marginLeft: Spacing.sm,
    ...Typography.bodyMedium,
  },
  selectionActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: Spacing.md,
    borderTopWidth: 1,
  },
  selectionAction: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  selectionActionText: {
    ...Typography.labelSmall,
    marginTop: 4,
  },
  listContent: {
    paddingBottom: Spacing.xxl,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  dateHeaderText: {
    ...Typography.labelMedium,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  dateHeaderTotal: {
    ...Typography.labelMedium,
  },
  expenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    marginHorizontal: Spacing.md,
    marginBottom: 1,
    borderRadius: BorderRadius.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  expenseDetails: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  expenseTitle: {
    ...Typography.bodyMedium,
    fontWeight: '500',
  },
  expenseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  expenseCategory: {
    ...Typography.bodySmall,
  },
  metaDot: {
    ...Typography.bodySmall,
  },
  expenseMethod: {
    ...Typography.bodySmall,
  },
  expenseAmount: {
    ...Typography.bodyMedium,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderBottomWidth: 1,
  },
  modalTitle: {
    ...Typography.headlineMedium,
  },
  filterSection: {
    padding: Spacing.md,
  },
  filterSectionTitle: {
    ...Typography.labelMedium,
    marginBottom: Spacing.sm,
  },
  filterChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  filterChipText: {
    ...Typography.labelSmall,
  },
  filterActions: {
    flexDirection: 'row',
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
  },
});
