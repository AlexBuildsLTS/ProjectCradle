import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export const useSyncEngine = (userId?: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    // Listen to changes in the care_events table for this specific user's family
    const channel = supabase
      .channel(`family-sync-${userId}`)
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'care_events',
          filter: `user_id=eq.${userId}` // Only listen to relevant data
        },
        (payload) => {
          console.log('Realtime update received:', payload.eventType);
          // Refetch the biometric ledger so the UI is always 100% accurate
          queryClient.invalidateQueries({ queryKey: ['care_events'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);
};