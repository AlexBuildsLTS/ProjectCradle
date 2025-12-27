/**
 * PROJECT CRADLE: GROWTH HISTORY LEDGER V1.0
 * Path: components/analytics/GrowthHistoryLedger.tsx
 * FEATURES:
 * - Historical Audit: Vertical timeline of all growth measurements.
 * - Delta Calculation: Shows the change between the current and previous entry.
 * - High-Fidelity UI: Obsidian glass cards with depth-focused borders.
 */

import { useAuth } from '@/context/auth';
import { Theme } from '@/lib/shared/Theme';
import { supabase } from '@/lib/supabase';
import { Calendar, Ruler, Scale } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { GlassCard } from '../glass/GlassCard';

export const GrowthHistoryLedger = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      if (!user?.id) return;
      try {
        const { data, error } = await supabase
          .from('growth_logs')
          .select('*')
          .eq('user_id', user.id)
          .order('date_recorded', { ascending: false });

        if (data) setHistory(data);
      } catch (err) {
        console.error('History Fetch Failure:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, [user?.id]);

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    // Calculate weight delta if there's a previous record
    const prevRecord = history[index + 1];
    const weightDelta = prevRecord
      ? (item.weight_grams - prevRecord.weight_grams) / 1000
      : null;

    return (
      <GlassCard style={styles.recordCard} variant="teal">
        <View style={styles.dateRow}>
          <Calendar size={14} color={Theme.colors.primary} />
          <Text style={styles.dateText}>
            {new Date(item.date_recorded).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <View style={styles.statLabelRow}>
              <Scale size={16} color="#94A3B8" />
              <Text style={styles.statLabel}>WEIGHT</Text>
            </View>
            <Text style={styles.statValue}>
              {(item.weight_grams / 1000).toFixed(2)} kg
            </Text>
            {weightDelta !== null && (
              <Text
                style={[
                  styles.deltaText,
                  weightDelta >= 0 ? styles.positive : styles.negative,
                ]}
              >
                {weightDelta >= 0 ? '+' : ''}
                {weightDelta.toFixed(2)} kg since last
              </Text>
            )}
          </View>

          <View style={styles.verticalDivider} />

          <View style={styles.statBox}>
            <View style={styles.statLabelRow}>
              <Ruler size={16} color="#94A3B8" />
              <Text style={styles.statLabel}>HEIGHT</Text>
            </View>
            <Text style={styles.statValue}>{item.height_cm} cm</Text>
          </View>
        </View>
      </GlassCard>
    );
  };

  if (loading)
    return (
      <ActivityIndicator
        color={Theme.colors.primary}
        style={{ marginTop: 20 }}
      />
    );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeader}>HISTORICAL RECORDS</Text>
      {history.length > 0 ? (
        <FlatList
          data={history}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false} // Managed by parent ScrollView in growth.tsx
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No growth history found.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 32 },
  sectionHeader: {
    color: '#475569',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  listContent: { gap: 16 },
  recordCard: { padding: 20 },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  dateText: { color: '#FFF', fontSize: 13, fontWeight: '800' },
  statsGrid: { flexDirection: 'row', alignItems: 'center' },
  statBox: { flex: 1 },
  statLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  statLabel: {
    color: '#475569',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  statValue: { color: '#FFF', fontSize: 20, fontWeight: '900' },
  deltaText: { fontSize: 10, fontWeight: '700', marginTop: 4 },
  positive: { color: '#4FD1C7' },
  negative: { color: '#F87171' },
  verticalDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginHorizontal: 20,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 24,
  },
  emptyText: { color: '#475569', fontWeight: '700' },
});
