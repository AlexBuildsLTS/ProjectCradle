/**
 * PROJECT CRADLE: BABY SERVICE CORE V2.0
 * Path: services/babyService.ts
 * FIXES: TypeScript constraint for 'gender' and path resolution.
 */
import { supabase } from '@/lib/supabase';

export interface Baby {
  id: string;
  parent_id: string;
  name: string;
  dob: string;
  gender?: string; // Added optional gender to interface
  current_target_sleep_hours?: number;
}

export const createBaby = async (
  userId: string,
  babyData: { name: string; dob: string; gender: string },
): Promise<{ data: Baby | null; error: any }> => {
  // 1. Insert Baby with parent_id alignment
  const { data: baby, error: babyError } = await supabase
    .from('babies')
    .insert([
      {
        parent_id: userId,
        name: babyData.name,
        dob: babyData.dob,
        gender: babyData.gender,
        current_target_sleep_hours: 14.0,
      },
    ])
    .select()
    .single();

  if (babyError) return { data: null, error: babyError };

  // 2. Link Caregiver
  const { error: caregiverError } = await supabase.from('caregivers').insert([
    {
      baby_id: baby.id,
      user_id: userId,
      access_level: 'OWNER',
    },
  ]);

  if (caregiverError) return { data: null, error: caregiverError };

  // 3. Update Profile onboarding status
  await supabase
    .from('profiles')
    .update({ is_onboarded: true })
    .eq('id', userId);

  return { data: baby, error: null };
};
