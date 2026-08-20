'use server';
import { revalidatePath } from 'next/cache';
import { createSupabaseClient } from '@/lib/supabase/server';
import { createGroomingServiceSchema, updateGroomingServiceSchema } from '@/schemas/grooming';
import type { ActionResponse } from '@/types/base';

export async function createGroomingServiceAction(input: unknown): Promise<ActionResponse<Record<string, unknown>>> {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'AUTH_ERROR' };
  }
  const parsed = createGroomingServiceSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'VALIDATION_ERROR', details: parsed.error.flatten() };
  }
  const { data, error } = await supabase
    .from('grooming_services')
    .insert(parsed.data)
    .select()
    .single();
  if (error) {
    return { success: false, error: 'DB_ERROR', message: error.message };
  }
  revalidatePath('/dashboard/grooming/services');
  return { success: true, data };
}

export async function updateGroomingServiceAction(id: string, input: unknown): Promise<ActionResponse<Record<string, unknown>>> {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'AUTH_ERROR' };
  }
  const parsed = updateGroomingServiceSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'VALIDATION_ERROR', details: parsed.error.flatten() };
  }
  const { data, error } = await supabase
    .from('grooming_services')
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) {
    return { success: false, error: 'DB_ERROR', message: error.message };
  }
  revalidatePath('/dashboard/grooming/services');
  return { success: true, data };
}

export async function deleteGroomingServiceAction(id: string): Promise<ActionResponse> {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'AUTH_ERROR' };
  }
  const { error } = await supabase
    .from('grooming_services')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id);
  if (error) {
    return { success: false, error: 'DB_ERROR', message: error.message };
  }
  revalidatePath('/dashboard/grooming/services');
  return { success: true };
}

export async function createGroomingBookingAction(input: unknown): Promise<ActionResponse<Record<string, unknown>>> {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'AUTH_ERROR' };
  }
  const { createGroomingBookingSchema } = await import('@/schemas/grooming');
  const parsed = createGroomingBookingSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'VALIDATION_ERROR', details: parsed.error.flatten() };
  }
  const { data, error } = await supabase
    .from('grooming_bookings')
    .insert(parsed.data)
    .select()
    .single();
  if (error) {
    return { success: false, error: 'DB_ERROR', message: error.message };
  }
  revalidatePath('/dashboard/grooming/bookings');
  return { success: true, data };
}

export async function updateGroomingBookingAction(id: string, input: unknown): Promise<ActionResponse<Record<string, unknown>>> {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'AUTH_ERROR' };
  }
  const { updateGroomingBookingSchema } = await import('@/schemas/grooming');
  const parsed = updateGroomingBookingSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'VALIDATION_ERROR', details: parsed.error.flatten() };
  }
  const { data, error } = await supabase
    .from('grooming_bookings')
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) {
    return { success: false, error: 'DB_ERROR', message: error.message };
  }
  revalidatePath('/dashboard/grooming/bookings');
  return { success: true, data };
}

export async function deleteGroomingBookingAction(id: string): Promise<ActionResponse> {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'AUTH_ERROR' };
  }
  const { error } = await supabase
    .from('grooming_bookings')
    .delete()
    .eq('id', id);
  if (error) {
    return { success: false, error: 'DB_ERROR', message: error.message };
  }
  revalidatePath('/dashboard/grooming/bookings');
  return { success: true };
}
