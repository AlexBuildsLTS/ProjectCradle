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
}

export const StatCard = ({
  title,
  value,
  subtitle,
  isLocked,
  className,
  children,
}: StatCardProps) => {
  return (
    <View className={`bg-white/40 border border-white/70 rounded-[45px] p-8 mb-6 shadow-sm overflow-hidden relative ${className || ''}`}>
      <Text className="text-slate-400 font-black uppercase text-[10px] tracking-widest mb-1">
        {title}
      </Text>
      <Text className="text-slate-700 text-3xl font-black mb-1">{value}</Text>
      {subtitle && (
        <Text className="text-slate-500 font-bold text-xs">{subtitle}</Text>
      )}

      <View className="mt-6">{children}</View>

      {/* PREMIUM GATE OVERLAY */}
      {isLocked && (
        <BlurView
          intensity={80}
          tint="light"
          className="absolute inset-0 items-center justify-center"
        >
          <View className="bg-mint-400 p-3 rounded-full mb-2 shadow-lg shadow-mint-200">
            <Crown size={20} color="white" />
          </View>
          <Text className="text-slate-700 font-black text-sm">
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
