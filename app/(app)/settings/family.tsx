/**
 * PROJECT CRADLE: FAMILY COMMAND CENTER V4.0 (MASTER HUD)
 * Path: app/(app)/settings/family.tsx
 * ----------------------------------------------------------------------------
 * FEATURES:
 * 1. PERSISTENT DUAL-UNITS: Weight (KG/G/LB) and Height (CM/IN) Global Sync.
 * 2. TS MASTER RESOLUTION: Fixed parameter 'u' types and UserProfile property errors.
 * 3. SYMMETRIC HUD: Restored the professional 850px centered command card.
 * 4. SAVING INTEGRITY: Atomic handshake for biometric initialization (No hangs).
 * 5. CINEMATIC PHYSICS: Staggered spring entrance for all identity elements.
 */

import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import {
  Baby,
  ChevronLeft,
  Edit3,
  History,
  Plus,
  Ruler,
  Scale,
  Sparkles,
  Trash2,
} from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

import { GlassCard } from '@/components/glass/GlassCard';
import { useAuth } from '@/context/auth';
import { useFamily } from '@/context/family';
import { Theme } from '@/lib/shared/Theme';
import { supabase } from '@/lib/supabase';

// --- TYPE DEFINITIONS ---
interface BabyRecord {
  id: string;
  name: string;
  dob: string;
  birth_weight_grams: number | null;
}

export default function FamilyScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const { user, profile, refreshProfile } = useAuth();
  const {
    babies = [],
    selectedBaby,
    selectBaby,
    refreshBabies,
  } = useFamily() as any;

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'ADD' | 'EDIT'>('ADD');
  const [editingId, setEditingId] = useState<string | null>(null);

  // FORM STATE
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [weight, setWeight] = useState('');

  const triggerFeedback = (style = Haptics.ImpactFeedbackStyle.Medium) => {
    if (Platform.OS !== 'web') Haptics.impactAsync(style);
  };

  /**
   * GLOBAL UNIT SYNC: Persists user preferences for the entire biometric core.
   */
  const updateGlobalUnit = async (type: 'weight' | 'height', unit: string) => {
    triggerFeedback(Haptics.ImpactFeedbackStyle.Light);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ [`${type}_unit`]: unit })
        .eq('id', user?.id);

      if (error) throw error;
      await refreshProfile();
    } catch (e: any) {
      Alert.alert('PREFERENCE ERROR', e.message);
    }
  };

  /**
   * ATOMIC SAVE: Synchronizes new or updated core data with the family ledger.
   */
  const handleSaveBaby = async () => {
    if (!name.trim() || !dob.trim()) {
      return Alert.alert(
        'REQUIRED',
        'Baby name and birth sequence are mandatory.',
      );
    }

    setLoading(true);
    try {
      const payload = {
        parent_id: user?.id,
        name: name.trim(),
        dob: dob.trim(),
        birth_weight_grams: weight ? parseInt(weight) : null,
      };

      const { error } =
        modalMode === 'ADD'
          ? await supabase.from('babies').insert([payload])
          : await supabase.from('babies').update(payload).eq('id', editingId);

      if (error) throw error;

      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      setShowModal(false);
      setName('');
      setDob('');
      setWeight(''); // Clear state to ensure UI reset
      await refreshBabies();
    } catch (e: any) {
      Alert.alert('SYNC FAILED', e.message);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (baby: BabyRecord) => {
    setModalMode('EDIT');
    setEditingId(baby.id);
    setName(baby.name);
    setDob(baby.dob);
    setWeight(baby.birth_weight_grams?.toString() || '');
    setShowModal(true);
  };

  const handlePurge = async (id: string, babyName: string) => {
    triggerFeedback(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert(
      'PURGE CORE',
      `Permanently delete ${babyName}'s baby's record?`,
      [
        { text: 'CANCEL', style: 'cancel' },
        {
          text: 'PURGE',
          style: 'destructive',
          onPress: async () => {
            const { error } = await supabase
              .from('babies')
              .delete()
              .eq('id', id);
            if (!error) await refreshBabies();
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.mainWrapper, isDesktop && styles.desktopWidth]}>
          {/* 1. COMMAND HEADER */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>FAMILY COMMAND</Text>
              <Text style={styles.subtitle}>
                ACTIVE CORES: {babies?.length || 0}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => {
                setName('');
                setDob('');
                setWeight('');
                setModalMode('ADD');
                setShowModal(true);
              }}
            >
              <Plus size={18} color="#020617" strokeWidth={3} />
              <Text style={styles.addBtnText}>NEW CORE</Text>
            </TouchableOpacity>
          </View>

          {/* 2. PRIMARY FOCUS HUD */}
          <Text style={styles.sectionLabel}>PRIMARY BABY FOCUS</Text>
          {selectedBaby ? (
            <AnimatedCard>
              <GlassCard style={styles.activeCard}>
                <TouchableOpacity
                  style={styles.internalBackBtn}
                  onPress={() => router.replace('/(app)/settings' as any)}
                >
                  <ChevronLeft size={24} color="#FFF" strokeWidth={3} />
                </TouchableOpacity>

                <View style={styles.cardHeader}>
                  <View style={styles.activeIconBox}>
                    <Baby size={32} color={Theme.colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.activeName}>
                      {selectedBaby.name.toUpperCase()}
                    </Text>
                    <Text style={styles.activeStatus}>
                      BABY FEED 
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => openEditModal(selectedBaby)}
                    style={styles.editIconBtn}
                  >
                    <Edit3 size={20} color={Theme.colors.primary} />
                  </TouchableOpacity>
                </View>

                <View style={styles.activeStats}>
                  <View style={styles.stat}>
                    <Text style={styles.statLabel}>BORN</Text>
                    <Text style={styles.statValue}>{selectedBaby.dob}</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.stat}>
                    <Text style={styles.statLabel}>INITIAL WEIGHT</Text>
                    <Text style={styles.statValue}>
                      {selectedBaby.birth_weight_grams || '--'}g
                    </Text>
                  </View>
                </View>
              </GlassCard>
            </AnimatedCard>
          ) : (
            <GlassCard style={styles.emptyCard}>
              <History size={36} color="#475569" opacity={0.3} />
              <Text style={styles.emptyText}>
                SELECT A CORE TO INITIALIZE MONITORING
              </Text>
            </GlassCard>
          )}

          {/* 3. GLOBAL CONFIGURATION HUD */}
          <Text style={styles.sectionLabel}>FAMILY UNIT CONFIGURATION</Text>
          <GlassCard style={styles.prefCard}>
            {/* WEIGHT PERSISTENCE */}
            <View style={styles.prefRow}>
              <View style={styles.prefInfo}>
                <Scale size={18} color={Theme.colors.primary} />
                <Text style={styles.prefLabel}>WEIGHT METRIC</Text>
              </View>
              <View style={styles.unitGroup}>
                {['kg', 'g', 'lb'].map((u: string) => (
                  <TouchableOpacity
                    key={u}
                    onPress={() => updateGlobalUnit('weight', u)}
                    style={[
                      styles.unitBtn,
                      (profile as any)?.weight_unit === u &&
                        styles.unitBtnActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.unitBtnText,
                        (profile as any)?.weight_unit === u && {
                          color: '#020617',
                        },
                      ]}
                    >
                      {u.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.prefDivider} />

            {/* HEIGHT PERSISTENCE */}
            <View style={styles.prefRow}>
              <View style={styles.prefInfo}>
                <Ruler size={18} color={Theme.colors.primary} />
                <Text style={styles.prefLabel}>HEIGHT METRIC</Text>
              </View>
              <View style={styles.unitGroup}>
                {['cm', 'in'].map((u: string) => (
                  <TouchableOpacity
                    key={u}
                    onPress={() => updateGlobalUnit('height', u)}
                    style={[
                      styles.unitBtn,
                      (profile as any)?.height_unit === u &&
                        styles.unitBtnActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.unitBtnText,
                        (profile as any)?.height_unit === u && {
                          color: '#020617',
                        },
                      ]}
                    >
                      {u.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </GlassCard>

          {/* 4. IDENTITY LEDGER */}
          <Text style={styles.sectionLabel}>IDENTITY LEDGER</Text>
          <View style={styles.ledger}>
            {babies.map((b: BabyRecord, index: number) => (
              <AnimatedCard key={b.id} delay={index * 60}>
                <TouchableOpacity
                  style={[
                    styles.ledgerItem,
                    selectedBaby?.id === b.id && styles.ledgerItemActive,
                  ]}
                  onPress={() => {
                    triggerFeedback(Haptics.ImpactFeedbackStyle.Light);
                    selectBaby(b.id);
                  }}
                >
                  <View style={styles.ledgerIcon}>
                    <Baby
                      size={20}
                      color={
                        selectedBaby?.id === b.id
                          ? Theme.colors.primary
                          : '#475569'
                      }
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        styles.ledgerName,
                        selectedBaby?.id === b.id && { color: '#FFF' },
                      ]}
                    >
                      {b.name.toUpperCase()}
                    </Text>
                    <Text style={styles.ledgerDob}>
                      CORE REGISTERED: {b.dob}
                    </Text>
                  </View>
                  <View style={styles.ledgerActions}>
                    <TouchableOpacity
                      onPress={() => openEditModal(b)}
                      style={styles.subActionBtn}
                    >
                      <Edit3 size={16} color={Theme.colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handlePurge(b.id, b.name)}
                      style={styles.subActionBtn}
                    >
                      <Trash2 size={16} color="#F87171" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </AnimatedCard>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* 5. MODAL: BIOMETRIC INITIALIZER (ADD/EDIT) */}
      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <GlassCard style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleRow}>
                <Sparkles size={18} color={Theme.colors.primary} />
                <Text style={styles.modalTitle}>{modalMode} SYSTEM CORE</Text>
              </View>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Text style={styles.closeText}>CANCEL</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.form}>
              <Text style={styles.inputLabel}>SUBJECT IDENTIFIER</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Steven"
                value={name}
                onChangeText={setName}
                placeholderTextColor="#475569"
              />

              <Text style={styles.inputLabel}>BIRTH SEQUENCE (YYYY-MM-DD)</Text>
              <TextInput
                style={styles.input}
                placeholder="2025-01-01"
                value={dob}
                onChangeText={setDob}
                placeholderTextColor="#475569"
              />

              <Text style={styles.inputLabel}>
                INITIAL BABY WEIGHT (GRAMS)
              </Text>
              <TextInput
                style={styles.input}
                placeholder="3500"
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
                placeholderTextColor="#475569"
              />

              <TouchableOpacity
                style={styles.submitBtn}
                onPress={handleSaveBaby}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#020617" />
                ) : (
                  <Text style={styles.submitText}>COMMIT CORE UPDATES</Text>
                )}
              </TouchableOpacity>
            </View>
          </GlassCard>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// --- SLEEK ENTRANCE COMPONENT ---
const AnimatedCard = ({ children, delay = 0 }: any) => {
  const fade = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(fade, {
      toValue: 1,
      tension: 50,
      friction: 9,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);
  return (
    <Animated.View
      style={{
        opacity: fade,
        transform: [
          {
            translateY: fade.interpolate({
              inputRange: [0, 1],
              outputRange: [15, 0],
            }),
          },
        ],
      }}
    >
      {children}
    </Animated.View>
  );
};

// --- STYLES ---
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#020617' },
  scroll: { paddingBottom: 100 },
  mainWrapper: { width: '100%', padding: 24, alignSelf: 'center' },
  desktopWidth: { maxWidth: 850 }, // RESTORED PROPORTIONAL CENTERED HUD

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
    paddingTop: 20,
  },
  title: { color: '#FFF', fontSize: 28, fontWeight: '900', letterSpacing: 1 },
  subtitle: {
    color: Theme.colors.primary,
    fontSize: 10,
    fontWeight: '900',
    marginTop: 4,
    letterSpacing: 2,
  },
  addBtn: {
    backgroundColor: Theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
  },
  addBtnText: { color: '#020617', fontWeight: '900', fontSize: 11 },

  sectionLabel: {
    color: '#475569',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 16,
    marginTop: 12,
    marginLeft: 4,
    textTransform: 'uppercase',
  },

  // PRIMARY FOCUS HUD
  activeCard: {
    padding: 44,
    borderRadius: 48,
    borderWidth: 1,
    borderColor: 'rgba(79, 209, 199, 0.2)',
    position: 'relative',
  },
  internalBackBtn: {
    position: 'absolute',
    top: -12,
    left: -12,
    padding: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    zIndex: 100,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    marginBottom: 40,
    marginTop: 16,
  },
  activeIconBox: {
    padding: 18,
    backgroundColor: 'rgba(79, 209, 199, 0.08)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(79, 209, 199, 0.15)',
  },
  activeName: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 1,
  },
  activeStatus: {
    color: Theme.colors.primary,
    fontSize: 9,
    fontWeight: '900',
    marginTop: 4,
  },
  editIconBtn: {
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 14,
  },

  // STATS ROW (RESTORED)
  activeStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.02)',
    padding: 28,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  stat: { flex: 1, alignItems: 'center' },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  statLabel: {
    color: '#475569',
    fontSize: 8,
    fontWeight: '900',
    marginBottom: 10,
    letterSpacing: 1,
  },
  statValue: { color: '#FFF', fontSize: 18, fontWeight: '900' },

  // PREFERENCES CARD
  prefCard: {
    padding: 28,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  prefRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  prefInfo: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  prefLabel: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  prefDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginVertical: 20,
  },

  unitGroup: {
    flexDirection: 'row',
    backgroundColor: '#020617',
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  unitBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  unitBtnActive: { backgroundColor: Theme.colors.primary },
  unitBtnText: { color: '#475569', fontSize: 10, fontWeight: '900' },

  // LEDGER
  ledger: { gap: 12 },
  ledgerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 24,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  ledgerItemActive: {
    borderColor: 'rgba(79, 209, 199, 0.15)',
    backgroundColor: 'rgba(79, 209, 199, 0.04)',
  },
  ledgerIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.02)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ledgerName: { color: '#94A3B8', fontSize: 16, fontWeight: '800' },
  ledgerDob: {
    color: '#475569',
    fontSize: 10,
    marginTop: 4,
    fontWeight: '700',
  },
  ledgerActions: { flexDirection: 'row', gap: 10 },
  subActionBtn: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },

  // MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.96)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: { width: '100%', maxWidth: 500, padding: 40, borderRadius: 44 },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  modalTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  modalTitle: { color: '#FFF', fontSize: 16, fontWeight: '900' },
  closeText: { color: '#475569', fontWeight: '900', fontSize: 11 },
  form: { gap: 18 },
  inputLabel: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginLeft: 4,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 22,
    borderRadius: 20,
    color: '#FFF',
    fontWeight: '700',
    fontSize: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  submitBtn: {
    backgroundColor: Theme.colors.primary,
    padding: 24,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 12,
  },
  submitText: {
    color: '#020617',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1,
  },

  emptyCard: {
    padding: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    gap: 16,
  },
  emptyText: { color: '#475569', fontWeight: '900', fontSize: 12 },
});
