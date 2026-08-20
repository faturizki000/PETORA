import { createSupabaseClient } from '@/lib/supabase/server';
import type { PaginatedResponse } from '@/types';

export class TelemedicineService {
  static async listSessions(params: { page?: number; limit?: number; status?: string }) {
    const supabase = await createSupabaseClient();
    const { page = 1, limit = 20, status } = params;
    let query = supabase.from('telemedicine_sessions').select('*', { count: 'exact' }).order('scheduled_at', { ascending: false }).range((page - 1) * limit, page * limit - 1);
    if (status) query = query.eq('status', status);
    const { data, error, count } = await query;
    if (error) throw error;
    return { data, total: count ?? 0, page, limit, totalPages: Math.ceil((count ?? 0) / limit) } as PaginatedResponse<any>;
  }

  static async joinSession(id: string) {
    const supabase = await createSupabaseClient();
    const { data, error } = await supabase.from('telemedicine_sessions').select('meeting_url').eq('id', id).single();
    if (error) throw error;
    return { url: data.meeting_url };
  }
}
