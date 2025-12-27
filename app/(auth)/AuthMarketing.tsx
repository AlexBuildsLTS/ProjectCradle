import React from "react";
import { Text, View, StyleSheet, Platform } from "react-native";
import { BrainCircuit, Activity, ShieldCheck, MessageSquare } from "lucide-react-native";

interface AuthMarketingProps { isDesktop: boolean; }

const FEATURES = [
  { title: "Berry AI", desc: "Pediatric logic.", icon: MessageSquare, color: "#B794F6" },
  { title: "Care Ledger", desc: "Care integrity.", icon: Activity, color: "#F6AD55" },
  { title: "Patterns", desc: "Growth forecast.", icon: BrainCircuit, color: "#4FD1C7" },
  { title: "Vault", desc: "AES-256 Sync.", icon: ShieldCheck, color: "#6366F1" },
];

// FIXED: Default export and modern boxShadow logic
export default function AuthMarketing({ isDesktop }: AuthMarketingProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.heroText}>AI-Powered{"\n"}<Text style={{ color: '#4FD1C7' }}>Parenting Core.</Text></Text>
      <View style={styles.grid}>
        {FEATURES.map((f, i) => (
          <View key={i} style={styles.gridItem}>
            <View style={[styles.card, { borderColor: f.color + '20' }]}>
               <f.icon size={22} color={f.color} />
               <Text style={styles.cardTitle}>{f.title}</Text>
               <Text style={styles.cardDesc}>{f.desc}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%' },
  heroText: { color: '#FFF', fontSize: 42, fontWeight: '900', lineHeight: 42, marginBottom: 40 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -8 },
  gridItem: { width: '50%', padding: 8 },
  card: { 
    padding: 20, 
    backgroundColor: 'rgba(255,255,255,0.03)', 
    borderRadius: 24, 
    borderWidth: 1,
    // Modern shadow replacement
    ...Platform.select({
      web: { boxShadow: '0 4px 20px rgba(0,0,0,0.5)' },
      default: { elevation: 5 }
    })
  },
  cardTitle: { color: '#FFF', fontSize: 14, fontWeight: '900', marginTop: 12 },
  cardDesc: { color: '#64748B', fontSize: 10, fontWeight: '600', marginTop: 4 }
});