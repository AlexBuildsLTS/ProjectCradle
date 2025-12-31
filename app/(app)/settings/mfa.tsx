/**
 * PROJECT CRADLE: SECURITY PROTOCOL V1.0 (MFA GATEWAY)
 * Path: app/(app)/settings/mfa.tsx
 * ----------------------------------------------------------------------------
 * FEATURES:
 * 1. BIOMETRIC FOCUS: Visual identity for secondary authentication.
 * 2. INTERNAL NAV: Top-left Chevron gateway return to Settings Hub.
 * 3. DESKTOP FIDELITY: Hard-locked 480px centered architecture.
 * 4. UX: Pro-grade Haptics and non-linear staggered spring entry.
 */

import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import {
  ChevronLeft,
  ChevronRight,
  Fingerprint,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
} from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

import { GlassCard } from '@/components/glass/GlassCard';
import { Theme } from '@/lib/shared/Theme';

export default function MFAGatewayScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const [loading, setLoading] = useState(false);

  // --- 1. CINEMATIC ANIMATIONS ---
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

  const triggerFeedback = (style = Haptics.ImpactFeedbackStyle.Medium) => {
    if (Platform.OS !== 'web') Haptics.impactAsync(style);
  };

  const MFAOption = ({ icon: Icon, title, sub }: any) => (
    <TouchableOpacity
      style={styles.optionItem}
      activeOpacity={0.7}
      onPress={() => triggerFeedback()}
    >
      <View style={styles.optionLeft}>
        <View style={styles.iconBox}>
          <Icon size={20} color={Theme.colors.primary} />
        </View>
        <View>
          <Text style={styles.optionTitle}>{title}</Text>
          <Text style={styles.optionSub}>{sub}</Text>
        </View>
      </View>
      <ChevronRight size={16} color="#475569" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.root}>
      <Animated.View
        style={[
          styles.cardWrapper,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      > 
        <GlassCard style={[styles.container, ...(isDesktop ? [styles.desktopHUD] : [])]}>
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
              <Fingerprint size={16} color={Theme.colors.primary} />
              <Text style={styles.headerTitle}>SECURITY PROTOCOL</Text>
            </View>
          </View>

          <View style={styles.headerDesc}>
            <Text style={styles.subTitle}>Multi-Factor Auth</Text>
            <Text style={styles.infoText}>
              Add an extra layer of biometric encryption to secure your family
              core.
            </Text>
          </View>

          <View style={styles.statusBadge}>
            <ShieldAlert size={14} color="#F87171" />
            <Text style={styles.statusText}>PROTECTION LEVEL: STANDARD</Text>
          </View>

          <View style={styles.optionsStack}>
            <MFAOption
              icon={Smartphone}
              title="AUTHENTICATOR APP"
              sub="Use Google or Microsoft Auth"
            />
            <View style={styles.divider} />
            <MFAOption
              icon={Fingerprint}
              title="BIOMETRIC PASSKEY"
              sub="FaceID or TouchID handshake"
            />
          </View>

          <View style={styles.footer}>
            <ShieldCheck size={12} color="#475569" />
            <Text style={styles.footerText}>
              ENFORCED BY PROJECT CRADLE SECURITY
            </Text>
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

  headerDesc: { alignItems: 'center', marginBottom: 24 },
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
    paddingHorizontal: 10,
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    backgroundColor: 'rgba(248, 113, 113, 0.05)',
    borderRadius: 14,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(248, 113, 113, 0.1)',
  },
  statusText: {
    color: '#F87171',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
  },

  optionsStack: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.01)',
    borderRadius: 24,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  optionLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  optionTitle: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  optionSub: {
    color: '#475569',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },

  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
    marginHorizontal: 12,
  },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 40,
    opacity: 0.5,
  },
  footerText: {
    color: '#475569',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
