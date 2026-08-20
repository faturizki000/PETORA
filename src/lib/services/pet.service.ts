import { createSupabaseClient } from '@/lib/supabase/server';
import type { Pet, CreatePetInput, PaginatedResponse } from '@/types';

export class PetService {
  static async list(params: {
    page?: number;
    limit?: number;
    search?: string;
    customer_id?: string;
    species?: string;
  }): Promise<PaginatedResponse<Pet>> {
    const supabase = await createSupabaseClient();
    const { page = 1, limit = 20, search, customer_id, species } = params;

    let query = supabase
      .from('pets')
      .select('*', { count: 'exact' })
      .is('deleted_at', null)
      .order('name', { ascending: true })
      .range((page - 1) * limit, page * limit - 1);

    if (customer_id) query = query.eq('customer_id', customer_id);
    if (species) query = query.eq('species', species);
    if (search) query = query.or(`name.ilike.%${search}%,species.ilike.%${search}%,breed.ilike.%${search}%`);

    const { data, error, count } = await query;
    if (error) throw error;

    return {
      data: data as Pet[],
      total: count ?? 0,
      page,
      limit,
      totalPages: Math.ceil((count ?? 0) / limit),
    };
  }

  static async getById(id: string): Promise<Pet | null> {
    const supabase = await createSupabaseClient();
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();
    if (error) return null;
    return data as Pet;
  }

  static async create(input: CreatePetInput): Promise<Pet> {
    const supabase = await createSupabaseClient();
    const { data, error } = await supabase
      .from('pets')
      .insert(input)
      .select()
      .single();
    if (error) throw error;
    return data as Pet;
  }

  static async update(id: string, input: Partial<CreatePetInput>): Promise<Pet> {
    const supabase = await createSupabaseClient();
    const { data, error } = await supabase
      .from('pets')
      .update(input)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Pet;
  }
}
