import { Bell, Clock } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { supabase } from '../../lib/supabase';
import { Theme } from './shared/Theme';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setNotifications(data);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 24 }}
    >
      <Text style={styles.title}>Intelligence Feed</Text>

      {notifications.length === 0 ? (
        <View style={styles.emptyState}>
          <Bell size={48} color={Theme.colors.textMuted} opacity={0.2} />
          <Text style={styles.emptyText}>No new care signals detected.</Text>
        </View>
      ) : (
        notifications.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.iconCircle}>
              <Clock size={16} color={Theme.colors.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardMessage}>{item.message}</Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  title: { color: '#FFF', fontSize: 32, fontWeight: '900', marginBottom: 24 },
  emptyState: { alignItems: 'center', marginTop: 100 },
  emptyText: {
    color: Theme.colors.textMuted,
    marginTop: 16,
    fontWeight: '600',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(79, 209, 199, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: { color: '#FFF', fontWeight: '800', fontSize: 14 },
  cardMessage: { color: Theme.colors.textMuted, fontSize: 13, marginTop: 2 },
});
