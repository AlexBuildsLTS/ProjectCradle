import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Brain, Activity, Zap, Shield } from 'lucide-react-native';

const FeatureCard = ({ icon: Icon, title, desc }: any) => (
  <View style={styles.card}>
    <View style={styles.iconBox}><Icon size={20} color="#4FD1C7" /></View>
    <View>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDesc}>{desc}</Text>
    </View>
  </View>
);

export default function AuthMarketing({ isDesktop }: { isDesktop: boolean }) {
  return (
    <View style={styles.container}>
      <Text style={styles.hero}>AI-Powered{'\n'}<Text style={{color: '#4FD1C7'}}>Parenting Core.</Text></Text>
      
      {/* VERTICAL STACK FOR MOBILE | GRID FOR DESKTOP */}
      <View style={isDesktop ? styles.desktopGrid : styles.mobileStack}>
        <FeatureCard icon={Brain} title="Berry AI" desc="Pediatric logic engine." />
        <FeatureCard icon={Activity} title="Care Ledger" desc="High-integrity tracking." />
        <FeatureCard icon={Zap} title="Patterns" desc="Growth forecasting." />
        <FeatureCard icon={Shield} title="Vault" desc="AES-256 Encryption." />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%' },
  hero: { color: '#FFF', fontSize: 48, fontWeight: '900', letterSpacing: -2, marginBottom: 40 },
  desktopGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 24 },
  mobileStack: { gap: 16 }, // FORCES FULL WIDTH STACK ON MOBILE
  card: { 
    width: '100%', 
    backgroundColor: 'rgba(255,255,255,0.03)', 
    padding: 24, 
    borderRadius: 24, 
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.08)', 
    flexDirection: 'row', 
    gap: 16, 
    alignItems: 'center' 
  },
  iconBox: { 
    width: 48, 
    height: 48, 
    borderRadius: 12, 
    backgroundColor: 'rgba(79, 209, 199, 0.1)', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  cardTitle: { color: '#FFF', fontWeight: '800', fontSize: 16 },
  cardDesc: { color: '#94A3B8', fontSize: 12 }
});