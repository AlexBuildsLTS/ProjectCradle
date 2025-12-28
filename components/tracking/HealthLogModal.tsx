/**
 * PROJECT CRADLE: HEALTH LOG ENGINE V1.3
 * Path: components/tracking/HealthLogModal.tsx
 * FIXES: Resolved infinite loading spinner by hardening handleSave error handling.
 */

import { useAuth } from '@/context/auth';
import { supabase } from '@/lib/supabase';
import { Save, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { SlideInUp } from 'react-native-reanimated';
import { GlassCard } from '../glass/GlassCard';

interface HealthLogModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  babyId: string;
}

export const HealthLogModal = ({
  visible,
  onClose,
  onSuccess,
  babyId,
}: HealthLogModalProps) => {
  const { profile } = useAuth();
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim() || !dosage.trim())
      return Alert.alert('Required', 'Please fill all fields.');
    if (!babyId) return Alert.alert('Error', 'No baby ID synced.');

    setLoading(true);
    try {
      const { error } = await supabase.from('medication_logs').insert([
        {
          user_id: profile?.id,
          baby_id: babyId,
          medication_name: name.trim(),
          dosage: dosage.trim(),
          timestamp: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      onSuccess();
      setName('');
      setDosage('');
      onClose();
    } catch (err: any) {
      console.error(err);
      Alert.alert('Save Failed', err.message || 'Database handshake failed.');
    } finally {
      setLoading(false); // ENSURES LOADING STOPS
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <Animated.View entering={SlideInUp} style={styles.modalContainer}>
          <GlassCard style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.title}>LOG BIOMETRIC DOSE</Text>
              <TouchableOpacity onPress={onClose}>
                <X size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputBox}>
              <Text style={styles.label}>MEDICINE NAME</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="e.g. Tylenol"
                placeholderTextColor="#475569"
              />
            </View>

            <View style={styles.inputBox}>
              <Text style={styles.label}>DOSAGE AMOUNT</Text>
              <TextInput
                style={styles.input}
                value={dosage}
                onChangeText={setDosage}
                placeholder="e.g. 2.5ml"
                placeholderTextColor="#475569"
              />
            </View>

            <TouchableOpacity
              onPress={handleSave}
              disabled={loading}
              style={styles.saveBtn}
            >
              {loading ? (
                <ActivityIndicator color="#020617" />
              ) : (
                <>
                  <Text style={styles.saveText}>COMMIT DATA</Text>
                  <Save size={18} color="#020617" />
                </>
              )}
            </TouchableOpacity>
          </GlassCard>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: { width: '100%', maxWidth: 400, alignSelf: 'center' },
  card: { padding: 24, borderRadius: 32 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  title: {
    color: '#4FD1C7',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
  },
  inputBox: { marginBottom: 20 },
  label: { color: '#475569', fontSize: 9, fontWeight: '900', marginBottom: 8 },
  input: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    padding: 16,
    color: '#FFF',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  saveBtn: {
    backgroundColor: '#4FD1C7',
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 10,
  },
  saveText: { color: '#020617', fontWeight: '900', fontSize: 12 },
});
