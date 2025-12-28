/**
 * PROJECT CRADLE: FAMILY MANAGEMENT CORE V1.1 (AAA+ TIER)
 * Path: app/(app)/family.tsx
 * FIXES:
 * 1. DEFENSIVE CODING: Added default values to destructuring to prevent '.length' crashes.
 * 2. SCHEMA SYNC: Strictly maps to public.babies (parent_id, birth_weight_grams, dob).
 * 3. TS TYPE SAFETY: Explicitly typed baby mapping parameters.
 */
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import {
  Baby,
  Calendar,
  History,
  Plus,
  Scale,
  ShieldCheck,
  Trash2,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { GlassCard } from '@/components/glass/GlassCard';
import { useAuth } from '@/context/auth';
import { useFamily } from '@/context/family';
import { supabase } from '@/lib/supabase';

// Define Interface for the Ledger
interface BabyRecord {
  id: string;
  name: string;
  dob: string;
  birth_weight_grams: number | null;
}

export default function FamilyScreen() {
  const router = useRouter();
  const { user } = useAuth();

  // FIX: Default values to prevent undefined.length crash
  const {
    babies = [],
    selectedBaby = null,
    selectBaby = () => {},
    refreshBabies = async () => {},
  } = useFamily();

  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // BIOMETRIC INPUT STATE
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [weight, setWeight] = useState('');

  const triggerFeedback = () => {
    if (Platform.OS !== 'web')
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleAddBaby = async () => {
    if (!name || !dob)
      return Alert.alert(
        'REQUIRED',
        'Core identifier and birth date are mandatory.',
      );
    if (!user?.id) return Alert.alert('SYNC ERROR', 'User core not detected.');

    setLoading(true);
    try {
      // Handshake with public.babies
      const { error } = await supabase.from('babies').insert([
        {
          parent_id: user.id,
          name: name.trim(),
          dob: dob,
          birth_weight_grams: weight ? parseInt(weight) : null,
        },
      ]);

      if (error) throw error;

      Alert.alert(
        'CORE ACTIVATED',
        `${name.toUpperCase()} registered to the family ledger.`,
      );
      setShowAddModal(false);
      setName('');
      setDob('');
      setWeight('');
      await refreshBabies();
    } catch (e: any) {
      Alert.alert('SYNC FAILED', e.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePurge = async (id: string, babyName: string) => {
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
            if (error) Alert.alert('ERROR', error.message);
            else await refreshBabies();
          },
        },
      ],
    );
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.scroll}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>FAMILY CORE</Text>
          <Text style={styles.subtitle}>
            ACTIVE IDENTITIES: {babies?.length || 0}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setShowAddModal(true)}
        >
          <Plus size={20} color="#020617" />
          <Text style={styles.addBtnText}>ADD BABY</Text>
        </TouchableOpacity>
      </View>

      {/* MODULE: LOCKED BIOMETRIC CORE */}
      <Text style={styles.sectionLabel}>ACTIVE CONTEXT</Text>
      {selectedBaby ? (
        <GlassCard style={styles.activeCard}>
          <View style={styles.cardHeader}>
            <View style={styles.activeIcon}>
              <Baby size={24} color="#4FD1C7" />
            </View>
            <View>
              <Text style={styles.activeName}>
                {selectedBaby.name.toUpperCase()}
              </Text>
              <Text style={styles.activeStatus}>CORE SECURED & ACTIVE</Text>
            </View>
            <ShieldCheck
              size={18}
              color="#4FD1C7"
              style={{ marginLeft: 'auto' }}
            />
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
      ) : (
        <GlassCard style={styles.emptyCard}>
          <History size={32} color="#475569" />
          <Text style={styles.emptyText}>
            No biometric core selected. Use the ledger below.
          </Text>
        </GlassCard>
      )}

      {/* MODULE: IDENTITY LEDGER */}
      <Text style={styles.sectionLabel}>IDENTITY LEDGER</Text>
      <View style={styles.ledger}>
        {babies.map((b: BabyRecord) => (
          <TouchableOpacity
            key={b.id}
            style={[
              styles.ledgerItem,
              selectedBaby?.id === b.id && styles.ledgerItemActive,
            ]}
            onPress={() => {
              triggerFeedback();
              selectBaby(b.id);
            }}
          >
            <View style={styles.ledgerIcon}>
              <Baby
                size={18}
                color={selectedBaby?.id === b.id ? '#4FD1C7' : '#94A3B8'}
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
              <Text style={styles.ledgerDob}>BORN: {b.dob}</Text>
            </View>
            <TouchableOpacity
              onPress={() => handlePurge(b.id, b.name)}
              style={styles.purgeBtn}
            >
              <Trash2 size={16} color="#F87171" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>

      {/* MODAL: INITIALIZE NEW CORE */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <GlassCard style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>INITIALIZE NEW CORE</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Text style={styles.closeText}>CLOSE</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.form}>
              <Text style={styles.inputLabel}>IDENTIFIER NAME</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="e.g. Steven"
                placeholderTextColor="#475569"
              />

              <Text style={styles.inputLabel}>BIRTH DATE (YYYY-MM-DD)</Text>
              <View style={styles.inputWrap}>
                <Calendar size={18} color="#4FD1C7" />
                <TextInput
                  style={styles.flexInput}
                  value={dob}
                  onChangeText={setDob}
                  placeholder="2025-01-01"
                  placeholderTextColor="#475569"
                />
              </View>

              <Text style={styles.inputLabel}>BIRTH WEIGHT (GRAMS)</Text>
              <View style={styles.inputWrap}>
                <Scale size={18} color="#4FD1C7" />
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
                onPress={handleAddBaby}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#020617" />
                ) : (
                  <Text style={styles.submitText}>ACTIVATE IDENTITY</Text>
                )}
              </TouchableOpacity>
            </View>
          </GlassCard>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#020617' },
  scroll: { padding: 24, paddingBottom: 120 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  title: { color: '#FFF', fontSize: 28, fontWeight: '900', letterSpacing: 1 },
  subtitle: {
    color: '#4FD1C7',
    fontSize: 10,
    fontWeight: '900',
    marginTop: 4,
    letterSpacing: 2,
  },
  addBtn: {
    backgroundColor: '#4FD1C7',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  addBtnText: { color: '#020617', fontWeight: '900', fontSize: 11 },
  sectionLabel: {
    color: '#475569',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 20,
    marginTop: 10,
  },
  activeCard: {
    padding: 24,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(79, 209, 199, 0.2)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  activeIcon: {
    padding: 12,
    backgroundColor: 'rgba(79, 209, 199, 0.1)',
    borderRadius: 16,
  },
  activeName: { color: '#FFF', fontSize: 22, fontWeight: '900' },
  activeStatus: {
    color: '#4FD1C7',
    fontSize: 9,
    fontWeight: '800',
    marginTop: 2,
  },
  activeStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.02)',
    padding: 16,
    borderRadius: 20,
  },
  stat: { flex: 1, alignItems: 'center' },
  statLabel: {
    color: '#475569',
    fontSize: 9,
    fontWeight: '900',
    marginBottom: 4,
  },
  statValue: { color: '#FFF', fontSize: 15, fontWeight: '800' },
  divider: { width: 1, height: 20, backgroundColor: 'rgba(255,255,255,0.05)' },
  ledger: { gap: 12 },
  ledgerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  ledgerItemActive: {
    borderColor: 'rgba(79, 209, 199, 0.1)',
    backgroundColor: 'rgba(79, 209, 199, 0.05)',
  },
  ledgerIcon: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ledgerName: { color: '#94A3B8', fontWeight: '800', fontSize: 14 },
  ledgerDob: { color: '#475569', fontSize: 11, marginTop: 4 },
  purgeBtn: { padding: 10 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: { padding: 32, borderRadius: 40 },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  modalTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 2,
  },
  closeText: { color: '#475569', fontWeight: '900', fontSize: 11 },
  form: { gap: 20 },
  inputLabel: {
    color: '#4FD1C7',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    padding: 18,
    borderRadius: 16,
    color: '#FFF',
    fontWeight: '700',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255,255,255,0.02)',
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  flexInput: { flex: 1, paddingVertical: 18, color: '#FFF', fontWeight: '700' },
  submitBtn: {
    backgroundColor: '#4FD1C7',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  submitText: { color: '#020617', fontWeight: '900', fontSize: 13 },
  emptyCard: { padding: 40, alignItems: 'center', gap: 16, borderRadius: 32 },
  emptyText: { color: '#475569', fontWeight: '700', fontSize: 12 },
});
