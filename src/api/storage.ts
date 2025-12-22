import { supabase } from '../utils/supabase';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';

/**
 * PROJECT CRADLE: BIOMETRIC ASSET API
 * Path: src/api/storage.ts
 * Logic: Handles binary image transfers to Supabase Storage Buckets.
 */
export const storageApi = {
  /**
   * Uploads a baby or parent avatar to the 'avatars' bucket.
   * Pathing: bucket/user_id/timestamp.jpg for strict RLS compliance.
   */
  async uploadAvatar(uri: string) {
    // 1. Identify the Current Surveillance Session
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Authentication required for biometric asset transfer.");

    // 2. Prepare the Unique Resource Identifier
    const fileName = `${user.id}/${Date.now()}.jpg`;

    try {
      // 3. Convert Local URI to Base64 (High-integrity transfer for Expo/Web)
      const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
      
      // 4. Dispatch to Supabase Storage
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, decode(base64), {
          contentType: 'image/jpeg',
          upsert: true
        });

      if (error) throw error;

      // 5. Generate the Public Surveillance URL
      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
      const publicUrl = urlData.publicUrl;
      
      // 6. Atomically Update the Profile Record in the Ledger
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (profileError) throw profileError;
      
      return publicUrl;
    } catch (err) {
      console.error("[Cradle Storage] Asset Synchronization Failure:", err);
      throw err;
    }
  }
};