import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Platform, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { useAuth } from '@/context/auth';
import { useSyncEngine } from '@/hooks/useSyncEngine';
import { useBiometrics } from '@/hooks/useBiometrics';
import { useBabyContext } from '@/hooks/useBabyContext';
import { SleepTrackerCard } from '@/components/tracking/SleepTrackerCard';
import { TimelineItem } from '@/components/tracking/TimelineItem';
import { BerryAssistant } from '@/components/ai/BerryAssistant';
import { GlassCard } from '@/components/glass/GlassCard';
import { DashboardFooter } from '@/components/navigation/DashboardFooter';
import { Plus, Coffee, Utensils, Droplets, BrainCircuit, TrendingUp, Zap } from 'lucide-react-native';
import * as Crypto from 'expo-crypto';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function Dashboard() {
  const { user } = useAuth();
  const { data: baby, isLoading: babyLoading } = useBabyContext();
  const isWeb = Platform.OS === 'web';
  
  useSyncEngine(user?.id);
  const { logEvent } = useBiometrics();

  const handleQuickLog = (type: 'SLEEP' | 'FEED' | 'DIAPER') => {
    logEvent.mutate({
      correlation_id: Crypto.randomUUID(),
      event_type: type,
      timestamp: new Date().toISOString(),
      metadata: { 
        notes: `Quick-logged from ${Platform.OS} dashboard`,
        logged_by: user?.email 
      }
    });
  };

  if (babyLoading) return (
    <View className="items-center justify-center flex-1 bg-neutral-950">
      <ActivityIndicator size="large" color="#4FD1C7" />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-neutral-950">
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView 
        className="flex-1 px-6 pt-4" 
        contentContainerStyle={{ 
            paddingBottom: 140,
            maxWidth: isWeb ? 1200 : '100%',
            alignSelf: isWeb ? 'center' : 'auto'
        }}
      >
        
        {/* Header Section */}
        <Animated.View entering={FadeInUp.delay(100)} className="flex-row items-end justify-between mb-8">
          <View>
            <Text className="text-neutral-500 font-bold uppercase tracking-widest text-[10px]">Good Morning</Text>
            <Text className="text-3xl font-black leading-tight text-white">{baby?.baby_name || 'Parent'}'s Day</Text>
          </View>
          <View className="items-center justify-center w-12 h-12 bg-secondary/20 rounded-2xl">
            <Coffee size={24} color="#B794F6" />
          </View>
        </Animated.View>

        {/* AI Insight Section */}
        <GlassCard className="mb-6 border-secondary/20 bg-secondary/5">
          <View className="flex-row items-center mb-4">
            <BrainCircuit size={20} color="#B794F6" />
            <Text className="ml-3 text-xs font-black tracking-widest uppercase text-secondary">
              Berry AI Insight
            </Text>
          </View>
          <Text className="text-lg font-bold leading-7 text-white">
            Based on the last 3 logs, {baby?.baby_name || 'your baby'} is showing a 15% increase in deep sleep duration.
          </Text>
        </GlassCard>

        {/* Growth & Activity Mini-Cards */}
        <View className={`${isWeb ? 'flex-row space-x-6' : 'flex-row space-x-4'} mb-8`}>
           <GlassCard className="flex-1 p-6">
              <TrendingUp size={24} color="#4FD1C7" />
              <Text className="mt-4 mb-1 text-xs font-bold uppercase text-neutral-400">Percentile</Text>
              <Text className="text-2xl font-black text-white">72nd</Text>
           </GlassCard>
           <GlassCard className="flex-1 p-6">
              <Zap size={24} color="#F6AD55" />
              <Text className="mt-4 mb-1 text-xs font-bold uppercase text-neutral-400">Wake Window</Text>
              <Text className="text-2xl font-black text-white">1h 45m</Text>
           </GlassCard>
        </View>

        <SleepTrackerCard lastSleepTime="2h 45m ago" onPress={() => handleQuickLog('SLEEP')} />

        {/* Quick Action Buttons */}
        <View className="flex-row justify-between mt-8 mb-10">
          <TouchableOpacity onPress={() => handleQuickLog('FEED')} className="items-center">
            <View className="items-center justify-center w-16 h-16 border shadow-sm bg-white/5 rounded-3xl border-white/10">
              <Utensils size={24} color="#4FD1C7" />
            </View>
            <Text className="text-neutral-400 font-bold mt-2 text-[10px]">FEED</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleQuickLog('DIAPER')} className="items-center">
            <View className="items-center justify-center w-16 h-16 border shadow-sm bg-white/5 rounded-3xl border-white/10">
              <Droplets size={24} color="#F6AD55" />
            </View>
            <Text className="text-neutral-400 font-bold mt-2 text-[10px]">DIAPER</Text>
          </TouchableOpacity>

          <TouchableOpacity className="items-center">
            <View className="items-center justify-center w-16 h-16 shadow-lg bg-primary rounded-3xl">
              <Plus size={24} color="white" />
            </View>
            <Text className="text-primary font-bold mt-2 text-[10px]">MORE</Text>
          </TouchableOpacity>
        </View>

        <Text className="mb-6 text-xl font-bold text-white">Recent Activity</Text>
        <TimelineItem type="SLEEP" time="10:30 AM" detail="Napped for 45 mins." />
        <TimelineItem type="FEED" time="08:15 AM" detail="Logged 120ml Formula." />

        <DashboardFooter />
      </ScrollView>
      <BerryAssistant />
    </SafeAreaView>
  );
}