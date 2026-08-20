import { createSupabaseClient } from '@/lib/supabase/server';
import type { PaginatedResponse } from '@/types';

export class MarketingService {
  static async listCampaigns(params: { page?: number; limit?: number; status?: string }) {
    const supabase = await createSupabaseClient();
    const { page = 1, limit = 20, status } = params;
    let query = supabase.from('marketing_campaigns').select('*', { count: 'exact' }).order('created_at', { ascending: false }).range((page - 1) * limit, page * limit - 1);
    if (status) query = query.eq('status', status);
    const { data, error, count } = await query;
    if (error) throw error;
    return { data, total: count ?? 0, page, limit, totalPages: Math.ceil((count ?? 0) / limit) } as PaginatedResponse<any>;
  }
}
