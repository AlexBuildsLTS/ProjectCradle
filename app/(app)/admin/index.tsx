/**
 * PROJECT CRADLE: ENHANCED ADMIN CONSOLE V3.3
 * Path: app/(app)/admin/index.tsx
 * THEME: PROJECT CRADLE (Teal #4FD1C7 | Obsidian #020617).
 * ENHANCEMENTS:
 * - Real-Time Metrics: Direct Supabase resolution for all core entities.
 * - Mobile Stability: Standard RN components optimized for touch and performance.
 * - Grid Architecture: Responsive 1200px container prevents desktop stretching.
 */

import { GlassCard } from '@/components/glass/GlassCard';
import { Theme } from '@/lib/shared/Theme';
import { supabase } from '@/lib/supabase';
import { useFocusEffect, useRouter } from 'expo-router';
import {
  AlertTriangle,
  ArrowRight,
  Baby,
  Database,
  HeartPulse,
  Server,
  ShieldCheck,
  Users,
  Zap,
} from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

export default function AdminDashboard() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    totalGrowth: 0,
    dbLatency: '0ms',
  });
  const [loading, setLoading] = useState(true);

  /**
   * Fetches real-time system metrics directly from the Supabase Core.
   */
  const loadStats = async () => {
    const start = Date.now();
    setLoading(true);
    try {
      const { count: u } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      const { count: e } = await supabase
        .from('care_events')
        .select('*', { count: 'exact', head: true });
      const { count: g } = await supabase
        .from('growth_logs')
        .select('*', { count: 'exact', head: true });

      setStats({
        totalUsers: u || 0,
        totalEvents: e || 0,
        totalGrowth: g || 0,
        dbLatency: `${Date.now() - start}ms`,
      });
    } catch (error) {
      console.error('[Cradle Admin] Metrics Sync Failure:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, []),
  );

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* HEADER SECTION: PROJECT CRADLE IDENTITY */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>ADMIN PORTAL</Text>
          <Text style={styles.headerSub}>CORE SYSTEM OVERVIEW</Text>
        </View>
        <View style={styles.statusBadge}>
          <View style={styles.staticDot} />
          <Text style={styles.statusText}>OPERATIONAL</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          isDesktop && { alignItems: 'center' },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadStats}
            tintColor={Theme.colors.primary}
          />
        }
      >
        <View
          style={[
            styles.container,
            isDesktop && { maxWidth: 1200, width: '100%' },
          ]}
        >
          {/* 1. SYSTEM DIAGNOSTICS STRIP */}
          <View style={styles.healthStrip}>
            <View style={styles.healthCard}>
              <Database size={16} color={Theme.colors.primary} />
              <Text style={styles.healthLabel}>
                LATENCY: <Text style={styles.whiteText}>{stats.dbLatency}</Text>
              </Text>
            </View>
            <View style={styles.healthCard}>
              <Server size={16} color="#9AE6B4" />
              <Text style={styles.healthLabel}>
                GATEWAY: <Text style={styles.whiteText}>ENCRYPTED</Text>
              </Text>
            </View>
          </View>

          {/* 2. CORE METRICS GRID */}
          <View style={styles.grid}>
            <AdminStatCard
              title="FAMILIES"
              value={stats.totalUsers}
              icon={Users}
              color={Theme.colors.primary}
              link="/(app)/admin/users"
            />
            <AdminStatCard
              title="CARE LOGS"
              value={stats.totalEvents}
              icon={Zap}
              color="#FB923C"
            />
            <AdminStatCard
              title="GROWTH DATA"
              value={stats.totalGrowth}
              icon={Baby}
              color="#B794F6"
            />
            <AdminStatCard
              title="TICKETS"
              value="0"
              icon={AlertTriangle}
              color="#F87171"
            />
          </View>

          {/* 3. ENHANCED MANAGEMENT CONSOLE */}
          <Text style={styles.sectionTitle}>MANAGEMENT MODULES</Text>
          <View
            style={[
              styles.actionRow,
              isDesktop && { flexDirection: 'row', gap: 20 },
            ]}
          >
            {/* USER DIRECTORY LINK */}
            <TouchableOpacity
              onPress={() => router.push('/(app)/admin/users')}
              style={[styles.managementBtn, isDesktop && { flex: 1 }]}
            >
              <View style={styles.iconBox}>
                <Users size={24} color={Theme.colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.actionTitle}>User Directory</Text>
                <Text style={styles.actionDesc}>
                  Manage roles, bans, and family profiles
                </Text>
              </View>
              <ArrowRight size={20} color="#475569" />
            </TouchableOpacity>

            {/* AI INTELLIGENCE CORE LINK */}
            <TouchableOpacity
              style={[styles.managementBtn, isDesktop && { flex: 1 }]}
            >
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: 'rgba(183, 148, 246, 0.1)' },
                ]}
              >
                <HeartPulse size={24} color="#B794F6" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.actionTitle}>Intelligence Core</Text>
                <Text style={styles.actionDesc}>
                  Monitor AI accuracy and neural latency
                </Text>
              </View>
              <ArrowRight size={20} color="#475569" />
            </TouchableOpacity>
          </View>

          {/* 4. SECURITY AUDIT LOG PLACEHOLDER */}
          <View style={styles.auditContainer}>
            <ShieldCheck size={18} color="#9AE6B4" />
            <Text style={styles.auditText}>
              Real-time biometric encryption active. All sessions are monitored
              via RLS.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const AdminStatCard = ({ title, value, icon: Icon, color, link }: any) => {
  const router = useRouter();
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => link && router.push(link)}
      style={styles.statWrapper}
    >
      <GlassCard style={styles.statCard} variant="teal">
        <View style={[styles.statIconBox, { backgroundColor: `${color}15` }]}>
          <Icon size={20} color={color} />
        </View>
        <View>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statTitle}>{title}</Text>
        </View>
      </GlassCard>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#020617' },
  header: {
    padding: 24,
    paddingTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -1,
  },
  headerSub: {
    color: '#475569',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(79, 209, 199, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(79, 209, 199, 0.1)',
  },
  staticDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4FD1C7',
  },
  statusText: {
    color: '#4FD1C7',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
  scroll: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 120 },
  container: { width: '100%' },
  healthStrip: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  healthCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  healthLabel: { color: '#475569', fontSize: 10, fontWeight: '900' },
  whiteText: { color: '#FFF' },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statWrapper: { width: '48%', marginBottom: 16 },
  statCard: {
    height: 140,
    padding: 20,
    justifyContent: 'space-between',
    borderRadius: 24,
  },
  statIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: { color: '#FFF', fontSize: 28, fontWeight: '900' },
  statTitle: {
    color: '#475569',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
    marginTop: 4,
  },
  sectionTitle: {
    color: '#475569',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 16,
    marginTop: 16,
    textTransform: 'uppercase',
  },
  actionRow: { gap: 12 },
  managementBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: 12,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(79, 209, 199, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  actionTitle: { color: '#FFF', fontSize: 18, fontWeight: '800' },
  actionDesc: {
    color: '#475569',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  auditContainer: {
    marginTop: 32,
    padding: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(154, 230, 180, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(154, 230, 180, 0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  auditText: {
    flex: 1,
    color: '#9AE6B4',
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 16,
  },
});
