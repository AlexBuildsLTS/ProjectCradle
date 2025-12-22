/**
 * PROJECT CRADLE: ADMIN OPERATIONS
 * Path: src/api/admin.ts
 */
import { supabase } from '../utils/supabase';

export const adminApi = {
  async getSystemOverview() {
    // 1. Fetch Total Users
    const { count: userCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    // 2. Fetch Active Naps
    const { count: activeNaps } = await supabase
      .from('care_events')
      .select('*', { count: 'exact', head: true })
      .eq('event_type', 'SLEEP')
      .filter('metadata->>subtype', 'eq', 'START');

    // 3. Fetch Open Tickets
    const { count: ticketCount } = await supabase
      .from('support_tickets')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'OPEN');

    return {
      totalUsers: userCount || 0,
      activeNaps: activeNaps || 0,
      openTickets: ticketCount || 0,
    };
  }
};