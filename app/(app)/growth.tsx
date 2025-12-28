/**
 * PROJECT CRADLE: GROWTH BIOMETRICS MASTER V1.0
 * Path: app/(app)/growth.tsx
 * FEATURES:
 * - Weight and Height milestone tracking.
 * - Real-time synchronization with Selected Baby Core.
 * - Biometric timeline for developmental analysis.
 */

import { GlassCard } from '@/components/glass/GlassCard';
import { useFamily } from '@/context/family';
import { supabase } from '@/lib/supabase';
import * as Haptics from 'expo-haptics';
import {
  ChevronRight,
  History,
  Ruler,
  Save,
  Scale,
  TrendingUp,
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function GrowthScreen() {
  const { selectedBaby } = useFamily();

  // BIOMETRIC STATE
  const [loading, setLoading] = useState(false);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [growthLogs, setGrowthLogs] = useState<any[]>([]);

  // MODULE: FETCH BIOMETRIC HISTORY
  const fetchGrowthLogs = async () => {
    if (!selectedBaby?.id) return;
    try {
      const { data, error } = await supabase
        .from('care_events')
        .select('*')
        .eq('baby_id', selectedBaby.id)
        .eq('event_type', 'growth')
        .order('timestamp', { ascending: false })
        .limit(10);

      if (error) throw error;
      setGrowthLogs(data || []);
    } catch (e: any) {
      console.error(e.message);
    }
  };

  useEffect(() => {
    fetchGrowthLogs();
  }, [selectedBaby]);

  // MODULE: BIOMETRIC HANDSHAKE
  const handleSaveBiometrics = async () => {
    if (!selectedBaby?.id)
      return Alert.alert('SYNC ERROR', 'No biometric core locked.');
    if (!weight && !height)
      return Alert.alert('DATA MISSING', 'Please enter weight or height.');

    setLoading(true);
    if (Platform.OS !== 'web')
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const { error } = await supabase.from('care_events').insert([
        {
          baby_id: selectedBaby.id,
          event_type: 'growth',
          timestamp: new Date().toISOString(),
          details: {
            weight: weight ? `${weight}kg` : null,
            height: height ? `${height}cm` : null,
            note: 'Standard biometric update',
          },
        },
      ]);

      if (error) throw error;

      Alert.alert('SYNCED', 'Biometric milestones updated in the core.');
      setWeight('');
      setHeight('');
      fetchGrowthLogs();
    } catch (e: any) {
      Alert.alert('HANDSHAKE ERROR', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.title}>GROWTH CORE</Text>
      <Text style={styles.target}>
        ACTIVE IDENTIFIER: {selectedBaby?.name?.toUpperCase()}
      </Text>

      {/* MODULE: BIOMETRIC INPUT INTERFACE */}
      <GlassCard style={styles.inputCard}>
        <View style={styles.cardHeader}>
          <TrendingUp size={18} color="#4FD1C7" />
          <Text style={styles.cardTitle}>NEW BIOMETRIC DATA</Text>
        </View>

        <View style={styles.inputStack}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>CURRENT WEIGHT (KG)</Text>
            <View style={styles.fieldWrapper}>
              <Scale size={18} color="#4FD1C7" style={styles.fieldIcon} />
              <TextInput
                style={styles.input}
                value={weight}
                onChangeText={setWeight}
                placeholder="0.00"
                placeholderTextColor="#475569"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>CURRENT HEIGHT (CM)</Text>
            <View style={styles.fieldWrapper}>
              <Ruler size={18} color="#4FD1C7" style={styles.fieldIcon} />
              <TextInput
                style={styles.input}
                value={height}
                onChangeText={setHeight}
                placeholder="00.0"
                placeholderTextColor="#475569"
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveBtn, loading && { opacity: 0.7 }]}
          onPress={handleSaveBiometrics}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#020617" />
          ) : (
            <>
              <Text style={styles.saveText}>SYNC BIOMETRICS</Text>
              <Save size={18} color="#020617" />
            </>
          )}
        </TouchableOpacity>
      </GlassCard>

      {/* MODULE: GROWTH TIMELINE */}
      <View style={styles.timelineSection}>
        <View style={styles.timelineHeader}>
          <History size={16} color="#475569" />
          <Text style={styles.timelineTitle}>BIOMETRIC HISTORY</Text>
        </View>

        {growthLogs.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              No biometric data recorded in the current cycle.
            </Text>
          </View>
        ) : (
          growthLogs.map((log) => (
            <GlassCard key={log.id} style={styles.logItem}>
              <View style={styles.logDateRow}>
                <Text style={styles.logDate}>
                  {new Date(log.timestamp).toLocaleDateString()}
                </Text>
                <ChevronRight size={14} color="#475569" />
              </View>
              <View style={styles.logStatRow}>
                <View style={styles.logStat}>
                  <Text style={styles.statLabel}>WEIGHT</Text>
                  <Text style={styles.statValue}>
                    {log.details.weight || '--'}
                  </Text>
                </View>
                <View style={styles.logStat}>
                  <Text style={styles.statLabel}>HEIGHT</Text>
                  <Text style={styles.statValue}>
                    {log.details.height || '--'}
                  </Text>
                </View>
              </View>
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
  inputCard: { padding: 32, borderRadius: 40 },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 32,
  },
  cardTitle: {
    color: '#4FD1C7',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  inputStack: { gap: 24, marginBottom: 32 },
  inputGroup: { width: '100%' },
  label: {
    color: '#475569',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  fieldWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 16,
  },
  fieldIcon: { marginRight: 12 },
  input: {
    flex: 1,
    paddingVertical: 18,
    color: '#FFF',
    fontWeight: '700',
    fontSize: 15,
  },
  saveBtn: {
    backgroundColor: '#4FD1C7',
    padding: 22,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  saveText: {
    color: '#020617',
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  timelineSection: { width: '100%', marginTop: 40 },
  timelineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  timelineTitle: {
    color: '#475569',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
  },
  emptyState: {
    padding: 48,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 32,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  emptyText: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  logItem: { padding: 20, borderRadius: 24, marginBottom: 12 },
  logDateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  logDate: {
    color: 'rgba(148, 163, 184, 0.4)',
    fontSize: 11,
    fontWeight: '900',
  },
  logStatRow: { flexDirection: 'row', gap: 32 },
  logStat: { flex: 1 },
  statLabel: {
    color: '#475569',
    fontSize: 9,
    fontWeight: '900',
    marginBottom: 4,
  },
  statValue: { color: '#FFF', fontSize: 18, fontWeight: '800' },
});
