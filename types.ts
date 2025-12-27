// types.ts
import { Database } from './lib/database.types';

// --- 1. SUPABASE GENERATED HELPERS ---
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];

// --- 2. CORE ENUMS & TYPES ---
// Extracts the exact string literal types from your Postgres schema
export type UserRole = Enums<'user_role'>;
export type SubTier = Enums<'sub_tier'>;
export type TicketStatus = Enums<'ticket_status'>;

// --- 3. PROFILES & USER ---
// Fixed name to UserProfile to match AuthContext
export interface UserProfile extends Tables<'profiles'> {
  role: UserRole;
  tier: SubTier;
}

// Unified User interface (replaces the two conflicting versions)
export interface User extends UserProfile {
  email: string;
  name: string; 
  status: string;
  currency: string;
  country: string;
}

// --- 4. CARE & TRACKING ENGINE ---
export interface CareEvent extends Tables<'care_events'> {
  metadata: {
    notes?: string;
    intensity?: number;
    location?: string;
    [key: string]: any;
  } | null;
}

export interface PumpingLog extends Tables<'pumping_logs'> {
  side: string | null; // Aligned with Database Row string type
}

// --- 5. SUPPORT & SYSTEM ---
export interface SupportTicket extends Tables<'support_tickets'> {
  status: TicketStatus;
}

export interface TicketComment extends Tables<'support_comments'> {
  author?: User;
}