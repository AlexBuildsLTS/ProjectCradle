import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/**
 * PROJECT CRADLE: MOBILE HAPTICS CORE
 * Provides high-integrity physical feedback for biometric events.
 */
export const triggerSuccess = () => {
  if (Platform.OS === 'web') return;
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
};

export const triggerImpact = () => {
  if (Platform.OS === 'web') return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
};

export const triggerLightImpact = () => {
  if (Platform.OS === 'web') return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
};

// CRITICAL FIX: Default export kills the terminal error
export default { triggerSuccess, triggerImpact, triggerLightImpact };
