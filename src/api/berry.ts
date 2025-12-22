/**
 * PROJECT CRADLE: BERRY AI SERVICE
 * Path: src/api/berry.ts
 */
import { supabase } from '../utils/supabase';

export const berryApi = {
  /**
   * Dispatches message to the Supabase Edge Function
   * The Edge Function will fetch logs and generate a response
   */
  async sendMessage(message: string) {
    try {
      const { data, error } = await supabase.functions.invoke('berry-ai', {
        body: { query: message },
      });

      if (error) throw error;
      return data.response;
    } catch (error) {
      console.error('[Berry API] Communication Failure:', error);
      return "I'm having trouble connecting to my knowledge base. Please check your connection.";
    }
  }
};