import { supabase } from '../utils/supabase';

/**
 * PROJECT CRADLE: NOTIFICATION ENGINE
 * Path: src/api/notifications.ts
 */
export const notificationApi = {
  /**
   * Retrieve all alerts for the current session
   */
  async fetchAll() {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
  },

  /**
   * Unified "Mark all read" for the TopBar dropdown
   */
  async markAllRead() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id);

    if (error) throw error;
  }
};