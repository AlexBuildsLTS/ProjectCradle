/**
 * PROJECT CRADLE: JOIN FAMILY HANDSHAKE V1.2
 * Path: components/settings/JoinFamily.tsx
 * FIX: Resolved Haptics TypeScript error 2339.
 */

import { Theme } from '@/lib/shared/Theme';
import * as Haptics from 'expo-haptics';
import { CheckCircle2, Users } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { GlassCard } from '../glass/GlassCard';

export const JoinFamily = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const triggerFeedback = async (type: 'success' | 'error' | 'impact') => {
    if (Platform.OS === 'web') return;
    if (type === 'impact') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      // FIXED: Uses notificationAsync for Success/Error feedback
      await Haptics.notificationAsync(
        type === 'success'
          ? Haptics.NotificationFeedbackType.Success
          : Haptics.NotificationFeedbackType.Error,
      );
    }
  };

  const handleJoin = async () => {
    if (code.length < 6) return;
    setLoading(true);
    await triggerFeedback('impact');

    try {
      // Handshake logic simulation
      await new Promise((resolve) => setTimeout(resolve, 1500));
      await triggerFeedback('success');
    } catch (e) {
      await triggerFeedback('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassCard style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconBox}>
          <Users size={20} color={Theme.colors.primary} />
        </View>
        <View>
          <Text style={styles.title}>JOIN FAMILY</Text>
          <Text style={styles.sub}>
            Enter code provided by the primary parent
          </Text>
        </View>
      </View>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="ENTER 6-DIGIT CODE"
          placeholderTextColor="#475569"
          value={code}
          onChangeText={setCode}
          autoCapitalize="characters"
          maxLength={6}
        />
        <TouchableOpacity
          onPress={handleJoin}
          disabled={code.length < 6 || loading}
          style={styles.joinBtn}
        >
          {loading ? (
            <ActivityIndicator color="#020617" size="small" />
          ) : (
            <CheckCircle2 size={18} color="#020617" />
          )}
        </TouchableOpacity>
      </View>
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
  inputWrapper: { flexDirection: 'row', gap: 12 },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 20,
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 2,
  },
  joinBtn: {
    width: 56,
    height: 56,
    backgroundColor: '#4FD1C7',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
