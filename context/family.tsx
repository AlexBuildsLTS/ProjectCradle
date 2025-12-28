/**
 * PROJECT CRADLE: FAMILY CONTEXT ENGINE V1.0
 * Path: context/family.tsx
 * PURPOSE: Manages the "Locked" baby profile across the entire app.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface FamilyContextType {
  selectedBaby: any | null;
  selectBaby: (baby: any) => Promise<void>;
  isLoading: boolean;
}

const FamilyContext = createContext<FamilyContextType | undefined>(undefined);

export function FamilyProvider({ children }: { children: React.ReactNode }) {
  const [selectedBaby, setSelectedBaby] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // LOGIC: Load the last selected baby from storage on startup
  useEffect(() => {
    const loadStoredBaby = async () => {
      try {
        const stored = await AsyncStorage.getItem('@selected_baby');
        if (stored) setSelectedBaby(JSON.parse(stored));
      } catch (e) {
        console.error('Family Sync Error', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadStoredBaby();
  }, []);

  const selectBaby = async (baby: any) => {
    setSelectedBaby(baby);
    await AsyncStorage.setItem('@selected_baby', JSON.stringify(baby));
  };

  return (
    <FamilyContext.Provider value={{ selectedBaby, selectBaby, isLoading }}>
      {children}
    </FamilyContext.Provider>
  );
}

export const useFamily = () => {
  const context = useContext(FamilyContext);
  if (!context) throw new Error('useFamily must be used within FamilyProvider');
  return context;
};
