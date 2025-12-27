import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { GlassCard } from '@/components/glass/GlassCard';
import { useBiometrics } from '@/hooks/useBiometrics';
import { Utensils, Droplets, Clock, Plus, ChevronRight } from 'lucide-react-native';
import { format } from 'date-fns';

export default function FeedingScreen() {
  const { logEvent } = useBiometrics();
  const [amount, setAmount] = useState('');
  const [side, setSide] = useState<'LEFT' | 'RIGHT' | 'BOTH'>('BOTH');

  const handleLogFeeding = (type: 'FEED' | 'SOLIDS') => {
    logEvent.mutate({
      correlation_id: crypto.randomUUID(),
      event_type: type,
      timestamp: new Date().toISOString(),
      metadata: {
        amount_ml: parseFloat(amount),
        side: side,
        notes: "Logged via Feeding Dashboard"
      }
    });
    setAmount('');
  };

  return (
    <ScrollView className="flex-1 bg-neutral-100 p-6" contentContainerStyle={{ paddingBottom: 100 }}>
      <Text className="text-3xl font-black text-neutral-900 mb-6">Feeding</Text>

      {/* Quick Log: Bottle */}
      <GlassCard className="mb-6">
        <View className="flex-row items-center mb-4">
          <View className="bg-primary/20 p-2 rounded-xl">
            <Droplets size={24} color="#4FD1C7" />
          </View>
          <Text className="text-xl font-bold ml-3 text-neutral-900">Bottle Feed</Text>
        </View>

        <View className="flex-row items-center space-x-4 mb-4">
          <TextInput
            placeholder="Amount (ml)"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            className="flex-1 bg-white/50 border border-neutral-200 rounded-2xl p-4 text-lg"
          />
          <TouchableOpacity 
            onPress={() => handleLogFeeding('FEED')}
            className="bg-primary p-4 rounded-2xl shadow-sm"
          >
            <Plus color="white" size={24} />
          </TouchableOpacity>
        </View>
      </GlassCard>

      {/* Nursing Timer Selection */}
      <View className="flex-row space-x-4 mb-6">
        {(['LEFT', 'RIGHT'] as const).map((s) => (
          <TouchableOpacity 
            key={s}
            onPress={() => setSide(s)}
            className={`flex-1 p-4 rounded-3xl border ${side === s ? 'bg-secondary/20 border-secondary' : 'bg-white border-neutral-200'}`}
          >
            <Text className={`text-center font-bold ${side === s ? 'text-secondary' : 'text-neutral-500'}`}>
              {s} Side
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Solids / Food Library */}
      <Text className="text-xl font-bold text-neutral-900 mb-4">Solids Introduction</Text>
      <TouchableOpacity className="bg-white border border-neutral-200 p-5 rounded-3xl flex-row justify-between items-center mb-3">
        <View className="flex-row items-center">
          <View className="bg-tertiary/20 p-2 rounded-xl">
            <Utensils size={20} color="#9AE6B4" />
          </View>
          <View className="ml-3">
            <Text className="font-bold text-neutral-900">Avocado Puree</Text>
            <Text className="text-neutral-500 text-xs">No reactions recorded</Text>
          </View>
        </View>
        <ChevronRight size={20} color="#CBD5E0" />
      </TouchableOpacity>

      {/* Recent Inventory (Pumping) */}
      <View className="mt-6 bg-neutral-900 p-6 rounded-4xl shadow-xl">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-white font-bold text-lg">Milk Stash</Text>
          <Text className="text-primary font-black">1,240 ml</Text>
        </View>
        <View className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
          <View className="h-full bg-primary w-[65%]" />
        </View>
      </View>
    </ScrollView>
  );
}