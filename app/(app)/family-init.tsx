/**
 * PROJECT CRADLE: BABY CORE INITIALIZER V1.0
 * Path: app/(app)/family-init.tsx
 * FEATURES:
 * - Biometric birth data entry.
 * - Dynamic measurement unit selection (Metric/Imperial).
 * - Enforced 450px MaxWidth for UI consistency.
 */

import { GlassCard } from '@/components/glass/GlassCard';
import { useAuth } from '@/context/auth';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { Baby, Calendar, ChevronRight, Scale } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function BabyCoreInit() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // BIOMETRIC STATE
  const [babyName, setBabyName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [weight, setWeight] = useState('');

  const handleInitialize = async () => {
    if (!babyName || !birthDate) {
      return Alert.alert(
        'DATA MISSING',
        'Identifier name and birth date are required.',
      );
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('babies').insert([
        {
          family_id: user?.id, // Assumes user ID maps to primary family core
          name: babyName.trim(),
          birth_date: birthDate,
          initial_weight: weight,
          status: 'active',
        },
      ]);

      if (error) throw error;

      Alert.alert(
        'CORE INITIALIZED',
        `${babyName.toUpperCase()} has been registered to the family core.`,
      );
      router.push('/(app)/family');
    } catch (e: any) {
      Alert.alert('INIT ERROR', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.scrollContent}
    >
      <GlassCard style={styles.container}>
        <View style={styles.header}>
          <Baby size={22} color="#4FD1C7" />
          <Text style={styles.headerTitle}>INITIALIZE BABY CORE</Text>
        </View>

        <View style={styles.formStack}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>IDENTIFIER NAME</Text>
            <TextInput
              style={styles.input}
              value={babyName}
              onChangeText={setBabyName}
              placeholder="e.g. Steven"
              placeholderTextColor="#475569"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>BIRTH DATE (YYYY-MM-DD)</Text>
            <View style={styles.inputWrapper}>
              <Calendar size={18} color="#4FD1C7" style={styles.fieldIcon} />
              <TextInput
                style={styles.flexInput}
                value={birthDate}
                onChangeText={setBirthDate}
                placeholder="2025-01-01"
                placeholderTextColor="#475569"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>INITIAL WEIGHT (OPTIONAL)</Text>
            <View style={styles.inputWrapper}>
              <Scale size={18} color="#4FD1C7" style={styles.fieldIcon} />
              <TextInput
                style={styles.flexInput}
                value={weight}
                onChangeText={setWeight}
                placeholder="3.5kg / 7lb 11oz"
                placeholderTextColor="#475569"
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.initBtn, loading && styles.btnDisabled]}
            onPress={handleInitialize}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#020617" />
            ) : (
              <>
                <Text style={styles.btnText}>ACTIVATE PROFILE</Text>
                <ChevronRight size={18} color="#020617" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </GlassCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#020617' },
  scrollContent: {
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100%',
  },
  container: { padding: 40, width: '100%', maxWidth: 450, alignSelf: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 32,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 2,
  },
  formStack: { width: '100%', gap: 24 },
  inputGroup: { width: '100%' },
  label: {
    color: '#475569',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 16,
    padding: 18,
    color: '#FFF',
    fontWeight: '700',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
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
  fieldIcon: { marginRight: 12 },
  flexInput: { flex: 1, paddingVertical: 18, color: '#FFF', fontWeight: '700' },
  initBtn: {
    backgroundColor: '#4FD1C7',
    width: '100%',
    padding: 20,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 12,
  },
  btnDisabled: { opacity: 0.5 },
  btnText: {
    color: '#020617',
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 1,
  },
});
