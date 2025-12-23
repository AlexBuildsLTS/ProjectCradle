import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import process from 'node:process';
import { Platform } from 'react-native';
import 'react-native-url-polyfill/auto.js';

/**
 * PROJECT CRADLE: CORE SUPABASE INFRASTRUCTURE
 * Hardened for Expo & Pediatric Surveillance
 */

// 1. DATABASE SCHEMA (YOUR VERIFIED CRADLE TYPES)
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          baby_name: string | null;
          baby_dob: string | null;
          avatar_url: string | null;
          role: 'parent' | 'caregiver' | 'admin';
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string;
          baby_name?: string;
          baby_dob?: string;
          role?: string;
        };
        Update: {
          full_name?: string;
          baby_name?: string;
          baby_dob?: string;
          avatar_url?: string;
        };
      };
      care_events: {
        Row: {
          id: string;
          user_id: string;
          event_type: 'SLEEP' | 'FEED' | 'DIAPER' | 'NOTE';
          timestamp: string;
          metadata: {
            subtype?: 'START' | 'END' | 'BOTTLE' | 'BREAST';
            amount_ml?: number;
            side?: 'LEFT' | 'RIGHT' | 'BOTH';
            note?: string;
          };
          created_at: string;
        };
        Insert: {
          user_id: string;
          event_type: string;
          timestamp: string;
          metadata?: any;
        };
        Update: { event_type?: string; timestamp?: string; metadata?: any };
      };
      support_tickets: {
        Row: {
          id: string;
          user_id: string;
          subject: string;
          status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
          created_at: string;
        };
        Insert: { user_id: string; subject: string; status?: string };
        Update: { status?: string };
      };
    };
  };
};

// 2. ENVIRONMENT INJECTION (EXPO_PUBLIC_ HANDSHAKE)
// These MUST be named EXPO_PUBLIC_ in your .env file
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// 3. PLATFORM-AWARE STORAGE ADAPTER
// Use SecureStore for native (iOS/Android), localStorage for web
const StorageAdapter =
  Platform.OS === 'web'
    ? {
        getItem: async (key: string) => {
          if (typeof (globalThis as any).window !== 'undefined') {
            return (globalThis as any).window.localStorage.getItem(key);
          }
          return null;
        },
        setItem: async (key: string, value: string) => {
          if (typeof (globalThis as any).window !== 'undefined') {
            (globalThis as any).window.localStorage.setItem(key, value);
          }
        },
        removeItem: async (key: string) => {
          if (typeof (globalThis as any).window !== 'undefined') {
            (globalThis as any).window.localStorage.removeItem(key);
          }
        },
      }
    : {
        getItem: (key: string) => SecureStore.getItemAsync(key),
        setItem: (key: string, value: string) =>
          SecureStore.setItemAsync(key, value),
        removeItem: (key: string) => SecureStore.deleteItemAsync(key),
      };

// 4. INITIALIZE CLIENT
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: StorageAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: Platform.OS === 'web',
  },
});
