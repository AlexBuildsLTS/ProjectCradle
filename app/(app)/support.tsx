/**
 * PROJECT CRADLE: ENTERPRISE SUPPORT COMMAND CENTER (V4.0 - ERROR FREE)
 * Features: FAQ, Ticket Queue, Status Modals, Internal Notes, RBAC.
 * Logic: Dual-View for Staff (Queue) and Members (My Tickets).
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, Text, TouchableOpacity, FlatList, SafeAreaView, Alert, Modal, 
  TextInput, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, 
  RefreshControl, StyleSheet, StatusBar 
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { 
  Plus, HelpCircle, X, Send, Lock, ShieldAlert, ChevronDown, 
  Trash2, Search, MessageSquare, Clock, CheckCircle, AlertTriangle, LifeBuoy 
} from 'lucide-react-native';

import { useAuth } from '@/context/auth';
import { supabase } from '@/lib/supabase';
import { Theme } from './shared/Theme';

// RBAC: Staff definition
const STAFF_ROLES = ['ADMIN', 'SUPPORT'];

interface Ticket {
  id: string;
  subject: string;
  category: string;
  message: string; // FIXED: Property 'message' now explicitly exists
  status: 'open' | 'in_progress' | 'pending' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  user_id: string;
  profiles?: { full_name: string; email: string };
  support_messages?: any[];
}

export default function SupportHub() {
  const { session } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const isStaff = profile?.role && STAFF_ROLES.includes(profile.role);

  const [activeTab, setActiveTab] = useState<'my_tickets' | 'queue' | 'faq'>(isStaff ? 'queue' : 'my_tickets');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Selection
  const [createVisible, setCreateVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  // Forms
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('');
  const [internalNote, setInternalNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. DATA INITIALIZATION
  const loadData = async () => {
    if (!session?.user?.id) return;
    setLoading(true);
    try {
      const { data: userProfile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      setProfile(userProfile);

      let query = supabase.from('support_tickets').select('*, profiles(full_name, email)');
      
      // Logic-Gate: Filter by role
      if (activeTab === 'my_tickets' || !STAFF_ROLES.includes(userProfile.role)) {
        query = query.eq('user_id', session.user.id);
      }

      const { data } = await query.order('created_at', { ascending: false });
      setTickets(data || []);
    } catch (e) {
      console.error("Support HUD Failure:", e);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { loadData(); }, [activeTab]));

  // 2. OPERATIONS
  const handleCreate = async () => {
    if (!subject.trim() || !message.trim()) return Alert.alert("Required", "Please provide a subject and details.");
    setIsSubmitting(true);
    try {
      await supabase.from('support_tickets').insert([{ user_id: session?.user.id, subject, message, status: 'open' }]);
      setCreateVisible(false);
      setSubject(''); setMessage('');
      loadData();
    } finally { setIsSubmitting(false); }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedTicket) return;
    await supabase.from('support_tickets').update({ status: newStatus }).eq('id', selectedTicket.id);
    setStatusModalVisible(false);
    setDetailVisible(false);
    loadData();
  };

  const handleReply = async (isInternal: boolean) => {
    if (!selectedTicket || !session?.user.id) return;
    const text = isInternal ? internalNote : reply;
    if (!text.trim()) return;
    setIsSubmitting(true);
    try {
      await supabase.from('support_messages').insert([{
        ticket_id: selectedTicket.id, sender_id: session.user.id, message: text, is_internal: isInternal
      }]);
      setReply(''); setInternalNote('');
      // Refresh current thread
      const { data } = await supabase.from('support_tickets').select('*, profiles(full_name), support_messages(*)').eq('id', selectedTicket.id).single();
      setSelectedTicket(data);
    } finally { setIsSubmitting(false); }
  };

  // 3. UI COMPONENTS
  const renderItem = ({ item }: { item: Ticket }) => (
    <TouchableOpacity style={styles.card} onPress={async () => {
      const { data } = await supabase.from('support_tickets').select('*, profiles(full_name, email), support_messages(*)').eq('id', item.id).single();
      setSelectedTicket(data);
      setDetailVisible(true);
    }}>
      <View style={styles.cardInfo}> 
        <Text style={styles.cardSubject}>{item.subject}</Text>
        <View style={styles.metaRow}>
          <Clock size={12} color="#475569" />
          <Text style={styles.cardMeta}>{isStaff ? item.profiles?.full_name : `#${item.id.substring(0,8)}`} • {new Date(item.created_at).toLocaleDateString()}</Text>
        </View>
      </View>
      <View style={[styles.statusBadge, { borderColor: Theme.colors.primary }]}>
        <Text style={[styles.statusText, { color: Theme.colors.primary }]}>{item.status.replace('_', ' ')}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" />
      
      {/* HEADER HUD */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Support</Text>
          {isStaff && <View style={styles.staffHUD}><ShieldAlert size={14} color={Theme.colors.secondary} /><Text style={styles.staffHUDText}>STAFF HUB</Text></View>}
        </View>

        <View style={styles.tabs}>
          {isStaff && <TabBtn label="Queue" active={activeTab === 'queue'} onPress={() => setActiveTab('queue')} />}
          <TabBtn label="My Tickets" active={activeTab === 'my_tickets'} onPress={() => setActiveTab('my_tickets')} />
          <TabBtn label="FAQ" active={activeTab === 'faq'} onPress={() => setActiveTab('faq')} />
        </View>
      </View>

      <View style={{ flex: 1, paddingHorizontal: 24 }}>
        {activeTab === 'faq' ? (
          <ScrollView style={{ marginTop: 20 }}>
            <FaqItem icon={HelpCircle} title="How do I verify account?" body="Go to Settings > Profile and upload your identity documents. Review typically takes 24 hours." />
            <FaqItem icon={Lock} title="Data Privacy" body="All parenting intelligence is encrypted with AES-256 standards before being stored in the Obsidian core." />
          </ScrollView>
        ) : (
          <View style={{ flex: 1 }}>
            <View style={styles.searchBar}>
              <Search size={18} color="#475569" />
              <TextInput style={styles.searchInput} placeholder="Search tickets..." placeholderTextColor="#475569" value={searchQuery} onChangeText={setSearchQuery} />
            </View>
            <FlatList 
              data={tickets.filter(t => t.subject.toLowerCase().includes(searchQuery.toLowerCase()))} 
              renderItem={renderItem} 
              keyExtractor={item => item.id}
              refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} tintColor={Theme.colors.primary} />}
            />
          </View>
        )}
      </View>

      {!isStaff && activeTab !== 'faq' && (
        <TouchableOpacity style={styles.fab} onPress={() => setCreateVisible(true)}><Plus size={32} color="#020617" /></TouchableOpacity>
      )}

      {/* DETAIL MODAL */}
      <Modal visible={detailVisible} animationType="slide">
        <SafeAreaView style={styles.modalRoot}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setDetailVisible(false)}><X size={24} color="#FFF" /></TouchableOpacity>
            <Text style={styles.modalSub}>TICKET LOG</Text>
            {isStaff ? (
               <TouchableOpacity onPress={() => setStatusModalVisible(true)}><ChevronDown size={24} color={Theme.colors.primary} /></TouchableOpacity>
            ) : <View style={{ width: 24 }} />}
          </View>

          <ScrollView style={styles.chatArea}>
            <View style={styles.initialMsg}>
               <Text style={styles.largeSubject}>{selectedTicket?.subject}</Text>
               <Text style={styles.largeBody}>{selectedTicket?.message}</Text>
            </View>
            {selectedTicket?.support_messages?.filter(m => isStaff || !m.is_internal).map((m: any) => (
              <View key={m.id} style={[styles.bubble, m.is_internal && styles.internalBubble]}>
                {m.is_internal && <View style={styles.internalBadge}><Lock size={12} color={Theme.colors.secondary} /><Text style={styles.internalLabel}>STAFF NOTE</Text></View>}
                <Text style={styles.bubbleText}>{m.message}</Text>
              </View>
            ))}
          </ScrollView>

          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={styles.inputHUD}>
              {isStaff && (
                <View style={styles.internalRow}>
                  <TextInput style={styles.internalInput} placeholder="Add internal note..." placeholderTextColor="#B794F640" value={internalNote} onChangeText={setInternalNote} />
                  <TouchableOpacity onPress={() => handleReply(true)} style={styles.lockBtn}><Lock size={18} color="#B794F6" /></TouchableOpacity>
                </View>
              )}
              <View style={styles.publicRow}>
                <TextInput style={styles.publicInput} placeholder="Public reply..." placeholderTextColor="#475569" value={reply} onChangeText={setReply} />
                <TouchableOpacity onPress={() => handleReply(false)} style={styles.sendBtn}><Send size={20} color="#020617" /></TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>

      {/* CREATE MODAL */}
      <Modal visible={createVisible} animationType="slide" transparent>
        <View style={styles.overlay}>
           <View style={styles.panel}>
              <View style={styles.panelHeader}><Text style={styles.panelTitle}>New Request</Text><TouchableOpacity onPress={() => setCreateVisible(false)}><X size={20} color="#FFF"/></TouchableOpacity></View>
              <TextInput placeholder="Subject" placeholderTextColor="#475569" style={styles.glassInput} value={subject} onChangeText={setSubject} />
              <TextInput placeholder="Details..." placeholderTextColor="#475569" style={[styles.glassInput, { height: 120 }]} multiline value={message} onChangeText={setMessage} />
              <TouchableOpacity style={styles.submitBtn} onPress={handleCreate} disabled={isSubmitting}><Text style={styles.submitText}>SUBMIT TICKET</Text></TouchableOpacity>
           </View>
        </View>
      </Modal>

      {/* STATUS MODAL */}
      <Modal visible={statusModalVisible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.statusPanel}>
            <Text style={styles.panelTitle}>Update Status</Text>
            {['open', 'in_progress', 'pending', 'resolved', 'closed'].map(s => (
              <TouchableOpacity key={s} onPress={() => handleStatusChange(s)} style={styles.statusOption}>
                <Text style={styles.statusOptionText}>{s.toUpperCase()}</Text>
                {selectedTicket?.status === s && <CheckCircle size={16} color={Theme.colors.primary} />}
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setStatusModalVisible(false)} style={styles.cancelBtn}><Text style={styles.cancelText}>Cancel</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Sub-components
const TabBtn = ({ label, active, onPress }: any) => (
  <TouchableOpacity onPress={onPress} style={[styles.tab, active && styles.tabActive]}>
    <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
  </TouchableOpacity>
);

const FaqItem = ({ icon: Icon, title, body }: any) => (
  <View style={styles.faqCard}>
    <View style={styles.faqHead}><Icon size={18} color={Theme.colors.primary} /><Text style={styles.faqTitle}>{title}</Text></View>
    <Text style={styles.faqBody}>{body}</Text>
  </View>
);

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#020617' },
  header: { padding: 24, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  headerTitle: { color: '#FFF', fontSize: 32, fontWeight: '900' },
  staffHUD: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(183, 148, 246, 0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  staffHUDText: { color: '#B794F6', fontSize: 10, fontWeight: '900' },
  tabs: { flexDirection: 'row', gap: 10 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.02)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  tabActive: { backgroundColor: '#4FD1C7', borderColor: '#4FD1C7' },
  tabText: { color: '#94A3B8', fontSize: 13, fontWeight: '700' },
  tabTextActive: { color: '#020617' },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: 'rgba(255,255,255,0.03)', padding: 14, borderRadius: 16, marginVertical: 24 },
  searchInput: { flex: 1, color: '#FFF', fontWeight: '600' },
  card: { backgroundColor: 'rgba(255,255,255,0.02)', padding: 20, borderRadius: 24, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  cardInfo: { flex: 1 }, // FIXED: Style was missing
  cardSubject: { color: '#FFF', fontSize: 17, fontWeight: '800', marginBottom: 6 },
  cardMeta: { color: '#475569', fontSize: 11, fontWeight: '700' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, borderWidth: 1 },
  statusText: { fontSize: 9, fontWeight: '900', textTransform: 'uppercase' },
  fab: { position: 'absolute', bottom: 40, right: 24, width: 64, height: 64, borderRadius: 32, backgroundColor: '#4FD1C7', alignItems: 'center', justifyContent: 'center', elevation: 10 },
  modalRoot: { flex: 1, backgroundColor: '#020617' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  modalSub: { color: '#94A3B8', fontSize: 10, fontWeight: '900', letterSpacing: 2 },
  chatArea: { flex: 1, padding: 20 },
  initialMsg: { backgroundColor: 'rgba(255,255,255,0.03)', padding: 24, borderRadius: 28, marginBottom: 24 },
  largeSubject: { color: '#4FD1C7', fontSize: 24, fontWeight: '900', marginBottom: 12 },
  largeBody: { color: '#F7FAFC', fontSize: 16, lineHeight: 24 },
  bubble: { backgroundColor: 'rgba(255,255,255,0.05)', padding: 18, borderRadius: 20, marginBottom: 14, maxWidth: '90%' },
  internalBubble: { backgroundColor: 'rgba(183, 148, 246, 0.05)', borderColor: 'rgba(183, 148, 246, 0.2)', borderWidth: 1 },
  internalBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  internalLabel: { color: '#B794F6', fontSize: 9, fontWeight: '900' },
  bubbleText: { color: '#FFF', fontSize: 15, lineHeight: 22 },
  inputHUD: { padding: 20, borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  internalRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  internalInput: { flex: 1, backgroundColor: 'rgba(183, 148, 246, 0.05)', borderRadius: 12, padding: 12, color: '#B794F6', fontSize: 12 },
  lockBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(183, 148, 246, 0.1)', alignItems: 'center', justifyContent: 'center' },
  publicRow: { flexDirection: 'row', gap: 12 },
  publicInput: { flex: 1, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 16, paddingHorizontal: 16, color: '#FFF', height: 56 },
  sendBtn: { width: 56, height: 56, borderRadius: 16, backgroundColor: '#4FD1C7', alignItems: 'center', justifyContent: 'center' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 32 },
  panel: { backgroundColor: '#112240', borderRadius: 32, padding: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  panelHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  panelTitle: { color: '#FFF', fontSize: 20, fontWeight: '800' },
  glassInput: { backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: 16, color: '#FFF', marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  submitBtn: { backgroundColor: '#4FD1C7', height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  submitText: { color: '#020617', fontWeight: '900', letterSpacing: 1 },
  statusPanel: { backgroundColor: '#112240', borderRadius: 32, padding: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  statusOption: { flexDirection: 'row', justifyContent: 'space-between', padding: 18, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.03)', marginBottom: 8 },
  statusOptionText: { color: '#FFF', fontWeight: '900', fontSize: 13 },
  cancelBtn: { marginTop: 20, alignItems: 'center' },
  cancelText: { color: '#475569', fontWeight: '800' },
  faqCard: { backgroundColor: 'rgba(255,255,255,0.02)', padding: 20, borderRadius: 24, marginBottom: 16 },
  faqHead: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  faqTitle: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  faqBody: { color: '#94A3B8', fontSize: 14, lineHeight: 22 }
});