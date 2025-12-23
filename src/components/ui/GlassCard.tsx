import React from 'react';
import { View, Text } from 'react-native';
import { clsx } from 'clsx';

/**
 * PROJECT CRADLE: GLASS CARD COMPONENT
 * Modern glassmorphism card with sleek teal/purple design
 * Fully responsive for mobile and desktop layouts
 *
 * @param {string} title - The main title of the card. Required.
 * @param {string} [subtitle] - Optional subheading text below the title.
 * @param {React.ReactNode} [children] - Content to display inside the card body.
 * @param {string} [className] - Additional Tailwind CSS classes for customization.
 * @param {string} [variant] - Color variant: 'default', 'teal', 'purple', 'green'
 */
interface GlassCardProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'teal' | 'purple' | 'green';
}

export const GlassCard = ({ 
  title, 
  subtitle, 
  children, 
  className,
  variant = 'default'
}: GlassCardProps) => {
  
  const variantClasses = {
    default: 'glass-tile',
    teal: 'glass-tile-teal',
    purple: 'glass-tile-purple',
    green: 'glass-tile-green',
  };

  const cardClasses = clsx(
    variantClasses[variant],
    'p-6 md:p-8',
    'shadow-glass',
    className
  );

  return (
    <View className={cardClasses}>
      {/* Title: Bold, clear text with responsive sizing */}
      <Text className="mb-2 text-xl font-bold text-slate-800 md:text-2xl">
        {title}
      </Text>
      
      {/* Subtitle: Lighter text, only rendered if present */}
      {subtitle && (
        <Text className="mb-4 text-sm text-slate-500 md:text-base md:mb-6">
          {subtitle}
        </Text>
      )}
      
      {/* Card Body Content */}
      {children}
    </View>
  );
};

export default GlassCard;
