import { createSupabaseClient } from '@/lib/supabase/server';
import type { Customer, CreateCustomerInput, PaginatedResponse } from '@/types';

export class CustomerService {
  static async list(params: {
    page?: number;
    limit?: number;
    search?: string;
    tags?: string[];
    is_active?: boolean;
    branch_id?: string;
  }): Promise<PaginatedResponse<Customer>> {
    const supabase = await createSupabaseClient();
    const { page = 1, limit = 20, search, tags, is_active = true, branch_id } = params;

    let query = supabase
      .from('customers')
      .select('*', { count: 'exact' })
      .eq('is_active', is_active)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (branch_id) query = query.eq('branch_id', branch_id);
    if (search) query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%`);
    if (tags?.length) query = query.overlaps('tags', tags);

    const { data, error, count } = await query;
    if (error) throw error;

    return {
      data: data as Customer[],
      total: count ?? 0,
      page,
      limit,
      totalPages: Math.ceil((count ?? 0) / limit),
    };
  }

  static async getById(id: string): Promise<Customer | null> {
    const supabase = await createSupabaseClient();
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();
    if (error) return null;
    return data as Customer;
  }

  static async create(input: CreateCustomerInput): Promise<Customer> {
    const supabase = await createSupabaseClient();
    const { data, error } = await supabase
      .from('customers')
      .insert(input)
      .select()
      .single();
    if (error) throw error;
    return data as Customer;
  }

  static async update(id: string, input: Partial<CreateCustomerInput>): Promise<Customer> {
    const supabase = await createSupabaseClient();
    const { data, error } = await supabase
      .from('customers')
      .update(input)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Customer;
  }
}
