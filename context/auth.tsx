import { Session } from '@supabase/supabase-js';
import {
  Href,
  useRootNavigationState,
  useRouter,
  useSegments,
} from 'expo-router';
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { supabase } from '../lib/supabase';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  login: (e: string, p: string) => Promise<void>;
  register: (e: string, p: string, f: string, l: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState();

  const fetchProfile = async (currentSession: Session) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentSession.user.id)
        .single();

      const SUPABASE_NOT_FOUND = 'PGRST116';
      if (error && error.code !== SUPABASE_NOT_FOUND) throw error;

      const profile = data || {};

      setUser({
        id: currentSession.user.id,
        email: currentSession.user.email!,
        name: profile.full_name || currentSession.user.email!.split('@')[0],
        full_name:
          profile.full_name || currentSession.user.email!.split('@')[0],
        role: (profile.role || 'MEMBER') as UserRole, // Correct Role Sync
        tier: profile.tier || 'FREE',
        status: 'active',
        avatar_url: profile.avatar_url || null,
        baby_name: profile.baby_name || null,
        baby_dob: profile.baby_dob || null,
        currency: profile.currency || 'USD',
        country: profile.country || 'US',
        is_onboarded: profile.is_onboarded || false,
        timezone: profile.timezone || null,
        created_at: profile.created_at || new Date().toISOString(),
        updated_at: profile.updated_at || new Date().toISOString(),
        metadata: profile.metadata || null,
      });
    } catch (e: any) {
      console.warn('[Auth] fetchProfile failed:', e?.message);
    }
  };

  const refreshProfile = async () => {
    if (session) await fetchProfile(session);
  };

  useEffect(() => {
    // 1. Initial Session Restoration
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      if (s) fetchProfile(s);
      setIsLoading(false);
    });

    // 2. Hardened Auth Listener
    const { data } = supabase.auth.onAuthStateChange((event, s) => {
      console.log('[Auth] Global Event:', event);
      setSession(s);
      if (s) {
        fetchProfile(s);
      } else {
        setUser(null);
        // Kill automatic login: if session is gone, force sign-in UI
        if (!isLoading) router.replace('/(auth)/sign-in' as Href);
      }
      setIsLoading(false);
    });

    // Safe cleanup prevents memory leaks and dead sign-outs
    return () => data?.subscription?.unsubscribe?.();
  }, [isLoading]);

  const value = useMemo(
    () => ({
      user,
      session,
      isLoading,
      refreshProfile,
      login: async (email: string, p: string) => {
        setIsLoading(true);
        const res = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password: p,
        });
        // Diagnostic Log for 400 error
        console.log('[Auth] Login Response:', res);
        if (res.error) {
          setIsLoading(false);
          throw res.error;
        }
      },
      register: async (email: string, p: string, f: string, l: string) => {
        setIsLoading(true);
        const { error } = await supabase.auth.signUp({
          email,
          password: p,
          options: { data: { full_name: `${f} ${l}` } },
        });
        if (error) {
          setIsLoading(false);
          throw error;
        }
      },
      // FIXED: Explicit State Clearing to stop "Alex" auto-login
      logout: async () => {
        setIsLoading(true);
        await supabase.auth.signOut();
        setSession(null);
        setUser(null);
        router.replace('/(auth)/sign-in' as Href);
        setIsLoading(false);
      },
    }),
    [user, session, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
