/**
 * PROJECT CRADLE: FAMILY MANAGEMENT CORE V1.0
 * Handles adding multiple babies to the primary family.
 */

import { GlassCard } from '@/components/glass/GlassCard';
import { supabase } from '@/lib/supabase';
import { Baby, Plus, Trash2 } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const FamilyManagement = ({ familyId }: { familyId: string }) => {
  const [babies, setBabies] = useState<any[]>([]);

  const fetchBabies = async () => {
    const { data } = await supabase
      .from('babies')
      .select('*')
      .eq('family_id', familyId);
    if (data) setBabies(data);
  };

  useEffect(() => {
    fetchBabies();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>ACTIVE BABY CORES</Text>
      {babies.map((baby) => (
        <GlassCard key={baby.id} style={styles.babyCard}>
          <View style={styles.babyInfo}>
            <Baby size={20} color="#4FD1C7" />
            <Text style={styles.babyName}>{baby.name.toUpperCase()}</Text>
          </View>
          <TouchableOpacity
            onPress={() => Alert.alert('Confirm', 'Deactivate this core?')}
          >
            <Trash2 size={16} color="#475569" />
          </TouchableOpacity>
        </GlassCard>
      ))}

      <TouchableOpacity
        style={styles.addBtn}
        onPress={() =>
          Alert.alert('Initialize New Core', 'Add another baby to this family?')
        }
      >
        <Plus size={20} color="#020617" />
        <Text style={styles.addText}>ADD BABY PROFILE</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { gap: 12 },
  label: {
    color: '#475569',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 4,
  },
  babyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 20,
  },
  babyInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  babyName: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 1,
  },
  addBtn: {
    backgroundColor: '#4FD1C7',
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 12,
  },
  addText: { color: '#020617', fontWeight: '900', fontSize: 12 },
});
