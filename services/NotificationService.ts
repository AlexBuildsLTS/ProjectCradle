/**
 * PROJECT CRADLE: SMART NOTIFICATION ENGINE V1.1 (AAA+ TIER)
 * Path: services/NotificationService.ts
 * * FIXES:
 * - Resolved NotificationBehavior mismatch (added Banner/List properties).
 * - Fixed NotificationTriggerInput errors (added SchedulableTriggerInput types).
 */

import { supabase } from '@/lib/supabase';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { SchedulableTriggerInputTypes } from 'expo-notifications';
import { Platform } from 'react-native';

// --- 1. FIXED NOTIFICATION HANDLER ---
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    // Required properties for modern expo-notifications
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const NotificationService = {
  /**
   * Registers the device and saves the push token to the user's profile.
   */
  registerForPushNotifications: async (userId: string) => {
    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#4FD1C7',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        console.warn('Failed to get push token for push notification!');
        return;
      }

      // Note: projectId is required for physical devices in newer Expo versions
      token = (await Notifications.getExpoPushTokenAsync()).data;

      // Update user profile with token for server-side SweetSpot triggers
      if (userId) {
        await supabase
          .from('profiles')
          .update({ expo_push_token: token })
          .eq('id', userId);
      }
    }

    return token;
  },

  /**
   * --- 2. FIXED SWEETSPOT TRIGGER ---
   * Modern Expo requires 'type: SchedulableTriggerInputTypes.TIME_INTERVAL'
   */
  scheduleSweetSpotAlert: async (babyName: string, minutesUntilNap: number) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `🌙 SweetSpot® Alert for ${babyName}`,
        body: `The ideal nap window opens in ${minutesUntilNap} minutes. Time to start the wind-down routine!`,
        data: { screen: 'growth' },
        sound: 'default',
      },
      trigger: {
        type: SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 2, // Testing trigger
      },
    });
  },

  /**
   * --- 3. FIXED MEDICATION TRIGGER ---
   * Passing a Date object directly is deprecated; use numerical timestamp.
   */
  scheduleMedicationReminder: async (medName: string, date: Date) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '💊 Medication Reminder',
        body: `It's time for ${medName}'s scheduled dose.`,
      },
      trigger: {
        type: SchedulableTriggerInputTypes.DATE,
        date: date.getTime(), // Must be a number (milliseconds)
      },
    });
  },
};
