// SpendWise Premium - Add/Edit Expense Screen

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../src/hooks/useTheme';
import { useStore } from '../src/store/useStore';
import { Card } from '../src/components/Card';
import { Button } from '../src/components/Button';
import { CategoryIcon } from '../src/components/CategoryIcon';
import { t } from '../src/constants/translations';
import { Spacing, Typography, BorderRadius, PaymentMethods } from '../src/constants/theme';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';
import axios from 'axios';
import * as Haptics from 'expo-haptics';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || '';

export default function AddExpenseScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user, categories, addExpense, updateExpense, deleteExpense, expenses } = useStore();
  
  const isEditing = !!params.expenseId;
  const preselectedCategoryId = params.categoryId as string;
  
  const [amount, setAmount] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(preselectedCategoryId || '');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date());
  const [paymentMethod, setPaymentMethod] = useState<string>('cash');
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  
  // Load expense data if editing
  useEffect(() => {
    if (isEditing && params.expenseId) {
      const expense = expenses.find(e => e.id === params.expenseId);
      if (expense) {
        setAmount(expense.amount.toString());
        setSelectedCategoryId(expense.category_id);
        setTitle(expense.title);
        setDate(new Date(expense.date));
        setPaymentMethod(expense.payment_method);
        setNotes(expense.notes || '');
        setTags(expense.tags?.join(', ') || '');
        setIsRecurring(expense.is_recurring);
      }
    }
  }, [params.expenseId, isEditing]);
  
  // Set first category as default if none selected
  useEffect(() => {
    if (!selectedCategoryId && categories.length > 0 && !preselectedCategoryId) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categories, selectedCategoryId, preselectedCategoryId]);
  
  const handleAmountChange = (text: string) => {
    // Allow only numbers and one decimal point
    const cleaned = text.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    if (parts.length > 2) return;
    if (parts[1]?.length > 2) return;
    setAmount(cleaned);
  };
  
  const handleSave = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Eroare', 'Introdu o sumă validă');
      return;
    }
    if (!selectedCategoryId) {
      Alert.alert('Eroare', 'Selectează o categorie');
      return;
    }
    if (!title.trim()) {
      Alert.alert('Eroare', 'Introdu un titlu');
      return;
    }
    
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    try {
      const expenseData = {
        user_id: user?.id,
        amount: parseFloat(amount),
        category_id: selectedCategoryId,
        title: title.trim(),
        date: format(date, 'yyyy-MM-dd'),
        payment_method: paymentMethod,
        notes: notes.trim() || null,
        tags: tags.split(',').map(t => t.trim()).filter(t => t),
        is_recurring: isRecurring,
        sync_status: 'synced',
      };
      
      if (isEditing) {
        const response = await axios.put(
          `${BACKEND_URL}/api/expenses/${params.expenseId}`,
          expenseData
        );
        updateExpense(params.expenseId as string, response.data);
      } else {
        const response = await axios.post(`${BACKEND_URL}/api/expenses`, expenseData);
        addExpense(response.data);
      }
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch (error) {
      console.error('Error saving expense:', error);
      Alert.alert('Eroare', 'Nu s-a putut salva cheltuiala');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = () => {
    Alert.alert(
      t.add.delete,
      t.add.confirmDelete,
      [
        { text: t.common.cancel, style: 'cancel' },
        {
          text: t.common.delete,
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await axios.delete(`${BACKEND_URL}/api/expenses/${params.expenseId}`);
              deleteExpense(params.expenseId as string);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              router.back();
            } catch (error) {
              console.error('Error deleting expense:', error);
              Alert.alert('Eroare', 'Nu s-a putut șterge cheltuiala');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };
  
  const selectedCategory = categories.find(c => c.id === selectedCategoryId);
  
  const quickAmounts = [10, 25, 50, 100, 200, 500];
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {isEditing ? t.add.editTitle : t.add.title}
        </Text>
        <View style={styles.headerButton} />
      </View>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Amount Input */}
          <Card style={styles.amountCard} elevated>
            <Text style={[styles.label, { color: colors.textSecondary }]}>{t.add.amount}</Text>
            <View style={styles.amountRow}>
              <Text style={[styles.currencySymbol, { color: colors.text }]}>RON</Text>
              <TextInput
                style={[styles.amountInput, { color: colors.text }]}
                value={amount}
                onChangeText={handleAmountChange}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor={colors.textTertiary}
                autoFocus={!isEditing}
              />
            </View>
            
            {/* Quick Amount Buttons */}
            <View style={styles.quickAmounts}>
              {quickAmounts.map((quickAmount) => (
                <TouchableOpacity
                  key={quickAmount}
                  style={[styles.quickAmountButton, { backgroundColor: colors.borderLight }]}
                  onPress={() => {
                    setAmount(quickAmount.toString());
                    Haptics.selectionAsync();
                  }}
                >
                  <Text style={[styles.quickAmountText, { color: colors.text }]}>
                    {quickAmount}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>
          
          {/* Title Input */}
          <Card style={styles.inputCard}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>{t.add.expenseTitle}</Text>
            <TextInput
              style={[styles.textInput, { color: colors.text, borderColor: colors.border }]}
              value={title}
              onChangeText={setTitle}
              placeholder={t.add.titlePlaceholder}
              placeholderTextColor={colors.textTertiary}
            />
          </Card>
          
          {/* Category Selection */}
          <Card style={styles.inputCard}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>{t.add.category}</Text>
            <TouchableOpacity
              style={[styles.selectButton, { borderColor: colors.border }]}
              onPress={() => setShowCategoryModal(true)}
            >
              {selectedCategory ? (
                <View style={styles.selectedCategory}>
                  <CategoryIcon 
                    icon={selectedCategory.icon} 
                    color={selectedCategory.color} 
                    size="small" 
                  />
                  <Text style={[styles.selectedText, { color: colors.text }]}>
                    {selectedCategory.name}
                  </Text>
                </View>
              ) : (
                <Text style={[styles.placeholderText, { color: colors.textTertiary }]}>
                  Selectează categoria
                </Text>
              )}
              <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </Card>
          
          {/* Date Selection */}
          <Card style={styles.inputCard}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>{t.add.date}</Text>
            <TouchableOpacity
              style={[styles.selectButton, { borderColor: colors.border }]}
              onPress={() => setShowDateModal(true)}
            >
              <View style={styles.dateDisplay}>
                <Ionicons name="calendar" size={20} color={colors.primary} />
                <Text style={[styles.selectedText, { color: colors.text, marginLeft: 8 }]}>
                  {format(date, 'd MMMM yyyy', { locale: ro })}
                </Text>
              </View>
              <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </Card>
          
          {/* Payment Method */}
          <Card style={styles.inputCard}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>{t.add.paymentMethod}</Text>
            <View style={styles.paymentMethods}>
              {PaymentMethods.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    styles.paymentMethodButton,
                    { borderColor: colors.border },
                    paymentMethod === method.id && { 
                      borderColor: colors.primary,
                      backgroundColor: colors.primary + '10',
                    },
                  ]}
                  onPress={() => {
                    setPaymentMethod(method.id);
                    Haptics.selectionAsync();
                  }}
                >
                  <Ionicons 
                    name={method.icon as any} 
                    size={20} 
                    color={paymentMethod === method.id ? colors.primary : colors.textSecondary} 
                  />
                  <Text 
                    style={[
                      styles.paymentMethodText,
                      { color: paymentMethod === method.id ? colors.primary : colors.text },
                    ]}
                  >
                    {method.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>
          
          {/* Notes */}
          <Card style={styles.inputCard}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>{t.add.notes}</Text>
            <TextInput
              style={[
                styles.textInput, 
                styles.notesInput,
                { color: colors.text, borderColor: colors.border }
              ]}
              value={notes}
              onChangeText={setNotes}
              placeholder={t.add.notesPlaceholder}
              placeholderTextColor={colors.textTertiary}
              multiline
              numberOfLines={3}
            />
          </Card>
          
          {/* Tags */}
          <Card style={styles.inputCard}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>{t.add.tags}</Text>
            <TextInput
              style={[styles.textInput, { color: colors.text, borderColor: colors.border }]}
              value={tags}
              onChangeText={setTags}
              placeholder={t.add.tagsPlaceholder}
              placeholderTextColor={colors.textTertiary}
            />
          </Card>
          
          {/* Recurring Toggle */}
          <Card style={styles.inputCard}>
            <TouchableOpacity
              style={styles.toggleRow}
              onPress={() => {
                setIsRecurring(!isRecurring);
                Haptics.selectionAsync();
              }}
            >
              <View style={styles.toggleLeft}>
                <Ionicons name="repeat" size={20} color={colors.primary} />
                <Text style={[styles.toggleText, { color: colors.text }]}>
                  {t.add.recurring}
                </Text>
              </View>
              <View 
                style={[
                  styles.toggle,
                  { backgroundColor: isRecurring ? colors.primary : colors.border },
                ]}
              >
                <View 
                  style={[
                    styles.toggleThumb,
                    { transform: [{ translateX: isRecurring ? 20 : 0 }] },
                  ]} 
                />
              </View>
            </TouchableOpacity>
          </Card>
          
          {/* Action Buttons */}
          <View style={styles.actions}>
            <Button
              title={t.add.save}
              onPress={handleSave}
              loading={loading}
              fullWidth
              icon="checkmark"
            />
            {isEditing && (
              <Button
                title={t.add.delete}
                onPress={handleDelete}
                variant="danger"
                fullWidth
                icon="trash"
                style={styles.deleteButton}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      
      {/* Category Selection Modal */}
      <Modal
        visible={showCategoryModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>{t.add.category}</Text>
              <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.categoryList}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryItem,
                    selectedCategoryId === category.id && {
                      backgroundColor: colors.primary + '10',
                    },
                  ]}
                  onPress={() => {
                    setSelectedCategoryId(category.id);
                    setShowCategoryModal(false);
                    Haptics.selectionAsync();
                  }}
                >
                  <CategoryIcon icon={category.icon} color={category.color} size="medium" />
                  <Text style={[styles.categoryItemText, { color: colors.text }]}>
                    {category.name}
                  </Text>
                  {selectedCategoryId === category.id && (
                    <Ionicons name="checkmark" size={24} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
      
      {/* Date Selection Modal */}
      <Modal
        visible={showDateModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowDateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>{t.add.date}</Text>
              <TouchableOpacity onPress={() => setShowDateModal(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <View style={styles.dateOptions}>
              {[
                { label: t.common.today, date: new Date() },
                { label: t.common.yesterday, date: new Date(Date.now() - 86400000) },
                { label: 'Acum 2 zile', date: new Date(Date.now() - 2 * 86400000) },
                { label: 'Acum 3 zile', date: new Date(Date.now() - 3 * 86400000) },
                { label: 'Acum o săptămână', date: new Date(Date.now() - 7 * 86400000) },
              ].map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dateOption,
                    { borderBottomColor: colors.borderLight },
                  ]}
                  onPress={() => {
                    setDate(option.date);
                    setShowDateModal(false);
                    Haptics.selectionAsync();
                  }}
                >
                  <Text style={[styles.dateOptionText, { color: colors.text }]}>
                    {option.label}
                  </Text>
                  <Text style={[styles.dateOptionSubtext, { color: colors.textSecondary }]}>
                    {format(option.date, 'd MMM yyyy', { locale: ro })}
                  </Text>
                </TouchableOpacity>
              ))}
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
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...Typography.headlineMedium,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  amountCard: {
    marginBottom: Spacing.md,
  },
  label: {
    ...Typography.labelMedium,
    marginBottom: Spacing.sm,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    ...Typography.displaySmall,
    marginRight: Spacing.sm,
  },
  amountInput: {
    flex: 1,
    fontSize: 40,
    fontWeight: '700',
    padding: 0,
  },
  quickAmounts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  quickAmountButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  quickAmountText: {
    ...Typography.labelMedium,
  },
  inputCard: {
    marginBottom: Spacing.md,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    ...Typography.bodyMedium,
  },
  notesInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  selectedCategory: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedText: {
    ...Typography.bodyMedium,
    marginLeft: Spacing.sm,
  },
  placeholderText: {
    ...Typography.bodyMedium,
  },
  dateDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethods: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  paymentMethodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  paymentMethodText: {
    ...Typography.labelMedium,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  toggleText: {
    ...Typography.bodyMedium,
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    padding: 2,
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  actions: {
    marginTop: Spacing.lg,
    gap: Spacing.md,
  },
  deleteButton: {
    marginTop: Spacing.sm,
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
  categoryList: {
    padding: Spacing.md,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  categoryItemText: {
    ...Typography.bodyMedium,
    flex: 1,
    marginLeft: Spacing.md,
  },
  dateOptions: {
    padding: Spacing.md,
  },
  dateOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  dateOptionText: {
    ...Typography.bodyMedium,
  },
  dateOptionSubtext: {
    ...Typography.bodySmall,
  },
});
