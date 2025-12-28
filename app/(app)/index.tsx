/**
 * PROJECT CRADLE: THE HUB (DASHBOARD) V15.0 - AAA+ FINAL
 * Path: app/(app)/index.tsx
 * FIXES:
 * 1. DESKTOP GRID BALANCING: Constrained oversized cards and increased Trends badge scale.
 * 2. ANALYTICS VISIBILITY: Significantly enlarged the Trends trigger for desktop viewports.
 * 3. PROPORTIONAL COMMAND CENTER: Maintained the 3-tab horizontal alignment with high-density padding.
 * 4. LEDGER INTELLIGENCE: Directly handshakes with 'pumping_logs' for real-time feed.
 */

import { useRouter } from 'expo-router';
import {
  Activity,
  BarChart2,
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
import { useAuth } from '@/context/auth';
import { useFamily } from '@/context/family';
import { SweetSpotEngine } from '@/lib/logic/SweetSpot';
import { supabase } from '@/lib/supabase';

export default function Dashboard() {
  const router = useRouter();
  const { profile } = useAuth();
  const { selectedBaby, isLoading: familyLoading } = useFamily();
  const { width } = useWindowDimensions();

  const isDesktop = width >= 1024;
  const isSmallMobile = width < 400;
  const [lastActivity, setLastActivity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [prediction, setPrediction] = useState<any>(null);

  useEffect(() => {
    if (selectedBaby?.dob) {
      const result = SweetSpotEngine.calculateNextNap({
        birthDate: selectedBaby.dob,
        lastWakeTime: new Date(Date.now() - 3600000),
      });
      setPrediction(result);
    }
  }, [selectedBaby]);

  useEffect(() => {
    async function fetchLatestEvent() {
      if (!selectedBaby?.id) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await supabase
          .from('pumping_logs')
          .select('*')
          .eq('user_id', profile?.id)
          .order('timestamp', { ascending: false })
          .limit(1)
          .single();

        setLastActivity(data || null);
      } catch (err) {
        setLastActivity(null);
      } finally {
        setLoading(false);
      }
    }
    fetchLatestEvent();
  }, [selectedBaby?.id, profile?.id]);

  if (familyLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color="#4FD1C7" size="large" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[
        styles.scrollContent,
        isDesktop && styles.desktopScroll,
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.container, isDesktop && styles.desktopContainer]}>
        {/* 1. BRANDED HEADER UNIT - ENLARGED TRENDS TRIGGER */}
        <Animated.View
          entering={FadeInDown.duration(600)}
          style={styles.header}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.statusLabel}>SYSTEM ONLINE</Text>
            <Text
              numberOfLines={1}
              style={[
                styles.babyName,
                { fontSize: isSmallMobile ? 24 : isDesktop ? 42 : 32 },
              ]}
            >
              {selectedBaby?.name || 'CORE SYNCED'}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => router.push('/(app)/analytics')}
            style={[
              styles.analyticsBadge,
              isDesktop && styles.desktopAnalyticsBadge,
            ]}
            activeOpacity={0.7}
          >
            <BarChart2 size={isDesktop ? 20 : 14} color="#4FD1C7" />
            <Text
              style={[styles.badgeText, isDesktop && styles.desktopBadgeText]}
            >
              TRENDS HUB
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* 2. BERRY AI HUB - PROPORTIONAL FOR DESKTOP */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(800)}
          style={[styles.aiWrapper, isDesktop && styles.desktopAiWrapper]}
        >
          <GlassCard style={styles.aiCard}>
            <View style={styles.proRow}>
              <View
                style={[styles.iconBox, isDesktop && styles.desktopIconBox]}
              >
                <Sparkles size={isDesktop ? 28 : 20} color="#4FD1C7" />
              </View>
              <View style={styles.dataStack}>
                <Text style={styles.aiTitle}>BERRY AI INSIGHT</Text>
                <View style={styles.predictionRow}>
                  <View style={styles.stat}>
                    <Text style={styles.pLabel}>NEXT NAP</Text>
                    <Text style={[styles.pTime, isDesktop && { fontSize: 32 }]}>
                      {prediction?.predictedTime || '--:--'}
                    </Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.stat}>
                    <Text style={styles.pLabel}>AWAKE</Text>
                    <Text
                      style={[styles.pValue, isDesktop && { fontSize: 32 }]}
                    >
                      {prediction?.remainingMinutes
                        ? `${prediction.remainingMinutes}m`
                        : 'NOW'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={styles.aiActionBtn}
              onPress={() => router.push('/(app)/berry-ai')}
            >
              <Text style={styles.aiActionText}>CONSULT BERRY AI ENGINE</Text>
              <ChevronRight size={14} color="#020617" />
            </TouchableOpacity>
          </GlassCard>
        </Animated.View>

        {/* 3. COMMAND CENTER GRID - BALANCED LAYOUT */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>COMMAND CENTER</Text>
          <View
            style={[
              styles.quickActions,
              isDesktop && styles.desktopQuickActions,
            ]}
          >
            <QuickAction
              label="Feed"
              icon={Milk}
              color="#4FD1C7"
              onPress={() => router.push('/(app)/feeding')}
              isDesktop={isDesktop}
            />
            <QuickAction
              label="Growth"
              icon={Activity}
              color="#B794F6"
              onPress={() => router.push('/(app)/growth')}
              isDesktop={isDesktop}
            />
            <QuickAction
              label="Journal"
              icon={Plus}
              color="#9AE6B4"
              onPress={() => router.push('/(app)/journal')}
              isDesktop={isDesktop}
            />
          </View>
        </View>

        {/* 4. BIOMETRIC LEDGER */}
        <View style={[styles.ledgerSection, isDesktop && styles.desktopLedger]}>
          <View style={styles.ledgerHeader}>
            <Text style={styles.sectionTitle}>BIOMETRIC LEDGER</Text>
            <TouchableOpacity
              onPress={() => router.push('/(app)/journal/timeline')}
            >
              <Text style={styles.viewAll}>VIEW MASTER TIMELINE</Text>
            </TouchableOpacity>
          </View>

          <GlassCard style={styles.activityCard}>
            {loading ? (
              <View style={styles.empty}>
                <ActivityIndicator color="#4FD1C7" />
              </View>
            ) : lastActivity ? (
              <TouchableOpacity
                style={styles.activityRow}
                onPress={() => router.push('/(app)/journal/timeline')}
              >
                <View style={styles.activityIcon}>
                  <Zap size={18} color="#4FD1C7" />
                </View>
                <View style={{ flex: 1, marginLeft: 16 }}>
                  <Text style={styles.actTitle}>
                    {lastActivity.side?.toUpperCase() || 'SESSION ACTIVE'}
                  </Text>
                  <Text style={styles.actTime}>
                    {new Date(lastActivity.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>
                <ChevronRight size={16} color="#475569" />
              </TouchableOpacity>
            ) : (
              <View style={styles.empty}>
                <Clock size={22} color="#475569" />
                <Text style={styles.emptyText}>WAITING FOR DATA SYNC...</Text>
              </View>
            )}
          </GlassCard>
        </View>
      </View>
    </ScrollView>
  );
}

const QuickAction = ({ label, icon: Icon, color, onPress, isDesktop }: any) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.actionBtn, isDesktop && styles.desktopActionBtn]}
  >
    <View
      style={[
        styles.actionIconWrapper,
        { borderColor: `${color}20` },
        isDesktop && { maxHeight: 120 },
      ]}
    >
      <Icon size={isDesktop ? 28 : 22} color={color} />
    </View>
    <Text style={[styles.actionLabel, isDesktop && { fontSize: 13 }]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#020617' },
  scrollContent: { paddingBottom: 120 },
  desktopScroll: { alignItems: 'center' },
  loader: {
    flex: 1,
    backgroundColor: '#020617',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: { width: '100%', padding: 20 },
  desktopContainer: { maxWidth: 1000, padding: 40 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  statusLabel: {
    color: '#4FD1C7',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 2,
  },
  babyName: {
    color: '#FFF',
    fontWeight: '900',
    letterSpacing: -1.5,
    marginTop: 2,
  },
  analyticsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(79, 209, 199, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(79, 209, 199, 0.2)',
  },
  desktopAnalyticsBadge: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
  },
  badgeText: { color: '#4FD1C7', fontSize: 9, fontWeight: '900' },
  desktopBadgeText: { fontSize: 13 },
  aiWrapper: { marginBottom: 32 },
  desktopAiWrapper: { marginBottom: 48 },
  aiCard: { padding: 24, borderRadius: 32 },
  proRow: { flexDirection: 'row', gap: 20, marginBottom: 24 },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(79, 209, 199, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  desktopIconBox: { width: 64, height: 64, borderRadius: 20 },
  dataStack: { flex: 1 },
  aiTitle: {
    color: '#4FD1C7',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  predictionRow: { flexDirection: 'row', alignItems: 'center', gap: 24 },
  stat: { flexShrink: 1 },
  pLabel: { color: '#475569', fontSize: 9, fontWeight: '900', marginBottom: 4 },
  pTime: { color: '#FFF', fontSize: 26, fontWeight: '900' },
  pValue: { color: '#4FD1C7', fontSize: 26, fontWeight: '900' },
  divider: { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.05)' },
  aiActionBtn: {
    backgroundColor: '#4FD1C7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 18,
    gap: 10,
  },
  aiActionText: { color: '#020617', fontWeight: '900', fontSize: 12 },
  sectionRow: { marginBottom: 32 },
  sectionTitle: {
    color: '#475569',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  desktopQuickActions: { gap: 24 },
  actionBtn: { flex: 1, alignItems: 'center' },
  desktopActionBtn: { flex: 0.33 },
  actionIconWrapper: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionLabel: { color: '#94A3B8', fontSize: 11, fontWeight: '800' },
  ledgerSection: { width: '100%' },
  desktopLedger: { marginTop: 20 },
  ledgerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAll: {
    color: '#4FD1C7',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
  activityCard: { padding: 0, borderRadius: 28, overflow: 'hidden' },
  activityRow: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  activityIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(79, 209, 199, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actTitle: { color: '#FFF', fontSize: 15, fontWeight: '800' },
  actTime: { color: '#475569', fontSize: 12, fontWeight: '600', marginTop: 2 },
  empty: { padding: 48, alignItems: 'center', gap: 16 },
  emptyText: { color: '#475569', fontWeight: '800', fontSize: 10 },
});
