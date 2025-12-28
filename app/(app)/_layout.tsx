/**
 * PROJECT CRADLE: MASTER ADAPTIVE ARCHITECTURE V24.0 (AAA+ FINAL)
 * Path: app/(app)/_layout.tsx
 * FIXES:
 * 1. BERRY RESTORATION: Restored AI Chat as a primary mobile tab named "Berry" with the Sparkles icon.
 * 2. BIOMETRIC CORE: Maintained Hub, Feed, Sleep, Health, and Journal.
 * 3. NO-SETTINGS BAR: Purged settings/notifications from bottom navigation as requested.
 * 4. PREMIUM GATE: Maintains strict role-based visibility for AI and Insights.
 */

import { Redirect, Slot, Tabs, usePathname, useRouter } from 'expo-router';
import {
  Activity,
  BarChart2,
  BookOpen,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Milk,
  Moon,
  Settings,
  ShieldAlert,
  Sparkles,
} from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

// PROJECT IMPORTS
import GlobalHeader from '@/components/navigation/GlobalHeader';
import { useAuth } from '@/context/auth';
import { FamilyProvider } from '@/context/family';
import { Theme } from '@/lib/shared/Theme';
import { supabase } from '@/lib/supabase';

export default function AppLayout() {
  const { session, isLoading: authLoading } = useAuth();
  const { width } = useWindowDimensions();
  const router = useRouter();
  const pathname = usePathname();

  const isDesktop = width >= 1024;
  const [profile, setProfile] = useState<any>(null);
  const [identityLoading, setIdentityLoading] = useState(true);

  // MODULE: IDENTITY ENGINE
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
    const timeout = setTimeout(() => {
      if (isMounted && identityLoading) setIdentityLoading(false);
    }, 2500);
    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, [session?.user?.id]);

  // MODULE: NAVIGATION LOGIC (RBAC Gated)
  const menuItems = useMemo(() => {
    const role = profile?.role || 'MEMBER';
    const isPremium = ['ADMIN', 'PREMIUM_MEMBER', 'SUPPORT'].includes(role);
    const isAdmin = role === 'ADMIN';

    const items = [
      { name: 'index', icon: LayoutDashboard, label: 'Hub', path: '/(app)/' },
      { name: 'feeding', icon: Milk, label: 'Feed', path: '/(app)/feeding' },
      { name: 'sleep', icon: Moon, label: 'Sleep', path: '/(app)/sleep' },
      {
        name: 'health',
        icon: Activity,
        label: 'Health',
        path: '/(app)/health',
      },
      {
        name: 'journal',
        icon: BookOpen,
        label: 'Journal',
        path: '/(app)/journal',
      },
    ];

    if (isPremium) {
      items.push({
        name: 'analytics',
        icon: BarChart2,
        label: 'Insights',
        path: '/(app)/analytics',
      });
      items.push({
        name: 'berry-ai',
        icon: Sparkles,
        label: 'Berry AI',
        path: '/(app)/berry-ai',
      });
    }

    if (isAdmin) {
      items.push({
        name: 'admin',
        icon: ShieldAlert,
        label: 'Console',
        path: '/(app)/admin',
      });
    }
    return items;
  }, [profile]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace('/(auth)/sign-in');
  };

  if (authLoading || identityLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator color={Theme.colors.primary} size="large" />
        <Text style={styles.loaderText}>SYNCHRONIZING CORE...</Text>
      </View>
    );
  }

  if (!session) return <Redirect href={'/(auth)/sign-in'} />;

  return (
    <FamilyProvider>
      {!isDesktop ? (
        /* MOBILE VIEWPORT (HIGH-DENSITY BIOMETRIC TABS) */
        <View style={{ flex: 1, backgroundColor: '#020617' }}>
          <GlobalHeader />
          <Tabs
            screenOptions={{
              headerShown: false,
              tabBarActiveTintColor: Theme.colors.primary,
              tabBarInactiveTintColor: '#475569',
              tabBarLabelStyle: {
                fontSize: 8,
                fontWeight: '900',
                marginTop: 2,
              },
              tabBarStyle: {
                height: 80,
                backgroundColor: '#020617',
                borderTopWidth: 1,
                borderColor: 'rgba(255,255,255,0.05)',
                paddingBottom: 15,
              },
            }}
          >
            <Tabs.Screen
              name="index"
              options={{
                title: 'Hub',
                tabBarIcon: ({ color }) => (
                  <LayoutDashboard color={color} size={20} />
                ),
              }}
            />
            <Tabs.Screen
              name="feeding"
              options={{
                title: 'Feed',
                tabBarIcon: ({ color }) => <Milk color={color} size={20} />,
              }}
            />
            <Tabs.Screen
              name="sleep"
              options={{
                title: 'Sleep',
                tabBarIcon: ({ color }) => <Moon color={color} size={20} />,
              }}
            />
            <Tabs.Screen
              name="health"
              options={{
                title: 'Health',
                tabBarIcon: ({ color }) => <Activity color={color} size={20} />,
              }}
            />

            {/* BERRY AI RESTORATION */}
            <Tabs.Screen
              name="berry-ai"
              options={{
                title: 'Berry',
                href: ['ADMIN', 'PREMIUM_MEMBER'].includes(profile?.role)
                  ? undefined
                  : null,
                tabBarIcon: ({ color }) => <Sparkles color={color} size={20} />,
              }}
            />

            <Tabs.Screen
              name="journal"
              options={{
                title: 'Journal',
                tabBarIcon: ({ color }) => <BookOpen color={color} size={20} />,
              }}
            />

            {/* HIDDEN SYSTEM UTILITIES */}
            <Tabs.Screen name="analytics" options={{ href: null }} />
            <Tabs.Screen name="admin" options={{ href: null }} />
            <Tabs.Screen name="settings" options={{ href: null }} />
            <Tabs.Screen name="profile" options={{ href: null }} />
            <Tabs.Screen name="growth" options={{ href: null }} />
            <Tabs.Screen name="support" options={{ href: null }} />
            <Tabs.Screen name="notifications" options={{ href: null }} />
            <Tabs.Screen name="family" options={{ href: null }} />
            <Tabs.Screen name="family-init" options={{ href: null }} />
            <Tabs.Screen name="journal/timeline" options={{ href: null }} />
            <Tabs.Screen name="shared" options={{ href: null }} />
          </Tabs>
        </View>
      ) : (
        /* DESKTOP VIEWPORT (ENTERPRISE SIDEBAR) */
        <View style={styles.desktopRoot}>
          <View style={styles.sidebar}>
            <View style={styles.brandHeader}>
              <Sparkles color="#4FD1C7" size={24} />
              <Text style={styles.brandTitle}>Cradle</Text>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ flex: 1, padding: 16 }}
            >
              <Text style={styles.sidebarLabel}>MONITORING</Text>
              {menuItems.map((item) => {
                const isActive = pathname.startsWith(item.path);
                return (
                  <TouchableOpacity
                    key={item.name}
                    onPress={() => router.push(item.path as any)}
                    style={[
                      styles.sidebarNavItem,
                      isActive && styles.sidebarActive,
                    ]}
                  >
                    <item.icon
                      size={18}
                      color={isActive ? Theme.colors.primary : '#94A3B8'}
                    />
                    <Text
                      style={[
                        styles.sidebarNavText,
                        isActive && { color: '#FFF' },
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}

              <View style={styles.divider} />
              <Text style={styles.sidebarLabel}>SYSTEM CORE</Text>
              <TouchableOpacity
                onPress={() => router.push('/(app)/settings' as any)}
                style={styles.sidebarNavItem}
              >
                <Settings size={18} color="#94A3B8" />
                <Text style={styles.sidebarNavText}>Settings</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push('/(app)/support' as any)}
                style={styles.sidebarNavItem}
              >
                <LifeBuoy size={18} color="#94A3B8" />
                <Text style={styles.sidebarNavText}>Support Hub</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSignOut}
                style={[styles.sidebarNavItem, { marginTop: 20 }]}
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
        </View>
      )}
    </FamilyProvider>
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
  },
  desktopRoot: { flex: 1, backgroundColor: '#020617', flexDirection: 'row' },
  sidebar: {
    width: 280,
    borderRightWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    backgroundColor: '#020617',
  },
  brandHeader: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 12,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  brandTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -1,
  },
  sidebarLabel: {
    color: 'rgba(148, 163, 184, 0.2)',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 2,
    marginVertical: 14,
    marginLeft: 12,
  },
  sidebarNavItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    marginBottom: 4,
    gap: 14,
  },
  sidebarActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  sidebarNavText: { color: '#94A3B8', fontSize: 14, fontWeight: '700' },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginVertical: 24,
  },
  mainViewport: { flex: 1, padding: 48 },
});
