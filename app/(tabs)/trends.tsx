import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatCard } from '../../src/components/ui/StatCard';
import { TopBar } from '../../src/components/ui/TopBar';
import { useEntitlements } from '../../src/hooks/useEntitlements';
import { BarChart3, Clock, Droplet, Moon } from 'lucide-react-native';

export default function TrendsScreen() {
  const { canAccessCourses, tier } = useEntitlements();
  const [period, setPeriod] = useState('7D');
  const isPremium = tier !== 'FREE';

  // Mock Trend Data for High-Fidelity UI Presentation
  const periods = ['7D', '14D', '30D', '90D', '1Y'];

  return (
    <View className="flex-1 bg-[#F0F9FF]">
      <TopBar />
      
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
        {/* Period Selector - Sleek Glass Pill */}
        <View className="bg-white/40 border border-white p-1.5 rounded-full flex-row justify-between mb-8 shadow-sm">
          {periods.map(p => (
            <TouchableOpacity 
              key={p} 
              onPress={() => setPeriod(p)}
              className={`px-5 py-2.5 rounded-full ${period === p ? 'bg-white shadow-md' : ''}`}
            >
              <Text className={`text-xs font-black ${period === p ? 'text-slate-700' : 'text-slate-400'}`}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 1. SLEEP TRENDS SECTION */}
        <View className="mb-4 flex-row items-center">
          <Moon size={18} color="#0284c7" className="mr-2" />
          <Text className="text-xl font-black text-slate-800 tracking-tight">Sleep Trends</Text>
        </View>

        <StatCard 
          title="Daily Total Avg" 
          value="14h 16m" 
          subtitle="↑ 1h more sleep than last week"
        >
          {/* High-Fidelity Bar Visualization */}
          <View className="flex-row items-end justify-between h-32 px-2 mt-4">
            {[60, 80, 45, 90, 75, 100, 85].map((h, i) => (
              <View key={i} className="items-center">
                <View style={{ height: h }} className="w-4 bg-sky-200 rounded-full" />
                <View style={{ height: h * 0.6 }} className="w-4 bg-sky-400 rounded-full absolute bottom-0" />
              </View>
            ))}
          </View>
          <View className="flex-row justify-between mt-4 px-1">
            <Text className="text-[10px] font-bold text-slate-300 uppercase">Mon</Text>
            <Text className="text-[10px] font-bold text-slate-300 uppercase">Sun</Text>
          </View>
        </StatCard>

        {/* 2. FEEDING & PUMPING SECTION (Premium Gated) */}
        <View className="mb-4 flex-row items-center">
          <Droplet size={18} color="#10B981" className="mr-2" />
          <Text className="text-xl font-black text-slate-800 tracking-tight">Feeding Analytics</Text>
        </View>

        <View className="flex-row justify-between">
          <StatCard 
            title="Avg Volume" 
            value="840ml" 
            className="w-[48%]"
            isLocked={!isPremium}
          />
          <StatCard 
            title="Sessions" 
            value="8.2" 
            subtitle="per day"
            className="w-[48%]"
            isLocked={!isPremium}
          />
        </View>

        {/* 3. SYSTEM INSIGHT CARD */}
        <View className="bg-mint-400 p-8 rounded-[45px] shadow-xl shadow-mint-200 mt-4">
          <View className="flex-row items-center mb-4">
            <BarChart3 color="white" size={24} />
            <Text className="ml-3 text-white font-black text-xl tracking-tight">Berry's Analysis</Text>
          </View>
          <Text className="text-white/90 leading-6 font-medium text-[15px]">
            "Emma's sleep pressure is peaking 15 minutes earlier this week. I recommend moving the afternoon nap to 1:30 PM to avoid an overtired cortisol spike."
          </Text>
          <TouchableOpacity className="bg-white/20 mt-6 p-4 rounded-2xl items-center border border-white/30">
            <Text className="text-white font-bold">Apply to Schedule</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}