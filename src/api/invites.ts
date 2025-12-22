import { supabase } from '../utils/supabase';

/**
 * PROJECT CRADLE: SECURE SYNC API
 * Path: src/api/invites.ts
 * Logic: Interfaces with Edge Functions to handle caregiver linking securely.
 */
export const inviteApi = {
  /**
   * Dispatches a request to the 'manage-invite' Edge Function to 
   * generate a high-entropy, short-lived secure token.
   */
  async generateInviteToken() {
    const { data, error } = await supabase.functions.invoke('manage-invite', {
      body: { action: 'GENERATE' }
    });
    
    if (error) {
      console.error("[Sync Protocol] Generation Failure:", error.message);
      throw error;
    }
    
    return data.token;
  },

  /**
   * Submits a scanned or typed token to the Edge Function for 
   * validation and atomic account linking.
   */
  async acceptInvite(token: string) {
    const { data, error } = await supabase.functions.invoke('manage-invite', {
      body: { action: 'ACCEPT', tokenToAccept: token }
    });

    if (error) {
      console.error("[Sync Protocol] Validation Failure:", error.message);
      throw error;
    }

    return data;
  }
};