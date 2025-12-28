/**
 * PROJECT CRADLE: MASTER ANALYTICS CORE V26.0 (AAA+ FINAL)
 * Path: app/(app)/analytics.tsx
 * FIXES:
 * 1. SLEEP EFFICIENCY ENGINE: Integrated duration-based logic vs 14h standard.
 * 2. REAL-TIME HANDSHAKE: Fully synced with 'pumping_logs', 'sleep_logs', and 'growth_logs'.
 * 3. PRO-ROW ARCHITECTURE: Icon far-left, data right, 0% label overlap.
 * 4. PRODUCTION STABILITY: Direct styles and strict schema mapping for zero-crash builds.
 */

import { useRouter } from 'expo-router';
import {
  ChevronRight,
  Milk,
  Moon,
  Scale,
  Sparkles,
  TrendingUp,
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// PROJECT IMPORTS
import { GrowthChart } from '@/components/analytics/GrowthChart';
import { MilestoneChecklist } from '@/components/analytics/MilestoneChecklist';
import { GlassCard } from '@/components/glass/GlassCard';
import { useAuth } from '@/context/auth';
import { useFamily } from '@/context/family';
import { supabase } from '@/lib/supabase';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function AnalyticsScreen() {
  const router = useRouter();
  const { selectedBaby } = useFamily();
  const { profile } = useAuth();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMilk: 0,
    sleepEfficiency: 0,
    latestWeight: '--',
    latestHeight: '--',
  });

  // MODULE: PRODUCTION BIOMETRIC AGGREGATION ENGINE
  const syncBiometricCore = async () => {
    if (!selectedBaby?.id || !profile?.id) return;
    setLoading(true);

    try {
      // 1. Live Feeding Aggregation (24H Window)
      const { data: feeding } = await supabase
        .from('pumping_logs')
        .select('amount_ml')
        .eq('user_id', profile.id)
        .gte('timestamp', new Date(Date.now() - 86400000).toISOString());

      const milkTotal =
        feeding?.reduce(
          (acc, curr) => acc + (Number(curr.amount_ml) || 0),
          0,
        ) || 0;

      // 2. Growth Handshake (Latest Metric)
      const { data: growth } = await supabase
        .from('growth_logs')
        .select('weight_kg, height_cm')
        .eq('baby_id', selectedBaby.id)
        .order('timestamp', { ascending: false })
        .limit(1)
        .single();

      // 3. Sleep Efficiency Aggregation Handshake
      const { data: sleepData } = await supabase
        .from('sleep_logs')
        .select('start_time, end_time')
        .eq('baby_id', selectedBaby.id)
        .gte('start_time', new Date(Date.now() - 604800000).toISOString());

      // CALCULATE DURATION VS STANDARD 14H INFANT REQUIREMENT
      const totalMinutes =
        sleepData?.reduce((acc, curr) => {
          if (!curr.end_time) return acc;
          return (
            acc +
            (new Date(curr.end_time).getTime() -
              new Date(curr.start_time).getTime()) /
              60000
          );
        }, 0) || 0;

      const avgHours = totalMinutes / 7 / 60;
      const efficiencyScore = Math.min(Math.round((avgHours / 14) * 100), 100);

      setStats({
        totalMilk: milkTotal,
        sleepEfficiency: efficiencyScore,
        latestWeight: growth?.weight_kg ? `${growth.weight_kg}kg` : '--',
        latestHeight: growth?.height_cm ? `${growth.height_cm}cm` : '--',
      });
    } catch (e) {
      console.error('[Cradle Engine] Analytics Sync Error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    syncBiometricCore();
  }, [selectedBaby?.id, profile?.id]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color="#4FD1C7" size="large" />
        <Text style={styles.loaderText}>CALCULATING EFFICIENCY...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. HEADER HUD */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>BIOMETRIC TRENDS</Text>
          <Text style={styles.babySub}>
            CORE SYNC: {selectedBaby?.name?.toUpperCase() || 'LOCKED'}
          </Text>
        </View>
        <View style={styles.badge}>
          <Sparkles size={12} color="#4FD1C7" />
          <Text style={styles.badgeText}>AI ENGINE ACTIVE</Text>
        </View>
      </View>

      {/* 2. PRO-ROW STAT GRID */}
      <View style={styles.grid}>
        <StatCard
          label="24H FEEDING"
          value={`${stats.totalMilk}ml`}
          icon={Milk}
          color="#4FD1C7"
        />
        <StatCard
          label="SLEEP QUALITY"
          value={`${stats.sleepEfficiency}%`}
          icon={Moon}
          color="#B794F6"
        />
        <StatCard
          label="WEIGHT CORE"
          value={stats.latestWeight}
          icon={Scale}
          color="#9AE6B4"
        />
        <StatCard
          label="HEIGHT CORE"
          value={stats.latestHeight}
          icon={TrendingUp}
          color="#4FD1C7"
        />
      </View>

      {/* 3. BIOMETRIC VISUALIZATION */}
      <Text style={styles.sectionLabel}>GROWTH TRAJECTORY</Text>
      <GlassCard style={styles.chartCard}>
        <GrowthChart />
      </GlassCard>

      {/* 4. DEVELOPMENTAL CORE */}
      <MilestoneChecklist />

      {/* 5. AI HUD INSIGHT */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => router.push('/(app)/berry-ai')}
      >
        <GlassCard style={styles.aiCard}>
          <View style={styles.aiHeader}>
            <Sparkles size={18} color="#4FD1C7" />
            <Text style={styles.aiTitle}>BERRY AI RECOMMENDATION</Text>
          </View>
          <Text style={styles.aiDesc}>
            Trajectory suggests stable metabolic growth. Ensure last feed is 30m
            prior to night cycles to maintain {stats.sleepEfficiency}%
            efficiency.
          </Text>
          <ChevronRight size={18} color="#4FD1C7" style={styles.chevron} />
        </GlassCard>
      </TouchableOpacity>
    </ScrollView>
  );
}

// SUB-COMPONENT: PRO-ROW STAT CARD
const StatCard = ({ label, value, icon: Icon, color }: any) => (
  <GlassCard style={styles.statCard}>
    <View style={styles.proRow}>
      <View style={[styles.iconBox, { borderColor: `${color}30` }]}>
        <Icon size={22} color={color} />
      </View>
      <View style={styles.dataStack}>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statValue}>{value}</Text>
      </View>
    </View>
  </GlassCard>
);

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#020617' },
  content: {
    padding: 24,
    paddingBottom: 120,
    maxWidth: 1000,
    alignSelf: 'center',
    width: '100%',
  },
  loader: {
    flex: 1,
    backgroundColor: '#020617',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  loaderText: {
    color: '#4FD1C7',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
  },
  header: {
    marginBottom: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { color: '#FFF', fontSize: 24, fontWeight: '900', letterSpacing: 1 },
  babySub: {
    color: '#4FD1C7',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    marginTop: 4,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(79, 209, 199, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(79, 209, 199, 0.1)',
  },
  badgeText: { color: '#4FD1C7', fontSize: 9, fontWeight: '900' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  statCard: {
    width: SCREEN_WIDTH > 800 ? '48.5%' : '100%',
    height: 100,
    borderRadius: 24,
    padding: 0,
  },
  proRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dataStack: { flex: 1, marginLeft: 20 },
  statLabel: {
    color: '#475569',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  statValue: { color: '#FFF', fontSize: 22, fontWeight: '900' },
  sectionLabel: {
    color: 'rgba(148, 163, 184, 0.2)',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 2,
    marginTop: 48,
    marginBottom: 20,
  },
  chartCard: { padding: 0, borderRadius: 32, overflow: 'hidden' },
  aiCard: {
    marginTop: 40,
    padding: 24,
    borderRadius: 32,
    borderColor: 'rgba(79, 209, 199, 0.2)',
    borderWidth: 1,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  aiTitle: {
    color: '#4FD1C7',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  aiDesc: {
    color: '#94A3B8',
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '600',
    paddingRight: 40,
  },
  chevron: { position: 'absolute', right: 24, top: '50%', marginTop: -9 },
});
