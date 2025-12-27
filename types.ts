import { Database } from './lib/database.types';

// --- 1. SUPABASE GENERATED HELPERS ---
// Maps directly to the local database schema
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];

// --- 2. CORE MISSION ENUMS ---
// Strictly typed to match Database["public"]["Enums"]
export enum UserRoleEnum {
  ADMIN = 'ADMIN',
  SUPPORT = 'SUPPORT',
  PREMIUM_MEMBER = 'PREMIUM_MEMBER',
  MEMBER = 'MEMBER'
}

export type UserRole = Enums<'user_role'>;
export type SubTier = Enums<'sub_tier'>;
export type TicketStatus = Enums<'ticket_status'>;

// --- 3. BIOMETRIC PROFILES ---
// Combined Database Row + Frontend State
export interface Profile extends Tables<'profiles'> {
  role: UserRole;
  tier: SubTier;
}

export interface User extends Profile {
  email: string;
}

// --- 4. CARE & TRACKING ENGINE ---
// Refurbished to support Care Ledger and Pumping modules
export interface CareEvent extends Tables<'care_events'> {
  metadata: {
    notes?: string;
    intensity?: number;
    location?: string;
    [key: string]: any;
  } | null;
}

export interface PumpingLog extends Tables<'pumping_logs'> {
  side: 'left' | 'right' | 'both';
}

// --- 5. INTELLIGENCE & CONTENT ---
// For the AI-Powered Parenting Core
export interface Course extends Tables<'courses'> {
  tier_required: SubTier | null;
}

export interface Lesson extends Tables<'lessons'> {
  course?: Course;
}

export interface UserProgress extends Tables<'user_progress'> {
  lesson?: Lesson;
}

// --- 6. SUPPORT & SYSTEM INTEGRITY ---
// Hardened for Ticket and System Health monitoring
export interface SupportTicket extends Tables<'support_tickets'> {
  status: TicketStatus;
  assigned_admin?: string;
}

export interface TicketComment extends Tables<'support_comments'> {
  author?: User;
}

export interface SystemHealth extends Tables<'system_health_logs'> {
  status: 'optimal' | 'degraded' | 'critical';
}

// --- 7. NOTIFICATIONS & SYNC ---
export interface NotificationItem extends Tables<'notifications'> {
  type: 'care_alert' | 'system' | 'milestone' | 'security';
}

// --- 8. UI HELPERS ---
export interface AppSettings {
  theme: 'dark' | 'light' | 'system';
  timezone: string;
  notifications_enabled: boolean;
}

export interface SafeBiometricMetrics {
  total_pumping_ml: number;
  last_sleep_duration: number;
  sleep_pressure_score: number;
  next_predicted_nap: string;
}

export interface User {
  id: string;
  email: string;
  name: string; // This MUST be here
  role: UserRole;
  status: string;
  avatar?: string | null;
  currency: string;
  country: string;
}