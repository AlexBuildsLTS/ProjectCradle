import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { ArrowRight, Lock, Mail, ShieldCheck } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAuth } from '@/context/auth'; // FIXED: Using global auth context

/**
 * PROJECT CRADLE: SIGN-IN
 * Layout preserved: Obsidian (#020617) + Teal (#4FD1C7) + Glassmorphism
 */
export default function SignIn() {
  const router = useRouter();
  const { login } = useAuth(); // FIXED: Pulling login method from context
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email.trim() || !password) {
      return Alert.alert('Missing Credentials', 'Please enter your email and password.');
    }

    setLoading(true);
    try {
      // FIXED: Calling context login which handles session and routing
      await login(email, password);
      
      // Note: AuthProvider's useEffect listener handles the router.replace logic
    } catch (error: any) {
      const errorMsg = error.status === 400 
        ? "Invalid credentials or email not confirmed." 
        : error.message;
      
      Alert.alert('Access Denied', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInDown.duration(800)} style={styles.glassBox}>
        <View style={styles.headerSection}>
          <Text style={styles.title}>Sign In</Text>
          <Text style={styles.subtitle}>
            Welcome back. Secure biometric synchronization for your family core.
          </Text>
        </View>

        <View style={styles.formGap}>
          {/* EMAIL HUD */}
          <View style={styles.inputGroup}>
            <Mail size={18} color="#94A3B8" />
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

          {/* PASSWORD HUD */}
          <View style={styles.inputGroup}>
            <Lock size={18} color="#94A3B8" />
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
        </View>

        {/* SECURE ACTION */}
        <TouchableOpacity
          onPress={handleSignIn}
          disabled={loading}
          style={[styles.submitBtn, loading && { opacity: 0.7 }]}
        >
          {loading ? (
            <ActivityIndicator color="#020617" />
          ) : (
            <View style={styles.btnContent}>
              <Text style={styles.submitText}>SIGN IN</Text>
              <ArrowRight size={20} color="#020617" style={{ marginLeft: 12 }} />
            </View>
          )}
        </TouchableOpacity>

        <Link href="/(auth)/sign-up" asChild>
          <TouchableOpacity style={styles.footerLink}>
            <Text style={styles.footerText}>
              Need an account? <Text style={styles.tealText}>Create Account</Text>
            </Text>
          </TouchableOpacity>
        </Link>

        <View style={styles.securityBadge}>
          <ShieldCheck size={14} color="#475569" />
          <Text style={styles.securityText}>AES-256 ENCRYPTED SESSION</Text>
        </View>
      </Animated.View>
    </View>
  );
}

// STYLES PRESERVED EXACTLY AS REQUESTED
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617', justifyContent: 'center', padding: 24 },
  glassBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 32,
    padding: 40,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerSection: { marginBottom: 40 },
  title: { color: '#FFF', fontSize: 48, fontWeight: '900', letterSpacing: -2, marginBottom: 8 },
  subtitle: { color: '#94A3B8', fontSize: 18, lineHeight: 26 },
  formGap: { gap: 16 },
  inputGroup: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  input: { color: '#FFF', flex: 1, marginLeft: 16, fontWeight: '700', fontSize: 16 },
  submitBtn: {
    height: 64,
    borderRadius: 16,
    backgroundColor: '#4FD1C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
  },
  btnContent: { flexDirection: 'row', alignItems: 'center' },
  submitText: { color: '#020617', fontWeight: '900', letterSpacing: 2, fontSize: 16 },
  footerLink: { marginTop: 24, alignSelf: 'center' },
  footerText: { color: '#94A3B8', fontSize: 14 },
  tealText: { color: '#4FD1C7', fontWeight: '800' },
  securityBadge: { marginTop: 40, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', opacity: 0.5 },
  securityText: { color: '#475569', fontSize: 10, fontWeight: '900', marginLeft: 8, letterSpacing: 2 },
});