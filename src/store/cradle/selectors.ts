/**
 * PROJECT CRADLE: SURVEILLANCE SELECTORS
 * Path: src/store/cradle/selectors.ts
 */

import { differenceInMinutes } from 'date-fns';
import { CareEvent } from './useCradleStore';

// Pediatric Baselines (Can be moved to useHealthStore later)
const AWAKE_WINDOW_MINS = 120; // Default for 4-6 months
const OVERTIRED_THRESHOLD = 150;

export const cradleSelectors = {
  /**
   * Identifies the most recent sleep event
   */
  getLastSleepEvent: (events: CareEvent[]) => {
    return events.find((e) => e.type === 'SLEEP');
  },

  /**
   * Calculates Sleep Pressure (0 to 1 scale)
   * 0 = Just woke up, 1 = Optimal Sleep Window (SweetSpot)
   */
  getSleepPressure: (events: CareEvent[]) => {
    const lastSleep = events.find((e) => e.type === 'SLEEP');
    if (!lastSleep) return 0;

    const minsAwake = differenceInMinutes(Date.now(), lastSleep.timestamp);
    
    // Normalize pressure: 0 at wake, 1 at 120 mins
    const pressure = minsAwake / AWAKE_WINDOW_MINS;
    return Math.min(Math.max(pressure, 0), 1.2); // Cap at 1.2 for "Overtired"
  },

  /**
   * Predicts the exact timestamp of the next SweetSpot®
   */
  getNextWindow: (events: CareEvent[]) => {
    const lastSleep = events.find((e) => e.type === 'SLEEP');
    if (!lastSleep) return null;

    return new Date(lastSleep.timestamp + AWAKE_WINDOW_MINS * 60000);
  },

  /**
   * Returns the "Status Color" for the UI based on pressure
   */
  getSurveillanceStatus: (pressure: number) => {
    if (pressure < 0.7) return 'CALM';      // Sky Blue
    if (pressure < 0.9) return 'BUILDING';  // Soft Gold
    if (pressure <= 1.0) return 'SWEETSPOT'; // Emerald
    return 'OVERTIRED';                     // Rose/Pink
  }
};