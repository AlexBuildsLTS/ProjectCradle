/**
 * PROJECT CRADLE: SUPPORT HUB V5.2 (MASTER CORE)
 * Path: app/(app)/support.tsx
 * ----------------------------------------------------------------------------
 * FEATURES:
 * 1. FIXED TS2339: Explicitly restored 'cardLeft' and 'modalTitleHUD' to style ledger.
 * 2. DUAL-CHANNEL SYNC: Segregated staff notes from standard user biometric feed.
 * 3. ATOMIC SAVING: Synchronous identity handshake for ticket/comment creation.
 * 4. UX: High-fidelity obsidian glassmorphism with dynamic staff engine badges.
 */

import * as Haptics from 'expo-haptics';
import { useFocusEffect } from 'expo-router';
import { Clock, Lock, Plus, Send, ShieldAlert, X } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { GlassCard } from '@/components/glass/GlassCard';
import { useAuth } from '@/context/auth';
import { Theme } from '@/lib/shared/Theme';
import { supabase } from '@/lib/supabase';

const STAFF_ROLES = ['ADMIN', 'SUPPORT'];

export default function SupportScreen() {
  const { user, profile } = useAuth();
  const isStaff = profile?.role && STAFF_ROLES.includes(profile.role);

  const [activeTab, setActiveTab] = useState<'my' | 'queue' | 'faq'>(
    isStaff ? 'queue' : 'my',
  );
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createVisible, setCreateVisible] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  const [subject, setSubject] = useState('');
  const [desc, setDesc] = useState('');
  const [reply, setReply] = useState('');
  const [note, setNote] = useState('');

  const triggerFeedback = (s = Haptics.ImpactFeedbackStyle.Medium) => {
    if (Platform.OS !== 'web') Haptics.impactAsync(s);
  };

  const loadData = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      let query = supabase
        .from('support_tickets')
        .select('*, profiles(full_name, email)');

      // Standard users only see their own; Staff see the whole queue
      if (activeTab === 'my' || !isStaff) {
        query = query.eq('user_id', user.id);
      }

      const { data, error } = await query.order('created_at', {
        ascending: false,
      });
      if (error) throw error;
      setTickets(data || []);
    } catch (e: any) {
      console.error('[Support HUD] Sync Error:', e.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [activeTab]),
  );

  const handleCreate = async () => {
    if (!subject.trim() || !desc.trim())
      return Alert.alert('REQUIRED', 'Details missing.');
    setIsSubmitting(true);
    triggerFeedback(Haptics.ImpactFeedbackStyle.Heavy);

    try {
      const { error } = await supabase.from('support_tickets').insert([
        {
          user_id: user?.id,
          subject: subject.trim(),
          description: desc.trim(),
          status: 'OPEN',
        },
      ]);
      if (error) throw error;
      setCreateVisible(false);
      setSubject('');
      setDesc('');
      loadData();
    } catch (e: any) {
      Alert.alert('SYNC FAILED', e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = async (isInternal: boolean) => {
    const body = isInternal ? note : reply;
    if (!body.trim() || !selectedTicket) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('support_comments').insert([
        {
          ticket_id: selectedTicket.id,
          author_id: user?.id,
          comment_body: body.trim(),
          is_internal: isInternal,
        },
      ]);
      if (error) throw error;
      setReply('');
      setNote('');

      // Refresh Conversation Handshake
      const { data } = await supabase
        .from('support_tickets')
        .select('*, profiles(full_name), support_comments(*)')
        .eq('id', selectedTicket.id)
        .single();
      setSelectedTicket(data);
    } catch (e: any) {
      Alert.alert('REPLY FAILED', e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderTicket = ({ item }: any) => (
    <TouchableOpacity
      style={styles.ticketCard}
      onPress={async () => {
        const { data } = await supabase
          .from('support_tickets')
          .select('*, profiles(full_name, email), support_comments(*)')
          .eq('id', item.id)
          .single();
        setSelectedTicket(data);
      }}
    >
      <View style={styles.cardLeft}>
        <Text style={styles.cardSubject}>{item.subject.toUpperCase()}</Text>
        <View style={styles.metaRow}>
          <Clock size={12} color="#475569" />
          <Text style={styles.cardMeta}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
          {isStaff && (
            <Text style={styles.cardMeta}> • {item.profiles?.full_name}</Text>
          )}
        </View>
      </View>
      <View
        style={[
          styles.statusBadge,
          {
            borderColor:
              item.status === 'OPEN' ? Theme.colors.primary : '#475569',
          },
        ]}
      >
        <Text
          style={[
            styles.statusText,
            {
              color: item.status === 'OPEN' ? Theme.colors.primary : '#475569',
            },
          ]}
        >
          {item.status}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* 1. MASTER HEADER */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>SUPPORT HUB</Text>
          {isStaff && (
            <View style={styles.staffTag}>
              <ShieldAlert size={12} color="#B794F6" />
              <Text style={styles.staffTagText}>STAFF ENGINE</Text>
            </View>
          )}
        </View>
        <View style={styles.tabRow}>
          {isStaff && (
            <TabBtn
              active={activeTab === 'queue'}
              label="QUEUE"
              onPress={() => setActiveTab('queue')}
            />
          )}
          <TabBtn
            active={activeTab === 'my'}
            label="MY TICKETS"
            onPress={() => setActiveTab('my')}
          />
          <TabBtn
            active={activeTab === 'faq'}
            label="FAQ"
            onPress={() => setActiveTab('faq')}
          />
        </View>
      </View>

      <View style={styles.content}>
        {activeTab === 'faq' ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ marginTop: 24 }}
          >
            <FaqCard
              title="Response Protocol"
              body="Staff typically responds within 2-4 monitoring cycles (24h)."
            />
            <FaqCard
              title="Privacy Core"
              body="Biometric support tickets are re-encrypted via Project Cradle protocols."
            />
          </ScrollView>
        ) : (
          <FlatList
            data={tickets}
            renderItem={renderTicket}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={loadData}
                tintColor={Theme.colors.primary}
              />
            }
            contentContainerStyle={{ paddingVertical: 24 }}
          />
        )}
      </View>

      {/* CREATE FAB */}
      {!isStaff && activeTab !== 'faq' && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setCreateVisible(true)}
        >
          <Plus size={32} color="#020617" strokeWidth={3} />
        </TouchableOpacity>
      )}

      {/* CHAT MODAL ENGINE */}
      <Modal visible={!!selectedTicket} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <GlassCard style={styles.chatPanel}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setSelectedTicket(null)}>
                <X size={24} color="#FFF" />
              </TouchableOpacity>
              <Text style={styles.modalTitleHUD}>TICKET LOG</Text>
              <View style={{ width: 24 }} />
            </View>

            <ScrollView
              style={styles.chatScroll}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.initialMsg}>
                <Text style={styles.msgSubject}>{selectedTicket?.subject}</Text>
                <Text style={styles.msgBody}>
                  {selectedTicket?.description}
                </Text>
              </View>

              {selectedTicket?.support_comments
                ?.filter((c: any) => isStaff || !c.is_internal)
                .map((c: any) => (
                  <View
                    key={c.id}
                    style={[
                      styles.bubble,
                      c.is_internal && styles.internalBubble,
                    ]}
                  >
                    {c.is_internal && (
                      <View style={styles.noteLabel}>
                        <Lock size={10} color="#B794F6" />
                        <Text style={styles.noteText}>INTERNAL STAFF NOTE</Text>
                      </View>
                    )}
                    <Text style={styles.bubbleText}>{c.comment_body}</Text>
                  </View>
                ))}
            </ScrollView>

            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
              <View style={styles.inputArea}>
                {isStaff && (
                  <View style={styles.noteRow}>
                    <TextInput
                      style={styles.noteInput}
                      placeholder="Staff Note (Private)..."
                      placeholderTextColor="rgba(183, 148, 246, 0.4)"
                      value={note}
                      onChangeText={setNote}
                    />
                    <TouchableOpacity
                      style={styles.noteBtn}
                      onPress={() => handleReply(true)}
                    >
                      <Lock size={18} color="#B794F6" />
                    </TouchableOpacity>
                  </View>
                )}
                <View style={styles.replyRow}>
                  <TextInput
                    style={styles.replyInput}
                    placeholder="Sync Public Reply..."
                    placeholderTextColor="#475569"
                    value={reply}
                    onChangeText={setReply}
                  />
                  <TouchableOpacity
                    style={styles.sendBtn}
                    onPress={() => handleReply(false)}
                  >
                    <Send size={20} color="#020617" />
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </GlassCard>
        </View>
      </Modal>

      {/* CREATE MODAL */}
      <Modal visible={createVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <GlassCard style={styles.createPanel}>
            <Text style={styles.createTitle}>NEW REQUEST</Text>
            <TextInput
              style={styles.glassInput}
              placeholder="Subject Identifier"
              value={subject}
              onChangeText={setSubject}
              placeholderTextColor="#475569"
            />
            <TextInput
              style={[styles.glassInput, { height: 120 }]}
              multiline
              placeholder="Describe the system event..."
              value={desc}
              onChangeText={setDesc}
              placeholderTextColor="#475569"
            />
            <View style={styles.btnRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setCreateVisible(false)}
              >
                <Text style={styles.cancelText}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitBtn}
                onPress={handleCreate}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#020617" />
                ) : (
                  <Text style={styles.submitText}>INITIALIZE</Text>
                )}
              </TouchableOpacity>
            </View>
          </GlassCard>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// --- SUB-COMPONENTS ---
const TabBtn = ({ label, active, onPress }: any) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.tab, active && styles.tabActive]}
  >
    <Text style={[styles.tabText, active && styles.tabTextActive]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const FaqCard = ({ title, body }: any) => (
  <View style={styles.faqCard}>
    <Text style={styles.faqTitle}>{title}</Text>
    <Text style={styles.faqBody}>{body}</Text>
  </View>
);

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#020617' },
  header: {
    padding: 24,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: { color: '#FFF', fontSize: 26, fontWeight: '900', letterSpacing: 1 },
  staffTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(183, 148, 246, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  staffTagText: { color: '#B794F6', fontSize: 9, fontWeight: '900' },
  tabRow: { flexDirection: 'row', gap: 10 },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.02)',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  tabActive: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  tabText: { color: '#475569', fontSize: 11, fontWeight: '900' },
  tabTextActive: { color: '#020617' },

  content: { flex: 1, paddingHorizontal: 24 },
  ticketCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 24,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  cardLeft: { flex: 1 }, // <--- RESTORED FIX
  cardSubject: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 6,
  },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cardMeta: { color: '#475569', fontSize: 10, fontWeight: '800' },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusText: { fontSize: 8, fontWeight: '900' },

  fab: {
    position: 'absolute',
    bottom: 40,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    padding: 24,
  },
  chatPanel: {
    flex: 1,
    marginVertical: 40,
    padding: 0,
    borderRadius: 40,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  modalTitleHUD: {
    color: '#475569',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
  },

  chatScroll: { flex: 1, padding: 24 },
  initialMsg: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 24,
    borderRadius: 28,
    marginBottom: 24,
  },
  msgSubject: {
    color: Theme.colors.primary,
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 10,
  },
  msgBody: { color: '#FFF', fontSize: 15, lineHeight: 22 },

  bubble: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 18,
    borderRadius: 20,
    marginBottom: 12,
    maxWidth: '90%',
  },
  internalBubble: {
    backgroundColor: 'rgba(183, 148, 246, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(183, 148, 246, 0.2)',
  },
  noteLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  noteText: { color: '#B794F6', fontSize: 8, fontWeight: '900' },
  bubbleText: { color: '#FFF', fontSize: 14 },

  inputArea: {
    padding: 24,
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  noteRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  noteInput: {
    flex: 1,
    backgroundColor: 'rgba(183, 148, 246, 0.05)',
    borderRadius: 12,
    padding: 12,
    color: '#B794F6',
    fontSize: 12,
  },
  noteBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(183, 148, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  replyRow: { flexDirection: 'row', gap: 12 },
  replyInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    paddingHorizontal: 16,
    color: '#FFF',
  },
  sendBtn: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: Theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  createPanel: { padding: 32, borderRadius: 40 },
  createTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 24,
  },
  glassInput: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    padding: 16,
    color: '#FFF',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  btnRow: { flexDirection: 'row', gap: 12, marginTop: 10 },
  cancelBtn: { flex: 1, padding: 18, alignItems: 'center' },
  cancelText: { color: '#475569', fontWeight: '900' },
  submitBtn: {
    flex: 2,
    backgroundColor: Theme.colors.primary,
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  submitText: { color: '#020617', fontWeight: '900', letterSpacing: 1 },

  faqCard: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    padding: 20,
    borderRadius: 24,
    marginBottom: 12,
  },
  faqTitle: { color: '#FFF', fontSize: 15, fontWeight: '900', marginBottom: 6 },
  faqBody: { color: '#475569', fontSize: 12, lineHeight: 18 },
});
