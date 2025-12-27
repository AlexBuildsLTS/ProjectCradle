import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ShieldCheck } from 'lucide-react-native';

const AuthFooter = () => (
  <View style={styles.footer}>
    <View style={styles.grid}>
      <View style={styles.col}>
        <Text style={styles.heading}>Intelligence</Text>
        <Text style={styles.link}>Berry AI Chat</Text>
        <Text style={styles.link}>Growth Analysis</Text>
      </View>
      <View style={styles.col}>
        <Text style={styles.heading}>Security</Text>
        <Text style={styles.link}>AES-256 Encryption</Text>
        <Text style={styles.link}>CareSync Protocol</Text>
      </View>
      <View style={styles.col}>
        <Text style={styles.heading}>Legal</Text>
        <Text style={styles.link}>Privacy</Text>
        <Text style={styles.link}>Terms</Text>
      </View>
    </View>
    <View style={styles.bottom}>
      <View style={styles.badge}>
        <ShieldCheck size={14} color="#4FD1C7" />
        <Text style={styles.badgeText}>ENCRYPTED SESSION</Text>
      </View>
      <Text style={styles.copy}>© 2025 PROJECT CRADLE. V1.2.0 STABLE</Text>
    </View>
  </View>
);

export default AuthFooter;

const styles = StyleSheet.create({
  footer: { padding: 60, backgroundColor: '#050505', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  grid: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: 40 },
  col: { gap: 12 },
  heading: { color: '#FFF', fontWeight: '900', fontSize: 14, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  link: { color: '#475569', fontSize: 13, fontWeight: '600' },
  bottom: { marginTop: 60, paddingTop: 30, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.03)', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  badgeText: { color: '#4FD1C7', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  copy: { color: '#1E293B', fontSize: 10, fontWeight: '800' }
});
