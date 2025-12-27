import React, { useState, useEffect } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Droplets, Plus, Utensils, ChevronRight } from 'lucide-react-native';
import { GlassCard } from '@/components/glass/GlassCard';
import { Theme } from '@/lib/shared/Theme';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/auth';

export default function FeedingScreen() {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [stash, setStash] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStash() {
      if (!user?.id) return;
      // Example: Summing up all 'pumping' events and subtracting 'bottle' events
      const { data } = await supabase.from('care_events').select('metadata').eq('user_id', user.id);
      
      // Basic calculation logic for demonstration
      let total = 0;
      data?.forEach(e => {
        if (e.metadata.mode === 'pumping') total += e.metadata.volume_ml || 0;
        if (e.metadata.mode === 'bottle') total -= e.metadata.volume_ml || 0;
      });
      setStash(total > 0 ? total : 0);
      setLoading(false);
    }
    fetchStash();
  }, [user?.id]);

  return (
    <ScrollView style={{ backgroundColor: Theme.colors.background }} className="flex-1 p-6" contentContainerStyle={{ paddingBottom: 100 }}>
      <Text className="mb-6 text-3xl font-black text-white">Feeding</Text>

      {/* QUICK LOG BOTTLE */}
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
          <TouchableOpacity className="p-4 shadow-lg bg-primary rounded-2xl shadow-primary/20">
            <Plus color="#020617" size={24} />
          </TouchableOpacity>
        </View>
      </GlassCard>

      {/* DYNAMIC INVENTORY HUD */}
      <View className="mt-6 bg-neutral-900/50 p-6 rounded-[32px] border border-white/5">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-bold text-white">Current Milk Stash</Text>
          <Text className="font-black text-primary">{loading ? '...' : `${stash} ml`}</Text>
        </View>
        <View className="w-full h-2 overflow-hidden rounded-full bg-white/10">
          <View className="h-full bg-primary" style={{ width: `${Math.min((stash/2000)*100, 100)}%` }} />
        </View>
      </View>
    </ScrollView>
  );
}