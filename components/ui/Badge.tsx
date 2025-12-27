import React from 'react';
import { View, Text } from 'react-native';

interface BadgeProps {
  label: string;
  variant?: 'teal' | 'lavender' | 'orange';
}

export const Badge = ({ label, variant = 'teal' }: BadgeProps) => {
  const colors = {
    teal: 'bg-primary/10 text-primary border-primary/20',
    lavender: 'bg-secondary/10 text-secondary border-secondary/20',
    orange: 'bg-orange-500/10 text-orange-500 border-orange-500/20'
  };

  return (
    <View className={`px-3 py-1 rounded-full border ${colors[variant].split(' ').slice(0, 1).join('')} ${colors[variant].split(' ').slice(2).join('')}`}>
      <Text className={`text-[10px] font-black uppercase tracking-tighter ${colors[variant].split(' ').slice(1, 2).join('')}`}>
        {label}
      </Text>
    </View>
  );
};