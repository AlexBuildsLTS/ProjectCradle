import React, { memo } from 'react';
import { View, Text } from 'react-native';
import { Theme } from '../../lib/shared/Theme';

/**
 * PROJECT CRADLE: HIGH-FIDELITY GLASS BADGE
 * Purpose: Used for Roles, Such as Member, Premium, Support, Admin
 *
 * Improvements:
 * - Switched to NativeWind for consistency with project styling
 * - Implemented 'outline' variant
 * - Added React.memo for performance optimization
 * - Added error handling for invalid labels
 * - Used theme colors for maintainability
 */

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string; // For additional custom styling with NativeWind
}

const BadgeComponent = ({ label, variant = 'primary', className = '' }: BadgeProps) => {
  // Error handling: Render nothing for invalid labels
  if (!label || typeof label !== 'string') {
    return null;
  }

  // Determine styles based on variant using theme colors
  let containerClasses = 'self-start justify-center items-center px-3 py-1.5 rounded-xl border ';
  let textClasses = 'text-xs font-black uppercase tracking-wider ';

  switch (variant) {
    case 'primary':
      containerClasses += `bg-[${Theme.colors.roles.MEMBER.glass}] border-[${Theme.colors.roles.MEMBER.main}]/20`;
      textClasses += `text-[${Theme.colors.roles.MEMBER.main}]`;
      break;
    case 'secondary':
      containerClasses += `bg-[${Theme.colors.roles.PREMIUM_MEMBER.glass}] border-[${Theme.colors.roles.PREMIUM_MEMBER.main}]/20`;
      textClasses += `text-[${Theme.colors.roles.PREMIUM_MEMBER.main}]`;
      break;
    case 'outline':
      containerClasses += 'bg-transparent border-white/10';
      textClasses += 'text-white';
      break;
    default:
      // Fallback to primary
      containerClasses += `bg-[${Theme.colors.roles.MEMBER.glass}] border-[${Theme.colors.roles.MEMBER.main}]/20`;
      textClasses += `text-[${Theme.colors.roles.MEMBER.main}]`;
  }

  // Append custom className
  containerClasses += ` ${className}`;

  return (
    <View className={containerClasses}>
      <Text className={textClasses}>
        {label.toUpperCase()}
      </Text>
    </View>
  );
};

// Wrap with React.memo for performance optimization
export const Badge = memo(BadgeComponent);