'use server';
import { revalidatePath } from 'next/cache';
import { createSupabaseClient } from '@/lib/supabase/server';
import { createRoomSchema, updateRoomSchema } from '@/schemas/pet-hotel';
import type { ActionResponse } from '@/types/base';

export async function createRoomAction(input: unknown): Promise<ActionResponse<Record<string, unknown>>> {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'AUTH_ERROR' };
  }
  const parsed = createRoomSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'VALIDATION_ERROR', details: parsed.error.flatten() };
  }
  const { data, error } = await supabase
    .from('rooms')
    .insert(parsed.data)
    .select()
    .single();
  if (error) {
    return { success: false, error: 'DB_ERROR', message: error.message };
  }
  revalidatePath('/dashboard/pet-hotel/rooms');
  return { success: true, data };
}

export async function updateRoomAction(id: string, input: unknown): Promise<ActionResponse<Record<string, unknown>>> {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'AUTH_ERROR' };
  }
  const parsed = updateRoomSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'VALIDATION_ERROR', details: parsed.error.flatten() };
  }
  const { data, error } = await supabase
    .from('rooms')
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) {
    return { success: false, error: 'DB_ERROR', message: error.message };
  }
  revalidatePath('/dashboard/pet-hotel/rooms');
  return { success: true, data };
}

export async function deleteRoomAction(id: string): Promise<ActionResponse> {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'AUTH_ERROR' };
  }
  const { error } = await supabase
    .from('rooms')
    .delete()
    .eq('id', id);
  if (error) {
    return { success: false, error: 'DB_ERROR', message: error.message };
  }
  revalidatePath('/dashboard/pet-hotel/rooms');
  return { success: true };
}

export async function createPetHotelBookingAction(input: unknown): Promise<ActionResponse<Record<string, unknown>>> {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'AUTH_ERROR' };
  }
  const { createPetHotelBookingSchema } = await import('@/schemas/pet-hotel');
  const parsed = createPetHotelBookingSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'VALIDATION_ERROR', details: parsed.error.flatten() };
  }
  const { data, error } = await supabase
    .from('pet_hotel_bookings')
    .insert(parsed.data)
    .select()
    .single();
  if (error) {
    return { success: false, error: 'DB_ERROR', message: error.message };
  }
  revalidatePath('/dashboard/pet-hotel/bookings');
  return { success: true, data };
}

export async function updatePetHotelBookingAction(id: string, input: unknown): Promise<ActionResponse<Record<string, unknown>>> {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'AUTH_ERROR' };
  }
  const { updatePetHotelBookingSchema } = await import('@/schemas/pet-hotel');
  const parsed = updatePetHotelBookingSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'VALIDATION_ERROR', details: parsed.error.flatten() };
  }
  const { data, error } = await supabase
    .from('pet_hotel_bookings')
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) {
    return { success: false, error: 'DB_ERROR', message: error.message };
  }
  revalidatePath('/dashboard/pet-hotel/bookings');
  return { success: true, data };
}

export async function deletePetHotelBookingAction(id: string): Promise<ActionResponse> {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'AUTH_ERROR' };
  }
  const { error } = await supabase
    .from('pet_hotel_bookings')
    .delete()
    .eq('id', id);
  if (error) {
    return { success: false, error: 'DB_ERROR', message: error.message };
  }
  revalidatePath('/dashboard/pet-hotel/bookings');
  return { success: true };
}
