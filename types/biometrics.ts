export type EventType = 'FEED' | 'SLEEP' | 'DIAPER' | 'MEDICATION' | 'SOLIDS';

export interface CareEventMetadata {
  amount_ml?: number;
  side?: 'LEFT' | 'RIGHT' | 'BOTH';
  diaper_type?: 'WET' | 'DIRTY' | 'BOTH';
  notes?: string;
  sleep_quality?: 1 | 2 | 3 | 4 | 5;
  logged_by?: string; // Add this line to fix the Dashboard error
}

export interface CareEvent {
  id: string;
  correlation_id: string;
  user_id: string;
  event_type: EventType;
  timestamp: string;
  metadata: CareEventMetadata;
  created_at: string;
}