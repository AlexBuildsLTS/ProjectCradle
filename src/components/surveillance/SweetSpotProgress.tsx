import React from 'react';
import { View, Text } from 'react-native';
import Animated, { useAnimatedStyle, withSpring, interpolateColor } from 'react-native-reanimated';
import { cssInterop } from 'nativewind';

/**
 * PROJECT CRADLE: SWEETSPOT® SURVEILLANCE CIRCLE
 * Glassmorphism implementation with Nurturing Palette.
 */

// Bridge the gap between Reanimated and NativeWind v4
cssInterop(Animated.View, { className: 'style' });

export const SweetSpotProgress = ({ pressure }: { pressure: number }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      pressure,
      [0, 0.7, 1.0],
      ['#BAE6FD', '#6EE7B7', '#F9A8D4'] // Sky -> Mint -> Rose
    );

    return {
      borderColor,
      transform: [{ scale: withSpring(pressure > 0.9 ? 1.08 : 1) }],
    };
  });

  return (
    <View className="items-center justify-center">
      {/* Outer Glass Ring */}
      <Animated.View 
        style={animatedStyle} 
        className="w-64 h-64 rounded-full border-[14px] items-center justify-center bg-white/30 shadow-2xl shadow-sky-200"
      >
        {/* Inner Content Frosted Hub */}
        <View className="items-center bg-white/70 w-44 h-44 rounded-full justify-center shadow-inner">
          <Text className="text-5xl font-black text-slate-600">
            {Math.round(pressure * 100)}%
          </Text>
          <Text className="text-slate-400 font-bold uppercase text-[10px] tracking-tighter mt-1">
            Sleep Drive
          </Text>
        </View>
      </Animated.View>
    </View>
  );
};