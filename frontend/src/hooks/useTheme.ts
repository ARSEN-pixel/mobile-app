// SpendWise Premium - Theme Hook

import { useColorScheme } from 'react-native';
import { Colors } from '../constants/theme';
import { useStore } from '../store/useStore';

export function useTheme() {
  const systemTheme = useColorScheme();
  const themePreference = useStore((state) => state.theme);
  
  // Determine actual theme based on preference
  const actualTheme = themePreference === 'system' 
    ? (systemTheme || 'light') 
    : themePreference;
  
  const isDark = actualTheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;
  
  return {
    theme: actualTheme,
    isDark,
    colors,
    themePreference,
  };
}
