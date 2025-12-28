/**
 * PROJECT CRADLE: AUTH MARKETING MASTER V4.0
 * Path: app/(auth)/AuthMarketing.tsx
 * FEATURES:
 * - High-fidelity tiered architecture (Free, Plus, Premium).
 * - Plain-English feature sets derived from core business logic.
 * - Integrated SweetSpot® and Berry AI branding.
 */
import { GlassCard } from '@/components/glass/GlassCard';
import { Check, Database, Sparkles, Zap } from 'lucide-react-native';
import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';

export default function AuthMarketing({ isDesktop }: { isDesktop: boolean }) {
  const { width } = useWindowDimensions();
  const isReallyDesktop = Platform.OS === 'web' && width >= 1024;

  return (
    <View style={styles.container}>
      <Text style={styles.hero}>
        Complete Baby Sleep{'\n'}
        <Text style={{ color: '#4FD1C7' }}>& Parenting Solution.</Text>
      </Text>

      <View style={isReallyDesktop ? styles.desktopGrid : styles.mobileStack}>
        {/* --- 1. FREE VERSION: CORE ESSENTIALS --- */}
        <TierCard
          icon={Database}
          title="FREE VERSION"
          tag="Core Essentials"
          features={[
            'Complete baby tracking suite',
            'Sleep summaries and history',
            'Multi-child caregiver sync',
            'Feeding & med reminders',
          ]}
          delay={0}
        />

        {/* --- 2. PLUS MEMBERSHIP: SLEEP INTELLIGENCE --- */}
        <TierCard
          icon={Zap}
          title="PLUS MEMBERSHIP"
          tag="Intelligence"
          features={[
            'SweetSpot® sleep predictions',
            'Schedule Creator for routines',
            'AI Logging (Voice/Text/Photo)',
            'Enhanced reports & insights',
          ]}
          highlight
          delay={200}
        />

        {/* --- 3. PREMIUM MEMBERSHIP: FULL SUPPORT --- */}
        <TierCard
          icon={Sparkles}
          title="PREMIUM ELITE"
          tag="Full Support"
          features={[
            'Berry AI: 24/7 Expert Chat',
            'Custom expert-designed plans',
            'Weekly progress check-ins',
            'Ongoing developmental support',
          ]}
          highlight
          delay={400}
        />
      </View>

      <View style={styles.provenBadge}>
        <Text style={styles.provenText}>
          🏆 93% OF FAMILIES REPORT IMPROVED SLEEP PATTERNS
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
  delay,
}: any) => (
  <Animated.View
    entering={FadeInRight.delay(delay).duration(800)}
    style={styles.cardWrapper}
  >
    <GlassCard
      style={StyleSheet.flatten([
        styles.card,
        highlight && styles.highlightCard,
      ])}
    >
      <View style={styles.cardHeader}>
        <View
          style={StyleSheet.flatten([
            styles.iconBox,
            highlight && { backgroundColor: 'rgba(79, 209, 199, 0.1)' },
          ])}
        >
          <Icon size={20} color={highlight ? '#4FD1C7' : '#94A3B8'} />
        </View>
        <View>
          <Text style={[styles.cardTitle, highlight && { color: '#FFF' }]}>
            {title}
          </Text>
          <Text style={[styles.cardTag, highlight && { color: '#4FD1C7' }]}>
            {tag}
          </Text>
        </View>
      </View>

      <View style={styles.featureList}>
        {features.map((f: string, i: number) => (
          <View key={i} style={styles.featureRow}>
            <Check size={12} color={highlight ? '#4FD1C7' : '#475569'} />
            <Text
              style={[styles.featureText, highlight && { color: '#E2E8F0' }]}
            >
              {f}
            </Text>
          </View>
        ))}
      </View>

      {highlight && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularText}>MOST POPULAR</Text>
        </View>
      )}
    </GlassCard>
  </Animated.View>
);

const styles = StyleSheet.create({
  container: { width: '100%' },
  hero: {
    color: '#FFF',
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: -1.5,
    marginBottom: 48,
  },
  desktopGrid: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'space-between',
  },
  mobileStack: { gap: 16 },
  cardWrapper: { flex: 1 },
  card: {
    padding: 24,
    borderRadius: 28,
    minHeight: 260,
    justifyContent: 'flex-start',
  },
  highlightCard: {
    borderColor: 'rgba(79, 209, 199, 0.2)',
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 24,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    color: '#94A3B8',
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 1.2,
  },
  cardTag: {
    color: '#475569',
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginTop: 2,
  },
  featureList: {
    gap: 12,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: 20,
    backgroundColor: '#4FD1C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  popularText: {
    color: '#020617',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },
  provenBadge: {
    marginTop: 40,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
  },
  provenText: {
    color: '#475569',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
