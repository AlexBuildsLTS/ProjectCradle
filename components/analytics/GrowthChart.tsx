/**
 * PROJECT CRADLE: BIOMETRIC GROWTH CHART (AAA+ TIER)
 * Path: components/analytics/GrowthChart.tsx
 * FEATURES: Named export for strict module resolution.
 */

import { useFamily } from '@/context/family';
import { supabase } from '@/lib/supabase';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';

export const GrowthChart = () => {
  const { selectedBaby } = useFamily();
  const { width } = useWindowDimensions();
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBiometrics() {
      if (!selectedBaby?.id) return;
      const { data: logs } = await supabase
        .from('growth_logs')
        .select('weight_kg, timestamp')
        .eq('baby_id', selectedBaby.id)
        .order('timestamp', { ascending: true })
        .limit(6);

      if (logs && logs.length > 0) {
        setChartData({
          labels: logs.map((l) =>
            new Date(l.timestamp).toLocaleDateString([], { month: 'short' }),
          ),
          datasets: [{ data: logs.map((l) => l.weight_kg) }],
        });
      }
      setLoading(false);
    }
    fetchBiometrics();
  }, [selectedBaby]);

  if (loading)
    return <ActivityIndicator color="#4FD1C7" style={{ padding: 40 }} />;
  if (!chartData)
    return (
      <View
        style={{ height: 220, alignItems: 'center', justifyContent: 'center' }}
      >
        <Text style={{ color: '#475569', fontSize: 10, fontWeight: '800' }}>
          WAITING FOR GROWTH DATA...
        </Text>
      </View>
    );

  return (
    <LineChart
      data={chartData}
      width={width > 800 ? 760 : width - 40}
      height={220}
      chartConfig={{
        backgroundColor: 'transparent',
        backgroundGradientFrom: '#020617',
        backgroundGradientTo: '#020617',
        decimalPlaces: 1,
        color: (opacity = 1) => `rgba(79, 209, 199, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(71, 85, 105, ${opacity})`,
        propsForDots: { r: '4', strokeWidth: '2', stroke: '#4FD1C7' },
      }}
      bezier
      style={{ marginVertical: 8, borderRadius: 16 }}
    />
  );
};
