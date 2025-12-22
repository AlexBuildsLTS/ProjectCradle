import React from 'react';
import { Pressable, View, Text, PressableStateCallbackType, StyleProp, ViewStyle } from 'react-native';

/**
 * PROJECT CRADLE: GLASS TILE PRIMITIVE
 * Refactored for NativeWind v4 & High-Strictness TypeScript
 */

interface GlassTileProps {
  onPress?: () => void;
  children: React.ReactNode;
  title: string;
  className?: string;
  variant?: 'sky' | 'mint' | 'rose' | 'default';
}

export const GlassTile = ({ onPress, children, title, className, variant = 'default' }: GlassTileProps) => {
  const variantStyles = {
    sky: 'bg-sky-100/40 border-sky-200/50',
    mint: 'bg-mint-100/40 border-mint-200/50',
    rose: 'bg-rose-100/40 border-rose-200/50',
    default: 'bg-white/40 border-white/60'
  };

  // Explicit type for the Pressable style state
  const pressableStyle = ({ pressed }: PressableStateCallbackType): StyleProp<ViewStyle> => [
    { opacity: pressed ? 0.6 : 1 }
  ];

  return (
    <Pressable 
      onPress={onPress}
      // NativeWind v4 allows className directly on standard RN components
      className={`rounded-[40px] border p-6 shadow-sm ${variantStyles[variant]} ${className}`}
      style={pressableStyle}
    >
      <View className="flex-1 justify-between">
        <View className="bg-white/60 w-12 h-12 rounded-2xl items-center justify-center shadow-sm">
          {children}
        </View>
        <Text className="text-slate-600 font-bold text-lg mt-4">{title}</Text>
      </View>
    </Pressable>
  );
};