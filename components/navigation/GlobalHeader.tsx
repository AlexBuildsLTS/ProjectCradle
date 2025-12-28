/**
 * PROJECT CRADLE: MASTER HUD V3.2 - NOTIFICATION ENGINE
 * Path: components/navigation/GlobalHeader.tsx
 * THEME: PROJECT CRADLE (Teal #4FD1C7 | Obsidian #020617)
 * * MODULES:
 * 1. DYNAMIC NOTIFICATIONS: Red dot visibility tied to unread count.
 * 2. PROFILE OPTIMIZATION: Purged "Identify" naming; restored direct "Profile" access.
 * 3. REAL-TIME SYNC: Subscribes to useAuth for context-aware identity updates.
 * 4. INTERACTIVE DROPDOWNS: Clean "Read All" and item-level dismissal logic.
 */

import { useRouter } from 'expo-router';
import {
  Bell,
  ChevronDown,
  LogOut,
  Settings,
  ShieldCheck,
  Sparkles,
  UserCircle,
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';

// PROJECT IMPORTS
import { useAuth } from '../../context/auth';
import { Theme } from '../../lib/shared/Theme';
import { supabase } from '../../lib/supabase';

export default function GlobalHeader() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { profile, user } = useAuth();
  const isDesktop = width >= 1024;

  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Feeding Cycle',
      body: 'Next window in 15m',
      read: false,
    },
    { id: '2', title: 'Core Sync', body: 'Biometrics encrypted', read: false },
  ]);

  // MODULE: HUD NOTIFICATION LOGIC
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  // MODULE: LIVE SYNC PULSE ANIMATION
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const handleSignOut = async () => {
    setShowDropdown(false);
    await supabase.auth.signOut();
  };

  return (
    <View style={styles.headerWrapper}>
      <View style={[styles.headerContainer, isDesktop && styles.desktopWidth]}>
        {/* MODULE: BRANDING & ENCRYPTION STATUS */}
        <View style={styles.brandContainer}>
          <TouchableOpacity
            onPress={() => router.push('/(app)')}
            style={styles.brand}
            activeOpacity={0.7}
          >
            <Sparkles size={20} color={Theme.colors.primary} />
            <Text style={styles.logo}>CRADLE</Text>
          </TouchableOpacity>

          <View style={styles.syncStatus}>
            <Animated.View
              style={[styles.pulseDot, { transform: [{ scale: pulseAnim }] }]}
            />
            <Text style={styles.syncText}>SYNC ACTIVE</Text>
          </View>
        </View>

        {/* MODULE: ACTIONS & IDENTITY HUB */}
        <View style={styles.actions}>
          {/* NOTIFICATION HUD */}
          <View>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => {
                setShowNotifs(!showNotifs);
                setShowDropdown(false);
              }}
            >
              <Bell
                size={20}
                color={unreadCount > 0 ? '#FFF' : Theme.colors.textMuted}
              />
              {unreadCount > 0 && <View style={styles.notifBadge} />}
            </TouchableOpacity>

            {showNotifs && (
              <View style={styles.notificationHUD}>
                <View style={styles.hudHeader}>
                  <Text style={styles.dropLabel}>ALERTS</Text>
                  <TouchableOpacity onPress={markAllRead}>
                    <Text style={styles.readAllText}>READ ALL</Text>
                  </TouchableOpacity>
                </View>
                <ScrollView style={styles.notifScroll}>
                  {notifications.map((n) => (
                    <TouchableOpacity
                      key={n.id}
                      style={[styles.notifItem, n.read && { opacity: 0.5 }]}
                      onPress={() => markRead(n.id)}
                    >
                      <View
                        style={[
                          styles.unreadDot,
                          n.read && { backgroundColor: 'transparent' },
                        ]}
                      />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.notifTitle}>{n.title}</Text>
                        <Text style={styles.notifBody}>{n.body}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {/* IDENTITY PORTAL */}
          <TouchableOpacity
            style={styles.profileBtn}
            onPress={() => {
              setShowDropdown(!showDropdown);
              setShowNotifs(false);
            }}
          >
            <View
              style={[
                styles.avatarWrapper,
                {
                  borderColor:
                    profile?.role === 'ADMIN' ? '#4FD1C7' : '#B794F6',
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
                  <Text style={styles.placeholderText}>
                    {profile?.full_name?.charAt(0) || 'U'}
                  </Text>
                </View>
              )}
            </View>

            {isDesktop && (
              <View style={styles.identitySet}>
                <Text style={styles.profileName} numberOfLines={1}>
                  {profile?.full_name || 'System User'}
                </Text>
                <View style={styles.miniBadge}>
                  <ShieldCheck size={10} color="#4FD1C7" />
                  <Text style={styles.badgeText}>
                    {profile?.role?.replace('_', ' ') || 'MEMBER'}
                  </Text>
                </View>
              </View>
            )}
            <ChevronDown size={14} color={Theme.colors.textMuted} />
          </TouchableOpacity>

          {/* MASTER DROPDOWN */}
          {showDropdown && (
            <View style={styles.dropdownHUD}>
              <Text style={styles.dropLabel}>CORE MANAGEMENT</Text>

              <TouchableOpacity
                style={styles.dropItem}
                onPress={() => {
                  setShowDropdown(false);
                  router.push('/(app)/profile');
                }}
              >
                <UserCircle size={18} color="#94A3B8" />
                <Text style={styles.dropText}>Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dropItem}
                onPress={() => {
                  setShowDropdown(false);
                  router.push('/(app)/settings');
                }}
              >
                <Settings size={18} color="#94A3B8" />
                <Text style={styles.dropText}>System Settings</Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity style={styles.dropItem} onPress={handleSignOut}>
                <LogOut size={18} color="#F87171" />
                <Text style={[styles.dropText, { color: '#F87171' }]}>
                  Terminate Session
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    height: 80,
    backgroundColor: '#020617',
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    zIndex: 10000,
    alignItems: 'center',
    width: '100%',
  },
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    width: '100%',
  },
  desktopWidth: { maxWidth: 1400 },
  brandContainer: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logo: { color: '#FFF', fontWeight: '900', fontSize: 18, letterSpacing: 2 },
  syncStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(79, 209, 199, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(79, 209, 199, 0.1)',
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4FD1C7',
  },
  syncText: {
    color: '#4FD1C7',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    position: 'relative',
  },
  iconBtn: {
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 12,
  },
  notifBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    backgroundColor: '#F87171',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#020617',
  },
  profileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  avatarWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1.5,
    overflow: 'hidden',
    backgroundColor: 'rgba(79, 209, 199, 0.1)',
  },
  avatarImg: { width: '100%', height: '100%' },
  placeholderAvatar: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: { color: '#4FD1C7', fontWeight: '900', fontSize: 16 },
  identitySet: { marginRight: 4, gap: 2, maxWidth: 150 },
  profileName: { color: '#FFF', fontSize: 14, fontWeight: '800' },
  miniBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(79, 209, 199, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    color: '#4FD1C7',
    fontSize: 9,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dropdownHUD: {
    position: 'absolute',
    top: 65,
    right: 0,
    width: 260,
    backgroundColor: '#0A101F',
    borderRadius: 28,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#000',
    shadowOpacity: 0.6,
    shadowRadius: 30,
  },
  notificationHUD: {
    position: 'absolute',
    top: 65,
    right: 150,
    width: 300,
    maxHeight: 400,
    backgroundColor: '#0A101F',
    borderRadius: 28,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#000',
    shadowOpacity: 0.6,
    shadowRadius: 30,
  },
  hudHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  readAllText: { color: '#4FD1C7', fontSize: 10, fontWeight: '900' },
  notifScroll: { flexGrow: 0 },
  notifItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.03)',
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4FD1C7',
  },
  notifTitle: { color: '#FFF', fontSize: 13, fontWeight: '700' },
  notifBody: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  dropLabel: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginLeft: 8,
  },
  dropItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: 16,
  },
  dropText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginVertical: 12,
    marginHorizontal: 12,
  },
});
