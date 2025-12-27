import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
// Standardized alias path to your mobile directory
import { triggerLightImpact } from '@/app/(app)/(mobile)/MobileHaptics';
import { Theme } from '@/app/(app)/shared/Theme';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'glass' | 'danger';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button = ({ label, onPress, variant = 'primary', loading, icon }: ButtonProps) => {
  const handlePress = () => {
    // If the file exists, this provides tactile feedback
    try { triggerLightImpact(); } catch (e) { /* Haptics not supported */ }
    onPress();
  };

  return (
    <TouchableOpacity 
      onPress={handlePress}
      disabled={loading}
      className={`h-16 rounded-3xl flex-row items-center justify-center px-6 ${
        variant === 'primary' ? 'bg-primary' : variant === 'glass' ? 'bg-white/5 border border-white/10' : 'bg-red-500/10'
      }`}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#000' : '#FFF'} />
      ) : (
        <View className="flex-row items-center">
          {icon && <View className="mr-2">{icon}</View>}
          <Text className={`font-black text-lg uppercase tracking-widest ${
            variant === 'primary' ? 'text-neutral-950' : 'text-white'
          }`}>
            {label}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};
