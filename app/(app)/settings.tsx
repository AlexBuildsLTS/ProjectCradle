/**
 * PROJECT CRADLE: SUPPORT CORE V2.0
 * Path: app/(app)/support.tsx
 * THEME: PROJECT CRADLE (Teal #4FD1C7 | Obsidian #020617)
 * FEATURES:
 * - Ticket Creation: Direct integration with Supabase 'support_tickets' table.
 * - Responsive Layout: 800px max-width container for desktop clarity.
 * - Haptic UI: AAA+ Tier feedback on form submission.
 */

import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  ChevronRight,
  MessageSquare,
  Send,
  ShieldCheck,
  Zap,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { GlassCard } from '@/components/glass/GlassCard';
import { useAuth } from '@/context/auth';
import { Theme } from '@/lib/shared/Theme';
import { supabase } from '@/lib/supabase';

export default function SupportScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const triggerHaptic = (style = Haptics.ImpactFeedbackStyle.Light) => {
    if (Platform.OS !== 'web') Haptics.impactAsync(style);
  };

  const handleSubmit = async () => {
    if (!subject || !message) {
      Alert.alert(
        'Missing Data',
        'Please fill in all fields before transmitting.',
      );
      return;
    }

    setLoading(true);
    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const { error } = await supabase.from('support_tickets').insert([
        {
          user_id: user?.id,
          subject,
          message,
          status: 'open',
          priority: 'standard',
        },
      ]);

      if (error) throw error;

      if (Platform.OS !== 'web')
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        'Link Established',
        'Your support ticket has been encrypted and sent to the Admin Core.',
      );
      setSubject('');
      setMessage('');
    } catch (err: any) {
      Alert.alert('Transmission Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[
        styles.scrollContent,
        isDesktop && { alignItems: 'center' },
      ]}
    >
      <View style={[styles.container, isDesktop && styles.desktopWidth]}>
        {/* HEADER */}
        <Animated.View
          entering={FadeInDown.duration(400)}
          style={styles.header}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <ArrowLeft size={20} color={Theme.colors.primary} />
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>SUPPORT HUB</Text>
            <Text style={styles.sub}>DIRECT ENCRYPTED CHANNEL</Text>
          </View>
        </Animated.View>

        {/* INFO CARDS */}
        <View style={styles.infoRow}>
          <GlassCard style={styles.infoCard} variant="teal">
            <ShieldCheck size={20} color={Theme.colors.primary} />
            <Text style={styles.infoTitle}>SECURE</Text>
            <Text style={styles.infoText}>End-to-end encryption active.</Text>
          </GlassCard>
          <GlassCard style={styles.infoCard}>
            <Zap size={20} color="#FB923C" />
            <Text style={styles.infoTitle}>FAST</Text>
            <Text style={styles.infoText}>Average response: 4 hours.</Text>
          </GlassCard>
        </View>

        {/* TICKET FORM */}
        <Text style={styles.sectionLabel}>OPEN NEW TICKET</Text>
        <GlassCard style={styles.formCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>SUBJECT</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Biometric Sync Issue"
              placeholderTextColor="#475569"
              value={subject}
              onChangeText={setSubject}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>MESSAGE</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe your issue in detail..."
              placeholderTextColor="#475569"
              multiline
              numberOfLines={6}
              value={message}
              onChangeText={setMessage}
            />
          </View>

          <TouchableOpacity
            style={[styles.submitBtn, loading && { opacity: 0.7 }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#020617" />
            ) : (
              <>
                <Text style={styles.submitText}>TRANSMIT TICKET</Text>
                <Send size={18} color="#020617" />
              </>
            )}
          </TouchableOpacity>
        </GlassCard>

        {/* FAQ LINK */}
        <TouchableOpacity style={styles.faqBtn} onPress={() => triggerHaptic()}>
          <View style={styles.row}>
            <MessageSquare size={18} color="#94A3B8" />
            <Text style={styles.faqText}>View Knowledge Base (FAQ)</Text>
          </View>
          <ChevronRight size={18} color="#475569" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#020617' },
  scrollContent: { padding: 24, paddingBottom: 100 },
  container: { width: '100%' },
  desktopWidth: { maxWidth: 800 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 40,
  },
  backBtn: {
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  title: { color: '#FFF', fontSize: 24, fontWeight: '900', letterSpacing: -1 },
  sub: {
    color: '#475569',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginTop: 2,
  },
  infoRow: { flexDirection: 'row', gap: 16, marginBottom: 32 },
  infoCard: { flex: 1, padding: 20, gap: 10 },
  infoTitle: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  infoText: { color: '#475569', fontSize: 10, fontWeight: '600' },
  sectionLabel: {
    color: '#475569',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 16,
    paddingLeft: 4,
  },
  formCard: { padding: 24, gap: 24, borderRadius: 32 },
  inputGroup: { gap: 10 },
  label: {
    color: '#475569',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    padding: 16,
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  textArea: { minHeight: 120, textAlignVertical: 'top' },
  submitBtn: {
    backgroundColor: '#4FD1C7',
    padding: 20,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  submitText: {
    color: '#020617',
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 1,
  },
  faqBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 24,
    marginTop: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  faqText: { color: '#94A3B8', fontSize: 14, fontWeight: '700' },
});
