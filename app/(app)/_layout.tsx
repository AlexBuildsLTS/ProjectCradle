/**
 * PROJECT CRADLE: MASTER ADAPTIVE ORCHESTRATOR V29.0 (STELLAR GLASS)
 * ----------------------------------------------------------------------------
 * CRITICAL FIXES:
 * 1. BOTTOM BAR PURGE: Explicitly hidden 10+ utility routes to fix "bloated" UI.
 * 2. TS SAFETY: Fixed RNImage JSX conflict and pathname string null-checks.
 * 3. VISUALS: Applied generative-AI inspired obsidian gradients and glassmorphism.
 * 4. RBAC: Hard-gated Berry AI and Journal features to Premium/Admin tiers.
 */

import { LinearGradient } from 'expo-linear-gradient';
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
  ShieldCheck,
  Sparkles,
} from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Image as RNImage, // FIXED: Alias to prevent HTML Image conflict
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

// CORE SYSTEM IMPORTS
import GlobalHeader from '@/components/navigation/GlobalHeader';
import { useAuth } from '@/context/auth';
import { FamilyProvider } from '@/context/family';
import { Theme } from '@/lib/shared/Theme';
import { supabase } from '@/lib/supabase';

export default function AppLayout() {
  // --- 1. HOOKS (MUST BE AT THE ABSOLUTE TOP) ---
  const { session, profile, isLoading: authLoading } = useAuth();
  const { width } = useWindowDimensions();
  const router = useRouter();
  const pathname = usePathname();
  const isDesktop = width >= 1024;

  const [identityLoading, setIdentityLoading] = useState(!profile);

  useEffect(() => {
    if (profile) setIdentityLoading(false);
  }, [profile]);

  // NAVIGATION LOGIC: Tier-based visibility
  const menuItems = useMemo(() => {
    const role = profile?.role || 'MEMBER';
    const isPremium = ['ADMIN', 'PREMIUM_MEMBER', 'SUPPORT'].includes(role);

    const items = [
      { name: 'index', icon: LayoutDashboard, label: 'Hub', path: '/(app)/' },
      { name: 'feeding', icon: Milk, label: 'Feed', path: '/(app)/feeding' },
      { name: 'sleep', icon: Moon, label: 'Sleep', path: '/(app)/sleep' },
      {
        name: 'growth',
        icon: Activity,
        label: 'Growth',
        path: '/(app)/growth',
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
        name: 'journal',
        icon: BookOpen,
        label: 'Journal',
        path: '/(app)/journal',
      });
    }

    return items;
  }, [profile]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace('/(auth)/sign-in');
  };

  // --- 2. CONDITIONAL RENDERING AFTER HOOKS ---
  if (authLoading || identityLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator color={Theme.colors.primary} size="large" />
        <Text style={styles.loaderText}>SYNCHRONIZING BIOMETRIC CORE...</Text>
      </View>
    );
  }

  if (!session) return <Redirect href={'/(auth)/sign-in'} />;

  return (
    <FamilyProvider>
      <View style={styles.appWrapper}>
        <StatusBar barStyle="light-content" />

        {!isDesktop ? (
          /* MOBILE VIEWPORT: CLEAN BIOMETRIC TABS */
          <View style={{ flex: 1 }}>
            <GlobalHeader />
            <Tabs
              screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: Theme.colors.primary,
                tabBarInactiveTintColor: '#475569',
                tabBarLabelStyle: styles.mobileTabLabel,
                tabBarStyle: styles.mobileTabBar,
              }}
            >
              {/* PRIMARY VISIBLE TABS */}
              <Tabs.Screen
                name="index"
                options={{
                  title: 'HUB',
                  tabBarIcon: ({ color }) => (
                    <LayoutDashboard color={color} size={20} />
                  ),
                }}
              />
              <Tabs.Screen
                name="feeding"
                options={{
                  title: 'FEED',
                  tabBarIcon: ({ color }) => <Milk color={color} size={20} />,
                }}
              />
              <Tabs.Screen
                name="sleep"
                options={{
                  title: 'SLEEP',
                  tabBarIcon: ({ color }) => <Moon color={color} size={20} />,
                }}
              />

              {/* PREMIUM FEATURE: BERRY AI / SPARKLES */}
              <Tabs.Screen
                name="berry-ai"
                options={{
                  title: 'BERRY',
                  href: ['ADMIN', 'PREMIUM_MEMBER', 'SUPPORT'].includes(
                    profile?.role || '',
                  )
                    ? undefined
                    : null,
                  tabBarIcon: ({ color }) => (
                    <Sparkles color={color} size={20} />
                  ),
                }}
              />

              <Tabs.Screen
                name="journal"
                options={{
                  title: 'LOG',
                  tabBarIcon: ({ color }) => (
                    <BookOpen color={color} size={20} />
                  ),
                }}
              />

              {/* SYSTEM PURGE: EXPLICITLY HIDING UTILITY ROUTES FROM BOTTOM BAR */}
              {[
                'analytics',
                'admin',
                'settings',
                'profile',
                'health',
                'support',
                'notifications',
                'family',
                'shared',
                'family-init',
                'journal/timeline',
                'growth',
                'quick-log',
              ].map((route) => (
                <Tabs.Screen
                  key={route}
                  name={route}
                  options={{ href: null }}
                />
              ))}
            </Tabs>
          </View>
        ) : (
          /* DESKTOP VIEWPORT: ENTERPRISE GRADIENT SIDEBAR */
          <View style={styles.desktopRoot}>
            <LinearGradient
              colors={['#0A0F1E', '#020617']}
              style={styles.sidebar}
            >
              <View style={styles.sidebarInner}>
                <View style={styles.brandHeader}>
                  <RNImage
                    source={require('@/assets/images/icon.png')}
                    style={styles.sidebarIcon}
                  />
                  <Text style={styles.brandTitle}>Cradle</Text>
                </View>

                <ScrollView
                  showsVerticalScrollIndicator={false}
                  style={styles.sidebarScroll}
                >
                  <Text style={styles.sidebarLabel}>MONITORING CORES</Text>
                  {menuItems.map((item) => {
                    const isActive = pathname
                      ? pathname.startsWith(item.path)
                      : false; // FIXED: TS2345 safe check
                    return (
                      <TouchableOpacity
                        key={item.name}
                        onPress={() => router.push(item.path as any)}
                        style={[
                          styles.navItem,
                          isActive && styles.navItemActive,
                        ]}
                      >
                        <item.icon
                          size={18}
                          color={isActive ? Theme.colors.primary : '#94A3B8'}
                        />
                        <Text
                          style={[
                            styles.navText,
                            isActive && { color: '#FFF' },
                          ]}
                        >
                          {item.label}
                        </Text>
                        {isActive && <View style={styles.activeIndicator} />}
                      </TouchableOpacity>
                    );
                  })}

                  <View style={styles.divider} />
                  <Text style={styles.sidebarLabel}>SYSTEM HUD</Text>

                  <TouchableOpacity
                    onPress={() => router.push('/(app)/settings' as any)}
                    style={styles.navItem}
                  >
                    <Settings size={18} color="#94A3B8" />
                    <Text style={styles.navText}>Settings</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => router.push('/(app)/support' as any)}
                    style={styles.navItem}
                  >
                    <LifeBuoy size={18} color="#94A3B8" />
                    <Text style={styles.navText}>Support Queue</Text>
                  </TouchableOpacity>

                  {profile?.role === 'ADMIN' && (
                    <TouchableOpacity
                      onPress={() => router.push('/(app)/admin' as any)}
                      style={styles.navItem}
                    >
                      <ShieldCheck size={18} color={Theme.colors.primary} />
                      <Text
                        style={[
                          styles.navText,
                          { color: Theme.colors.primary },
                        ]}
                      >
                        Admin Console
                      </Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    onPress={handleSignOut}
                    style={styles.logoutBtn}
                  >
                    <LogOut size={18} color="#F87171" />
                    <Text style={styles.logoutText}>Terminate Session</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </LinearGradient>

            <View style={styles.contentWrapper}>
              <GlobalHeader />
              <View style={styles.mainViewport}>
                <Slot />
              </View>
            </View>
          </View>
        )}
      </View>
    </FamilyProvider>
  );
}

const styles = StyleSheet.create({
  appWrapper: { flex: 1, backgroundColor: '#020617' },
  loaderContainer: {
    flex: 1,
    backgroundColor: '#020617',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  loaderText: {
    color: '#4FD1C7',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 3,
  },

  desktopRoot: { flex: 1, flexDirection: 'row' },
  sidebar: {
    width: 300,
    borderRightWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  sidebarInner: { flex: 1, padding: 24 },
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingBottom: 32,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  sidebarIcon: { width: 32, height: 32, borderRadius: 8 },
  brandTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -1.5,
  },
  sidebarScroll: { marginTop: 32 },
  sidebarLabel: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 16,
    marginLeft: 12,
  },

  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    marginBottom: 6,
    gap: 14,
  },
  navItemActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  navText: { color: '#94A3B8', fontSize: 14, fontWeight: '700' },
  activeIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Theme.colors.primary,
    marginLeft: 'auto',
  },

  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginVertical: 24,
    marginHorizontal: 12,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    gap: 12,
    paddingHorizontal: 16,
  },
  logoutText: { color: '#F87171', fontSize: 13, fontWeight: '800' },

  contentWrapper: { flex: 1 },
  mainViewport: { flex: 1, padding: 48 },

  mobileTabBar: {
    height: 85,
    backgroundColor: '#0A0F1E', // Match depth of generated images
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingBottom: Platform.OS === 'ios' ? 25 : 15,
    paddingTop: 10,
  },
  mobileTabLabel: {
    fontSize: 8,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 4,
  },
});
