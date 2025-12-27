// types/database.ts
export type EventType = 'FEED' | 'SLEEP' | 'DIAPER' | 'MEDICATION' | 'SOLIDS';

export interface CareEvent {
  id: string;
  correlation_id: string;
  user_id: string;
  event_type: EventType;
  timestamp: Date;
  metadata: {
    amount_ml?: number;
    side?: 'LEFT' | 'RIGHT' | 'BOTH';
    diaper_type?: 'WET' | 'DIRTY' | 'BOTH';
    sleep_quality?: 1 | 2 | 3 | 4 | 5;
    notes?: string;
  };
}

export interface BabyProfile {
  id: string;
  baby_name: string;
  baby_dob: string;
  role: 'PRIMARY_PARENT' | 'SECONDARY_CAREGIVER';
}