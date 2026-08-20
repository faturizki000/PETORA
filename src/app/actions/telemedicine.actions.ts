'use server';
import { revalidatePath } from 'next/cache';
import { createSupabaseClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { uuidSchema } from '@/schemas/base';
import type { TelemedicineSession } from '@/types/telemedicine';
import type { ActionResponse } from '@/types/base';

const createSessionSchema = z.object({
  customer_id: uuidSchema,
  pet_id: uuidSchema,
  doctor_id: uuidSchema,
  scheduled_at: z.string().datetime(),
  duration_minutes: z.number().int().positive().default(30),
  notes: z.string().optional(),
  fee: z.number().nonnegative().optional(),
});

const updateSessionStatusSchema = z.object({
  session_id: uuidSchema,
  status: z.enum(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW']),
  meeting_url: z.string().url().optional(),
  meeting_id: z.string().optional(),
  recording_url: z.string().url().optional(),
});

export async function createSessionAction(
  input: unknown
): Promise<ActionResponse<TelemedicineSession>> {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'AUTH_ERROR' };
  }
  const parsed = createSessionSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'VALIDATION_ERROR', details: parsed.error.flatten() };
  }
  const { data, error } = await supabase
    .from('telemedicine_sessions')
    .insert({ ...parsed.data, status: 'SCHEDULED' })
    .select()
    .single();
  if (error) {
    return { success: false, error: 'DB_ERROR', message: error.message };
  }
  revalidatePath('/dashboard/telemedicine');
  return { success: true, data };
}

export async function updateSessionStatusAction(
  input: unknown
): Promise<ActionResponse<TelemedicineSession>> {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'AUTH_ERROR' };
  }
  const parsed = updateSessionStatusSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'VALIDATION_ERROR', details: parsed.error.flatten() };
  }
  const { session_id, status, ...rest } = parsed.data;
  const { data, error } = await supabase
    .from('telemedicine_sessions')
    .update({ status, ...rest, updated_at: new Date().toISOString() })
    .eq('id', session_id)
    .select()
    .single();
  if (error) {
    return { success: false, error: 'DB_ERROR', message: error.message };
  }
  revalidatePath('/dashboard/telemedicine');
  return { success: true, data };
}
