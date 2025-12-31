/**
 * PROJECT CRADLE: SECURITY PROTOCOL V1.2 (PASSWORD SYNC)
 * Path: app/(app)/settings/password.tsx
 * ----------------------------------------------------------------------------
 * FEATURES:
 * 1. INTERNAL NAV: Top-left Chevron gateway return (Safe-zone padding).
 * 2. RE-AUTH GATEWAY: Verifies identity before authorizing master update.
 * 3. DESKTOP HUD: Hard-locked 480px focused HUD.
 * 4. TS SAFETY: Spread array pattern for conditional styles.
 */

import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import {
  ChevronLeft,
  Eye,
  EyeOff,
  RefreshCw,
  ShieldAlert,
} from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

import { PasswordStrengthIndicator } from '@/components/auth/PasswordStrengthIndicator';
import { GlassCard } from '@/components/glass/GlassCard';
import { useAuth } from '@/context/auth';
import { Theme } from '@/lib/shared/Theme';
import { supabase } from '@/lib/supabase';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const { user } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(fadeAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 40,
        friction: 8,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 40,
        friction: 8,
      }),
    ]).start();
  }, []);

  const triggerFeedback = () => {
    if (process.env.EXPO_PUBLIC_PLATFORM !== 'web')
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      return Alert.alert(
        'REQUIRED',
        'All security identifier fields must be populated.',
      );
    }
    if (newPassword !== confirmPassword) {
      return Alert.alert('MISMATCH', 'New encryption keys do not match.');
    }

    setLoading(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: currentPassword,
      });

      if (signInError)
        throw new Error('Current master key verification failed.');

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (updateError) throw updateError;

      Alert.alert(
        'SYNC COMPLETE',
        'Master encryption key updated successfully.',
      );
      router.back();
    } catch (e: any) {
      Alert.alert('SECURITY ERROR', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <Animated.View
        style={[
          styles.cardWrapper,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <GlassCard
          style={[styles.container, ...(isDesktop ? [styles.desktopHUD] : [])]}
        >
          {/* INTERNAL NAV GATEWAY */}
          <View style={styles.cardHeaderRow}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                triggerFeedback();
                router.back();
              }}
            >
              <ChevronLeft size={24} color="#FFF" strokeWidth={3} />
            </TouchableOpacity>

            <View style={styles.headerTitleGroup}>
              <ShieldAlert size={16} color={Theme.colors.primary} />
              <Text style={styles.headerTitle}>SECURITY PROTOCOL</Text>
            </View>
          </View>

          <View style={styles.headerDesc}>
            <Text style={styles.subTitle}>Update Master Key</Text>
            <Text style={styles.infoText}>
              This will re-encrypt your local biometric vault.
            </Text>
          </View>

          <View style={styles.formStack}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>EXISTING MASTER PASSWORD</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  style={styles.input}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  secureTextEntry={!showPass}
                  placeholder="Verify existing key"
                  placeholderTextColor="#475569"
                />
                <TouchableOpacity
                  onPress={() => setShowPass(!showPass)}
                  style={styles.eyeBtn}
                >
                  {showPass ? (
                    <EyeOff size={18} color="#475569" />
                  ) : (
                    <Eye size={18} color="#475569" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.inputGroup}>
              <Text style={styles.label}>NEW ENCRYPTION KEY</Text>
              <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showPass}
                placeholder="Initialize new key"
                placeholderTextColor="#475569"
              />
              <PasswordStrengthIndicator password={newPassword} />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>CONFIRM NEW KEY</Text>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPass}
                placeholder="Confirm new key"
                placeholderTextColor="#475569"
              />
            </View>

            <TouchableOpacity
              style={[styles.saveBtn, loading && styles.btnDisabled]}
              onPress={handleUpdatePassword}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#020617" />
              ) : (
                <>
                  <Text style={styles.saveText}>SYNC SECURITY UPDATES</Text>
                  <RefreshCw size={18} color="#020617" strokeWidth={3} />
                </>
              )}
            </TouchableOpacity>
          </View>
        </GlassCard>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#020617',
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardWrapper: { width: '100%', alignItems: 'center' },
  container: {
    padding: 44,
    width: '100%',
    borderRadius: 48,
    position: 'relative',
  },
  desktopHUD: { maxWidth: 480 },
  cardHeaderRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: -16,
    top: -16,
    padding: 14,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
  },
  headerTitleGroup: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerTitle: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2.5,
  },
  headerDesc: { alignItems: 'center', marginBottom: 32 },
  subTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  infoText: {
    color: '#475569',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 18,
  },
  formStack: { width: '100%', gap: 18 },
  inputGroup: { width: '100%' },
  label: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 8.5,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 12,
    marginLeft: 4,
  },
  inputWrap: { flexDirection: 'row', alignItems: 'center' },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 20,
    padding: 22,
    color: '#FFF',
    fontWeight: '700',
    fontSize: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  eyeBtn: { position: 'absolute', right: 20 },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginVertical: 8,
  },
  saveBtn: {
    backgroundColor: Theme.colors.primary,
    width: '100%',
    padding: 24,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  btnDisabled: { opacity: 0.5 },
  saveText: {
    color: '#020617',
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 1.5,
  },
});
