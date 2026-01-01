/**
 * PROJECT CRADLE: AUTH MARKETING V5.0 (AAA+ ELITE)
 * Path: app/(auth)/AuthMarketing.tsx
 * ----------------------------------------------------------------------------
 * POLISH LOGIC:
 * 1. TIERED COLORWAY: Neutral (Free), Teal (Plus), Violet (Elite).
 * 2. LAYOUT: Auto-responsive Grid for Web/Desktop and Stack for Mobile.
 * 3. BRANDING: Hard-locked "Cradle North" hero typography.
 * 4. UX: Micro-animations via Reanimated for entrance staggered timing.
 */

import { GlassCard } from '@/components/glass/GlassCard';
import {
  Check,
  Database,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';

export default function AuthMarketing() {
  const { width } = useWindowDimensions();
  const isReallyDesktop = width >= 1024;

  return (
    <View style={styles.container}>
      <Text style={styles.hero}>
        Cradle{'\n'}
        <Text style={{ color: '#4FD1C7' }}>North</Text>
      </Text>

      <View style={isReallyDesktop ? styles.desktopGrid : styles.mobileStack}>
        {/* --- 1. FREE VERSION: CORE ESSENTIALS --- */}
        <TierCard
          icon={Database}
          title="FREE VERSION"
          tag="Core Essentials"
          accent="#94A3B8"
          features={[
            'Complete baby tracking suite',
            'Sleep summaries and history',
            'Multi-child caregiver sync',
            'Feeding & med reminders',
          ]}
          delay={0}
        />

        {/* --- 2. PLUS MEMBERSHIP: INTELLIGENCE --- */}
        <TierCard
          icon={Zap}
          title="PLUS MEMBERSHIP"
          tag="Intelligence"
          accent="#4FD1C7"
          highlight
          popular
          features={[
            'SweetSpot® sleep predictions',
            'Schedule Creator for routines',
            'AI Logging (Voice/Text/Photo)',
            'Enhanced reports & insights',
          ]}
          delay={200}
        />

        {/* --- 3. PREMIUM: FULL SUPPORT --- */}
        <TierCard
          icon={Sparkles}
          title="PREMIUM"
          tag="Full Support"
          accent="#B794F6"
          highlight
          features={[
            'Berry AI: 24/7 Expert Chat',
            'Custom expert-designed plans',
            'Weekly progress check-ins',
            'Ongoing developmental support',
          ]}
          delay={400}
        />
      </View>

      <View style={styles.provenBadge}>
        <ShieldCheck size={14} color="rgba(79, 209, 199, 0.4)" />
        <Text style={styles.provenText}>
          PROJECT CRADLE SECURED SESSION • V5.0 AAA+ QUALITY
        </Text>
      </View>
    </View>
  );
}

const TierCard = ({
  icon: Icon,
  title,
  tag,
  features,
  highlight,
  popular,
  accent,
  delay,
}: any) => (
  <Animated.View
    entering={FadeInRight.delay(delay).duration(1000)}
    style={styles.cardWrapper}
  >
    <GlassCard
      style={[
        styles.card,
        highlight && styles.highlightCard,
        highlight && { borderColor: `${accent}33` },
      ]}
    >
      {popular && (
        <View style={[styles.popularBadge, { backgroundColor: accent }]}>
          <Text style={styles.popularText}>MOST POPULAR</Text>
        </View>
      )}

      <View style={styles.cardHeader}>
        <View style={[styles.iconBox, { backgroundColor: `${accent}15` }]}>
          <Icon size={22} color={accent} />
        </View>
        <View>
          <Text style={[styles.cardTitle, highlight && { color: '#FFF' }]}>
            {title}
          </Text>
          <Text style={[styles.cardTag, { color: accent }]}>{tag}</Text>
        </View>
      </View>

      <View style={styles.featureList}>
        {features.map((f: string, i: number) => (
          <View key={i} style={styles.featureRow}>
            <Check size={14} color={accent} strokeWidth={3} />
            <Text
              style={[styles.featureText, highlight && { color: '#CBD5E1' }]}
            >
              {f}
            </Text>
          </View>
        ))}
      </View>
    </GlassCard>
  </Animated.View>
);

const styles = StyleSheet.create({
  container: { width: '100%', paddingBottom: 20 },
  hero: {
    color: '#FFF',
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: -2,
    marginBottom: 48,
    lineHeight: 44,
  },
  desktopGrid: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  mobileStack: { gap: 16 },
  cardWrapper: { flex: 1 },
  card: {
    padding: 24,
    borderRadius: 32,
    minHeight: 280,
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  highlightCard: { backgroundColor: 'rgba(255, 255, 255, 0.03)' },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 28,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    color: '#94A3B8',
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 1,
  },
  cardTag: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  featureList: { gap: 14 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  featureText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    right: 24,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    zIndex: 10,
  },
  popularText: {
    color: '#020617',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },
  provenBadge: {
    marginTop: 60,
    paddingTop: 32,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.03)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  provenText: {
    color: 'rgba(71, 85, 105, 0.6)',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 2,
  },
});
