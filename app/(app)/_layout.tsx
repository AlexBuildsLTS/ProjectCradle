/**
 * PROJECT CRADLE: RECOVERY LAYOUT V6.0
 * Fixed: Hook Order (Rule of Hooks)
 * Fixed: Console Spam (Strict file-matching)
 */

import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, useWindowDimensions, StyleSheet, ActivityIndicator } from 'react-native';
import { Tabs, Redirect, useRouter, usePathname, Slot } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LayoutDashboard, Milk, Activity, Settings, LifeBuoy, FileText, Bell, LogOut, Sparkles } from 'lucide-react-native';

import { useAuth } from '@/context/auth';
import { supabase } from '@/lib/supabase';
import { Theme } from './shared/Theme';
import GlobalHeader from '@/components/navigation/GlobalHeader';

export default function AppLayout() {
  // --- 1. ALL HOOKS MUST BE AT THE ABSOLUTE TOP ---
  const { session, isLoading } = useAuth();
  const { width } = useWindowDimensions();
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = width < 1024;

  const [profile, setProfile] = useState<any>(null);
  const [identityLoading, setIdentityLoading] = useState(true);

  useEffect(() => {
    async function resolveIdentity() {
      if (!session?.user?.id) {
        setIdentityLoading(false);
        return;
      }
      const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      if (data) setProfile(data);
      setIdentityLoading(false);
    }
    resolveIdentity();
  }, [session?.user?.id]);

  const menuItems = useMemo(() => {
    const role = profile?.role || 'MEMBER';
    // CONSOLE FIX: Only includes routes that EXIST in your file system
    const baseRoutes = [
      { name: 'index', icon: LayoutDashboard, label: 'Hub', path: '/(app)/' },
      { name: 'feeding', icon: Milk, label: 'Feeding', path: '/(app)/feeding' },
      { name: 'growth', icon: Activity, label: 'Growth', path: '/(app)/growth' },
      { name: 'journal', icon: FileText, label: 'Journal', path: '/(app)/journal' },
      { name: 'notifications', icon: Bell, label: 'Alerts', path: '/(app)/notifications' }
    ];
    return baseRoutes;
  }, [profile]);

  // --- 2. CONDITIONAL RETURNS ONLY AFTER ALL HOOKS ---
  if (isLoading || identityLoading) {
    return <View style={styles.loader}><ActivityIndicator color="#4FD1C7" size="large" /></View>;
  }

  if (!session) return <Redirect href={"/(auth)/sign-in" as any} />;

  // --- 3. PLATFORM RENDERING ---
  if (isMobile) {
    return (
      <View style={{ flex: 1, backgroundColor: '#020617' }}>
        <GlobalHeader /> 
        <Tabs screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: '#4FD1C7',
          tabBarInactiveTintColor: '#CBD5E0',
        }}>
          <Tabs.Screen name="index" options={{ title: 'Hub', tabBarIcon: ({ color }) => <LayoutDashboard color={color} size={24} /> }} />
          <Tabs.Screen name="feeding" options={{ title: 'Feed', tabBarIcon: ({ color }) => <Milk color={color} size={24} /> }} />
          <Tabs.Screen name="growth" options={{ title: 'Growth', tabBarIcon: ({ color }) => <Activity color={color} size={24} /> }} />
          <Tabs.Screen name="settings" options={{ title: 'More', tabBarIcon: ({ color }) => <Settings color={color} size={24} /> }} />
        </Tabs>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.desktopRoot}>
      <View style={styles.sidebar}>
         <View style={styles.brand}><Sparkles size={20} color="#4FD1C7" /><Text style={styles.brandTitle}>Cradle</Text></View>
         <ScrollView style={{ flex: 1, padding: 16 }}>
            {menuItems.map(item => (
              <TouchableOpacity key={item.name} onPress={() => router.push(item.path as any)} style={[styles.navItem, pathname === item.path && styles.navActive]}>
                <item.icon size={20} color={pathname === item.path ? '#4FD1C7' : '#94A3B8'} />
                <Text style={[styles.navText, pathname === item.path && { color: '#FFF' }]}>{item.label}</Text>
              </TouchableOpacity>
            ))}
            <View style={styles.divider} />
            <TouchableOpacity onPress={() => router.push('/(app)/support' as any)} style={styles.navItem}>
              <LifeBuoy size={20} color="#94A3B8" /><Text style={styles.navText}>Support</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={async () => { await supabase.auth.signOut(); router.replace("/(auth)/sign-in" as any); }} style={styles.navItem}>
              <LogOut size={20} color="#F87171" /><Text style={[styles.navText, { color: '#F87171' }]}>Sign Out</Text>
            </TouchableOpacity>
         </ScrollView>
      </View>
      <View style={{ flex: 1 }}>
        <GlobalHeader />
        <View style={styles.slotArea}><Slot /></View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, backgroundColor: '#020617', alignItems: 'center', justifyContent: 'center' },
  desktopRoot: { flex: 1, backgroundColor: '#020617', flexDirection: 'row' },
  sidebar: { width: 300, borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.08)', backgroundColor: '#020617' },
  brand: { height: 72, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, gap: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  brandTitle: { color: '#FFF', fontSize: 22, fontWeight: '900' },
  navItem: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 14, marginBottom: 4, gap: 16 },
  navActive: { backgroundColor: 'rgba(79, 209, 199, 0.08)', borderWidth: 1, borderColor: 'rgba(79, 209, 199, 0.15)' },
  navText: { color: '#94A3B8', fontSize: 14, fontWeight: '600' },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginVertical: 20 },
  tabBar: { backgroundColor: '#020617', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)', height: 90, paddingBottom: 25 },
  slotArea: { flex: 1, padding: 32 }
});