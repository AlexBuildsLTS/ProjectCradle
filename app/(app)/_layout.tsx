/**
 * PROJECT CRADLE: MASTER ORCHESTRATOR V32.0 (STELLAR GLASS)
 * ----------------------------------------------------------------------------
 * CRITICAL FIXES:
 * 1. RECURSION CRASH: SQL definer bypass resolved loop.
 * 2. TS SAFETY: RNImage aliased for JSX; pathname null-checks active.
 * 3. UX: Strictly purged 10+ utility routes from mobile tab bar.
 * 4. DESIGN: Obsidian-to-Deep-Navy gradients with Frosted Glass overlays.
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

// CORE PROJECT IMPORTS
import GlobalHeader from '@/components/navigation/GlobalHeader';
import { useAuth } from '@/context/auth';
import { FamilyProvider } from '@/context/family';
import { Theme } from '@/lib/shared/Theme';
import { supabase } from '@/lib/supabase';

export default function AppLayout() {
  // --- 1. ALL HOOKS MUST BE AT THE ABSOLUTE TOP ---
  const { session, profile, isLoading: authLoading } = useAuth();
  const { width } = useWindowDimensions();
  const router = useRouter();
  const pathname = usePathname();
  const isDesktop = width >= 1024;

  const [identityLoading, setIdentityLoading] = useState(!profile);

  useEffect(() => {
    if (profile) setIdentityLoading(false);
  }, [profile]);

  // NAVIGATION LOGIC: Dynamic tier-gating
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

  // --- 2. CONDITIONAL RETURNS ONLY AFTER HOOKS ---
  if (authLoading || (session && identityLoading)) {
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
          /* MOBILE VIEWPORT: HIGH-FIDELITY BIOMETRIC HUD */
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

              {/* THE "ZAP" HERO BUTTON: BIOMETRIC QUICK ACTION */}
              <Tabs.Screen
                name="quick-log"
                options={{
                  title: '',
                  tabBarIcon: () => (
                    <View style={styles.zapHero}>
                      <Zap color="#020617" size={24} fill="#020617" />
                    </View>
                  ),
                }}
              />

              <Tabs.Screen
                name="sleep"
                options={{
                  title: 'SLEEP',
                  tabBarIcon: ({ color }) => <Moon color={color} size={20} />,
                }}
              />

              {/* PREMIUM PROTECTED TAB */}
              <Tabs.Screen
                name="journal"
                options={{
                  title: 'LOG',
                  href: ['ADMIN', 'PREMIUM_MEMBER', 'SUPPORT'].includes(
                    profile?.role || '',
                  )
                    ? undefined
                    : null,
                  tabBarIcon: ({ color }) => (
                    <BookOpen color={color} size={20} />
                  ),
                }}
              />

              {/* SYSTEM PURGE: EXPLICITLY HIDING ALL BLOAT ROUTES */}
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
                'berry-ai',
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
                  <View>
                    <Text style={styles.brandTitle}>Cradle</Text>
                    <Text style={styles.brandSub}>BIOMETRIC V32</Text>
                  </View>
                </View>

                <ScrollView
                  showsVerticalScrollIndicator={false}
                  style={styles.sidebarScroll}
                >
                  <Text style={styles.sidebarLabel}>MONITORING CORES</Text>
                  {menuItems.map((item) => {
                    const isActive = pathname
                      ? pathname.startsWith(item.path)
                      : false; // FIXED: TS2345
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
                    label="Support Queue"
                    onPress={() => router.push('/(app)/support')}
                  />

                  {profile?.role === 'ADMIN' && (
                    <SidebarAction
                      icon={ShieldCheck}
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
  mainViewport: { flex: 1, padding: 48 },
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
    ...Platform.select({
      ios: {
        shadowColor: Theme.colors.primary,
        shadowOpacity: 0.4,
        shadowRadius: 12,
      },
      android: { elevation: 8 },
    }),
  },
});
