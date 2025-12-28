/**
 * PROJECT CRADLE: HEALTH VAULT V8.0 (AAA+ STABLE)
 * Path: app/(app)/health.tsx
 * FIXES: Linked 'onAdd' prop to MedicationInventory and resolved TS linter errors.
 */

import { GlassCard } from '@/components/glass/GlassCard';
import { HealthLogModal } from '@/components/tracking/HealthLogModal';
import { MedicationInventory } from '@/components/tracking/MedicationInventory';
import { useFamily } from '@/context/family';
import { supabase } from '@/lib/supabase';
import { ChevronRight, Pill, Plus } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

export default function HealthScreen() {
  const { selectedBaby } = useFamily();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const [medications, setMedications] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchLogs = async () => {
    if (!selectedBaby?.id) return;
    const { data } = await supabase
      .from('medication_logs')
      .select('*')
      .eq('baby_id', selectedBaby.id)
      .order('timestamp', { ascending: false })
      .limit(3);
    setMedications(data || []);
  };

  useEffect(() => {
    fetchLogs();
  }, [selectedBaby]);

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[
        styles.content,
        isDesktop && styles.desktopContent,
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>HEALTH VAULT</Text>
      <Text style={styles.babyID}>
        CORE: {selectedBaby?.name?.toUpperCase() || 'SYNCING'}
      </Text>

      {/* 1. CABINET INVENTORY - FIXED: Added required 'onAdd' trigger */}
      <MedicationInventory onAdd={() => setModalVisible(true)} />

      {/* 2. PHARMACY HISTORY */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Pill size={16} color="#B794F6" />
          <Text style={styles.sectionTitle}>HISTORY</Text>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.addBtn}
          >
            <Plus size={14} color="#B794F6" />
          </TouchableOpacity>
        </View>

        {medications.map((item) => (
          <GlassCard key={item.id} style={styles.proRowCard}>
            <View style={styles.proRowInner}>
              <View style={styles.iconBox}>
                <Pill size={18} color="#B794F6" />
              </View>
              <View style={styles.dataStack}>
                <Text style={styles.medName}>{item.medication_name}</Text>
                <Text style={styles.medMeta}>
                  {item.dosage} •{' '}
                  {new Date(item.timestamp).toLocaleTimeString()}
                </Text>
              </View>
              <ChevronRight size={16} color="#475569" />
            </View>
          </GlassCard>
        ))}
      </View>

      <HealthLogModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSuccess={fetchLogs}
        babyId={selectedBaby?.id || ''}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#020617' },
  content: { padding: 20, paddingBottom: 100 },
  desktopContent: { maxWidth: 800, alignSelf: 'center', width: '100%' },
  title: { color: '#FFF', fontSize: 22, fontWeight: '900' },
  babyID: {
    color: '#4FD1C7',
    fontSize: 9,
    fontWeight: '900',
    marginBottom: 32,
  },
  section: { marginTop: 32 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: { color: '#475569', fontSize: 10, fontWeight: '900', flex: 1 },
  addBtn: {
    padding: 8,
    backgroundColor: 'rgba(183, 148, 246, 0.05)',
    borderRadius: 8,
  },
  proRowCard: {
    height: 75,
    borderRadius: 20,
    marginBottom: 10,
    justifyContent: 'center',
  },
  proRowInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(183, 148, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dataStack: { flex: 1, marginLeft: 16 },
  medName: { color: '#FFF', fontSize: 14, fontWeight: '800' },
  medMeta: { color: '#475569', fontSize: 11, fontWeight: '600' },
});
