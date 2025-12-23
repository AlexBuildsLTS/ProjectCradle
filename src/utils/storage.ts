import AsyncStorage from '@react-native-async-storage/async-storage';
import console from 'console';

/**
 * PROJECT CRADLE: LOCAL STORAGE UTILITY
 * Path: src/utils/storage.ts
 */
export const storage = {
  async getItem(key: string) {
    try {
      return await AsyncStorage.getItem(key);
    } catch (_e) {
      return null;
    }
  },
  async setItem(key: string, value: string) {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      console.error('[Storage] Save Failure:', e);
    }
  },
  async removeItem(key: string) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.error('[Storage] Remove Failure:', e);
    }
  },
  // Legacy methods for backward compatibility
  async save(key: string, value: unknown) {
    await this.setItem(key, JSON.stringify(value as any));
  },
  async load(key: string) {
    const val = await this.getItem(key);
    return val ? JSON.parse(val) : null;
  },
  async remove(key: string) {
    await this.removeItem(key);
  },
};
