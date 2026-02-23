/**
 * SpendWise Premium - Design System Tokens
 * 
 * Complete design token system for premium fintech UI.
 * All values are carefully chosen for accessibility and visual consistency.
 */

// ============================================
// SPACING SCALE
// ============================================
// Based on 4px base unit, following 4-point grid system
export const Spacing = {
  /** 2px - Micro spacing, icon adjustments */
  xxxs: 2,
  /** 4px - Tight spacing, inline elements */
  xxs: 4,
  /** 8px - Small spacing, compact layouts */
  xs: 8,
  /** 12px - Medium-small, form elements */
  sm: 12,
  /** 16px - Default spacing */
  md: 16,
  /** 20px - Medium-large */
  lg: 20,
  /** 24px - Large spacing, section gaps */
  xl: 24,
  /** 32px - Extra large, major sections */
  xxl: 32,
  /** 40px - Page margins */
  xxxl: 40,
  /** 48px - Hero sections */
  xxxxl: 48,
} as const;

// ============================================
// RADIUS SCALE
// ============================================
export const Radius = {
  /** 0px - Sharp corners */
  none: 0,
  /** 4px - Subtle rounding */
  xs: 4,
  /** 8px - Small elements, chips */
  sm: 8,
  /** 12px - Default cards */
  md: 12,
  /** 16px - Large cards, modals */
  lg: 16,
  /** 20px - Extra large */
  xl: 20,
  /** 24px - Hero cards */
  xxl: 24,
  /** 9999px - Pill/full round */
  full: 9999,
} as const;

// ============================================
// ELEVATION / SHADOWS
// ============================================
// Subtle, fintech-grade shadows - not heavy or material-design like
export const Elevation = {
  /** No shadow */
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  /** Subtle lift - cards at rest */
  xs: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  /** Light lift - interactive cards */
  sm: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  /** Medium elevation - elevated cards */
  md: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  /** High elevation - modals, popovers */
  lg: {
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 6,
  },
  /** Highest - floating action buttons */
  xl: {
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
} as const;

// ============================================
// TYPOGRAPHY SCALE
// ============================================
export const Typography = {
  // Display - Hero numbers, main amounts
  display: {
    xl: {
      fontSize: 48,
      fontWeight: '700' as const,
      lineHeight: 56,
      letterSpacing: -1,
    },
    lg: {
      fontSize: 40,
      fontWeight: '700' as const,
      lineHeight: 48,
      letterSpacing: -0.8,
    },
    md: {
      fontSize: 32,
      fontWeight: '700' as const,
      lineHeight: 40,
      letterSpacing: -0.5,
    },
    sm: {
      fontSize: 28,
      fontWeight: '600' as const,
      lineHeight: 36,
      letterSpacing: -0.3,
    },
  },
  
  // Title - Section headers, card titles
  title: {
    lg: {
      fontSize: 24,
      fontWeight: '600' as const,
      lineHeight: 32,
      letterSpacing: -0.2,
    },
    md: {
      fontSize: 20,
      fontWeight: '600' as const,
      lineHeight: 28,
      letterSpacing: -0.1,
    },
    sm: {
      fontSize: 18,
      fontWeight: '600' as const,
      lineHeight: 24,
      letterSpacing: 0,
    },
  },
  
  // Body - Main content text
  body: {
    lg: {
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 24,
      letterSpacing: 0,
    },
    md: {
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 20,
      letterSpacing: 0,
    },
    sm: {
      fontSize: 12,
      fontWeight: '400' as const,
      lineHeight: 16,
      letterSpacing: 0,
    },
  },
  
  // Label - Form labels, buttons, navigation
  label: {
    lg: {
      fontSize: 16,
      fontWeight: '500' as const,
      lineHeight: 22,
      letterSpacing: 0,
    },
    md: {
      fontSize: 14,
      fontWeight: '500' as const,
      lineHeight: 20,
      letterSpacing: 0,
    },
    sm: {
      fontSize: 12,
      fontWeight: '500' as const,
      lineHeight: 16,
      letterSpacing: 0.1,
    },
    xs: {
      fontSize: 10,
      fontWeight: '500' as const,
      lineHeight: 14,
      letterSpacing: 0.2,
    },
  },
  
  // Caption - Helper text, timestamps
  caption: {
    md: {
      fontSize: 12,
      fontWeight: '400' as const,
      lineHeight: 16,
      letterSpacing: 0.1,
    },
    sm: {
      fontSize: 10,
      fontWeight: '400' as const,
      lineHeight: 14,
      letterSpacing: 0.2,
    },
  },
  
  // Mono - Numbers, codes
  mono: {
    lg: {
      fontSize: 16,
      fontWeight: '500' as const,
      lineHeight: 22,
      letterSpacing: 0.5,
      fontFamily: 'monospace',
    },
    md: {
      fontSize: 14,
      fontWeight: '500' as const,
      lineHeight: 20,
      letterSpacing: 0.5,
      fontFamily: 'monospace',
    },
  },
} as const;

// ============================================
// BORDER TOKENS
// ============================================
export const Border = {
  /** Hairline - 0.5px for retina displays */
  hairline: 0.5,
  /** Thin - 1px standard border */
  thin: 1,
  /** Medium - 1.5px emphasis */
  medium: 1.5,
  /** Thick - 2px strong emphasis */
  thick: 2,
} as const;

// ============================================
// OPACITY TOKENS
// ============================================
export const Opacity = {
  /** Fully transparent */
  transparent: 0,
  /** Disabled state */
  disabled: 0.4,
  /** Inactive/muted elements */
  muted: 0.6,
  /** Slightly transparent */
  soft: 0.8,
  /** Hover/press overlays */
  overlay: 0.12,
  /** Modal backdrop */
  backdrop: 0.5,
  /** Scrim/dimming */
  scrim: 0.7,
  /** Fully opaque */
  opaque: 1,
} as const;

// ============================================
// MOTION TOKENS
// ============================================
export const Duration = {
  /** 100ms - Micro interactions */
  instant: 100,
  /** 150ms - Quick feedback */
  fast: 150,
  /** 200ms - Standard transitions */
  normal: 200,
  /** 300ms - Smooth animations */
  slow: 300,
  /** 400ms - Complex animations */
  slower: 400,
  /** 500ms - Major transitions */
  slowest: 500,
} as const;

export const Easing = {
  /** Standard easing for most animations */
  standard: [0.4, 0, 0.2, 1],
  /** Decelerate - Elements entering screen */
  decelerate: [0, 0, 0.2, 1],
  /** Accelerate - Elements leaving screen */
  accelerate: [0.4, 0, 1, 1],
  /** Overshoot - Playful bounce effect */
  overshoot: [0.175, 0.885, 0.32, 1.275],
  /** Linear - Progress indicators */
  linear: [0, 0, 1, 1],
} as const;

// ============================================
// HAPTICS USAGE RULES
// ============================================
export const HapticsUsage = {
  // Light - Selection changes, toggles
  selection: 'light',
  // Medium - Button presses, successful actions
  impact: 'medium',
  // Heavy - Errors, destructive actions
  heavy: 'heavy',
  // Notification - Budget alerts, success/error feedback
  notification: {
    success: 'success',
    warning: 'warning',
    error: 'error',
  },
} as const;

// ============================================
// LAYOUT TOKENS
// ============================================
export const Layout = {
  /** Screen horizontal padding */
  screenPadding: 16,
  /** Card internal padding */
  cardPadding: 16,
  /** List item height */
  listItemHeight: 64,
  /** Compact list item height */
  listItemCompactHeight: 52,
  /** Tab bar height */
  tabBarHeight: 64,
  /** iOS tab bar height with home indicator */
  tabBarHeightWithSafeArea: 88,
  /** Header height */
  headerHeight: 56,
  /** Touch target minimum */
  touchTargetMin: 44,
  /** Button minimum width */
  buttonMinWidth: 64,
  /** Icon button size */
  iconButtonSize: 44,
  /** Avatar sizes */
  avatarSize: {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64,
    xxl: 80,
  },
} as const;

// ============================================
// Z-INDEX SCALE
// ============================================
export const ZIndex = {
  /** Background elements */
  background: -1,
  /** Default layer */
  base: 0,
  /** Elevated cards */
  elevated: 1,
  /** Sticky headers */
  sticky: 10,
  /** Tab bar */
  tabBar: 50,
  /** Modal backdrop */
  backdrop: 100,
  /** Modals, bottom sheets */
  modal: 200,
  /** Toasts, snackbars */
  toast: 300,
  /** Tooltips */
  tooltip: 400,
} as const;
