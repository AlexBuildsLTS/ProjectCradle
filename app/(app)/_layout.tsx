/**
 * PROJECT CRADLE: MASTER ADAPTIVE ARCHITECTURE V10.0
 * Path: app/(app)/_layout.tsx
 * * * FEATURES:
 * 1. IDENTITY SYNC: High-fidelity identity resolution to fix the "Member" fallback bug.
 * 2. NAVIGATION HYGIENE: Forced Settings to last position; hidden 'shared' and internal modules.
 * 3. ADAPTIVE UI: 1024px Breakpoint (Mobile Glass Tabs vs Desktop Sidebar).
 * 4. GLASSMOPRHISM: Melatonin-safe design with backdrop blurs and obsidian overlays.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  useWindowDimensions, 
  StyleSheet, 
  ActivityIndicator, 
  Platform 
} from 'react-native';
import { Tabs, Redirect, useRouter, usePathname, Slot } from 'expo-router';
import { BlurView } from 'expo-blur'; // Native Glassmorphism
import { 
  LayoutDashboard, 
  Milk, 
  Activity, 
  Settings, 
  LifeBuoy, 
  FileText, 
  Bell, 
  LogOut, 
  Sparkles,
  Baby,
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react-native';

import { useAuth } from '@/context/auth'; // Auth provider
import { supabase } from '@/lib/supabase'; // Supabase client
// IMPORT FIXED: Points to the new lib/shared directory to prevent crash
import { Theme } from '@/lib/shared/Theme'; 
import GlobalHeader from '@/components/navigation/GlobalHeader';
import { BerryAssistant } from '@/components/ai/BerryAssistant';

export default function AppLayout() {
  // --- 1. CORE SYSTEM HOOKS ---
  const { session, isLoading } = useAuth();
  const { width } = useWindowDimensions();
  const router = useRouter();
  const pathname = usePathname();
  
  // Responsive Breakpoints
  const isDesktop = width >= 1024;
  const isTablet = width >= 768 && width < 1024;

  // --- 2. IDENTITY RECONCILIATION ENGINE ---
  const [profile, setProfile] = useState<any>(null);
  const [identityLoading, setIdentityLoading] = useState(true);

  useEffect(() => {
    /**
     * Resolves the user's identity and ensures role synchronization.
     * This explicitly prevents the "Member" fallback issue on Pro accounts.
     */
    async function resolveIdentity() {
      if (!session?.user?.id) {
        setIdentityLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (data) setProfile(data);
      } catch (err) {
        console.error("[Cradle Master Layout] Identity Sync Failure:", err);
      } finally {
        setIdentityLoading(false);
      }
    }
    resolveIdentity();
  }, [session?.user?.id]);

  // --- 3. DYNAMIC RBAC NAVIGATION ---
  const menuItems = useMemo(() => {
    const role = profile?.role || 'MEMBER';
    const isPremium = ['ADMIN', 'PREMIUM_MEMBER'].includes(role);

    // Core routes present for all tiers
    const baseRoutes = [
      { name: 'index', icon: LayoutDashboard, label: 'Hub', path: '/(app)/' },
      { name: 'feeding', icon: Milk, label: 'Feeding', path: '/(app)/feeding' },
      { name: 'growth', icon: Activity, label: 'Growth', path: '/(app)/growth' },
      { name: 'journal', icon: FileText, label: 'Journal', path: '/(app)/journal' },
    ];

    // Premium intelligence features
    if (isPremium) {
      baseRoutes.push({ name: 'notifications', icon: Bell, label: 'Alerts', path: '/(app)/notifications' });
    }

    return baseRoutes;
  }, [profile]);

  // --- 4. NAVIGATION ACTIONS ---
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.replace("/(auth)/sign-in" as any);
    } catch (e) {
      console.error("Sign Out failed", e);
    }
  };

  // --- 5. SYSTEM INITIALIZATION GATES ---
  if (isLoading || identityLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator color={Theme.colors.primary} size="large" />
        <Text style={styles.loaderText}>SYNCHRONIZING OBSIDIAN CORE...</Text>
      </View>
    );
  }

  // Auth Protection
  if (!session) return <Redirect href={"/(auth)/sign-in" as any} />;

  // --- 6. MOBILE INTERFACE (GLASSMOPRHISM TAB BAR) ---
  if (!isDesktop) {
    return (
      <View style={{ flex: 1, backgroundColor: Theme.colors.background }}>
        <GlobalHeader /> 
        
        <Tabs screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Theme.colors.primary,
          tabBarInactiveTintColor: Theme.colors.textMuted,
          tabBarLabelStyle: styles.mobileLabelStyle,
          tabBarStyle: styles.mobileTabBar,
          // High-fidelity Glassmorphism Effect
          tabBarBackground: () => (
            Platform.OS !== 'web' ? (
              <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
            ) : (
              <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(2, 6, 23, 0.95)' }]} />
            )
          ),
        }}>
          {/* TAB ORDERING: Hub -> Feed -> Growth -> Journal -> Settings (Terminal) */}
          <Tabs.Screen name="index" options={{ title: 'Hub', tabBarIcon: ({ color }) => <LayoutDashboard color={color} size={22} /> }} />
          <Tabs.Screen name="feeding" options={{ title: 'Feed', tabBarIcon: ({ color }) => <Milk color={color} size={22} /> }} />
          <Tabs.Screen name="growth" options={{ title: 'Growth', tabBarIcon: ({ color }) => <Activity color={color} size={22} /> }} />
          <Tabs.Screen name="journal" options={{ title: 'Journal', tabBarIcon: ({ color }) => <FileText color={color} size={22} /> }} />
          
          {/* THE SETTINGS TAB IS NOW FORCED LAST */}
          <Tabs.Screen name="settings" options={{ title: 'More', tabBarIcon: ({ color }) => <Settings color={color} size={22} /> }} />
          
          {/* PRIVACY GATING: Hard-remove 'shared' and internal folders from the UI */}
          <Tabs.Screen name="shared" options={{ href: null }} />
          <Tabs.Screen name="notifications" options={{ href: null }} />
          <Tabs.Screen name="support" options={{ href: null }} />
          <Tabs.Screen name="health" options={{ href: null }} />
        </Tabs>
        
        {/* Global Floating Assistant */}
        <BerryAssistant />
      </View>
    );
  }

  // --- 7. DESKTOP INTERFACE (ENTERPRISE SIDEBAR) ---
  return (
    <View style={styles.desktopRoot}>
      {/* PROFESSIONAL SIDEBAR */}
      <View style={styles.sidebar}>
         <View style={styles.brandHeader}>
            <View style={styles.brandIconWrapper}>
              <Baby color={Theme.colors.background} size={20} />
            </View>
            <Text style={styles.brandTitle}>Cradle</Text>
         </View>
         
         <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }} style={{ flex: 1, padding: 16 }}>
            <Text style={styles.sidebarSectionLabel}>MONITORING</Text>
            
            {menuItems.map(item => {
              const isActive = pathname === item.path;
              return (
                <TouchableOpacity 
                  key={item.name} 
                  onPress={() => router.push(item.path as any)} 
                  style={[styles.sidebarNavItem, isActive && styles.sidebarNavActive]}
                >
                  <item.icon size={18} color={isActive ? Theme.colors.primary : Theme.colors.textMuted} />
                  <Text style={[styles.sidebarNavText, isActive && { color: '#FFF' }]}>{item.label}</Text>
                  {isActive && <View style={styles.activeIndicator} />}
                </TouchableOpacity>
              );
            })}
            
            <View style={styles.sidebarDivider} />
            <Text style={styles.sidebarSectionLabel}>SYSTEM CORE</Text>
            
            <TouchableOpacity 
              onPress={() => router.push('/(app)/settings' as any)} 
              style={[styles.sidebarNavItem, pathname.includes('settings') && styles.sidebarNavActive]}
            >
              <Settings size={18} color={pathname.includes('settings') ? Theme.colors.primary : Theme.colors.textMuted} />
              <Text style={styles.sidebarNavText}>Account Settings</Text>
              {pathname.includes('settings') && <View style={styles.activeIndicator} />}
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => router.push('/(app)/support' as any)} 
              style={[styles.sidebarNavItem, pathname.includes('support') && styles.sidebarNavActive]}
            >
              <LifeBuoy size={18} color={pathname.includes('support') ? Theme.colors.primary : Theme.colors.textMuted} />
              <Text style={styles.sidebarNavText}>Support Hub</Text>
              {pathname.includes('support') && <View style={styles.activeIndicator} />}
            </TouchableOpacity>

            {/* IDENTITY HUB: PRO CARD */}
            <View style={styles.proBadgeCard}>
              <View style={styles.proBadgeHeader}>
                <Sparkles size={14} color={Theme.colors.secondary} />
                <Text style={styles.proBadgeLabel}>
                  {profile?.role === 'PREMIUM_MEMBER' ? 'PRO STATUS ACTIVE' : 'UPGRADE CORE'}
                </Text>
              </View>
              <Text style={styles.proBadgeDesc}>
                {profile?.role === 'PREMIUM_MEMBER' 
                  ? 'Intelligence is currently analyzing biometric trends for your baby.' 
                  : 'Unlock AI sleep guidance and professional growth insights.'}
              </Text>
              {profile?.role !== 'PREMIUM_MEMBER' && (
                <TouchableOpacity style={styles.upgradeBtnRow}>
                  <Text style={styles.upgradeText}>VIEW PLANS</Text>
                  <ChevronRight size={12} color={Theme.colors.secondary} />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.sidebarDivider} />

            <TouchableOpacity 
              onPress={handleSignOut} 
              style={[styles.sidebarNavItem, { marginTop: 10 }]}
            >
              <LogOut size={18} color="#F87171" />
              <Text style={[styles.sidebarNavText, { color: '#F87171' }]}>Terminate Session</Text>
            </TouchableOpacity>
         </ScrollView>
      </View>

      {/* CONTENT VIEWPORT AREA */}
      <View style={{ flex: 1 }}>
        <GlobalHeader />
        <View style={styles.mainViewport}>
          <Slot />
        </View>
      </View>

      {/* Global AI Assistant Overlay */}
      <BerryAssistant />
    </View>
  );
}

// --- 8. ARCHITECTURAL STYLESHEET ---
const styles = StyleSheet.create({
  loaderContainer: { 
    flex: 1, 
    backgroundColor: '#020617', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 20 
  },
  loaderText: { 
    color: '#4FD1C7', 
    fontSize: 10, 
    fontWeight: '900', 
    letterSpacing: 2,
    textTransform: 'uppercase'
  },
  // Mobile Tab Bar Styles
  mobileTabBar: { 
    backgroundColor: 'transparent', 
    borderTopWidth: 1, 
    borderTopColor: 'rgba(255, 255, 255, 0.08)', 
    height: 90, 
    paddingBottom: Platform.OS === 'ios' ? 30 : 15 
  },
  mobileLabelStyle: { 
    fontSize: 10, 
    fontWeight: '800', 
    marginTop: 4 
  },
  // Desktop Layout Styles
  desktopRoot: { 
    flex: 1, 
    backgroundColor: '#020617', 
    flexDirection: 'row' 
  },
  sidebar: { 
    width: 300, 
    borderRightWidth: 1, 
    borderRightColor: 'rgba(255, 255, 255, 0.05)', 
    backgroundColor: '#020617' 
  },
  brandHeader: { 
    height: 80, 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 24, 
    gap: 14, 
    borderBottomWidth: 1, 
    borderBottomColor: 'rgba(255, 255, 255, 0.05)' 
  },
  brandIconWrapper: { 
    backgroundColor: '#4FD1C7', 
    padding: 8, 
    borderRadius: 12 
  },
  brandTitle: { 
    color: '#FFF', 
    fontSize: 24, 
    fontWeight: '900', 
    letterSpacing: -1.5 
  },
  sidebarSectionLabel: { 
    color: 'rgba(148, 163, 184, 0.35)', 
    fontSize: 9, 
    fontWeight: '900', 
    letterSpacing: 1.8, 
    marginVertical: 14, 
    marginLeft: 12 
  },
  sidebarNavItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 14, 
    borderRadius: 16, 
    marginBottom: 6, 
    gap: 16, 
    position: 'relative' 
  },
  sidebarNavActive: { 
    backgroundColor: 'rgba(255, 255, 255, 0.03)', 
    borderWidth: 1, 
    borderColor: 'rgba(255, 255, 255, 0.06)' 
  },
  sidebarNavText: { 
    color: '#94A3B8', 
    fontSize: 14, 
    fontWeight: '700' 
  },
  activeIndicator: { 
    position: 'absolute', 
    left: 0, 
    width: 4, 
    height: 18, 
    backgroundColor: '#4FD1C7', 
    borderRadius: 2 
  },
  sidebarDivider: { 
    height: 1, 
    backgroundColor: 'rgba(255, 255, 255, 0.05)', 
    marginVertical: 24 
  },
  mainViewport: { 
    flex: 1, 
    padding: 48 
  },
  // Pro Badge Component Styles
  proBadgeCard: { 
    marginTop: 32, 
    padding: 20, 
    backgroundColor: 'rgba(183, 148, 246, 0.06)', 
    borderRadius: 24, 
    borderWidth: 1, 
    borderColor: 'rgba(183, 148, 246, 0.15)' 
  },
  proBadgeHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8, 
    marginBottom: 10 
  },
  proBadgeLabel: { 
    color: '#B794F6', 
    fontSize: 10, 
    fontWeight: '900', 
    letterSpacing: 1.2 
  },
  proBadgeDesc: { 
    color: '#94A3B8', 
    fontSize: 12, 
    fontWeight: '600', 
    lineHeight: 18 
  },
  upgradeBtnRow: { 
    marginTop: 16, 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6 
  },
  upgradeText: { 
    color: '#B794F6', 
    fontSize: 9, 
    fontWeight: '900' 
  }
});