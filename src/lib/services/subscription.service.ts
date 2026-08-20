import { createSupabaseClient } from '@/lib/supabase/server';
import type { PaginatedResponse } from '@/types';

export class SubscriptionService {
  static async listPlans() {
    const supabase = await createSupabaseClient();
    const { data, error } = await supabase.from('subscription_plans').select('*').eq('is_active', true).order('price', { ascending: true });
    if (error) throw error;
    return data;
  }

  static async listSubscriptions(params: { page?: number; limit?: number; customer_id?: string; status?: string }) {
    const supabase = await createSupabaseClient();
    const { page = 1, limit = 20, customer_id, status } = params;
    let query = supabase.from('subscriptions').select('*, subscription_plans(*)', { count: 'exact' }).order('start_date', { ascending: false }).range((page - 1) * limit, page * limit - 1);
    if (customer_id) query = query.eq('customer_id', customer_id);
    if (status) query = query.eq('status', status);
    const { data, error, count } = await query;
    if (error) throw error;
    return { data, total: count ?? 0, page, limit, totalPages: Math.ceil((count ?? 0) / limit) } as PaginatedResponse<any>;
  }
}
