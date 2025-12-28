/**
 * PROJECT CRADLE: MASTER SLEEP HUB V12.0 (AAA+ FINAL)
 * Path: app/(app)/sleep.tsx
 * FIXES:
 * 1. COMPONENT HANDSHAKE: Integrated SleepTrackerCard for biometric session control.
 * 2. DESKTOP GRID BALANCING: Constrained layout with dual-column logic for enterprise viewports.
 * 3. PRO-ROW HISTORY: Locked icons to far-left to prevent overlap on mobile.
 * 4. SQL SYNC: Reliable commitment to the 'sleep_logs' biometric ledger.
 */

import * as Haptics from 'expo-haptics';
import { ChevronRight, History, Moon } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

// PROJECT IMPORTS
import { SoundscapePlayer } from '@/components/audio/SoundscapePlayer';
import { GlassCard } from '@/components/glass/GlassCard';
import { SleepTrackerCard } from '@/components/tracking/SleepTrackerCard';
import { useAuth } from '@/context/auth';
import { useFamily } from '@/context/family';
import { supabase } from '@/lib/supabase';

export default function SleepScreen() {
  const { selectedBaby } = useFamily();
  const { profile } = useAuth();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  // BIOMETRIC ENGINE STATE
  const [loading, setLoading] = useState(false);
  const [isSleeping, setIsSleeping] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [logs, setLogs] = useState<any[]>([]);
  const timerRef = useRef<any>(null);

  // MODULE: LIVE BIOMETRIC LEDGER SYNC
  const fetchSleepLogs = async () => {
    if (!selectedBaby?.id) return;
    try {
      const { data } = await supabase
        .from('sleep_logs')
        .select('*')
        .eq('baby_id', selectedBaby.id)
        .order('start_time', { ascending: false })
        .limit(5);
      if (data) setLogs(data);
    } catch (err) {
      console.error('[Sleep Core] Sync Error');
    }
  };

  useEffect(() => {
    fetchSleepLogs();
  }, [selectedBaby?.id]);

  // MODULE: HIGH-FIDELITY TIMER HANDSHAKE
  useEffect(() => {
    if (isSleeping) {
      timerRef.current = setInterval(() => {
        setElapsed(
          Math.floor(
            (new Date().getTime() - (startTime?.getTime() || 0)) / 1000,
          ),
        );
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isSleeping, startTime]);

  const handleToggleSleep = async () => {
    if (!profile?.id || !selectedBaby?.id)
      return Alert.alert('SYNC ERROR', 'Biometric ID missing.');

    if (!isSleeping) {
      setStartTime(new Date());
      setIsSleeping(true);
      if (Platform.OS !== 'web')
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      setLoading(true);
      try {
        const { error } = await supabase.from('sleep_logs').insert([
          {
            user_id: profile.id,
            baby_id: selectedBaby.id,
            start_time: startTime?.toISOString(),
            end_time: new Date().toISOString(),
            is_nap: true,
          },
        ]);

        if (error) throw error;

        setIsSleeping(false);
        setElapsed(0);
        setStartTime(null);
        await fetchSleepLogs();
      } catch (e: any) {
        Alert.alert('DATABASE ERROR', e.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const formatElapsed = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

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
        {/* HEADER HUB */}
        <Animated.View
          entering={FadeInDown.duration(600)}
          style={styles.header}
        >
          <View>
            <Text style={styles.title}>SLEEP COMMAND</Text>
            <Text style={styles.babyID}>
              CORE ID: {selectedBaby?.name?.toUpperCase() || 'LOCKED'}
            </Text>
          </View>
        </Animated.View>

        {/* 1. PRIMARY TRACKER HUD */}
        <SleepTrackerCard
          lastSleepTime={isSleeping ? formatElapsed(elapsed) : '2h 15m'}
          isTracking={isSleeping}
          onPress={handleToggleSleep}
        />

        {/* 2. AUDIO ENGINE + HISTORY GRID */}
        <View style={[styles.gridRow, isDesktop && styles.desktopGridRow]}>
          {/* SOUNDSCAPE ENGINE COLUMN */}
          <View style={isDesktop ? { flex: 0.5 } : { width: '100%' }}>
            <SoundscapePlayer />
          </View>

          {/* LEDGER HISTORY COLUMN */}
          <View
            style={[
              styles.ledgerSection,
              isDesktop && { flex: 0.5, marginTop: 0 },
            ]}
          >
            <View style={styles.ledgerHeader}>
              <History size={16} color="#475569" />
              <Text style={styles.ledgerTitle}>RECENT BIOMETRIC LOGS</Text>
            </View>

            {logs.map((log) => (
              <GlassCard key={log.id} style={styles.logCard}>
                <View style={styles.proRow}>
                  <View style={styles.miniIcon}>
                    <Moon size={18} color="#4FD1C7" />
                  </View>
                  <View style={styles.dataStack}>
                    <Text style={styles.logType}>
                      {log.is_nap ? 'DAY NAP' : 'NIGHT SESSION'}
                    </Text>
                    <Text style={styles.logTime}>
                      {new Date(log.start_time).toLocaleTimeString()}
                    </Text>
                  </View>
                  <ChevronRight size={14} color="#334155" />
                </View>
              </GlassCard>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#020617' },
  scrollContent: { paddingBottom: 120 },
  desktopScroll: { alignItems: 'center' },
  container: { width: '100%', padding: 20 },
  desktopContainer: { maxWidth: 1000, padding: 40 },
  header: { marginBottom: 32 },
  title: { color: '#FFF', fontSize: 24, fontWeight: '900', letterSpacing: 1 },
  babyID: {
    color: '#4FD1C7',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    marginTop: 4,
  },
  gridRow: { marginTop: 32 },
  desktopGridRow: { flexDirection: 'row', gap: 32, alignItems: 'flex-start' },
  ledgerSection: { marginTop: 40 },
  ledgerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  ledgerTitle: {
    color: '#475569',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  logCard: {
    height: 80,
    borderRadius: 24,
    marginBottom: 12,
    padding: 0,
    justifyContent: 'center',
  },
  proRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 },
  miniIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(79, 209, 199, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(79, 209, 199, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dataStack: { flex: 1, marginLeft: 16 },
  logType: { color: '#FFF', fontSize: 14, fontWeight: '800' },
  logTime: { color: '#475569', fontSize: 11, marginTop: 2 },
  footerBuffer: { height: 40 },
});
