import { clsx } from 'clsx';
import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';

/**
 * PROJECT CRADLE: GLASS TILE PRIMITIVE
 * Enhanced glassmorphism component with modern teal/purple design
 * Fully responsive for mobile and desktop layouts
 *
 * @param {string} [className] - Additional Tailwind CSS classes
 * @param {React.ReactNode} [children] - Content inside the glass tile
 * @param {string} [title] - Title text to display
 * @param {string} [variant] - Color variant: 'teal', 'purple', 'green', 'warning', 'danger'
 * @param {() => void} [onPress] - Press handler for interactive tiles
 */
interface GlassTileProps {
  className?: string;
  children?: React.ReactNode;
  title?: string;
  variant?: 'teal' | 'purple' | 'green' | 'warning' | 'danger' | 'default' | 'mint' | 'sky';
  onPress?: () => void;
}

export const GlassTile = ({ 
  className, 
  children, 
  title, 
  variant = 'default', 
  onPress 
}: GlassTileProps) => {
  
  // Map variants to glass tile classes
  const variantClasses = {
    default: 'glass-tile',
    teal: 'glass-tile-teal',
    mint: 'glass-tile-teal', // Alias for teal
    sky: 'glass-tile', // Alias for default
    purple: 'glass-tile-purple',
    green: 'glass-tile-green',
    warning: 'glass-tile-warning',
    danger: 'glass-tile-danger',
  };

  const tileClasses = clsx(
    variantClasses[variant],
    'p-6 md:p-8', // Responsive padding
    'items-center justify-center',
    'transition-all duration-300',
    'active:scale-95', // Smooth press animation
    className
  );

  const content = (
    <View className="items-center justify-center w-full">
      {children}
      {title && (
        <Text className="mt-3 text-sm font-bold text-center text-slate-700 md:text-base">
          {title}
        </Text>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity 
        className={tileClasses} 
        onPress={onPress}
        activeOpacity={0.8}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return <View className={tileClasses}>{content}</View>;
};

export default GlassTile;
