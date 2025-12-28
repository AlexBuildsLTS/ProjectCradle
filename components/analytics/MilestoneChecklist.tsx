/**
 * PROJECT CRADLE: AI MILESTONE ENGINE V2.0 (AAA+ FINAL)
 * Path: components/analytics/MilestoneChecklist.tsx
 * FIXES: Handshakes with public.milestones and implements Pro-Row UI.
 */

import { GlassCard } from '@/components/glass/GlassCard';
import { useAuth } from '@/context/auth';
import { useFamily } from '@/context/family';
import { supabase } from '@/lib/supabase';
import { BrainCircuit, CheckCircle2, Circle } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { Badge } from '../ui/Badge';

const TRACKED_MILESTONES = [
  { key: 'rolling_over', label: 'Rolling Over', age: '4m' },
  { key: 'pushing_up', label: 'Pushing up on arms', age: '4m' },
  { key: 'grasping', label: 'Grasping toys', age: '4m' },
];

export const MilestoneChecklist = () => {
  const { selectedBaby } = useFamily();
  const { user } = useAuth();
  const [completedKeys, setCompletedKeys] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMilestones() {
      if (!selectedBaby?.id) return;
      const { data } = await supabase
        .from('milestones')
        .select('milestone_key')
        .eq('baby_id', selectedBaby.id);

      if (data) setCompletedKeys(data.map((m) => m.milestone_key));
      setLoading(false);
    }
    fetchMilestones();
  }, [selectedBaby]);

  const toggleMilestone = async (key: string) => {
    if (completedKeys.includes(key)) return; // Already locked in biometric core

    try {
      const { error } = await supabase.from('milestones').insert([
        {
          baby_id: selectedBaby?.id,
          user_id: user?.id,
          milestone_key: key,
        },
      ]);
      if (!error) setCompletedKeys([...completedKeys, key]);
    } catch (err) {
      console.error('Biometric Sync Failure');
    }
  };

  if (loading) return <ActivityIndicator color="#4FD1C7" />;

  return (
    <View style={{ marginTop: 32 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
          paddingHorizontal: 4,
        }}
      >
        <Text
          style={{
            color: '#475569',
            fontWeight: '900',
            fontSize: 10,
            letterSpacing: 2,
          }}
        >
          DEVELOPMENTAL CORE
        </Text>
        <Badge label="4 MONTH STAGE" variant="secondary" />
      </View>

      <GlassCard style={{ marginBottom: 24, padding: 0 }}>
        {TRACKED_MILESTONES.map((m, i) => {
          const isDone = completedKeys.includes(m.key);
          return (
            <TouchableOpacity
              key={m.key}
              onPress={() => toggleMilestone(m.key)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 20,
                borderBottomWidth: i !== TRACKED_MILESTONES.length - 1 ? 1 : 0,
                borderBottomColor: 'rgba(255,255,255,0.05)',
              }}
            >
              <View style={{ width: 44, alignItems: 'flex-start' }}>
                {isDone ? (
                  <CheckCircle2 size={22} color="#4FD1C7" />
                ) : (
                  <Circle size={22} color="#334155" />
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontWeight: '800',
                    color: isDone ? '#FFF' : '#64748B',
                    fontSize: 14,
                  }}
                >
                  {m.label}
                </Text>
              </View>
              <Text
                style={{ fontSize: 10, fontWeight: '900', color: '#334155' }}
              >
                {m.age}
              </Text>
            </TouchableOpacity>
          );
        })}
      </GlassCard>

      <GlassCard
        style={{
          borderColor: 'rgba(79, 209, 199, 0.2)',
          backgroundColor: 'rgba(79, 209, 199, 0.05)',
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          <BrainCircuit size={18} color="#4FD1C7" />
          <Text
            style={{
              color: '#4FD1C7',
              fontWeight: '900',
              marginLeft: 12,
              fontSize: 10,
              letterSpacing: 1.5,
            }}
          >
            BERRY AI ADVICE
          </Text>
        </View>
        <Text
          style={{
            fontSize: 13,
            lineHeight: 22,
            color: '#FFF',
            fontWeight: '600',
          }}
        >
          Trajectory suggests introducing high-contrast tummy time mats to
          accelerate "Pushing up on arms."
        </Text>
      </GlassCard>
    </View>
  );
};
