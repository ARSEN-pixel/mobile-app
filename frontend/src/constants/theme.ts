// SpendWise Premium - Design System

export const Colors = {
  light: {
    // Primary colors
    primary: '#6366F1',
    primaryLight: '#818CF8',
    primaryDark: '#4F46E5',
    
    // Background
    background: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    
    // Text
    text: '#0F172A',
    textSecondary: '#64748B',
    textTertiary: '#94A3B8',
    
    // Borders & Dividers
    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    
    // Status colors
    success: '#10B981',
    successLight: '#D1FAE5',
    warning: '#F59E0B',
    warningLight: '#FEF3C7',
    error: '#EF4444',
    errorLight: '#FEE2E2',
    info: '#3B82F6',
    infoLight: '#DBEAFE',
    
    // Tab bar
    tabBar: '#FFFFFF',
    tabBarInactive: '#94A3B8',
    
    // Card shadows
    shadow: 'rgba(15, 23, 42, 0.08)',
  },
  dark: {
    // Primary colors
    primary: '#818CF8',
    primaryLight: '#A5B4FC',
    primaryDark: '#6366F1',
    
    // Background
    background: '#0F172A',
    surface: '#1E293B',
    surfaceElevated: '#334155',
    
    // Text
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    textTertiary: '#64748B',
    
    // Borders & Dividers
    border: '#334155',
    borderLight: '#1E293B',
    
    // Status colors
    success: '#34D399',
    successLight: '#064E3B',
    warning: '#FBBF24',
    warningLight: '#78350F',
    error: '#F87171',
    errorLight: '#7F1D1D',
    info: '#60A5FA',
    infoLight: '#1E3A8A',
    
    // Tab bar
    tabBar: '#1E293B',
    tabBarInactive: '#64748B',
    
    // Card shadows
    shadow: 'rgba(0, 0, 0, 0.3)',
  },
};

export const Typography = {
  // Display
  displayLarge: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  displayMedium: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 36,
    letterSpacing: -0.3,
  },
  displaySmall: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
    letterSpacing: -0.2,
  },
  
  // Headlines
  headlineLarge: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  headlineMedium: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  headlineSmall: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 22,
  },
  
  // Body
  bodyLarge: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  bodySmall: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
  
  // Labels
  labelLarge: {
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 20,
  },
  labelMedium: {
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 16,
  },
  labelSmall: {
    fontSize: 10,
    fontWeight: '500' as const,
    lineHeight: 14,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const Shadow = {
  sm: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  xl: {
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
};

// Category colors for expense categories
export const CategoryColors = [
  '#6366F1', // Indigo
  '#EC4899', // Pink
  '#8B5CF6', // Purple
  '#14B8A6', // Teal
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#10B981', // Emerald
  '#3B82F6', // Blue
  '#F97316', // Orange
  '#84CC16', // Lime
  '#06B6D4', // Cyan
  '#A855F7', // Violet
];

// Default expense categories
export const DefaultCategories = [
  { name: 'Mâncare', icon: 'restaurant', color: '#F59E0B' },
  { name: 'Transport', icon: 'car', color: '#3B82F6' },
  { name: 'Cumpărături', icon: 'cart', color: '#EC4899' },
  { name: 'Divertisment', icon: 'game-controller', color: '#8B5CF6' },
  { name: 'Sănătate', icon: 'medkit', color: '#EF4444' },
  { name: 'Facturi', icon: 'document-text', color: '#14B8A6' },
  { name: 'Educație', icon: 'school', color: '#6366F1' },
  { name: 'Sport', icon: 'fitness', color: '#10B981' },
  { name: 'Cadouri', icon: 'gift', color: '#F97316' },
  { name: 'Altele', icon: 'ellipsis-horizontal', color: '#64748B' },
];

export const PaymentMethods = [
  { id: 'cash', name: 'Numerar', icon: 'cash' },
  { id: 'card', name: 'Card', icon: 'card' },
  { id: 'transfer', name: 'Transfer', icon: 'swap-horizontal' },
  { id: 'other', name: 'Altele', icon: 'ellipsis-horizontal' },
];
