import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Theme } from './shared/Theme';
import { Milk, Moon, Activity, Zap, ChevronRight, Bot, Sparkles } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/auth';

/**
 * PROJECT CRADLE: INTELLIGENCE HUB (V1.0)
 * Responsive Glassmorphism Grid for Feeding, Sleep, and Growth.
 */
export default function DashboardHub() {
  const { session } = useAuth();
  const [babyName, setBabyName] = useState('Your Baby');

  useEffect(() => {
    async function fetchBabyData() {
      if (!session?.user?.id) return;
      const { data } = await supabase.from('babies').select('name').single();
      if (data?.name) setBabyName(data.name);
    }
    fetchBabyData();
  }, [session]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{babyName}'s Hub</Text>
          <Text style={styles.subGreeting}>System Active • Real-time Monitoring</Text>
        </View>
        <View style={styles.aiBadge}>
          <Bot size={14} color={Theme.colors.secondary} />
          <Text style={styles.aiText}>Berry AI Online</Text>
        </View>
      </View>

      {/* QUICK LOG HERO: AAA Teal Glassmorphism */}
      <TouchableOpacity style={styles.heroCard}>
        <View style={styles.zapCircle}>
          <Zap size={24} color="#020617" fill="#020617" />
        </View>
        <Text style={styles.heroText}>QUICK LOG RECENT FEED</Text>
        <Sparkles size={20} color="rgba(2, 6, 23, 0.4)" />
      </TouchableOpacity>

      {/* INTELLIGENCE GRID: Responsive Columns */}
      <View style={styles.grid}>
        <GlassCard 
          icon={Milk} 
          label="Last Feed" 
          value="2h 14m ago" 
          sub="Breast milk • 120ml" 
          color={Theme.colors.primary} 
        />
        <GlassCard 
          icon={Moon} 
          label="Current Sleep" 
          value="Active" 
          sub="Duration: 45m" 
          color={Theme.colors.secondary} 
        />
        <GlassCard 
          icon={Activity} 
          label="Growth" 
          value="7.2 kg" 
          sub="92nd Percentile" 
          color={Theme.colors.success} 
        />
      </View>
      
      {/* BERRY AI PREDICTION: Dynamic Insights */}
      <View style={styles.insightCard}>
        <View style={styles.insightHeader}>
          <Bot size={18} color={Theme.colors.secondary} />
          <Text style={styles.insightTitle}>BERRY AI PREDICTION</Text>
        </View>
        <Text style={styles.insightBody}>
          Based on today's activity, your baby's next "SweetSpot" for sleep is in **15 minutes**. Prepare the crib for a high-quality nap.
        </Text>
        <TouchableOpacity style={styles.insightBtn}>
          <Text style={styles.insightBtnText}>VIEW OPTIMIZED SCHEDULE</Text>
          <ChevronRight size={16} color={Theme.colors.secondary} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Internal High-Fidelity Component
const GlassCard = ({ icon: Icon, label, value, sub, color }: any) => (
  <TouchableOpacity style={styles.card}>
    <View style={[styles.iconCircle, { backgroundColor: `${color}15` }]}>
      <Icon size={20} color={color} />
    </View>
    <Text style={styles.cardLabel}>{label}</Text>
    <Text style={styles.cardValue}>{value}</Text>
    <Text style={styles.cardSub}>{sub}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  content: { padding: 24, maxWidth: 1200, alignSelf: 'center', width: '100%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 },
  greeting: { color: '#FFF', fontSize: 32, fontWeight: '900', letterSpacing: -0.5 },
  subGreeting: { color: '#94A3B8', fontSize: 12, fontWeight: '600', marginTop: 4 },
  aiBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(183, 148, 246, 0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(183, 148, 246, 0.2)' },
  aiText: { color: '#B794F6', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  heroCard: { backgroundColor: '#4FD1C7', padding: 24, borderRadius: 32, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, elevation: 10, shadowColor: '#4FD1C7', shadowOpacity: 0.3, shadowRadius: 20 },
  zapCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(2, 6, 23, 0.1)', alignItems: 'center', justifyContent: 'center' },
  heroText: { color: '#020617', fontWeight: '900', letterSpacing: 1.5, fontSize: 14 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  card: { flex: 1, minWidth: Platform.OS === 'web' ? 250 : '45%', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 28, padding: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  iconCircle: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  cardLabel: { color: '#94A3B8', fontSize: 10, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 2 },
  cardValue: { color: '#FFF', fontSize: 20, fontWeight: '800', marginVertical: 8 },
  cardSub: { color: '#475569', fontSize: 12, fontWeight: '600' },
  insightCard: { marginTop: 24, backgroundColor: 'rgba(183, 148, 246, 0.04)', borderRadius: 32, padding: 28, borderWidth: 1, borderColor: 'rgba(183, 148, 246, 0.15)' },
  insightHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  insightTitle: { color: '#B794F6', fontSize: 11, fontWeight: '900', letterSpacing: 2 },
  insightBody: { color: '#F7FAFC', fontSize: 16, lineHeight: 24, fontWeight: '500' },
  insightBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 20 },
  insightBtnText: { color: '#B794F6', fontSize: 12, fontWeight: '900', letterSpacing: 1 }
});