import { createSupabaseClient } from '@/lib/supabase/server';
import type { PaginatedResponse } from '@/types';

export class FeedbackService {
  static async listFeedbacks(params: { page?: number; limit?: number }) {
    const supabase = await createSupabaseClient();
    const { page = 1, limit = 20 } = params;
    const { data, error, count } = await supabase
      .from('customer_feedback')
      .select('*, customers(name)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);
    if (error) throw error;
    return { data, total: count ?? 0, page, limit, totalPages: Math.ceil((count ?? 0) / limit) } as PaginatedResponse<any>;
  }
}
