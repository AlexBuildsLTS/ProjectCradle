/**
 * PROJECT CRADLE: MASTER HUD V6.0 (STELLAR GLASS)
 * Features:
 * - Smooth spring animations for all HUD transitions.
 * - RBAC Logic: Admin/Support integrated into Profile menu.
 * - Branding: Native icon.png integration with scaled typography.
 * - Glassmorphism: Multi-layered obsidian surfaces with AAA contrast.
 */
import { useRouter } from 'expo-router';
import {
  Activity,
  Bell,
  ChevronDown,
  History,
  LifeBuoy,
  LogOut,
  Settings,
  ShieldCheck,
  UserCircle,
} from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import {
  Animated,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';

import { useAuth } from '@/context/auth';
import { useFamily } from '@/context/family';
import { Theme } from '@/lib/shared/Theme';
import { supabase } from '@/lib/supabase';

export default function GlobalHeader() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { profile } = useAuth();
  const { selectedBaby } = useFamily() as any;

  const isDesktop = width >= 1024;
  const [activeMenu, setActiveMenu] = useState<
    'none' | 'profile' | 'notif' | 'baby'
  >('none');

  // Animation Controllers
  const menuAnim = useRef(new Animated.Value(0)).current;

  // RBAC Gates: Determine visibility for dropdown items
  const isAdmin = profile?.role === 'ADMIN';
  const isSupport = profile?.role === 'SUPPORT' || isAdmin;

  const animateMenu = (target: number, callback?: () => void) => {
    Animated.spring(menuAnim, {
      toValue: target,
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start(callback);
  };

  const toggleMenu = (menu: 'profile' | 'notif' | 'baby') => {
    if (activeMenu === menu) {
      animateMenu(0, () => setActiveMenu('none'));
    } else {
      setActiveMenu(menu);
      animateMenu(1);
    }
  };

  const handleSignOut = async () => {
    animateMenu(0, async () => {
      setActiveMenu('none');
      await supabase.auth.signOut();
    });
  };

  const navigateTo = (path: string) => {
    animateMenu(0, () => {
      setActiveMenu('none');
      router.push(path as any);
    });
  };

  // UI Interpolations
  const menuScale = menuAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.97, 1],
  });
  const menuOpacity = menuAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });
  const menuTranslate = menuAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, 0],
  });

  return (
    <View style={styles.headerWrapper}>
      <View style={[styles.headerContainer, isDesktop && styles.desktopWidth]}>
        {/* LEFT: BRANDING & BABY HUD */}
        <View style={styles.leftSection}>
          <TouchableOpacity
            onPress={() => router.push('/(app)')}
            style={styles.brand}
          >
            <Image
              source={require('@/assets/images/icon.png')}
              style={styles.appIcon}
              resizeMode="contain"
            />
            <View>
              <Text style={styles.logoText}></Text>
              <View style={styles.statusRow}>
                <View style={styles.statusDot} />
                <Text style={styles.logoSub}>CORE ACTIVE</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.babySelector}
            onPress={() => toggleMenu('baby')}
          >
            <Activity size={12} color={Theme.colors.primary} />
            <Text style={styles.activeBabyName}>
              {selectedBaby?.name?.toUpperCase() || 'SUBJECT SELECT'}
            </Text>
            <ChevronDown size={12} color="#475569" />
          </TouchableOpacity>
        </View>

        {/* RIGHT: ACTIONS & IDENTITY */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.iconBtn, activeMenu === 'notif' && styles.activeBtn]}
            onPress={() => toggleMenu('notif')}
          >
            <Bell
              size={20}
              color={activeMenu === 'notif' ? Theme.colors.primary : '#94A3B8'}
            />
            <View style={styles.notifBadge} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.profileBtn,
              activeMenu === 'profile' && styles.activeBtn,
            ]}
            onPress={() => toggleMenu('profile')}
          >
            <View
              style={[
                styles.avatarGlow,
                {
                  borderColor: isAdmin
                    ? Theme.colors.primary
                    : Theme.colors.secondary,
                },
              ]}
            >
              {profile?.avatar_url ? (
                <Image
                  source={{ uri: profile.avatar_url }}
                  style={styles.avatarImg}
                />
              ) : (
                <View style={styles.placeholderAvatar}>
                  <Text style={styles.placeholderChar}>
                    {profile?.full_name?.charAt(0) || 'U'}
                  </Text>
                </View>
              )}
            </View>
            <ChevronDown size={14} color="#475569" />
          </TouchableOpacity>
        </View>
      </View>

      {/* DYNAMIC HUD OVERLAY (Animated Glassmorphism) */}
      {activeMenu !== 'none' && (
        <Animated.View
          style={[
            styles.masterHUD,
            activeMenu === 'notif' ? styles.notifHUDPos : styles.profileHUDPos,
            {
              opacity: menuOpacity,
              transform: [{ scale: menuScale }, { translateY: menuTranslate }],
            },
          ]}
        >
          {activeMenu === 'profile' && (
            <View>
              <Text style={styles.hudLabel}>IDENTITY & SYSTEM</Text>
              <HUDItem
                icon={UserCircle}
                label="Profile"
                onPress={() => navigateTo('/(app)/profile')}
              />
              <HUDItem
                icon={LifeBuoy}
                label="Support Hub"
                onPress={() => navigateTo('/(app)/support')}
              />
              <HUDItem
                icon={Settings}
                label="Settings"
                onPress={() => navigateTo('/(app)/settings')}
              />

              {isAdmin && (
                <>
                  <View style={styles.hudDivider} />
                  <HUDItem
                    icon={ShieldCheck}
                    label="Admin Console"
                    onPress={() => navigateTo('/(app)/admin')}
                    color={Theme.colors.primary}
                  />
                </>
              )}

              <View style={styles.hudDivider} />
              <HUDItem
                icon={LogOut}
                label="Terminate Session"
                onPress={handleSignOut}
                color="#F87171"
              />
            </View>
          )}

          {activeMenu === 'notif' && (
            <View>
              <View style={styles.hudHeaderRow}>
                <Text style={styles.hudLabel}>INTELLIGENCE LOGS</Text>
                <TouchableOpacity>
                  <Text style={styles.clearText}>CLEAR ALL</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.emptyNotifContainer}>
                <History size={28} color="rgba(255,255,255,0.05)" />
                <Text style={styles.emptyNotifText}>NO NEW ALERTS</Text>
                <Text style={styles.emptyNotifSub}>
                  System is operating within nominal parameters.
                </Text>
              </View>
            </View>
          )}

          {activeMenu === 'baby' && (
            <View style={styles.babyMenu}>
              <Text style={styles.hudLabel}>SUBJECT FOCUS</Text>
              <Text style={styles.emptyNotifSub}>
                Use family settings to manage biometrics.
              </Text>
            </View>
          )}
        </Animated.View>
      )}
    </View>
  );
}

const HUDItem = ({ icon: Icon, label, onPress, color = '#FFF' }: any) => (
  <TouchableOpacity style={styles.hudItem} onPress={onPress}>
    <View style={styles.hudIconBox}>
      <Icon size={18} color={color === '#FFF' ? '#94A3B8' : color} />
    </View>
    <Text style={[styles.hudItemText, { color }]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  headerWrapper: {
    height: 72,
    backgroundColor: '#020617',
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    zIndex: 10000,
    width: '100%',
    alignItems: 'center',
  },
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    width: '100%',
  },
  desktopWidth: { maxWidth: 1600 },
  leftSection: { flexDirection: 'row', alignItems: 'center', gap: 24 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  appIcon: { width: 28, height: 28, borderRadius: 8 },
  logoText: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 1.5,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: -2,
  },
  statusDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Theme.colors.primary,
  },
  logoSub: {
    color: Theme.colors.primary,
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 1,
  },
  babySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.03)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  activeBabyName: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBtn: { padding: 10, borderRadius: 14 },
  activeBtn: { backgroundColor: 'rgba(255,255,255,0.06)' },
  notifBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 6,
    height: 6,
    backgroundColor: Theme.colors.primary,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#020617',
  },
  profileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 4,
    borderRadius: 16,
  },
  avatarGlow: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1.5,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  avatarImg: { width: '100%', height: '100%' },
  placeholderAvatar: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  placeholderChar: { color: '#FFF', fontWeight: '900', fontSize: 12 },
  masterHUD: {
    position: 'absolute',
    top: 78,
    width: 280,
    backgroundColor: '#0F172A',
    borderRadius: 28,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 20 },
      android: { elevation: 15 },
      web: { boxShadow: '0 12px 40px rgba(0,0,0,0.6)' },
    }),
  },
  profileHUDPos: { right: 24 },
  notifHUDPos: { right: 80 },
  hudHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 12,
  },
  clearText: { color: Theme.colors.primary, fontSize: 8, fontWeight: '900' },
  hudLabel: {
    color: 'rgba(255,255,255,0.25)',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 2,
    marginLeft: 14,
    marginVertical: 14,
  },
  hudItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 12,
    borderRadius: 18,
  },
  hudIconBox: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 10,
  },
  hudItemText: { fontSize: 14, fontWeight: '700' },
  hudDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginVertical: 10,
    marginHorizontal: 14,
  },
  emptyNotifContainer: { alignItems: 'center', paddingVertical: 40, gap: 12 },
  emptyNotifText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  emptyNotifSub: {
    color: '#475569',
    fontSize: 10,
    textAlign: 'center',
    paddingHorizontal: 30,
    lineHeight: 16,
  },
  babyMenu: { padding: 10 },
});
