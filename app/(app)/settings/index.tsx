/**
 * PROJECT CRADLE: SETTINGS MASTER HUB V3.0
 * Path: app/(app)/settings/index.tsx
 * ----------------------------------------------------------------------------
 * FEATURES:
 * 1. PROFESSIONAL ICONOGRAPHY: Re-calibrated Lucide set for biometric context.
 * 2. MODULAR NAV: Synchronized paths for internal settings directory.
 * 3. DESKTOP FIDELITY: Hard-locked 800px column width.
 * 4. UX: Obsidian Glassmorphism with AAA contrast standards.
 */

import { useRouter } from 'expo-router';
import {
  Bell,
  ChevronRight,
  Cpu,
  Fingerprint,
  Lock,
  Music,
  User,
  Users,
} from 'lucide-react-native';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

import { GlassCard } from '@/components/glass/GlassCard';
import { Theme } from '@/lib/shared/Theme';

export default function SettingsScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const SettingItem = ({ icon: Icon, title, sub, onPress }: any) => (
    <TouchableOpacity onPress={onPress} style={styles.item} activeOpacity={0.7}>
      <View style={styles.itemLeft}>
        <View style={styles.iconBox}>
          <Icon size={20} color={Theme.colors.primary} />
        </View>
        <View>
          <Text style={styles.itemTitle}>{title}</Text>
          <Text style={styles.itemSub}>{sub}</Text>
        </View>
      </View>
      <ChevronRight size={18} color="#475569" />
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.container, isDesktop && styles.desktopWidth]}>
        <View style={styles.header}>
          <Cpu size={24} color={Theme.colors.primary} />
          <Text style={styles.headerTitle}>SYSTEM SETTINGS</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>v3.6</Text>
          </View>
        </View>

        {/* SECTION: IDENTITY CORE */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>IDENTITY CORE</Text>
          <GlassCard style={styles.card}>
            <SettingItem
              icon={User}
              title="PROFILE"
              sub="Manage biometric identifier and avatar"
              onPress={() => router.push('/(app)/settings/profile')}
            />
            <View style={styles.divider} />
            <SettingItem
              icon={Users}
              title="FAMILY MANAGEMENT"
              sub="Register subjects or sync caregivers"
              onPress={() => router.push('/(app)/settings/family')}
            />
          </GlassCard>
        </View>

        {/* SECTION: SECURITY PROTOCOLS */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>SECURITY PROTOCOLS</Text>
          <GlassCard style={styles.card}>
            <SettingItem
              icon={Lock}
              title="CHANGE PASSWORD"
              sub="Update master encryption key"
              onPress={() => router.push('/(app)/settings/password')}
            />
            <View style={styles.divider} />
            <SettingItem
              icon={Fingerprint}
              title="TWO-FACTOR AUTH"
              sub="Secure account with biometric passkey"
              onPress={() => router.push('/(app)/settings/mfa')}
            />
          </GlassCard>
        </View>

        {/* SECTION: INTERFACE & AUDIO */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>INTERFACE & AUDIO</Text>
          <GlassCard style={styles.card}>
            <SettingItem
              icon={Music}
              title="SOUNDSCAPES"
              sub="Configure white noise and lullaby defaults"
              onPress={() => router.push('/(app)/settings/sounds')}
            />
            <View style={styles.divider} />
            <SettingItem
              icon={Bell}
              title="NOTIFICATIONS"
              sub="Manage feeding and sleep alerts"
              onPress={() => router.push('/(app)/settings/notifications')}
            />
          </GlassCard>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#020617' },
  scrollContent: { padding: 24, alignItems: 'center', paddingBottom: 100 },
  container: { width: '100%' },
  desktopWidth: { maxWidth: 800 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 40,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -1,
  },
  badge: {
    backgroundColor: 'rgba(79, 209, 199, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(79, 209, 199, 0.2)',
  },
  badgeText: { color: Theme.colors.primary, fontSize: 10, fontWeight: '900' },
  section: { marginBottom: 32, width: '100%' },
  sectionLabel: {
    color: '#475569',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 16,
    marginLeft: 4,
  },
  card: {
    padding: 8,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  itemLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  itemTitle: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  itemSub: { color: '#475569', fontSize: 11, fontWeight: '600', marginTop: 2 },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.03)',
    marginHorizontal: 16,
  },
});
