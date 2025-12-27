import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Platform } from 'react-native';
import { GlassCard } from '@/components/glass/GlassCard';
import { useBiometrics } from '@/hooks/useBiometrics';
import { Utensils, Droplets, Plus, ChevronRight } from 'lucide-react-native';
import { Theme } from './shared/Theme';

/**
 * PROJECT CRADLE: OBSIDIAN FEEDING LEDGER
 * Fix: Removed bg-neutral-100 to enforce Deep Obsidian
 */
export default function FeedingScreen() {
  const { logEvent } = useBiometrics();
  const [amount, setAmount] = useState('');
  const [side, setSide] = useState<'LEFT' | 'RIGHT' | 'BOTH'>('BOTH');

  return (
    <ScrollView 
      style={{ backgroundColor: Theme.colors.background }} // FIXED: Enforce Obsidian
      className="flex-1 p-6" 
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <Text className="mb-6 text-3xl font-black text-white">Feeding</Text>

      {/* Quick Log: Bottle (Enforced Glassmorphism) */}
      <GlassCard className="mb-6 border-white/5 bg-white/5">
        <View className="flex-row items-center mb-4">
          <View className="p-2 bg-primary/10 rounded-xl">
            <Droplets size={24} color={Theme.colors.primary} />
          </View>
          <Text className="ml-3 text-xl font-bold text-white">Bottle Feed</Text>
        </View>

        <View className="flex-row items-center mb-4 space-x-4">
          <TextInput
            placeholder="Amount (ml)"
            placeholderTextColor="#475569"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            className="flex-1 p-4 text-lg text-white border bg-white/5 border-white/10 rounded-2xl"
          />
          <TouchableOpacity 
            className="p-4 shadow-lg bg-primary rounded-2xl shadow-primary/20"
          >
            <Plus color="#020617" size={24} />
          </TouchableOpacity>
        </View>
      </GlassCard>

      {/* Nursing Selection: Obsidian Style */}
      <View className="flex-row mb-6 space-x-4">
        {(['LEFT', 'RIGHT'] as const).map((s) => (
          <TouchableOpacity 
            key={s}
            onPress={() => setSide(s)}
            className={`flex-1 p-4 rounded-3xl border transition-all ${
              side === s ? 'bg-secondary/10 border-secondary' : 'bg-white/5 border-white/5'
            }`}
          >
            <Text className={`text-center font-bold ${side === s ? 'text-secondary' : 'text-neutral-500'}`}>
              {s} Side
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Solids Introduction: Glassmorphic Row */}
      <Text className="mb-4 text-xl font-bold text-white">Solids Introduction</Text>
      <TouchableOpacity className="flex-row items-center justify-between p-5 mb-3 border bg-white/5 border-white/10 rounded-3xl">
        <View className="flex-row items-center">
          <View className="p-2 bg-white/5 rounded-xl">
            <Utensils size={20} color="#9AE6B4" />
          </View>
          <View className="ml-3">
            <Text className="font-bold text-white">Avocado Puree</Text>
            <Text className="text-xs text-neutral-500">No reactions recorded</Text>
          </View>
        </View>
        <ChevronRight size={20} color="#475569" />
      </TouchableOpacity>

      {/* Inventory Hud */}
      <View className="mt-6 bg-neutral-900/50 p-6 rounded-[32px] border border-white/5">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-bold text-white">Milk Stash</Text>
          <Text className="font-black text-primary">1,240 ml</Text>
        </View>
        <View className="w-full h-2 overflow-hidden rounded-full bg-white/10">
          <View className="h-full bg-primary w-[65%]" />
        </View>
      </View>
    </ScrollView>
  );
}