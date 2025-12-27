/**
 * PROJECT CRADLE: MASTER LAYOUT ORCHESTRATOR (FINAL STELLAR)
 * Combines 14-module navigation, RBAC security, and restored Mobile HUD.
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  View, Text, TouchableOpacity, ScrollView, useWindowDimensions, 
  Image, Platform, StyleSheet, ActivityIndicator, UIManager
} from 'react-native';
import { Tabs, Redirect, useRouter, usePathname, Slot } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  LayoutDashboard, Milk, Moon, Activity, Zap, Settings, Bell,
  ChevronDown, LifeBuoy, ShieldAlert, Users, FileText, ClipboardList,
  Bot, LineChart, GitBranch, ShieldCheck, LogOut, Sparkles
} from 'lucide-react-native';

import { useAuth } from '@/context/auth';
import { supabase } from '@/lib/supabase';
import { Theme } from './shared/Theme';
import GlobalHeader from '@/components/navigation/GlobalHeader';

// ============================================================================
// 1. MASTER 14-MODULE NAVIGATION CONFIGURATION
// ============================================================================
type NavItemKey = 'Hub' | 'Feeding' | 'Sleep' | 'Growth' | 'Medical' | 'CareTeam' | 'Insights' | 'Journal' | 'BerryAI' | 'Admin' | 'Settings' | 'Support' | 'QuickLog' | 'Scenarios';

const NAV_CONFIG: Record<NavItemKey, { name: string, icon: any, path: string, label: string, isAction?: boolean, experimental?: boolean }> = {
  'Hub':         { name: 'index',         icon: LayoutDashboard, path: '/(app)/',             label: 'Hub' },
  'Feeding':     { name: 'feeding',       icon: Milk,            path: '/(app)/feeding',       label: 'Feeding' },
  'QuickLog':    { name: 'log',           icon: Zap,             path: '/(app)/quick-log',     label: 'Quick Log', isAction: true },
  'Sleep':       { name: 'sleep',         icon: Moon,            path: '/(app)/sleep',         label: 'Sleep' },
  'BerryAI':     { name: 'assistant',     icon: Bot,             path: '/(app)/assistant',     label: 'Berry AI' },
  'Growth':      { name: 'growth',        icon: Activity,        path: '/(app)/growth',        label: 'Growth' },
  'Medical':     { name: 'health',        icon: ClipboardList,   path: '/(app)/health',        label: 'Medical' },
  'Insights':    { name: 'insights',      icon: LineChart,       path: '/(app)/insights',      label: 'Insights', experimental: true },
  'Journal':     { name: 'journal',       icon: FileText,        path: '/(app)/journal',       label: 'Journal' },
  'CareTeam':    { name: 'caregivers',    icon: Users,           path: '/(app)/caregivers',    label: 'Care Team' },
  'Scenarios':   { name: 'scenarios',     icon: GitBranch,       path: '/(app)/scenarios',     label: 'Predictor', experimental: true },
  'Admin':       { name: 'admin',         icon: ShieldAlert,     path: '/(app)/admin',         label: 'Admin Console' },
  'Settings':    { name: 'settings',      icon: Settings,        path: '/(app)/settings',      label: 'Settings' },
  'Support':     { name: 'support',       icon: LifeBuoy,        path: '/(app)/support',       label: 'Support Hub' },
};

// ============================================================================
// 2. SHARED UI: IDENTITY HUD
// ============================================================================
const RoleBadge = ({ role }: { role: string }) => {
  const badgeStyles = useMemo(() => {
    switch (role?.toUpperCase()) {
      case 'ADMIN': return { bg: 'rgba(248, 113, 113, 0.15)', text: '#F87171', border: '#F8717140' };
      case 'SUPPORT': return { bg: 'rgba(251, 146, 60, 0.15)', text: '#FB923C', border: '#FB923C40' };
      case 'PREMIUM_MEMBER': return { bg: 'rgba(183, 148, 246, 0.15)', text: '#B794F6', border: '#B794F640' };
      default: return { bg: 'rgba(79, 209, 199, 0.15)', text: '#4FD1C7', border: '#4FD1C740' };
    }
  }, [role]);

  return (
    <View style={[styles_shared.badge, { backgroundColor: badgeStyles.bg, borderColor: badgeStyles.border }]}>
      <Text style={[styles_shared.badgeText, { color: badgeStyles.text }]}>{role?.replace('_', ' ')}</Text>
    </View>
  );
};

// ============================================================================
// 3. MAIN ORCHESTRATOR
// ============================================================================
export default function AppLayout() {
  const { session, isLoading } = useAuth();
  const { width } = useWindowDimensions();
  const isMobile = width < 1024;
  const router = useRouter();
  const pathname = usePathname();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    async function resolveIdentity() {
      if (!session?.user?.id) return;
      const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      if (data) setProfile(data);
    }
    resolveIdentity();
  }, [session?.user?.id]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/(auth)/sign-in" as any);
  };

  if (isLoading) return <View style={styles_shared.loader}><ActivityIndicator color={Theme.colors.primary} size="large" /></View>;
  if (!session) return <Redirect href={"/(auth)/sign-in" as any} />;

  const menuItems = useMemo(() => {
    const role = profile?.role || 'MEMBER';
    const keys: NavItemKey[] = ['Hub', 'Feeding', 'Sleep', 'Growth', 'Medical', 'Journal'];
    if (['ADMIN', 'PREMIUM_MEMBER'].includes(role)) keys.push('Insights', 'Scenarios');
    return keys.map(k => NAV_CONFIG[k]);
  }, [profile?.role]);

  // --- MOBILE ARCHITECTURE ---
  if (isMobile) {
    return (
      <View style={{ flex: 1, backgroundColor: Theme.colors.background }}>
        <GlobalHeader /> 
        <Tabs screenOptions={{
          headerShown: false,
          tabBarStyle: styles_mobile.tabBar,
          tabBarActiveTintColor: Theme.colors.primary,
        }}>
          {['Hub', 'Feeding', 'QuickLog', 'Sleep', 'Settings'].map(k => (
            <Tabs.Screen 
              key={k} 
              name={NAV_CONFIG[k as NavItemKey].name} 
              options={{ 
                title: NAV_CONFIG[k as NavItemKey].isAction ? '' : NAV_CONFIG[k as NavItemKey].label,
                tabBarIcon: ({ color }) => NAV_CONFIG[k as NavItemKey].isAction ? (
                  <View style={styles_mobile.actionBtn}><Zap color={Theme.colors.background} size={28} fill={Theme.colors.background} /></View>
                ) : React.createElement(NAV_CONFIG[k as NavItemKey].icon, { color, size: 24 })
              }} 
            />
          ))}
        </Tabs>
      </View>
    );
  }

  // --- DESKTOP ARCHITECTURE ---
  return (
    <SafeAreaView style={styles_desktop.root}>
      <View style={styles_desktop.sidebar}>
         <View style={styles_desktop.brand}><Sparkles size={20} color={Theme.colors.primary} /><Text style={styles_desktop.brandTitle}>Cradle</Text></View>
         <ScrollView style={{ flex: 1, padding: 16 }}>
            {menuItems.map(item => (
              <TouchableOpacity key={item.name} onPress={() => router.push(item.path as any)} style={[styles_desktop.navItem, pathname === item.path && { backgroundColor: 'rgba(79, 209, 199, 0.1)' }]}>
                <item.icon size={20} color={pathname === item.path ? Theme.colors.primary : Theme.colors.textMuted} />
                <Text style={[styles_desktop.navText, pathname === item.path && { color: '#FFF' }]}>{item.label}</Text>
              </TouchableOpacity>
            ))}
            <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginVertical: 20 }} />
            <TouchableOpacity onPress={handleLogout} style={styles_desktop.navItem}>
              <LogOut size={20} color="#F87171" /><Text style={[styles_desktop.navText, { color: '#F87171' }]}>Logout</Text>
            </TouchableOpacity>
         </ScrollView>
      </View>
      <View style={{ flex: 1 }}>
        <GlobalHeader />
        <View style={styles_desktop.slotArea}><Slot /></View>
      </View>
    </SafeAreaView>
  );
}

const styles_shared = StyleSheet.create({
  loader: { flex: 1, backgroundColor: '#020617', alignItems: 'center', justifyContent: 'center' },
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8, borderWidth: 1, alignSelf: 'flex-start' },
  badgeText: { fontSize: 9, fontWeight: '900', textTransform: 'uppercase' },
});

const styles_mobile = StyleSheet.create({
  tabBar: { backgroundColor: '#020617', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)', height: 90, paddingBottom: 25 },
  actionBtn: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#4FD1C7', alignItems: 'center', justifyContent: 'center', marginTop: -35, elevation: 8 },
});

const styles_desktop = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#020617', flexDirection: 'row' },
  sidebar: { width: 300, borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.08)' },
  brand: { height: 72, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, gap: 12 },
  brandTitle: { color: '#FFF', fontSize: 22, fontWeight: '900' },
  navItem: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 14, marginBottom: 6, gap: 16 },
  navText: { color: '#94A3B8', fontSize: 15, fontWeight: '600' },
  slotArea: { flex: 1, padding: 40 }
});