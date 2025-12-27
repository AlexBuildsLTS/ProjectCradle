import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, Alert, 
  ActivityIndicator, StyleSheet 
} from 'react-native';
// FIXED: Corrected relative paths to go up two levels to root
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/auth';
import { useRouter } from 'expo-router';
import { Baby, Calendar, ArrowRight } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';

/**
 * PROJECT CRADLE: BIOMETRIC INITIALIZATION
 * Purpose: Securely initialize baby data into the Obsidian Core.
 */
export default function Onboarding() {
  const { user, refreshProfile } = useAuth();
  const router = useRouter();
  
  const [babyName, setBabyName] = useState('');
  const [babyDob, setBabyDob] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCompleteOnboarding = async () => {
    if (!babyName.trim() || !babyDob.trim()) {
      return Alert.alert("Required", "Please provide baby's name and birth date.");
    }

    setLoading(true);
    try {
      // Logic synchronized with your successful SQL run
      const { error } = await supabase
        .from('profiles')
        .update({
          baby_name: babyName.trim(),
          baby_dob: babyDob.trim(),
          is_onboarded: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);

      if (error) throw error;

      await refreshProfile();
      router.replace('/(app)');
    } catch (error: any) {
      // Fixed: Suppressed PGRST spelling warning for the console
      const msg = error.message || "An internal error occurred.";
      Alert.alert("Initialization Failed", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInDown.duration(800)} style={styles.glassBox}>
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Baby size={32} color="#4FD1C7" />
          </View>
          <Text style={styles.title}>Initialize Profile</Text>
          <Text style={styles.subtitle}>Enter biometric data to sync with the family core.</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Baby size={20} color="#94A3B8" />
            <TextInput 
              placeholder="Baby's Name" 
              placeholderTextColor="#475569" 
              style={styles.input}
              value={babyName}
              onChangeText={setBabyName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Calendar size={20} color="#94A3B8" />
            <TextInput 
              placeholder="Birth Date (YYYY-MM-DD)" 
              placeholderTextColor="#475569" 
              style={styles.input}
              value={babyDob}
              onChangeText={setBabyDob}
            />
          </View>
        </View>

        <TouchableOpacity 
          onPress={handleCompleteOnboarding} 
          disabled={loading}
          style={styles.submitBtn}
        >
          {loading ? (
            <ActivityIndicator color="#020617" />
          ) : (
            <View style={styles.btnContent}>
              <Text style={styles.submitText}>START TRACKING</Text>
              <ArrowRight size={20} color="#020617" style={{ marginLeft: 12 }} />
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617', justifyContent: 'center', padding: 24 },
  glassBox: { backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 32, padding: 32, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  header: { alignItems: 'center', marginBottom: 40 },
  iconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(79, 209, 199, 0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  title: { color: '#FFF', fontSize: 32, fontWeight: '900', letterSpacing: -1 },
  subtitle: { color: '#94A3B8', textAlign: 'center', marginTop: 8, lineHeight: 22 },
  form: { gap: 16 },
  inputGroup: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, height: 64, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  input: { color: '#FFF', flex: 1, marginLeft: 16, fontWeight: '700' },
  submitBtn: { height: 64, borderRadius: 16, backgroundColor: '#4FD1C7', alignItems: 'center', justifyContent: 'center', marginTop: 32 },
  btnContent: { flexDirection: 'row', alignItems: 'center' },
  submitText: { color: '#020617', fontWeight: '900', letterSpacing: 1 }
});