/**
 * SpendWise Premium - Text Field Components
 * 
 * Input fields with prefix, suffix, validation, helper text.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Animated,
  ViewStyle,
  TextInputProps,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDesignSystem } from '../hooks/useDesignSystem';
import { Spacing, Radius, Typography, Duration, Border } from '../tokens';

interface DSTextFieldProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  helperText?: string;
  prefix?: string | React.ReactNode;
  suffix?: string | React.ReactNode;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  disabled?: boolean;
  containerStyle?: ViewStyle;
}

export function DSTextField({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  helperText,
  prefix,
  suffix,
  leftIcon,
  rightIcon,
  onRightIconPress,
  disabled = false,
  containerStyle,
  ...rest
}: DSTextFieldProps) {
  const { colors } = useDesignSystem();
  const [isFocused, setIsFocused] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(borderAnim, {
      toValue: isFocused ? 1 : 0,
      duration: Duration.fast,
      useNativeDriver: false,
    }).start();
  }, [isFocused]);
  
  const getBorderColor = () => {
    if (error) return colors.error.default;
    if (isFocused) return colors.primary.default;
    return colors.border.primary;
  };
  
  const animatedBorderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border.primary, colors.primary.default],
  });
  
  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[
          styles.label,
          { color: error ? colors.error.default : colors.text.secondary },
        ]}>
          {label}
        </Text>
      )}
      
      <Animated.View
        style={[
          styles.inputContainer,
          {
            backgroundColor: disabled ? colors.background.secondary : colors.surface.primary,
            borderColor: error ? colors.error.default : animatedBorderColor,
            borderWidth: isFocused || error ? 2 : Border.thin,
          },
        ]}
      >
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={20}
            color={colors.icon.secondary}
            style={styles.leftIcon}
          />
        )}
        
        {prefix && (
          <View style={styles.prefix}>
            {typeof prefix === 'string' ? (
              <Text style={[styles.prefixText, { color: colors.text.secondary }]}>{prefix}</Text>
            ) : prefix}
          </View>
        )}
        
        <TextInput
          style={[
            styles.input,
            {
              color: disabled ? colors.text.disabled : colors.text.primary,
            },
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.text.tertiary}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          editable={!disabled}
          {...rest}
        />
        
        {suffix && (
          <View style={styles.suffix}>
            {typeof suffix === 'string' ? (
              <Text style={[styles.suffixText, { color: colors.text.secondary }]}>{suffix}</Text>
            ) : suffix}
          </View>
        )}
        
        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
            style={styles.rightIcon}
          >
            <Ionicons
              name={rightIcon}
              size={20}
              color={colors.icon.secondary}
            />
          </TouchableOpacity>
        )}
      </Animated.View>
      
      {(error || helperText) && (
        <Text style={[
          styles.helperText,
          { color: error ? colors.error.default : colors.text.tertiary },
        ]}>
          {error || helperText}
        </Text>
      )}
    </View>
  );
}

// ============================================
// CURRENCY INPUT
// ============================================
interface DSCurrencyInputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  currency?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  containerStyle?: ViewStyle;
  autoFocus?: boolean;
}

export function DSCurrencyInput({
  label,
  value,
  onChangeText,
  currency = 'RON',
  error,
  helperText,
  disabled = false,
  containerStyle,
  autoFocus,
}: DSCurrencyInputProps) {
  const { colors } = useDesignSystem();
  
  const handleChange = (text: string) => {
    // Allow only numbers and one decimal point
    const cleaned = text.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    if (parts.length > 2) return;
    if (parts[1]?.length > 2) return;
    onChangeText(cleaned);
  };
  
  return (
    <View style={[styles.currencyContainer, containerStyle]}>
      {label && (
        <Text style={[styles.label, { color: colors.text.secondary }]}>{label}</Text>
      )}
      <View style={styles.currencyInputRow}>
        <Text style={[styles.currencySymbol, { color: colors.text.primary }]}>{currency}</Text>
        <TextInput
          style={[styles.currencyInput, { color: colors.text.primary }]}
          value={value}
          onChangeText={handleChange}
          keyboardType="decimal-pad"
          placeholder="0.00"
          placeholderTextColor={colors.text.tertiary}
          editable={!disabled}
          autoFocus={autoFocus}
        />
      </View>
      {(error || helperText) && (
        <Text style={[
          styles.helperText,
          { color: error ? colors.error.default : colors.text.tertiary },
        ]}>
          {error || helperText}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    ...Typography.label.sm,
    marginBottom: Spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.md,
    minHeight: 48,
    paddingHorizontal: Spacing.md,
  },
  leftIcon: {
    marginRight: Spacing.sm,
  },
  rightIcon: {
    marginLeft: Spacing.sm,
    padding: Spacing.xxs,
  },
  prefix: {
    marginRight: Spacing.xs,
  },
  prefixText: {
    ...Typography.body.md,
  },
  suffix: {
    marginLeft: Spacing.xs,
  },
  suffixText: {
    ...Typography.body.md,
  },
  input: {
    flex: 1,
    ...Typography.body.md,
    padding: 0,
    margin: 0,
  },
  helperText: {
    ...Typography.caption.md,
    marginTop: Spacing.xxs,
    marginLeft: Spacing.xxs,
  },
  // Currency Input
  currencyContainer: {
    marginBottom: Spacing.md,
  },
  currencyInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    ...Typography.title.md,
    marginRight: Spacing.sm,
  },
  currencyInput: {
    flex: 1,
    fontSize: 40,
    fontWeight: '700',
    padding: 0,
  },
});
