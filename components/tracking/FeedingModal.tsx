/**
 * PROJECT CRADLE: HIGH-FIDELITY FEEDING ENGINE V1.1 (AAA+ TIER)
 * Path: components/tracking/FeedingModal.tsx
 * * FIXES:
 * - Resolved 'ScrollView' missing import error.
 * - Fixed TypeScript 'Timeout' type mismatch for setInterval.
 * * FEATURES:
 * - Triple-Mode Hub: Nursing (dual timers), Bottle (volume), and Solids (food type).
 * - Real-time Sync: Perspective logging to Supabase with correlation IDs.
 * - UI: Ultra-high-fidelity Glassmorphism with Backdrop Blur and melatonin-safe contrast.
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TextInput, 
  Platform, 
  Alert, 
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView // ADDED: Required for form navigation
} from 'react-native';
import { BlurView } from 'expo-blur';
import { 
  X, 
  Milk, 
  Utensils, 
  Timer, 
  Check, 
  Droplet
} from 'lucide-react-native';
import Animated, { SlideInUp } from 'react-native-reanimated';

import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/auth';
import { Theme } from '@/lib/shared/Theme'; 
import { GlassCard } from '../glass/GlassCard';

// --- TYPES ---
type FeedMode = 'nursing' | 'bottle' | 'solids';
type BreastSide = 'left' | 'right';

interface FeedingModalProps {
  visible: boolean;
  onClose: () => void;
  babyId: string;
}

export const FeedingModal = ({ visible, onClose, babyId }: FeedingModalProps) => {
  const { user } = useAuth();
  
  // 1. UI STATE
  const [mode, setMode] = useState<FeedMode>('nursing');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2. NURSING LOGIC STATE
  const [activeSide, setActiveSide] = useState<BreastSide | null>(null);
  const [leftTimer, setLeftTimer] = useState(0);
  const [rightTimer, setRightTimer] = useState(0);
  // FIXED: Using any to bridge NodeJS.Timeout vs Browser number type mismatch in RN
  const timerRef = useRef<any>(null); 

  // 3. BOTTLE & SOLIDS STATE
  const [volume, setVolume] = useState('120'); 
  const [foodType, setFoodType] = useState('');
  const [notes, setNotes] = useState('');

  // --- TIMER ENGINE ---
  useEffect(() => {
    if (activeSide) {
      timerRef.current = setInterval(() => {
        if (activeSide === 'left') setLeftTimer(prev => prev + 1);
        if (activeSide === 'right') setRightTimer(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [activeSide]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // --- DATA SYNC ---
  const handleSave = async () => {
    if (!user?.id || !babyId) {
      return Alert.alert("Error", "Biometric core not detected. Please restart the session.");
    }
    
    setIsSubmitting(true);
    try {
      const metadata = {
        mode,
        notes,
        ...(mode === 'nursing' && { left_duration: leftTimer, right_duration: rightTimer }),
        ...(mode === 'bottle' && { volume_ml: parseInt(volume) }),
        ...(mode === 'solids' && { food_item: foodType }),
      };

      const { error } = await supabase.from('care_events').insert([{
        user_id: user.id,
        baby_id: babyId,
        correlation_id: (Platform.OS === 'web' ? crypto.randomUUID() : Math.random().toString(36).substring(7)),
        event_type: `feeding_${mode}`,
        timestamp: new Date().toISOString(),
        metadata,
        notes: notes.trim()
      }]);

      if (error) throw error;
      
      // Reset State
      setLeftTimer(0); 
      setRightTimer(0); 
      setNotes('');
      setActiveSide(null);
      onClose();
    } catch (err: any) {
      Alert.alert("Sync Error", "Could not commit biometric log to family core: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <TouchableOpacity activeOpacity={1} onPress={onClose} style={StyleSheet.absoluteFill} />
        
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={styles.modalContainer}
        >
          <Animated.View entering={SlideInUp}>
            <GlassCard variant="main" intensity={40} className="p-0 overflow-hidden" style={styles.glassAdjust}>
              
              {/* HEADER */}
              <View style={styles.header}>
                <Text style={styles.headerTitle}>LOG FEEDING</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <X size={20} color="#94A3B8" />
                </TouchableOpacity>
              </View>

              {/* TAB SELECTOR */}
              <View style={styles.tabs}>
                <TabItem 
                  active={mode === 'nursing'} 
                  label="Nursing" 
                  icon={Droplet} 
                  onPress={() => setMode('nursing')} 
                />
                <TabItem 
                  active={mode === 'bottle'} 
                  label="Bottle" 
                  icon={Milk} 
                  onPress={() => setMode('bottle')} 
                />
                <TabItem 
                  active={mode === 'solids'} 
                  label="Solids" 
                  icon={Utensils} 
                  onPress={() => setMode('solids')} 
                />
              </View>

              <ScrollView style={styles.formContent} keyboardShouldPersistTaps="handled">
                
                {/* MODE 1: NURSING (DUAL TIMERS) */}
                {mode === 'nursing' && (
                  <View style={styles.nursingContainer}>
                    <View style={styles.timerRow}>
                      <TimerBlock 
                        side="LEFT" 
                        time={formatTime(leftTimer)} 
                        active={activeSide === 'left'}
                        onPress={() => setActiveSide(activeSide === 'left' ? null : 'left')}
                      />
                      <TimerBlock 
                        side="RIGHT" 
                        time={formatTime(rightTimer)} 
                        active={activeSide === 'right'}
                        onPress={() => setActiveSide(activeSide === 'right' ? null : 'right')}
                      />
                    </View>
                    <View style={styles.timerHint}>
                      <Timer size={14} color="#4FD1C7" />
                      <Text style={styles.hintText}>Tap a side to start recording the session.</Text>
                    </View>
                  </View>
                )}

                {/* MODE 2: BOTTLE (VOLUME) */}
                {mode === 'bottle' && (
                  <View style={styles.inputSection}>
                    <Text style={styles.inputLabel}>VOLUME (ML)</Text>
                    <View style={styles.volumeInputRow}>
                      <TextInput 
                        style={styles.volumeInput}
                        value={volume}
                        onChangeText={setVolume}
                        keyboardType="numeric"
                        placeholderTextColor="#475569"
                      />
                      <Text style={styles.unitText}>ml</Text>
                    </View>
                  </View>
                )}

                {/* MODE 3: SOLIDS */}
                {mode === 'solids' && (
                  <View style={styles.inputSection}>
                    <Text style={styles.inputLabel}>FOOD ITEM</Text>
                    <TextInput 
                      style={styles.glassInput}
                      value={foodType}
                      onChangeText={setFoodType}
                      placeholder="e.g., Avocado puree, Oatmeal"
                      placeholderTextColor="#475569"
                    />
                  </View>
                )}

                {/* SHARED: NOTES */}
                <View style={styles.inputSection}>
                  <Text style={styles.inputLabel}>OBSERVATIONS</Text>
                  <TextInput 
                    style={[styles.glassInput, { height: 80 }]}
                    value={notes}
                    onChangeText={setNotes}
                    multiline
                    placeholder="Note any fussiness or reactions..."
                    placeholderTextColor="#475569"
                  />
                </View>

              </ScrollView>

              {/* ACTION FOOTER */}
              <View style={styles.footer}>
                <TouchableOpacity 
                  onPress={handleSave} 
                  disabled={isSubmitting}
                  style={styles.saveBtn}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#020617" />
                  ) : (
                    <>
                      <Text style={styles.saveText}>LOG TO CORE</Text>
                      <Check size={20} color="#020617" />
                    </>
                  )}
                </TouchableOpacity>
              </View>

            </GlassCard>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

// --- SUB-COMPONENTS ---
const TabItem = ({ active, label, icon: Icon, onPress }: any) => (
  <TouchableOpacity 
    onPress={onPress} 
    style={[styles.tab, active && styles.tabActive]}
  >
    <Icon size={18} color={active ? '#020617' : '#94A3B8'} />
    <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
  </TouchableOpacity>
);

const TimerBlock = ({ side, time, active, onPress }: any) => (
  <TouchableOpacity 
    onPress={onPress}
    style={[styles.timerBlock, active && styles.timerBlockActive]}
  >
    <Text style={[styles.timerSide, active && { color: '#020617' }]}>{side}</Text>
    <Text style={[styles.timerValue, active && { color: '#020617' }]}>{time}</Text>
    <View style={[styles.timerStatus, { backgroundColor: active ? '#020617' : 'rgba(255,255,255,0.05)' }]}>
      <Text style={[styles.statusLabel, { color: active ? '#4FD1C7' : '#475569' }]}>
        {active ? 'RECORDING' : 'IDLE'}
      </Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', padding: 20 },
  modalContainer: { width: '100%', maxWidth: 500, alignSelf: 'center' },
  glassAdjust: { minHeight: 450 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 24, 
    borderBottomWidth: 1, 
    borderColor: 'rgba(255,255,255,0.05)' 
  },
  headerTitle: { color: '#FFF', fontSize: 13, fontWeight: '900', letterSpacing: 2 },
  closeBtn: { padding: 8 },
  tabs: { 
    flexDirection: 'row', 
    padding: 12, 
    gap: 8, 
    backgroundColor: 'rgba(255,255,255,0.02)' 
  },
  tab: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 8, 
    paddingVertical: 12, 
    borderRadius: 16, 
    borderWidth: 1, 
    borderColor: 'transparent' 
  },
  tabActive: { backgroundColor: '#4FD1C7', borderColor: '#4FD1C7' },
  tabText: { color: '#94A3B8', fontSize: 12, fontWeight: '800' },
  tabTextActive: { color: '#020617' },
  formContent: { padding: 24, maxHeight: 400 },
  nursingContainer: { gap: 20 },
  timerRow: { flexDirection: 'row', gap: 16 },
  timerBlock: { 
    flex: 1, 
    padding: 20, 
    borderRadius: 24, 
    backgroundColor: 'rgba(255,255,255,0.03)', 
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center'
  },
  timerBlockActive: { backgroundColor: '#4FD1C7', borderColor: '#4FD1C7' },
  timerSide: { color: '#94A3B8', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  timerValue: { color: '#FFF', fontSize: 32, fontWeight: '900', marginVertical: 8 },
  timerStatus: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusLabel: { fontSize: 8, fontWeight: '900' },
  timerHint: { flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'center', marginTop: 10 },
  hintText: { color: '#475569', fontSize: 11, fontWeight: '600' },
  inputSection: { marginBottom: 24 },
  inputLabel: { color: '#4FD1C7', fontSize: 10, fontWeight: '900', letterSpacing: 1.5, marginBottom: 12 },
  volumeInputRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12, 
    backgroundColor: 'rgba(255,255,255,0.03)', 
    borderRadius: 20, 
    paddingHorizontal: 20, 
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.06)' 
  },
  volumeInput: { flex: 1, height: 60, color: '#FFF', fontSize: 24, fontWeight: '900' },
  unitText: { color: '#475569', fontSize: 18, fontWeight: '800' },
  glassInput: { 
    backgroundColor: 'rgba(255,255,255,0.03)', 
    borderRadius: 20, 
    padding: 16, 
    color: '#FFF', 
    fontSize: 15, 
    fontWeight: '600', 
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.06)' 
  },
  footer: { padding: 24, borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  saveBtn: { 
    backgroundColor: '#4FD1C7', 
    height: 64, 
    borderRadius: 20, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 12,
    shadowColor: '#4FD1C7',
    shadowOpacity: 0.3,
    shadowRadius: 15
  },
  saveText: { color: '#020617', fontWeight: '900', letterSpacing: 1.5, fontSize: 14 }
});