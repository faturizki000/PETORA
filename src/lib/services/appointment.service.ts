import { createSupabaseClient } from '@/lib/supabase/server';
import type { Appointment, CreateAppointmentInput, PaginatedResponse } from '@/types';

export class AppointmentService {
  static async list(params: {
    page?: number;
    limit?: number;
    search?: string;
    customer_id?: string;
    pet_id?: string;
    doctor_id?: string;
    status?: string;
    appointment_date?: string;
    branch_id?: string;
  }): Promise<PaginatedResponse<Appointment>> {
    const supabase = await createSupabaseClient();
    const { page = 1, limit = 20, search, customer_id, pet_id, doctor_id, status, appointment_date, branch_id } = params;

    let query = supabase
      .from('appointments')
      .select('*', { count: 'exact' })
      .order('appointment_date', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (customer_id) query = query.eq('customer_id', customer_id);
    if (pet_id) query = query.eq('pet_id', pet_id);
    if (doctor_id) query = query.eq('doctor_id', doctor_id);
    if (status) query = query.eq('status', status);
    if (appointment_date) query = query.eq('appointment_date', appointment_date);
    if (branch_id) query = query.eq('branch_id', branch_id);
    if (search) query = query.or(`appointment_type.ilike.%${search}%,complaint.ilike.%${search}%`);

    const { data, error, count } = await query;
    if (error) throw error;

    return {
      data: data as Appointment[],
      total: count ?? 0,
      page,
      limit,
      totalPages: Math.ceil((count ?? 0) / limit),
    };
  }

  static async getById(id: string): Promise<Appointment | null> {
    const supabase = await createSupabaseClient();
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', id)
      .single();
    if (error) return null;
    return data as Appointment;
  }

  static async create(input: CreateAppointmentInput): Promise<Appointment> {
    const supabase = await createSupabaseClient();
    const { data, error } = await supabase
      .from('appointments')
      .insert(input)
      .select()
      .single();
    if (error) throw error;
    return data as Appointment;
  }

  static async update(id: string, input: Partial<CreateAppointmentInput>): Promise<Appointment> {
    const supabase = await createSupabaseClient();
    const { data, error } = await supabase
      .from('appointments')
      .update(input)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Appointment;
  }
}
