/**
 * ============================================================================
 * 🔐 SECURE STORAGE (TITAN LAYER V1.1)
 * ============================================================================
 * Abstraction layer ensuring secrets are stored in the device's hardware
 * Secure Enclave (iOS/Android).
 * * FIX: Added SSR-safe window checks to prevent build-time crashes.
 * ============================================================================
 */

import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Helper to determine if we are in a browser environment
const isBrowser = typeof window !== 'undefined';

export const setItem = async (key: string, value: string): Promise<void> => {
  try {
    if (Platform.OS === 'web') {
      if (isBrowser) {
        window.localStorage.setItem(key, value);
      }
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  } catch (error) {
    console.error(`[SecureStorage] Error setting ${key}:`, error);
    throw error;
  }
};

export const getItem = async (key: string): Promise<string | null> => {
  try {
    if (Platform.OS === 'web') {
      if (isBrowser) {
        return window.localStorage.getItem(key);
      }
      return null;
    } else {
      return await SecureStore.getItemAsync(key);
    }
  } catch (error) {
    console.error(`[SecureStorage] Error getting ${key}:`, error);
    return null;
  }
};

export const deleteItem = async (key: string): Promise<void> => {
  try {
    if (Platform.OS === 'web') {
      if (isBrowser) {
        window.localStorage.removeItem(key);
      }
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  } catch (error) {
    console.error(`[SecureStorage] Error deleting ${key}:`, error);
  }
};

/**
 * Supabase Auth Storage Adapter
 * Designed to interface directly with the Supabase GoTrue singleton.
 */
export const secureStorage = {
  getItem: async (key: string): Promise<string | null> => {
    return await getItem(key);
  },
  setItem: async (key: string, value: string): Promise<void> => {
    await setItem(key, value);
  },
  removeItem: async (key: string): Promise<void> => {
    await deleteItem(key);
  },
};
