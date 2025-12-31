/**
 * PROJECT CRADLE: MASTER HUD V7.0 (STELLAR SWITCHER)
 * ----------------------------------------------------------------------------
 * ENHANCEMENTS:
 * 1. BIOMETRIC SWITCHER: Full implementation of baby selection dropdown.
 * 2. MOBILE OPTIMIZATION: Reduced internal padding and gaps for tight viewports.
 * 3. DYNAMIC POSITIONING: Added babyHUDPos for precise dropdown alignment.
 * 4. UX: Integrated Haptics and Non-linear spring transitions for HUD panels.
 */

import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import {
  Activity,
  Bell,
  CheckCircle2,
  ChevronDown,
  History,
  LifeBuoy,
  LogOut,
  PlusCircle,
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
  const { babies, selectedBaby, selectBaby } = useFamily() as any;

  const isDesktop = width >= 1024;
  const isSmallMobile = width < 380; // Detect extra tight screens

  const [activeMenu, setActiveMenu] = useState<
    'none' | 'profile' | 'notif' | 'baby'
  >('none');

  // Animation Controllers for Obsidian Glass Panels
  const menuAnim = useRef(new Animated.Value(0)).current;

  // RBAC Gates
  const isAdmin = profile?.role === 'ADMIN';

  const animateMenu = (target: number, callback?: () => void) => {
    Animated.spring(menuAnim, {
      toValue: target,
      useNativeDriver: true,
      friction: 8,
      tension: 45, // Slightly higher tension for snappier feedback
    }).start(callback);
  };

  const toggleMenu = (menu: 'profile' | 'notif' | 'baby') => {
    if (Platform.OS !== 'web')
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (activeMenu === menu) {
      animateMenu(0, () => setActiveMenu('none'));
    } else {
      setActiveMenu(menu);
      animateMenu(1);
    }
  };

  const handleBabySwitch = (babyId: string) => {
    if (Platform.OS !== 'web')
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    selectBaby(babyId);
    animateMenu(0, () => setActiveMenu('none'));
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

  // Panel Interpolations
  const menuScale = menuAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.96, 1],
  });
  const menuOpacity = menuAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });
  const menuTranslate = menuAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-12, 0],
  });

  return (
    <View style={styles.headerWrapper}>
      <View style={[styles.headerContainer, isDesktop && styles.desktopWidth]}>
        {/* LEFT: COMPACT BRANDING & BIOMETRIC SELECTOR */}
        <View style={[styles.leftSection, isSmallMobile && { gap: 12 }]}>
          <TouchableOpacity
            onPress={() => router.push('/(app)')}
            style={styles.brand}
          >
            <Image
              source={require('@/assets/images/icon.png')}
              style={styles.appIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.babySelector,
              isSmallMobile && { paddingHorizontal: 8 },
            ]}
            onPress={() => toggleMenu('baby')}
          >
            <Activity size={12} color={Theme.colors.primary} />
            <Text style={styles.activeBabyName} numberOfLines={1}>
              {selectedBaby?.name?.toUpperCase() || 'CORE SYNC'}
            </Text>
            <ChevronDown size={12} color="#475569" />
          </TouchableOpacity>
        </View>

        {/* RIGHT: IDENTITY & SYSTEM HUB */}
        <View style={[styles.actions, isSmallMobile && { gap: 8 }]}>
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
            {!isSmallMobile && <ChevronDown size={14} color="#475569" />}
          </TouchableOpacity>
        </View>
      </View>

      {/* DYNAMIC HUB OVERLAY (Obsidian Glassmorphism) */}
      {activeMenu !== 'none' && (
        <Animated.View
          style={[
            styles.masterHUD,
            activeMenu === 'notif'
              ? styles.notifHUDPos
              : activeMenu === 'baby'
              ? styles.babyHUDPos
              : styles.profileHUDPos,
            {
              opacity: menuOpacity,
              transform: [{ scale: menuScale }, { translateY: menuTranslate }],
            },
          ]}
        >
          {activeMenu === 'profile' && (
            <View>
              <Text style={styles.hudLabel}>IDENTITY HUB</Text>
              <HUDItem
                icon={UserCircle}
                label="Profile"
                onPress={() => navigateTo('/(app)/settings/profile')}
              />
              <HUDItem
                icon={LifeBuoy}
                label="Support Center"
                onPress={() => navigateTo('/(app)/support')}
              />
              <HUDItem
                icon={Settings}
                label="System Settings"
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
                  <Text style={styles.clearText}>PURGE ALL</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.emptyHUDContent}>
                <History size={24} color="rgba(255,255,255,0.05)" />
                <Text style={styles.emptyHUDText}>ALL SYSTEMS NOMINAL</Text>
                <Text style={styles.emptyHUDSub}>
                  No active biometric alerts detected.
                </Text>
              </View>
            </View>
          )}

          {activeMenu === 'baby' && (
            <View>
              <Text style={styles.hudLabel}>SUBJECT SELECTION</Text>
              {babies?.map((baby: any) => (
                <TouchableOpacity
                  key={baby.id}
                  style={[
                    styles.hudItem,
                    selectedBaby?.id === baby.id && styles.hudItemActive,
                  ]}
                  onPress={() => handleBabySwitch(baby.id)}
                >
                  <View
                    style={[
                      styles.hudIconBox,
                      selectedBaby?.id === baby.id && {
                        backgroundColor: 'rgba(79, 209, 199, 0.1)',
                      },
                    ]}
                  >
                    <Activity
                      size={16}
                      color={
                        selectedBaby?.id === baby.id
                          ? Theme.colors.primary
                          : '#94A3B8'
                      }
                    />
                  </View>
                  <Text
                    style={[
                      styles.hudItemText,
                      selectedBaby?.id === baby.id && {
                        color: Theme.colors.primary,
                      },
                    ]}
                  >
                    {baby.name.toUpperCase()}
                  </Text>
                  {selectedBaby?.id === baby.id && (
                    <CheckCircle2
                      size={14}
                      color={Theme.colors.primary}
                      style={{ marginLeft: 'auto' }}
                    />
                  )}
                </TouchableOpacity>
              ))}
              <View style={styles.hudDivider} />
              <HUDItem
                icon={PlusCircle}
                label="Register New Core"
                onPress={() => navigateTo('/(app)/family')}
                color={Theme.colors.primary}
              />
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
    paddingHorizontal: 20, // Reduced from 24 for better mobile fit
    width: '100%',
  },
  desktopWidth: { maxWidth: 1600 },
  leftSection: { flexDirection: 'row', alignItems: 'center', gap: 16 }, // Reduced gap
  brand: { flexDirection: 'row', alignItems: 'center' },
  appIcon: { width: 28, height: 28, borderRadius: 8 },
  babySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.03)',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    maxWidth: 160,
  },
  activeBabyName: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginRight: 4,
  },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBtn: { padding: 8, borderRadius: 12 },
  activeBtn: { backgroundColor: 'rgba(255,255,255,0.06)' },
  notifBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
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
    gap: 8,
    padding: 4,
    borderRadius: 16,
  },
  avatarGlow: {
    width: 32,
    height: 32,
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
    width: 260, // Slightly narrower for cleaner mobile appearance
    backgroundColor: '#0F172A',
    borderRadius: 24,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 20 },
      android: { elevation: 15 },
      web: { boxShadow: '0 12px 40px rgba(0,0,0,0.6)' },
    }),
  },
  profileHUDPos: { right: 20 },
  notifHUDPos: { right: 70 },
  babyHUDPos: { left: 60 },
  hudHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 12,
  },
  clearText: {
    color: Theme.colors.primary,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },
  hudLabel: {
    color: 'rgba(255,255,255,0.25)',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 2,
    marginLeft: 12,
    marginVertical: 12,
  },
  hudItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 10,
    borderRadius: 14,
  },
  hudItemActive: { backgroundColor: 'rgba(255,255,255,0.02)' },
  hudIconBox: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 8,
  },
  hudItemText: { fontSize: 13, fontWeight: '700', color: '#FFF' },
  hudDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginVertical: 8,
    marginHorizontal: 12,
  },
  emptyHUDContent: { alignItems: 'center', paddingVertical: 32, gap: 10 },
  emptyHUDText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  emptyHUDSub: {
    color: '#475569',
    fontSize: 9,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 14,
  },
});
