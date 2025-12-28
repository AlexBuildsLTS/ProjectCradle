/**
 * PROJECT CRADLE: BIOMETRIC TIMELINE ITEM V2.0 (AAA+ FINAL)
 * Path: components/tracking/TimelineItem.tsx
 * FIXES:
 * 1. LINTER RESOLUTION: Purged broken type module imports.
 * 2. PRO-ROW UI: Icons strictly locked to the left of the biometric detail.
 * 3. STABILITY: Uses flat style objects for APK production builds.
 */

import { Activity, Droplets, Milk, Moon } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GlassCard } from '../glass/GlassCard';

const ICON_MAP = {
  FEED: { icon: Milk, color: '#4FD1C7' },
  SLEEP: { icon: Moon, color: '#B794F6' },
  DIAPER: { icon: Droplets, color: '#F6AD55' },
  GROWTH: { icon: Activity, color: '#9AE6B4' },
};

interface TimelineItemProps {
  type: 'FEED' | 'SLEEP' | 'DIAPER' | 'GROWTH';
  time: string;
  detail: string;
}

export const TimelineItem = ({ type, time, detail }: TimelineItemProps) => {
  const Config = ICON_MAP[type] || ICON_MAP.FEED;

  return (
    <View style={styles.root}>
      <View style={styles.timeColumn}>
        <Text style={styles.timeText}>{time}</Text>
      </View>

      <View style={styles.spine}>
        <View style={[styles.node, { borderColor: Config.color }]} />
      </View>

      <GlassCard style={styles.contentCard}>
        <View style={styles.proRow}>
          <View
            style={[styles.iconBox, { backgroundColor: `${Config.color}15` }]}
          >
            <Config.icon size={16} color={Config.color} />
          </View>
          <View style={styles.dataStack}>
            <Text style={styles.typeLabel}>{type}</Text>
            <Text style={styles.detailText}>{detail}</Text>
          </View>
        </View>
      </GlassCard>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flexDirection: 'row', marginBottom: 20, minHeight: 70 },
  timeColumn: { width: 60, alignItems: 'center', paddingTop: 4 },
  timeText: { fontSize: 10, color: '#475569', fontWeight: '900' },
  spine: {
    width: 2,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginHorizontal: 20,
    alignItems: 'center',
  },
  node: {
    position: 'absolute',
    top: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#020617',
    borderWidth: 2,
  },
  contentCard: {
    flex: 1,
    padding: 0,
    height: 70,
    borderRadius: 16,
    justifyContent: 'center',
  },
  proRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dataStack: { marginLeft: 16 },
  typeLabel: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  detailText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
});
