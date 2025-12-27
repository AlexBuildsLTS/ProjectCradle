export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      care_events: {
        Row: {
          correlation_id: string
          created_at: string
          event_type: string
          id: string
          is_synced: boolean | null
          metadata: Json | null
          timestamp: string
          user_id: string
        }
        Insert: {
          correlation_id: string
          created_at?: string
          event_type: string
          id?: string
          is_synced?: boolean | null
          metadata?: Json | null
          timestamp: string
          user_id: string
        }
        Update: {
          correlation_id?: string
          created_at?: string
          event_type?: string
          id?: string
          is_synced?: boolean | null
          metadata?: Json | null
          timestamp?: string
          user_id?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          category: string | null
          description: string | null
          id: string
          thumbnail_url: string | null
          tier_required: Database["public"]["Enums"]["sub_tier"] | null
          title: string
        }
        Insert: {
          category?: string | null
          description?: string | null
          id?: string
          thumbnail_url?: string | null
          tier_required?: Database["public"]["Enums"]["sub_tier"] | null
          title: string
        }
        Update: {
          category?: string | null
          description?: string | null
          id?: string
          thumbnail_url?: string | null
          tier_required?: Database["public"]["Enums"]["sub_tier"] | null
          title?: string
        }
        Relationships: []
      }
      faq_entries: {
        Row: {
          answer: string
          category: string
          id: string
          order_index: number | null
          question: string
        }
        Insert: {
          answer: string
          category?: string
          id?: string
          order_index?: number | null
          question: string
        }
        Update: {
          answer?: string
          category?: string
          id?: string
          order_index?: number | null
          question?: string
        }
        Relationships: []
      }
      feature_access: {
        Row: {
          can_access_courses: boolean | null
          can_use_ai: boolean | null
          can_view_analytics: boolean | null
          max_babies_tracked: number | null
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          can_access_courses?: boolean | null
          can_use_ai?: boolean | null
          can_view_analytics?: boolean | null
          max_babies_tracked?: number | null
          role: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          can_access_courses?: boolean | null
          can_use_ai?: boolean | null
          can_view_analytics?: boolean | null
          max_babies_tracked?: number | null
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
      invitations: {
        Row: {
          created_at: string | null
          created_by: string
          expires_at: string
          id: string
          token: string
          used_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          expires_at: string
          id?: string
          token: string
          used_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          expires_at?: string
          id?: string
          token?: string
          used_by?: string | null
        }
        Relationships: []
      }
      lessons: {
        Row: {
          content_body: string | null
          course_id: string | null
          id: string
          order_index: number
          title: string
          video_url: string | null
        }
        Insert: {
          content_body?: string | null
          course_id?: string | null
          id?: string
          order_index: number
          title: string
          video_url?: string | null
        }
        Update: {
          content_body?: string | null
          course_id?: string | null
          id?: string
          order_index?: number
          title?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          baby_dob: string | null
          baby_name: string | null
          created_at: string
          full_name: string
          id: string
          is_onboarded: boolean | null
          metadata: Json | null
          role: Database["public"]["Enums"]["user_role"]
          tier: Database["public"]["Enums"]["sub_tier"]
          timezone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          baby_dob?: string | null
          baby_name?: string | null
          created_at?: string
          full_name: string
          id: string
          is_onboarded?: boolean | null
          metadata?: Json | null
          role?: Database["public"]["Enums"]["user_role"]
          tier?: Database["public"]["Enums"]["sub_tier"]
          timezone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          baby_dob?: string | null
          baby_name?: string | null
          created_at?: string
          full_name?: string
          id?: string
          is_onboarded?: boolean | null
          metadata?: Json | null
          role?: Database["public"]["Enums"]["user_role"]
          tier?: Database["public"]["Enums"]["sub_tier"]
          timezone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      pumping_logs: {
        Row: {
          amount_ml: number | null
          duration_minutes: number | null
          id: string
          metadata: Json | null
          side: string | null
          timestamp: string | null
          user_id: string
        }
        Insert: {
          amount_ml?: number | null
          duration_minutes?: number | null
          id?: string
          metadata?: Json | null
          side?: string | null
          timestamp?: string | null
          user_id: string
        }
        Update: {
          amount_ml?: number | null
          duration_minutes?: number | null
          id?: string
          metadata?: Json | null
          side?: string | null
          timestamp?: string | null
          user_id?: string
        }
        Relationships: []
      }
      subscription_history: {
        Row: {
          event_date: string
          id: string
          new_tier: Database["public"]["Enums"]["sub_tier"]
          previous_tier: Database["public"]["Enums"]["sub_tier"] | null
          transaction_ref: string | null
          user_id: string
        }
        Insert: {
          event_date?: string
          id?: string
          new_tier: Database["public"]["Enums"]["sub_tier"]
          previous_tier?: Database["public"]["Enums"]["sub_tier"] | null
          transaction_ref?: string | null
          user_id: string
        }
        Update: {
          event_date?: string
          id?: string
          new_tier?: Database["public"]["Enums"]["sub_tier"]
          previous_tier?: Database["public"]["Enums"]["sub_tier"] | null
          transaction_ref?: string | null
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string
          current_period_end: string | null
          id: string
          plan_id: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end?: string | null
          id?: string
          plan_id: string
          status: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end?: string | null
          id?: string
          plan_id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      support_comments: {
        Row: {
          author_id: string
          comment_body: string
          created_at: string
          id: string
          is_internal: boolean | null
          ticket_id: string
        }
        Insert: {
          author_id: string
          comment_body: string
          created_at?: string
          id?: string
          is_internal?: boolean | null
          ticket_id: string
        }
        Update: {
          author_id?: string
          comment_body?: string
          created_at?: string
          id?: string
          is_internal?: boolean | null
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_comments_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          created_at: string
          description: string
          id: string
          last_activity: string | null
          priority: number | null
          status: Database["public"]["Enums"]["ticket_status"]
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          description: string
          id?: string
          last_activity?: string | null
          priority?: number | null
          status?: Database["public"]["Enums"]["ticket_status"]
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          description?: string
          id?: string
          last_activity?: string | null
          priority?: number | null
          status?: Database["public"]["Enums"]["ticket_status"]
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      system_health_logs: {
        Row: {
          id: string
          latency_ms: number | null
          logged_at: string | null
          status: string | null
        }
        Insert: {
          id?: string
          latency_ms?: number | null
          logged_at?: string | null
          status?: string | null
        }
        Update: {
          id?: string
          latency_ms?: number | null
          logged_at?: string | null
          status?: string | null
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          completed_at: string | null
          lesson_id: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          lesson_id: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          lesson_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      purge_old_tickets: { Args: never; Returns: undefined }
    }
    Enums: {
      sub_tier: "FREE" | "PREMIUM_MONTHLY" | "PREMIUM_ANNUAL" | "LIFETIME"
      ticket_status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED"
      user_role: "ADMIN" | "SUPPORT" | "PREMIUM_MEMBER" | "MEMBER"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      sub_tier: ["FREE", "PREMIUM_MONTHLY", "PREMIUM_ANNUAL", "LIFETIME"],
      ticket_status: ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"],
      user_role: ["ADMIN", "SUPPORT", "PREMIUM_MEMBER", "MEMBER"],
    },
  },
} as const
