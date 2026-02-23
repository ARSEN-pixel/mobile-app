/**
 * SpendWise Premium - Design System Documentation
 * 
 * Complete reference for all design tokens, components, and guidelines.
 */

# SpendWise Premium Design System

## Overview

This design system provides a cohesive, premium fintech experience inspired by modern neo-banks.
All components are built with accessibility, performance, and consistency in mind.

---

## 1. Foundations / Tokens

### Spacing Scale
```
xxxs: 2px   - Micro spacing, icon adjustments
xxs:  4px   - Tight spacing, inline elements
xs:   8px   - Small spacing, compact layouts
sm:   12px  - Medium-small, form elements
md:   16px  - Default spacing
lg:   20px  - Medium-large
xl:   24px  - Large spacing, section gaps
xxl:  32px  - Extra large, major sections
xxxl: 40px  - Page margins
xxxxl: 48px - Hero sections
```

### Radius Scale
```
none: 0px     - Sharp corners
xs:   4px     - Subtle rounding
sm:   8px     - Small elements, chips
md:   12px    - Default cards
lg:   16px    - Large cards, modals
xl:   20px    - Extra large
xxl:  24px    - Hero cards
full: 9999px  - Pill/full round
```

### Elevation / Shadows
Subtle, fintech-grade shadows:
- `none` - No shadow
- `xs` - Subtle lift (cards at rest)
- `sm` - Light lift (interactive cards)
- `md` - Medium elevation (elevated cards)
- `lg` - High elevation (modals, popovers)
- `xl` - Highest (FABs)

### Typography Scale
```
Display:
  xl: 48px/56px, weight 700, tracking -1
  lg: 40px/48px, weight 700, tracking -0.8
  md: 32px/40px, weight 700, tracking -0.5
  sm: 28px/36px, weight 600, tracking -0.3

Title:
  lg: 24px/32px, weight 600, tracking -0.2
  md: 20px/28px, weight 600, tracking -0.1
  sm: 18px/24px, weight 600

Body:
  lg: 16px/24px, weight 400
  md: 14px/20px, weight 400
  sm: 12px/16px, weight 400

Label:
  lg: 16px/22px, weight 500
  md: 14px/20px, weight 500
  sm: 12px/16px, weight 500, tracking 0.1
  xs: 10px/14px, weight 500, tracking 0.2

Caption:
  md: 12px/16px, weight 400, tracking 0.1
  sm: 10px/14px, weight 400, tracking 0.2
```

### Border Tokens
```
hairline: 0.5px - Retina displays
thin:     1px   - Standard border
medium:   1.5px - Emphasis
thick:    2px   - Strong emphasis
```

### Opacity Tokens
```
transparent: 0
disabled:    0.4
muted:       0.6
soft:        0.8
overlay:     0.12
backdrop:    0.5
scrim:       0.7
opaque:      1
```

### Motion Tokens
Durations:
- `instant`: 100ms - Micro interactions
- `fast`: 150ms - Quick feedback
- `normal`: 200ms - Standard transitions
- `slow`: 300ms - Smooth animations
- `slower`: 400ms - Complex animations
- `slowest`: 500ms - Major transitions

Easing:
- `standard`: [0.4, 0, 0.2, 1] - Most animations
- `decelerate`: [0, 0, 0.2, 1] - Elements entering
- `accelerate`: [0.4, 0, 1, 1] - Elements leaving
- `overshoot`: [0.175, 0.885, 0.32, 1.275] - Bounce

### Haptics Usage
- **Selection**: Light - toggles, selection changes
- **Impact**: Medium - button presses, successful actions
- **Heavy**: Heavy - errors, destructive actions
- **Notification**: success/warning/error - budget alerts

---

## 2. Color System

### Light Theme
```
Background:
  primary:   #F8FAFC
  secondary: #F1F5F9
  tertiary:  #E2E8F0

Surface:
  primary:   #FFFFFF
  elevated:  #FFFFFF
  secondary: #F8FAFC

Text:
  primary:   #0F172A
  secondary: #475569
  tertiary:  #94A3B8
  disabled:  #CBD5E1
  link:      #4F46E5

Primary:
  default:   #6366F1 (Indigo-500)
  light:     #818CF8
  dark:      #4F46E5
  subtle:    #EEF2FF

Semantic:
  Success:   #10B981 / subtle: #ECFDF5
  Warning:   #F59E0B / subtle: #FFFBEB
  Error:     #EF4444 / subtle: #FEF2F2
  Info:      #3B82F6 / subtle: #EFF6FF
```

### Dark Theme
```
Background:
  primary:   #020617
  secondary: #0F172A
  tertiary:  #1E293B

Surface:
  primary:   #0F172A
  elevated:  #1E293B
  secondary: #1E293B

Text:
  primary:   #F8FAFC
  secondary: #94A3B8
  tertiary:  #64748B
  disabled:  #475569
  link:      #818CF8

Primary:
  default:   #818CF8 (Indigo-400)
  light:     #A5B4FC
  dark:      #6366F1
  subtle:    rgba(99, 102, 241, 0.15)
```

### Chart Colors
Primary palette (works on both themes):
```
#6366F1  Indigo
#EC4899  Pink
#8B5CF6  Purple
#14B8A6  Teal
#F59E0B  Amber
#EF4444  Red
#10B981  Emerald
#3B82F6  Blue
#F97316  Orange
#84CC16  Lime
#06B6D4  Cyan
#A855F7  Violet
```

---

## 3. Components

### Cards
- **DSCard**: Base card (flat, elevated, outline variants)
- **DSKPICard**: Stats card with icon, value, trend
- **DSChartCard**: Chart wrapper with title, legend, action

### Buttons
- **DSButton**: primary, secondary, tertiary, ghost, danger
- **DSIconButton**: filled, tonal, outlined, ghost

### Text Fields
- **DSTextField**: Label, prefix/suffix, validation, helper text
- **DSCurrencyInput**: Specialized for currency amounts

### Chips & Categories
- **DSCategoryIcon**: Icon with colored background
- **DSCategoryChip**: Compact, for filters
- **DSCategoryCard**: Larger, for selection
- **DSFilterChip**: Generic filter chip

### Lists
- **DSSectionHeader**: Section title with action
- **DSTransactionRow**: Expense list item
- **DSListItem**: Settings-style list item
- **DSDateHeader**: Grouped list date header

### Feedback
- **DSEmptyState**: Icon, title, description, action
- **DSSkeleton**: Loading placeholder
- **DSSkeletonCard**: Transaction card placeholder
- **DSBanner**: Info, success, warning, error banners
- **DSToast**: Temporary notification

### Tables
- **DSTable**: Generic sortable table
- **DSCategoryTable**: Category breakdown table

### Navigation
- **DSAppBar**: Header with title, icons
- **DSSegmentedControl**: Tab/filter selector

---

## 4. Chart Guidelines

### Bar Chart
- Bar width: 24px
- Spacing: 12px
- Border radius: 4px
- Animation: 300ms

### Donut Chart
- Outer radius: 100px
- Inner radius: 65px (65%)
- Animation: 500ms

### Styling Rules
- Hide axis lines for cleaner look
- Use dashed gridlines (4, 4) at 30% opacity
- Tooltips: 8px radius, 8px padding
- Use chart color palette for consistency
- Always animate data transitions

---

## 5. Micro-interactions

### Card Press
```javascript
scale: 0.98
duration: 150ms
easing: spring(speed: 50, bounciness: 4)
```

### Button Press
```javascript
scale: 0.97
duration: 150ms
haptics: ImpactFeedbackStyle.Medium
```

### Skeleton Loading
```javascript
opacity: 0.3 → 0.7 → 0.3
duration: 600ms per cycle
```

### Haptics Usage
- Add expense: Medium impact
- Successful save: Notification success
- Budget threshold: Notification warning
- Error: Notification error
- Selection change: Selection feedback

---

## 6. Accessibility

### Contrast Requirements
- Text on background: minimum 4.5:1 ratio
- Large text (18px+ bold): minimum 3:1 ratio
- Icons: minimum 3:1 ratio

### Touch Targets
- Minimum size: 44x44 points
- Spacing between targets: minimum 8px

### Focus States
- 2px focus ring using `border.focus` color
- Visible on keyboard navigation
