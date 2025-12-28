/**
 * PROJECT CRADLE: GROWTH BIOMETRIC ENGINE V1.1 (AAA+ TIER)
 * Path: components/tracking/GrowthModal.tsx
 * FIXES:
 * 1. SCHEMA SYNC: Maps to 'weight_kg' and 'head_circ_cm'.
 * 2. UNIT CONVERSION: Grams to KG handshake for database precision.
 * 3. UI: Pro-Row architecture for 0% label overlap.
 */

import { useAuth } from '@/context/auth';
import { supabase } from '@/lib/supabase';
import { Brain, Check, Ruler, Scale, TrendingUp, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { SlideInUp } from 'react-native-reanimated';
import { GlassCard } from '../glass/GlassCard';

interface GrowthModalProps {
  visible: boolean;
  onClose: () => void;
  babyId: string;
}

export const GrowthModal = ({ visible, onClose, babyId }: GrowthModalProps) => {
  const { user } = useAuth();
  const [weight, setWeight] = useState(''); // Inputs in grams for user ease
  const [height, setHeight] = useState('');
  const [headCirc, setHeadCirc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSaveGrowth = async () => {
    if (!weight && !height && !headCirc)
      return Alert.alert('EMPTY LOG', 'Enter measurements.');
    if (!babyId) return Alert.alert('SYNC ERROR', 'No baby core locked.');

    setIsSubmitting(true);
    try {
      // 1. COMMIT TO GROWTH_LOGS (For Analytics/Charts)
      const weightKg = weight ? parseFloat(weight) / 1000 : null;
      const { error: growthErr } = await supabase.from('growth_logs').insert([
        {
          user_id: user?.id,
          baby_id: babyId,
          weight_kg: weightKg,
          height_cm: height ? parseFloat(height) : null,
          head_circ_cm: headCirc ? parseFloat(headCirc) : null,
        },
      ]);
      if (growthErr) throw growthErr;

      // 2. COMMIT TO CARE_EVENTS (For Timeline Ledger)
      await supabase.from('care_events').insert([
        {
          user_id: user?.id,
          baby_id: babyId,
          event_type: 'growth',
          metadata: {
            weight: `${weightKg}kg`,
            height: `${height}cm`,
            head: `${headCirc}cm`,
          },
        },
      ]);

      onClose();
      setWeight('');
      setHeight('');
      setHeadCirc('');
    } catch (err: any) {
      Alert.alert('SYNC FAILED', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <Animated.View entering={SlideInUp}>
            <GlassCard style={styles.card}>
              <View style={styles.header}>
                <View style={styles.titleRow}>
                  <TrendingUp size={18} color="#4FD1C7" />
                  <Text style={styles.title}>UPDATE BIOMETRICS</Text>
                </View>
                <TouchableOpacity onPress={onClose}>
                  <X size={20} color="#94A3B8" />
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.content}
                keyboardShouldPersistTaps="handled"
              >
                <InputRow
                  label="WEIGHT (GRAMS)"
                  icon={Scale}
                  value={weight}
                  onChange={setWeight}
                  placeholder="0"
                />
                <InputRow
                  label="HEIGHT (CM)"
                  icon={Ruler}
                  value={height}
                  onChange={setHeight}
                  placeholder="0.0"
                />
                <InputRow
                  label="HEAD CIRC (CM)"
                  icon={Brain}
                  value={headCirc}
                  onChange={setHeadCirc}
                  placeholder="0.0"
                />
              </ScrollView>

              <TouchableOpacity
                onPress={handleSaveGrowth}
                disabled={isSubmitting}
                style={styles.saveBtn}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#020617" />
                ) : (
                  <>
                    <Text style={styles.saveText}>SYNC TO CORE</Text>
                    <Check size={18} color="#020617" />
                  </>
                )}
              </TouchableOpacity>
            </GlassCard>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const InputRow = ({ label, icon: Icon, value, onChange, placeholder }: any) => (
  <View style={styles.inputGroup}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View style={styles.inputWrapper}>
      <Icon size={16} color="#4FD1C7" style={{ marginRight: 12 }} />
      <TextInput
        style={styles.textInput}
        placeholder={placeholder}
        placeholderTextColor="#475569"
        keyboardType="numeric"
        value={value}
        onChangeText={onChange}
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: { width: '100%', maxWidth: 450, alignSelf: 'center' },
  card: { padding: 24, borderRadius: 32 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  title: { color: '#FFF', fontSize: 10, fontWeight: '900', letterSpacing: 2 },
  content: { marginBottom: 24 },
  inputGroup: { marginBottom: 20 },
  inputLabel: {
    color: '#475569',
    fontSize: 9,
    fontWeight: '900',
    marginBottom: 10,
    letterSpacing: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 16,
  },
  textInput: {
    flex: 1,
    height: 56,
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  saveBtn: {
    backgroundColor: '#4FD1C7',
    height: 64,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  saveText: { color: '#020617', fontWeight: '900', fontSize: 13 },
});
