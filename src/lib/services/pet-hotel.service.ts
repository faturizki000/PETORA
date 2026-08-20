import { createSupabaseClient } from '@/lib/supabase/server';
import type { PaginatedResponse } from '@/types';

export class PetHotelService {
  static async listRooms(branch_id?: string) {
    const supabase = await createSupabaseClient();
    let query = supabase.from('rooms').select('*').order('name', { ascending: true });
    if (branch_id) query = query.eq('branch_id', branch_id);
    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async getById(id: string) {
    const supabase = await createSupabaseClient();
    const { data, error } = await supabase.from('rooms').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  }

  static async listBookings(params: { page?: number; limit?: number; branch_id?: string; status?: string }) {
    const supabase = await createSupabaseClient();
    const { page = 1, limit = 20, branch_id, status } = params;
    let query = supabase.from('pet_hotel_bookings').select('*', { count: 'exact' }).order('check_in_date', { ascending: false }).range((page - 1) * limit, page * limit - 1);
    if (branch_id) query = query.eq('branch_id', branch_id);
    if (status) query = query.eq('status', status);
    const { data, error, count } = await query;
    if (error) throw error;
    return { data, total: count ?? 0, page, limit, totalPages: Math.ceil((count ?? 0) / limit) } as PaginatedResponse<any>;
  }

  static async addLog(booking_id: string, input: { log_type: string; description: string }) {
    const supabase = await createSupabaseClient();
    const { data, error } = await supabase.from('pet_hotel_logs').insert({ booking_id, ...input }).select().single();
    if (error) throw error;
    return data;
  }
}
