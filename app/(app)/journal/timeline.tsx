/**
 * PROJECT CRADLE: BIOMETRIC TIMELINE V1.0
 * Path: app/(app)/journal/timeline.tsx
 * THEME: PROJECT CRADLE (Teal #4FD1C7 | Obsidian #020617)
 * * MODULES:
 * 1. MULTI-STREAM SYNC: Aggregates Feeding, Growth, and Journal events.
 * 2. TYPE-SPECIFIC RENDERING: Dynamic UI for durations, weights, and milestone photos.
 * 3. REAL-TIME DELETION: Long-press to purge erroneous entries from the core.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
} from 'react-native';
import { 
  History, 
  Milk, 
  TrendingUp, 
  ImageIcon, 
  Trash2, 
  Clock, 
  ShieldCheck,
  ChevronLeft 
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

// PROJECT IMPORTS
import { GlassCard } from '@/components/glass/GlassCard';
import { useFamily } from '@/context/family';
import { supabase } from '@/lib/supabase';

export default function TimelineScreen() {
  const router = useRouter();
  const { selectedBaby } = useFamily();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [events, setEvents] = useState<any[]>([]);

  // MODULE: DATA AGGREGATION HANDSHAKE
  const fetchTimeline = async () => {
    if (!selectedBaby?.id) return;
    try {
      const { data, error } = await supabase
        .from('care_events')
        .select('*')
        .eq('baby_id', selectedBaby.id)
        .order('timestamp', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (e: any) {
      Alert.alert("SYNC ERROR", e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchTimeline(); }, [selectedBaby]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTimeline();
  };

  // MODULE: EVENT PURGE LOGIC
  const handleDeleteEvent = (id: string) => {
    Alert.alert("PURGE EVENT", "Are you sure you want to delete this encrypted record?", [
      { text: "CANCEL", style: "cancel" },
      { 
        text: "PURGE", 
        style: "destructive", 
        onPress: async () => {
          const { error } = await supabase.from('care_events').delete().eq('id', id);
          if (!error) fetchTimeline();
        } 
      }
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color="#4FD1C7" size="large" />
        <Text style={styles.loaderText}>DECRYPTING TIMELINE...</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {/* HEADER SECTION */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color="#FFF" />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>BIOMETRIC TIMELINE</Text>
          <Text style={styles.subtitle}>{selectedBaby?.name?.toUpperCase()} CORE HISTORY</Text>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4FD1C7" />}
      >
        {events.length === 0 ? (
          <View style={styles.emptyState}>
            <History size={48} color="rgba(255,255,255,0.05)" />
            <Text style={styles.emptyText}>No care events detected in the current cycle.</Text>
          </View>
        ) : (
          events.map((event) => (
            <TimelineItem 
              key={event.id} 
              event={event} 
              onDelete={() => handleDeleteEvent(event.id)} 
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

/**
 * SUB-COMPONENT: DYNAMIC TIMELINE ITEM
 */
const TimelineItem = ({ event, onDelete }: { event: any; onDelete: () => void }) => {
  const type = event.event_type;
  const time = new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const date = new Date(event.timestamp).toLocaleDateString();

  const getIcon = () => {
    switch(type) {
      case 'feeding': return Milk;
      case 'growth': return TrendingUp;
      case 'journal': return ImageIcon;
      default: return Clock;
    }
  };

  const Icon = getIcon();

  return (
    <GlassCard style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.typeTag}>
          <Icon size={14} color="#4FD1C7" />
          <Text style={styles.typeText}>{type.toUpperCase()}</Text>
        </View>
        <Text style={styles.timestamp}>{date} • {time}</Text>
        <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
          <Trash2 size={14} color="#F87171" />
        </TouchableOpacity>
      </View>

      <View style={styles.cardContent}>
        {/* TYPE: FEEDING */}
        {type === 'feeding' && (
          <View style={styles.detailRow}>
            <Text style={styles.mainDetail}>{event.details.type.toUpperCase()}</Text>
            <View style={styles.dot} />
            <Text style={styles.subDetail}>
              {event.details.duration ? `${Math.floor(event.details.duration / 60)}m` : event.details.amount}
            </Text>
            {event.details.side && (
              <Text style={styles.sideBadge}>{event.details.side.toUpperCase()}</Text>
            )}
          </View>
        )}

        {/* TYPE: GROWTH */}
        {type === 'growth' && (
          <View style={styles.detailRow}>
            <View style={styles.statBlock}>
              <Text style={styles.statLabel}>WEIGHT</Text>
              <Text style={styles.statValue}>{event.details.weight || '--'}</Text>
            </View>
            <View style={styles.statBlock}>
              <Text style={styles.statLabel}>HEIGHT</Text>
              <Text style={styles.statValue}>{event.details.height || '--'}</Text>
            </View>
          </View>
        )}

        {/* TYPE: JOURNAL */}
        {type === 'journal' && (
          <View style={styles.journalBlock}>
            {event.details.image_url && (
              <Image source={{ uri: event.details.image_url }} style={styles.journalImg} />
            )}
            <Text style={styles.captionText}>{event.details.caption}</Text>
            <View style={styles.authorRow}>
              <ShieldCheck size={10} color="#4FD1C7" />
              <Text style={styles.authorText}>POSTED BY {event.details.author?.toUpperCase() || 'FAMILY'}</Text>
            </View>
          </View>
        )}
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#020617' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#020617', gap: 20 },
  loaderText: { color: '#4FD1C7', fontSize: 10, fontWeight: '900', letterSpacing: 2 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 24, paddingTop: 60, gap: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  backBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.03)', alignItems: 'center', justifyContent: 'center' },
  title: { color: '#FFF', fontSize: 20, fontWeight: '900', letterSpacing: 1 },
  subtitle: { color: '#4FD1C7', fontSize: 9, fontWeight: '900', letterSpacing: 2, marginTop: 4 },
  scrollContent: { padding: 24, gap: 16, paddingBottom: 100 },
  card: { padding: 20, borderRadius: 28 },
  cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  typeTag: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(79, 209, 199, 0.1)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  typeText: { color: '#4FD1C7', fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  timestamp: { marginLeft: 12, color: '#475569', fontSize: 11, fontWeight: '700' },
  deleteBtn: { marginLeft: 'auto', padding: 8 },
  cardContent: { paddingLeft: 4 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  mainDetail: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#475569' },
  subDetail: { color: '#94A3B8', fontSize: 15, fontWeight: '600' },
  sideBadge: { backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, color: '#FFF', fontSize: 9, fontWeight: '900' },
  statBlock: { flex: 1, gap: 4 },
  statLabel: { color: '#475569', fontSize: 9, fontWeight: '900' },
  statValue: { color: '#FFF', fontSize: 18, fontWeight: '800' },
  journalBlock: { gap: 12 },
  journalImg: { width: '100%', height: 220, borderRadius: 20 },
  captionText: { color: '#FFF', fontSize: 14, lineHeight: 22, fontWeight: '500' },
  authorRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  authorText: { color: 'rgba(148, 163, 184, 0.4)', fontSize: 9, fontWeight: '900' },
  emptyState: { padding: 80, alignItems: 'center', justifyContent: 'center', gap: 20 },
  emptyText: { color: '#475569', fontSize: 12, fontWeight: '700', textAlign: 'center' }
});