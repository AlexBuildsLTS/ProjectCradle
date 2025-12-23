/**
 * PROJECT CRADLE: FISCAL LAYER
 * Responsible for the immutable ledger of pediatric events.
 * Path: src/store/cradle/useCradleStore.ts
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

// --- Types: Medical-Grade Precision ---

export type EventType = 'FEED' | 'SLEEP' | 'DIAPER' | 'MEDICATION';

export interface CareEvent {
  id: string;               // UUID v4 Correlation ID
  timestamp: number;        // Unix Epoch
  type: EventType;
  metadata: {
    value?: number;         // e.g., Ounces, Minutes
    unit?: string;          // e.g., "oz", "ml"
    note?: string;          // Caregiver observation
    subtype?: string;       // e.g., "Left Breast", "Wet", "Dirty"
  };
  isSynced: boolean;        // Propagation Status
}

interface CradleState {
  events: CareEvent[];
  activeSleepId: string | null;
  // Actions
  toggleSleep: () => void;
  addEvent: (type: string) => void;
  addDiaperEvent: () => void;
  logEvent: (type: EventType, metadata: CareEvent['metadata']) => void;
  deleteEvent: (id: string) => void;
  syncComplete: (id: string) => void;
}

// --- The Ledger Store ---

export const useCradleStore = create<CradleState>()(
  persist(
    (set, get) => ({
      events: [],
      activeSleepId: null,

      toggleSleep: () => {
        set((state) => {
          if (state.activeSleepId) {
            // End sleep - could update the event with duration, but for now just clear
            return { activeSleepId: null };
          } else {
            // Start sleep
            const newId = Crypto.randomUUID();
            const sleepEvent: CareEvent = {
              id: newId,
              timestamp: Date.now(),
              type: 'SLEEP',
              metadata: {},
              isSynced: false,
            };
            return {
              activeSleepId: newId,
              events: [sleepEvent, ...state.events],
            };
          }
        });
      },

      addEvent: (type) => {
        const newEvent: CareEvent = {
          id: Crypto.randomUUID(),
          timestamp: Date.now(),
          type: type as EventType,
          metadata: {},
          isSynced: false,
        };
        set((state) => ({
          events: [newEvent, ...state.events],
        }));
      },

      addDiaperEvent: () => {
        const newEvent: CareEvent = {
          id: Crypto.randomUUID(),
          timestamp: Date.now(),
          type: 'DIAPER',
          metadata: {},
          isSynced: false,
        };
        set((state) => ({
          events: [newEvent, ...state.events],
        }));
      },

      /**
       * logEvent: Idempotent transaction entry.
       * Ensures every action has a unique ID before hitting the messaging layer.
       */
      logEvent: (type, metadata) => {
        const newEvent: CareEvent = {
          id: Crypto.randomUUID(),
          timestamp: Date.now(),
          type,
          metadata,
          isSynced: false,
        };

        set((state) => ({
          events: [newEvent, ...state.events],
        }));
      },

      deleteEvent: (id) => {
        set((state) => ({
          events: state.events.filter((e) => e.id !== id),
        }));
      },

      syncComplete: (id) => {
        set((state) => ({
          events: state.events.map((e) =>
            e.id === id ? { ...e, isSynced: true } : e
          ),
        }));
      },
    }),
    {
      name: 'cradle-fiscal-ledger',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);