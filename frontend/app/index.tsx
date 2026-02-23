// SpendWise Premium - Dashboard Screen

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/hooks/useTheme';
import { useStore } from '../src/store/useStore';
import { Card } from '../src/components/Card';
import { CategoryIcon } from '../src/components/CategoryIcon';
import { EmptyState } from '../src/components/EmptyState';
import { SkeletonList } from '../src/components/SkeletonLoader';
import { t } from '../src/constants/translations';
import { Spacing, Typography, BorderRadius } from '../src/constants/theme';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';
import axios from 'axios';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || '';

export default function DashboardScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const { user, categories, setCategories, setExpenses, expenses, isGuestMode, setUser, setGuestMode } = useStore();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  
  const currentDate = new Date();
  const greeting = getGreeting();
  
  function getGreeting() {
    const hour = currentDate.getHours();
    if (hour < 12) return 'Bună dimineața';
    if (hour < 18) return 'Bună ziua';
    return 'Bună seara';
  }
  
  const initializeGuestUser = async () => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/users`, {
        provider: 'guest',
        display_name: 'Invitat',
      });
      setUser(response.data);
      setGuestMode(true);
      return response.data;
    } catch (error) {
      console.error('Error creating guest user:', error);
      const guestUser = {
        id: `guest_${Date.now()}`,
        display_name: 'Invitat',
        provider: 'guest',
        settings: {
          currency: 'RON',
          theme: 'system',
          language: 'ro',
          notifications_enabled: true,
          budget_alerts: true,
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setUser(guestUser as any);
      setGuestMode(true);
      return guestUser;
    }
  };
  
  const fetchData = async (currentUser?: any) => {
    try {
      const userId = currentUser?.id || user?.id;
      if (!userId) return;
      
      const catResponse = await axios.get(`${BACKEND_URL}/api/categories?user_id=${userId}`);
      setCategories(catResponse.data);
      
      const dashResponse = await axios.get(`${BACKEND_URL}/api/dashboard?user_id=${userId}`);
      setDashboardData(dashResponse.data);
      setRecentTransactions(dashResponse.data.recent_transactions || []);
      
      const expResponse = await axios.get(`${BACKEND_URL}/api/expenses?user_id=${userId}`);
      setExpenses(expResponse.data);
      
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  const loadData = async () => {
    setLoading(true);
    try {
      let currentUser = user;
      if (!currentUser) {
        currentUser = await initializeGuestUser();
      }
      await fetchData(currentUser);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadData();
  }, []);
  
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [user]);
  
  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString('ro-RO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} RON`;
  };
  
  const getCategoryById = (categoryId: string) => {
    return categories.find(c => c.id === categoryId);
  };
  
  const budgetPercentage = dashboardData?.budget_percentage || 0;
  const budgetColor = budgetPercentage >= 100 
    ? colors.error 
    : budgetPercentage >= 80 
      ? colors.warning 
      : colors.success;
  
  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <View style={styles.content}>
          <View style={styles.header}>
            <View>
              <Text style={[styles.greeting, { color: colors.textSecondary }]}>{greeting}</Text>
              <Text style={[styles.name, { color: colors.text }]}>{user?.display_name || 'Invitat'}</Text>
            </View>
          </View>
          <SkeletonList count={5} />
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>{greeting}</Text>
            <Text style={[styles.name, { color: colors.text }]}>{user?.display_name || 'Invitat'}</Text>
          </View>
          <TouchableOpacity 
            style={[styles.avatarContainer, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/settings')}
          >
            <Text style={styles.avatarText}>
              {(user?.display_name?.[0] || 'I').toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Total Spent Card */}
        <Card style={styles.mainCard} elevated>
          <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>
            {t.dashboard.totalSpent}
          </Text>
          <Text style={[styles.totalAmount, { color: colors.text }]}>
            {formatCurrency(dashboardData?.total_spent || 0)}
          </Text>
          <Text style={[styles.cardSubtext, { color: colors.textTertiary }]}>
            {t.dashboard.thisMonth} • {format(currentDate, 'MMMM yyyy', { locale: ro })}
          </Text>
          
          {dashboardData?.budget_total > 0 && (
            <View style={styles.budgetSection}>
              <View style={styles.budgetHeader}>
                <Text style={[styles.budgetLabel, { color: colors.textSecondary }]}>
                  {t.dashboard.budget}
                </Text>
                <Text style={[styles.budgetValue, { color: budgetColor }]}>
                  {formatCurrency(Math.abs(dashboardData?.budget_remaining || 0))} {dashboardData?.budget_remaining >= 0 ? t.dashboard.remaining : t.dashboard.exceeded}
                </Text>
              </View>
              <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      backgroundColor: budgetColor,
                      width: `${Math.min(budgetPercentage, 100)}%`
                    }
                  ]} 
                />
              </View>
              <Text style={[styles.budgetPercentage, { color: colors.textTertiary }]}>
                {Math.round(budgetPercentage)}% utilizat din {formatCurrency(dashboardData?.budget_total || 0)}
              </Text>
            </View>
          )}
        </Card>
        
        {/* Quick Add Categories */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t.dashboard.quickAdd}
          </Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickAddContainer}
          >
            {categories
              .filter(c => c.is_favorite || c.is_default)
              .slice(0, 6)
              .map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[styles.quickAddItem, { backgroundColor: colors.surface }]}
                  onPress={() => router.push({ pathname: '/add', params: { categoryId: category.id } })}
                  activeOpacity={0.7}
                >
                  <CategoryIcon icon={category.icon} color={category.color} size="medium" />
                  <Text 
                    style={[styles.quickAddText, { color: colors.text }]}
                    numberOfLines={1}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))
            }
          </ScrollView>
        </View>
        
        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t.dashboard.recentTransactions}
            </Text>
            <TouchableOpacity onPress={() => router.push('/transactions')}>
              <Text style={[styles.viewAll, { color: colors.primary }]}>
                {t.dashboard.viewAll}
              </Text>
            </TouchableOpacity>
          </View>
          
          {recentTransactions.length === 0 ? (
            <EmptyState
              icon="receipt-outline"
              title={t.dashboard.noTransactions}
              description={t.dashboard.addFirst}
              actionTitle={t.nav.add}
              onAction={() => router.push('/add')}
            />
          ) : (
            <Card style={styles.transactionsCard}>
              {recentTransactions.map((transaction, index) => {
                const category = getCategoryById(transaction.category_id);
                return (
                  <TouchableOpacity
                    key={transaction.id}
                    style={[
                      styles.transactionItem,
                      index !== recentTransactions.length - 1 && {
                        borderBottomWidth: 1,
                        borderBottomColor: colors.borderLight,
                      },
                    ]}
                    onPress={() => router.push({ pathname: '/add', params: { expenseId: transaction.id } })}
                    activeOpacity={0.7}
                  >
                    <CategoryIcon 
                      icon={category?.icon || 'help-circle'} 
                      color={category?.color || colors.textTertiary} 
                      size="small" 
                    />
                    <View style={styles.transactionDetails}>
                      <Text style={[styles.transactionTitle, { color: colors.text }]} numberOfLines={1}>
                        {transaction.title}
                      </Text>
                      <Text style={[styles.transactionCategory, { color: colors.textSecondary }]}>
                        {category?.name || 'Necunoscut'} • {format(new Date(transaction.date), 'dd MMM', { locale: ro })}
                      </Text>
                    </View>
                    <Text style={[styles.transactionAmount, { color: colors.text }]}>
                      -{formatCurrency(transaction.amount)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </Card>
          )}
        </View>
        
        {/* Category Summary */}
        {dashboardData?.category_totals?.length > 0 && (
          <View style={[styles.section, { marginBottom: 100 }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Categorii luna aceasta
            </Text>
            <Card>
              {dashboardData.category_totals
                .sort((a: any, b: any) => b.total - a.total)
                .slice(0, 5)
                .map((item: any, index: number) => {
                  const category = getCategoryById(item.category_id);
                  const percentage = dashboardData.total_spent > 0 
                    ? (item.total / dashboardData.total_spent) * 100 
                    : 0;
                  
                  return (
                    <View
                      key={item.category_id}
                      style={[
                        styles.categoryItem,
                        index !== Math.min(dashboardData.category_totals.length - 1, 4) && {
                          borderBottomWidth: 1,
                          borderBottomColor: colors.borderLight,
                        },
                      ]}
                    >
                      <View style={styles.categoryLeft}>
                        <CategoryIcon 
                          icon={category?.icon || 'help-circle'} 
                          color={category?.color || colors.textTertiary} 
                          size="small" 
                        />
                        <Text style={[styles.categoryName, { color: colors.text }]}>
                          {category?.name || 'Necunoscut'}
                        </Text>
                      </View>
                      <View style={styles.categoryRight}>
                        <Text style={[styles.categoryAmount, { color: colors.text }]}>
                          {formatCurrency(item.total)}
                        </Text>
                        <Text style={[styles.categoryPercentage, { color: colors.textTertiary }]}>
                          {Math.round(percentage)}%
                        </Text>
                      </View>
                    </View>
                  );
                })
              }
            </Card>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  greeting: {
    ...Typography.bodyMedium,
  },
  name: {
    ...Typography.displaySmall,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },
  mainCard: {
    marginBottom: Spacing.lg,
  },
  cardLabel: {
    ...Typography.labelMedium,
    marginBottom: Spacing.xs,
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
    letterSpacing: -0.5,
    marginBottom: Spacing.xs,
  },
  cardSubtext: {
    ...Typography.bodySmall,
  },
  budgetSection: {
    marginTop: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  budgetLabel: {
    ...Typography.labelMedium,
  },
  budgetValue: {
    ...Typography.labelMedium,
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  budgetPercentage: {
    ...Typography.bodySmall,
    marginTop: Spacing.sm,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.headlineSmall,
    marginBottom: Spacing.md,
  },
  viewAll: {
    ...Typography.labelMedium,
  },
  quickAddContainer: {
    paddingRight: Spacing.md,
  },
  quickAddItem: {
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginRight: Spacing.sm,
    width: 80,
  },
  quickAddText: {
    ...Typography.labelSmall,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  transactionsCard: {
    padding: 0,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  transactionDetails: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  transactionTitle: {
    ...Typography.bodyMedium,
    fontWeight: '500',
  },
  transactionCategory: {
    ...Typography.bodySmall,
    marginTop: 2,
  },
  transactionAmount: {
    ...Typography.bodyMedium,
    fontWeight: '600',
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryName: {
    ...Typography.bodyMedium,
    marginLeft: Spacing.md,
  },
  categoryRight: {
    alignItems: 'flex-end',
  },
  categoryAmount: {
    ...Typography.bodyMedium,
    fontWeight: '600',
  },
  categoryPercentage: {
    ...Typography.bodySmall,
    marginTop: 2,
  },
});
