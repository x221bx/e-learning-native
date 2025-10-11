import React from 'react';
import { Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../theme';
import { useColors } from '../theme/hooks';

export default function AppButton({ 
  label, 
  onPress, 
  variant = 'primary', 
  leftIcon, 
  rightIcon, 
  style, 
  textStyle,
  disabled = false,
  loading = false,
  size = 'medium'
}) {
  const colors = useColors();
  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';
  const isSecondary = variant === 'secondary';
  const isGhost = variant === 'ghost';
  
  const sizeStyles = {
    small: styles.sizeSmall,
    medium: styles.sizeMedium,
    large: styles.sizeLarge,
  };
  
  const textSizeStyles = {
    small: styles.textSmall,
    medium: styles.textMedium,
    large: styles.textLarge,
  };
  
  const iconSize = size === 'small' ? 16 : size === 'large' ? 22 : 18;
  
  const getIconColor = () => {
    if (disabled) return theme.colors.muted;
    if (isPrimary) return '#fff';
    if (isSecondary) return '#fff';
    return colors.primary;
  };
  
  const buttonContent = (
    <>
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={isPrimary || isSecondary ? '#fff' : colors.primary} 
          style={{ marginRight: 8 }}
        />
      ) : leftIcon ? (
        <Ionicons 
          name={leftIcon} 
          size={iconSize} 
          color={getIconColor()} 
          style={{ marginRight: 8 }} 
        />
      ) : null}
      <Text 
        style={[
          styles.text, 
          textSizeStyles[size],
          isPrimary && styles.textPrimary, 
          isOutline && styles.textOutline,
          isSecondary && styles.textSecondary,
          isGhost && styles.textGhost,
          disabled && styles.textDisabled,
          textStyle
        ]}
      >
        {label}
      </Text>
      {rightIcon && !loading ? (
        <Ionicons 
          name={rightIcon} 
          size={iconSize} 
          color={getIconColor()} 
          style={{ marginLeft: 8 }} 
        />
      ) : null}
    </>
  );
  
  if (isPrimary && !disabled) {
    return (
      <TouchableOpacity 
        onPress={onPress} 
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={[styles.base, sizeStyles[size], style]}
      >
        <LinearGradient
          colors={[colors.primaryGradientStart, colors.primaryGradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          {buttonContent}
        </LinearGradient>
      </TouchableOpacity>
    );
  }
  
  return (
    <TouchableOpacity 
      onPress={onPress} 
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.base, 
        sizeStyles[size],
        isPrimary && [{ backgroundColor: colors.primary }], 
        isOutline && [{ borderColor: colors.primary }],
        isSecondary && [{ backgroundColor: theme.colors.secondary }],
        isGhost && styles.ghost,
        disabled && styles.disabled,
        style
      ]}
    > 
      {buttonContent}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    ...theme.shadow.sm,
  },
  gradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  
  // Sizes
  sizeSmall: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  sizeMedium: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  sizeLarge: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.base,
  },
  
  // Variants
  primary: { 
    backgroundColor: theme.colors.primary,
  },
  outline: { 
    borderWidth: 2, 
    borderColor: theme.colors.primary, 
    backgroundColor: 'transparent',
  },
  secondary: {
    backgroundColor: theme.colors.secondary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    backgroundColor: theme.colors.surface,
    opacity: 0.6,
  },
  
  // Text Styles
  text: { 
    fontWeight: theme.fontWeight.bold,
  },
  textSmall: {
    fontSize: theme.fontSize.sm,
  },
  textMedium: {
    fontSize: theme.fontSize.base,
  },
  textLarge: {
    fontSize: theme.fontSize.md,
  },
  textPrimary: { 
    color: '#fff',
  },
  textOutline: { 
    color: theme.colors.primary,
  },
  textSecondary: {
    color: '#fff',
  },
  textGhost: {
    color: theme.colors.primary,
  },
  textDisabled: {
    color: theme.colors.muted,
  },
});
