import { createSupabaseClient } from '@/lib/supabase/server';
import type { MedicalRecord, CreateMedicalRecordInput, PaginatedResponse } from '@/types';

export class MedicalRecordService {
  static async list(params: {
    page?: number;
    limit?: number;
    search?: string;
    appointment_id?: string;
    doctor_id?: string;
    pet_id?: string;
    status?: string;
    branch_id?: string;
  }): Promise<PaginatedResponse<MedicalRecord>> {
    const supabase = await createSupabaseClient();
    const { page = 1, limit = 20, search, appointment_id, doctor_id, pet_id, status, branch_id } = params;

    let query = supabase
      .from('medical_records')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (appointment_id) query = query.eq('appointment_id', appointment_id);
    if (doctor_id) query = query.eq('doctor_id', doctor_id);
    if (pet_id) query = query.eq('pet_id', pet_id);
    if (status) query = query.eq('status', status);
    if (branch_id) query = query.eq('branch_id', branch_id);
    if (search) query = query.or(`diagnosis.ilike.%${search}%,chief_complaint.ilike.%${search}%`);

    const { data, error, count } = await query;
    if (error) throw error;

    return {
      data: data as MedicalRecord[],
      total: count ?? 0,
      page,
      limit,
      totalPages: Math.ceil((count ?? 0) / limit),
    };
  }

  static async getById(id: string): Promise<MedicalRecord | null> {
    const supabase = await createSupabaseClient();
    const { data, error } = await supabase
      .from('medical_records')
      .select('*')
      .eq('id', id)
      .single();
    if (error) return null;
    return data as MedicalRecord;
  }

  static async create(input: CreateMedicalRecordInput): Promise<MedicalRecord> {
    const supabase = await createSupabaseClient();
    const { data, error } = await supabase
      .from('medical_records')
      .insert(input)
      .select()
      .single();
    if (error) throw error;
    return data as MedicalRecord;
  }

  static async update(id: string, input: Partial<CreateMedicalRecordInput>): Promise<MedicalRecord> {
    const supabase = await createSupabaseClient();
    const { data, error } = await supabase
      .from('medical_records')
      .update(input)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as MedicalRecord;
  }
}
