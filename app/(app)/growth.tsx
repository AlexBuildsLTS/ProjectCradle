/**
 * PROJECT CRADLE: GROWTH BIOMETRICS MASTER V1.1 (AAA+ TIER)
 * Path: app/(app)/growth.tsx
 * FIXES: Corrected 'care_events' ledger mapping and UI overlap protection.
 */

import { GlassCard } from '@/components/glass/GlassCard';
import { useAuth } from '@/context/auth';
import { useFamily } from '@/context/family';
import { supabase } from '@/lib/supabase';
import {
  ChevronRight,
  History,
  Ruler,
  Scale,
  TrendingUp,
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function GrowthScreen() {
  const { selectedBaby } = useFamily();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [growthLogs, setGrowthLogs] = useState<any[]>([]);

  const fetchLogs = async () => {
    if (!selectedBaby?.id) return;
    const { data } = await supabase
      .from('care_events')
      .select('*')
      .eq('baby_id', selectedBaby.id)
      .eq('event_type', 'growth')
      .order('timestamp', { ascending: false })
      .limit(10);
    if (data) setGrowthLogs(data);
  };

  useEffect(() => {
    fetchLogs();
  }, [selectedBaby]);

  const handleSync = async () => {
    if (!selectedBaby?.id) return Alert.alert('SYNC ERROR', 'Core missing.');
    setLoading(true);
    const { error } = await supabase.from('care_events').insert([
      {
        baby_id: selectedBaby.id,
        user_id: user?.id,
        event_type: 'growth',
        metadata: { weight: `${weight}kg`, height: `${height}cm` }, // FIXED: Changed details to metadata
      },
    ]);
    if (!error) {
      setWeight('');
      setHeight('');
      await fetchLogs();
    }
    setLoading(false);
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.title}>GROWTH CORE</Text>
      <Text style={styles.target}>
        ACTIVE ID: {selectedBaby?.name?.toUpperCase()}
      </Text>

      <GlassCard style={styles.inputCard}>
        <View style={styles.inputStack}>
          <BiometricField
            label="WEIGHT (KG)"
            icon={Scale}
            value={weight}
            onChange={setWeight}
          />
          <BiometricField
            label="HEIGHT (CM)"
            icon={Ruler}
            value={height}
            onChange={setHeight}
          />
        </View>
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSync}
          disabled={loading}
        >
          <Text style={styles.saveText}>
            {loading ? 'SYNCING...' : 'COMMIT BIOMETRICS'}
          </Text>
        </TouchableOpacity>
      </GlassCard>

      <View style={styles.ledger}>
        <View style={styles.ledgerHeader}>
          <History size={16} color="#475569" />
          <Text style={styles.ledgerTitle}>BIOMETRIC HISTORY</Text>
        </View>
        {growthLogs.map((log) => (
          <GlassCard key={log.id} style={styles.logCard}>
            <View style={styles.proRow}>
              <View style={styles.iconCircle}>
                <TrendingUp size={18} color="#4FD1C7" />
              </View>
              <View style={styles.dataStack}>
                <Text style={styles.logDate}>
                  {new Date(log.timestamp).toLocaleDateString()}
                </Text>
                <Text style={styles.logValues}>
                  {log.metadata?.weight || '--'} •{' '}
                  {log.metadata?.height || '--'}
                </Text>
              </View>
              <ChevronRight size={14} color="#475569" />
            </View>
          </GlassCard>
        ))}
      </View>
    </ScrollView>
  );
}

const BiometricField = ({ label, icon: Icon, value, onChange }: any) => (
  <View style={styles.fieldGroup}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.wrapper}>
      <Icon size={18} color="#4FD1C7" />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        keyboardType="numeric"
        placeholder="0.00"
        placeholderTextColor="#475569"
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#020617' },
  content: {
    padding: 24,
    paddingBottom: 100,
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
  },
  title: { color: '#FFF', fontSize: 24, fontWeight: '900' },
  target: {
    color: '#4FD1C7',
    fontSize: 10,
    fontWeight: '900',
    marginTop: 6,
    marginBottom: 32,
  },
  inputCard: { padding: 32, borderRadius: 40 },
  inputStack: { gap: 24, marginBottom: 32 },
  fieldGroup: { width: '100%' },
  label: {
    color: '#475569',
    fontSize: 10,
    fontWeight: '900',
    marginBottom: 12,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 18,
    color: '#FFF',
    fontWeight: '700',
    fontSize: 15,
    marginLeft: 12,
  },
  saveBtn: {
    backgroundColor: '#4FD1C7',
    padding: 22,
    borderRadius: 20,
    alignItems: 'center',
  },
  saveText: { color: '#020617', fontWeight: '900', fontSize: 12 },
  ledger: { marginTop: 40 },
  ledgerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  ledgerTitle: { color: '#475569', fontSize: 10, fontWeight: '900' },
  logCard: { padding: 0, height: 75, borderRadius: 24, marginBottom: 12 },
  proRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(79, 209, 199, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dataStack: { flex: 1, marginLeft: 16 },
  logDate: { color: '#475569', fontSize: 10, fontWeight: '800' },
  logValues: { color: '#FFF', fontSize: 15, fontWeight: '800', marginTop: 2 },
});
