/**
 * PROJECT CRADLE: OPTIMIZED OBSIDIAN SIDEBAR V4.0
 * Path: components/navigation/Sidebar.tsx
 * FIXES: Added Sleep Command to Monitoring Core for full feature access.
 */

import { Link, usePathname } from 'expo-router';
import {
  Activity,
  Baby,
  FileText,
  LayoutDashboard,
  Milk,
  Moon,
  Settings,
  Sparkles,
} from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInLeft } from 'react-native-reanimated';

const NAV_ITEMS = [
  { name: 'Dashboard Hub', icon: LayoutDashboard, href: '/(app)' },
  { name: 'Feeding Logs', icon: Milk, href: '/(app)/feeding' },
  { name: 'Sleep Command', icon: Moon, href: '/(app)/sleep' }, // FIXED: Added Sleep Link
  { name: 'Growth Core', icon: Activity, href: '/(app)/growth' },
  { name: 'Biometric Journal', icon: FileText, href: '/(app)/journal' },
  { name: 'System Settings', icon: Settings, href: '/(app)/settings' },
];

export const Sidebar = ({ className }: { className?: string }) => {
  const pathname = usePathname();

  return (
    <Animated.View
      entering={FadeInLeft.duration(400)}
      style={styles.sidebarRoot}
    >
      <View style={styles.brandContainer}>
        <View style={styles.logoBox}>
          <Baby color="#020617" size={24} />
        </View>
        <Text style={styles.brandTitle}>Cradle</Text>
      </View>

      <View style={styles.navStack}>
        <Text style={styles.sectionLabel}>Monitoring Core</Text>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href as any} asChild>
              <TouchableOpacity
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

      <View style={styles.aiCard}>
        <View style={styles.aiHeader}>
          <Sparkles size={16} color="#4FD1C7" />
          <Text style={styles.aiLabel}>AI OPTIMIZING</Text>
        </View>
        <Text style={styles.aiDesc}>
          Berry AI is currently analyzing sleep trends.
        </Text>
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
  logoBox: { backgroundColor: '#4FD1C7', padding: 10, borderRadius: 16 },
  brandTitle: {
    marginLeft: 16,
    fontSize: 24,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: -1.5,
  },
  navStack: { flex: 1, gap: 8 },
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
    position: 'relative',
  },
  navItemActive: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
  },
  navText: {
    marginLeft: 16,
    fontWeight: '700',
    fontSize: 15,
    color: '#64748B',
  },
  navTextActive: { color: '#FFF' },
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
  aiHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  aiLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#4FD1C7',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginLeft: 8,
  },
  aiDesc: { color: '#FFF', fontSize: 13, fontWeight: '600', lineHeight: 20 },
});
