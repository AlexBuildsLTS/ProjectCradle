/**
 * PROJECT CRADLE: HEALTH & MEDICATION ENGINE V1.0
 * Path: components/tracking/HealthLogModal.tsx
 * * FEATURES:
 * - Fever Tracker: Logs temperature with biometric precision.
 * - Medication Scheduler: Integrates with NotificationService for local alerts.
 * - History Sync: Commits all health events to the care_events ledger.
 */

import DateTimePicker from '@react-native-community/datetimepicker';
import {
  AlertCircle,
  Bell,
  Check,
  Clock,
  Pill,
  Thermometer,
  X,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { SlideInUp } from 'react-native-reanimated';

import { useAuth } from '@/context/auth';
import { Theme } from '@/lib/shared/Theme';
import { supabase } from '@/lib/supabase';
import { NotificationService } from '@/services/NotificationService';
import { GlassCard } from '../glass/GlassCard';

interface HealthLogModalProps {
  visible: boolean;
  onClose: () => void;
  babyId: string;
}

export const HealthLogModal = ({
  visible,
  onClose,
  babyId,
}: HealthLogModalProps) => {
  const { user, profile } = useAuth();

  // --- STATE ---
  const [logType, setLogType] = useState<'TEMP' | 'MED'>('TEMP');
  const [temp, setTemp] = useState('');
  const [medName, setMedName] = useState('');
  const [dosage, setDosage] = useState('');
  const [reminderTime, setReminderTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- SAVE LOGIC ---
  const handleSaveHealth = async () => {
    if (logType === 'TEMP' && !temp)
      return Alert.alert('Required', 'Please enter a temperature reading.');
    if (logType === 'MED' && !medName)
      return Alert.alert('Required', 'Please enter the medication name.');

    setIsSubmitting(true);
    try {
      const metadata =
        logType === 'TEMP'
          ? { temperature: parseFloat(temp), unit: '°C' }
          : {
              medication: medName,
              dosage,
              scheduled_time: reminderTime.toISOString(),
            };

      // 1. Log to Database
      const { error } = await supabase.from('care_events').insert([
        {
          user_id: user?.id,
          baby_id: babyId,
          event_type: logType === 'TEMP' ? 'health_temp' : 'health_medication',
          correlation_id:
            Platform.OS === 'web'
              ? crypto.randomUUID()
              : Math.random().toString(36).substring(7),
          timestamp: new Date().toISOString(),
          metadata,
        },
      ]);

      if (error) throw error;

      // 2. Schedule Local Notification if it's a Medication
      if (logType === 'MED') {
        await NotificationService.scheduleMedicationReminder(
          medName,
          reminderTime,
        );
      }

      Alert.alert(
        'Health Sync',
        'Log archived and reminders set in the family core.',
      );
      onClose();
      resetForm();
    } catch (err: any) {
      Alert.alert('Engine Failure', 'Could not commit health log to core.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTemp('');
    setMedName('');
    setDosage('');
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={onClose}
          style={StyleSheet.absoluteFill}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <Animated.View entering={SlideInUp}>
            <GlassCard
              variant="main"
              intensity={40}
              className="p-0 overflow-hidden"
            >
              {/* HEADER */}
              <View style={styles.header}>
                <Text style={styles.headerTitle}>HEALTH & VITALS</Text>
                <TouchableOpacity onPress={onClose}>
                  <X size={20} color="#94A3B8" />
                </TouchableOpacity>
              </View>

              {/* MODE SELECTOR */}
              <View style={styles.tabRow}>
                <TouchableOpacity
                  onPress={() => setLogType('TEMP')}
                  style={[styles.tab, logType === 'TEMP' && styles.tabActive]}
                >
                  <Thermometer
                    size={16}
                    color={logType === 'TEMP' ? '#020617' : '#94A3B8'}
                  />
                  <Text
                    style={[
                      styles.tabText,
                      logType === 'TEMP' && { color: '#020617' },
                    ]}
                  >
                    Fever
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setLogType('MED')}
                  style={[styles.tab, logType === 'MED' && styles.tabActive]}
                >
                  <Pill
                    size={16}
                    color={logType === 'MED' ? '#020617' : '#94A3B8'}
                  />
                  <Text
                    style={[
                      styles.tabText,
                      logType === 'MED' && { color: '#020617' },
                    ]}
                  >
                    Medication
                  </Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.form}
                keyboardShouldPersistTaps="handled"
              >
                {logType === 'TEMP' ? (
                  <View style={styles.inputSection}>
                    <Text style={styles.label}>TEMPERATURE (°C)</Text>
                    <TextInput
                      style={styles.glassInput}
                      placeholder="e.g. 37.5"
                      placeholderTextColor="#475569"
                      keyboardType="decimal-pad"
                      value={temp}
                      onChangeText={setTemp}
                    />
                    <View style={styles.warningBox}>
                      <AlertCircle size={14} color="#FB923C" />
                      <Text style={styles.warningText}>
                        Seek medical advice for temperatures above 38°C.
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.inputSection}>
                    <Text style={styles.label}>MEDICATION NAME</Text>
                    <TextInput
                      style={styles.glassInput}
                      placeholder="e.g. Paracetamol"
                      placeholderTextColor="#475569"
                      value={medName}
                      onChangeText={setMedName}
                    />
                    <Text style={[styles.label, { marginTop: 20 }]}>
                      DOSAGE
                    </Text>
                    <TextInput
                      style={styles.glassInput}
                      placeholder="e.g. 2.5ml"
                      placeholderTextColor="#475569"
                      value={dosage}
                      onChangeText={setDosage}
                    />

                    <TouchableOpacity
                      onPress={() => setShowTimePicker(true)}
                      style={styles.timePickerBtn}
                    >
                      <Clock size={18} color={Theme.colors.primary} />
                      <Text style={styles.timePickerText}>
                        Next Dose:{' '}
                        {reminderTime.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Text>
                      <Bell size={16} color={Theme.colors.primary} />
                    </TouchableOpacity>

                    {showTimePicker && (
                      <DateTimePicker
                        value={reminderTime}
                        mode="time"
                        display="spinner"
                        onChange={(e, date) => {
                          setShowTimePicker(false);
                          if (date) setReminderTime(date);
                        }}
                      />
                    )}
                  </View>
                )}
              </ScrollView>

              {/* FOOTER */}
              <View style={styles.footer}>
                <TouchableOpacity
                  onPress={handleSaveHealth}
                  disabled={isSubmitting}
                  style={styles.saveBtn}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#020617" />
                  ) : (
                    <>
                      <Text style={styles.saveText}>COMMIT TO HEALTH CORE</Text>
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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: { width: '100%', maxWidth: 450, alignSelf: 'center' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 2,
  },
  tabRow: {
    flexDirection: 'row',
    padding: 12,
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 16,
  },
  tabActive: { backgroundColor: '#4FD1C7' },
  tabText: { color: '#94A3B8', fontSize: 12, fontWeight: '800' },
  form: { padding: 24, maxHeight: 400 },
  inputSection: { marginBottom: 24 },
  label: {
    color: '#4FD1C7',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  glassInput: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    padding: 16,
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 16,
    backgroundColor: 'rgba(251, 146, 60, 0.05)',
    padding: 12,
    borderRadius: 12,
  },
  warningText: { color: '#FB923C', fontSize: 11, fontWeight: '600', flex: 1 },
  timePickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 24,
    backgroundColor: 'rgba(79, 209, 199, 0.05)',
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(79, 209, 199, 0.1)',
  },
  timePickerText: { color: '#FFF', fontSize: 15, fontWeight: '700', flex: 1 },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  saveBtn: {
    backgroundColor: '#4FD1C7',
    height: 64,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  saveText: {
    color: '#020617',
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 1,
  },
});
