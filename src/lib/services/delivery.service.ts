import { createSupabaseClient } from '@/lib/supabase/server';
import type { PaginatedResponse } from '@/types';

export class DeliveryService {
  static async listZones(branch_id?: string) {
    const supabase = await createSupabaseClient();
    let query = supabase.from('delivery_zones').select('*').eq('is_active', true);
    if (branch_id) query = query.eq('branch_id', branch_id);
    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async listDeliveries(params: { page?: number; limit?: number; status?: string }) {
    const supabase = await createSupabaseClient();
    const { page = 1, limit = 20, status } = params;
    let query = supabase.from('deliveries').select('*', { count: 'exact' }).order('scheduled_at', { ascending: false }).range((page - 1) * limit, page * limit - 1);
    if (status) query = query.eq('status', status);
    const { data, error, count } = await query;
    if (error) throw error;
    return { data, total: count ?? 0, page, limit, totalPages: Math.ceil((count ?? 0) / limit) } as PaginatedResponse<any>;
  }

  static async updateStatus(id: string, status: string) {
    const supabase = await createSupabaseClient();
    const { data, error } = await supabase.from('deliveries').update({ status }).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }
}
