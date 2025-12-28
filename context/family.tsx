/**
 * PROJECT CRADLE: FAMILY CONTEXT CORE V3.0 (AAA+ TIER)
 * Path: context/family.tsx
 * PURPOSE: Centralized Biometric Core Management.
 * FIXES:
 * 1. PERSISTENCE: Re-implemented AsyncStorage to remember selection after app restart.
 * 2. SYNC ENGINE: refreshBabies now correctly updates the local identities ledger.
 * 3. SCHEMA ALIGNMENT: Strictly typed to match the 'babies' table.
 */

import { supabase } from '@/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './auth';

// --- TYPE DEFINITIONS ---
export interface Baby {
  id: string;
  name: string;
  dob: string;
  birth_weight_grams: number | null;
  parent_id: string;
}

interface FamilyContextType {
  babies: Baby[];
  selectedBaby: Baby | null;
  isLoading: boolean;
  selectBaby: (id: string) => Promise<void>;
  refreshBabies: () => Promise<void>;
}

const FamilyContext = createContext<FamilyContextType | undefined>(undefined);

const STORAGE_KEY = '@project_cradle_selected_baby_id';

export function FamilyProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [babies, setBabies] = useState<Baby[]>([]);
  const [selectedBaby, setSelectedBaby] = useState<Baby | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // MODULE: DATA FETCHING HANDSHAKE
  const fetchBabies = async () => {
    if (!user?.id) {
      setBabies([]);
      setSelectedBaby(null);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('babies')
        .select('*')
        .eq('parent_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data) {
        setBabies(data);

        // RECOVERY LOGIC: Check storage for previously selected ID
        const savedId = await AsyncStorage.getItem(STORAGE_KEY);
        const recoveredBaby = data.find((b) => b.id === savedId);

        if (recoveredBaby) {
          setSelectedBaby(recoveredBaby);
        } else if (data.length > 0 && !selectedBaby) {
          // Default to first baby if none saved
          setSelectedBaby(data[0]);
        }
      }
    } catch (e) {
      console.error('[Cradle Family Context] Sync Error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // EFFECT: INITIAL LOAD & AUTH SYNC
  useEffect(() => {
    fetchBabies();
  }, [user?.id]);

  // MODULE: SELECTION ENGINE
  const selectBaby = async (id: string) => {
    const baby = babies.find((b) => b.id === id);
    if (baby) {
      setSelectedBaby(baby);
      await AsyncStorage.setItem(STORAGE_KEY, id);
    }
  };

  return (
    <FamilyContext.Provider
      value={{
        babies,
        selectedBaby,
        isLoading,
        selectBaby,
        refreshBabies: fetchBabies,
      }}
    >
      {children}
    </FamilyContext.Provider>
  );
}

// MODULE: HOOK EXPORT
export function useFamily() {
  const context = useContext(FamilyContext);
  if (context === undefined) {
    throw new Error('useFamily must be used within a FamilyProvider');
  }
  return context;
}
