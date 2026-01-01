/**
 * PROJECT CRADLE: MASTER ORCHESTRATOR V39.0 (SOVEREIGN ACCESS)
 * Path: app/(app)/_layout.tsx
 * ----------------------------------------------------------------------------
 * MODULE OVERVIEW:
 * 1. IDENTITY HANDSHAKE: Verifies user session and profile role (Member/Plus/Premium/Staff).
 * 2. TIERED RESTRICTION: Dynamic feature gating based on biometric access levels.
 * 3. JOURNAL RE-ROUTE: Mapped 'Log' to new folder-index (journal/index).
 * 4. SYSTEM PURGE: Hard-hides nested settings and non-tab routes from Mobile UI.
 * 5. DESKTOP SIDEBAR: Implements role-aware obsidian navigation for monitors.
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
  ShieldAlert,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Image as RNImage,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

import GlobalHeader from '@/components/navigation/GlobalHeader';
import { useAuth } from '@/context/auth';
import { FamilyProvider } from '@/context/family';
import { Theme } from '@/lib/shared/Theme';
import { supabase } from '@/lib/supabase';

export default function AppLayout() {
  const { session, profile, isLoading: authLoading } = useAuth();
  const { width } = useWindowDimensions();
  const router = useRouter();
  const pathname = usePathname();
  const isDesktop = width >= 1024;

  const [identityLoading, setIdentityLoading] = useState(!profile);

  useEffect(() => {
    if (profile) setIdentityLoading(false);
  }, [profile]);

  /**
   * SOVEREIGN ROLE ENGINE: Defines feature access by tier.
   * Member: Basic Tracking
   * Plus: Sleep Intelligence (Zap)
   * Premium/Staff: AI & Journal Intelligence (Sparkles/BookOpen)
   */
  const userRole = profile?.role || 'MEMBER';
  const hasPlusAccess = [
    'PLUS_MEMBER',
    'PREMIUM_MEMBER',
    'ADMIN',
    'SUPPORT',
  ].includes(userRole);
  const hasPremiumAccess = ['PREMIUM_MEMBER', 'ADMIN', 'SUPPORT'].includes(
    userRole,
  );

  // NAVIGATION LOGIC: Desktop Sidebar & Role Gating
  const menuItems = useMemo(() => {
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

    if (hasPlusAccess) {
      items.push({
        name: 'analytics',
        icon: BarChart2,
        label: 'Insights',
        path: '/(app)/analytics',
      });
    }

    if (hasPremiumAccess) {
      items.push({
        name: 'journal',
        icon: BookOpen,
        label: 'Journal',
        path: '/(app)/journal',
      });
      items.push({
        name: 'berry-ai',
        icon: Sparkles,
        label: 'Berry AI',
        path: '/(app)/berry-ai',
      });
    }
    return items;
  }, [userRole]);

  // SESSION TERMINATION: Hard reset to auth landing
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.replace('/(auth)/sign-in');
    } catch (err) {
      console.error('[Orchestrator] Termination Failure:', err);
    }
  };

  if (authLoading || (session && identityLoading)) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator color={Theme.colors.primary} size="large" />
        <Text style={styles.loaderText}>SYNCHRONIZING BIO-CORE...</Text>
      </View>
    );
  }

  if (!session) return <Redirect href={'/(auth)/sign-in'} />;

  return (
    <FamilyProvider>
      <View style={styles.appWrapper}>
        <StatusBar barStyle="light-content" />

        {!isDesktop ? (
          /* --- MOBILE VIEWPORT: CLEAN BIOMETRIC TABS --- */
          <View style={{ flex: 1 }}>
            <GlobalHeader />
            <Tabs
              screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: Theme.colors.primary,
                tabBarInactiveTintColor: '#475569',
                tabBarStyle: styles.mobileTabBar,
                tabBarLabelStyle: styles.mobileTabLabel,
              }}
            >
              <Tabs.Screen
                name="index"
                options={{
                  title: 'HUB',
                  tabBarIcon: ({ color }) => (
                    <LayoutDashboard color={color} size={22} />
                  ),
                }}
              />
              <Tabs.Screen
                name="feeding"
                options={{
                  title: 'FEED',
                  tabBarIcon: ({ color }) => <Milk color={color} size={22} />,
                }}
              />
              <Tabs.Screen
                name="sleep"
                options={{
                  title: 'SLEEP',
                  tabBarIcon: ({ color }) => <Moon color={color} size={22} />,
                }}
              />

              {/* Quick Log Action Center */}
              <Tabs.Screen
                name="quick-log"
                options={{
                  title: '',
                  tabBarIcon: () => (
                    <View style={styles.zapHero}>
                      <Zap color="#020617" size={26} fill="#020617" />
                    </View>
                  ),
                }}
              />

              <Tabs.Screen
                name="growth"
                options={{
                  title: 'GROWTH',
                  tabBarIcon: ({ color }) => (
                    <Activity color={color} size={22} />
                  ),
                }}
              />

              {/* Conditional Tab: Journal (Premium/Staff Only) */}
              <Tabs.Screen
                name="journal/index"
                options={{
                  title: 'LOG',
                  href: hasPremiumAccess ? undefined : null,
                  tabBarIcon: ({ color }) => (
                    <BookOpen color={color} size={22} />
                  ),
                }}
              />

              {/* Conditional Tab: Berry AI (Premium/Staff Only) */}
              <Tabs.Screen
                name="berry-ai"
                options={{
                  title: 'BERRY',
                  href: hasPremiumAccess ? undefined : null,
                  tabBarIcon: ({ color }) => (
                    <Sparkles color={color} size={22} />
                  ),
                }}
              />

              {/* SYSTEM PURGE: Hide nested engine routes from tab navigation */}
              {[
                'analytics',
                'admin',
                'support',
                'settings/index',
                'settings/family',
                'settings/profile',
                'settings/mfa',
                'settings/notifications',
                'settings/password',
                'settings/sounds',
                'family',
                'profile',
                'health',
                'shared',
                'family-init',
                'journal/timeline',
                'journal',
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
          /* --- DESKTOP VIEWPORT: OBSIDIAN SIDEBAR --- */
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
                  <View>
                    <Text style={styles.brandTitle}>Cradle</Text>
                    <Text style={styles.brandSub}>NORTH V39.0</Text>
                  </View>
                </View>

                <ScrollView
                  showsVerticalScrollIndicator={false}
                  style={styles.sidebarScroll}
                >
                  {/* Role Badge Section (New) */}
                  <View style={styles.badgeSection}>
                    <RoleBadge role={userRole} />
                  </View>

                  <Text style={styles.sidebarLabel}>MONITORING CORES</Text>
                  {menuItems.map((item) => {
                    const isActive = pathname
                      ? pathname.startsWith(item.path)
                      : false;
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

                  <SidebarAction
                    icon={Settings}
                    label="Settings"
                    onPress={() => router.push('/(app)/settings')}
                  />
                  <SidebarAction
                    icon={LifeBuoy}
                    label="Support Center"
                    onPress={() => router.push('/(app)/support')}
                  />

                  {userRole === 'ADMIN' && (
                    <SidebarAction
                      icon={ShieldAlert}
                      label="Admin Console"
                      onPress={() => router.push('/(app)/admin')}
                      color={Theme.colors.primary}
                    />
                  )}

                  <TouchableOpacity
                    onPress={handleSignOut}
                    style={styles.logoutBtn}
                  >
                    <LogOut size={16} color="#F87171" />
                    <Text style={styles.logoutText}>TERMINATE SESSION</Text>
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

/**
 * IDENTITY COMPONENTS
 */

const RoleBadge = ({ role }: { role: string }) => {
  const config: any = {
    ADMIN: {
      bg: 'rgba(79, 209, 199, 0.1)',
      text: '#4FD1C7',
      label: 'SOVEREIGN ADMIN',
    },
    SUPPORT: {
      bg: 'rgba(183, 148, 246, 0.1)',
      text: '#B794F6',
      label: 'SUPPORT',
    },
    PREMIUM_MEMBER: {
      bg: 'rgba(255, 215, 0, 0.1)',
      text: '#FFD700',
      label: 'PREMIUM',
    },
    PLUS_MEMBER: {
      bg: 'rgba(79, 209, 199, 0.05)',
      text: '#4FD1C7',
      label: 'PLUS',
    },
    MEMBER: { bg: 'rgba(148, 163, 184, 0.1)', text: '#94A3B8', label: 'BASIC' },
  };
  const active = config[role] || config['MEMBER'];
  return (
    <View style={[styles.badgeBase, { backgroundColor: active.bg }]}>
      <Users size={10} color={active.text} />
      <Text style={[styles.badgeText, { color: active.text }]}>
        {active.label}
      </Text>
    </View>
  );
};

const SidebarAction = ({
  icon: Icon,
  label,
  onPress,
  color = '#94A3B8',
}: any) => (
  <TouchableOpacity onPress={onPress} style={styles.navItem}>
    <Icon size={18} color={color} />
    <Text style={[styles.navText, { color }]}>{label}</Text>
  </TouchableOpacity>
);

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
    letterSpacing: 4,
  },
  desktopRoot: { flex: 1, flexDirection: 'row' },
  sidebar: {
    width: 280,
    borderRightWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  sidebarInner: { flex: 1, padding: 24 },
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 32,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  sidebarIcon: { width: 34, height: 34, borderRadius: 10 },
  brandTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -1.5,
  },
  brandSub: {
    color: Theme.colors.primary,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },
  sidebarScroll: { marginTop: 32 },
  badgeSection: { marginBottom: 32, paddingLeft: 12 },
  badgeBase: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  badgeText: { fontSize: 8, fontWeight: '900', letterSpacing: 1 },
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
    backgroundColor: 'rgba(79, 209, 199, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(79, 209, 199, 0.1)',
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
  logoutText: {
    color: '#F87171',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  contentWrapper: { flex: 1 },
  mainViewport: { flex: 1 },
  mobileTabBar: {
    height: 85,
    backgroundColor: '#0A0F1E',
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingBottom: Platform.OS === 'ios' ? 25 : 15,
    paddingTop: 10,
  },
  mobileTabLabel: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginTop: 4,
  },
  zapHero: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: Theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -35,
    shadowColor: Theme.colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
});
