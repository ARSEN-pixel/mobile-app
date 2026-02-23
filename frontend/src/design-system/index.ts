/**
 * SpendWise Premium - Design System
 * 
 * Central export for all design system tokens, components, and utilities.
 */

// Tokens
export * from './tokens';
export * from './colors';

// Re-export everything for convenience
export { Spacing, Radius, Elevation, Typography, Border, Opacity, Duration, Easing, Layout, ZIndex } from './tokens';
export { LightTheme, DarkTheme, ChartColors, Colors } from './colors';

// Chart style guidelines
export const ChartStyles = {
  // Axis styling
  axis: {
    thickness: 0, // Hide axis lines for cleaner look
    labelStyle: {
      fontSize: 10,
      fontWeight: '500' as const,
    },
  },
  
  // Grid styling
  grid: {
    strokeDashArray: [4, 4],
    opacity: 0.3,
  },
  
  // Bar chart
  bar: {
    borderRadius: 4,
    spacing: 12,
    barWidth: 24,
    animationDuration: 300,
  },
  
  // Pie/Donut chart
  donut: {
    radius: 100,
    innerRadius: 65,
    animationDuration: 500,
  },
  
  // Line chart
  line: {
    strokeWidth: 2,
    dotRadius: 4,
    activeDotRadius: 6,
    animationDuration: 400,
  },
  
  // Tooltips
  tooltip: {
    borderRadius: 8,
    padding: 8,
    animationDuration: 150,
  },
};

// Screen layout presets
export const ScreenLayouts = {
  // Dashboard - Cards in a grid
  dashboard: {
    padding: 16,
    cardGap: 12,
    sectionGap: 24,
  },
  
  // Transactions - Grouped list
  transactions: {
    padding: 16,
    headerHeight: 32,
    itemHeight: 64,
    sectionGap: 8,
  },
  
  // Form screens
  form: {
    padding: 16,
    fieldGap: 16,
    sectionGap: 24,
  },
  
  // Insights - Charts and tables
  insights: {
    padding: 16,
    chartHeight: 200,
    cardGap: 16,
  },
  
  // Settings - List style
  settings: {
    padding: 16,
    itemHeight: 56,
    sectionGap: 24,
  },
};
