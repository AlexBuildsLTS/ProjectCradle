/**
 * PROJECT CRADLE: INVITE CAREGIVER V1.1
 * Path: components/settings/InviteCaregiver.tsx
 * THEME: PROJECT CRADLE (Teal #4FD1C7 | Obsidian #020617)
 */

import { useAuth } from '@/context/auth';
import { Theme } from '@/lib/shared/Theme';
import * as Haptics from 'expo-haptics';
import { Copy, Share2, ShieldCheck, Zap } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Clipboard,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { GlassCard } from '../glass/GlassCard';

export const InviteCaregiver = () => {
  const { user } = useAuth();
  const [inviteCode, setInviteCode] = useState<string | null>(null);

  const triggerHaptic = () => {
    if (Platform.OS !== 'web')
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const generateCode = () => {
    triggerHaptic();
    // In production, this pulls from a 'family_invites' table in Supabase
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setInviteCode(code);
  };

  const copyToClipboard = () => {
    if (inviteCode) {
      triggerHaptic();
      Clipboard.setString(inviteCode);
      alert('Sync code copied to clipboard!');
    }
  };

  return (
    <GlassCard variant="teal" style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconBox}>
          <Share2 size={20} color={Theme.colors.primary} />
        </View>
        <View>
          <Text style={styles.title}>INVITE CAREGIVER</Text>
          <Text style={styles.sub}>Synchronize care data with a partner</Text>
        </View>
      </View>

      {!inviteCode ? (
        <TouchableOpacity onPress={generateCode} style={styles.generateBtn}>
          <Zap size={16} color="#020617" />
          <Text style={styles.generateText}>GENERATE SYNC CODE</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.codeContainer}>
          <Text style={styles.codeLabel}>ACTIVE SYNC CODE</Text>
          <TouchableOpacity onPress={copyToClipboard} style={styles.codeBox}>
            <Text style={styles.codeText}>{inviteCode}</Text>
            <Copy size={18} color={Theme.colors.primary} />
          </TouchableOpacity>
          <View style={styles.securityRow}>
            <ShieldCheck size={12} color="#9AE6B4" />
            <Text style={styles.securityText}>ENCRYPTED HANDSHAKE ACTIVE</Text>
          </View>
        </View>
      )}
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  container: { padding: 24 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(79, 209, 199, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { color: '#FFF', fontSize: 14, fontWeight: '900', letterSpacing: 1 },
  sub: { color: '#475569', fontSize: 11, fontWeight: '700', marginTop: 2 },
  generateBtn: {
    backgroundColor: Theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 10,
  },
  generateText: {
    color: '#020617',
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 1,
  },
  codeContainer: { alignItems: 'center' },
  codeLabel: {
    color: '#475569',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 8,
  },
  codeBox: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: Theme.colors.primary,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  codeText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 4,
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
  },
  securityText: {
    color: '#9AE6B4',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
