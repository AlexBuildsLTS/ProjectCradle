import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * PROJECT CRADLE: LOCAL STORAGE UTILITY
 * Path: src/utils/storage.ts
 */
export const storage = {
  async save(key: string, value: any) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error("[Storage] Save Failure:", e);
    }
  },
  async load(key: string) {
    try {
      const val = await AsyncStorage.getItem(key);
      return val ? JSON.parse(val) : null;
    } catch (e) {
      return null;
    }
  }
};