import { createSupabaseClient } from '@/lib/supabase/server';
import type { PaginatedResponse } from '@/types';

export class EmployeeService {
  static async listEmployees(params: { page?: number; limit?: number; role?: string }) {
    const supabase = await createSupabaseClient();
    const { page = 1, limit = 20, role } = params;
    let query = supabase.from('users').select('*', { count: 'exact' }).order('full_name', { ascending: true }).range((page - 1) * limit, page * limit - 1);
    if (role) query = query.eq('role', role);
    const { data, error, count } = await query;
    if (error) throw error;
    return { data, total: count ?? 0, page, limit, totalPages: Math.ceil((count ?? 0) / limit) } as PaginatedResponse<any>;
  }
}
