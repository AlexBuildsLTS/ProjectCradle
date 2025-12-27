import { GlassCard } from '@/components/glass/GlassCard';
import { Theme } from '@/lib/shared/Theme';
import { BrainCircuit, CheckCircle2, Circle } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Badge } from '../ui/Badge';

const MILESTONES = [
  { id: 1, title: 'Rolling Over', status: 'completed', age: '4m' },
  { id: 2, title: 'Pushing up on arms', status: 'pending', age: '4m' },
  { id: 3, title: 'Grasping toys', status: 'completed', age: '4m' },
];

/**
 * PROJECT CRADLE: AI MILESTONE ENGINE
 * Tracks physical development with AI-contextualized advice
 */
export const MilestoneChecklist = () => {
  return (
    <View className="mt-10">
      <View className="flex-row items-center justify-between px-1 mb-4">
        <Text className="text-neutral-500 font-bold uppercase tracking-widest text-[10px]">
          Developmental Milestones
        </Text>
        <Badge label="4 Month Stage" variant="lavender" />
      </View>

      <GlassCard className="mb-6">
        {MILESTONES.map((m, i) => (
          <TouchableOpacity
            key={m.id}
            className={`flex-row items-center justify-between py-4 ${
              i !== MILESTONES.length - 1 ? 'border-b border-white/5' : ''
            }`}
          >
            <View className="flex-row items-center">
              {m.status === 'completed' ? (
                <CheckCircle2 size={20} color={Theme.colors.primary} />
              ) : (
                <Circle size={20} color="#475569" />
              )}
              <Text
                className={`ml-4 font-bold ${
                  m.status === 'completed' ? 'text-white' : 'text-neutral-500'
                }`}
              >
                {m.title}
              </Text>
            </View>
            <Text className="text-[10px] font-black text-neutral-600 uppercase tracking-tighter">
              {m.age}
            </Text>
          </TouchableOpacity>
        ))}
      </GlassCard>

      {/* AI Milestone Advice */}
      <GlassCard className="border-primary/20 bg-primary/5">
        <View className="flex-row items-center mb-3">
          <BrainCircuit size={18} color={Theme.colors.primary} />
          <Text className="text-primary font-black ml-3 uppercase tracking-widest text-[10px]">
            Berry AI Activity Suggestion
          </Text>
        </View>
        <Text className="text-sm leading-6 text-white">
          To encourage "Pushing up on arms," try 5-minute Tummy Time sessions
          twice daily. Use a high-contrast mirror to keep interest.
        </Text>
      </GlassCard>
    </View>
  );
};
