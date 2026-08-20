'use server';
import { revalidatePath } from 'next/cache';
import { createSupabaseClient } from '@/lib/supabase/server';
import { createAppointmentSchema } from '@/schemas/appointment';
import type { Appointment, AppointmentStatus } from '@/types/appointment';
import type { ActionResponse } from '@/types/base';

export async function createAppointmentAction(
  input: unknown
): Promise<ActionResponse<Appointment>> {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'AUTH_ERROR' };
  }
  const parsed = createAppointmentSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'VALIDATION_ERROR', details: parsed.error.flatten() };
  }
  const { data, error } = await supabase
    .from('appointments')
    .insert({ ...parsed.data, status: 'SCHEDULED' as AppointmentStatus })
    .select()
    .single();
  if (error) {
    return { success: false, error: 'DB_ERROR', message: error.message };
  }
  revalidatePath('/dashboard/appointments');
  return { success: true, data };
}

export async function updateAppointmentStatusAction(
  id: string,
  status: AppointmentStatus
): Promise<ActionResponse<Appointment>> {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'AUTH_ERROR' };
  }
  const { data, error } = await supabase
    .from('appointments')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) {
    return { success: false, error: 'DB_ERROR', message: error.message };
  }
  revalidatePath('/dashboard/appointments');
  return { success: true, data };
}

export async function deleteAppointmentAction(id: string): Promise<ActionResponse> {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'AUTH_ERROR' };
  }
  const { error } = await supabase
    .from('appointments')
    .delete()
    .eq('id', id);
  if (error) {
    return { success: false, error: 'DB_ERROR', message: error.message };
  }
  revalidatePath('/dashboard/appointments');
  return { success: true };
}
