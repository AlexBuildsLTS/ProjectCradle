/**
 * PROJECT CRADLE: SOVEREIGN BADGE ENGINE V2.1 (AAA+)
 * Path: components/ui/Badge.tsx
 * ----------------------------------------------------------------------------
 * MODULES:
 * 1. ROLE MAPPING: Comprehensive tier support (Admin, Support, Premium, Plus, Member).
 * 2. GLASSMorphism: Integrated glass-background alpha blending for obsidian themes.
 * 3. OPTIMIZATION: Memoized rendering to ensure high-performance UI transitions.
 * 4. BUG FIX (TS2345): Corrected 'items' property to 'alignItems'.
 */

import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface BadgeProps {
  label: string;
  role?: 'ADMIN' | 'SUPPORT' | 'PREMIUM_MEMBER' | 'PLUS_MEMBER' | 'MEMBER';
  variant?: 'solid' | 'outline' | 'glass';
  className?: string;
}

const BadgeComponent = ({
  label,
  role = 'MEMBER',
  variant = 'glass',
  className = '',
}: BadgeProps) => {
  if (!label) return null;

  // --- SOVEREIGN COLOR SCHEME HANDSHAKE ---
  const roleConfig = {
    ADMIN: {
      main: '#4FD1C7',
      glass: 'rgba(79, 209, 199, 0.15)',
      border: 'rgba(79, 209, 199, 0.3)',
    },
    SUPPORT: {
      main: '#B794F6',
      glass: 'rgba(183, 148, 246, 0.15)',
      border: 'rgba(183, 148, 246, 0.3)',
    },
    PREMIUM_MEMBER: {
      main: '#FFD700',
      glass: 'rgba(255, 215, 0, 0.15)',
      border: 'rgba(255, 215, 0, 0.3)',
    },
    PLUS_MEMBER: {
      main: '#60A5FA',
      glass: 'rgba(96, 165, 250, 0.15)',
      border: 'rgba(96, 165, 250, 0.3)',
    },
    MEMBER: {
      main: '#94A3B8',
      glass: 'rgba(148, 163, 184, 0.15)',
      border: 'rgba(148, 163, 184, 0.3)',
    },
  };

  const current = roleConfig[role] || roleConfig.MEMBER;

  // Determination of Base Style
  const containerStyle = [
    styles.baseBadge,
    variant === 'glass' && {
      backgroundColor: current.glass,
      borderColor: current.border,
    },
    variant === 'outline' && {
      backgroundColor: 'transparent',
      borderColor: current.border,
    },
    variant === 'solid' && {
      backgroundColor: current.main,
      borderColor: current.main,
    },
  ];

  const textStyle = [
    styles.baseText,
    { color: variant === 'solid' ? '#020617' : current.main },
  ];

  return (
    <View style={containerStyle}>
      <Text style={textStyle}>{label.toUpperCase()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  baseBadge: {
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center', // FIXED: Property was 'items'
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
  },
  baseText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
    textAlign: 'center',
  },
});

export const Badge = memo(BadgeComponent);
