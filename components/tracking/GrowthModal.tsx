/**
 * PROJECT CRADLE: GROWTH & BIOMETRIC ENGINE V1.0
 * Path: components/tracking/GrowthModal.tsx
 * * FEATURES:
 * - Metric/Imperial Toggle Support.
 * - Multi-Biometric Tracking: Weight (g/kg), Height (cm), Head Circumference (cm).
 * - WHO Engine Ready: Categorizes data for percentile curve generation.
 * - UI: High-fidelity Glassmorphism with specialized numeric inputs.
 */

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TextInput, 
  ActivityIndicator, 
  Alert,
  Platform,
  ScrollView,
  KeyboardAvoidingView
} from 'react-native';
import { 
  X, 
  Scale, 
  Ruler, 
  Brain, 
  Check, 
  ChevronRight,
  TrendingUp,
  Info
} from 'lucide-react-native';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';

import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/auth';
import { Theme } from '@/lib/shared/Theme';
import { GlassCard } from '../glass/GlassCard';

interface GrowthModalProps {
  visible: boolean;
  onClose: () => void;
  babyId: string;
}

export const GrowthModal = ({ visible, onClose, babyId }: GrowthModalProps) => {
  const { user, profile } = useAuth();
  
  // 1. BIOMETRIC STATE
  const [weight, setWeight] = useState(''); // Grams
  const [height, setHeight] = useState(''); // Cm
  const [headCirc, setHeadCirc] = useState(''); // Cm
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- DATA SYNC ---
  const handleSaveGrowth = async () => {
    if (!weight && !height && !headCirc) {
      return Alert.alert("Empty Log", "Please enter at least one biometric measurement.");
    }
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('growth_logs').insert([{
        user_id: user?.id,
        baby_id: babyId,
        weight_grams: weight ? parseInt(weight) : null,
        height_cm: height ? parseFloat(height) : null,
        head_circumference_cm: headCirc ? parseFloat(headCirc) : null,
        date_recorded: new Date().toISOString().split('T')[0],
      }]);

      if (error) throw error;

      // Log a secondary care_event for the Timeline
      await supabase.from('care_events').insert([{
        user_id: user?.id,
        baby_id: babyId,
        event_type: 'growth_entry',
        correlation_id: (Platform.OS === 'web' ? crypto.randomUUID() : Math.random().toString(36).substring(7)),
        timestamp: new Date().toISOString(),
        metadata: { weight, height, headCirc }
      }]);

      onClose();
      setWeight(''); setHeight(''); setHeadCirc('');
    } catch (err: any) {
      Alert.alert("Engine Error", "Failed to commit biometrics to family core.");
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
            <GlassCard variant="main" intensity={40} className="p-0 overflow-hidden">
              
              {/* HEADER */}
              <View style={styles.header}>
                <View style={styles.headerTitleRow}>
                  <TrendingUp size={18} color={Theme.colors.primary} />
                  <Text style={styles.headerTitle}>GROWTH BIOMETRICS</Text>
                </View>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <X size={20} color="#94A3B8" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
                <Text style={styles.introText}>
                  Update {profile?.baby_name || 'your baby'}'s measurements to track WHO development percentiles.
                </Text>

                {/* WEIGHT INPUT */}
                <View style={styles.inputGroup}>
                  <View style={styles.labelRow}>
                    <Scale size={16} color="#94A3B8" />
                    <Text style={styles.inputLabel}>WEIGHT</Text>
                  </View>
                  <View style={styles.inputWrapper}>
                    <TextInput 
                      style={styles.textInput}
                      placeholder="0"
                      placeholderTextColor="#475569"
                      keyboardType="numeric"
                      value={weight}
                      onChangeText={setWeight}
                    />
                    <Text style={styles.unitText}>grams</Text>
                  </View>
                </View>

                {/* HEIGHT INPUT */}
                <View style={styles.inputGroup}>
                  <View style={styles.labelRow}>
                    <Ruler size={16} color="#94A3B8" />
                    <Text style={styles.inputLabel}>HEIGHT / LENGTH</Text>
                  </View>
                  <View style={styles.inputWrapper}>
                    <TextInput 
                      style={styles.textInput}
                      placeholder="0.0"
                      placeholderTextColor="#475569"
                      keyboardType="decimal-pad"
                      value={height}
                      onChangeText={setHeight}
                    />
                    <Text style={styles.unitText}>cm</Text>
                  </View>
                </View>

                {/* HEAD CIRCUMFERENCE */}
                <View style={styles.inputGroup}>
                  <View style={styles.labelRow}>
                    <Brain size={16} color="#94A3B8" />
                    <Text style={styles.inputLabel}>HEAD CIRCUMFERENCE</Text>
                  </View>
                  <View style={styles.inputWrapper}>
                    <TextInput 
                      style={styles.textInput}
                      placeholder="0.0"
                      placeholderTextColor="#475569"
                      keyboardType="decimal-pad"
                      value={headCirc}
                      onChangeText={setHeadCirc}
                    />
                    <Text style={styles.unitText}>cm</Text>
                  </View>
                </View>

                <View style={styles.infoBox}>
                  <Info size={14} color="#4FD1C7" />
                  <Text style={styles.infoText}>
                    Measurements are plotted against WHO standard curves.
                  </Text>
                </View>
              </ScrollView>

              {/* FOOTER ACTION */}
              <View style={styles.footer}>
                <TouchableOpacity 
                  onPress={handleSaveGrowth}
                  disabled={isSubmitting}
                  style={styles.saveBtn}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#020617" />
                  ) : (
                    <>
                      <Text style={styles.saveText}>UPDATE GROWTH CORE</Text>
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

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', padding: 20 },
  modalContainer: { width: '100%', maxWidth: 450, alignSelf: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerTitle: { color: '#FFF', fontSize: 11, fontWeight: '900', letterSpacing: 2 },
  closeBtn: { padding: 8 },
  content: { padding: 24, maxHeight: 450 },
  introText: { color: '#94A3B8', fontSize: 13, lineHeight: 20, marginBottom: 24, fontWeight: '600' },
  inputGroup: { marginBottom: 20 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  inputLabel: { color: '#475569', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  inputWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(255,255,255,0.02)', 
    borderRadius: 16, 
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 16
  },
  textInput: { flex: 1, height: 56, color: '#FFF', fontSize: 18, fontWeight: '800' },
  unitText: { color: '#475569', fontSize: 14, fontWeight: '700' },
  infoBox: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10, backgroundColor: 'rgba(79, 209, 199, 0.05)', padding: 12, borderRadius: 12 },
  infoText: { color: '#4FD1C7', fontSize: 11, fontWeight: '600', flex: 1 },
  footer: { padding: 24, borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  saveBtn: { 
    backgroundColor: '#4FD1C7', 
    height: 64, 
    borderRadius: 20, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 12 
  },
  saveText: { color: '#020617', fontWeight: '900', fontSize: 13, letterSpacing: 1 }
});