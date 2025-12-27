/**
 * PROJECT CRADLE: INTELLIGENT SLEEP ENGINE V1.0
 * Path: components/tracking/SleepModal.tsx
 * * FEATURES:
 * - Real-time Sleep Timer: High-precision tracking for naps and night sleep.
 * - Environmental Tagging: Correlate sleep quality with location (Crib, Stroller, Car, etc.).
 * - SweetSpot® Integration: Prepares data for AI awake-window optimization.
 * - UI: Melatonin-safe Obsidian design with glassmorphism overlays.
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  Platform
} from 'react-native';
import { 
  X, 
  Moon, 
  Sun, 
  Timer, 
  Home, 
  Navigation, 
  Check,
  CloudMoon,
  Info
} from 'lucide-react-native';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';

import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/auth';
import { Theme } from '@/lib/shared/Theme';
import { GlassCard } from '../glass/GlassCard';

// --- TYPES ---
type SleepLocation = 'CRIB' | 'STROLLER' | 'CAR' | 'CARRIER' | 'OTHER';

interface SleepModalProps {
  visible: boolean;
  onClose: () => void;
  babyId: string;
}

export const SleepModal = ({ visible, onClose, babyId }: SleepModalProps) => {
  const { user } = useAuth();
  
  // 1. SESSION STATE
  const [isAsleep, setIsAsleep] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [location, setLocation] = useState<SleepLocation>('CRIB');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const timerRef = useRef<any>(null);

  // --- TIMER LOGIC ---
  useEffect(() => {
    if (isAsleep) {
      timerRef.current = setInterval(() => {
        setElapsed(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isAsleep]);

  const toggleSleep = () => {
    if (!isAsleep) {
      setStartTime(new Date());
      setIsAsleep(true);
    } else {
      handleFinalizeSleep();
    }
  };

  const formatElapsed = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs > 0 ? hrs + 'h ' : ''}${mins}m ${secs}s`;
  };

  // --- DATA SYNC ---
  const handleFinalizeSleep = async () => {
    if (!startTime) return;
    
    setIsSubmitting(true);
    const endTime = new Date();
    
    try {
      const { error } = await supabase.from('care_events').insert([{
        user_id: user?.id,
        baby_id: babyId,
        correlation_id: (Platform.OS === 'web' ? crypto.randomUUID() : Math.random().toString(36).substring(7)),
        event_type: 'sleep_session',
        timestamp: startTime.toISOString(),
        metadata: {
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          duration_seconds: elapsed,
          location: location,
          is_nap: endTime.getHours() > 7 && endTime.getHours() < 19
        }
      }]);

      if (error) throw error;
      
      // Reset and Exit
      setIsAsleep(false);
      setElapsed(0);
      setStartTime(null);
      onClose();
    } catch (err: any) {
      Alert.alert("Sync Error", "Could not synchronize sleep data with the core.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <TouchableOpacity activeOpacity={1} onPress={onClose} style={StyleSheet.absoluteFill} />
        
        <Animated.View entering={SlideInUp} style={styles.modalContainer}>
          <GlassCard variant={isAsleep ? 'lavender' : 'main'} intensity={40} className="p-0 overflow-hidden">
            
            {/* HEADER */}
            <View style={styles.header}>
              <View style={styles.headerTitleRow}>
                <Moon size={18} color={Theme.colors.secondary} />
                <Text style={styles.headerTitle}>SLEEP MONITOR</Text>
              </View>
              {!isAsleep && (
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <X size={20} color="#94A3B8" />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.content}>
              {/* TIMER DISPLAY */}
              <View style={styles.timerContainer}>
                <Text style={styles.timerLabel}>
                  {isAsleep ? 'CURRENT SESSION DURATION' : 'READY TO START'}
                </Text>
                <Text style={[styles.timerValue, isAsleep && { color: Theme.colors.secondary }]}>
                  {formatElapsed(elapsed)}
                </Text>
                {isAsleep && (
                  <View style={styles.liveIndicator}>
                    <View style={styles.pulseDot} />
                    <Text style={styles.liveText}>LIVE MONITORING</Text>
                  </View>
                )}
              </View>

              {/* LOCATION SELECTOR */}
              {!isAsleep && (
                <View style={styles.locationSection}>
                  <Text style={styles.sectionLabel}>SLEEP LOCATION</Text>
                  <View style={styles.locationGrid}>
                    <LocationBtn icon={Home} label="Crib" active={location === 'CRIB'} onPress={() => setLocation('CRIB')} />
                    <LocationBtn icon={Navigation} label="Stroller" active={location === 'STROLLER'} onPress={() => setLocation('STROLLER')} />
                    <LocationBtn icon={CloudMoon} label="Carrier" active={location === 'CARRIER'} onPress={() => setLocation('CARRIER')} />
                  </View>
                </View>
              )}

              {/* ACTION BUTTON */}
              <TouchableOpacity 
                onPress={toggleSleep} 
                disabled={isSubmitting}
                style={[
                  styles.mainActionBtn, 
                  isAsleep ? styles.stopBtn : styles.startBtn
                ]}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#020617" />
                ) : (
                  <>
                    {isAsleep ? <Sun size={24} color="#020617" /> : <Moon size={24} color="#020617" />}
                    <Text style={styles.actionText}>
                      {isAsleep ? 'WAKE UP BABY' : 'BABY IS ASLEEP'}
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              {/* AI INSIGHT FOOTER */}
              <View style={styles.insightFooter}>
                <Info size={14} color="#475569" />
                <Text style={styles.insightText}>
                  Accurate sleep logging improves SweetSpot® predictions.
                </Text>
              </View>
            </View>

          </GlassCard>
        </Animated.View>
      </View>
    </Modal>
  );
};

// --- SUB-COMPONENTS ---
const LocationBtn = ({ icon: Icon, label, active, onPress }: any) => (
  <TouchableOpacity 
    onPress={onPress} 
    style={[styles.locBtn, active && styles.locBtnActive]}
  >
    <Icon size={18} color={active ? '#020617' : '#94A3B8'} />
    <Text style={[styles.locLabel, active && { color: '#020617' }]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', padding: 20 },
  modalContainer: { width: '100%', maxWidth: 450, alignSelf: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerTitle: { color: Theme.colors.secondary, fontSize: 12, fontWeight: '900', letterSpacing: 2 },
  closeBtn: { padding: 8 },
  content: { padding: 24 },
  timerContainer: { alignItems: 'center', marginVertical: 40 },
  timerLabel: { color: '#475569', fontSize: 11, fontWeight: '900', letterSpacing: 1.5, marginBottom: 16 },
  timerValue: { color: '#FFF', fontSize: 56, fontWeight: '900', letterSpacing: -2 },
  liveIndicator: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 16, backgroundColor: 'rgba(183, 148, 246, 0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  pulseDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Theme.colors.secondary },
  liveText: { color: Theme.colors.secondary, fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  locationSection: { marginBottom: 32 },
  sectionLabel: { color: '#475569', fontSize: 10, fontWeight: '900', letterSpacing: 1.5, marginBottom: 16, textAlign: 'center' },
  locationGrid: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  locBtn: { flex: 1, alignItems: 'center', gap: 8, padding: 16, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.02)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  locBtnActive: { backgroundColor: Theme.colors.secondary, borderColor: Theme.colors.secondary },
  locLabel: { color: '#94A3B8', fontSize: 11, fontWeight: '800' },
  mainActionBtn: { height: 72, borderRadius: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 14, shadowOpacity: 0.3, shadowRadius: 20 },
  startBtn: { backgroundColor: Theme.colors.primary, shadowColor: Theme.colors.primary },
  stopBtn: { backgroundColor: Theme.colors.secondary, shadowColor: Theme.colors.secondary },
  actionText: { color: '#020617', fontSize: 16, fontWeight: '900', letterSpacing: 1 },
  insightFooter: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 32, opacity: 0.6, justifyContent: 'center' },
  insightText: { color: '#475569', fontSize: 11, fontWeight: '600' }
});