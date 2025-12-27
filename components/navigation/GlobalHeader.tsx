/**
 * PROJECT CRADLE: HUD V2.3 - RBAC SECURE
 * Features: Dynamic Identity, Supabase Storage Avatars, and Strict Role Logic.
 * Visibility Gates:
 * - Admin: Full Access (Admin Console + Support + Insights)
 * - Premium: Pro Access (Support + Insights)
 * - Member: Base Access (Support + Settings)
 */

import { useRouter } from 'expo-router';
import {
  Bell,
  ChevronDown,
  LifeBuoy,
  LogOut,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Theme } from '../../lib/shared/Theme';
import { supabase } from '../../lib/supabase';

export default function GlobalHeader() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    async function getIdentity() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Fetch Real-time Profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileData) {
        setProfile(profileData);

        // 2. Resolve Avatar from Supabase Storage
        if (profileData.avatar_url) {
          const { data: img } = supabase.storage
            .from('avatars')
            .getPublicUrl(profileData.avatar_url);
          setAvatarUrl(img.publicUrl);
        }
      }
    }

    getIdentity();

    // Intelligence Logs Subscription
    const channel = supabase
      .channel('header-notifs')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        (payload) => setNotifications((prev) => [payload.new, ...prev]),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace('/(auth)/sign-in' as any);
  };

  // RBAC Logic Gates
  const role = profile?.role || 'MEMBER';
  const isAdmin = role === 'ADMIN';
  const hasProAccess = ['ADMIN', 'PREMIUM_MEMBER'].includes(role);

  const roleStyle = useMemo(() => {
    switch (role) {
      case 'ADMIN':
        return { color: '#F87171', glass: 'rgba(248, 113, 113, 0.1)' };
      case 'SUPPORT':
        return { color: '#FB923C', glass: 'rgba(251, 146, 60, 0.1)' };
      case 'PREMIUM_MEMBER':
        return { color: '#C084FC', glass: 'rgba(192, 132, 252, 0.1)' };
      default:
        return { color: '#4FD1C7', glass: 'rgba(79, 209, 199, 0.1)' };
    }
  }, [role]);

  const navigateTo = (path: any) => {
    setShowDropdown(false);
    setShowNotifs(false);
    router.push(path);
  };

  return (
    <View style={styles.header}>
      <View style={styles.brand}>
        <Sparkles size={20} color={Theme.colors.primary} />
        <Text style={styles.logo}>CRADLE</Text>
      </View>

      <View style={styles.actions}>
        {/* INTELLIGENCE LOGS HUD */}
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => {
            setShowNotifs(!showNotifs);
            setShowDropdown(false);
          }}
        >
          <Bell size={20} color={Theme.colors.textMuted} />
          {notifications.length > 0 && <View style={styles.notifBadge} />}
        </TouchableOpacity>

        {showNotifs && (
          <View style={styles.dropdownHUD}>
            <Text style={styles.dropLabel}>INTELLIGENCE LOGS</Text>
            {notifications.length === 0 ? (
              <View style={styles.emptyState}>
                <ShieldAlert size={16} color={Theme.colors.textMuted} />
                <Text style={styles.emptyText}>SYSTEM CLEAR</Text>
              </View>
            ) : (
              notifications.map((n, i) => (
                <View key={i} style={styles.notifItem}>
                  <Text style={styles.notifText}>{n.message}</Text>
                </View>
              ))
            )}
          </View>
        )}

        {/* IDENTITY HUB & CORE MANAGEMENT */}
        <TouchableOpacity
          style={styles.profileBtn}
          onPress={() => {
            setShowDropdown(!showDropdown);
            setShowNotifs(false);
          }}
        >
          <View
            style={[styles.avatarWrapper, { borderColor: roleStyle.color }]}
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
          <View style={styles.identitySet}>
            <Text style={styles.profileName}>
              {profile?.full_name || 'System User'}
            </Text>
            <View
              style={[styles.roleBadge, { backgroundColor: roleStyle.glass }]}
            >
              <Text style={[styles.roleBadgeText, { color: roleStyle.color }]}>
                {role}
              </Text>
            </View>
          </View>
          <ChevronDown size={14} color={Theme.colors.textMuted} />
        </TouchableOpacity>

        {showDropdown && (
          <View style={[styles.dropdownHUD, { width: 240 }]}>
            <Text style={styles.dropLabel}>CORE MANAGEMENT</Text>

            <TouchableOpacity
              style={styles.dropItem}
              onPress={() => navigateTo('/(app)/settings')}
            >
              <Settings size={18} color={Theme.colors.textMuted} />
              <Text style={styles.dropText}>Account Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dropItem}
              onPress={() => navigateTo('/(app)/support')}
            >
              <LifeBuoy size={18} color={Theme.colors.textMuted} />
              <Text style={styles.dropText}>Support Hub</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* PREMIUM ACCESS GATE */}
            {hasProAccess && (
              <TouchableOpacity
                style={styles.dropItem}
                onPress={() => navigateTo('/(app)/insights')}
              >
                <Sparkles size={18} color={Theme.colors.secondary} />
                <Text style={styles.dropText}>Premium Insights</Text>
              </TouchableOpacity>
            )}

            {/* STRICT ADMIN GATE */}
            {isAdmin && (
              <TouchableOpacity
                style={styles.dropItem}
                onPress={() => navigateTo('/(app)/admin')}
              >
                <ShieldCheck size={18} color="#F87171" />
                <Text style={[styles.dropText, { color: '#F87171' }]}>
                  Admin Console
                </Text>
              </TouchableOpacity>
            )}

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
  );
}

const styles = StyleSheet.create({
  header: {
    height: 72,
    backgroundColor: Theme.colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: Theme.colors.border,
    zIndex: 10000,
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logo: {
    color: Theme.colors.primary,
    fontWeight: '900',
    fontSize: 18,
    letterSpacing: 2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    position: 'relative',
  },
  iconBtn: { padding: 8, position: 'relative' },
  notifBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    backgroundColor: Theme.colors.primary,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Theme.colors.background,
  },
  profileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.02)',
    padding: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  avatarWrapper: {
    width: 34,
    height: 34,
    borderRadius: 8,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  avatarImg: { width: '100%', height: '100%' },
  identitySet: { marginRight: 4 },
  profileName: { color: '#FFF', fontSize: 13, fontWeight: '800' },
  roleBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 2,
    alignSelf: 'flex-start',
  },
  roleBadgeText: { fontSize: 8, fontWeight: '900', textTransform: 'uppercase' },
  dropdownHUD: {
    position: 'absolute',
    top: 65,
    right: 0,
    width: 280,
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    elevation: 20,
  },
  dropLabel: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 12,
    marginLeft: 8,
  },
  dropItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 10,
    borderRadius: 12,
    marginBottom: 2,
  },
  dropText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 10,
  },
  emptyText: { color: Theme.colors.textMuted, fontSize: 11, fontWeight: '700' },
  notifItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  notifText: { color: '#FFF', fontSize: 13 },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginVertical: 8,
  },
});
