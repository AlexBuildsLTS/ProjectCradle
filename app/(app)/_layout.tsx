/**
 * PROJECT CRADLE: MASTER ADAPTIVE ARCHITECTURE V12.3
 * Path: app/(app)/_layout.tsx
 * THEME: PROJECT CRADLE (Teal #4FD1C7 | Obsidian #020617)
 * * FEATURES:
 * 1. ADMIN GATE: Strict RBAC navigation—Admin tab ONLY appears for ADMIN role.
 * 2. ICON FIX: Explicitly assigns ShieldAlert icon for the Admin tab.
 * 3. ADAPTIVE UI: Glassmorphism Tabs (Mobile) vs. Enterprise Sidebar (Desktop).
 * 4. STABILITY: Fail-safe identity engine prevents infinite loading on web.
 */

import { BlurView } from 'expo-blur';
import { Redirect, Slot, Tabs, usePathname, useRouter } from 'expo-router';
import {
  Activity,
  Baby,
  Bell,
  FileText,
  LayoutDashboard,
  LogOut,
  Milk,
  Settings,
  ShieldAlert,
  Sparkles,
} from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

import { BerryAssistant } from '@/components/ai/BerryAssistant';
import GlobalHeader from '@/components/navigation/GlobalHeader';
import { useAuth } from '@/context/auth';
import { Theme } from '@/lib/shared/Theme';
import { supabase } from '@/lib/supabase';
import { NotificationService } from '@/services/NotificationService';

export default function AppLayout() {
  const { session, isLoading: authLoading } = useAuth();
  const { width } = useWindowDimensions();
  const router = useRouter();
  const pathname = usePathname();

  const isDesktop = width >= 1024;
  const [profile, setProfile] = useState<any>(null);
  const [identityLoading, setIdentityLoading] = useState(true);

  // --- 1. IDENTITY ENGINE: RESOLVES ROLES FOR RBAC GATING ---
  useEffect(() => {
    let isMounted = true;
    async function resolveIdentity() {
      if (!session?.user?.id) {
        if (isMounted) setIdentityLoading(false);
        return;
      }
      try {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        if (isMounted && data) setProfile(data);
      } catch (err) {
        console.error('[Cradle Master] Identity Sync Error:', err);
      } finally {
        if (isMounted) setIdentityLoading(false);
      }
    }

    resolveIdentity();

    // FAIL-SAFE: Prevents infinite loading loops on web sync hangs
    const timeout = setTimeout(() => {
      if (isMounted && identityLoading) setIdentityLoading(false);
    }, 2000);

    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, [session?.user?.id]);

  useEffect(() => {
    if (session?.user?.id && Platform.OS !== 'web') {
      NotificationService.registerForPushNotifications(session.user.id);
    }
  }, [session?.user?.id]);

  // --- 2. DYNAMIC RBAC NAVIGATION MEMO ---
  const menuItems = useMemo(() => {
    const role = profile?.role || 'MEMBER';
    const isPremium = ['ADMIN', 'PREMIUM_MEMBER'].includes(role);
    const isAdmin = role === 'ADMIN';

    const baseRoutes = [
      { name: 'index', icon: LayoutDashboard, label: 'Hub', path: '/(app)/' },
      { name: 'feeding', icon: Milk, label: 'Feeding', path: '/(app)/feeding' },
      {
        name: 'growth',
        icon: Activity,
        label: 'Growth',
        path: '/(app)/growth',
      },
      {
        name: 'journal',
        icon: FileText,
        label: 'Journal',
        path: '/(app)/journal',
      },
    ];

    if (isPremium) {
      baseRoutes.push({
        name: 'notifications',
        icon: Bell,
        label: 'Alerts',
        path: '/(app)/notifications',
      });
    }

    // ADMIN-ONLY NAVIGATION ITEM
    if (isAdmin) {
      baseRoutes.push({
        name: 'admin',
        icon: ShieldAlert,
        label: 'Console',
        path: '/(app)/admin',
      });
    }

    return baseRoutes;
  }, [profile]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace('/(auth)/sign-in' as any);
  };

  if (authLoading || identityLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator color={Theme.colors.primary} size="large" />
        <Text style={styles.loaderText}>SYNCHRONIZING CORE...</Text>
      </View>
    );
  }

  if (!session) return <Redirect href={'/(auth)/sign-in' as any} />;

  // --- 3. MOBILE INTERFACE (GLASS TABS) ---
  if (!isDesktop) {
    return (
      <View style={{ flex: 1, backgroundColor: '#020617' }}>
        <GlobalHeader />

        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: Theme.colors.primary,
            tabBarInactiveTintColor: '#475569',
            tabBarLabelStyle: styles.mobileLabelStyle,
            tabBarStyle: styles.mobileTabBar,
            tabBarBackground: () =>
              Platform.OS !== 'web' ? (
                <BlurView
                  intensity={30}
                  tint="dark"
                  style={StyleSheet.absoluteFill}
                />
              ) : (
                <View
                  style={[
                    StyleSheet.absoluteFill,
                    { backgroundColor: 'rgba(2, 6, 23, 0.95)' },
                  ]}
                />
              ),
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Hub',
              tabBarIcon: ({ color }) => (
                <LayoutDashboard color={color} size={22} />
              ),
            }}
          />
          <Tabs.Screen
            name="feeding"
            options={{
              title: 'Feed',
              tabBarIcon: ({ color }) => <Milk color={color} size={22} />,
            }}
          />
          <Tabs.Screen
            name="growth"
            options={{
              title: 'Growth',
              tabBarIcon: ({ color }) => <Activity color={color} size={22} />,
            }}
          />
          <Tabs.Screen
            name="journal"
            options={{
              title: 'Journal',
              tabBarIcon: ({ color }) => <FileText color={color} size={22} />,
            }}
          />

          {/* SECURE ADMIN TAB: RENDERS ONLY FOR AUTHENTICATED ADMINS */}
          <Tabs.Screen
            name="admin"
            options={{
              title: 'Admin',
              href: profile?.role === 'ADMIN' ? '/(app)/admin' : null, // Strict null if not admin
              tabBarIcon: ({ color }) => (
                <ShieldAlert color={color} size={22} />
              ),
            }}
          />

          <Tabs.Screen
            name="settings"
            options={{
              title: 'Settings',
              tabBarIcon: ({ color }) => <Settings color={color} size={22} />,
            }}
          />

          <Tabs.Screen name="shared" options={{ href: null }} />
          <Tabs.Screen name="notifications" options={{ href: null }} />
          <Tabs.Screen name="support" options={{ href: null }} />
          <Tabs.Screen name="health" options={{ href: null }} />
        </Tabs>

        <BerryAssistant />
      </View>
    );
  }

  // --- 4. DESKTOP INTERFACE (ENTERPRISE SIDEBAR) ---
  return (
    <View style={styles.desktopRoot}>
      <View style={styles.sidebar}>
        <View style={styles.brandHeader}>
          <View style={styles.brandIconWrapper}>
            <Baby color="#020617" size={20} />
          </View>
          <Text style={styles.brandTitle}>Cradle</Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          style={{ flex: 1, padding: 16 }}
        >
          <Text style={styles.sidebarSectionLabel}>MONITORING</Text>

          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.path);
            return (
              <TouchableOpacity
                key={item.name}
                onPress={() => router.push(item.path as any)}
                style={[
                  styles.sidebarNavItem,
                  isActive && styles.sidebarNavActive,
                ]}
              >
                <item.icon
                  size={18}
                  color={isActive ? Theme.colors.primary : '#94A3B8'}
                />
                <Text
                  style={[styles.sidebarNavText, isActive && { color: '#FFF' }]}
                >
                  {item.label}
                </Text>
                {isActive && <View style={styles.activeIndicator} />}
              </TouchableOpacity>
            );
          })}

          <View style={styles.sidebarDivider} />
          <Text style={styles.sidebarSectionLabel}>SYSTEM CORE</Text>

          <TouchableOpacity
            onPress={() => router.push('/(app)/settings' as any)}
            style={[
              styles.sidebarNavItem,
              pathname.includes('settings') && styles.sidebarNavActive,
            ]}
          >
            <Settings
              size={18}
              color={
                pathname.includes('settings') ? Theme.colors.primary : '#94A3B8'
              }
            />
            <Text style={styles.sidebarNavText}>Account Settings</Text>
          </TouchableOpacity>

          <View style={styles.proBadgeCard}>
            <View style={styles.proBadgeHeader}>
              <Sparkles
                size={14}
                color={
                  profile?.role === 'ADMIN'
                    ? Theme.colors.primary
                    : Theme.colors.secondary
                }
              />
              <Text
                style={[
                  styles.proBadgeLabel,
                  profile?.role === 'ADMIN' && { color: Theme.colors.primary },
                ]}
              >
                {profile?.role === 'ADMIN'
                  ? 'SYSTEM ADMIN'
                  : profile?.role === 'PREMIUM_MEMBER'
                  ? 'PRO ACTIVE'
                  : 'UPGRADE CORE'}
              </Text>
            </View>
            <Text style={styles.proBadgeDesc}>
              {profile?.role === 'ADMIN'
                ? 'Core management modules unlocked.'
                : 'Intelligence is analyzing biometric trends.'}
            </Text>
          </View>

          <View style={styles.sidebarDivider} />

          <TouchableOpacity
            onPress={handleSignOut}
            style={[styles.sidebarNavItem, { marginTop: 10 }]}
          >
            <LogOut size={18} color="#F87171" />
            <Text style={[styles.sidebarNavText, { color: '#F87171' }]}>
              Terminate Session
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <View style={{ flex: 1 }}>
        <GlobalHeader />
        <View style={styles.mainViewport}>
          <Slot />
        </View>
      </View>

      <BerryAssistant />
    </View>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    backgroundColor: '#020617',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  loaderText: {
    color: '#4FD1C7',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  mobileTabBar: {
    backgroundColor: 'transparent',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    height: 90,
    paddingBottom: Platform.OS === 'ios' ? 30 : 15,
  },
  mobileLabelStyle: { fontSize: 10, fontWeight: '800', marginTop: 4 },
  desktopRoot: { flex: 1, backgroundColor: '#020617', flexDirection: 'row' },
  sidebar: {
    width: 300,
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.05)',
    backgroundColor: '#020617',
  },
  brandHeader: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  brandIconWrapper: {
    backgroundColor: '#4FD1C7',
    padding: 8,
    borderRadius: 12,
  },
  brandTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -1.5,
  },
  sidebarSectionLabel: {
    color: 'rgba(148, 163, 184, 0.2)',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.8,
    marginVertical: 14,
    marginLeft: 12,
  },
  sidebarNavItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    marginBottom: 6,
    gap: 16,
    position: 'relative',
  },
  sidebarNavActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  sidebarNavText: { color: '#94A3B8', fontSize: 14, fontWeight: '700' },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    width: 4,
    height: 18,
    backgroundColor: '#4FD1C7',
    borderRadius: 2,
  },
  sidebarDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginVertical: 24,
  },
  mainViewport: { flex: 1, padding: 48 },
  proBadgeCard: {
    marginTop: 32,
    padding: 20,
    backgroundColor: 'rgba(79, 209, 199, 0.05)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(79, 209, 199, 0.1)',
  },
  proBadgeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  proBadgeLabel: {
    color: '#4FD1C7',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  proBadgeDesc: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18,
  },
});
