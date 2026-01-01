/**
 * PROJECT CRADLE: BIOMETRIC TIMELINE V23.0 (AAA+)
 * Path: app/(app)/journal/timeline.tsx
 * ----------------------------------------------------------------------------
 * MODULES:
 * 1. MULTI-STREAM SYNC: Aggregates Feeding, Growth, and Journal milestones.
 * 2. IDENTITY HANDSHAKE: Displays roles (Admin/Plus/Member) for every ledger entry.
 * 3. DESKTOP CENTER: Centers and caps ledger width at 850px for monitors.
 * 4. REAL-TIME PURGE: Long-press or long-touch to destroy records via Sovereign RLS.
 */

import { useRouter } from 'expo-router';
import {
  ChevronLeft,
  History,
  ImageIcon,
  Milk,
  Trash2,
  TrendingUp,
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

import { GlassCard } from '@/components/glass/GlassCard';
import { useAuth } from '@/context/auth';
import { useFamily } from '@/context/family';
import { Theme } from '@/lib/shared/Theme';
import { supabase } from '@/lib/supabase';

const STAFF_ROLES = ['ADMIN', 'SUPPORT'];

export default function TimelineScreen() {
  const router = useRouter();
  const { selectedBaby } = useFamily();
  const { profile } = useAuth();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const isStaff = profile?.role && STAFF_ROLES.includes(profile.role);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [events, setEvents] = useState<any[]>([]);

  /**
   * MODULE: FREQUENCY HANDSHAKE
   * Pulls every care event for the active baby ID from the care_events ledger.
   */
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
      Alert.alert('SYNC_ERROR', e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTimeline();
  }, [selectedBaby]);

  const handleDelete = (id: string) => {
    Alert.alert(
      'PURGE RECORD',
      'Permanently destroy this biometric entry from the ledger?',
      [
        { text: 'CANCEL' },
        {
          text: 'PURGE',
          style: 'destructive',
          onPress: async () => {
            const { error } = await supabase
              .from('care_events')
              .delete()
              .eq('id', id);
            if (!error) fetchTimeline();
          },
        },
      ],
    );
  };

  if (loading)
    return (
      <View style={styles.loader}>
        <ActivityIndicator color={Theme.colors.primary} size="large" />
        <Text style={styles.loaderText}>DECRYPTING FREQUENCY...</Text>
      </View>
    );

  return (
    <View style={styles.root}>
      {/* SOVEREIGN HEADER */}
      <View
        style={[
          styles.header,
          isDesktop && { maxWidth: 1000, alignSelf: 'center', width: '100%' },
        ]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color="#FFF" />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>BIOMETRIC TIMELINE</Text>
          <Text style={styles.subtitle}>
            {selectedBaby?.name?.toUpperCase() || 'CORE'} MASTER LEDGER
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          isDesktop && { maxWidth: 850, alignSelf: 'center' },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchTimeline()}
            tintColor={Theme.colors.primary}
          />
        }
      >
        {events.length === 0 ? (
          <View style={styles.emptyState}>
            <History size={64} color="rgba(255,255,255,0.03)" />
            <Text style={styles.emptyText}>
              No care streams detected in current frequency.
            </Text>
          </View>
        ) : (
          events.map((event) => (
            <TimelineItem
              key={event.id}
              event={event}
              canDelete={isStaff || event.user_id === profile?.id}
              onDelete={() => handleDelete(event.id)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

/**
 * SUB-COMPONENT: TRIAGED TIMELINE ITEM
 * Implements role-based color mapping from your Badge system.
 */
const TimelineItem = ({ event, onDelete, canDelete }: any) => {
  const type = event.event_type;
  const time = new Date(event.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  const date = new Date(event.timestamp).toLocaleDateString();

  const role = event.details.author_role || 'MEMBER';
  const roleColor =
    role === 'ADMIN'
      ? '#4FD1C7'
      : role === 'PREMIUM_MEMBER'
      ? '#FFD700'
      : '#94A3B8';

  return (
    <GlassCard style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.typeTag}>
          {type === 'feeding' ? (
            <Milk size={14} color={Theme.colors.primary} />
          ) : type === 'growth' ? (
            <TrendingUp size={14} color="#B794F6" />
          ) : (
            <ImageIcon size={14} color="#4FD1C7" />
          )}
          <Text style={styles.typeText}>{type.toUpperCase()}</Text>
        </View>
        <Text style={styles.timestamp}>
          {date} • {time}
        </Text>
        {canDelete && (
          <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
            <Trash2 size={14} color="#F87171" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.itemContent}>
        {/* TYPE: JOURNAL MILESTONE */}
        {type === 'journal' && (
          <View>
            {event.details.image_url && (
              <Image
                source={{ uri: event.details.image_url }}
                style={styles.journalImg}
              />
            )}
            <Text style={styles.mainText}>{event.details.caption}</Text>
            <View style={styles.identityRow}>
              <View style={[styles.miniBadge, { borderColor: roleColor }]}>
                <Text style={[styles.miniBadgeText, { color: roleColor }]}>
                  {role}
                </Text>
              </View>
              <Text style={styles.authorName}>
                POSTED BY {event.details.author_name?.toUpperCase() || 'FAMILY'}
              </Text>
            </View>
          </View>
        )}

        {/* TYPE: FEEDING BIOMETRIC */}
        {type === 'feeding' && (
          <View style={styles.dataRow}>
            <Text style={styles.dataMain}>
              {event.details.type?.toUpperCase()}
            </Text>
            <View style={styles.dot} />
            <Text style={styles.dataSub}>
              {event.details.amount ||
                `${Math.floor(event.details.duration / 60)}m`}
            </Text>
          </View>
        )}

        {/* TYPE: GROWTH BIOMETRIC */}
        {type === 'growth' && (
          <View style={styles.dataRow}>
            <View style={styles.stat}>
              <Text style={styles.statL}>WGT</Text>
              <Text style={styles.statV}>{event.details.weight || '--'}</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statL}>HGT</Text>
              <Text style={styles.statV}>{event.details.height || '--'}</Text>
            </View>
          </View>
        )}
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#020617' },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#020617',
    gap: 20,
  },
  loaderText: {
    color: Theme.colors.primary,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { color: '#FFF', fontSize: 24, fontWeight: '900', letterSpacing: -1 },
  subtitle: {
    color: Theme.colors.primary,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 2,
    marginTop: 4,
  },
  scrollContent: { padding: 24, gap: 15, paddingBottom: 100, width: '100%' },
  card: { padding: 24, borderRadius: 32 },
  cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  typeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.02)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  typeText: {
    color: '#94A3B8',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
  timestamp: {
    marginLeft: 12,
    color: '#475569',
    fontSize: 11,
    fontWeight: '800',
  },
  deleteBtn: { marginLeft: 'auto', padding: 8 },
  itemContent: { paddingVertical: 5 },
  journalImg: {
    width: '100%',
    height: 280,
    borderRadius: 28,
    marginBottom: 15,
  },
  mainText: {
    color: '#F1F5F9',
    fontSize: 15,
    lineHeight: 24,
    fontWeight: '500',
  },
  identityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 15,
    opacity: 0.6,
  },
  miniBadge: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  miniBadgeText: { fontSize: 7, fontWeight: '900' },
  authorName: { color: '#FFF', fontSize: 10, fontWeight: '800' },
  dataRow: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  dataMain: { color: '#FFF', fontSize: 20, fontWeight: '900' },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Theme.colors.primary,
  },
  dataSub: { color: Theme.colors.primary, fontSize: 18, fontWeight: '700' },
  stat: { flex: 1, gap: 5 },
  statL: { color: '#475569', fontSize: 9, fontWeight: '900' },
  statV: { color: '#FFF', fontSize: 22, fontWeight: '900' },
  emptyState: { padding: 100, alignItems: 'center', opacity: 0.5 },
  emptyText: { color: '#FFF', marginTop: 20, fontWeight: '900', fontSize: 12 },
});
