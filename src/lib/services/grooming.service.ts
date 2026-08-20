import { createSupabaseClient } from '@/lib/supabase/server';
import type { PaginatedResponse } from '@/types';

export class GroomingService {
  static async listServices() {
    const supabase = await createSupabaseClient();
    const { data, error } = await supabase.from('grooming_services').select('*').order('name', { ascending: true });
    if (error) throw error;
    return data;
  }

  static async listBookings(params: { page?: number; limit?: number; branch_id?: string; status?: string }) {
    const supabase = await createSupabaseClient();
    const { page = 1, limit = 20, branch_id, status } = params;
    let query = supabase.from('grooming_bookings').select('*', { count: 'exact' }).order('appointment_date', { ascending: false }).range((page - 1) * limit, page * limit - 1);
    if (branch_id) query = query.eq('branch_id', branch_id);
    if (status) query = query.eq('status', status);
    const { data, error, count } = await query;
    if (error) throw error;
    return { data, total: count ?? 0, page, limit, totalPages: Math.ceil((count ?? 0) / limit) } as PaginatedResponse<any>;
  }

  static async createRecord(input: { booking_id: string; skin_condition?: string; coat_condition?: string; recommendations?: string }) {
    const supabase = await createSupabaseClient();
    const { data, error } = await supabase.from('grooming_records').insert(input).select().single();
    if (error) throw error;
    return data;
  }
}
