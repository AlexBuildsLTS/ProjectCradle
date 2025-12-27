import {
  calculatePasswordStrength,
  checkRequirements,
  getStrengthColor,
} from '@/lib/auth-utils';
import { supabase } from '../api/supabaseClient'; 
import { Link, useRouter } from 'expo-router';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Circle,
  Lock,
  Mail,
  ShieldCheck,
  User,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
  Platform,
} from 'react-native';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';

/**
 * PROJECT CRADLE: ENHANCED HIGH-FIDELITY SIGN-UP
 * Optimized for: Instant login (Confirm Email OFF) and Automatic Baby Initialization.
 */
export default function SignUp() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 1024;

  // Form State
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  // Validation Logic
  const strength = calculatePasswordStrength(password);
  const strengthColor = getStrengthColor(strength);
  const reqs = checkRequirements(password);
  const passwordsMatch = password === confirmPassword && password.length > 0;

  const handleSignUp = async () => {
    if (!agreed) return Alert.alert('Consent Required', 'Please agree to the Terms.');
    if (!passwordsMatch) return Alert.alert('Security Alert', 'Passwords do not match.');
    if (strength < 50) return Alert.alert('Security Threshold', 'Please use a stronger password.');

    setLoading(true);
    try {
      /**
       * STEP 1: AUTH REGISTRATION
       * Since Confirm Email is OFF, Supabase returns a session immediately.
       */
      const { data, error: authError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: { 
            role: 'PRIMARY_PARENT', 
            full_name: firstName.trim() 
          },
        },
      });

      if (authError) throw authError;

      /**
       * STEP 2: INITIALIZE BABY PROFILE
       * Creating a default baby record so the Dashboard isn't empty on first load.
       */
      if (data.user) {
        const { error: babyError } = await supabase.from('babies').insert([{
          parent_id: data.user.id,
          name: `${firstName}'s Baby`,
          dob: new Date().toISOString().split('T')[0], // Default to today
        }]);

        if (babyError) console.error("Initial Baby Setup Error:", babyError.message);

        // STEP 3: MARK ONBOARDED
        await supabase.from('profiles').update({ is_onboarded: true }).eq('id', data.user.id);
        
        // Final Redirection
        router.replace('/(app)');
      }

    } catch (error: any) {
      Alert.alert('Authentication Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.rootContainer}>
      <Animated.View
        entering={FadeInDown.duration(800)}
        layout={Layout.springify()}
        style={[styles.glassBox, isDesktop && styles.desktopWidth]}
      >
        <Link href="/(auth)/sign-in" asChild>
          <TouchableOpacity style={styles.backBtn}>
            <ArrowLeft size={16} color="#4FD1C7" />
            <Text style={styles.backText}>Return to Login</Text>
          </TouchableOpacity>
        </Link>

        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>
          Initialize your family core with encrypted biometric sync.
        </Text>

        <View style={styles.formGap}>
          <View style={styles.inputGroup}>
            <User size={20} color="#94A3B8" />
            <TextInput
              placeholder="Full Name"
              placeholderTextColor="#475569"
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
              editable={!loading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Mail size={20} color="#94A3B8" />
            <TextInput
              placeholder="Email Address"
              placeholderTextColor="#475569"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!loading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Lock size={20} color="#94A3B8" />
            <TextInput
              placeholder="Password"
              secureTextEntry
              placeholderTextColor="#475569"
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              editable={!loading}
            />
          </View>

          {/* STRENGTH HUD */}
          <View style={styles.validatorBox}>
            <View style={styles.strengthTrack}>
              <View
                style={[styles.strengthFill, { width: `${strength}%`, backgroundColor: strengthColor }]}
              />
            </View>
            <View style={styles.reqRow}>
              <Check size={12} color={reqs.length ? '#4FD1C7' : '#475569'} />
              <Text style={[styles.reqText, reqs.length && styles.reqDone]}>8+ Characters</Text>
              <Check size={12} color={reqs.symbol ? '#4FD1C7' : '#475569'} style={{ marginLeft: 16 }} />
              <Text style={[styles.reqText, reqs.symbol && styles.reqDone]}>Special Symbol</Text>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <ShieldCheck size={20} color="#94A3B8" />
            <TextInput
              placeholder="Confirm Password"
              secureTextEntry
              placeholderTextColor="#475569"
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              editable={!loading}
            />
          </View>
        </View>

        <TouchableOpacity onPress={() => setAgreed(!agreed)} style={styles.consentRow} disabled={loading}>
          {agreed ? <CheckCircle2 size={22} color="#4FD1C7" /> : <Circle size={22} color="#475569" />}
          <Text style={styles.consentText}>
            I agree to the <Text style={styles.tealText}>Terms & Privacy Policy</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSignUp}
          disabled={loading}
          style={[styles.submitBtn, { backgroundColor: agreed ? '#4FD1C7' : '#1E293B' }]}
        >
          {loading ? (
            <ActivityIndicator color="#020617" />
          ) : (
            <View style={styles.btnContent}>
              <Text style={[styles.submitText, { color: agreed ? '#020617' : '#475569' }]}>
                CREATE ACCOUNT
              </Text>
              <ArrowRight size={20} color={agreed ? '#020617' : '#475569'} style={{ marginLeft: 12 }} />
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.securityBadge}>
          <ShieldCheck size={14} color="#475569" />
          <Text style={styles.securityText}>AES-256 ENCRYPTED PROFILE</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: { flex: 1, backgroundColor: '#020617', justifyContent: 'center', alignItems: 'center', padding: 20 },
  glassBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 32,
    padding: 40,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    width: '100%',
    maxWidth: 500,
  },
  desktopWidth: { maxWidth: 450 },
  backBtn: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, gap: 8 },
  backText: { color: '#4FD1C7', fontWeight: '900', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase' },
  title: { color: '#FFF', fontSize: 42, fontWeight: '900', letterSpacing: -2, marginBottom: 8 },
  subtitle: { color: '#94A3B8', fontSize: 16, marginBottom: 32, lineHeight: 24 },
  formGap: { gap: 16 },
  inputGroup: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  input: { color: '#FFF', flex: 1, marginLeft: 16, fontWeight: '700', fontSize: 16 },
  validatorBox: { marginTop: 4, gap: 12 },
  strengthTrack: { height: 4, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' },
  strengthFill: { height: '100%' },
  reqRow: { flexDirection: 'row', alignItems: 'center' },
  reqText: { color: '#475569', fontSize: 11, fontWeight: '800', marginLeft: 6 },
  reqDone: { color: '#4FD1C7' },
  consentRow: { flexDirection: 'row', alignItems: 'center', marginTop: 24, gap: 12 },
  consentText: { color: '#94A3B8', fontSize: 13, fontWeight: '600' },
  tealText: { color: '#4FD1C7', fontWeight: '800' },
  submitBtn: { height: 64, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginTop: 32 },
  btnContent: { flexDirection: 'row', alignItems: 'center' },
  submitText: { fontWeight: '900', letterSpacing: 2, fontSize: 14 },
  securityBadge: { marginTop: 32, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', opacity: 0.4 },
  securityText: { color: '#94A3B8', fontSize: 10, fontWeight: '900', marginLeft: 8, letterSpacing: 2 },
});