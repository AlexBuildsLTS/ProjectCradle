import { supabase } from '../utils/supabase';

/**
 * PROJECT CRADLE: AUTHENTICATION API
 * Path: src/api/auth.ts
 */
export const authApi = {
  async signIn(email: string, pass: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) throw error;
    return data;
  },

  async signUp(email: string, pass: string, firstName: string, lastName: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: { full_name: `${firstName} ${lastName}` }
      }
    });
    if (error) throw error;
    return data;
  }
};