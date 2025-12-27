/**
 * PROJECT CRADLE: PRO UPGRADE MODAL V1.0
 * Path: components/monetization/ProUpgradeModal.tsx
 * THEME: PROJECT CRADLE (Teal #4FD1C7 | Obsidian #020617)
 * FEATURES:
 * - High-fidelity glassmorphism UI.
 * - Haptic feedback on interactions.
 * - Clear value proposition for Berry AI features.
 */

import { GlassCard } from '@/components/glass/GlassCard';
import { Theme } from '@/lib/shared/Theme';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import {
  Brain,
  Check,
  Database,
  ShieldCheck,
  Sparkles,
  X,
  Zap,
} from 'lucide-react-native';
import React from 'react';
import {
  Alert,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface ProUpgradeModalProps {
  visible: boolean;
  onClose: () => void;
}

export const ProUpgradeModal = ({ visible, onClose }: ProUpgradeModalProps) => {
  const triggerHaptic = (style: Haptics.ImpactFeedbackStyle) => {
    if (Platform.OS !== 'web') Haptics.impactAsync(style);
  };

  const handleUpgradeAction = async () => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Heavy);
    // TODO: Integrate Stripe/RevenueCat purchase logic here.
    Alert.alert(
      'Initiating Neural Link',
      'Connecting to payment gateway to activate Core Intelligence...',
      [
        {
          text: 'OK',
          onPress: () => triggerHaptic(Haptics.ImpactFeedbackStyle.Medium),
        },
      ],
    );
  };

  const handleClose = () => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        {Platform.OS !== 'web' && (
          <BlurView
            intensity={40}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />
        )}

        <View style={styles.modalContainer}>
          <GlassCard variant="teal" style={styles.cardContent}>
            {/* HEADER */}
            <View style={styles.header}>
              <View style={styles.headerBrand}>
                <Sparkles size={20} color={Theme.colors.secondary} />
                <Text style={styles.headerTitle}>CORE INTELLIGENCE</Text>
              </View>
              <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
                <X size={20} color={Theme.colors.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollBody}
            >
              {/* HERO SECTION */}
              <View style={styles.heroIcon}>
                <Brain size={64} color={Theme.colors.primary} />
              </View>

              <Text style={styles.heroTitle}>UNLOCK NEXT-GEN BIOMETRICS</Text>
              <Text style={styles.heroSub}>
                Activate Berry AI to analyze patterns, predict sleep windows,
                and optimize your family's routine.
              </Text>

              {/* BENEFITS GRID */}
              <View style={styles.benefitsContainer}>
                <BenefitRow
                  icon={Zap}
                  title="Real-time Sleep Prediction"
                  sub="AI-driven nap and bedtime windows."
                />
                <BenefitRow
                  icon={Database}
                  title="Unlimited History"
                  sub="Permanent encrypted data retention."
                />
                <BenefitRow
                  icon={ShieldCheck}
                  title="Priority Encrypted Channel"
                  sub="Tier-1 support and data handling."
                />
              </View>

              {/* PRICING & CTA */}
              <View style={styles.pricingContainer}>
                <View style={styles.priceTag}>
                  <Text style={styles.priceCurrency}>$</Text>
                  <Text style={styles.priceValue}>9.99</Text>
                  <Text style={styles.priceInterval}>/ MONTH</Text>
                </View>
                <View style={styles.guarantee}>
                  <Check size={14} color={Theme.colors.primary} />
                  <Text style={styles.guaranteeText}>
                    Cancel anytime. Secure Stripe checkout.
                  </Text>
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleUpgradeAction}
              style={styles.ctaBtn}
            >
              <Sparkles size={20} color="#020617" />
              <Text style={styles.ctaText}>ACTIVATE PRO STATUS</Text>
            </TouchableOpacity>
          </GlassCard>
        </View>
      </View>
    </Modal>
  );
};

// Helper Component for Benefit Rows
const BenefitRow = ({ icon: Icon, title, sub }: any) => (
  <View style={styles.benefitRow}>
    <View style={styles.benefitIconBox}>
      <Icon size={22} color={Theme.colors.primary} />
    </View>
    <View>
      <Text style={styles.benefitTitle}>{title}</Text>
      <Text style={styles.benefitSub}>{sub}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 23, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: { width: '100%', maxWidth: 500, maxHeight: '90%' },
  cardContent: { padding: 0, overflow: 'hidden', height: '100%' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  headerBrand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerTitle: {
    color: Theme.colors.secondary,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 2,
  },
  closeBtn: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
  },
  scrollBody: { padding: 32 },
  heroIcon: {
    alignSelf: 'center',
    padding: 24,
    backgroundColor: 'rgba(79, 209, 199, 0.05)',
    borderRadius: 32,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(79, 209, 199, 0.1)',
  },
  heroTitle: {
    color: '#FFF',
    fontSize: 26,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: -1,
    marginBottom: 12,
  },
  heroSub: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  benefitsContainer: { gap: 24, marginBottom: 32 },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  benefitIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(79, 209, 199, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(79, 209, 199, 0.1)',
  },
  benefitTitle: { color: '#FFF', fontSize: 15, fontWeight: '800' },
  benefitSub: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  pricingContainer: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'rgba(2, 6, 23, 0.3)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: 24,
  },
  priceTag: { flexDirection: 'row', alignItems: 'flex-start' },
  priceCurrency: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 8,
  },
  priceValue: {
    color: '#FFF',
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: -2,
  },
  priceInterval: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '900',
    alignSelf: 'flex-end',
    marginBottom: 12,
    marginLeft: 6,
    letterSpacing: 1,
  },
  guarantee: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
  },
  guaranteeText: { color: '#94A3B8', fontSize: 11, fontWeight: '700' },
  ctaBtn: {
    margin: 24,
    marginTop: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.colors.primary,
    padding: 20,
    borderRadius: 20,
    gap: 12,
  },
  ctaText: {
    color: '#020617',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
