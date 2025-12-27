/**
 * PROJECT CRADLE: MEDICATION INVENTORY CORE V1.1
 * Path: components/tracking/MedicationInventory.tsx
 * FEATURES: 
 * - Stock Tracking: Real-time inventory levels synchronized with Supabase.
 * - Depletion Alert: Visual indicators (Red/Orange) when stock levels fall below 20%.
 * - UI FIX: Resolved ScrollView 'gap' error by using contentContainerStyle.
 * - GLASSMORPHISM: High-fidelity obsidian design with teal and crimson accents.
 */

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator 
} from 'react-native';
import { Pill, AlertTriangle, Plus, Package } from 'lucide-react-native';
import { GlassCard } from '../glass/GlassCard';
import { Theme } from '@/lib/shared/Theme';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/auth';

export const MedicationInventory = () => {
  const { user } = useAuth();
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /**
     * Fetches the current cabinet inventory.
     * In production, this table should be populated via a 'medication_inventory' table.
     */
    async function fetchInventory() {
      if (!user?.id) return;
      try {
        const { data, error } = await supabase
          .from('medication_inventory')
          .select('*')
          .eq('user_id', user.id);
        
        if (data) setInventory(data);
      } catch (err) {
        console.error("Inventory Fetch Failure:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchInventory();
  }, [user?.id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* SECTION HEADER */}
      <View style={styles.header}>
        <Package size={18} color={Theme.colors.primary} />
        <Text style={styles.title}>MEDICATION CABINET</Text>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        // FIXED: Spacing moved to contentContainerStyle to avoid prop errors
        contentContainerStyle={styles.scrollContent}
      >
        {inventory.map((item) => {
          const percentage = (item.current_volume / item.max_volume) * 100;
          const isLow = percentage < 20;

          return (
            <GlassCard key={item.id} style={styles.medCard} variant={isLow ? 'main' : 'teal'}>
              <View style={styles.medHeader}>
                <Pill size={20} color={isLow ? '#F87171' : Theme.colors.primary} />
                {isLow && <AlertTriangle size={14} color="#F87171" />}
              </View>
              
              <Text style={styles.medName} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.stockLabel}>STOCK LEVEL</Text>
              
              {/* REMAINING STOCK BAR */}
              <View style={styles.progressContainer}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      width: `${Math.max(percentage, 5)}%`, 
                      backgroundColor: isLow ? '#F87171' : Theme.colors.primary 
                    }
                  ]} 
                />
              </View>
              
              <View style={styles.volumeRow}>
                <Text style={styles.volumeText}>{item.current_volume}{item.unit}</Text>
                <Text style={styles.percentText}>{Math.round(percentage)}%</Text>
              </View>
            </GlassCard>
          );
        })}
        
        {/* ADD NEW MEDICATION INTERFACE */}
        <TouchableOpacity style={styles.addCard} activeOpacity={0.7}>
          <Plus size={24} color="#475569" />
          <Text style={styles.addText}>ADD ITEM</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 32 },
  center: { height: 160, justifyContent: 'center', alignItems: 'center' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 10, 
    marginBottom: 20, 
    paddingHorizontal: 4 
  },
  title: { 
    color: '#4FD1C7', 
    fontSize: 10, 
    fontWeight: '900', 
    letterSpacing: 2 
  },
  scrollContent: {
    paddingHorizontal: 4,
    // Spacing is applied here safely
    gap: 16 
  },
  medCard: { 
    width: 160, 
    padding: 20 
  },
  medHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 16 
  },
  medName: { 
    color: '#FFF', 
    fontSize: 16, 
    fontWeight: '800', 
    marginBottom: 4 
  },
  stockLabel: { 
    color: '#475569', 
    fontSize: 9, 
    fontWeight: '900', 
    letterSpacing: 1, 
    marginBottom: 12 
  },
  progressContainer: { 
    height: 4, 
    backgroundColor: 'rgba(255,255,255,0.05)', 
    borderRadius: 2, 
    marginBottom: 8, 
    overflow: 'hidden' 
  },
  progressFill: { 
    height: '100%' 
  },
  volumeRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  volumeText: { 
    color: '#94A3B8', 
    fontSize: 12, 
    fontWeight: '700' 
  },
  percentText: { 
    color: '#475569', 
    fontSize: 10, 
    fontWeight: '800' 
  },
  addCard: { 
    width: 140, 
    height: 160, 
    borderRadius: 24, 
    borderStyle: 'dashed', 
    borderWidth: 2, 
    borderColor: 'rgba(255,255,255,0.05)', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 10 
  },
  addText: { 
    color: '#475569', 
    fontSize: 10, 
    fontWeight: '900' 
  }
});