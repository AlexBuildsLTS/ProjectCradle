/**
 * PROJECT CRADLE: AUTH FOOTER V2.0
 * Path: app/(auth)/AuthFooter.tsx
 * THEME: PROJECT CRADLE (Teal #4FD1C7 | Obsidian #020617)
 */

import { Link } from 'expo-router';
import { ShieldCheck } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function AuthFooter({ type }: { type: 'signin' | 'signup' }) {
  return (
    <View style={styles.container}>
      <View style={styles.linkContainer}>
        {type === 'signin' ? (
          <Text style={styles.text}>
            New caregiver?{' '}
            <Link href="/(auth)/sign-up" asChild>
              <Text style={styles.link}>Create Account</Text>
            </Link>
          </Text>
        ) : (
          <Text style={styles.text}>
            Already on the core?{' '}
            <Link href="/(auth)/sign-in" asChild>
              <Text style={styles.link}>Sign In</Text>
            </Link>
          </Text>
        )}
      </View>

      <View style={styles.divider} />

      <View style={styles.securityRow}>
        <ShieldCheck size={14} color="#475569" />
        <Text style={styles.securityText}>AES-256 ENCRYPTED SESSION</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 40, alignItems: 'center', width: '100%' },
  linkContainer: { marginBottom: 24 },
  text: { color: '#94A3B8', fontSize: 15, fontWeight: '500' },
  link: { color: '#4FD1C7', fontWeight: '800' },
  divider: {
    width: 40,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginBottom: 24,
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    opacity: 0.6,
  },
  securityText: {
    color: '#475569',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
});
