'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createSupabaseClient } from '@/lib/supabase/client';
import { queryKeys } from '@/lib/query-keys';

export function useRealtimeAppointments(date: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const supabase = createSupabaseClient();
    const channel = supabase
      .channel('appointments-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments',
          filter: `appointment_date=eq.${date}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: queryKeys.appointments.byDate(date) });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [date, queryClient]);
}
