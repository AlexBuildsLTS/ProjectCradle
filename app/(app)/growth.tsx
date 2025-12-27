import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, ActivityIndicator } from 'react-native';
import { TrendingUp, Scale, Ruler } from 'lucide-react-native';
import { GlassCard } from '@/components/glass/GlassCard';
import { useAuth } from '@/context/auth';
import { supabase } from '@/lib/supabase';
import { Theme } from '@/lib/shared/Theme';

export default function GrowthScreen() {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [latestGrowth, setLatestGrowth] = useState<any>(null);

  useEffect(() => {
    async function fetchGrowth() {
      if (!user?.id) return;
      const { data } = await supabase
        .from('growth_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('date_recorded', { ascending: false })
        .limit(1)
        .single();
      
      if (data) setLatestGrowth(data);
      setLoading(false);
    }
    fetchGrowth();
  }, [user?.id]);

  if (loading) return <View style={{flex:1, backgroundColor:'#020617', justifyContent:'center'}}><ActivityIndicator color="#4FD1C7" /></View>;

  return (
    <ScrollView className="flex-1 p-6 bg-neutral-950" contentContainerStyle={{ paddingBottom: 120 }}>
      <Text className="mb-8 text-4xl font-black text-white">Growth</Text>

      {/* 1. DYNAMIC AI SUMMARY */}
      <GlassCard className="mb-8 border-secondary/20 bg-secondary/5">
        <View className="flex-row items-center mb-3">
          <TrendingUp size={20} color={Theme.colors.secondary} />
          <Text className="ml-3 text-xs font-black tracking-widest uppercase text-secondary">
            Berry AI Growth Summary
          </Text>
        </View>
        <Text className="text-lg font-bold leading-7 text-white">
          {latestGrowth 
            ? `${profile?.baby_name || 'Your baby'} is tracking consistently. Their last recorded weight was ${(latestGrowth.weight_grams / 1000).toFixed(2)} kg.`
            : "No biometric data detected. Log a measurement to generate your first AI growth summary."}
        </Text>
      </GlassCard>

      {/* 2. LATEST RECORDS LEDGER (DYNAMIC) */}
      <View className="mt-4">
        <Text className="text-neutral-500 font-bold uppercase tracking-widest text-[10px] mb-4 px-1">
          Last Synchronized Records
        </Text>
        <GlassCard className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <Scale size={20} color={Theme.colors.primary} />
            <Text className="ml-4 font-bold text-white">Weight</Text>
          </View>
          <Text className="font-black text-primary">
            {latestGrowth ? `${(latestGrowth.weight_grams / 1000).toFixed(2)} kg` : '--'}
          </Text>
        </GlassCard>
        
        <GlassCard className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Ruler size={20} color={Theme.colors.secondary} />
            <Text className="ml-4 font-bold text-white">Height</Text>
          </View>
          <Text className="font-black text-secondary">
            {latestGrowth ? `${latestGrowth.height_cm} cm` : '--'}
          </Text>
        </GlassCard>
      </View>
    </ScrollView>
  );
}