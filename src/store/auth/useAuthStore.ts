import { create } from 'zustand';
import { supabase } from '../../utils/supabase';
import { router } from 'expo-router';

/**
 * PROJECT CRADLE: CORE AUTHENTICATION STORE
 * Path: src/store/auth/useAuthStore.ts
 * Logic: Handles Identity, Roles, and Session Departure.
 */

interface AuthState {
  profile: any | null;
  role: 'ADMIN' | 'SUPPORT' | 'PREMIUM_MEMBER' | 'MEMBER' | null;
  isLoading: boolean;
  fetchProfile: () => Promise<void>;
  logout: () => Promise<void>; // THE MISSING DEPARTURE PROTOCOL
}

export const useAuthStore = create<AuthState>((set) => ({
  profile: null,
  role: null,
  isLoading: false,

  /**
   * RECONNAISSANCE: Fetch the profile and role from the Supabase Ledger
   */
  fetchProfile: async () => {
    set({ isLoading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        set({ profile: null, role: null, isLoading: false });
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      set({ profile, role: (profile as any)?.role, isLoading: false });
    } catch (err) {
      console.error("[Cradle Auth] Profile Fetch Failure:", err);
      set({ profile: null, role: null, isLoading: false });
    }
  },

  /**
   * DEPARTURE: Terminate session and reset system state
   * Resolves Error 2339 in TopBar.tsx
   */
  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // 1. Reset Internal State
      set({ profile: null, role: null });

      // 2. Redirect to Auth Mesh
      router.replace('/(auth)/login');
      console.log("[Cradle Auth] Session Terminated Successfully.");
    } catch (err) {
      console.error("[Cradle Auth] Logout Error:", err);
    }
  },
}));