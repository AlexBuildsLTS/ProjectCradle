/**
 * PROJECT CRADLE: OPTIMIZED OBSIDIAN SIDEBAR V3.1
 * Path: components/navigation/Sidebar.tsx
 * THEME: PROJECT CRADLE (Teal #4FD1C7 | Obsidian #020617)
 * * MODULES:
 * 1. CLEAN NAVIGATION: Removed redundant 'Identity Profile'.
 * 2. ROUTE SYNCHRONIZATION: Precision active state indicators for biometric logs.
 * 3. HIGH-FIDELITY GLASSMORTHISM: Enhanced contrast for melatonin-safe monitoring.
 * 4. BERRY AI STATUS: Real-time analysis card for sleep optimization.
 */

import * as Haptics from 'expo-haptics';
import { Link, usePathname } from 'expo-router';
import {
  Activity,
  Baby,
  FileText,
  LayoutDashboard,
  Milk,
  Settings,
  Sparkles,
} from 'lucide-react-native';
import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInLeft } from 'react-native-reanimated';

/**
 * NAV_ITEMS: Purged of redundant links to centralize UX in the Dropdown.
 */
const NAV_ITEMS = [
  { name: 'Dashboard Hub', icon: LayoutDashboard, href: '/(app)' },
  { name: 'Feeding Logs', icon: Milk, href: '/(app)/feeding' },
  { name: 'Growth Core', icon: Activity, href: '/(app)/growth' },
  { name: 'Biometric Journal', icon: FileText, href: '/(app)/journal' },
  { name: 'System Settings', icon: Settings, href: '/(app)/settings' },
];

export const Sidebar = ({ className }: { className?: string }) => {
  const pathname = usePathname();

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  return (
    <Animated.View
      entering={FadeInLeft.duration(400)}
      style={styles.sidebarRoot}
    >
      {/* MODULE: BRAND HEADER */}
      <View style={styles.brandContainer}>
        <View style={styles.logoBox}>
          <Baby color="#020617" size={24} />
        </View>
        <Text style={styles.brandTitle}>Cradle</Text>
      </View>

      {/* MODULE: NAVIGATION STACK */}
      <View style={styles.navStack}>
        <Text style={styles.sectionLabel}>Monitoring Core</Text>

        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href as any} asChild>
              <TouchableOpacity
                onPress={handlePress}
                activeOpacity={0.7}
                style={[styles.navItem, isActive && styles.navItemActive]}
              >
                <item.icon size={20} color={isActive ? '#4FD1C7' : '#94A3B8'} />
                <Text
                  style={[styles.navText, isActive && styles.navTextActive]}
                >
                  {item.name}
                </Text>
                {isActive && <View style={styles.activeIndicator} />}
              </TouchableOpacity>
            </Link>
          );
        })}
      </View>

      {/* MODULE: BERRY AI STATUS CARD */}
      <View style={styles.aiCard}>
        <View style={styles.aiHeader}>
          <Sparkles size={16} color="#4FD1C7" />
          <Text style={styles.aiLabel}>AI OPTIMIZING</Text>
        </View>
        <Text style={styles.aiDesc}>
          Berry AI is currently analyzing biometric sleep trends.
        </Text>
        <TouchableOpacity style={styles.aiBtn} activeOpacity={0.8}>
          <Text style={styles.aiBtnText}>VIEW INSIGHTS</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  sidebarRoot: {
    flex: 1,
    backgroundColor: '#020617',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.05)',
    padding: 32,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 48,
    paddingHorizontal: 8,
  },
  logoBox: {
    backgroundColor: '#4FD1C7',
    padding: 10,
    borderRadius: 16,
    shadowColor: '#4FD1C7',
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  brandTitle: {
    marginLeft: 16,
    fontSize: 24,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: -1.5,
  },
  navStack: {
    flex: 1,
    gap: 8,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 16,
    marginLeft: 8,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'transparent',
    position: 'relative',
  },
  navItemActive: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderColor: 'rgba(255,255,255,0.1)',
  },
  navText: {
    marginLeft: 16,
    fontWeight: '700',
    fontSize: 15,
    color: '#64748B',
  },
  navTextActive: {
    color: '#FFF',
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    width: 3,
    height: 20,
    backgroundColor: '#4FD1C7',
    borderRadius: 2,
  },
  aiCard: {
    marginTop: 'auto',
    padding: 24,
    backgroundColor: 'rgba(79, 209, 199, 0.05)',
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(79, 209, 199, 0.1)',
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  aiLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#4FD1C7',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginLeft: 8,
  },
  aiDesc: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 20,
  },
  aiBtn: {
    marginTop: 16,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(79, 209, 199, 0.1)',
    borderRadius: 12,
  },
  aiBtnText: {
    color: '#4FD1C7',
    fontWeight: '900',
    fontSize: 10,
    letterSpacing: 1,
  },
});
