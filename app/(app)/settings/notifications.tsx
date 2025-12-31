/**
 * PROJECT CRADLE: NOTIFICATION COMMAND CENTER V1.1
 * Path: app/(app)/settings/notifications.tsx
 * ----------------------------------------------------------------------------
 * FIXES:
 * 1. INTERNAL NAV: Corrected router pathing for the top-left Chevron gateway.
 * 2. PREFERENCES: Integrated Master Toggle for system-wide alert silencing.
 * 3. SCHEMA SYNC: Synchronized with existing 'notifications' SQL relation.
 * 4. UX: High-fidelity spring entry and centered 480px desktop HUD.
 */

import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import {
  Activity,
  Bell,
  BellOff,
  ChevronLeft,
  LifeBuoy,
  Settings2,
  ShieldCheck,
} from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

import { GlassCard } from '@/components/glass/GlassCard';
import { Theme } from '@/lib/shared/Theme';
import { supabase } from '@/lib/supabase';

export default function NotificationsScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // PREFERENCE STATE
  const [masterNotify, setMasterNotify] = useState(true);

  // --- 1. CINEMATIC ANIMATIONS ---
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(25)).current;

  useEffect(() => {
    loadNotifications();
    Animated.parallel([
      Animated.spring(fadeAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 40,
        friction: 8,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 40,
        friction: 8,
      }),
    ]).start();
  }, []);

  const triggerFeedback = (style = Haptics.ImpactFeedbackStyle.Medium) => {
    if (process.env.EXPO_PUBLIC_PLATFORM !== 'web') Haptics.impactAsync(style);
  };

  /**
   * DATA SYNCHRONIZATION: Fetches latest alerts from the existing ledger.
   */
  const loadNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (e: any) {
      console.error('[Notify] Sync Error:', e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const markAllAsRead = async () => {
    triggerFeedback(Haptics.ImpactFeedbackStyle.Light);
    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('is_read', false);
      loadNotifications();
    } catch (e: any) {
      console.error(e.message);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'SUPPORT':
        return <LifeBuoy size={16} color={Theme.colors.secondary} />;
      case 'BIOMETRIC':
        return <Activity size={16} color={Theme.colors.primary} />;
      case 'SECURITY':
        return <ShieldCheck size={16} color="#F87171" />;
      default:
        return <Bell size={16} color="#FFF" />;
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <Animated.View
        style={[
          styles.cardWrapper,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <GlassCard style={[styles.container, ...(isDesktop ? [styles.desktopHUD] : [])]}>
          {/* INTERNAL NAV GATEWAY (FIXED) */}
          <View style={styles.cardHeaderRow}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                triggerFeedback();
                router.replace('/(app)/settings');
              }}
            >
              <ChevronLeft size={24} color="#FFF" strokeWidth={3} />
            </TouchableOpacity>

            <View style={styles.headerTitleGroup}>
              <Bell size={18} color={Theme.colors.primary} />
              <Text style={styles.headerTitle}>NOTIFICATION HUB</Text>
            </View>
          </View>

          {/* MASTER PREFERENCES HUD */}
          <View style={styles.preferenceCard}>
            <View style={styles.prefLeft}>
              <Settings2 size={18} color="#94A3B8" />
              <View>
                <Text style={styles.prefTitle}>SYSTEM ALERTS</Text>
                <Text style={styles.prefSub}>
                  Toggle all biometric and support notifications
                </Text>
              </View>
            </View>
            <Switch
              value={masterNotify}
              onValueChange={setMasterNotify}
              trackColor={{ false: '#1E293B', true: Theme.colors.primary }}
              thumbColor={masterNotify ? '#FFF' : '#475569'}
            />
          </View>

          <View style={styles.actionRow}>
            <Text style={styles.label}>RECENT ACTIVITY</Text>
            <TouchableOpacity onPress={markAllAsRead}>
              <Text style={styles.markReadText}>MARK ALL READ</Text>
            </TouchableOpacity>
          </View>

          {/* NOTIFICATION LEDGER */}
          <ScrollView
            style={styles.ledgerScroll}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={loadNotifications}
                tintColor={Theme.colors.primary}
              />
            }
          >
            {!masterNotify ? (
              <View style={styles.emptyState}>
                <BellOff size={40} color="#1E293B" />
                <Text style={styles.emptyText}>NOTIFICATIONS SILENCED</Text>
                <Text style={styles.emptySub}>
                  Re-enable alerts to resume biometric monitoring.
                </Text>
              </View>
            ) : loading ? (
              <ActivityIndicator
                color={Theme.colors.primary}
                style={{ marginTop: 40 }}
              />
            ) : notifications.length === 0 ? (
              <View style={styles.emptyState}>
                <Bell size={40} color="#1E293B" />
                <Text style={styles.emptyText}>NO ACTIVE ALERTS</Text>
                <Text style={styles.emptySub}>
                  System is operating within nominal parameters.
                </Text>
              </View>
            ) : (
              notifications.map((item) => (
                <View
                  key={item.id}
                  style={[styles.item, !item.is_read && styles.unreadItem]}
                >
                  <View style={styles.itemIconBox}>{getIcon(item.type)}</View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.itemHeader}>
                      <Text style={styles.itemTitle}>
                        {item.title.toUpperCase()}
                      </Text>
                      {!item.is_read && <View style={styles.dot} />}
                    </View>
                    <Text style={styles.itemMessage}>{item.message}</Text>
                    <Text style={styles.itemTime}>
                      {new Date(item.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        </GlassCard>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#020617',
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardWrapper: { width: '100%', alignItems: 'center' },
  container: {
    padding: 40,
    width: '100%',
    borderRadius: 48,
    position: 'relative',
    maxHeight: '85%',
  },
  desktopHUD: { maxWidth: 480 },

  cardHeaderRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: -16,
    top: -16,
    padding: 14,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
  },
  headerTitleGroup: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerTitle: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2.5,
  },

  preferenceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  prefLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  prefTitle: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  prefSub: {
    color: '#475569',
    fontSize: 9,
    fontWeight: '700',
    marginTop: 2,
    maxWidth: 180,
  },

  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  label: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 8.5,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  markReadText: {
    color: Theme.colors.primary,
    fontSize: 8.5,
    fontWeight: '900',
    letterSpacing: 1,
  },

  ledgerScroll: { width: '100%' },
  item: {
    flexDirection: 'row',
    gap: 16,
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.01)',
    borderRadius: 24,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  unreadItem: {
    backgroundColor: 'rgba(79, 209, 199, 0.02)',
    borderColor: 'rgba(79, 209, 199, 0.08)',
  },
  itemIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  itemTitle: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Theme.colors.primary,
  },

  itemMessage: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  itemTime: { color: '#475569', fontSize: 9, fontWeight: '800', marginTop: 8 },

  emptyState: { alignItems: 'center', paddingVertical: 80, gap: 12 },
  emptyText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 2,
  },
  emptySub: {
    color: '#475569',
    fontSize: 10,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
