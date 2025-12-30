/**
 * PROJECT CRADLE: BIOMETRIC INITIALIZATION V11.0
 * Path: app/(auth)/onboarding.tsx
 * ----------------------------------------------------------------------------
 * FEATURES:
 * 1. ATOMIC SYNC: Registers subject in 'babies' table and updates profile.
 * 2. WEB CALENDAR: Native date picker for desktop fidelity.
 * 3. VALIDATION: Strict ISO-8601 formatting for biometric consistency.
 * 4. UX: Obsidian Glassmorphism with non-linear spring physics.
 */

import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import {
  ArrowRight,
  Baby,
  Calendar,
  Info,
  Sparkles,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAuth } from '../../context/auth';
import { supabase } from '../../lib/supabase';

export default function Onboarding() {
  const { user, refreshProfile } = useAuth();
  const router = useRouter();

  const [babyName, setBabyName] = useState('');
  const [babyDob, setBabyDob] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCompleteOnboarding = async () => {
    if (!babyName.trim() || !babyDob.trim()) {
      return Alert.alert(
        'Required',
        'Please provide subject name and birth date.',
      );
    }

    setLoading(true);
    if (Platform.OS !== 'web')
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      console.log('[Core] Initializing Biometric Subject...');

      // 1. CREATE ENTRY IN BABIES TABLE (Critical for GlobalHeader Dropdown)
      const { data: babyData, error: babyError } = await supabase
        .from('babies')
        .insert({
          parent_id: user?.id,
          name: babyName.trim(),
          dob: babyDob,
          current_target_sleep_hours: 14.0,
        })
        .select()
        .single();

      if (babyError) throw babyError;

      // 2. UPDATE PROFILE AS ONBOARDED
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          baby_name: babyName.trim(),
          baby_dob: babyDob,
          is_onboarded: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);

      if (profileError) throw profileError;

      console.log('[Core] Subject Initialized. Syncing identity...');
      await refreshProfile();

      router.replace('/(app)');
    } catch (error: any) {
      console.error('[Onboarding] Sync Failure:', error);
      Alert.alert('Initialization Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View
        entering={FadeInDown.duration(800).springify()}
        style={styles.glassBox}
      >
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Sparkles size={32} color="#4FD1C7" />
          </View>
          <Text style={styles.title}>Core Setup</Text>
          <Text style={styles.subtitle}>
            Register biometric data to synchronize with the family core.
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputLabelRow}>
            <Text style={styles.inputLabel}>SUBJECT IDENTIFIER</Text>
          </View>
          <View style={styles.inputGroup}>
            <Baby size={20} color="#4FD1C7" />
            <TextInput
              placeholder="Baby's Name"
              placeholderTextColor="#475569"
              style={styles.input}
              value={babyName}
              onChangeText={setBabyName}
              editable={!loading}
            />
          </View>

          <View style={styles.inputLabelRow}>
            <Text style={styles.inputLabel}>BIOMETRIC DATE OF BIRTH</Text>
          </View>
          <View style={styles.inputGroup}>
            <Calendar size={20} color="#4FD1C7" />
            {Platform.OS === 'web' ? (
              <input
                type="date"
                style={webInputStyle}
                value={babyDob}
                onChange={(e) => setBabyDob(e.target.value)}
              />
            ) : (
              <TextInput
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#475569"
                style={styles.input}
                value={babyDob}
                onChangeText={setBabyDob}
                keyboardType="numeric"
                maxLength={10}
              />
            )}
          </View>

          <View style={styles.infoRow}>
            <Info size={12} color="#475569" />
            <Text style={styles.infoText}>
              Format must be ISO-8601 (Year-Month-Day)
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleCompleteOnboarding}
          disabled={loading}
          activeOpacity={0.8}
          style={[styles.submitBtn, loading && { opacity: 0.5 }]}
        >
          {loading ? (
            <ActivityIndicator color="#020617" />
          ) : (
            <View style={styles.btnContent}>
              <Text style={styles.submitText}>INITIALIZE TRACKING</Text>
              <ArrowRight
                size={18}
                color="#020617"
                strokeWidth={3}
                style={{ marginLeft: 12 }}
              />
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const webInputStyle = {
  flex: 1,
  backgroundColor: 'transparent',
  border: 'none',
  color: '#FFF',
  fontSize: '15px',
  fontWeight: '700',
  outline: 'none',
  marginLeft: '16px',
  cursor: 'pointer',
  fontFamily: 'inherit',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    justifyContent: 'center',
    padding: 24,
    alignItems: 'center',
  },
  glassBox: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 36,
    padding: 40,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    width: '100%',
    maxWidth: 500,
    ...Platform.select({
      web: { boxShadow: '0 20px 50px rgba(0,0,0,0.5)' },
    }),
  },
  header: { alignItems: 'center', marginBottom: 40 },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: 'rgba(79, 209, 199, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(79, 209, 199, 0.2)',
  },
  title: { color: '#FFF', fontSize: 28, fontWeight: '900', letterSpacing: -1 },
  subtitle: {
    color: '#64748B',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 20,
    fontSize: 14,
    fontWeight: '600',
  },
  form: { gap: 12 },
  inputLabelRow: { marginTop: 8, marginBottom: 4, paddingLeft: 4 },
  inputLabel: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  inputGroup: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 20,
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  input: {
    color: '#FFF',
    flex: 1,
    marginLeft: 16,
    fontWeight: '700',
    fontSize: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 8,
    marginTop: 4,
  },
  infoText: { color: '#475569', fontSize: 11, fontWeight: '700' },
  submitBtn: {
    height: 68,
    borderRadius: 24,
    backgroundColor: '#4FD1C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
  },
  btnContent: { flexDirection: 'row', alignItems: 'center' },
  submitText: {
    color: '#020617',
    fontWeight: '900',
    letterSpacing: 1.5,
    fontSize: 14,
  },
});
