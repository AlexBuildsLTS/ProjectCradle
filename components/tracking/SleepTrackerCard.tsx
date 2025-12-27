import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Moon, Play, Info } from 'lucide-react-native';

interface SleepTrackerProps {
  lastSleepTime?: string;
  isTracking?: boolean;
  onPress: () => void;
}

export const SleepTrackerCard = ({ lastSleepTime = "2h 15m ago", isTracking, onPress }: SleepTrackerProps) => {
  return (
    <View className="relative w-full h-48 rounded-4xl overflow-hidden border border-white/30 shadow-xl">
      {/* Background Gradient Layer */}
      <View className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
      
      {/* Glass Layer */}
      <BlurView intensity={Platform.OS === 'ios' ? 60 : 100} tint="light" className="flex-1 p-6 justify-between">
        
        {/* Header */}
        <View className="flex-row justify-between items-start">
          <View className="flex-row items-center space-x-2">
            <View className="p-2 bg-primary/20 rounded-full">
              <Moon size={20} color="#38B2AC" />
            </View>
            <Text className="text-neutral-900 font-bold text-lg tracking-tight ml-2">Sleep</Text>
          </View>
          <TouchableOpacity hitSlop={20}>
            <Info size={18} color="#CBD5E0" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View>
          <Text className="text-neutral-900/60 text-sm font-medium uppercase tracking-widest">
            Last Wake Window
          </Text>
          <Text className="text-neutral-900 text-3xl font-extrabold">{lastSleepTime}</Text>
        </View>

        {/* Action Button */}
        <TouchableOpacity 
          onPress={onPress}
          activeOpacity={0.8}
          className="bg-primary flex-row items-center justify-center py-3 rounded-2xl shadow-lg"
        >
          <Play size={16} color="white" fill="white" />
          <Text className="text-white font-bold ml-2">Start Sleep Timer</Text>
        </TouchableOpacity>
      </BlurView>
    </View>
  );
};