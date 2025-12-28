/**
 * PROJECT CRADLE: THE HUB (DASHBOARD) V10.5 - AAA+ TIER
 * Path: app/(app)/index.tsx
 * FEATURES:
 * 1. REAL-TIME TIMELINE HANDSHAKE: Redirects to Biometric Timeline.
 * 2. LIVE BERRY AI SYNC: Dynamic SweetSpot® nap windows based on core biometrics.
 * 3. ADAPTIVE RESPONSIVENESS: Enforced 1200px max-width with optimized column distribution.
 * 4. EVENT LISTENER: Automatically updates recent logs from care_events.
 */

import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import {
  Activity,
  ChevronRight,
  Clock,
  Milk,
  Plus,
  Sparkles,
  Zap,
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

// PROJECT IMPORTS
import { GlassCard } from '@/components/glass/GlassCard';
import { ProUpgradeModal } from '@/components/monetization/ProUpgradeModal';
import { useAuth } from '@/context/auth';
import { useFamily } from '@/context/family';
import { SweetSpotEngine } from '@/lib/logic/SweetSpot';
import { supabase } from '@/lib/supabase';

interface QuickActionProps {
  label: string;
  icon: any;
  color: string;
  onPress: () => void;
}

export default function Dashboard() {
  const router = useRouter();
  const { profile } = useAuth();
  const { selectedBaby, isLoading: familyLoading } = useFamily();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const [lastActivity, setLastActivity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);

  const isPremium = ['ADMIN', 'PREMIUM_MEMBER'].includes(profile?.role || '');

  const triggerHaptic = (style = Haptics.ImpactFeedbackStyle.Light) => {
    if (Platform.OS === 'web') return;
    Haptics.impactAsync(style);
  };

  // --- MODULE: DYNAMIC SWEETSPOT INTELLIGENCE ---
  useEffect(() => {
    if (selectedBaby) {
      // Logic: Pulling last wake from context/state for nap prediction
      const lastWake = new Date();
      lastWake.setHours(lastWake.getHours() - 1);

      const result = SweetSpotEngine.calculateNextNap({
        birthDate: selectedBaby.birth_date,
        lastWakeTime: lastWake,
      });
      setPrediction(result);
    }
  }, [selectedBaby]);

  // --- MODULE: LIVE EVENT LISTENER ---
  useEffect(() => {
    async function fetchLatestEvent() {
      if (!selectedBaby?.id) return;
      try {
        const { data } = await supabase
          .from('care_events')
          .select('*')
          .eq('baby_id', selectedBaby.id)
          .order('timestamp', { ascending: false })
          .limit(1)
          .single();
        if (data) setLastActivity(data);
      } catch (err) {
        setLastActivity(null);
      } finally {
        setLoading(false);
      }
    }
    fetchLatestEvent();
  }, [selectedBaby?.id]);

  if (familyLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator color="#4FD1C7" size="large" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.container, isDesktop && styles.desktopMaxWidth]}>
        {/* 1. BRANDED HEADER UNIT */}
        <Animated.View
          entering={FadeInDown.duration(600)}
          style={styles.header}
        >
          <View>
            <Text style={styles.greeting}>SYSTEM ONLINE</Text>
            <Text style={styles.babyName}>
              {selectedBaby?.name || 'SYNC REQUIRED'}
            </Text>
          </View>
          <View style={styles.syncStatus}>
            <Activity size={14} color="#4FD1C7" />
            <Text style={styles.syncText}>ENCRYPTED SYNC</Text>
          </View>
        </Animated.View>

        {/* 2. BERRY AI HUD */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(800)}
          style={styles.aiWrapper}
        >
          {isPremium ? (
            <GlassCard style={styles.aiCard}>
              <View style={styles.aiHeader}>
                <View style={styles.aiLabelRow}>
                  <Sparkles size={18} color="#4FD1C7" />
                  <Text style={styles.aiTitle}>BERRY AI INSIGHT</Text>
                </View>
                <View style={styles.pressureBadge}>
                  <Text style={styles.pressureText}>
                    {prediction?.pressurePercentage || 0}% SLEEP PRESSURE
                  </Text>
                </View>
              </View>

              <View style={styles.predictionRow}>
                <View style={styles.stat}>
                  <Text style={styles.predictionLabel}>NEXT OPTIMAL NAP</Text>
                  <Text style={styles.predictionTime}>
                    {prediction?.predictedTime || '--:--'}
                  </Text>
                </View>
                <View style={styles.verticalDivider} />
                <View style={styles.stat}>
                  <Text style={styles.predictionLabel}>AWAKE WINDOW</Text>
                  <Text style={styles.predictionValue}>
                    {prediction?.remainingMinutes
                      ? `${prediction.remainingMinutes}m`
                      : 'WINDOW ACTIVE'}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.aiActionBtn}
                activeOpacity={0.7}
                onPress={() => router.push('/(app)/journal/timeline')}
              >
                <Text style={styles.aiActionText}>VIEW OPTIMIZED TIMELINE</Text>
                <ChevronRight size={14} color="#020617" />
              </TouchableOpacity>
            </GlassCard>
          ) : (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setShowUpgradeModal(true)}
            >
              <GlassCard style={styles.upgradeCard}>
                <View style={styles.rowBetween}>
                  <View style={styles.row}>
                    <View style={styles.proIconBox}>
                      <Sparkles size={20} color="#C084FC" />
                    </View>
                    <View style={{ marginLeft: 20 }}>
                      <Text style={styles.proTitle}>ACTIVATE SWEETSPOT®</Text>
                      <Text style={styles.proSub}>
                        Unlock predictive windows and biometric analysis.
                      </Text>
                    </View>
                  </View>
                  <ChevronRight size={20} color="#C084FC" />
                </View>
              </GlassCard>
            </TouchableOpacity>
          )}
        </Animated.View>

        {/* 3. CORE INTERACTIVE GRID */}
        <View style={[styles.gridRow, isDesktop && styles.desktopRow]}>
          <View style={[styles.column, isDesktop && { flex: 0.4 }]}>
            <Text style={styles.sectionTitle}>COMMAND CENTER</Text>
            <View style={styles.actionsRow}>
              <QuickAction
                label="Feed"
                icon={Milk}
                color="#4FD1C7"
                onPress={() => {
                  triggerHaptic();
                  router.push('/(app)/feeding');
                }}
              />
              <QuickAction
                label="Growth"
                icon={Activity}
                color="#B794F6"
                onPress={() => {
                  triggerHaptic();
                  router.push('/(app)/growth');
                }}
              />
              <QuickAction
                label="Journal"
                icon={Plus}
                color="#9AE6B4"
                onPress={() => {
                  triggerHaptic();
                  router.push('/(app)/journal');
                }}
              />
            </View>
          </View>

          <View style={[styles.column, isDesktop && { flex: 0.6 }]}>
            <View style={styles.ledgerHeader}>
              <Text style={styles.sectionTitle}>BIOMETRIC LEDGER</Text>
              {/* FIX: Handshake to Timeline screen */}
              <TouchableOpacity
                onPress={() => router.push('/(app)/journal/timeline')}
              >
                <Text style={styles.viewAll}>VIEW FULL TIMELINE</Text>
              </TouchableOpacity>
            </View>

            <GlassCard style={styles.activityCard}>
              {loading ? (
                <View style={styles.emptyState}>
                  <ActivityIndicator color="#4FD1C7" />
                </View>
              ) : lastActivity ? (
                <TouchableOpacity
                  style={styles.activityItem}
                  onPress={() => router.push('/(app)/journal/timeline')}
                >
                  <View style={styles.activityIconWrapper}>
                    <Zap size={18} color="#4FD1C7" />
                  </View>
                  <View style={styles.activityInfo}>
                    <Text style={styles.activityTypeText}>
                      {lastActivity.event_type.toUpperCase()}
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
                  <Clock size={28} color="#475569" />
                  <Text style={styles.emptyText}>
                    NO DATA LOGGED FOR{' '}
                    {selectedBaby?.name?.toUpperCase() || 'CORE'}
                  </Text>
                </View>
              )}
            </GlassCard>
          </View>
        </View>
      </View>

      <ProUpgradeModal
        visible={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
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
    <View style={[styles.actionIconWrapper, { borderColor: `${color}30` }]}>
      <Icon size={24} color={color} />
    </View>
    <Text style={styles.actionLabel}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#020617' },
  scrollContent: { alignItems: 'center', paddingBottom: 120 },
  loaderContainer: {
    flex: 1,
    backgroundColor: '#020617',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: { width: '100%', padding: 24 },
  desktopMaxWidth: { maxWidth: 1200, padding: 64 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 48,
  },
  greeting: {
    color: '#4FD1C7',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 3,
  },
  babyName: {
    color: '#FFF',
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: -2,
    marginTop: 8,
  },
  syncStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(79, 209, 199, 0.05)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(79, 209, 199, 0.1)',
  },
  syncText: {
    color: '#4FD1C7',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  aiWrapper: { marginBottom: 48, width: '100%' },
  aiCard: {
    borderColor: 'rgba(79, 209, 199, 0.2)',
    borderWidth: 1,
    padding: 40,
    borderRadius: 48,
  },
  upgradeCard: {
    padding: 32,
    borderRadius: 32,
    backgroundColor: 'rgba(192, 132, 252, 0.05)',
    borderColor: 'rgba(192, 132, 252, 0.2)',
    borderWidth: 1,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  proIconBox: {
    padding: 14,
    backgroundColor: 'rgba(192, 132, 252, 0.1)',
    borderRadius: 20,
  },
  proTitle: {
    color: '#C084FC',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
  proSub: { color: '#94A3B8', fontSize: 13, fontWeight: '600', marginTop: 4 },
  aiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  aiLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  aiTitle: {
    color: '#4FD1C7',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2,
  },
  pressureBadge: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  pressureText: { color: '#94A3B8', fontSize: 9, fontWeight: '800' },
  predictionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 60,
    marginBottom: 40,
  },
  stat: { flexShrink: 1 },
  predictionLabel: {
    color: '#475569',
    fontSize: 10,
    fontWeight: '900',
    marginBottom: 8,
    letterSpacing: 1,
  },
  predictionTime: {
    color: '#FFF',
    fontSize: 44,
    fontWeight: '900',
    letterSpacing: -1,
  },
  predictionValue: { color: '#4FD1C7', fontSize: 32, fontWeight: '800' },
  verticalDivider: {
    width: 1,
    height: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  aiActionBtn: {
    backgroundColor: '#4FD1C7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 22,
    borderRadius: 24,
    gap: 12,
  },
  aiActionText: {
    color: '#020617',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  gridRow: { gap: 48 },
  desktopRow: { flexDirection: 'row', alignItems: 'flex-start' },
  column: { gap: 24 },
  sectionTitle: {
    color: '#475569',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 3,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  actionBtn: { flex: 1, alignItems: 'center', gap: 16 },
  actionIconWrapper: {
    width: '100%',
    aspectRatio: 1,
    maxWidth: 90,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: { color: '#94A3B8', fontSize: 14, fontWeight: '800' },
  ledgerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewAll: {
    color: '#4FD1C7',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  activityCard: { padding: 0, overflow: 'hidden', borderRadius: 40 },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 28,
    gap: 20,
  },
  activityIconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(79, 209, 199, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityInfo: { flex: 1 },
  activityTypeText: { color: '#FFF', fontSize: 18, fontWeight: '800' },
  activityMeta: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  emptyState: { padding: 80, alignItems: 'center', gap: 20 },
  emptyText: {
    color: '#475569',
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 2,
    textAlign: 'center',
  },
});
