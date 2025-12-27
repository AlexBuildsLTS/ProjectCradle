import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useRouter, Link } from 'expo-router';
import { Mail, Lock, ArrowRight, ArrowLeft, CheckCircle2, Circle, ShieldCheck, Check } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp, Layout } from 'react-native-reanimated';
import { calculatePasswordStrength, getStrengthColor, checkRequirements } from '@/lib/auth-utils';

/**
 * PROJECT CRADLE: MISSION-CRITICAL SIGN UP
 * Features: Redesign 3 Animations, Real-Time Validator, Success Redirect
 */
export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  // REAL-TIME VALIDATION LOGIC
  const strength = calculatePasswordStrength(password);
  const strengthColor = getStrengthColor(strength);
  const reqs = checkRequirements(password);
  const passwordsMatch = password === confirmPassword && password.length > 0;

  const handleSignUp = async () => {
    if (!agreed) return Alert.alert("Consent Required", "Please agree to the Terms & Privacy Policy.");
    if (!passwordsMatch) return Alert.alert("Security Alert", "Your passwords do not match.");
    if (strength < 50) return Alert.alert("Weak Security", "Requirement: 8+ characters and a special symbol.");

    setLoading(true);
    try {
      // Using the PRIMARY_PARENT role from your schema
      const { data, error } = await supabase.auth.signUp({ 
        email: email.trim(), 
        password,
        options: {
          data: {
            role: 'PRIMARY_PARENT',
            full_name: 'New Parent'
          }
        }
      });

      if (error) throw error;

      // SUCCESS REDIRECT: Physically forces navigation to stop the "Scam" hanging
      Alert.alert("Registry Created", "Verification email sent. Redirecting to login...");
      router.replace('/(auth)/sign-in'); 

    } catch (error: any) {
      Alert.alert("Authentication Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInDown.duration(800)} layout={Layout.springify()}>
        
        <Link href="/(auth)/sign-in" asChild>
          <TouchableOpacity style={styles.backBtn}>
            <ArrowLeft size={16} color="#4FD1C7" />
            <Text style={styles.backText}>Return to Login</Text>
          </TouchableOpacity>
        </Link>

        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Secure biometric synchronization for your family core.</Text>

        <View style={styles.formGap}>
          {/* EMAIL */}
          <View style={styles.inputGroup}>
            <Mail size={20} color="#94A3B8" />
            <TextInput 
              placeholder="Email Address" placeholderTextColor="#475569" 
              style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" 
            />
          </View>

          {/* PASSWORD */}
          <View style={styles.inputGroup}>
            <Lock size={20} color="#94A3B8" />
            <TextInput 
              placeholder="Choose Password" secureTextEntry placeholderTextColor="#475569" 
              style={styles.input} value={password} onChangeText={setPassword} 
            />
          </View>

          {/* DYNAMIC VALIDATOR */}
          <View style={styles.validatorBox}>
            <View style={styles.reqRow}>
              <Check size={14} color={reqs.length ? '#9AE6B4' : '#475569'} />
              <Text style={[styles.reqText, reqs.length && styles.reqDone]}>8+ Characters</Text>
            </View>
            <View style={styles.reqRow}>
              <Check size={14} color={reqs.symbol ? '#9AE6B4' : '#475569'} />
              <Text style={[styles.reqText, reqs.symbol && styles.reqDone]}>Special Symbol</Text>
            </View>
            <View style={styles.reqRow}>
              <Check size={14} color={passwordsMatch ? '#9AE6B4' : '#475569'} />
              <Text style={[styles.reqText, passwordsMatch && styles.reqDone]}>Passwords Match</Text>
            </View>
          </View>

          {/* COLOR-SHIFTING STRENGTH METER */}
          <View style={styles.strengthTrack}>
            <Animated.View style={[styles.strengthFill, { width: `${strength}%`, backgroundColor: strengthColor }]} layout={Layout.springify()} />
          </View>

          {/* CONFIRM PASSWORD */}
          <View style={styles.inputGroup}>
            <Lock size={20} color="#94A3B8" />
            <TextInput 
              placeholder="Confirm Password" secureTextEntry placeholderTextColor="#475569" 
              style={styles.input} value={confirmPassword} onChangeText={setConfirmPassword} 
            />
          </View>
        </View>

        {/* CONSENT */}
        <TouchableOpacity onPress={() => setAgreed(!agreed)} style={styles.consentRow}>
          {agreed ? <CheckCircle2 size={20} color="#4FD1C7" /> : <Circle size={20} color="#94A3B8" />}
          <Text style={styles.consentText}>I agree to the <Text style={{ color: '#4FD1C7', fontWeight: '700' }}>Terms & Privacy Policy</Text></Text>
        </TouchableOpacity>

        {/* SUBMIT */}
        <TouchableOpacity onPress={handleSignUp} disabled={loading} style={[styles.submitBtn, { backgroundColor: agreed ? '#4FD1C7' : '#1E293B' }]}>
          {loading ? <ActivityIndicator color="#020617" /> : (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[styles.submitText, { color: agreed ? '#020617' : '#475569' }]}>CREATE ACCOUNT</Text>
              <ArrowRight size={20} color={agreed ? '#020617' : '#475569'} style={{ marginLeft: 12 }} />
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.securityBadge}>
          <ShieldCheck size={16} color="#475569" />
          <Text style={styles.securityText}>AES-256 ENCRYPTED PROFILE</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  backBtn: { flexDirection: 'row', alignItems: 'center', marginBottom: 32 },
  backText: { color: '#4FD1C7', marginLeft: 8, fontWeight: '800', textTransform: 'uppercase', fontSize: 12 },
  title: { color: '#FFF', fontSize: 48, fontWeight: '900', letterSpacing: -2, marginBottom: 8 },
  subtitle: { color: '#94A3B8', fontSize: 18, marginBottom: 40, fontWeight: '500' },
  formGap: { gap: 16 },
  inputGroup: { backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 16, height: 64, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 },
  input: { color: '#FFF', flex: 1, marginLeft: 16, fontWeight: '700' },
  validatorBox: { paddingHorizontal: 10, gap: 6, marginTop: -4 },
  reqRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  reqText: { color: '#475569', fontSize: 12, fontWeight: '600' },
  reqDone: { color: '#9AE6B4' },
  strengthTrack: { height: 4, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' },
  strengthFill: { height: '100%' },
  consentRow: { flexDirection: 'row', alignItems: 'center', marginTop: 24, gap: 12 },
  consentText: { color: '#94A3B8', fontSize: 13 },
  submitBtn: { height: 64, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginTop: 40 },
  submitText: { fontWeight: '900', letterSpacing: 2 },
  securityBadge: { marginTop: 40, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', opacity: 0.5 },
  securityText: { color: '#94A3B8', fontSize: 10, fontWeight: '900', marginLeft: 8, letterSpacing: 2 }
});