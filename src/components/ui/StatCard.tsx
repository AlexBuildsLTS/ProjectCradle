import { BlurView } from "expo-blur";
import { Crown } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";

/**
 * PROJECT CRADLE: STAT CARD PRIMITIVE
 * Logic: High-contrast data visualization on frosted glass.
 */

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  isLocked?: boolean;
  className?: string;
  children?: React.ReactNode;
  variant?: 'teal' | 'purple' | 'green' | 'warning' | 'danger';
}

export const StatCard = ({
  title,
  value,
  subtitle,
  isLocked,
  className,
  children,
  variant = 'teal'
}: StatCardProps) => {
  const variantStyles = {
    teal: 'glass-tile',
    purple: 'glass-tile-purple',
    green: 'glass-tile-green',
    warning: 'glass-tile-warning',
    danger: 'glass-tile-danger',
  };

  return (
    <View className={`${variantStyles[variant]} p-8 mb-6 shadow-sm overflow-hidden relative rounded-[45px] ${className || ''}`}>
      <Text className="text-slate-400 font-black uppercase text-[10px] tracking-widest mb-1">
        {title}
      </Text>
      <Text className="mb-1 text-3xl font-black text-slate-700">{value}</Text>
      {subtitle && (
        <Text className="text-xs font-bold text-slate-500">{subtitle}</Text>
      )}

      <View className="mt-6">{children}</View>

      {/* PREMIUM GATE OVERLAY */}
      {isLocked && (
        <BlurView
          intensity={80}
          tint="light"
          className="absolute inset-0 items-center justify-center"
        >
          <View className="p-3 mb-2 bg-purple-500 rounded-full shadow-lg shadow-purple-200">
            <Crown size={20} color="white" />
          </View>
          <Text className="text-sm font-black text-slate-700">
            Premium Insight
          </Text>
          <Text className="text-slate-400 font-bold text-[10px] uppercase">
            Upgrade to unlock
          </Text>
        </BlurView>
      )}
    </View>
  );
};
