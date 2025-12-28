/**
 * PROJECT CRADLE: MASTER FEEDING COMMAND V2.0 (AAA+ TIER)
 * Path: app/(app)/feeding.tsx
 * THEME: PROJECT CRADLE (Teal #4FD1C7 | Obsidian #020617)
 * * MODULES:
 * 1. SCHEMA COMPLIANCE: Valid UUID correlation_id and user_id mapping.
 * 2. TOP-LEFT ICON LOCK: Absolute positioning for high-fidelity card density.
 * 3. REAL-TIME DB ENGINE: Hardened Supabase insert logic for Bottle, Solids, and Nursing.
 * 4. LOG RECOVERY: Auto-refreshing ledger ensures recent logs appear instantly.
 */

import { GlassCard } from '@/components/glass/GlassCard';
import { useAuth } from '@/context/auth';
import { useFamily } from '@/context/family';
import { supabase } from '@/lib/supabase';
import * as Haptics from 'expo-haptics';
import { Baby, History, Milk, Save, Timer, Trash2 } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// HELPER: Generate valid UUID for correlation_id
const generateUUID = () => {
  if (Platform.OS === 'web') return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export default function FeedingScreen() {
  const { selectedBaby } = useFamily();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [activeSide, setActiveSide] = useState<'left' | 'right' | null>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const timerRef = useRef<any>(null);

  // --- MODULE: DATA FETCHING ---
  const fetchLogs = async () => {
    if (!selectedBaby?.id) return;
    const { data, error } = await supabase
      .from('care_events')
      .select('*')
      .eq('baby_id', selectedBaby.id)
      .eq('event_type', 'feeding')
      .order('timestamp', { ascending: false })
      .limit(5);

    if (!error && data) setLogs(data);
  };

  useEffect(() => {
    fetchLogs();
  }, [selectedBaby]);

  // --- MODULE: TIMER ENGINE ---
  useEffect(() => {
    if (isTracking) {
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTracking]);

  // --- MODULE: DATABASE HANDSHAKE ---
  const executeSave = async (type: string, details: any) => {
    if (!selectedBaby?.id || !user?.id) {
      return Alert.alert(
        'SYNC ERROR',
        'Identity core or baby profile not detected.',
      );
    }

    setLoading(true);
    const correlationId = generateUUID();

    try {
      const { error } = await supabase.from('care_events').insert([
        {
          id: generateUUID(),
          correlation_id: correlationId,
          baby_id: selectedBaby.id,
          user_id: user.id,
          event_type: 'feeding',
          timestamp: new Date().toISOString(),
          metadata: { ...details, feeding_type: type },
          notes:
            details.notes ||
            `${type.toUpperCase()} session logged via Command Center.`,
        },
      ]);

      if (error) throw error;

      if (Platform.OS !== 'web')
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // RESET STATE
      setIsTracking(false);
      setSeconds(0);
      setActiveSide(null);
      await fetchLogs(); // FORCE REFRESH
      Alert.alert(
        'SYNC SUCCESS',
        'Feeding session committed to encrypted core.',
      );
    } catch (e: any) {
      Alert.alert('SAVE FAILED', e.message);
      console.error('DB Handshake Error:', e);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.title}>FEEDING COMMAND</Text>
      <Text style={styles.target}>
        ACTIVE IDENTIFIER: {selectedBaby?.name?.toUpperCase() || 'CORE'}
      </Text>

      {/* BREASTFEEDING COMMAND CARD */}
      <GlassCard style={styles.mainCard}>
        <View style={styles.topLeftIcon}>
          <Timer size={20} color="#4FD1C7" />
        </View>

        <Text style={styles.cardLabel}>BREASTFEEDING TRACKER</Text>
        <Text style={styles.timerDisplay}>{formatTime(seconds)}</Text>

        <View style={styles.sideGrid}>
          {['left', 'right'].map((side: any) => (
            <TouchableOpacity
              key={side}
              style={[styles.sideBtn, activeSide === side && styles.activeSide]}
              onPress={() => {
                setActiveSide(side);
                setIsTracking(true);
              }}
            >
              <Text
                style={[
                  styles.sideText,
                  activeSide === side && { color: '#020617' },
                ]}
              >
                {side.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.stopBtn}
            onPress={() => {
              setIsTracking(false);
              setSeconds(0);
            }}
          >
            <Trash2 size={18} color="#F87171" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.saveBtn}
            onPress={() =>
              executeSave('breast', { duration: seconds, side: activeSide })
            }
            disabled={seconds < 1 || loading}
          >
            {loading ? (
              <ActivityIndicator color="#020617" />
            ) : (
              <>
                <Text style={styles.saveBtnText}>COMPLETE SESSION</Text>
                <Save size={18} color="#020617" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </GlassCard>

      {/* QUICK LOG GRID (TOP-LEFT ICONS) */}
      <View style={styles.quickGrid}>
        <TouchableOpacity
          style={styles.quickBox}
          onPress={() => executeSave('bottle', { amount_ml: 120 })}
        >
          <GlassCard style={styles.innerBox}>
            <View style={styles.miniTopLeftIcon}>
              <Milk size={18} color="#4FD1C7" />
            </View>
            <Text style={styles.quickLabel}>BOTTLE</Text>
          </GlassCard>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickBox}
          onPress={() =>
            executeSave('solids', { notes: 'Solid food introduction' })
          }
        >
          <GlassCard style={styles.innerBox}>
            <View style={styles.miniTopLeftIcon}>
              <Baby size={18} color="#4FD1C7" />
            </View>
            <Text style={styles.quickLabel}>SOLIDS</Text>
          </GlassCard>
        </TouchableOpacity>
      </View>

      {/* RECENT ACTIVITY HUB */}
      <View style={styles.history}>
        <View style={styles.historyHeader}>
          <History size={16} color="#475569" />
          <Text style={styles.historyTitle}>RECENT FEEDINGS</Text>
        </View>
        {logs.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Waiting for sync data...</Text>
          </View>
        ) : (
          logs.map((log) => (
            <GlassCard key={log.id} style={styles.logItem}>
              <View style={styles.logLeft}>
                <Milk size={16} color="#4FD1C7" />
                <View>
                  <Text style={styles.logMain}>
                    {log.metadata?.feeding_type?.toUpperCase() || 'FEEDING'}
                  </Text>
                  <Text style={styles.logSub}>
                    {new Date(log.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>
              </View>
              <Text style={styles.logMeta}>
                {log.metadata?.duration
                  ? `${Math.floor(log.metadata.duration / 60)}m`
                  : log.metadata?.amount_ml
                  ? `${log.metadata.amount_ml}ml`
                  : 'LOGGED'}
              </Text>
            </GlassCard>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#020617' },
  content: {
    padding: 24,
    paddingBottom: 100,
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
  },
  title: { color: '#FFF', fontSize: 24, fontWeight: '900', letterSpacing: 1 },
  target: {
    color: '#4FD1C7',
    fontSize: 10,
    fontWeight: '900',
    marginTop: 6,
    letterSpacing: 2,
    marginBottom: 32,
  },
  mainCard: { padding: 32, borderRadius: 40, position: 'relative' },
  topLeftIcon: {
    position: 'absolute',
    top: 24,
    left: 24,
    padding: 10,
    backgroundColor: 'rgba(79, 209, 199, 0.05)',
    borderRadius: 12,
  },
  cardLabel: {
    color: 'rgba(148, 163, 184, 0.4)',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
    textAlign: 'center',
    marginTop: 12,
  },
  timerDisplay: {
    color: '#FFF',
    fontSize: 72,
    fontWeight: '900',
    textAlign: 'center',
    marginVertical: 32,
    letterSpacing: -3,
  },
  sideGrid: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  sideBtn: {
    flex: 1,
    padding: 18,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.02)',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  activeSide: { backgroundColor: '#4FD1C7', borderColor: '#4FD1C7' },
  sideText: { color: '#94A3B8', fontWeight: '900', fontSize: 12 },
  actionRow: { flexDirection: 'row', gap: 12 },
  stopBtn: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(248, 113, 113, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtn: {
    flex: 1,
    backgroundColor: '#4FD1C7',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  saveBtnText: {
    color: '#020617',
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  quickGrid: { flexDirection: 'row', gap: 16, marginTop: 16, marginBottom: 40 },
  quickBox: { flex: 1 },
  innerBox: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    height: 110,
    position: 'relative',
  },
  miniTopLeftIcon: {
    position: 'absolute',
    top: 12,
    left: 12,
    padding: 6,
    backgroundColor: 'rgba(79, 209, 199, 0.05)',
    borderRadius: 8,
  },
  quickLabel: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
    marginTop: 16,
  },
  history: { width: '100%' },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  historyTitle: {
    color: '#475569',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
  },
  emptyBox: {
    padding: 40,
    alignItems: 'center',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
  },
  emptyText: { color: '#475569', fontSize: 12, fontWeight: '700' },
  logItem: {
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 24,
    marginBottom: 12,
  },
  logLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  logMain: { color: '#FFF', fontSize: 13, fontWeight: '800' },
  logSub: { color: '#475569', fontSize: 10, fontWeight: '600', marginTop: 2 },
  logMeta: { color: '#4FD1C7', fontWeight: '900', fontSize: 12 },
});
