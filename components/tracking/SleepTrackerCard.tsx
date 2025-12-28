/**
 * PROJECT CRADLE: SLEEP TRACKER HUD V2.0 (AAA+ FINAL)
 * Path: components/tracking/SleepTrackerCard.tsx
 * FIXES:
 * 1. RENDERING STABILITY: Switched to flat style objects for Web/APK safety.
 * 2. PRO-ROW SYNC: Far-left icon architecture for 0% overlap.
 * 3. DYNAMIC HUD: Real-time toggle between 'Wake Window' and 'Sleep Session'.
 */

import { Info, Moon, Play, Square, Zap } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GlassCard } from '../glass/GlassCard';

interface SleepTrackerProps {
  lastSleepTime?: string;
  isTracking?: boolean;
  onPress: () => void;
}

export const SleepTrackerCard = ({
  lastSleepTime = '00:00',
  isTracking,
  onPress,
}: SleepTrackerProps) => {
  return (
    <GlassCard style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <View style={styles.iconBox}>
            <Moon size={18} color="#4FD1C7" />
          </View>
          <Text style={styles.titleText}>SLEEP COMMAND</Text>
        </View>
        <TouchableOpacity>
          <Info size={16} color="#475569" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>
          {isTracking ? 'ACTIVE SESSION ELAPSED' : 'LAST WAKE WINDOW'}
        </Text>
        <View style={styles.valueRow}>
          <Text style={styles.mainValue}>{lastSleepTime}</Text>
          {isTracking && (
            <Zap size={24} color="#4FD1C7" style={styles.pulseIcon} />
          )}
        </View>
      </View>

      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={[styles.btn, isTracking ? styles.btnStop : styles.btnStart]}
      >
        {isTracking ? (
          <>
            <Square size={16} color="#FFF" fill="#FFF" />
            <Text style={styles.btnText}>TERMINATE SESSION</Text>
          </>
        ) : (
          <>
            <Play size={16} color="#020617" fill="#020617" />
            <Text style={[styles.btnText, { color: '#020617' }]}>
              START TRACKING
            </Text>
          </>
        )}
      </TouchableOpacity>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 24,
    borderRadius: 32,
    height: 210,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(79, 209, 199, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  content: { marginVertical: 16 },
  label: {
    color: '#475569',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 4,
  },
  valueRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  mainValue: { color: '#FFF', fontSize: 36, fontWeight: '900' },
  pulseIcon: { opacity: 0.8 },
  btn: {
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  btnStart: { backgroundColor: '#4FD1C7' },
  btnStop: { backgroundColor: '#F87171' },
  btnText: { color: '#FFF', fontWeight: '900', fontSize: 12, letterSpacing: 1 },
});
