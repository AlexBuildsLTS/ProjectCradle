import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

/**
 * PROJECT CRADLE: HIGH-FIDELITY GLASS BADGE
 * Purpose: Used for User Names (Johan), Baby Status, and AI Indicators.
 */

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'outline';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge = ({ label, variant = 'primary', style, textStyle }: BadgeProps) => {
  const isSecondary = variant === 'secondary';
  
  return (
    <View style={[
      styles.badgeContainer, 
      isSecondary && styles.secondaryVariant,
      style
    ]}>
      <Text style={[
        styles.badgeText, 
        isSecondary && styles.secondaryText,
        textStyle
      ]}>
        {label.toUpperCase()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badgeContainer: {
    backgroundColor: 'rgba(79, 209, 199, 0.1)', // Soft Teal Translucency
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(79, 209, 199, 0.2)',
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryVariant: {
    backgroundColor: 'rgba(183, 148, 246, 0.1)', // Soft Lavender Translucency
    borderColor: 'rgba(183, 148, 246, 0.2)',
  },
  badgeText: {
    color: '#4FD1C7', // Primary Teal
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  secondaryText: {
    color: '#B794F6', // Secondary Lavender
  },
});