/**
 * PROJECT CRADLE: HUD V2.6 - FULL OPTIMIZATION
 * Path: components/navigation/GlobalHeader.tsx
 * THEME: PROJECT CRADLE (Teal #4FD1C7 | Obsidian #020617)
 * * FEATURES:
 * 1. IDENTITY RESTORATION: High-fidelity role and elite status badges.
 * 2. LIVE SYNC PULSE: Visual indicator for real-time core encryption.
 * 3. RESPONSIVE DESIGN: 1280px max-width desktop container.
 * 4. INTERACTIVE MODALS: Tapping identity triggers the Account Settings Modal.
 */

import { useRouter } from 'expo-router';
import {
  Bell,
  ChevronDown,
  LogOut,
  Medal,
  Settings,
  ShieldCheck,
  Sparkles,
  UserCircle,
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { Theme } from '../../lib/shared/Theme';
import { supabase } from '../../lib/supabase';
import { AccountSettingsModal } from '../settings/AccountSettingsModal';

export default function GlobalHeader() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const [profile, setProfile] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // Animation logic for the Live Sync Pulse
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.5,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    async function getIdentity() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
        if (profileData.avatar_url) {
          const { data: img } = supabase.storage
            .from('avatars')
            .getPublicUrl(profileData.avatar_url);
          setAvatarUrl(img.publicUrl);
        }
      }
    }
    getIdentity();
  }, []);

  const role = profile?.role || 'MEMBER';
  const isPremium = ['ADMIN', 'PREMIUM_MEMBER'].includes(role);

  const navigateTo = (path: any) => {
    setShowDropdown(false);
    setShowNotifs(false);
    router.push(path);
  };

  return (
    <View style={styles.headerWrapper}>
      <View style={[styles.headerContainer, isDesktop && styles.desktopWidth]}>
        {/* BRANDING & SYNC STATUS */}
        <View style={styles.brandContainer}>
          <View style={styles.brand}>
            <Sparkles size={20} color={Theme.colors.primary} />
            <Text style={styles.logo}>CRADLE</Text>
          </View>
          <View style={styles.syncStatus}>
            <Animated.View
              style={[styles.pulseDot, { transform: [{ scale: pulseAnim }] }]}
            />
            <Text style={styles.syncText}>SYNC ACTIVE</Text>
          </View>
        </View>

        {/* ACTIONS & IDENTITY */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => setShowNotifs(!showNotifs)}
          >
            <Bell size={20} color={Theme.colors.textMuted} />
            {notifications.length > 0 && <View style={styles.notifBadge} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.profileBtn}
            onPress={() => setShowDropdown(!showDropdown)}
          >
            <View
              style={[
                styles.avatarWrapper,
                { borderColor: isPremium ? '#B794F6' : '#4FD1C7' },
              ]}
            >
              <Image
                source={{
                  uri:
                    avatarUrl ||
                    `https://ui-avatars.com/api/?name=${
                      profile?.full_name || 'U'
                    }&background=1e293b&color=fff`,
                }}
                style={styles.avatarImg}
              />
            </View>

            {isDesktop && (
              <View style={styles.identitySet}>
                <Text style={styles.profileName}>
                  {profile?.full_name || 'System User'}
                </Text>
                <View style={styles.badgeRow}>
                  <View style={styles.miniBadge}>
                    <ShieldCheck size={10} color="#4FD1C7" />
                    <Text style={styles.badgeText}>
                      {role.replace('_', ' ')}
                    </Text>
                  </View>
                  {isPremium && (
                    <View
                      style={[
                        styles.miniBadge,
                        { backgroundColor: 'rgba(183, 148, 246, 0.1)' },
                      ]}
                    >
                      <Medal size={10} color="#B794F6" />
                      <Text style={[styles.badgeText, { color: '#B794F6' }]}>
                        ELITE
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            )}
            <ChevronDown size={14} color={Theme.colors.textMuted} />
          </TouchableOpacity>

          {/* DROPDOWN HUD */}
          {showDropdown && (
            <View style={styles.dropdownHUD}>
              <Text style={styles.dropLabel}>CORE MANAGEMENT</Text>

              <TouchableOpacity
                style={styles.dropItem}
                onPress={() => {
                  setShowDropdown(false);
                  setShowAccountModal(true);
                }}
              >
                <UserCircle size={18} color={Theme.colors.textMuted} />
                <Text style={styles.dropText}>Identity Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dropItem}
                onPress={() => navigateTo('/(app)/settings')}
              >
                <Settings size={18} color={Theme.colors.textMuted} />
                <Text style={styles.dropText}>Account Settings</Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.dropItem}
                onPress={async () => await supabase.auth.signOut()}
              >
                <LogOut size={18} color="#F87171" />
                <Text style={[styles.dropText, { color: '#F87171' }]}>
                  Terminate Session
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* ACCOUNT MODAL */}
      <AccountSettingsModal
        visible={showAccountModal}
        onClose={() => setShowAccountModal(false)}
        profile={profile}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    height: 72,
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
  desktopWidth: { maxWidth: 1280 },
  brandContainer: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logo: { color: '#FFF', fontWeight: '900', fontSize: 16, letterSpacing: 2 },
  syncStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(79, 209, 199, 0.05)',
    paddingHorizontal: 10,
    paddingVertical: 4,
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
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    position: 'relative',
  },
  iconBtn: { padding: 8 },
  notifBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    backgroundColor: '#4FD1C7',
    borderRadius: 4,
  },
  profileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255,255,255,0.02)',
    padding: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  avatarWrapper: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  avatarImg: { width: '100%', height: '100%' },
  identitySet: { marginRight: 4, gap: 2 },
  profileName: { color: '#FFF', fontSize: 13, fontWeight: '800' },
  badgeRow: { flexDirection: 'row', gap: 6 },
  miniBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(79, 209, 199, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    color: '#4FD1C7',
    fontSize: 8,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  dropdownHUD: {
    position: 'absolute',
    top: 60,
    right: 0,
    width: 240,
    backgroundColor: '#0A101F',
    borderRadius: 24,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  dropLabel: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 12,
    marginLeft: 8,
    marginTop: 4,
  },
  dropItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 14,
  },
  dropText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginVertical: 10,
  },
});
