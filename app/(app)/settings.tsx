/**
 * PROJECT CRADLE: SETTINGS MASTER HUB V2.6
 * FIX: Resolved TS2345 by standardizing internal paths.
 * ADDED: Security and Interface modules.
 */

import { GlassCard } from '@/components/glass/GlassCard';
import { Theme } from '@/lib/shared/Theme';
import { useRouter } from 'expo-router';
import {
  Bell,
  ChevronRight,
  Lock,
  Shield,
  User,
  Users,
  Volume2,
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

export default function SettingsScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const SettingItem = ({ icon: Icon, title, sub, onPress }: any) => (
    <TouchableOpacity onPress={onPress} style={styles.item}>
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
    >
      <View style={[styles.container, isDesktop && styles.desktopWidth]}>
        <Text style={styles.headerTitle}>SYSTEM SETTINGS</Text>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>IDENTITY CORE</Text>
          <GlassCard style={styles.card}>
            <SettingItem
              icon={User}
              title="IDENTITY PROFILE"
              sub="Manage biometric identifier and avatar"
              onPress={() => router.push('/(app)/profile')}
            />
            <View style={styles.divider} />
            <SettingItem
              icon={Users}
              title="FAMILY MANAGEMENT"
              sub="Register babies or sync caregivers"
              onPress={() => router.push('/(app)/family')}
            />
          </GlassCard>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>SECURITY PROTOCOLS</Text>
          <GlassCard style={styles.card}>
            <SettingItem
              icon={Lock}
              title="CHANGE PASSWORD"
              sub="Update master encryption key"
            />
            <View style={styles.divider} />
            <SettingItem
              icon={Shield}
              title="TWO-FACTOR AUTH"
              sub="Secure account with biometric passkey"
            />
          </GlassCard>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>INTERFACE & AUDIO</Text>
          <GlassCard style={styles.card}>
            <SettingItem
              icon={Volume2}
              title="SOUNDSCAPES"
              sub="Configure white noise and lullaby defaults"
            />
            <View style={styles.divider} />
            <SettingItem
              icon={Bell}
              title="NOTIFICATIONS"
              sub="Manage feeding and sleep alerts"
            />
          </GlassCard>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#020617' },
  scrollContent: { padding: 24, alignItems: 'center' },
  container: { width: '100%' },
  desktopWidth: { maxWidth: 800 }, // Prevents stretching to infinity
  headerTitle: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 40,
    letterSpacing: -1,
  },
  section: { marginBottom: 32, width: '100%' },
  sectionLabel: {
    color: '#475569',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 16,
    marginLeft: 4,
  },
  card: { padding: 8, borderRadius: 24 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  itemLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(79, 209, 199, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTitle: { color: '#FFF', fontSize: 14, fontWeight: '800' },
  itemSub: { color: '#475569', fontSize: 11, fontWeight: '600', marginTop: 2 },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.03)',
    marginHorizontal: 16,
  },
});
