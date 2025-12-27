/**
 * PROJECT CRADLE: THE HUB (DASHBOARD) V9.1 (STABILITY PATCH)
 * Path: app/(app)/index.tsx
 * * FEATURES:
 * - Desktop Optimization: Max-width constraint (1280px) with centered alignment.
 * - Grid Refinement: Side-by-side layout for logs and activity on desktop viewport.
 * - RBAC Protection: Premium-only Berry AI Insight header.
 * - Dynamic Ledger: Real-time synchronization with care_events core.
 */

import {
  Activity,
  ChevronRight,
  Clock,
  Milk,
  Moon,
  Plus,
  Sparkles,
  Zap,
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { GlassCard } from '@/components/glass/GlassCard';
import { useAuth } from '@/context/auth';
import { supabase } from '@/lib/supabase';

// --- TYPES ---
interface QuickActionProps {
  label: string;
  icon: any;
  color: string;
  onPress: () => void;
}

export default function Dashboard() {
  const { profile, user } = useAuth();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const [lastActivity, setLastActivity] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // --- DYNAMIC IDENTITY RESOLUTION ---
  const babyName = profile?.baby_name || 'Your Baby';
  const isPremium = ['ADMIN', 'PREMIUM_MEMBER'].includes(profile?.role || '');

  // Mocked for UI/UX demonstration - logic will be replaced by sleep engine hooks
  const sleepPrediction = {
    nextNap: '10:45 AM',
    awakeWindow: '2h 15m',
    pressure: 68,
  };

  useEffect(() => {
    async function fetchLatestEvent() {
      if (!user?.id) return;
      try {
        const { data } = await supabase
          .from('care_events')
          .select('*')
          .eq('user_id', user.id)
          .order('timestamp', { ascending: false })
          .limit(1)
          .single();
        if (data) setLastActivity(data);
      } catch (err) {
        // Silent catch for initial empty states
      } finally {
        setLoading(false);
      }
    }
    fetchLatestEvent();
  }, [user?.id]);

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* MAX-WIDTH CONTAINER: Prevents elements from stretching on desktop */}
      <View style={[styles.container, isDesktop && styles.desktopMaxWidth]}>
        {/* 1. WELCOME SECTION */}
        <Animated.View
          entering={FadeInDown.duration(600)}
          style={styles.header}
        >
          <View>
            <Text style={styles.greeting}>Welcome Back,</Text>
            <Text style={styles.babyName}>{babyName}</Text>
          </View>
          <View style={styles.syncStatus}>
            <Activity size={14} color="#4FD1C7" />
            <Text style={styles.syncText}>ENCRYPTED SYNC</Text>
          </View>
        </Animated.View>

        {/* 2. BERRY AI HUD (FULL WIDTH ON ALL TIERS) */}
        {isPremium && (
          <Animated.View
            entering={FadeInDown.delay(200).duration(800)}
            style={styles.aiWrapper}
          >
            <GlassCard variant="teal" className="border-primary/20">
              <View style={styles.aiHeader}>
                <View style={styles.aiLabelRow}>
                  <Sparkles size={18} color="#4FD1C7" />
                  <Text style={styles.aiTitle}>BERRY AI INSIGHT</Text>
                </View>
                <View style={styles.pressureBadge}>
                  <Text style={styles.pressureText}>
                    {sleepPrediction.pressure}% SLEEP PRESSURE
                  </Text>
                </View>
              </View>

              <View style={styles.predictionRow}>
                <View style={styles.stat}>
                  <Text style={styles.predictionLabel}>PREDICTED NEXT NAP</Text>
                  <Text style={styles.predictionTime}>
                    {sleepPrediction.nextNap}
                  </Text>
                </View>
                <View style={styles.verticalDivider} />
                <View style={styles.stat}>
                  <Text style={styles.predictionLabel}>AWAKE WINDOW</Text>
                  <Text style={styles.predictionValue}>
                    {sleepPrediction.awakeWindow}
                  </Text>
                </View>
              </View>

              <TouchableOpacity style={styles.aiActionBtn}>
                <Text style={styles.aiActionText}>VIEW OPTIMIZED SCHEDULE</Text>
                <ChevronRight size={14} color="#020617" />
              </TouchableOpacity>
            </GlassCard>
          </Animated.View>
        )}

        {/* 3. RESPONSIVE GRID: Stacks on mobile, Side-by-side on desktop */}
        <View style={[styles.gridRow, isDesktop && styles.desktopRow]}>
          {/* QUICK LOGS COLUMN */}
          <View style={[styles.column, isDesktop && { flex: 0.4 }]}>
            <Text style={styles.sectionTitle}>QUICK LOG</Text>
            <View style={styles.actionsRow}>
              <QuickAction
                label="Feed"
                icon={Milk}
                color="#4FD1C7"
                onPress={() => {}}
              />
              <QuickAction
                label="Sleep"
                icon={Moon}
                color="#B794F6"
                onPress={() => {}}
              />
              <QuickAction
                label="Diaper"
                icon={Plus}
                color="#9AE6B4"
                onPress={() => {}}
              />
            </View>
          </View>

          {/* RECENT ACTIVITY COLUMN */}
          <View style={[styles.column, isDesktop && { flex: 0.6 }]}>
            <View style={styles.ledgerHeader}>
              <Text style={styles.sectionTitle}>RECENT ACTIVITY</Text>
              <TouchableOpacity>
                <Text style={styles.viewAll}>TIMELINE</Text>
              </TouchableOpacity>
            </View>

            <GlassCard className="p-0 overflow-hidden">
              {loading ? (
                <View style={styles.emptyState}>
                  <ActivityIndicator color="#4FD1C7" />
                </View>
              ) : lastActivity ? (
                <TouchableOpacity style={styles.activityItem}>
                  <View style={styles.activityIconWrapper}>
                    <Zap size={18} color="#4FD1C7" />
                  </View>
                  <View style={styles.activityInfo}>
                    <Text style={styles.activityType}>
                      {lastActivity.event_type}
                    </Text>
                    <Text style={styles.activityMeta}>
                      {new Date(lastActivity.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>
                  <ChevronRight size={16} color="#475569" />
                </TouchableOpacity>
              ) : (
                <View style={styles.emptyState}>
                  <Clock size={24} color="#475569" />
                  <Text style={styles.emptyText}>
                    No events logged for {babyName}.
                  </Text>
                </View>
              )}
            </GlassCard>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const QuickAction = ({
  label,
  icon: Icon,
  color,
  onPress,
}: QuickActionProps) => (
  <TouchableOpacity onPress={onPress} style={styles.actionBtn}>
    <View style={[styles.actionIconWrapper, { borderColor: `${color}40` }]}>
      <Icon size={24} color={color} />
    </View>
    <Text style={styles.actionLabel}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#020617' },
  scrollContent: { alignItems: 'center', paddingBottom: 120 },
  container: { width: '100%', padding: 24 },
  // Constrains width on large screens to maintain readability
  desktopMaxWidth: { maxWidth: 1280, padding: 48 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 40,
  },
  greeting: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  babyName: {
    color: '#FFF',
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: -1.5,
    marginTop: 4,
  },
  syncStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(79, 209, 199, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(79, 209, 199, 0.1)',
  },
  syncText: {
    color: '#4FD1C7',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
  aiWrapper: { marginBottom: 32, width: '100%' },
  aiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  aiLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  aiTitle: {
    color: '#4FD1C7',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  pressureBadge: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  pressureText: { color: '#94A3B8', fontSize: 9, fontWeight: '800' },
  predictionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 40,
    marginBottom: 24,
  },
  stat: { flexShrink: 1 },
  predictionLabel: {
    color: '#475569',
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 4,
  },
  predictionTime: { color: '#FFF', fontSize: 32, fontWeight: '900' },
  predictionValue: { color: '#FFF', fontSize: 24, fontWeight: '800' },
  verticalDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  aiActionBtn: {
    backgroundColor: '#4FD1C7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 10,
  },
  aiActionText: {
    color: '#020617',
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 1,
  },
  gridRow: { gap: 32 },
  // Side-by-side alignment logic for desktop
  desktopRow: { flexDirection: 'row', alignItems: 'flex-start' },
  column: { gap: 16 },
  sectionTitle: {
    color: '#475569',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionBtn: { flex: 1, alignItems: 'center', gap: 12 },
  actionIconWrapper: {
    width: '100%',
    aspectRatio: 1,
    maxWidth: 80,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: { color: '#94A3B8', fontSize: 13, fontWeight: '700' },
  ledgerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewAll: { color: '#4FD1C7', fontSize: 11, fontWeight: '900' },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  activityIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(79, 209, 199, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityInfo: { flex: 1 },
  activityType: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  activityMeta: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  emptyState: { padding: 40, alignItems: 'center', gap: 12 },
  emptyText: { color: '#475569', fontWeight: '700', fontSize: 13 },
});
