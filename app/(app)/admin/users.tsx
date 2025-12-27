/**
 * PROJECT CRADLE: ENHANCED FAMILY DIRECTORY V3.1
 * Path: app/(app)/admin/users.tsx
 * THEME: PROJECT CRADLE (Teal #4FD1C7 | Obsidian #020617)
 */

import { GlassCard } from '@/components/glass/GlassCard';
import { Theme } from '@/lib/shared/Theme';
import { supabase } from '@/lib/supabase';
import { useFocusEffect } from 'expo-router';
import {
  Ban,
  CheckCircle,
  Search,
  ShieldCheck,
  UserCog,
} from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function AdminUsersScreen() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [roleModal, setRoleModal] = useState(false);

  // FETCH ALL REGISTERED PROFILES
  const loadUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (e) {
      console.error('[Cradle Admin] Profile Load Failure:', e);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadUsers();
    }, []),
  );

  const handleRoleUpdate = async (newRole: string) => {
    if (!selectedUser) return;
    try {
      await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', selectedUser.id);
      loadUsers();
      setRoleModal(false);
    } catch (e: any) {
      Alert.alert('Role Update Failed', e.message);
    }
  };

  const handleBanToggle = async (user: any) => {
    const isBanned = user.status === 'banned';
    try {
      await supabase
        .from('profiles')
        .update({ status: isBanned ? 'active' : 'banned' })
        .eq('id', user.id);
      loadUsers();
    } catch (e: any) {
      Alert.alert('Status Change Failed', e.message);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>FAMILY DIRECTORY</Text>
        <Text style={styles.headerSub}>CORE ENTITY MANAGEMENT</Text>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Search size={18} color="#475569" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search core profiles..."
            placeholderTextColor="#475569"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <FlatList
        data={users.filter((u) =>
          (u.baby_name || u.email || '')
            .toLowerCase()
            .includes(search.toLowerCase()),
        )}
        contentContainerStyle={styles.list} // Critical bottom padding
        renderItem={({ item }) => {
          const isBanned = item.status === 'banned';
          const cardStyle = StyleSheet.flatten([
            styles.userCard,
            isBanned && styles.bannedBorder,
          ]);

          return (
            <GlassCard style={cardStyle} variant={isBanned ? 'main' : 'teal'}>
              <View style={styles.cardRow}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {(item.baby_name || 'U')[0].toUpperCase()}
                  </Text>
                </View>
                <View style={styles.userInfo}>
                  <Text
                    style={[styles.userName, isBanned && styles.strikethrough]}
                  >
                    {item.baby_name || 'New Family'}
                  </Text>
                  <View style={styles.roleRow}>
                    <Text style={styles.userRole}>
                      {item.role.replace('_', ' ')}
                    </Text>
                    {item.role === 'ADMIN' && (
                      <ShieldCheck size={10} color={Theme.colors.primary} />
                    )}
                  </View>
                </View>
                <View style={styles.actions}>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedUser(item);
                      setRoleModal(true);
                    }}
                    style={styles.iconBtn}
                  >
                    <UserCog size={18} color={Theme.colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleBanToggle(item)}
                    style={[
                      styles.iconBtn,
                      isBanned ? styles.activeBg : styles.banBg,
                    ]}
                  >
                    {isBanned ? (
                      <CheckCircle size={18} color="#9AE6B4" />
                    ) : (
                      <Ban size={18} color="#F87171" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </GlassCard>
          );
        }}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadUsers}
            tintColor={Theme.colors.primary}
          />
        }
      />

      <Modal visible={roleModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <GlassCard style={styles.modalContent}>
            <Text style={styles.modalTitle}>UPDATE SYSTEM ACCESS</Text>
            {['MEMBER', 'PREMIUM_MEMBER', 'ADMIN'].map((r) => (
              <TouchableOpacity
                key={r}
                onPress={() => handleRoleUpdate(r)}
                style={styles.modalOption}
              >
                <Text style={styles.modalOptionText}>{r}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={() => setRoleModal(false)}
              style={styles.closeBtn}
            >
              <Text style={styles.closeBtnText}>CANCEL</Text>
            </TouchableOpacity>
          </GlassCard>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#020617' },
  header: {
    padding: 24,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -1,
  },
  headerSub: {
    color: '#475569',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginTop: 4,
  },
  searchSection: { padding: 20 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A101F',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 50,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    color: '#FFF',
    fontWeight: '700',
    fontSize: 13,
  },
  list: { paddingHorizontal: 20, paddingBottom: 120 }, // Fixed: Prevents overlap with tab bar
  userCard: { marginBottom: 12, padding: 16, borderRadius: 24 },
  bannedBorder: { borderColor: 'rgba(248, 113, 113, 0.15)' },
  cardRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(79, 209, 199, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(79, 209, 199, 0.1)',
  },
  avatarText: { color: '#4FD1C7', fontWeight: '900', fontSize: 18 },
  userInfo: { flex: 1, marginLeft: 16 },
  userName: { color: '#FFF', fontSize: 15, fontWeight: '800' },
  strikethrough: { textDecorationLine: 'line-through', color: '#475569' },
  roleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  userRole: {
    color: '#475569',
    fontSize: 9,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  actions: { flexDirection: 'row', gap: 10 },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  banBg: { backgroundColor: 'rgba(248, 113, 113, 0.03)' },
  activeBg: { backgroundColor: 'rgba(154, 230, 180, 0.03)' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: { padding: 32, borderRadius: 32 },
  modalTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: 1.5,
  },
  modalOption: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  modalOptionText: {
    color: '#4FD1C7',
    fontWeight: '900',
    textAlign: 'center',
    fontSize: 16,
  },
  closeBtn: { marginTop: 24, alignItems: 'center' },
  closeBtnText: { color: '#475569', fontWeight: '900', fontSize: 12 },
});
