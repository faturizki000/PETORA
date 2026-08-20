'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createSupabaseClient } from '@/lib/supabase/client';
import { queryKeys } from '@/lib/query-keys';
import { toast } from 'sonner';

export function useRealtimeNotifications(userId: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const supabase = createSupabaseClient();
    const channel = supabase
      .channel('notifications-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
          toast.info(payload.new.title, { description: payload.new.message });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);
}
