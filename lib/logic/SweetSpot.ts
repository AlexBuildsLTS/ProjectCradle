/**
 * PROJECT CRADLE: SWEETSPOT® ALGORITHM V1.0
 * Path: lib/logic/SweetSpot.ts
 * PURPOSE: Predicts optimal sleep windows based on awake windows and sleep pressure.
 *
 */

import { addMinutes, differenceInMinutes, format } from 'date-fns';

export interface BabyBiometrics {
  birthDate: string;
  lastWakeTime: Date;
}

export class SweetSpotEngine {
  /**
   * Calculate Age in Months to determine Awake Window duration.
   */
  private static calculateAgeInMonths(birthDate: string): number {
    const birth = new Date(birthDate);
    const now = new Date();
    return (
      (now.getFullYear() - birth.getFullYear()) * 12 +
      (now.getMonth() - birth.getMonth())
    );
  }

  /**
   * Determine the optimal awake window based on pediatric science.
   * Values represent minutes of awake time before sleep pressure peaks.
   */
  private static getAwakeWindow(ageInMonths: number): number {
    if (ageInMonths <= 1) return 45; // Newborns: 45-60 mins
    if (ageInMonths <= 3) return 90; // 2-3 Months: 1.5 hours
    if (ageInMonths <= 6) return 120; // 4-6 Months: 2 hours
    if (ageInMonths <= 9) return 150; // 7-9 Months: 2.5 hours
    if (ageInMonths <= 12) return 180; // 10-12 Months: 3 hours
    return 240; // Toddlers: 4 hours
  }

  /**
   * MASTER LOGIC: Calculates the "SweetSpot" for the next nap.
   */
  public static calculateNextNap(biometrics: BabyBiometrics): {
    predictedTime: string;
    remainingMinutes: number;
    pressurePercentage: number;
  } {
    const ageMonths = this.calculateAgeInMonths(biometrics.birthDate);
    const windowMinutes = this.getAwakeWindow(ageMonths);

    const nextNapDate = addMinutes(biometrics.lastWakeTime, windowMinutes);
    const now = new Date();

    const remainingMinutes = differenceInMinutes(nextNapDate, now);
    const minutesSinceWake = differenceInMinutes(now, biometrics.lastWakeTime);

    // Calculate Sleep Pressure (0-100%)
    const pressure = Math.min(
      Math.round((minutesSinceWake / windowMinutes) * 100),
      100,
    );

    return {
      predictedTime: format(nextNapDate, 'h:mm a'),
      remainingMinutes: Math.max(remainingMinutes, 0),
      pressurePercentage: pressure,
    };
  }
}
