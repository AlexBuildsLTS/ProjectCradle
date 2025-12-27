/**
 * PROJECT CRADLE: SUPABASE CORE ENGINE V2.1
 * Path: lib/supabase.ts
 * FIXES:
 * - SSR Stability: Prevents "localStorage is not defined" crash during server-side build.
 * - Singleton Pattern: Prevents multiple client collision on Web.
 */

import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import 'react-native-url-polyfill/auto';
import { secureStorage } from './secureStorage';

// --- 1. CONFIGURATION ---
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// --- 2. STORAGE ADAPTER RESOLUTION ---
/**
 * Safely resolves storage based on Environment.
 * If SSR (Server), returns undefined to avoid "localStorage not defined" crash.
 * If Web, returns localStorage.
 * If Native, returns your secureStorage adapter.
 */
const getBrowserStorage = () => {
  if (typeof window !== 'undefined') {
    return window.localStorage;
  }
  return undefined; // Server-side fallback
};

const authStorage = Platform.OS === 'web' ? getBrowserStorage() : secureStorage;

// --- 3. SINGLETON INITIALIZATION ---
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: authStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: Platform.OS === 'web',
  },
});

// --- 4. ADMIN HELPER FUNCTIONS ---

export async function adminChangeUserRole(userId: string, newRole: string) {
  const { data, error } = await supabase.functions.invoke('admin-change-role', {
    body: { userId, newRole },
  });
  if (error)
    throw new Error(`[Cradle Admin] Role Update Failed: ${error.message}`);
  return data;
}

export async function adminDeactivateUser(userId: string) {
  const { data, error } = await supabase.functions.invoke('admin-deactivate', {
    body: { userId, deactivate: true },
  });
  if (error)
    throw new Error(`[Cradle Admin] Deactivation Failed: ${error.message}`);
  return data;
}

export async function adminDeleteUser(userId: string) {
  const { data, error } = await supabase.functions.invoke('admin-delete', {
    body: { userId },
  });
  if (error)
    throw new Error(`[Cradle Admin] Deletion Failed: ${error.message}`);
  return data;
}
