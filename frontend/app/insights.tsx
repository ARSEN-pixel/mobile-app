// SpendWise Premium - Insights Screen

import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
  Share,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../src/hooks/useTheme';
import { useStore } from '../src/store/useStore';
import { Card } from '../src/components/Card';
import { CategoryIcon } from '../src/components/CategoryIcon';
import { EmptyState } from '../src/components/EmptyState';
import { t } from '../src/constants/translations';
import { Spacing, Typography, BorderRadius } from '../src/constants/theme';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { ro } from 'date-fns/locale';
import axios from 'axios';
import { BarChart, PieChart } from 'react-native-gifted-charts';
import type { InsightData } from '../src/types';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || '';

export default function InsightsScreen() {
  const { colors, isDark } = useTheme();
  const { user, categories, expenses } = useStore();
  
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedMonths, setSelectedMonths] = useState(3); // Last 3 months
  const [insightData, setInsightData] = useState<InsightData | null>(null);
  const [activeTab, setActiveTab] = useState<'charts' | 'table'>('charts');
  
  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString('ro-RO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} RON`;
  };
  
  const getCategoryById = (categoryId: string) => {
    return categories.find(c => c.id === categoryId);
  };
  
  const getDateRange = () => {
    const endDate = endOfMonth(new Date());
    const startDate = startOfMonth(subMonths(new Date(), selectedMonths - 1));
    return {
      start: format(startDate, 'yyyy-MM-dd'),
      end: format(endDate, 'yyyy-MM-dd'),
    };
  };
  
  const fetchInsights = async () => {
    if (!user?.id) return;
    
    try {
      const { start, end } = getDateRange();
      const response = await axios.get(
        `${BACKEND_URL}/api/insights?user_id=${user.id}&start_date=${start}&end_date=${end}`
      );
      setInsightData(response.data);
    } catch (error) {
      console.error('Error fetching insights:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchInsights();
  }, [user?.id, selectedMonths]);
  
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchInsights();
    setRefreshing(false);
  };
  
  const handleExportCSV = async () => {
    try {
      const { start, end } = getDateRange();
      const response = await axios.get(
        `${BACKEND_URL}/api/insights/export/csv?user_id=${user?.id}&start_date=${start}&end_date=${end}`
      );
      await Share.share({
        message: response.data,
        title: 'SpendWise - Export CSV',
      });
    } catch (error) {
      console.error('Error exporting CSV:', error);
      Alert.alert('Eroare', 'Nu s-a putut exporta CSV');
    }
  };
  
  // Prepare chart data
  const barChartData = useMemo(() => {
    if (!insightData?.monthly_trend) return [];
    return insightData.monthly_trend.map(item => ({
      value: item.amount,
      label: format(new Date(item.month + '-01'), 'MMM', { locale: ro }),
      frontColor: colors.primary,
    }));
  }, [insightData?.monthly_trend, colors.primary]);
  
  const pieChartData = useMemo(() => {
    if (!insightData?.category_breakdown) return [];
    return insightData.category_breakdown.slice(0, 6).map((item, index) => {
      const category = getCategoryById(item.category_id);
      return {
        value: item.amount,
        color: category?.color || colors.textTertiary,
        text: `${Math.round(item.percentage)}%`,
        name: category?.name || 'Necunoscut',
      };
    });
  }, [insightData?.category_breakdown, categories]);
  
  const renderKPICard = (
    title: string,
    value: string,
    icon: string,
    subtitle?: string,
    trend?: number
  ) => (
    <Card style={styles.kpiCard}>
      <View style={styles.kpiHeader}>
        <View style={[styles.kpiIconContainer, { backgroundColor: colors.primary + '15' }]}>
          <Ionicons name={icon as any} size={20} color={colors.primary} />
        </View>
        {trend !== undefined && (
          <View style={[
            styles.trendBadge,
            { backgroundColor: trend >= 0 ? colors.errorLight : colors.successLight },
          ]}>
            <Ionicons
              name={trend >= 0 ? 'arrow-up' : 'arrow-down'}
              size={12}
              color={trend >= 0 ? colors.error : colors.success}
            />
            <Text style={[
              styles.trendText,
              { color: trend >= 0 ? colors.error : colors.success },
            ]}>
              {Math.abs(trend).toFixed(1)}%
            </Text>
          </View>
        )}
      </View>
      <Text style={[styles.kpiValue, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.kpiTitle, { color: colors.textSecondary }]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.kpiSubtitle, { color: colors.textTertiary }]}>{subtitle}</Text>
      )}
    </Card>
  );
  
  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <View style={styles.header}>
          <Text style={[styles.screenTitle, { color: colors.text }]}>{t.insights.title}</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            {t.common.loading}
          </Text>
        </View>
      </SafeAreaView>
    );
  }
  
  if (!insightData || insightData.total_spent === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <View style={styles.header}>
          <Text style={[styles.screenTitle, { color: colors.text }]}>{t.insights.title}</Text>
        </View>
        <EmptyState
          icon="bar-chart-outline"
          title="Nicio analiză disponibilă"
          description="Adaugă cheltuieli pentru a vedea statisticile"
        />
      </SafeAreaView>
    );
  }
  
  const biggestCategory = getCategoryById(insightData.biggest_category.category_id);
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
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
          <Text style={[styles.screenTitle, { color: colors.text }]}>{t.insights.title}</Text>
          <TouchableOpacity
            style={[styles.exportButton, { backgroundColor: colors.surface }]}
            onPress={handleExportCSV}
          >
            <Ionicons name="download-outline" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
        
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {[1, 3, 6, 12].map((months) => (
            <TouchableOpacity
              key={months}
              style={[
                styles.periodButton,
                { borderColor: colors.border },
                selectedMonths === months && { 
                  backgroundColor: colors.primary, 
                  borderColor: colors.primary 
                },
              ]}
              onPress={() => setSelectedMonths(months)}
            >
              <Text style={[
                styles.periodButtonText,
                { color: selectedMonths === months ? '#FFFFFF' : colors.text },
              ]}>
                {months === 1 ? '1 lună' : `${months} luni`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* KPI Cards */}
        <View style={styles.kpiGrid}>
          {renderKPICard(
            t.insights.totalSpent,
            formatCurrency(insightData.total_spent),
            'wallet',
            undefined,
            insightData.comparison_to_last_month
          )}
          {renderKPICard(
            t.insights.monthlyAverage,
            formatCurrency(insightData.monthly_average),
            'trending-up'
          )}
        </View>
        
        <View style={styles.kpiGrid}>
          {renderKPICard(
            t.insights.biggestCategory,
            biggestCategory?.name || 'N/A',
            biggestCategory?.icon || 'help-circle',
            formatCurrency(insightData.biggest_category.amount)
          )}
          {renderKPICard(
            t.insights.weekdayVsWeekend,
            `${Math.round((insightData.weekday_total / insightData.total_spent) * 100)}% / ${Math.round((insightData.weekend_total / insightData.total_spent) * 100)}%`,
            'calendar',
            `${t.insights.weekday} / ${t.insights.weekend}`
          )}
        </View>
        
        {/* Smart Insight */}
        {insightData.comparison_to_last_month !== 0 && (
          <Card style={[styles.insightCard, { backgroundColor: colors.primary + '10' }]}>
            <View style={styles.insightContent}>
              <Ionicons 
                name={insightData.comparison_to_last_month > 0 ? 'trending-up' : 'trending-down'} 
                size={24} 
                color={insightData.comparison_to_last_month > 0 ? colors.error : colors.success} 
              />
              <Text style={[styles.insightText, { color: colors.text }]}>
                {insightData.comparison_to_last_month > 0 
                  ? `Ai cheltuit cu ${Math.abs(insightData.comparison_to_last_month).toFixed(1)}% mai mult decât luna trecută`
                  : `Ai cheltuit cu ${Math.abs(insightData.comparison_to_last_month).toFixed(1)}% mai puțin decât luna trecută`
                }
              </Text>
            </View>
          </Card>
        )}
        
        {/* Tab Selector */}
        <View style={[styles.tabSelector, { backgroundColor: colors.surface }]}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'charts' && { backgroundColor: colors.primary },
            ]}
            onPress={() => setActiveTab('charts')}
          >
            <Text style={[
              styles.tabText,
              { color: activeTab === 'charts' ? '#FFFFFF' : colors.text },
            ]}>
              Grafice
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'table' && { backgroundColor: colors.primary },
            ]}
            onPress={() => setActiveTab('table')}
          >
            <Text style={[
              styles.tabText,
              { color: activeTab === 'table' ? '#FFFFFF' : colors.text },
            ]}>
              Tabel
            </Text>
          </TouchableOpacity>
        </View>
        
        {activeTab === 'charts' ? (
          <>
            {/* Monthly Trend Chart */}
            {barChartData.length > 0 && (
              <Card style={styles.chartCard}>
                <Text style={[styles.chartTitle, { color: colors.text }]}>
                  {t.insights.monthlyTrend}
                </Text>
                <View style={styles.chartContainer}>
                  <BarChart
                    data={barChartData}
                    barWidth={28}
                    spacing={20}
                    roundedTop
                    roundedBottom
                    xAxisThickness={0}
                    yAxisThickness={0}
                    yAxisTextStyle={{ color: colors.textSecondary, fontSize: 10 }}
                    xAxisLabelTextStyle={{ color: colors.textSecondary, fontSize: 10 }}
                    noOfSections={4}
                    maxValue={Math.max(...barChartData.map(d => d.value)) * 1.2}
                    isAnimated
                  />
                </View>
              </Card>
            )}
            
            {/* Category Breakdown Pie Chart */}
            {pieChartData.length > 0 && (
              <Card style={styles.chartCard}>
                <Text style={[styles.chartTitle, { color: colors.text }]}>
                  {t.insights.categoryBreakdown}
                </Text>
                <View style={styles.pieChartContainer}>
                  <PieChart
                    data={pieChartData}
                    donut
                    radius={100}
                    innerRadius={60}
                    centerLabelComponent={() => (
                      <View style={styles.pieCenter}>
                        <Text style={[styles.pieCenterValue, { color: colors.text }]}>
                          {formatCurrency(insightData.total_spent)}
                        </Text>
                        <Text style={[styles.pieCenterLabel, { color: colors.textSecondary }]}>
                          Total
                        </Text>
                      </View>
                    )}
                  />
                  <View style={styles.pieLegend}>
                    {pieChartData.map((item, index) => (
                      <View key={index} style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                        <Text style={[styles.legendText, { color: colors.text }]} numberOfLines={1}>
                          {item.name}
                        </Text>
                        <Text style={[styles.legendValue, { color: colors.textSecondary }]}>
                          {item.text}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </Card>
            )}
          </>
        ) : (
          // Table View
          <Card style={styles.tableCard}>
            <Text style={[styles.chartTitle, { color: colors.text }]}>
              {t.insights.categoryTable}
            </Text>
            <View style={[styles.tableHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.tableHeaderText, { color: colors.textSecondary, flex: 2 }]}>
                Categorie
              </Text>
              <Text style={[styles.tableHeaderText, { color: colors.textSecondary, flex: 1, textAlign: 'right' }]}>
                Sumă
              </Text>
              <Text style={[styles.tableHeaderText, { color: colors.textSecondary, flex: 1, textAlign: 'right' }]}>
                {t.insights.share}
              </Text>
            </View>
            {insightData.category_breakdown.map((item, index) => {
              const category = getCategoryById(item.category_id);
              return (
                <View 
                  key={item.category_id}
                  style={[
                    styles.tableRow,
                    index !== insightData.category_breakdown.length - 1 && {
                      borderBottomWidth: 1,
                      borderBottomColor: colors.borderLight,
                    },
                  ]}
                >
                  <View style={[styles.tableCell, { flex: 2, flexDirection: 'row', alignItems: 'center' }]}>
                    <CategoryIcon 
                      icon={category?.icon || 'help-circle'} 
                      color={category?.color || colors.textTertiary} 
                      size="small" 
                    />
                    <Text style={[styles.tableCellText, { color: colors.text, marginLeft: 8 }]} numberOfLines={1}>
                      {category?.name || 'Necunoscut'}
                    </Text>
                  </View>
                  <Text style={[styles.tableCellText, { color: colors.text, flex: 1, textAlign: 'right' }]}>
                    {formatCurrency(item.amount)}
                  </Text>
                  <Text style={[styles.tableCellText, { color: colors.textSecondary, flex: 1, textAlign: 'right' }]}>
                    {item.percentage.toFixed(1)}%
                  </Text>
                </View>
              );
            })}
          </Card>
        )}
        
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  screenTitle: {
    ...Typography.displaySmall,
  },
  exportButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodSelector: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  periodButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  periodButtonText: {
    ...Typography.labelMedium,
  },
  kpiGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  kpiCard: {
    flex: 1,
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
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    gap: 2,
  },
  trendText: {
    ...Typography.labelSmall,
    fontWeight: '600',
  },
  kpiValue: {
    ...Typography.headlineMedium,
    marginBottom: 2,
  },
  kpiTitle: {
    ...Typography.labelSmall,
  },
  kpiSubtitle: {
    ...Typography.labelSmall,
    marginTop: 2,
  },
  insightCard: {
    marginBottom: Spacing.lg,
  },
  insightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  insightText: {
    ...Typography.bodyMedium,
    flex: 1,
  },
  tabSelector: {
    flexDirection: 'row',
    borderRadius: BorderRadius.md,
    padding: 4,
    marginBottom: Spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  tabText: {
    ...Typography.labelMedium,
  },
  chartCard: {
    marginBottom: Spacing.md,
  },
  chartTitle: {
    ...Typography.headlineSmall,
    marginBottom: Spacing.md,
  },
  chartContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  pieChartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  pieCenter: {
    alignItems: 'center',
  },
  pieCenterValue: {
    ...Typography.labelLarge,
    fontWeight: '700',
  },
  pieCenterLabel: {
    ...Typography.labelSmall,
  },
  pieLegend: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: Spacing.sm,
  },
  legendText: {
    ...Typography.labelSmall,
    flex: 1,
  },
  legendValue: {
    ...Typography.labelSmall,
    fontWeight: '600',
  },
  tableCard: {
    marginBottom: Spacing.md,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    marginBottom: Spacing.sm,
  },
  tableHeaderText: {
    ...Typography.labelSmall,
    fontWeight: '600',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  tableCell: {},
  tableCellText: {
    ...Typography.bodySmall,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    ...Typography.bodyMedium,
  },
  bottomSpacing: {
    height: Spacing.xxl,
  },
});
