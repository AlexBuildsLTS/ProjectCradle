/**
 * PROJECT CRADLE: FAMILY COMMAND CENTER V3.0 (ULTIMATE COMMAND)
 * Path: app/(app)/family.tsx
 * ----------------------------------------------------------------------------
 * FEATURES:
 * 1. BALANCED ARCHITECTURE: 800px focused column with 480px fixed modals.
 * 2. BIOMETRIC EDIT FLOW: Live gateway to update name, weight, and DOB.
 * 3. STAGGERED SPRINGS: Animated staging for high-fidelity entry.
 * 4. UX: Standardized Haptics and AAA Glassmorphism contrast.
 */

import * as Haptics from 'expo-haptics';
import {
  Baby,
  Calendar,
  Edit3,
  History,
  Plus,
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

interface BabyRecord {
  id: string;
  name: string;
  dob: string;
  birth_weight_grams: number | null;
}

export default function FamilyScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const { user } = useAuth();
  const {
    babies = [],
    selectedBaby = null,
    selectBaby = () => {},
    refreshBabies = async () => {},
  } = useFamily() as any;

  const [loading, setLoading] = useState(false);
  const [modalMode, setModalMode] = useState<'ADD' | 'EDIT'>('ADD');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // BIOMETRIC INPUT STATE
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [weight, setWeight] = useState('');

  const triggerFeedback = (style = Haptics.ImpactFeedbackStyle.Medium) => {
    if (Platform.OS !== 'web') Haptics.impactAsync(style);
  };

  const openAddModal = () => {
    setModalMode('ADD');
    setEditingId(null);
    setName('');
    setDob('');
    setWeight('');
    setShowModal(true);
  };

  const openEditModal = (baby: BabyRecord) => {
    setModalMode('EDIT');
    setEditingId(baby.id);
    setName(baby.name);
    setDob(baby.dob);
    setWeight(baby.birth_weight_grams?.toString() || '');
    setShowModal(true);
  };

  const handleSaveBaby = async () => {
    if (!name || !dob)
      return Alert.alert(
        'REQUIRED',
        'Identifier and birth date are mandatory.',
      );
    if (!user?.id) return Alert.alert('SYNC ERROR', 'User core not detected.');

    setLoading(true);
    try {
      const payload = {
        parent_id: user.id,
        name: name.trim(),
        dob: dob,
        birth_weight_grams: weight ? parseInt(weight) : null,
      };

      let error;
      if (modalMode === 'ADD') {
        const result = await supabase.from('babies').insert([payload]);
        error = result.error;
      } else {
        const result = await supabase
          .from('babies')
          .update(payload)
          .eq('id', editingId);
        error = result.error;
      }

      if (error) throw error;

      if (Platform.OS !== 'web')
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setShowModal(false);
      await refreshBabies();
    } catch (e: any) {
      Alert.alert('SYNC FAILED', e.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePurge = async (id: string, babyName: string) => {
    triggerFeedback(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert(
      'PURGE CORE',
      `Permanently delete all biometric data for ${babyName}?`,
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
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={[styles.mainWrapper, isDesktop && styles.desktopWidth]}>
          {/* 1. COMMAND HEADER: Balanced Spacing */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>FAMILY COMMAND</Text>
              <Text style={styles.subtitle}>
                ACTIVE CORES: {babies?.length || 0}
              </Text>
            </View>
            <TouchableOpacity style={styles.addBtn} onPress={openAddModal}>
              <Plus size={18} color="#020617" strokeWidth={3} />
              <Text style={styles.addBtnText}>NEW CORE</Text>
            </TouchableOpacity>
          </View>

          {/* 2. ACTIVE CONTEXT MODULE */}
          <Text style={styles.sectionLabel}>PRIMARY FOCUS</Text>
          {selectedBaby ? (
            <AnimatedCard>
              <GlassCard style={styles.activeCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.activeIconBox}>
                    <Baby size={22} color={Theme.colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.activeName}>
                      {selectedBaby.name.toUpperCase()}
                    </Text>
                    <Text style={styles.activeStatus}>
                      BIOMETRIC FEED ACTIVE
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => openEditModal(selectedBaby)}
                    style={styles.editIconBtn}
                  >
                    <Edit3 size={18} color={Theme.colors.primary} />
                  </TouchableOpacity>
                </View>
                <View style={styles.activeStats}>
                  <View style={styles.stat}>
                    <Text style={styles.statLabel}>BORN</Text>
                    <Text style={styles.statValue}>{selectedBaby.dob}</Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.stat}>
                    <Text style={styles.statLabel}>WEIGHT</Text>
                    <Text style={styles.statValue}>
                      {selectedBaby.birth_weight_grams || '--'}g
                    </Text>
                  </View>
                </View>
              </GlassCard>
            </AnimatedCard>
          ) : (
            <GlassCard style={styles.emptyCard}>
              <History size={32} color="#475569" opacity={0.3} />
              <Text style={styles.emptyText}>
                INITIALIZE A CORE TO BEGIN TRACKING
              </Text>
            </GlassCard>
          )}

          {/* 3. IDENTITY LEDGER: Staggered Entry */}
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
                      size={18}
                      color={
                        selectedBaby?.id === b.id
                          ? Theme.colors.primary
                          : '#94A3B8'
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
                      <Edit3
                        size={16}
                        color={Theme.colors.primary}
                        opacity={0.8}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handlePurge(b.id, b.name)}
                      style={styles.subActionBtn}
                    >
                      <Trash2 size={16} color="#F87171" opacity={0.6} />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </AnimatedCard>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* 4. MODAL: BIOMETRIC PROCESSOR (ADD/EDIT) */}
      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalWrapper, isDesktop && styles.desktopModal]}>
            <GlassCard style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <View style={styles.modalTitleRow}>
                  <Sparkles size={16} color={Theme.colors.primary} />
                  <Text style={styles.modalTitle}>
                    {modalMode === 'ADD' ? 'INITIALIZE CORE' : 'UPDATE CORE'}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setShowModal(false)}>
                  <Text style={styles.closeText}>CLOSE</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.form}>
                <Text style={styles.inputLabel}>SUBJECT IDENTIFIER</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g. Steven"
                  placeholderTextColor="#475569"
                />

                <Text style={styles.inputLabel}>
                  BIRTH SEQUENCE (YYYY-MM-DD)
                </Text>
                <View style={styles.inputWrap}>
                  <Calendar size={18} color={Theme.colors.primary} />
                  <TextInput
                    style={styles.flexInput}
                    value={dob}
                    onChangeText={setDob}
                    placeholder="2025-01-01"
                    placeholderTextColor="#475569"
                  />
                </View>

                <Text style={styles.inputLabel}>BIOMETRIC WEIGHT (GRAMS)</Text>
                <View style={styles.inputWrap}>
                  <Scale size={18} color={Theme.colors.primary} />
                  <TextInput
                    style={styles.flexInput}
                    value={weight}
                    onChangeText={setWeight}
                    keyboardType="numeric"
                    placeholder="3500"
                    placeholderTextColor="#475569"
                  />
                </View>

                <TouchableOpacity
                  style={styles.submitBtn}
                  onPress={handleSaveBaby}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#020617" />
                  ) : (
                    <Text style={styles.submitText}>
                      {modalMode === 'ADD' ? 'ACTIVATE CORE' : 'SYNC UPDATES'}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </GlassCard>
          </View>
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

// --- BALANCED STYLES ---
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#020617', alignItems: 'center' },
  scroll: { width: '100%', alignItems: 'center', paddingBottom: 120 },
  mainWrapper: { width: '100%', padding: 24 },
  desktopWidth: { maxWidth: 800 }, // REFINED: Balanced column width

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Ensures distance between text and button
    alignItems: 'center',
    marginBottom: 40,
    paddingTop: 20,
    width: '100%',
  },
  title: { color: '#FFF', fontSize: 24, fontWeight: '900', letterSpacing: 1 },
  subtitle: {
    color: Theme.colors.primary,
    fontSize: 9,
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
    marginLeft: 20, // Prevents gluing on very small widths
  },
  addBtnText: { color: '#020617', fontWeight: '900', fontSize: 11 },

  sectionLabel: {
    color: '#475569',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 16,
    marginTop: 12,
    marginLeft: 4,
    textTransform: 'uppercase',
  },
  activeCard: {
    padding: 24,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(79, 209, 199, 0.15)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  activeIconBox: {
    padding: 10,
    backgroundColor: 'rgba(79, 209, 199, 0.08)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(79, 209, 199, 0.1)',
  },
  activeName: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  activeStatus: {
    color: Theme.colors.primary,
    fontSize: 8,
    fontWeight: '900',
    marginTop: 2,
  },
  editIconBtn: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 10,
  },

  activeStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.01)',
    padding: 18,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  stat: { flex: 1, alignItems: 'center' },
  statLabel: {
    color: '#475569',
    fontSize: 7,
    fontWeight: '900',
    marginBottom: 6,
  },
  statValue: { color: '#FFF', fontSize: 14, fontWeight: '800' },
  divider: { width: 1, height: 16, backgroundColor: 'rgba(255,255,255,0.05)' },

  ledger: { gap: 10 },
  ledgerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 18,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  ledgerItemActive: {
    borderColor: 'rgba(79, 209, 199, 0.12)',
    backgroundColor: 'rgba(79, 209, 199, 0.03)',
  },
  ledgerIcon: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ledgerName: { color: '#94A3B8', fontWeight: '800', fontSize: 14 },
  ledgerDob: { color: '#475569', fontSize: 9, marginTop: 2, fontWeight: '700' },
  ledgerActions: { flexDirection: 'row', gap: 8 },
  subActionBtn: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.96)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalWrapper: { width: '100%' },
  desktopModal: { maxWidth: 480 },
  modalContent: {
    padding: 32,
    borderRadius: 36,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  modalTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  modalTitle: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 2,
  },
  closeText: { color: '#475569', fontWeight: '900', fontSize: 10 },
  form: { gap: 14 },
  inputLabel: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginLeft: 4,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 18,
    borderRadius: 16,
    color: '#FFF',
    fontWeight: '700',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    fontSize: 14,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  flexInput: {
    flex: 1,
    paddingVertical: 18,
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
  submitBtn: {
    backgroundColor: Theme.colors.primary,
    padding: 22,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 12,
  },
  submitText: {
    color: '#020617',
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 1,
  },
  emptyCard: {
    padding: 60,
    alignItems: 'center',
    gap: 16,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  emptyText: {
    color: '#475569',
    fontWeight: '900',
    fontSize: 10,
    letterSpacing: 1,
  },
});
