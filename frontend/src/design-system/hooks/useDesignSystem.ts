/**
 * SpendWise Premium - Design System Hooks
 * 
 * React hooks for accessing design system tokens and themes.
 */

import { useColorScheme } from 'react-native';
import { useMemo } from 'react';
import { LightTheme, DarkTheme, ThemeColors } from '../colors';
import { Spacing, Radius, Elevation, Typography, Duration, Layout } from '../tokens';
import { useStore } from '../../store/useStore';

export interface DesignSystemContext {
  // Theme
  theme: 'light' | 'dark';
  isDark: boolean;
  colors: ThemeColors;
  
  // Tokens
  spacing: typeof Spacing;
  radius: typeof Radius;
  elevation: typeof Elevation;
  typography: typeof Typography;
  duration: typeof Duration;
  layout: typeof Layout;
}

/**
 * Main hook for accessing the design system
 */
export function useDesignSystem(): DesignSystemContext {
  const systemTheme = useColorScheme();
  const themePreference = useStore((state) => state.theme);
  
  const theme = useMemo(() => {
    if (themePreference === 'system') {
      return systemTheme || 'light';
    }
    return themePreference;
  }, [themePreference, systemTheme]);
  
  const isDark = theme === 'dark';
  const colors = isDark ? DarkTheme : LightTheme;
  
  return {
    theme,
    isDark,
    colors,
    spacing: Spacing,
    radius: Radius,
    elevation: Elevation,
    typography: Typography,
    duration: Duration,
    layout: Layout,
  };
}

/**
 * Hook for just colors (lightweight)
 */
export function useColors(): ThemeColors {
  const systemTheme = useColorScheme();
  const themePreference = useStore((state) => state.theme);
  
  return useMemo(() => {
    const theme = themePreference === 'system' 
      ? (systemTheme || 'light') 
      : themePreference;
    return theme === 'dark' ? DarkTheme : LightTheme;
  }, [themePreference, systemTheme]);
}

/**
 * Hook for creating elevation style with theme-aware shadow color
 */
export function useElevation(level: keyof typeof Elevation) {
  const { colors } = useDesignSystem();
  
  return useMemo(() => ({
    ...Elevation[level],
    shadowColor: colors.shadow,
  }), [level, colors.shadow]);
}
