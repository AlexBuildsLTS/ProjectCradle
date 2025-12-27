import { useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import * as Crypto from 'expo-crypto';
import { CareEvent } from '@/types/biometrics';

// Explicitly export useBiometrics
export const useBiometrics = () => {
  const queryClient = useQueryClient();

  const logEvent = useMutation({
    mutationFn: async (event: Omit<CareEvent, 'id' | 'created_at' | 'user_id'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from('care_events')
        .insert([{
          correlation_id: event.correlation_id,
          user_id: user.id,
          event_type: event.event_type,
          timestamp: event.timestamp,
          metadata: event.metadata,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onMutate: async (newEvent) => {
      await queryClient.cancelQueries({ queryKey: ['care_events'] });
      const previousEvents = queryClient.getQueryData(['care_events']);
      queryClient.setQueryData(['care_events'], (old: any) => [...(old || []), newEvent]);
      return { previousEvents };
    },
    onError: (err, newEvent, context) => {
      queryClient.setQueryData(['care_events'], context?.previousEvents);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['care_events'] });
    },
  });

  return { logEvent };
};