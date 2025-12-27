/**
 * PROJECT CRADLE: THE HUB (DASHBOARD) V9.6 - TS STABILITY PATCH
 * Path: app/(app)/index.tsx
 * THEME: PROJECT CRADLE (Teal #4FD1C7 | Obsidian #020617)
 * FIXES:
 * - TS 2769/2322: Resolved Style property overlaps (cursor/userSelect).
 * - TS 2353: Removed invalid 'borderVariant' property from StyleSheet.
 * - TS Flattening: Unified style arrays using StyleSheet.flatten.
 */

import * as Haptics from 'expo-haptics';
import {
  Activity,
  ArrowRight,
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
  TextStyle,
  TouchableOpacity,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { GlassCard } from '@/components/glass/GlassCard';
import { ProUpgradeModal } from '@/components/monetization/ProUpgradeModal';
import { useAuth } from '@/context/auth';
import { supabase } from '@/lib/supabase';

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
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const babyName = profile?.baby_name || 'Your Baby';
  const isPremium = ['ADMIN', 'PREMIUM_MEMBER'].includes(profile?.role || '');

  const triggerHaptic = (style = Haptics.ImpactFeedbackStyle.Light) => {
    if (typeof window !== 'undefined' || !Haptics.impactAsync) return;
    try {
      Haptics.impactAsync(style);
    } catch (e) {
      /* silent fail on web */
    }
  };

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
        // Handle empty states
      } finally {
        setLoading(false);
      }
    }
    fetchLatestEvent();
  }, [user?.id]);

  return (
    <ScrollView
      style={styles.root as ViewStyle}
      contentContainerStyle={styles.scrollContent as ViewStyle}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={StyleSheet.flatten([
          styles.container,
          isDesktop && styles.desktopMaxWidth,
        ])}
      >
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

        {/* 2. BERRY AI HUD / UPGRADE TRIGGER */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(800)}
          style={styles.aiWrapper}
        >
          {isPremium ? (
            <GlassCard variant="teal" style={styles.aiCard}>
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
          ) : (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
                setShowUpgradeModal(true);
              }}
            >
              <GlassCard style={styles.upgradeCard}>
                <View style={styles.rowBetween}>
                  <View style={styles.row}>
                    <View style={styles.proIconBox}>
                      <Sparkles size={20} color="#C084FC" />
                    </View>
                    <View style={{ marginLeft: 16 }}>
                      <Text style={styles.proTitle}>ACTIVATE BERRY AI</Text>
                      <Text style={styles.proSub}>
                        Unlock predictive sleep insights and biometric trends.
                      </Text>
                    </View>
                  </View>
                  <ArrowRight size={20} color="#C084FC" />
                </View>
              </GlassCard>
            </TouchableOpacity>
          )}
        </Animated.View>

        {/* 3. RESPONSIVE GRID */}
        <View
          style={StyleSheet.flatten([
            styles.gridRow,
            isDesktop && styles.desktopRow,
          ])}
        >
          <View
            style={StyleSheet.flatten([
              styles.column,
              isDesktop && { flex: 0.4 },
            ])}
          >
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

          <View
            style={StyleSheet.flatten([
              styles.column,
              isDesktop && { flex: 0.6 },
            ])}
          >
            <View style={styles.ledgerHeader}>
              <Text style={styles.sectionTitle}>RECENT ACTIVITY</Text>
              <TouchableOpacity>
                <Text style={styles.viewAll}>TIMELINE</Text>
              </TouchableOpacity>
            </View>

            <GlassCard style={styles.activityCard}>
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
                    <Text style={styles.activityTypeText}>
                      {lastActivity.event_type.replace('_', ' ')}
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
    <View
      style={StyleSheet.flatten([
        styles.actionIconWrapper,
        { borderColor: `${color}40` },
      ])}
    >
      <Icon size={24} color={color} />
    </View>
    <Text style={styles.actionLabel}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#020617' },
  scrollContent: { alignItems: 'center', paddingBottom: 120 },
  container: { width: '100%', padding: 24 },
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
  } as TextStyle,
  babyName: {
    color: '#FFF',
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: -1.5,
    marginTop: 4,
  } as TextStyle,
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
  } as TextStyle,
  aiWrapper: { marginBottom: 32, width: '100%' },
  aiCard: { borderColor: 'rgba(79, 209, 199, 0.2)', borderWidth: 1 },
  upgradeCard: {
    padding: 20,
    borderRadius: 24,
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
    padding: 12,
    backgroundColor: 'rgba(192, 132, 252, 0.1)',
    borderRadius: 16,
  },
  proTitle: {
    color: '#C084FC',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
  } as TextStyle,
  proSub: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  } as TextStyle,
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
  } as TextStyle,
  pressureBadge: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  pressureText: {
    color: '#94A3B8',
    fontSize: 9,
    fontWeight: '800',
  } as TextStyle,
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
  } as TextStyle,
  predictionTime: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: '900',
  } as TextStyle,
  predictionValue: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '800',
  } as TextStyle,
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
  } as TextStyle,
  gridRow: { gap: 32 },
  desktopRow: { flexDirection: 'row', alignItems: 'flex-start' },
  column: { gap: 16 },
  sectionTitle: {
    color: '#475569',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 2,
  } as TextStyle,
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
  actionLabel: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '700',
  } as TextStyle,
  ledgerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewAll: { color: '#4FD1C7', fontSize: 11, fontWeight: '900' } as TextStyle,
  activityCard: { padding: 0, overflow: 'hidden' },
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
  activityTypeText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'capitalize',
  } as TextStyle,
  activityMeta: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  } as TextStyle,
  emptyState: { padding: 40, alignItems: 'center', gap: 12 },
  emptyText: { color: '#475569', fontWeight: '700', fontSize: 13 } as TextStyle,
});
