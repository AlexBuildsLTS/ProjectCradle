/**
 * PROJECT CRADLE: MASTER SLEEP HUB V15.0 (AAA+ FINAL)
 * Path: app/(app)/sleep.tsx
 * FIXES:
 * 1. ZERO MOCK: Real-time calculation of 'Last Wake Window' from DB.
 * 2. LEDGER ENHANCEMENT: Displays start/end times and calculated duration for all logs.
 * 3. DYNAMIC HUD: Handshakes with SleepTrackerCard to show real-time awake duration.
 * 4. PHARMACY SYNC: Handshakes with depletion alerts for medical inventory.
 */

import * as Haptics from 'expo-haptics';
import { AlertCircle, Clock, History, Moon } from 'lucide-react-native';
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

  const [loading, setLoading] = useState(false);
  const [isSleeping, setIsSleeping] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [wakeWindow, setWakeWindow] = useState('0h 0m');
  const [logs, setLogs] = useState<any[]>([]);
  const [lowInventory, setLowInventory] = useState<any[]>([]);
  const timerRef = useRef<any>(null);

  // MODULE: REAL-TIME BIOMETRIC CALCULATOR
  const fetchData = async () => {
    if (!selectedBaby?.id || !profile?.id) return;
    try {
      // 1. Fetch Sleep Logs for Ledger & Wake Window Calculation
      const { data: sleepData } = await supabase
        .from('sleep_logs')
        .select('*')
        .eq('baby_id', selectedBaby.id)
        .order('start_time', { ascending: false })
        .limit(10);

      if (sleepData && sleepData.length > 0) {
        setLogs(sleepData);

        // 2. Calculate Real Wake Window (Time since last end_time)
        const lastSession = sleepData.find((s) => s.end_time);
        if (lastSession) {
          const lastEnd = new Date(lastSession.end_time).getTime();
          const diffMs = Date.now() - lastEnd;
          const hours = Math.floor(diffMs / 3600000);
          const mins = Math.floor((diffMs % 3600000) / 60000);
          setWakeWindow(`${hours}h ${mins}m`);
        }
      }

      // 3. Fetch Depleted Inventory Alert
      const { data: medData } = await supabase
        .from('medication_inventory')
        .select('*')
        .eq('user_id', profile.id);

      if (medData) {
        const depleted = medData.filter(
          (i) => i.current_volume / i.max_volume < 0.2,
        );
        setLowInventory(depleted);
      }
    } catch (err) {
      console.error('[Core Sync Failure]');
    }
  };

  useEffect(() => {
    fetchData();
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
      return Alert.alert('SYNC ERROR', 'Core missing.');

    if (!isSleeping) {
      const now = new Date();
      setStartTime(now);
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
        await fetchData();
      } catch (e: any) {
        Alert.alert('SYNC FAILED', e.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const formatElapsed = (s: number) => {
    const hours = Math.floor(s / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = s % 60;
    return `${hours > 0 ? hours + ':' : ''}${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
          <Text style={styles.title}>SLEEP COMMAND</Text>
          <Text style={styles.babyID}>
            CORE IDENTIFIER: {selectedBaby?.name?.toUpperCase() || 'SYNCING'}
          </Text>
        </Animated.View>

        {/* 1. DEPLETION ALERT HUD */}
        {lowInventory.length > 0 && (
          <GlassCard style={styles.alertCard}>
            <View style={styles.proRow}>
              <AlertCircle size={20} color="#F87171" />
              <Text style={styles.alertText}>
                PHARMACY DEPLETED: {lowInventory.map((i) => i.name).join(', ')}
              </Text>
            </View>
          </GlassCard>
        )}

        {/* 2. PRIMARY HUD - REAL CALCULATED DATA */}
        <SleepTrackerCard
          lastSleepTime={isSleeping ? formatElapsed(elapsed) : wakeWindow}
          isTracking={isSleeping}
          onPress={handleToggleSleep}
        />

        {/* 3. DUAL-COLUMN GRID */}
        <View style={[styles.gridRow, isDesktop && styles.desktopGridRow]}>
          <View
            style={isDesktop ? { flex: 0.5 } : { width: '100%', marginTop: 24 }}
          >
            <SoundscapePlayer />
          </View>

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

            {logs.map((log) => {
              const start = new Date(log.start_time);
              const end = log.end_time ? new Date(log.end_time) : null;
              const durationMs = end ? end.getTime() - start.getTime() : 0;
              const durHours = Math.floor(durationMs / 3600000);
              const durMins = Math.floor((durationMs % 3600000) / 60000);

              return (
                <GlassCard key={log.id} style={styles.logCard}>
                  <View style={styles.proRow}>
                    <View style={styles.miniIcon}>
                      <Moon size={18} color="#4FD1C7" />
                    </View>
                    <View style={styles.dataStack}>
                      <Text style={styles.logType}>
                        {log.is_nap ? 'NAP' : 'NIGHT SESSION'}
                      </Text>
                      <Text style={styles.logTime}>
                        {start.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        —{' '}
                        {end
                          ? end.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : 'LIVE'}
                      </Text>
                    </View>
                    <View style={styles.durationBadge}>
                      <Clock size={12} color="#4FD1C7" />
                      <Text style={styles.durationText}>
                        {durHours}h {durMins}m
                      </Text>
                    </View>
                  </View>
                </GlassCard>
              );
            })}
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
  alertCard: {
    backgroundColor: 'rgba(248, 113, 113, 0.1)',
    borderColor: 'rgba(248, 113, 113, 0.2)',
    marginBottom: 20,
    padding: 16,
    borderRadius: 16,
  },
  alertText: {
    color: '#F87171',
    fontSize: 11,
    fontWeight: '900',
    marginLeft: 12,
    letterSpacing: 0.5,
  },
  gridRow: { marginTop: 24 },
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
    height: 90,
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
  logTime: { color: '#475569', fontSize: 11, marginTop: 2, fontWeight: '600' },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(79, 209, 199, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  durationText: { color: '#4FD1C7', fontSize: 10, fontWeight: '900' },
});
