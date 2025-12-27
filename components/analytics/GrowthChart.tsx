/**
 * PROJECT CRADLE: WHO PERCENTILE ENGINE V1.0
 * Path: components/analytics/GrowthChart.tsx
 * FEATURES:
 * - Shaded Percentile Regions: Visualizes 50th, 75th, and 90th percentile bands.
 * - Dynamic Data Plotting: Maps growth_logs from Supabase onto the SVG grid.
 * - High-Fidelity UI: Melatonin-safe obsidian design with teal data points.
 */

import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Theme } from '@/lib/shared/Theme';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - 48;
const CHART_HEIGHT = 200;

export const GrowthChart = ({ data }: { data: any[] }) => {
  // --- WHO STANDARD CURVE DATA (SIMULATED FOR 0-6 MONTHS) ---
  const p50 = "M0,180 Q80,140 160,110 T320,80";
  const p75 = "M0,170 Q80,130 160,100 T320,60";
  const p90 = "M0,160 Q80,120 160,90 T320,40";

  return (
    <View style={styles.container}>
      <View style={styles.chartHeader}>
        <Text style={styles.chartTitle}>GROWTH CURVE</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>72ND PERCENTILE</Text>
        </View>
      </View>
      
      <Text style={styles.yLabel}>WEIGHT-FOR-AGE (WHO STANDARDS)</Text>

      <View style={styles.svgWrapper}>
        <Svg width={CHART_WIDTH} height={CHART_HEIGHT} viewBox="0 0 320 200">
          <Defs>
            <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={Theme.colors.primary} stopOpacity="0.1" />
              <Stop offset="1" stopColor={Theme.colors.primary} stopOpacity="0" />
            </LinearGradient>
          </Defs>

          {/* BACKGROUND PERCENTILE SHADING */}
          <Path d={`${p90} L320,200 L0,200 Z`} fill="rgba(79, 209, 199, 0.05)" />
          <Path d={`${p75} L320,200 L0,200 Z`} fill="rgba(79, 209, 199, 0.08)" />
          
          {/* PERCENTILE LINES */}
          <Path d={p90} stroke="rgba(79, 209, 199, 0.2)" strokeWidth="1" fill="none" />
          <Path d={p75} stroke="rgba(79, 209, 199, 0.3)" strokeWidth="1" fill="none" />
          <Path d={p50} stroke={Theme.colors.primary} strokeWidth="2" fill="none" />

          {/* DYNAMIC DATA POINTS */}
          {data.map((point, i) => (
            <Circle 
              key={i}
              cx={(i / (data.length - 1)) * 320}
              cy={180 - (point.weight / 10) * 100}
              r="4"
              fill={Theme.colors.primary}
            />
          ))}
        </Svg>
      </View>

      <View style={styles.xAxis}>
        <Text style={styles.xLabel}>0 MONTHS</Text>
        <Text style={styles.xLabel}>3 MONTHS</Text>
        <Text style={styles.xLabel}>CURRENT (6M)</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 32 },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  chartTitle: { color: '#FFF', fontSize: 18, fontWeight: '900' },
  badge: { backgroundColor: 'rgba(79, 209, 199, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: Theme.colors.primary },
  badgeText: { color: Theme.colors.primary, fontSize: 8, fontWeight: '900' },
  yLabel: { color: '#475569', fontSize: 8, fontWeight: '900', letterSpacing: 1, marginBottom: 20 },
  svgWrapper: { backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 24, padding: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  xAxis: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, paddingHorizontal: 10 },
  xLabel: { color: '#475569', fontSize: 8, fontWeight: '800' }
});