// context/auth.tsx
import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { useRouter, useSegments, Href } from 'expo-router';
import { supabase } from '../lib/supabase';
import { UserProfile, UserRole } from '../types'; // Corrected path and names

interface AuthContextType {
  user: SupabaseUser | null;
  profile: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, firstName: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const router = useRouter();
  const segments = useSegments();

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      // PGRST116: Standard code for "No rows found" in PostgREST
      if (error && error.code !== 'PGRST116') throw error;
      return data as UserProfile;
    } catch (e: any) {
      console.error('[Auth] Profile hydration failed:', e.message);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (user) {
      const updatedProfile = await fetchProfile(user.id);
      setProfile(updatedProfile);
    }
  };

  useEffect(() => {
    // 1. Restore Session
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) fetchProfile(s.user.id).then(setProfile);
      setIsLoading(false);
    });

    // 2. Auth Listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, s) => {
      setSession(s);
      setUser(s?.user ?? null);

      if (s?.user) {
        const p = await fetchProfile(s.user.id);
        setProfile(p);

        // Auto-routing logic
        const inAuthGroup = segments[0] === '(auth)';
        if (inAuthGroup) {
          p?.is_onboarded ? router.replace('/(app)' as Href) : router.replace('/(auth)/onboarding' as Href);
        }
      } else {
        setProfile(null);
        if (segments[0] !== '(auth)' && !isLoading) router.replace('/(auth)/sign-in' as Href);
      }
      setIsLoading(false);
    });

    return () => authListener.subscription.unsubscribe();
  }, [segments]);

  const value = useMemo(() => ({
    user,
    profile,
    session,
    isLoading,
    refreshProfile,
    login: async (email: string, pass: string) => {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password: pass });
      if (error) { setIsLoading(false); throw error; }
    },
    register: async (email: string, pass: string, firstName: string) => {
      setIsLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: { data: { full_name: firstName, role: 'MEMBER' as UserRole } }
      });
      if (error) { setIsLoading(false); throw error; }
    },
    logout: async () => {
      setIsLoading(true);
      await supabase.auth.signOut();
      setUser(null); setProfile(null); setSession(null);
      router.replace('/(auth)/sign-in' as Href);
      setIsLoading(false);
    }
  }), [user, profile, session, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};