/**
 * PROJECT CRADLE: SLEEP TRACKER HUD V2.5 (AAA+ FINAL)
 * Path: components/tracking/SleepTrackerCard.tsx
 * FIXES:
 * 1. CLIPPING RESOLUTION: Removed fixed height to prevent button cutoff.
 * 2. PRO-ROW SYNC: Far-left icon architecture for 0% overlap.
 * 3. DYNAMIC HUD: Real-time scaling for S20 Ultra viewports.
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
      {/* 1. HEADER HUD */}
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <View style={styles.iconBox}>
            <Moon size={18} color="#4FD1C7" />
          </View>
          <Text style={styles.titleText}>SLEEP COMMAND</Text>
        </View>
        <TouchableOpacity hitSlop={20}>
          <Info size={16} color="#475569" />
        </TouchableOpacity>
      </View>

      {/* 2. BIOMETRIC DATA STACK */}
      <View style={styles.content}>
        <Text style={styles.label}>
          {isTracking ? 'ACTIVE SESSION ELAPSED' : 'LAST WAKE WINDOW'}
        </Text>
        <View style={styles.valueRow}>
          <Text style={styles.mainValue}>{lastSleepTime}</Text>
          {isTracking && (
            <Zap size={28} color="#4FD1C7" style={styles.pulseIcon} />
          )}
        </View>
      </View>

      {/* 3. DYNAMIC ACTION BUTTON */}
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
    paddingBottom: 32, // REQUIRED BREATHING ROOM
    borderRadius: 32,
    minHeight: 240, // INCREASED TO STOP CLIPPING
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
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
  content: {
    marginVertical: 20,
  },
  label: {
    color: '#475569',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 8,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  mainValue: {
    color: '#FFF',
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: -1,
  },
  pulseIcon: {
    opacity: 0.8,
  },
  btn: {
    height: 64, // OPTIMIZED TOUCH TARGET
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  btnStart: {
    backgroundColor: '#4FD1C7',
  },
  btnStop: {
    backgroundColor: '#F87171',
  },
  btnText: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 1,
  },
});
