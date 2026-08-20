import { createSupabaseClient } from '@/lib/supabase/server';
import type { Prescription, CreatePrescriptionInput, PaginatedResponse } from '@/types';

export class PrescriptionService {
  static async list(params: {
    page?: number;
    limit?: number;
    search?: string;
    medical_record_id?: string;
    doctor_id?: string;
    customer_id?: string;
    pet_id?: string;
    status?: string;
  }): Promise<PaginatedResponse<Prescription>> {
    const supabase = await createSupabaseClient();
    const { page = 1, limit = 20, search, medical_record_id, doctor_id, customer_id, pet_id, status } = params;

    let query = supabase
      .from('prescriptions')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (medical_record_id) query = query.eq('medical_record_id', medical_record_id);
    if (doctor_id) query = query.eq('doctor_id', doctor_id);
    if (customer_id) query = query.eq('customer_id', customer_id);
    if (pet_id) query = query.eq('pet_id', pet_id);
    if (status) query = query.eq('status', status);
    if (search) query = query.or(`dosage.ilike.%${search}%,instructions.ilike.%${search}%`);

    const { data, error, count } = await query;
    if (error) throw error;

    return {
      data: data as Prescription[],
      total: count ?? 0,
      page,
      limit,
      totalPages: Math.ceil((count ?? 0) / limit),
    };
  }

  static async getById(id: string): Promise<Prescription | null> {
    const supabase = await createSupabaseClient();
    const { data, error } = await supabase
      .from('prescriptions')
      .select('*')
      .eq('id', id)
      .single();
    if (error) return null;
    return data as Prescription;
  }

  static async create(input: CreatePrescriptionInput): Promise<Prescription> {
    const supabase = await createSupabaseClient();
    const { data, error } = await supabase
      .from('prescriptions')
      .insert(input)
      .select()
      .single();
    if (error) throw error;
    return data as Prescription;
  }

  static async update(id: string, input: Partial<CreatePrescriptionInput>): Promise<Prescription> {
    const supabase = await createSupabaseClient();
    const { data, error } = await supabase
      .from('prescriptions')
      .update(input)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Prescription;
  }
}
