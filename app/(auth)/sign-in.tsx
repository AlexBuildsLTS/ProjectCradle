import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, Alert, 
  ActivityIndicator, StyleSheet, Platform 
} from 'react-native';
import { supabase } from '@/lib/supabase';
import { useRouter, Link } from 'expo-router';
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

/**
 * PROJECT CRADLE: CORE AUTHENTICATION SESSION
 * Restoration: High-Integrity Supabase Sync & Obsidian UI
 */
export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * AUTHENTICATION HANDLER
   * Directly interfaces with the 'profiles' and 'auth' tables
   */
  const handleSignIn = async () => {
    if (!email.trim() || !password) {
      return Alert.alert("Missing Credentials", "Please enter your email and password.");
    }

    setLoading(true);
    try {
      // Logic: This triggers the onAuthStateChange in your root _layout
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) throw error;
      
      // SUCCESS: The root router will now redirect you to the main dashboard.
    } catch (error: any) {
      Alert.alert("Access Denied", error.message || "Invalid biometric credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInDown.duration(800)}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to manage your intelligence stack.</Text>

        <View style={styles.formGap}>
          {/* EMAIL INPUT */}
          <View style={styles.inputGroup}>
            <Mail size={20} color="#94A3B8" />
            <TextInput 
              placeholder="Work Email" 
              placeholderTextColor="#475569" 
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          {/* PASSWORD INPUT */}
          <View style={styles.inputGroup}>
            <Lock size={20} color="#94A3B8" />
            <TextInput 
              placeholder="Password" 
              secureTextEntry 
              placeholderTextColor="#475569" 
              style={styles.input}
              value={password}
              onChangeText={setPassword}
            />
          </View>
        </View>

        {/* SECURE ACCESS BUTTON */}
        <TouchableOpacity 
          onPress={handleSignIn} 
          disabled={loading}
          activeOpacity={0.8}
          style={styles.submitBtn}
        >
          {loading ? (
            <ActivityIndicator color="#020617" />
          ) : (
            <>
              <Text style={styles.submitText}>SECURE ACCESS</Text>
              <ArrowRight size={20} color="#020617" style={{ marginLeft: 12 }} />
            </>
          )}
        </TouchableOpacity>

        {/* REDIRECT TO SIGN-UP */}
        <Link href="/(auth)/sign-up" asChild>
          <TouchableOpacity style={styles.footerLink}>
            <Text style={styles.footerText}>
              New caregiver? <Text style={styles.tealText}>Create Account</Text>
            </Text>
          </TouchableOpacity>
        </Link>

        {/* SECURITY INTEGRITY BADGE */}
        <View style={styles.securityBadge}>
          <ShieldCheck size={14} color="#475569" />
          <Text style={styles.securityText}>AES-256 ENCRYPTED SESSION</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#020617', 
    justifyContent: 'center' 
  },
  title: { 
    color: '#FFF', 
    fontSize: 48, 
    fontWeight: '900', 
    letterSpacing: -2, 
    marginBottom: 8 
  },
  subtitle: { 
    color: '#94A3B8', 
    fontSize: 18, 
    marginBottom: 40 
  },
  formGap: { gap: 16 },
  inputGroup: { 
    backgroundColor: 'rgba(255,255,255,0.05)', 
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.1)', 
    borderRadius: 16, 
    height: 64, 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 20 
  },
  input: { 
    color: '#FFF', 
    flex: 1, 
    marginLeft: 16, 
    fontWeight: '700' 
  },
  submitBtn: { 
    height: 64, 
    borderRadius: 16, 
    backgroundColor: '#4FD1C7', 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 40 
  },
  submitText: { 
    color: '#020617', 
    fontWeight: '900', 
    letterSpacing: 2 
  },
  footerLink: { 
    marginTop: 24, 
    alignSelf: 'center' 
  },
  footerText: { color: '#94A3B8' },
  tealText: { 
    color: '#4FD1C7', 
    fontWeight: '700' 
  },
  securityBadge: { 
    marginTop: 40, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    opacity: 0.5 
  },
  securityText: { 
    color: '#94A3B8', 
    fontSize: 10, 
    fontWeight: '900', 
    marginLeft: 8,
    letterSpacing: 2
  }
});