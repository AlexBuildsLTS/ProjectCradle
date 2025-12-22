import { supabase } from '../utils/supabase';

/**
 * PROJECT CRADLE: FEEDING LOGIC ENGINE
 * Path: src/api/feeding.ts
 * Logic: Captures Milliliters, Ounces, and Breast Side.
 */
export const feedingApi = {
  async logFeed(params: {
    type: 'BOTTLE' | 'BREAST';
    amountMl?: number;
    side?: 'LEFT' | 'RIGHT' | 'BOTH';
    note?: string;
  }) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Authentication required.");

    const { data, error } = await supabase
      .from('care_events')
      .insert({
        user_id: user.id,
        event_type: 'FEED',
        timestamp: new Date().toISOString(),
        metadata: {
          subtype: params.type,
          amount_ml: params.amountMl,
          side: params.side,
          note: params.note,
          correlation_id: crypto.randomUUID()
        }
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};