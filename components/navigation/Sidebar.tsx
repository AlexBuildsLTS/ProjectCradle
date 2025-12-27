import { Link, usePathname } from "expo-router";
import {
  Activity,
  Baby,
  Image as ImageIcon,
  LayoutDashboard,
  LineChart,
  Settings,
  Sparkles,
  Utensils,
} from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInLeft } from "react-native-reanimated";
import { triggerLightImpact } from "../../app/(app)/(mobile)/MobileHaptics";
import { Theme } from "../../app/(app)/shared/Theme";

/**
 * PROJECT CRADLE: ENHANCED OBSIDIAN SIDEBAR
 * Features: AAA Glassmorphism, Route Synchronization, Melatonin-Safe Contrast
 */
const NAV_ITEMS = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/(app)" },
  { name: "Feeding", icon: Utensils, href: "/(app)/feeding" },
  { name: "Growth", icon: LineChart, href: "/(app)/growth" },
  { name: "Health", icon: Activity, href: "/(app)/health" },
  { name: "Journal", icon: ImageIcon, href: "/(app)/journal" },
  { name: "Settings", icon: Settings, href: "/(app)/settings" },
];

export const Sidebar = ({ className }: { className?: string }) => {
  const pathname = usePathname();

  const handlePress = () => {
    try {
      triggerLightImpact();
    } catch (e) {
      /* Haptics ignore on web */
    }
  };

  return (
    <Animated.View
      entering={FadeInLeft.duration(400)}
      className={`h-full bg-neutral-950 border-r border-white/5 p-8 ${className}`}
    >
      {/* Brand Header */}
      <View className="flex-row items-center px-2 mb-12">
        <View className="bg-primary p-2.5 rounded-2xl shadow-lg shadow-primary/20">
          <Baby color="#020617" size={24} />
        </View>
        <Text className="ml-4 text-2xl font-black tracking-tighter text-white">
          Cradle
        </Text>
      </View>

      {/* Navigation Links */}
      <View className="flex-1 space-y-2">
        <Text className="text-[10px] font-black text-neutral-600 uppercase tracking-[2px] mb-4 ml-2">
          Menu
        </Text>

        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href as any} asChild>
              <TouchableOpacity
                onPress={handlePress}
                className={`flex-row items-center p-4 rounded-2xl transition-all ${
                  isActive ? "bg-white/5 border border-white/10" : "opacity-70"
                }`}
              >
                <item.icon
                  size={20}
                  color={isActive ? Theme.colors.primary : "#94A3B8"}
                />
                <Text
                  className={`ml-4 font-bold text-base ${
                    isActive ? "text-white" : "text-neutral-500"
                  }`}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            </Link>
          );
        })}
      </View>

      {/* Premium Berry AI Card */}
      <View className="mt-auto p-6 bg-secondary/5 rounded-[32px] border border-secondary/20">
        <View className="flex-row items-center mb-3">
          <Sparkles size={16} color={Theme.colors.secondary} />
          <Text className="text-[10px] font-black text-secondary uppercase tracking-widest ml-2">
            Pro Status
          </Text>
        </View>
        <Text className="text-sm font-bold leading-5 text-white">
          Berry AI is currently optimizing Charlie's schedule.
        </Text>
        <TouchableOpacity className="items-center py-2 mt-4 border bg-secondary/20 rounded-xl border-secondary/30">
          <Text className="text-secondary font-black text-[10px] uppercase">
            View Insights
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};
