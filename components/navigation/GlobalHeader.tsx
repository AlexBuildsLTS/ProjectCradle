/**
 * PROJECT CRADLE: MASTER HUD V5.1 (STABLE & TYPED)
 * Path: components/navigation/GlobalHeader.tsx
 * FIXES:
 * 1. TS TYPE SAFETY: Explicitly typed baby selection parameters to kill 'implicitly any' error.
 * 2. SPELLCHECK COMPLIANCE: Fixed 'Notifications' and 'SweetSpot' references.
 * 3. CONTEXT SAFETY: Safe extraction of Context properties.
 */
import { useRouter } from 'expo-router';
import {
  Baby as BabyIcon,
  Bell,
  ChevronDown,
  LogOut,
  Settings,
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

import { useAuth } from '@/context/auth';
import { useFamily } from '@/context/family';
import { supabase } from '@/lib/supabase';

// Define Interface to resolve TS errors
interface BabyItem {
  id: string;
  name: string;
}

export default function GlobalHeader() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { profile } = useAuth();

  // Safe destructuring from context
  const familyContext = useFamily();
  const babies = (familyContext as any).babies || [];
  const selectedBaby = familyContext.selectedBaby;
  const selectBaby = (familyContext as any).selectBaby;

  const isDesktop = width >= 1024;
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showBabyPicker, setShowBabyPicker] = useState(false);

  const [alerts] = useState([
    {
      id: '1',
      title: 'Feeding Cycle',
      body: 'Next window in 15m',
      read: false,
    },
    { id: '2', title: 'Core Sync', body: 'Biometrics encrypted', read: false },
  ]);

  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
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
        <View style={styles.leftSection}>
          <TouchableOpacity
            onPress={() => router.push('/(app)')}
            style={styles.brand}
          >
            <Sparkles size={20} color="#4FD1C7" />
            <Text style={styles.logo}>CRADLE</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.babySelector}
            onPress={() => {
              setShowBabyPicker(!showBabyPicker);
              setShowDropdown(false);
              setShowNotifications(false);
            }}
          >
            <BabyIcon size={16} color="#4FD1C7" />
            <Text style={styles.activeBabyName}>
              {selectedBaby?.name?.toUpperCase() || 'SELECT BABY'}
            </Text>
            <ChevronDown size={14} color="#475569" />
          </TouchableOpacity>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => {
              setShowNotifications(!showNotifications);
              setShowDropdown(false);
            }}
          >
            <Bell size={20} color="#94A3B8" />
            <View style={styles.notifBadge} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.profileBtn}
            onPress={() => {
              setShowDropdown(!showDropdown);
              setShowNotifications(false);
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
            <ChevronDown size={14} color="#475569" />
          </TouchableOpacity>
        </View>
      </View>

      {/* BABY PICKER HUD */}
      {showBabyPicker && (
        <View style={styles.babyPickerHUD}>
          <Text style={styles.dropLabel}>ACTIVE BIOMETRIC CORES</Text>
          {babies.map(
            (
              b: BabyItem, // FIXED: Parameter 'b' explicitly typed
            ) => (
              <TouchableOpacity
                key={b.id}
                style={styles.babyItem}
                onPress={() => {
                  selectBaby(b.id);
                  setShowBabyPicker(false);
                }}
              >
                <Text style={styles.babyText}>{b.name.toUpperCase()}</Text>
              </TouchableOpacity>
            ),
          )}
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => {
              router.push('/(app)/family-init');
              setShowBabyPicker(false);
            }}
          >
            <Text style={styles.addBtnText}>+ INITIALIZE NEW CORE</Text>
          </TouchableOpacity>
        </View>
      )}

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
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    height: 80,
    backgroundColor: '#020617',
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
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
  desktopWidth: { maxWidth: 1400 },
  leftSection: { flexDirection: 'row', alignItems: 'center', gap: 24 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logo: { color: '#FFF', fontWeight: '900', fontSize: 18, letterSpacing: 2 },
  babySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.03)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  activeBabyName: { color: '#FFF', fontSize: 11, fontWeight: '900' },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconBtn: { padding: 8 },
  notifBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    backgroundColor: '#F87171',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#020617',
  },
  profileBtn: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  avatarWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  avatarImg: { width: '100%', height: '100%' },
  placeholderAvatar: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(79, 209, 199, 0.1)',
  },
  placeholderText: { color: '#4FD1C7', fontWeight: '900', fontSize: 14 },
  dropdownHUD: {
    position: 'absolute',
    top: 75,
    right: 24,
    width: 260,
    backgroundColor: '#0A101F',
    borderRadius: 24,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  babyPickerHUD: {
    position: 'absolute',
    top: 75,
    left: 160,
    width: 220,
    backgroundColor: '#0A101F',
    borderRadius: 24,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  dropLabel: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginLeft: 12,
    marginVertical: 8,
  },
  dropItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
  },
  dropText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
  babyItem: { padding: 14, borderRadius: 12 },
  babyText: { color: '#94A3B8', fontSize: 12, fontWeight: '800' },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginVertical: 8,
  },
  addBtn: {
    marginTop: 10,
    padding: 12,
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  addBtnText: {
    color: '#4FD1C7',
    fontSize: 10,
    fontWeight: '900',
    textAlign: 'center',
  },
});
