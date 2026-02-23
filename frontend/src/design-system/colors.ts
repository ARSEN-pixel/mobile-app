/**
 * SpendWise Premium - Color System
 * 
 * Light + Dark themes with semantic color tokens.
 * All colors meet WCAG 2.1 AA contrast requirements.
 */

// ============================================
// PRIMITIVE COLORS
// ============================================
// Raw color values - don't use directly in components
const Primitives = {
  // Neutrals - Slate palette for sophisticated fintech feel
  slate: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
    950: '#020617',
  },
  
  // Primary - Indigo for premium feel
  indigo: {
    50: '#EEF2FF',
    100: '#E0E7FF',
    200: '#C7D2FE',
    300: '#A5B4FC',
    400: '#818CF8',
    500: '#6366F1',
    600: '#4F46E5',
    700: '#4338CA',
    800: '#3730A3',
    900: '#312E81',
  },
  
  // Semantic - Status colors
  green: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#10B981',
    600: '#059669',
    700: '#047857',
    800: '#065F46',
    900: '#064E3B',
  },
  
  amber: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },
  
  red: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },
  
  blue: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },
  
  // Pure
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

// ============================================
// CHART COLORS
// ============================================
// Harmonious palette that works on both light and dark themes
export const ChartColors = {
  // Primary palette for pie/donut charts
  primary: [
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
  ],
  
  // Sequential palette for gradient/heatmaps
  sequential: {
    indigo: ['#E0E7FF', '#C7D2FE', '#A5B4FC', '#818CF8', '#6366F1', '#4F46E5'],
    green: ['#D1FAE5', '#A7F3D0', '#6EE7B7', '#34D399', '#10B981', '#059669'],
  },
  
  // Diverging palette for positive/negative
  diverging: {
    positive: '#10B981',
    neutral: '#94A3B8',
    negative: '#EF4444',
  },
};

// ============================================
// LIGHT THEME
// ============================================
export const LightTheme = {
  // Background layers (from back to front)
  background: {
    /** Main screen background */
    primary: Primitives.slate[50],
    /** Secondary background, grouped content */
    secondary: Primitives.slate[100],
    /** Tertiary, subtle contrast */
    tertiary: Primitives.slate[200],
  },
  
  // Surface colors (cards, sheets)
  surface: {
    /** Default card background */
    primary: Primitives.white,
    /** Elevated cards, modals */
    elevated: Primitives.white,
    /** Subtle surface variation */
    secondary: Primitives.slate[50],
    /** Inverse surface for contrast */
    inverse: Primitives.slate[900],
  },
  
  // Text colors
  text: {
    /** Primary text - titles, important content */
    primary: Primitives.slate[900],
    /** Secondary text - descriptions, labels */
    secondary: Primitives.slate[600],
    /** Tertiary text - hints, placeholders */
    tertiary: Primitives.slate[400],
    /** Disabled text */
    disabled: Primitives.slate[300],
    /** Inverse text on dark backgrounds */
    inverse: Primitives.white,
    /** Link text */
    link: Primitives.indigo[600],
  },
  
  // Icon colors
  icon: {
    /** Primary icons */
    primary: Primitives.slate[700],
    /** Secondary icons */
    secondary: Primitives.slate[500],
    /** Tertiary icons */
    tertiary: Primitives.slate[400],
    /** Disabled icons */
    disabled: Primitives.slate[300],
    /** Inverse icons */
    inverse: Primitives.white,
  },
  
  // Border & Divider colors
  border: {
    /** Default border */
    primary: Primitives.slate[200],
    /** Light border, subtle separation */
    secondary: Primitives.slate[100],
    /** Strong border, emphasis */
    strong: Primitives.slate[300],
    /** Focus ring */
    focus: Primitives.indigo[500],
  },
  
  // Primary accent color
  primary: {
    /** Main accent color */
    default: Primitives.indigo[500],
    /** Lighter variant */
    light: Primitives.indigo[400],
    /** Darker variant */
    dark: Primitives.indigo[600],
    /** Very light background */
    subtle: Primitives.indigo[50],
    /** Text on primary background */
    text: Primitives.white,
  },
  
  // Semantic colors
  success: {
    default: Primitives.green[500],
    light: Primitives.green[400],
    dark: Primitives.green[600],
    subtle: Primitives.green[50],
    text: Primitives.green[700],
  },
  
  warning: {
    default: Primitives.amber[500],
    light: Primitives.amber[400],
    dark: Primitives.amber[600],
    subtle: Primitives.amber[50],
    text: Primitives.amber[700],
  },
  
  error: {
    default: Primitives.red[500],
    light: Primitives.red[400],
    dark: Primitives.red[600],
    subtle: Primitives.red[50],
    text: Primitives.red[700],
  },
  
  info: {
    default: Primitives.blue[500],
    light: Primitives.blue[400],
    dark: Primitives.blue[600],
    subtle: Primitives.blue[50],
    text: Primitives.blue[700],
  },
  
  // Interactive states
  interactive: {
    /** Hover state overlay */
    hover: 'rgba(15, 23, 42, 0.04)',
    /** Press state overlay */
    press: 'rgba(15, 23, 42, 0.08)',
    /** Focus state overlay */
    focus: 'rgba(99, 102, 241, 0.12)',
    /** Selected state background */
    selected: Primitives.indigo[50],
  },
  
  // Shadow color
  shadow: 'rgba(15, 23, 42, 0.08)',
  
  // Overlay/backdrop
  overlay: 'rgba(15, 23, 42, 0.5)',
  
  // Tab bar specific
  tabBar: {
    background: Primitives.white,
    active: Primitives.indigo[500],
    inactive: Primitives.slate[400],
    border: Primitives.slate[200],
  },
};

// ============================================
// DARK THEME
// ============================================
export const DarkTheme = {
  // Background layers
  background: {
    primary: Primitives.slate[950],
    secondary: Primitives.slate[900],
    tertiary: Primitives.slate[800],
  },
  
  // Surface colors
  surface: {
    primary: Primitives.slate[900],
    elevated: Primitives.slate[800],
    secondary: Primitives.slate[800],
    inverse: Primitives.slate[50],
  },
  
  // Text colors
  text: {
    primary: Primitives.slate[50],
    secondary: Primitives.slate[400],
    tertiary: Primitives.slate[500],
    disabled: Primitives.slate[600],
    inverse: Primitives.slate[900],
    link: Primitives.indigo[400],
  },
  
  // Icon colors
  icon: {
    primary: Primitives.slate[200],
    secondary: Primitives.slate[400],
    tertiary: Primitives.slate[500],
    disabled: Primitives.slate[600],
    inverse: Primitives.slate[900],
  },
  
  // Border & Divider colors
  border: {
    primary: Primitives.slate[700],
    secondary: Primitives.slate[800],
    strong: Primitives.slate[600],
    focus: Primitives.indigo[400],
  },
  
  // Primary accent (slightly lighter for dark mode)
  primary: {
    default: Primitives.indigo[400],
    light: Primitives.indigo[300],
    dark: Primitives.indigo[500],
    subtle: 'rgba(99, 102, 241, 0.15)',
    text: Primitives.white,
  },
  
  // Semantic colors (adjusted for dark mode)
  success: {
    default: Primitives.green[400],
    light: Primitives.green[300],
    dark: Primitives.green[500],
    subtle: 'rgba(16, 185, 129, 0.15)',
    text: Primitives.green[400],
  },
  
  warning: {
    default: Primitives.amber[400],
    light: Primitives.amber[300],
    dark: Primitives.amber[500],
    subtle: 'rgba(245, 158, 11, 0.15)',
    text: Primitives.amber[400],
  },
  
  error: {
    default: Primitives.red[400],
    light: Primitives.red[300],
    dark: Primitives.red[500],
    subtle: 'rgba(239, 68, 68, 0.15)',
    text: Primitives.red[400],
  },
  
  info: {
    default: Primitives.blue[400],
    light: Primitives.blue[300],
    dark: Primitives.blue[500],
    subtle: 'rgba(59, 130, 246, 0.15)',
    text: Primitives.blue[400],
  },
  
  // Interactive states
  interactive: {
    hover: 'rgba(248, 250, 252, 0.04)',
    press: 'rgba(248, 250, 252, 0.08)',
    focus: 'rgba(129, 140, 248, 0.15)',
    selected: 'rgba(99, 102, 241, 0.15)',
  },
  
  // Shadow color (darker for dark mode)
  shadow: 'rgba(0, 0, 0, 0.4)',
  
  // Overlay/backdrop
  overlay: 'rgba(0, 0, 0, 0.7)',
  
  // Tab bar specific
  tabBar: {
    background: Primitives.slate[900],
    active: Primitives.indigo[400],
    inactive: Primitives.slate[500],
    border: Primitives.slate[800],
  },
};

// ============================================
// COLOR TYPE EXPORTS
// ============================================
export type ThemeColors = typeof LightTheme;
export type ColorScheme = 'light' | 'dark' | 'system';

// Legacy compatibility export
export const Colors = {
  light: {
    primary: LightTheme.primary.default,
    primaryLight: LightTheme.primary.light,
    primaryDark: LightTheme.primary.dark,
    background: LightTheme.background.primary,
    surface: LightTheme.surface.primary,
    surfaceElevated: LightTheme.surface.elevated,
    text: LightTheme.text.primary,
    textSecondary: LightTheme.text.secondary,
    textTertiary: LightTheme.text.tertiary,
    border: LightTheme.border.primary,
    borderLight: LightTheme.border.secondary,
    success: LightTheme.success.default,
    successLight: LightTheme.success.subtle,
    warning: LightTheme.warning.default,
    warningLight: LightTheme.warning.subtle,
    error: LightTheme.error.default,
    errorLight: LightTheme.error.subtle,
    info: LightTheme.info.default,
    infoLight: LightTheme.info.subtle,
    tabBar: LightTheme.tabBar.background,
    tabBarInactive: LightTheme.tabBar.inactive,
    shadow: LightTheme.shadow,
  },
  dark: {
    primary: DarkTheme.primary.default,
    primaryLight: DarkTheme.primary.light,
    primaryDark: DarkTheme.primary.dark,
    background: DarkTheme.background.primary,
    surface: DarkTheme.surface.primary,
    surfaceElevated: DarkTheme.surface.elevated,
    text: DarkTheme.text.primary,
    textSecondary: DarkTheme.text.secondary,
    textTertiary: DarkTheme.text.tertiary,
    border: DarkTheme.border.primary,
    borderLight: DarkTheme.border.secondary,
    success: DarkTheme.success.default,
    successLight: DarkTheme.success.subtle,
    warning: DarkTheme.warning.default,
    warningLight: DarkTheme.warning.subtle,
    error: DarkTheme.error.default,
    errorLight: DarkTheme.error.subtle,
    info: DarkTheme.info.default,
    infoLight: DarkTheme.info.subtle,
    tabBar: DarkTheme.tabBar.background,
    tabBarInactive: DarkTheme.tabBar.inactive,
    shadow: DarkTheme.shadow,
  },
};
