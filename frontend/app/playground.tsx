// SpendWise Premium - Design System Playground
// Dev-only screen to showcase all design system components

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Design System Imports
import { useDesignSystem } from '../src/design-system/hooks/useDesignSystem';
import { Spacing, Radius, Typography, ChartColors } from '../src/design-system';
import {
  DSCard,
  DSKPICard,
  DSChartCard,
  DSButton,
  DSIconButton,
  DSTextField,
  DSCurrencyInput,
  DSCategoryIcon,
  DSCategoryChip,
  DSCategoryCard,
  DSFilterChip,
  DSSectionHeader,
  DSTransactionRow,
  DSListItem,
  DSDateHeader,
  DSEmptyState,
  DSSkeleton,
  DSSkeletonCard,
  DSBanner,
  DSCategoryTable,
  DSAppBar,
  DSSegmentedControl,
} from '../src/design-system/components';
import { useStore } from '../src/store/useStore';

// Enable this flag to show the playground
const DEV_MODE = true;

export default function DesignSystemPlayground() {
  const { colors, isDark, spacing, typography } = useDesignSystem();
  const { setTheme, theme } = useStore();
  const router = useRouter();
  
  const [textValue, setTextValue] = useState('');
  const [currencyValue, setCurrencyValue] = useState('125.50');
  const [selectedSegment, setSelectedSegment] = useState('charts');
  const [selectedCategory, setSelectedCategory] = useState('food');
  const [filterSelected, setFilterSelected] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Sample data
  const sampleCategories = [
    { key: 'food', name: 'Mâncare', icon: 'restaurant', color: '#F59E0B' },
    { key: 'transport', name: 'Transport', icon: 'car', color: '#3B82F6' },
    { key: 'shopping', name: 'Cumpărături', icon: 'cart', color: '#EC4899' },
  ];
  
  const categoryTableData = [
    { category: { name: 'Mâncare', icon: 'restaurant', color: '#F59E0B' }, amount: 1250.50, percentage: 35.2 },
    { category: { name: 'Transport', icon: 'car', color: '#3B82F6' }, amount: 890.00, percentage: 25.1 },
    { category: { name: 'Cumpărături', icon: 'cart', color: '#EC4899' }, amount: 650.75, percentage: 18.3 },
    { category: { name: 'Facturi', icon: 'document-text', color: '#14B8A6' }, amount: 450.00, percentage: 12.7 },
    { category: { name: 'Altele', icon: 'ellipsis-horizontal', color: '#64748B' }, amount: 310.25, percentage: 8.7 },
  ];
  
  if (!DEV_MODE) {
    return null;
  }
  
  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>{title}</Text>
      {children}
    </View>
  );
  
  const Subsection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.subsection}>
      <Text style={[styles.subsectionTitle, { color: colors.text.secondary }]}>{title}</Text>
      {children}
    </View>
  );
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <DSAppBar
        title="Design System"
        subtitle="Playground"
        leftIcon="arrow-back"
        onLeftPress={() => router.back()}
        rightIcon="color-palette"
        onRightPress={() => setTheme(isDark ? 'light' : 'dark')}
      />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Theme Toggle */}
        <View style={[styles.themeToggle, { backgroundColor: colors.surface.primary }]}>
          <Text style={[styles.themeLabel, { color: colors.text.primary }]}>Dark Mode</Text>
          <Switch
            value={isDark}
            onValueChange={(value) => setTheme(value ? 'dark' : 'light')}
            trackColor={{ false: colors.border.primary, true: colors.primary.default }}
            thumbColor="#FFFFFF"
          />
        </View>
        
        {/* Typography */}
        <Section title="Typography">
          <DSCard>
            <Text style={[Typography.display.xl, { color: colors.text.primary }]}>Display XL</Text>
            <Text style={[Typography.display.lg, { color: colors.text.primary }]}>Display LG</Text>
            <Text style={[Typography.display.md, { color: colors.text.primary }]}>Display MD</Text>
            <Text style={[Typography.display.sm, { color: colors.text.primary }]}>Display SM</Text>
            <View style={styles.spacer} />
            <Text style={[Typography.title.lg, { color: colors.text.primary }]}>Title LG</Text>
            <Text style={[Typography.title.md, { color: colors.text.primary }]}>Title MD</Text>
            <Text style={[Typography.title.sm, { color: colors.text.primary }]}>Title SM</Text>
            <View style={styles.spacer} />
            <Text style={[Typography.body.lg, { color: colors.text.primary }]}>Body LG - Main content text</Text>
            <Text style={[Typography.body.md, { color: colors.text.secondary }]}>Body MD - Secondary content</Text>
            <Text style={[Typography.body.sm, { color: colors.text.tertiary }]}>Body SM - Tertiary content</Text>
            <View style={styles.spacer} />
            <Text style={[Typography.label.lg, { color: colors.text.primary }]}>Label LG</Text>
            <Text style={[Typography.label.md, { color: colors.text.primary }]}>Label MD</Text>
            <Text style={[Typography.label.sm, { color: colors.text.primary }]}>Label SM</Text>
            <Text style={[Typography.label.xs, { color: colors.text.secondary }]}>Label XS</Text>
            <View style={styles.spacer} />
            <Text style={[Typography.caption.md, { color: colors.text.tertiary }]}>Caption MD</Text>
            <Text style={[Typography.caption.sm, { color: colors.text.tertiary }]}>Caption SM</Text>
          </DSCard>
        </Section>
        
        {/* Colors */}
        <Section title="Colors">
          <Subsection title="Primary">
            <View style={styles.colorRow}>
              <View style={[styles.colorSwatch, { backgroundColor: colors.primary.default }]} />
              <View style={[styles.colorSwatch, { backgroundColor: colors.primary.light }]} />
              <View style={[styles.colorSwatch, { backgroundColor: colors.primary.dark }]} />
              <View style={[styles.colorSwatch, { backgroundColor: colors.primary.subtle }]} />
            </View>
          </Subsection>
          <Subsection title="Semantic">
            <View style={styles.colorRow}>
              <View style={[styles.colorSwatch, { backgroundColor: colors.success.default }]} />
              <View style={[styles.colorSwatch, { backgroundColor: colors.warning.default }]} />
              <View style={[styles.colorSwatch, { backgroundColor: colors.error.default }]} />
              <View style={[styles.colorSwatch, { backgroundColor: colors.info.default }]} />
            </View>
          </Subsection>
          <Subsection title="Chart Colors">
            <View style={styles.colorRow}>
              {ChartColors.primary.slice(0, 8).map((color, i) => (
                <View key={i} style={[styles.colorSwatchSmall, { backgroundColor: color }]} />
              ))}
            </View>
          </Subsection>
        </Section>
        
        {/* Buttons */}
        <Section title="Buttons">
          <Subsection title="Variants">
            <View style={styles.buttonRow}>
              <DSButton title="Primary" onPress={() => {}} variant="primary" />
              <DSButton title="Secondary" onPress={() => {}} variant="secondary" />
            </View>
            <View style={styles.buttonRow}>
              <DSButton title="Tertiary" onPress={() => {}} variant="tertiary" />
              <DSButton title="Ghost" onPress={() => {}} variant="ghost" />
            </View>
            <View style={styles.buttonRow}>
              <DSButton title="Danger" onPress={() => {}} variant="danger" />
              <DSButton title="Disabled" onPress={() => {}} disabled />
            </View>
          </Subsection>
          
          <Subsection title="Sizes">
            <View style={styles.buttonRow}>
              <DSButton title="Small" onPress={() => {}} size="sm" />
              <DSButton title="Medium" onPress={() => {}} size="md" />
              <DSButton title="Large" onPress={() => {}} size="lg" />
            </View>
          </Subsection>
          
          <Subsection title="With Icons">
            <View style={styles.buttonRow}>
              <DSButton title="Add" onPress={() => {}} icon="add" />
              <DSButton title="Save" onPress={() => {}} icon="checkmark" iconPosition="right" />
            </View>
          </Subsection>
          
          <Subsection title="Loading">
            <DSButton title="Loading..." onPress={() => {}} loading />
          </Subsection>
          
          <Subsection title="Icon Buttons">
            <View style={styles.buttonRow}>
              <DSIconButton icon="add" onPress={() => {}} variant="filled" />
              <DSIconButton icon="heart" onPress={() => {}} variant="tonal" />
              <DSIconButton icon="share" onPress={() => {}} variant="outlined" />
              <DSIconButton icon="ellipsis-horizontal" onPress={() => {}} variant="ghost" />
            </View>
          </Subsection>
        </Section>
        
        {/* Cards */}
        <Section title="Cards">
          <Subsection title="Variants">
            <DSCard variant="flat" style={styles.cardMargin}>
              <Text style={[Typography.label.md, { color: colors.text.primary }]}>Flat Card</Text>
              <Text style={[Typography.body.sm, { color: colors.text.secondary }]}>Default card style</Text>
            </DSCard>
            <DSCard variant="elevated" style={styles.cardMargin}>
              <Text style={[Typography.label.md, { color: colors.text.primary }]}>Elevated Card</Text>
              <Text style={[Typography.body.sm, { color: colors.text.secondary }]}>With shadow</Text>
            </DSCard>
            <DSCard variant="outline" style={styles.cardMargin}>
              <Text style={[Typography.label.md, { color: colors.text.primary }]}>Outline Card</Text>
              <Text style={[Typography.body.sm, { color: colors.text.secondary }]}>With border</Text>
            </DSCard>
          </Subsection>
          
          <Subsection title="KPI Cards">
            <View style={styles.kpiRow}>
              <DSKPICard
                title="Total cheltuit"
                value="3,551.50 RON"
                icon="wallet"
                trend={{ value: 12.5, direction: 'up' }}
                style={{ flex: 1 }}
              />
              <View style={{ width: Spacing.md }} />
              <DSKPICard
                title="Medie lunară"
                value="1,183.83 RON"
                icon="trending-up"
                iconColor={colors.success.default}
                style={{ flex: 1 }}
              />
            </View>
          </Subsection>
          
          <Subsection title="Chart Card">
            <DSChartCard
              title="Tendință lunară"
              subtitle="Ultimele 3 luni"
              action={{ label: 'Vezi tot', onPress: () => {} }}
            >
              <View style={[styles.chartPlaceholder, { backgroundColor: colors.background.secondary }]}>
                <Text style={[Typography.body.sm, { color: colors.text.tertiary }]}>
                  [Chart Placeholder]
                </Text>
              </View>
            </DSChartCard>
          </Subsection>
        </Section>
        
        {/* Text Fields */}
        <Section title="Text Fields">
          <DSTextField
            label="Text Field"
            placeholder="Enter text..."
            value={textValue}
            onChangeText={setTextValue}
            helperText="Helper text goes here"
          />
          
          <DSTextField
            label="With Icons"
            placeholder="Search..."
            value=""
            onChangeText={() => {}}
            leftIcon="search"
            rightIcon="close-circle"
            onRightIconPress={() => {}}
          />
          
          <DSTextField
            label="With Error"
            placeholder="Enter email..."
            value="invalid-email"
            onChangeText={() => {}}
            error="Email-ul nu este valid"
          />
          
          <Subsection title="Currency Input">
            <DSCurrencyInput
              label="Sumă"
              value={currencyValue}
              onChangeText={setCurrencyValue}
              currency="RON"
            />
          </Subsection>
        </Section>
        
        {/* Categories */}
        <Section title="Category Components">
          <Subsection title="Category Icons">
            <View style={styles.iconRow}>
              <DSCategoryIcon icon="restaurant" color="#F59E0B" size="sm" />
              <DSCategoryIcon icon="car" color="#3B82F6" size="md" />
              <DSCategoryIcon icon="cart" color="#EC4899" size="lg" />
              <DSCategoryIcon icon="gift" color="#F97316" size="xl" />
            </View>
          </Subsection>
          
          <Subsection title="Category Chips">
            <View style={styles.chipRow}>
              {sampleCategories.map((cat) => (
                <DSCategoryChip
                  key={cat.key}
                  name={cat.name}
                  icon={cat.icon}
                  color={cat.color}
                  selected={selectedCategory === cat.key}
                  onPress={() => setSelectedCategory(cat.key)}
                />
              ))}
            </View>
          </Subsection>
          
          <Subsection title="Category Cards">
            <View style={styles.cardRow}>
              {sampleCategories.map((cat, i) => (
                <DSCategoryCard
                  key={cat.key}
                  name={cat.name}
                  icon={cat.icon}
                  color={cat.color}
                  selected={selectedCategory === cat.key}
                  favorite={i === 0}
                  onPress={() => setSelectedCategory(cat.key)}
                />
              ))}
            </View>
          </Subsection>
          
          <Subsection title="Filter Chips">
            <View style={styles.chipRow}>
              <DSFilterChip
                label="Toate"
                selected={!filterSelected}
                onPress={() => setFilterSelected(false)}
              />
              <DSFilterChip
                label="Numerar"
                icon="cash"
                selected={filterSelected}
                onPress={() => setFilterSelected(true)}
                onRemove={() => setFilterSelected(false)}
              />
            </View>
          </Subsection>
        </Section>
        
        {/* List Components */}
        <Section title="List Components">
          <DSSectionHeader
            title="Tranzacții recente"
            subtitle="Ultima săptămână"
            action={{ label: 'Vezi tot', onPress: () => {} }}
          />
          
          <DSCard padding={0}>
            <DSDateHeader label="Astăzi" total={125.50} />
            <DSTransactionRow
              title="Prânz la restaurant"
              amount={45.50}
              category={{ name: 'Mâncare', icon: 'restaurant', color: '#F59E0B' }}
              date="12:30"
              paymentMethod="Card"
              onPress={() => {}}
            />
            <DSTransactionRow
              title="Uber"
              amount={32.00}
              category={{ name: 'Transport', icon: 'car', color: '#3B82F6' }}
              date="09:15"
              paymentMethod="Card"
              selected
              showCheckbox
            />
            <DSDateHeader label="Ieri" total={248.00} />
            <DSTransactionRow
              title="Cumpărături Carrefour"
              amount={248.00}
              category={{ name: 'Cumpărături', icon: 'cart', color: '#EC4899' }}
              date="18:45"
              paymentMethod="Numerar"
            />
          </DSCard>
          
          <View style={styles.spacerLg} />
          
          <DSCard padding={0}>
            <DSListItem
              title="Setări cont"
              subtitle="Email, parolă, securitate"
              icon="person"
              onPress={() => {}}
            />
            <DSListItem
              title="Notificări"
              subtitle="Alerte și notificări push"
              icon="notifications"
              onPress={() => {}}
              rightElement={
                <Switch
                  value={true}
                  trackColor={{ false: colors.border.primary, true: colors.primary.default }}
                  thumbColor="#FFFFFF"
                />
              }
            />
            <DSListItem
              title="Șterge contul"
              subtitle="Această acțiune este permanentă"
              icon="trash"
              destructive
              onPress={() => {}}
            />
          </DSCard>
        </Section>
        
        {/* Navigation */}
        <Section title="Navigation">
          <Subsection title="Segmented Control">
            <DSSegmentedControl
              segments={[
                { key: 'charts', label: 'Grafice', icon: 'bar-chart' },
                { key: 'table', label: 'Tabel', icon: 'grid' },
              ]}
              selectedKey={selectedSegment}
              onChange={setSelectedSegment}
              fullWidth
            />
          </Subsection>
          
          <Subsection title="Small Segmented">
            <DSSegmentedControl
              segments={[
                { key: '1m', label: '1L' },
                { key: '3m', label: '3L' },
                { key: '6m', label: '6L' },
                { key: '12m', label: '12L' },
              ]}
              selectedKey="3m"
              onChange={() => {}}
              size="sm"
            />
          </Subsection>
        </Section>
        
        {/* Tables */}
        <Section title="Tables">
          <DSCard padding={0}>
            <View style={{ padding: Spacing.md, paddingBottom: 0 }}>
              <Text style={[Typography.title.sm, { color: colors.text.primary }]}>Categorii</Text>
            </View>
            <DSCategoryTable
              data={categoryTableData}
              onRowPress={(row) => console.log('Row pressed:', row)}
            />
          </DSCard>
        </Section>
        
        {/* Feedback */}
        <Section title="Feedback">
          <Subsection title="Banners">
            <DSBanner
              type="info"
              title="Informație"
              message="Ai o actualizare disponibilă"
              action={{ label: 'Actualizează', onPress: () => {} }}
              style={styles.bannerMargin}
            />
            <DSBanner
              type="success"
              title="Succes"
              message="Cheltuiala a fost salvată"
              onDismiss={() => {}}
              style={styles.bannerMargin}
            />
            <DSBanner
              type="warning"
              title="Atenție"
              message="Ai atins 80% din buget"
              style={styles.bannerMargin}
            />
            <DSBanner
              type="error"
              title="Eroare"
              message="Nu s-a putut procesa cererea"
              action={{ label: 'Reîncearcă', onPress: () => {} }}
            />
          </Subsection>
          
          <Subsection title="Skeleton Loaders">
            <DSSkeleton width="80%" height={20} style={styles.skeletonMargin} />
            <DSSkeleton width="60%" height={14} style={styles.skeletonMargin} />
            <DSSkeletonCard />
          </Subsection>
          
          <Subsection title="Empty State">
            <DSCard>
              <DSEmptyState
                icon="receipt-outline"
                title="Nicio tranzacție"
                description="Adaugă prima ta cheltuială pentru a începe"
                action={{ label: 'Adaugă', onPress: () => {} }}
              />
            </DSCard>
          </Subsection>
        </Section>
        
        {/* Spacing reference */}
        <Section title="Spacing Scale">
          <DSCard>
            {Object.entries(Spacing).map(([name, value]) => (
              <View key={name} style={styles.spacingRow}>
                <Text style={[Typography.label.sm, { color: colors.text.secondary, width: 60 }]}>
                  {name}
                </Text>
                <View style={[styles.spacingBar, { width: value, backgroundColor: colors.primary.default }]} />
                <Text style={[Typography.caption.md, { color: colors.text.tertiary }]}>
                  {value}px
                </Text>
              </View>
            ))}
          </DSCard>
        </Section>
        
        {/* Radius reference */}
        <Section title="Radius Scale">
          <View style={styles.radiusRow}>
            {[0, 4, 8, 12, 16, 20, 24, 50].map((r) => (
              <View
                key={r}
                style={[
                  styles.radiusBox,
                  {
                    borderRadius: r,
                    backgroundColor: colors.primary.subtle,
                    borderColor: colors.primary.default,
                  },
                ]}
              >
                <Text style={[Typography.caption.sm, { color: colors.primary.default }]}>{r}</Text>
              </View>
            ))}
          </View>
        </Section>
        
        <View style={styles.footer} />
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
  themeToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginBottom: Spacing.lg,
  },
  themeLabel: {
    ...Typography.label.md,
  },
  section: {
    marginBottom: Spacing.xxl,
  },
  sectionTitle: {
    ...Typography.title.lg,
    marginBottom: Spacing.md,
  },
  subsection: {
    marginTop: Spacing.md,
  },
  subsectionTitle: {
    ...Typography.label.sm,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
  },
  spacer: {
    height: Spacing.md,
  },
  spacerLg: {
    height: Spacing.lg,
  },
  // Colors
  colorRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  colorSwatch: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
  },
  colorSwatchSmall: {
    width: 32,
    height: 32,
    borderRadius: Radius.sm,
  },
  // Buttons
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
    flexWrap: 'wrap',
  },
  // Cards
  cardMargin: {
    marginBottom: Spacing.sm,
  },
  kpiRow: {
    flexDirection: 'row',
  },
  chartPlaceholder: {
    height: 120,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Icons & Chips
  iconRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'center',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  cardRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  // Feedback
  bannerMargin: {
    marginBottom: Spacing.sm,
  },
  skeletonMargin: {
    marginBottom: Spacing.sm,
  },
  // Spacing reference
  spacingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
    gap: Spacing.sm,
  },
  spacingBar: {
    height: 8,
    borderRadius: 4,
  },
  // Radius reference
  radiusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  radiusBox: {
    width: 48,
    height: 48,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    height: 100,
  },
});
