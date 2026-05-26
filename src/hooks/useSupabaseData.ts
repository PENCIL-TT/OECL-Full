import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

// A generic hook to fetch data from any Supabase table
export function useSupabaseData(tableName: string) {
  return useQuery({
    queryKey: [tableName],
    queryFn: async () => {
      const { data, error } = await supabase.from(tableName).select('*');
      
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
}