import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { GrowthChart } from '@/components/analytics/GrowthChart';
import { GrowthPredictions } from '@/components/analytics/GrowthPredictions';
import { MilestoneChecklist } from '@/components/analytics/MilestoneChecklist';
import { GlassCard } from '@/components/glass/GlassCard';
import { DashboardFooter } from '@/components/navigation/DashboardFooter';
import { TrendingUp, Scale, Ruler } from 'lucide-react-native';

/**
 * PROJECT CRADLE: GROWTH ANALYTICS HUB
 * Features: SVG Curves, AI Projections, Milestone Tracking
 */
export default function GrowthScreen() {
  return (
    <ScrollView 
      className="flex-1 p-6 bg-neutral-950" 
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      <Text className="mb-8 text-4xl font-black text-white">Growth</Text>

      {/* 1. Professional AI Insights Card */}
      <GlassCard className="mb-8 border-secondary/20 bg-secondary/5">
        <View className="flex-row items-center mb-3">
          <TrendingUp size={20} color="#B794F6" />
          <Text className="ml-3 text-xs font-black tracking-widest uppercase text-secondary">
            Berry AI Growth Summary
          </Text>
        </View>
        <Text className="text-lg font-bold leading-7 text-white">
          Your baby is tracking 12% above the median weight for their age group. This is healthy for breastfed infants.
        </Text>
      </GlassCard>

      {/* 2. Visual Growth Curve (SVG) */}
      <GrowthChart data={[]} />

      {/* 3. AI-Powered Predictive Projections */}
      <GrowthPredictions />

      {/* 4. Developmental Milestones Checklist */}
      <MilestoneChecklist />

      {/* 5. Historical Records Ledger */}
      <View className="mt-10">
        <Text className="text-neutral-500 font-bold uppercase tracking-widest text-[10px] mb-4 px-1">
          Last Check-up Records
        </Text>
        <GlassCard className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <Scale size={20} color="#4FD1C7" />
            <Text className="ml-4 font-bold text-white">Weight</Text>
          </View>
          <Text className="font-black text-primary">7.2 kg</Text>
        </GlassCard>
        
        <GlassCard className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Ruler size={20} color="#B794F6" />
            <Text className="ml-4 font-bold text-white">Length</Text>
          </View>
          <Text className="font-black text-secondary">64 cm</Text>
        </GlassCard>
      </View>

      <DashboardFooter />
    </ScrollView>
  );
}