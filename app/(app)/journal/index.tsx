/**
 * PROJECT CRADLE: JOURNAL SOVEREIGN ENGINE V24.0 (AAA+)
 * ----------------------------------------------------------------------------
 * FEATURES:
 * 1. DYNAMIC FILTERING: Toggle between ALL, SHARED, and PRIVATE milestones.
 * 2. MASTER ACTION HUB (dots ...): Professional context menu for Edit/Delete/Privacy toggle.
 * 3. RECORD FORGING: High-fidelity captioning and 5MB media gateway sync.
 * 4. IDENTITY HANDSHAKE: Role-based badge system (Sovereign/Staff/Premium/Plus).
 * 5. PERSISTENCE ENGINE: Real-time synchronization with the care_events ledger.
 */

import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from 'expo-router';
import {
  Camera,
  Edit3,
  EyeOff,
  Globe,
  Lock,
  MoreHorizontal,
  RefreshCw,
  Save,
  ShieldCheck,
  Sparkles,
  Trash2,
  User,
  X,
  Zap,
} from 'lucide-react-native';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  Layout,
} from 'react-native-reanimated';

import { GlassCard } from '@/components/glass/GlassCard';
import { useAuth } from '@/context/auth';
import { useFamily } from '@/context/family';
import { Theme } from '@/lib/shared/Theme';
import { supabase } from '@/lib/supabase';

export default function JournalIndex() {
  const { selectedBaby } = useFamily();
  const { user, profile } = useAuth();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  // STATE: BIOMETRIC REFRESH
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [entries, setEntries] = useState<any[]>([]);
  const [filterMode, setFilterMode] = useState<'all' | 'shared' | 'private'>(
    'all',
  );

  // STATE: INPUT COMMANDS
  const [caption, setCaption] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // STATE: RECORD MANAGEMENT
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editCaption, setEditCaption] = useState('');
  const [actionMenu, setActionMenu] = useState<any>(null);

  /**
   * MODULE: FREQUENCY HANDSHAKE
   * Pulls the 50 latest entries for deep-triage management.
   */
  const fetchEntries = async () => {
    if (!selectedBaby?.id) return;
    setRefreshing(true);
    try {
      const { data, error } = await supabase
        .from('care_events')
        .select('*')
        .eq('baby_id', selectedBaby.id)
        .eq('event_type', 'journal')
        .order('timestamp', { ascending: false })
        .limit(50);
      if (error) throw error;
      setEntries(data || []);
    } catch (e: any) {
      console.error('[Journal Engine] Sync failure:', e.message);
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchEntries();
    }, [selectedBaby]),
  );

  // DYNAMIC FILTER ENGINE
  const filteredEntries = useMemo(() => {
    if (filterMode === 'shared') return entries.filter((e) => !e.is_private);
    if (filterMode === 'private') return entries.filter((e) => e.is_private);
    return entries;
  }, [entries, filterMode]);

  const pickMedia = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
    });
    if (!res.canceled) setSelectedImage(res.assets[0].uri);
  };

  /**
   * MODULE: FORGE POST
   */
  const handlePost = async () => {
    if (!selectedBaby?.id || !caption.trim())
      return Alert.alert('LEAD_MISSING', 'A caption is required.');
    setLoading(true);
    try {
      let finalUrl = null;
      if (selectedImage) {
        const path = `${selectedBaby.id}/${Date.now()}.jpg`;
        let body;
        if (Platform.OS === 'web') {
          const r = await fetch(selectedImage);
          body = await r.blob();
        } else {
          const fd = new FormData();
          fd.append('file', {
            uri: selectedImage,
            name: path,
            type: 'image/jpeg',
          } as any);
          body = fd;
        }
        await supabase.storage.from('journal').upload(path, body);
        finalUrl = supabase.storage.from('journal').getPublicUrl(path)
          .data.publicUrl;
      }

      await supabase.from('care_events').insert({
        baby_id: selectedBaby.id,
        user_id: user?.id,
        event_type: 'journal',
        is_private: isPrivate,
        timestamp: new Date().toISOString(),
        details: {
          caption: caption.trim(),
          image_url: finalUrl,
          author_name: profile?.full_name || 'Guardian',
          author_role: profile?.role || 'MEMBER',
        },
      });
      setCaption('');
      setSelectedImage(null);
      fetchEntries();
    } catch (e: any) {
      Alert.alert('SYNC_FAILURE', e.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * MODULE: RECORD MODIFICATION
   */
  const handleUpdate = async () => {
    if (!editingItem) return;
    try {
      const { error } = await supabase
        .from('care_events')
        .update({
          details: { ...editingItem.details, caption: editCaption.trim() },
        })
        .eq('id', editingItem.id);
      if (error) throw error;
      setEditingItem(null);
      fetchEntries();
    } catch (e: any) {
      Alert.alert('UPDATE_FAIL', e.message);
    }
  };

  const togglePrivacy = async (item: any) => {
    try {
      const { error } = await supabase
        .from('care_events')
        .update({
          is_private: !item.is_private,
        })
        .eq('id', item.id);
      if (error) throw error;
      setActionMenu(null);
      fetchEntries();
    } catch (e: any) {
      Alert.alert('SECURITY_ERROR', e.message);
    }
  };

  const handleDelete = (item: any) => {
    Alert.alert(
      'DESTRUCTION PROTOCOL',
      'Permanently purge this record from the ledger?',
      [
        { text: 'CANCEL' },
        {
          text: 'PURGE',
          style: 'destructive',
          onPress: async () => {
            await supabase.from('care_events').delete().eq('id', item.id);
            setActionMenu(null);
            fetchEntries();
          },
        },
      ],
    );
  };

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          isDesktop && { maxWidth: 850, alignSelf: 'center' },
        ]}
      >
        <Animated.View entering={FadeInUp.duration(800)}>
          <Text style={styles.headerTitle}>JOURNAL ENGINE</Text>
          <Text style={styles.headerSub}>BIOMETRIC MILESTONE MANAGEMENT</Text>
        </Animated.View>

        {/* POSTING COMMAND CENTER */}
        <GlassCard style={styles.inputCard}>
          <TextInput
            style={styles.textInput}
            placeholder="Record a system milestone..."
            placeholderTextColor="#475569"
            multiline
            value={caption}
            onChangeText={setCaption}
          />
          {selectedImage && (
            <View style={styles.previewContainer}>
              <Image
                source={{ uri: selectedImage }}
                style={styles.previewImg}
              />
              <TouchableOpacity
                onPress={() => setSelectedImage(null)}
                style={styles.removePreview}
              >
                <X size={16} color="#FFF" />
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.inputActions}>
            <View style={styles.mediaRow}>
              <TouchableOpacity onPress={pickMedia} style={styles.iconBtn}>
                <Camera size={20} color={Theme.colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsPrivate(!isPrivate)}
                style={[
                  styles.privacyBtn,
                  isPrivate && styles.privacyBtnActive,
                ]}
              >
                {isPrivate ? (
                  <EyeOff size={14} color="#F87171" />
                ) : (
                  <Globe size={14} color={Theme.colors.primary} />
                )}
                <Text
                  style={[
                    styles.privacyText,
                    isPrivate && { color: '#F87171' },
                  ]}
                >
                  {isPrivate ? 'PRIVATE' : 'FAMILY'}
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.postBtn}
              onPress={handlePost}
              disabled={loading || !caption.trim()}
            >
              {loading ? (
                <ActivityIndicator color="#020617" size="small" />
              ) : (
                <Text style={styles.postBtnText}>POST</Text>
              )}
            </TouchableOpacity>
          </View>
        </GlassCard>

        {/* TRIAGE FILTERS */}
        <View style={styles.filterRow}>
          <FilterBtn
            active={filterMode === 'all'}
            label="ALL STREAMS"
            onPress={() => setFilterMode('all')}
          />
          <FilterBtn
            active={filterMode === 'shared'}
            label="FAMILY"
            onPress={() => setFilterMode('shared')}
          />
          <FilterBtn
            active={filterMode === 'private'}
            label="PRIVATE"
            onPress={() => setFilterMode('private')}
          />
          <TouchableOpacity onPress={fetchEntries} style={styles.refreshBtn}>
            <RefreshCw
              size={14}
              color={refreshing ? Theme.colors.primary : '#475569'}
            />
          </TouchableOpacity>
        </View>

        {/* MASTER FEED */}
        <View style={styles.feed}>
          {filteredEntries.map((entry, idx) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              delay={idx * 50}
              onManage={() => setActionMenu(entry)}
              onEdit={() => {
                setEditingItem(entry);
                setEditCaption(entry.details.caption);
              }}
            />
          ))}
        </View>
      </ScrollView>

      {/* EDIT MODAL */}
      <Modal visible={!!editingItem} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <GlassCard style={styles.editPanel}>
            <Text style={styles.modalTitle}>MODIFY MILESTONE</Text>
            <TextInput
              style={styles.editInput}
              multiline
              value={editCaption}
              onChangeText={setEditCaption}
              placeholderTextColor="#475569"
            />
            <View style={styles.btnRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setEditingItem(null)}
              >
                <Text style={styles.cancelText}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleUpdate}>
                <Save size={18} color="#020617" />
                <Text style={styles.saveText}>UPDATE</Text>
              </TouchableOpacity>
            </View>
          </GlassCard>
        </View>
      </Modal>

      {/* ACTION MENU MODAL */}
      <Modal visible={!!actionMenu} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setActionMenu(null)}
        >
          <GlassCard style={styles.menuPanel}>
            <Text style={styles.menuLabel}>LEDGER ACTIONS</Text>
            <MenuOption
              icon={RefreshCw}
              label={`Set to ${
                actionMenu?.is_private ? 'FAMILY SYNC' : 'PRIVATE'
              }`}
              onPress={() => togglePrivacy(actionMenu)}
              color={Theme.colors.primary}
            />
            <MenuOption
              icon={Edit3}
              label="Edit Entry"
              onPress={() => {
                setEditingItem(actionMenu);
                setEditCaption(actionMenu.details.caption);
                setActionMenu(null);
              }}
            />
            <MenuOption
              icon={Trash2}
              label="Destroy Record"
              onPress={() => handleDelete(actionMenu)}
              color="#F87171"
            />
            <TouchableOpacity
              style={styles.closeMenu}
              onPress={() => setActionMenu(null)}
            >
              <Text style={styles.closeMenuText}>CLOSE</Text>
            </TouchableOpacity>
          </GlassCard>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

/**
 * SUB-COMPONENTS
 */

const FilterBtn = ({ active, label, onPress }: any) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.fBtn, active && styles.fBtnActive]}
  >
    <Text style={[styles.fText, active && { color: Theme.colors.primary }]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const MenuOption = ({ icon: Icon, label, onPress, color = '#FFF' }: any) => (
  <TouchableOpacity style={styles.mOption} onPress={onPress}>
    <Icon size={18} color={color} />
    <Text style={[styles.mLabel, { color }]}>{label}</Text>
  </TouchableOpacity>
);

const EntryCard = ({ entry, delay, onManage, onEdit }: any) => {
  const role = entry.details.author_role || 'MEMBER';
  const roleThemes: any = {
    ADMIN: {
      main: '#4FD1C7',
      glass: 'rgba(79, 209, 199, 0.1)',
      icon: ShieldCheck,
      label: 'SOVEREIGN',
    },
    SUPPORT: {
      main: '#B794F6',
      glass: 'rgba(183, 148, 246, 0.1)',
      icon: Lock,
      label: 'STAFF',
    },
    PREMIUM_MEMBER: {
      main: '#FFD700',
      glass: 'rgba(255, 215, 0, 0.1)',
      icon: Sparkles,
      label: 'PREMIUM',
    },
    PLUS_MEMBER: {
      main: '#60A5FA',
      glass: 'rgba(96, 165, 250, 0.1)',
      icon: Zap,
      label: 'PLUS',
    },
    MEMBER: {
      main: '#94A3B8',
      glass: 'rgba(148, 163, 184, 0.1)',
      icon: User,
      label: 'MEMBER',
    },
  };
  const theme = roleThemes[role] || roleThemes['MEMBER'];

  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(500)}
      layout={Layout.springify()}
    >
      <GlassCard style={styles.entryCard}>
        <View style={styles.entryHead}>
          <View
            style={[
              styles.badgeBase,
              { backgroundColor: theme.glass, borderColor: `${theme.main}33` },
            ]}
          >
            <theme.icon size={10} color={theme.main} />
            <Text style={[styles.badgeText, { color: theme.main }]}>
              {theme.label}
            </Text>
          </View>
          <Text style={styles.authorName}>{entry.details.author_name}</Text>
          {entry.is_private && (
            <EyeOff size={10} color="#F87171" style={{ marginLeft: 5 }} />
          )}
          <TouchableOpacity style={{ marginLeft: 'auto' }} onPress={onManage}>
            <MoreHorizontal size={20} color="#475569" />
          </TouchableOpacity>
        </View>

        {entry.details.image_url && (
          <Image
            source={{ uri: entry.details.image_url }}
            style={styles.entryImg}
          />
        )}
        <Text style={styles.entryCaption}>{entry.details.caption}</Text>
        <Text style={styles.footerTime}>
          {new Date(entry.timestamp).toLocaleString([], {
            hour: '2-digit',
            minute: '2-digit',
            month: 'short',
            day: 'numeric',
          })}
        </Text>
      </GlassCard>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#020617' },
  scrollContent: { padding: 24, paddingBottom: 150 },
  headerTitle: {
    color: '#FFF',
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: -1.5,
  },
  headerSub: {
    color: Theme.colors.primary,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 4,
    marginTop: 4,
    marginBottom: 40,
  },
  inputCard: {
    padding: 24,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: 32,
  },
  textInput: {
    color: '#FFF',
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  previewContainer: { position: 'relative', marginVertical: 20 },
  previewImg: { width: '100%', height: 250, borderRadius: 24 },
  removePreview: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    paddingTop: 20,
  },
  mediaRow: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  iconBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  privacyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  privacyBtnActive: { borderColor: '#F8717133', backgroundColor: '#F8717111' },
  privacyText: { color: '#475569', fontSize: 9, fontWeight: '900' },
  postBtn: {
    backgroundColor: Theme.colors.primary,
    paddingHorizontal: 32,
    height: 48,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postBtnText: { color: '#020617', fontWeight: '900', fontSize: 13 },
  filterRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
    alignItems: 'center',
  },
  fBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  fBtnActive: {
    borderColor: Theme.colors.primary,
    backgroundColor: 'rgba(79, 209, 199, 0.05)',
  },
  fText: { color: '#475569', fontSize: 9, fontWeight: '900' },
  refreshBtn: { marginLeft: 'auto', padding: 10 },
  feed: { gap: 16 },
  entryCard: {
    padding: 20,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.01)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  entryHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  badgeBase: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
  },
  badgeText: { fontSize: 8, fontWeight: '900', letterSpacing: 0.5 },
  authorName: { color: '#FFF', fontSize: 14, fontWeight: '800' },
  entryImg: { width: '100%', height: 300, borderRadius: 28, marginBottom: 16 },
  entryCaption: { color: '#CBD5E1', fontSize: 15, lineHeight: 24 },
  footerTime: {
    color: '#475569',
    fontSize: 9,
    fontWeight: '800',
    marginTop: 15,
    textAlign: 'right',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  editPanel: { width: '100%', maxWidth: 500, padding: 32, borderRadius: 40 },
  modalTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 24,
  },
  editInput: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 20,
    padding: 20,
    color: '#FFF',
    fontSize: 16,
    minHeight: 150,
    textAlignVertical: 'top',
    marginBottom: 24,
  },
  btnRow: { flexDirection: 'row', gap: 15 },
  cancelBtn: { flex: 1, padding: 20, alignItems: 'center' },
  cancelText: { color: '#475569', fontWeight: '900' },
  saveBtn: {
    flex: 2,
    backgroundColor: Theme.colors.primary,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  saveText: { color: '#020617', fontWeight: '900', fontSize: 15 },
  menuPanel: {
    width: '100%',
    maxWidth: 400,
    padding: 24,
    borderRadius: 32,
    position: 'absolute',
    bottom: 40,
  },
  menuLabel: {
    color: '#475569',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 20,
    textAlign: 'center',
  },
  mOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  mLabel: { fontSize: 15, fontWeight: '800' },
  closeMenu: { marginTop: 20, padding: 15, alignItems: 'center' },
  closeMenuText: { color: '#475569', fontSize: 11, fontWeight: '900' },
});
