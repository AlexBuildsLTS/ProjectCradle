import { supabase } from '../utils/supabase';

/**
 * PROJECT CRADLE: SUPPORT & AGENT OPERATIONS
 * Path: src/api/support.ts
 */
export const supportApi = {
  /**
   * USER SIDE: Create a new biometric assistance request
   */
  async createTicket(subject: string, description: string, priority: number = 1) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Auth required");

    const { data, error } = await supabase
      .from('support_tickets')
      .insert({ user_id: user.id, subject, description, priority })
      .select().single();

    if (error) throw error;
    return data;
  },

  /**
   * USER SIDE: Fetch all tickets belonging to the current parent
   * Resolves Error 2339
   */
  async getUserTickets() {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('support_tickets')
      .select(`
        *,
        support_comments (*)
      `)
      .eq('user_id', user?.id)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * AGENT/ADMIN SIDE: Fetch all active global tickets
   */
  async getAllTickets() {
    const { data, error } = await supabase
      .from('support_tickets')
      .select(`*, profiles(full_name, avatar_url)`)
      .order('priority', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * SHARED: Add a response to the thread
   */
  async addComment(ticketId: string, body: string, isInternal: boolean = false) {
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase
      .from('support_comments')
      .insert({ 
        ticket_id: ticketId, 
        author_id: user?.id, 
        comment_body: body, 
        is_internal: isInternal 
      });

    if (error) throw error;
    
    // Integrity: Auto-update ticket timestamp to bump it in the queue
    await supabase.from('support_tickets')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', ticketId);
  },

  /**
   * AGENT SIDE: Close or escalate a ticket
   */
  async updateTicketStatus(ticketId: string, status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED') {
    const { error } = await supabase
      .from('support_tickets')
      .update({ status })
      .eq('id', ticketId);
    if (error) throw error;
  }
};