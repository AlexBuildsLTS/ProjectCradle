/**
 * PROJECT CRADLE: MASTER ANALYTICS CORE V27.0 (INTERACTIVE INTELLIGENCE)
 * Path: app/(app)/analytics.tsx
 * ----------------------------------------------------------------------------
 * FEATURES:
 * 1. INTERACTIVE SVG ENGINE: Mouse-over precision for Dual-Biometric trajectories.
 * 2. DUAL-METRIC VISUALIZATION: Weight (Teal) and Height (Purple) on one canvas.
 * 3. REAL-TIME AGGREGATION: Synced with 'pumping_logs', 'sleep_logs', 'growth_logs'.
 * 4. ARCHITECTURE: Wide-grid dynamic HUD with focused tooltips.
 */

import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import {
  Activity,
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
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from 'react-native-svg';

import { MilestoneChecklist } from '@/components/analytics/MilestoneChecklist';
import { GlassCard } from '@/components/glass/GlassCard';
import { useAuth } from '@/context/auth';
import { useFamily } from '@/context/family';
import { Theme } from '@/lib/shared/Theme';
import { supabase } from '@/lib/supabase';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function AnalyticsScreen() {
  const router = useRouter();
  const { selectedBaby } = useFamily() as any;
  const { profile } = useAuth();

  const [loading, setLoading] = useState(true);
  const [growthData, setGrowthData] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalMilk: 0,
    sleepEfficiency: 0,
    latestWeight: '--',
    latestHeight: '--',
  });

  const syncCore = async () => {
    if (!selectedBaby?.id) return;
    setLoading(true);

    try {
      // 1. Live Feeding Aggregation (24H)
      const { data: feeding } = await supabase
        .from('pumping_logs')
        .select('amount_ml')
        .gte('timestamp', new Date(Date.now() - 86400000).toISOString());

      const milkTotal =
        feeding?.reduce(
          (acc, curr) => acc + (Number(curr.amount_ml) || 0),
          0,
        ) || 0;

      // 2. Trajectory Data Fetch (Last 10 entries)
      const { data: growth } = await supabase
        .from('growth_logs')
        .select('weight_kg, height_cm, timestamp')
        .eq('baby_id', selectedBaby.id)
        .order('timestamp', { ascending: true })
        .limit(10);

      setGrowthData(growth || []);

      // 3. Sleep Efficiency Engine
      const { data: sleep } = await supabase
        .from('sleep_logs')
        .select('start_time, end_time')
        .eq('baby_id', selectedBaby.id)
        .gte('start_time', new Date(Date.now() - 604800000).toISOString());

      const totalMins =
        sleep?.reduce((acc, curr) => {
          if (!curr.end_time) return acc;
          return (
            acc +
            (new Date(curr.end_time).getTime() -
              new Date(curr.start_time).getTime()) /
              60000
          );
        }, 0) || 0;

      const efficiency = Math.min(
        Math.round((totalMins / 7 / 60 / 14) * 100),
        100,
      );
      const latest = growth?.[growth.length - 1];

      setStats({
        totalMilk: milkTotal,
        sleepEfficiency: efficiency,
        latestWeight: latest?.weight_kg ? `${latest.weight_kg}kg` : '--',
        latestHeight: latest?.height_cm ? `${latest.height_cm}cm` : '--',
      });
    } catch (e) {
      console.error('[Analytics] Sync Error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    syncCore();
  }, [selectedBaby?.id]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color={Theme.colors.primary} size="large" />
        <Text style={styles.loaderText}>BOOTING ANALYTICS CORE...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>BIOMETRIC TRENDS</Text>
          <Text style={styles.babySub}>
            CORE SYNC: {selectedBaby?.name?.toUpperCase()}
          </Text>
        </View>
        <View style={styles.badge}>
          <Activity size={12} color={Theme.colors.primary} />
          <Text style={styles.badgeText}>REAL-TIME FEED</Text>
        </View>
      </View>

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

      {/* INTERACTIVE DUAL-LINE CHART HUD */}
      <Text style={styles.sectionLabel}>GROWTH TRAJECTORY (INTERACTIVE)</Text>
      <GlassCard style={styles.chartCard}>
        {growthData.length > 1 ? (
          <InteractiveGrowthChart data={growthData} />
        ) : (
          <View style={styles.emptyChart}>
            <Activity size={32} color="rgba(255,255,255,0.05)" />
            <Text style={styles.emptyText}>
              NOT ENOUGH DATA TO GENERATE TRENDS
            </Text>
          </View>
        )}
      </GlassCard>

      <MilestoneChecklist />

      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => router.push('/(app)/berry-ai')}
      >
        <GlassCard style={styles.aiCard}>
          <View style={styles.aiHeader}>
            <Sparkles size={18} color={Theme.colors.primary} />
            <Text style={styles.aiTitle}>BERRY AI INSIGHT</Text>
          </View>
          <Text style={styles.aiDesc}>
            Subject exhibits stable biometric progression. Trajectory suggests{' '}
            {stats.sleepEfficiency}% cycle optimization. Maintain current
            metabolic intake.
          </Text>
        </GlassCard>
      </TouchableOpacity>
    </ScrollView>
  );
}

// --- INTERACTIVE SVG CHART COMPONENT ---
const InteractiveGrowthChart = ({ data }: { data: any[] }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const chartWidth = Math.min(SCREEN_WIDTH - 48, 952);
  const chartHeight = 220;
  const padding = 30;

  const weights = data.map((d) => parseFloat(d.weight_kg));
  const heights = data.map((d) => parseFloat(d.height_cm));

  const getPoints = (vals: number[], color: string) => {
    const max = Math.max(...vals);
    const min = Math.min(...vals);
    const range = max - min || 1;
    return data.map((_, i) => {
      const x = (i / (data.length - 1)) * (chartWidth - padding * 2) + padding;
      const y =
        chartHeight -
        ((vals[i] - min) / range) * (chartHeight - padding * 2) -
        padding;
      return { x, y, val: vals[i] };
    });
  };

  const weightPoints = getPoints(weights, Theme.colors.primary);
  const heightPoints = getPoints(heights, '#B794F6');

  const weightPath = `M ${weightPoints
    .map((p) => `${p.x},${p.y}`)
    .join(' L ')}`;
  const heightPath = `M ${heightPoints
    .map((p) => `${p.x},${p.y}`)
    .join(' L ')}`;

  const handleInteraction = (event: any) => {
    const x = event.nativeEvent.locationX;
    const index = Math.round(
      ((x - padding) / (chartWidth - padding * 2)) * (data.length - 1),
    );
    if (index >= 0 && index < data.length) {
      if (Platform.OS !== 'web')
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setActiveIndex(index);
    }
  };

  return (
    <View onTouchStart={handleInteraction} onTouchMove={handleInteraction}>
      <Svg width={chartWidth} height={chartHeight}>
        <Defs>
          <LinearGradient id="gradWeight" x1="0" y1="0" x2="0" y2="1">
            <Stop
              offset="0"
              stopColor={Theme.colors.primary}
              stopOpacity="0.2"
            />
            <Stop offset="1" stopColor={Theme.colors.primary} stopOpacity="0" />
          </LinearGradient>
        </Defs>

        {/* Paths */}
        <Path
          d={`${weightPath} L ${
            chartWidth - padding
          },${chartHeight} L ${padding},${chartHeight} Z`}
          fill="url(#gradWeight)"
        />
        <Path
          d={weightPath}
          fill="none"
          stroke={Theme.colors.primary}
          strokeWidth="3"
        />
        <Path
          d={heightPath}
          fill="none"
          stroke="#B794F6"
          strokeWidth="3"
          strokeDasharray="5,5"
        />

        {/* Dynamic Tooltip */}
        {activeIndex !== null && (
          <>
            <Rect
              x={weightPoints[activeIndex].x - 1}
              y={padding}
              width="2"
              height={chartHeight - padding * 2}
              fill="rgba(255,255,255,0.1)"
            />
            <Circle
              cx={weightPoints[activeIndex].x}
              cy={weightPoints[activeIndex].y}
              r="6"
              fill={Theme.colors.primary}
            />
            <Circle
              cx={heightPoints[activeIndex].x}
              cy={heightPoints[activeIndex].y}
              r="6"
              fill="#B794F6"
            />
          </>
        )}
      </Svg>

      {/* TOOLTIP DATA OVERLAY */}
      {activeIndex !== null && (
        <View style={styles.tooltipHUD}>
          <Text style={styles.tooltipLabel}>
            INDEX: {new Date(data[activeIndex].timestamp).toLocaleDateString()}
          </Text>
          <View style={styles.tooltipRow}>
            <View
              style={[styles.dot, { backgroundColor: Theme.colors.primary }]}
            />
            <Text style={styles.tooltipVal}>W: {weights[activeIndex]}kg</Text>
            <View
              style={[
                styles.dot,
                { backgroundColor: '#B794F6', marginLeft: 12 },
              ]}
            />
            <Text style={styles.tooltipVal}>H: {heights[activeIndex]}cm</Text>
          </View>
        </View>
      )}
    </View>
  );
};

// --- SUB-COMPONENT: STAT CARD ---
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
    color: Theme.colors.primary,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 3,
  },
  header: {
    marginBottom: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { color: '#FFF', fontSize: 24, fontWeight: '900', letterSpacing: 1 },
  babySub: {
    color: Theme.colors.primary,
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
  badgeText: { color: Theme.colors.primary, fontSize: 9, fontWeight: '900' },
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
    color: 'rgba(148, 163, 184, 0.3)',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    marginTop: 48,
    marginBottom: 20,
    marginLeft: 4,
  },
  chartCard: {
    padding: 0,
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  emptyChart: {
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  emptyText: {
    color: '#475569',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
  tooltipHUD: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(2, 6, 23, 0.8)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  tooltipLabel: {
    color: '#475569',
    fontSize: 8,
    fontWeight: '900',
    marginBottom: 4,
  },
  tooltipRow: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 6, height: 6, borderRadius: 3 },
  tooltipVal: { color: '#FFF', fontSize: 11, fontWeight: '900', marginLeft: 6 },
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
    color: Theme.colors.primary,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  aiDesc: { color: '#94A3B8', fontSize: 14, lineHeight: 22, fontWeight: '600' },
});
