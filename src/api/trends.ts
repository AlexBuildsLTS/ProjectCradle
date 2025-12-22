/**
 * PROJECT CRADLE: BIOMETRIC ANALYTICS API
 * Path: src/api/trends.ts
 */
import { supabase } from '../utils/supabase';

export const trendsApi = {
  /**
   * Fetches daily totals for sleep and volume over a specific window (e.g., last 7 days)
   */
  async getDailyAverages(days: number = 7) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Auth required");

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Fetch Care Events (Sleep/Feed)
    const { data: events, error: eventError } = await supabase
      .from('care_events')
      .select('*')
      .eq('user_id', user.id)
      .gte('timestamp', startDate.toISOString());

    // Fetch Pumping Logs
    const { data: pumping, error: pumpError } = await supabase
      .from('pumping_logs')
      .select('*')
      .eq('user_id', user.id)
      .gte('timestamp', startDate.toISOString());

    if (eventError || pumpError) throw (eventError || pumpError);

    return { events, pumping };
  }
};