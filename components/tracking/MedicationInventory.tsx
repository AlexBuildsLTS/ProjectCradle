/**
 * PROJECT CRADLE: MEDICATION INVENTORY V1.3
 * Path: components/tracking/MedicationInventory.tsx
 * FIXES: Added interface for onAdd prop and enabled the 'ADD ITEM' trigger.
 */

import { useAuth } from '@/context/auth';
import { supabase } from '@/lib/supabase';
import { AlertTriangle, Package, Pill, Plus } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { GlassCard } from '../glass/GlassCard';

interface MedicationInventoryProps {
  onAdd: () => void; // Required trigger to fix the broken grey box
}

export const MedicationInventory = ({ onAdd }: MedicationInventoryProps) => {
  const { profile } = useAuth();
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInventory() {
      if (!profile?.id) return;
      try {
        const { data } = await supabase
          .from('medication_inventory')
          .select('*')
          .eq('user_id', profile.id);
        if (data) setInventory(data);
      } finally {
        setLoading(false);
      }
    }
    fetchInventory();
  }, [profile?.id]);

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#4FD1C7" />
      </View>
    );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Package size={18} color="#4FD1C7" />
        <Text style={styles.title}>MEDICATION CABINET</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {inventory.map((item) => {
          const percentage = (item.current_volume / item.max_volume) * 100;
          const isLow = percentage < 20;
          return (
            <GlassCard key={item.id} style={styles.medCard}>
              <View style={styles.medHeader}>
                <Pill size={20} color={isLow ? '#F87171' : '#4FD1C7'} />
                {isLow && <AlertTriangle size={14} color="#F87171" />}
              </View>
              <Text style={styles.medName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.stockLabel}>STOCK LEVEL</Text>
              <View style={styles.progressContainer}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${Math.max(percentage, 5)}%`,
                      backgroundColor: isLow ? '#F87171' : '#4FD1C7',
                    },
                  ]}
                />
              </View>
              <View style={styles.volumeRow}>
                <Text style={styles.volumeText}>
                  {item.current_volume}
                  {item.unit}
                </Text>
                <Text style={styles.percentText}>
                  {Math.round(percentage)}%
                </Text>
              </View>
            </GlassCard>
          );
        })}

        {/* FIXED: GREY BOX NOW TRIGGERS MODAL */}
        <TouchableOpacity
          style={styles.addCard}
          onPress={onAdd}
          activeOpacity={0.7}
        >
          <Plus size={24} color="#475569" />
          <Text style={styles.addText}>ADD ITEM</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 32 },
  center: { height: 160, justifyContent: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  title: {
    color: '#4FD1C7',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
  },
  scrollContent: { paddingHorizontal: 4, gap: 16 },
  medCard: { width: 160, padding: 20 },
  medHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  medName: { color: '#FFF', fontSize: 16, fontWeight: '800', marginBottom: 4 },
  stockLabel: {
    color: '#475569',
    fontSize: 9,
    fontWeight: '900',
    marginBottom: 12,
  },
  progressContainer: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 2,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: { height: '100%' },
  volumeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  volumeText: { color: '#94A3B8', fontSize: 12, fontWeight: '700' },
  percentText: { color: '#475569', fontSize: 10, fontWeight: '800' },
  addCard: {
    width: 140,
    height: 160,
    borderRadius: 24,
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  addText: { color: '#475569', fontSize: 10, fontWeight: '900' },
});
