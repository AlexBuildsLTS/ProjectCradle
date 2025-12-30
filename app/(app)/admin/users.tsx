/**
 * PROJECT CRADLE: FAMILY DIRECTORY V9.0 (STELLAR GLASS)
 * ----------------------------------------------------------------------------
 * CRITICAL FIXES:
 * 1. RECURSION: Resolved via get_auth_role SQL function.
 * 2. DESKTOP: Centered 1200px list and 480px fixed-width modals (No stretching).
 * 3. SYMMETRY: Top-left icon alignment for every biometric entity card.
 * 4. ANIMATIONS: Non-linear spring transitions for all system shifts.
 */

import { useFocusEffect } from 'expo-router';
import {
  Activity,
  Ban,
  CheckCircle,
  Search,
  Shield,
  UserCog,
  User as UserIcon,
} from 'lucide-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  FlatList,
  Image,
  Modal,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

import { Theme } from '@/lib/shared/Theme';
import { supabase } from '@/lib/supabase';

export default function AdminUsers() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [roleModal, setRoleModal] = useState(false);

  // 1. DATA SYNCHRONIZATION: Resolved all biometric entities
  const loadRegisteredProfiles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error('[Cradle Admin] Identity Sync Failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadRegisteredProfiles();
    }, []),
  );

  // 2. OPERATIONS: ACCESS MANAGEMENT
  const updateAccess = async (newRole: string) => {
    if (!selectedUser) return;
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', selectedUser.id);
      if (error) throw error;
      loadRegisteredProfiles();
      setRoleModal(false);
    } catch (e: any) {
      Alert.alert('Role Sync Error', e.message);
    }
  };

  const toggleStatus = async (user: any) => {
    const isBanned = user.metadata?.banned === true;
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          metadata: { ...user.metadata, banned: !isBanned },
          tier: isBanned ? 'FREE' : 'BANNED',
        })
        .eq('id', user.id);
      if (error) throw error;
      loadRegisteredProfiles();
    } catch (e: any) {
      Alert.alert('Status Sync Error', e.message);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={[styles.mainWrapper, isDesktop && styles.desktopWidth]}>
        {/* HEADER: Iconic Top-Left Symmetry */}
        <View style={styles.header}>
          <View style={styles.headerIconContainer}>
            <Shield size={24} color={Theme.colors.primary} />
          </View>
          <View>
            <Text style={styles.headerTitle}>FAMILY DIRECTORY</Text>
            <Text style={styles.headerSub}>
              CORE BIOMETRIC ENTITY MANAGEMENT
            </Text>
          </View>
        </View>

        {/* SEARCH HUD */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Search size={18} color="#475569" />
            <TextInput
              style={styles.searchInput}
              placeholder="SEARCH BIOMETRIC ID OR SUBJECT NAME..."
              placeholderTextColor="#475569"
              value={search}
              onChangeText={setSearch}
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* ENTITY LIST */}
        <FlatList
          data={users.filter(
            (u) =>
              (u.full_name || '')
                .toLowerCase()
                .includes(search.toLowerCase()) ||
              (u.baby_name || '').toLowerCase().includes(search.toLowerCase()),
          )}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={loadRegisteredProfiles}
              tintColor={Theme.colors.primary}
            />
          }
          renderItem={({ item, index }) => (
            <AnimatedUserCard
              user={item}
              index={index}
              onEdit={() => {
                setSelectedUser(item);
                setRoleModal(true);
              }}
              onToggleStatus={() => toggleStatus(item)}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      </View>

      {/* ACCESS CONTROL: Fixed Width for Desktop */}
      <Modal visible={roleModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalContent, isDesktop && styles.fixedDesktopModal]}
          >
            <Text style={styles.modalLabel}>UPDATE SYSTEM ACCESS LEVEL</Text>
            {['MEMBER', 'PREMIUM_MEMBER', 'SUPPORT', 'ADMIN'].map((role) => (
              <TouchableOpacity
                key={role}
                onPress={() => updateAccess(role)}
                style={styles.roleBtn}
              >
                <Text
                  style={[
                    styles.roleBtnText,
                    selectedUser?.role === role && {
                      color: Theme.colors.primary,
                    },
                  ]}
                >
                  {role}
                </Text>
                {selectedUser?.role === role && (
                  <CheckCircle size={18} color={Theme.colors.primary} />
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={() => setRoleModal(false)}
              style={styles.closeBtn}
            >
              <Text style={styles.closeBtnText}>CLOSE GATEWAY</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// --- ANIMATED ENTITY CARD ---

const AnimatedUserCard = ({ user, index, onEdit, onToggleStatus }: any) => {
  const springAnim = useRef(new Animated.Value(0)).current;
  const isBanned = user.metadata?.banned === true;

  useEffect(() => {
    Animated.spring(springAnim, {
      toValue: 1,
      tension: 40,
      friction: 8,
      delay: index * 60,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.userCard,
        {
          opacity: springAnim,
          transform: [
            { scale: springAnim },
            {
              translateY: springAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [15, 0],
              }),
            },
          ],
        },
        isBanned && styles.bannedCard,
      ]}
    >
      <View style={styles.cardHeader}>
        <View
          style={[
            styles.avatarGlow,
            {
              borderColor:
                user.role === 'ADMIN'
                  ? Theme.colors.primary
                  : Theme.colors.secondary,
            },
          ]}
        >
          {user.avatar_url ? (
            <Image source={{ uri: user.avatar_url }} style={styles.avatarImg} />
          ) : (
            <UserIcon size={18} color="#475569" />
          )}
        </View>
        <View style={styles.userInfo}>
          <Text style={[styles.userName, isBanned && styles.strikethrough]}>
            {user.full_name || 'ANONYMOUS SUBJECT'}
          </Text>
          <View style={styles.roleRow}>
            <Text style={styles.roleLabel}>{user.role}</Text>
            <View style={styles.dot} />
            <Text
              style={[
                styles.tierLabel,
                {
                  color:
                    user.tier === 'PREMIUM'
                      ? Theme.colors.secondary
                      : '#475569',
                },
              ]}
            >
              {user.tier || 'FREE'}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={onEdit} style={styles.gearBtn}>
          <UserCog size={18} color={Theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      <View style={styles.cardFooter}>
        <View style={styles.subjectMeta}>
          <Activity size={12} color="#475569" />
          <Text style={styles.subjectName}>
            {user.baby_name?.toUpperCase() || 'NO SUBJECT FOCUS'}
          </Text>
        </View>
        <TouchableOpacity
          onPress={onToggleStatus}
          style={[
            styles.statusBtn,
            isBanned ? styles.restoreBtn : styles.revokeBtn,
          ]}
        >
          <Text
            style={[
              styles.statusBtnText,
              { color: isBanned ? '#9AE6B4' : '#F87171' },
            ]}
          >
            {isBanned ? 'RESTORE ACCESS' : 'REVOKE ACCESS'}
          </Text>
          {isBanned ? (
            <CheckCircle size={14} color="#9AE6B4" />
          ) : (
            <Ban size={14} color="#F87171" />
          )}
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

// --- PREMIUM HUD STYLES ---

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#020617', alignItems: 'center' },
  mainWrapper: { flex: 1, width: '100%' },
  desktopWidth: { maxWidth: 1200 },
  header: {
    padding: 32,
    paddingTop: 60,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(79, 209, 199, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(79, 209, 199, 0.12)',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  headerSub: {
    color: '#475569',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 2,
    marginTop: 4,
  },
  searchSection: { paddingHorizontal: 32, paddingBottom: 24 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A101F',
    borderRadius: 18,
    paddingHorizontal: 20,
    height: 56,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    color: '#FFF',
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  list: { paddingHorizontal: 32, paddingBottom: 120 },

  userCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 32,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  bannedCard: { opacity: 0.5, borderColor: 'rgba(248, 113, 113, 0.2)' },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  avatarGlow: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.02)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  avatarImg: { width: '100%', height: '100%', borderRadius: 14 },
  userInfo: { flex: 1, marginLeft: 16 },
  userName: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  strikethrough: { textDecorationLine: 'line-through' },
  roleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  roleLabel: { color: Theme.colors.primary, fontSize: 8, fontWeight: '900' },
  dot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: '#475569' },
  tierLabel: { fontSize: 8, fontWeight: '900' },
  gearBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginVertical: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subjectMeta: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  subjectName: { color: '#475569', fontSize: 10, fontWeight: '800' },

  statusBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
  },
  revokeBtn: {
    backgroundColor: 'rgba(248, 113, 113, 0.04)',
    borderColor: 'rgba(248, 113, 113, 0.15)',
  },
  restoreBtn: {
    backgroundColor: 'rgba(154, 230, 180, 0.04)',
    borderColor: 'rgba(154, 230, 180, 0.15)',
  },
  statusBtnText: { fontSize: 9, fontWeight: '900', letterSpacing: 1 },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.97)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  modalContent: {
    backgroundColor: '#0A101F',
    padding: 32,
    borderRadius: 36,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    width: '100%',
  },
  fixedDesktopModal: { maxWidth: 480 },
  modalLabel: {
    color: '#475569',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 2.5,
    textAlign: 'center',
    marginBottom: 32,
  },
  roleBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  roleBtnText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 1,
  },
  closeBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    marginTop: 16,
  },
  closeBtnText: {
    color: Theme.colors.primary,
    fontWeight: '900',
    fontSize: 11,
    letterSpacing: 1.5,
  },
});
