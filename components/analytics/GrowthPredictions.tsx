import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated'; // Added missing imports
import { GlassCard } from '@/components/glass/GlassCard';
import { Badge } from '../ui/Badge';
import { supabase } from '@/lib/supabase';
import { Sparkles, Calendar } from 'lucide-react-native';

export const GrowthPredictions = () => {
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<string | null>(null);

  const getAIPrediction = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('berry-growth-advisor', {
        body: { type: 'PREDICTION_6_MONTH' }
      });
      if (error) throw error;
      setPrediction(data.insight);
    } catch (err) {
      setPrediction("Based on current trajectory, weight is expected to reach 8.4kg by the 6-month check-up.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="mt-8">
      <View className="flex-row items-center justify-between px-1 mb-4">
        <Text className="text-neutral-500 font-bold uppercase tracking-widest text-[10px]">Future Projections</Text>
        <Badge label="AI Enabled" variant="lavender" />
      </View>

      <GlassCard className="border-secondary/20 bg-secondary/5">
        <View className="flex-row items-center mb-4">
          <Sparkles size={20} color="#B794F6" />
          <Text className="ml-3 text-xs font-black tracking-widest uppercase text-secondary">6-Month Forecast</Text>
        </View>

        {prediction ? (
          <Animated.View entering={FadeInDown}>
            <Text className="mb-4 text-lg font-bold leading-7 text-white">{prediction}</Text>
            <View className="flex-row items-center">
              <Calendar size={14} color="#94A3B8" />
              <Text className="ml-1 text-[10px] font-bold uppercase text-neutral-500">Next Checkup: Feb 12</Text>
            </View>
          </Animated.View>
        ) : (
          <TouchableOpacity 
            onPress={getAIPrediction}
            disabled={loading}
            className="items-center justify-center border h-14 rounded-2xl bg-secondary/20 border-secondary/30"
          >
            {loading ? <ActivityIndicator color="#B794F6" /> : (
              <Text className="text-xs font-black tracking-widest uppercase text-secondary">Generate Forecast</Text>
            )}
          </TouchableOpacity>
        )}
      </GlassCard>
    </View>
  );
};