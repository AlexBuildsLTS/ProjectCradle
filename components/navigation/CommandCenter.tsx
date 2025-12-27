/**
 * PROJECT CRADLE: AI COMMAND CENTER V1.0
 * Path: components/navigation/CommandCenter.tsx
 * FEATURES:
 * - Centralized Access: One-tap access to all tracking modals.
 * - Staggered Animations: Smooth entry for a professional "AAA+" feel.
 * - Haptic Integration: Physical feedback on interaction.
 */

import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import {
  Activity,
  FileText,
  Milk,
  Moon,
  Thermometer,
  X,
  Zap,
} from 'lucide-react-native';
import React from 'react';
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
} from 'react-native-reanimated';

import { Theme } from '@/lib/shared/Theme';

interface CommandCenterProps {
  visible: boolean;
  onClose: () => void;
  onSelectAction: (action: string) => void;
}

export const CommandCenter = ({
  visible,
  onClose,
  onSelectAction,
}: CommandCenterProps) => {
  const handleAction = (type: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSelectAction(type);
    onClose();
  };

  const ACTIONS = [
    {
      id: 'feeding',
      label: 'Feeding',
      icon: Milk,
      color: '#4FD1C7',
      desc: 'Bottle or Nursing',
    },
    {
      id: 'sleep',
      label: 'Sleep',
      icon: Moon,
      color: '#B794F6',
      desc: 'Naps & Bedtime',
    },
    {
      id: 'growth',
      label: 'Growth',
      icon: Activity,
      color: '#4FD1C7',
      desc: 'Weight & Height',
    },
    {
      id: 'health',
      label: 'Health',
      icon: Thermometer,
      color: '#FB923C',
      desc: 'Fever & Meds',
    },
    {
      id: 'journal',
      label: 'Journal',
      icon: FileText,
      color: '#9AE6B4',
      desc: 'Milestones',
    },
  ];

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none">
      <View style={styles.overlay}>
        {/* BACKGROUND BLUR */}
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          style={StyleSheet.absoluteFill}
        >
          <BlurView
            intensity={40}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />
          <TouchableOpacity
            activeOpacity={1}
            onPress={onClose}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>

        {/* COMMAND PANEL */}
        <Animated.View
          entering={SlideInDown.springify().damping(15)}
          style={styles.sheet}
        >
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <Zap size={18} color={Theme.colors.primary} />
              <Text style={styles.headerTitle}>COMMAND CENTER</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <View style={styles.grid}>
            {ACTIONS.map((action, index) => (
              <TouchableOpacity
                key={action.id}
                onPress={() => handleAction(action.id)}
                style={styles.actionCard}
              >
                <View
                  style={[
                    styles.iconBox,
                    { backgroundColor: `${action.color}15` },
                  ]}
                >
                  <action.icon size={24} color={action.color} />
                </View>
                <View>
                  <Text style={styles.actionLabel}>{action.label}</Text>
                  <Text style={styles.actionDesc}>{action.desc}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* QUICK SUMMARY FOOTER */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Berry AI is monitoring patterns in real-time.
            </Text>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#020617',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerTitle: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: { gap: 12 },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  actionDesc: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  footer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: 'rgba(79, 209, 199, 0.05)',
    borderRadius: 16,
    alignItems: 'center',
  },
  footerText: { color: '#4FD1C7', fontSize: 11, fontWeight: '700' },
});
