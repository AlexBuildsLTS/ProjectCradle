/**
 * PROJECT CRADLE: MASTER FEEDING COMMAND V11.0 (AAA+ TIER)
 * Path: app/(app)/feeding.tsx
 * FIXES:
 * 1. PRO-ROW ARCHITECTURE: Icon on far left, data on right. 0% Overlap.
 * 2. SCHEMA HANDSHAKE: Strictly maps to public.pumping_logs.
 * 3. MOBILE DENSITY: Optimized for high-fidelity rendering on small viewports.
 */

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

import { GlassCard } from '@/components/glass/GlassCard';
import { useAuth } from '@/context/auth';
import { useFamily } from '@/context/family';
import { supabase } from '@/lib/supabase';

export default function FeedingScreen() {
  const { selectedBaby = null } = useFamily();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [activeSide, setActiveSide] = useState<'left' | 'right' | null>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const intervalRef = useRef<any>(null);

  const fetchLogs = async () => {
    if (!user?.id) return;
    const { data } = await supabase
      .from('pumping_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('timestamp', { ascending: false })
      .limit(5);
    if (data) setLogs(data);
  };

  useEffect(() => {
    fetchLogs();
  }, [user?.id]);

  useEffect(() => {
    if (isTracking) {
      intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isTracking]);

  const executeSave = async (side: string, amount: number) => {
    if (!user?.id) return Alert.alert('SYNC ERROR', 'Identity core missing.');
    setLoading(true);
    try {
      const { error } = await supabase.from('pumping_logs').insert([
        {
          user_id: user.id,
          amount_ml: amount,
          duration_minutes: Math.max(1, Math.floor(seconds / 60)),
          side: side,
          timestamp: new Date().toISOString(),
        },
      ]);
      if (error) throw error;
      if (Platform.OS !== 'web')
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setSeconds(0);
      setIsTracking(false);
      setActiveSide(null);
      await fetchLogs();
      Alert.alert('SYNC SUCCESS', 'Biometric session committed.');
    } catch (e: any) {
      Alert.alert('SAVE FAILED', e.message);
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
      <Text style={styles.babyLabel}>
        ACTIVE IDENTITY: {selectedBaby?.name?.toUpperCase() || 'CORE'}
      </Text>

      {/* PRIMARY NURSING TRACKER - HORIZONTAL PRO-ROW */}
      <GlassCard style={styles.mainCard}>
        <View style={styles.proRow}>
          <View style={styles.iconContainer}>
            <Timer size={24} color="#4FD1C7" />
          </View>
          <View style={styles.timerContainer}>
            <Text style={styles.timerSub}>ELAPSED TIME</Text>
            <Text style={styles.timerMain}>{formatTime(seconds)}</Text>
          </View>
        </View>

        <View style={styles.sidePicker}>
          {['left', 'right'].map((side) => (
            <TouchableOpacity
              key={side}
              onPress={() => {
                setActiveSide(side as any);
                setIsTracking(true);
              }}
              style={[styles.sideBtn, activeSide === side && styles.activeSide]}
            >
              <Text
                style={[
                  styles.sideBtnText,
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
            style={styles.cancelBtn}
            onPress={() => {
              setIsTracking(false);
              setSeconds(0);
            }}
          >
            <Trash2 size={20} color="#F87171" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.completeBtn}
            onPress={() => executeSave(activeSide || 'both', 0)}
            disabled={seconds < 1 || loading}
          >
            {loading ? (
              <ActivityIndicator color="#020617" />
            ) : (
              <>
                <Text style={styles.completeText}>COMPLETE SESSION</Text>
                <Save size={18} color="#020617" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </GlassCard>

      {/* QUICK ACTIONS GRID */}
      <View style={styles.quickGrid}>
        <TouchableOpacity
          style={styles.quickBox}
          onPress={() => executeSave('bottle', 120)}
        >
          <GlassCard style={styles.miniCard}>
            <View style={styles.miniProRow}>
              <View style={styles.miniIconBox}>
                <Milk size={18} color="#4FD1C7" />
              </View>
              <Text style={styles.miniLabel}>BOTTLE</Text>
            </View>
          </GlassCard>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickBox}
          onPress={() => executeSave('solids', 0)}
        >
          <GlassCard style={styles.miniCard}>
            <View style={styles.miniProRow}>
              <View style={styles.miniIconBox}>
                <Baby size={18} color="#4FD1C7" />
              </View>
              <Text style={styles.miniLabel}>SOLIDS</Text>
            </View>
          </GlassCard>
        </TouchableOpacity>
      </View>

      {/* HISTORY LEDGER */}
      <View style={styles.ledger}>
        <View style={styles.ledgerHeader}>
          <History size={16} color="#475569" />
          <Text style={styles.ledgerTitle}>RECENT SESSIONS</Text>
        </View>
        {logs.map((log) => (
          <GlassCard key={log.id} style={styles.logCard}>
            <View style={styles.miniProRow}>
              <View style={styles.miniIconBox}>
                <Milk size={14} color="#4FD1C7" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.logSide}>
                  {log.side?.toUpperCase() || 'LOG'}
                </Text>
                <Text style={styles.logTime}>
                  {new Date(log.timestamp).toLocaleTimeString()}
                </Text>
              </View>
              <Text style={styles.logMeta}>
                {log.amount_ml > 0
                  ? `${log.amount_ml}ml`
                  : `${log.duration_minutes}m`}
              </Text>
            </View>
          </GlassCard>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#020617' },
  content: {
    padding: 20,
    paddingBottom: 100,
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
  },
  title: { color: '#FFF', fontSize: 22, fontWeight: '900', letterSpacing: 1 },
  babyLabel: {
    color: '#4FD1C7',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 2,
    marginTop: 4,
    marginBottom: 32,
  },
  mainCard: { padding: 24, borderRadius: 32 },
  proRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(79, 209, 199, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerContainer: { marginLeft: 20 },
  timerSub: {
    color: '#475569',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  timerMain: {
    color: '#FFF',
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: -2,
  },
  sidePicker: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  sideBtn: {
    flex: 1,
    padding: 16,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
  },
  activeSide: { backgroundColor: '#4FD1C7', borderColor: '#4FD1C7' },
  sideBtnText: { color: '#94A3B8', fontWeight: '800', fontSize: 11 },
  actionRow: { flexDirection: 'row', gap: 12 },
  cancelBtn: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: 'rgba(248, 113, 113, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeBtn: {
    flex: 1,
    backgroundColor: '#4FD1C7',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  completeText: { color: '#020617', fontWeight: '900', fontSize: 13 },
  quickGrid: { flexDirection: 'row', gap: 12, marginTop: 12, marginBottom: 40 },
  quickBox: { flex: 1 },
  miniCard: { padding: 0, height: 80, borderRadius: 20 },
  miniProRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  miniIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(79, 209, 199, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniLabel: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '900',
    marginLeft: 12,
    letterSpacing: 1,
  },
  ledger: { gap: 10 },
  ledgerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  ledgerTitle: {
    color: '#475569',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
  },
  logCard: { padding: 0, height: 70, borderRadius: 16, marginBottom: 8 },
  logSide: { color: '#FFF', fontSize: 13, fontWeight: '800' },
  logTime: { color: '#475569', fontSize: 10, marginTop: 2 },
  logMeta: { color: '#4FD1C7', fontSize: 14, fontWeight: '900' },
});
