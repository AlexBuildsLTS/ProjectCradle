// /services/babyService.ts
import { supabase } from '../app/api/supabaseClient'; // FIXED: Added 'app' to the path
import { Baby } from '../types/database';

export const createBaby = async (
  userId: string, 
  babyData: Pick<Baby, 'name' | 'dob' | 'gender'>
): Promise<{ data: Baby | null; error: any }> => {
  
  // 1. Insert Baby
  const { data: baby, error: babyError } = await supabase
    .from('babies')
    .insert([{
      parent_id: userId,
      name: babyData.name,
      dob: babyData.dob,
      gender: babyData.gender,
      current_target_sleep_hours: 14.0 
    }])
    .select()
    .single();

  if (babyError) return { data: null, error: babyError };

  // 2. Link Caregiver
  const { error: caregiverError } = await supabase
    .from('caregivers')
    .insert([{
      baby_id: baby.id,
      user_id: userId,
      access_level: 'OWNER'
    }]);

  if (caregiverError) return { data: null, error: caregiverError };

  // 3. Update Profile status
  await supabase
    .from('profiles')
    .update({ is_onboarded: true })
    .eq('id', userId);

  return { data: baby, error: null };
};