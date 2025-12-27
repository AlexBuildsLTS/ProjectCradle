import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export const useBabyContext = () => {
  return useQuery({
    queryKey: ['baby-profile'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error("No session found");

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });
};