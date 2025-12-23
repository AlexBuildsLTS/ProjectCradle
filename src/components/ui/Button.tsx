import React from 'react';
import { Pressable, Text, PressableStateCallbackType, StyleProp, ViewStyle, ActivityIndicator } from 'react-native';

/**
 * PROJECT CRADLE: MODERN BUTTON PRIMITIVE
 * Sleek glassmorphism design with teal/purple gradient colors
 * Fully responsive and accessible
 */

interface ButtonProps {
  onPress?: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'glass';
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Button = ({ 
  onPress, 
  title, 
  variant = 'primary', 
  className, 
  disabled = false,
  loading = false,
  size = 'md'
}: ButtonProps) => {
  const variantStyles = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    success: 'btn-success',
    warning: 'btn-warning',
    danger: 'btn-danger',
    glass: 'btn-glass',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  // Explicit type for the Pressable style state
  const pressableStyle = ({ pressed }: PressableStateCallbackType): StyleProp<ViewStyle> => [
    { opacity: pressed ? 0.7 : 1 }
  ];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={`${variantStyles[variant]} ${sizeStyles[size]} ${className} ${disabled || loading ? 'opacity-50' : ''}`}
      style={pressableStyle}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: disabled || loading }}
    >
      {loading ? (
        <ActivityIndicator size="small" color="white" />
      ) : (
        <Text className="font-bold text-center text-white">
          {title}
        </Text>
      )}
    </Pressable>
  );
};

export default Button;
