'use server';
import { revalidatePath } from 'next/cache';
import { createSupabaseClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { uuidSchema } from '@/schemas/base';
import type { ActionResponse } from '@/types/base';

const createFeedbackSchema = z.object({
  customer_id: uuidSchema.nullable().optional(),
  appointment_id: uuidSchema.nullable().optional(),
  invoice_id: uuidSchema.nullable().optional(),
  rating: z.number().int().min(1).max(5),
  category: z.string().max(100).optional(),
  comment: z.string().max(2000).optional(),
  is_anonymous: z.boolean().default(false),
});

const respondFeedbackSchema = z.object({
  feedback_id: uuidSchema,
  response: z.string().max(2000),
  responded_by: uuidSchema,
});

export async function createFeedbackAction(
  input: unknown
): Promise<ActionResponse> {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'AUTH_ERROR' };
  }
  const parsed = createFeedbackSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'VALIDATION_ERROR', details: parsed.error.flatten() };
  }
  const { data, error } = await supabase
    .from('feedbacks')
    .insert({ ...parsed.data, created_by: user.id })
    .select()
    .single();
  if (error) {
    return { success: false, error: 'DB_ERROR', message: error.message };
  }
  revalidatePath('/dashboard/feedbacks');
  return { success: true, data };
}

export async function respondFeedbackAction(
  input: unknown
): Promise<ActionResponse> {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'AUTH_ERROR' };
  }
  const parsed = respondFeedbackSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'VALIDATION_ERROR', details: parsed.error.flatten() };
  }
  const { data, error } = await supabase
    .from('feedbacks')
    .update({
      response: parsed.data.response,
      responded_by: parsed.data.responded_by,
      responded_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', parsed.data.feedback_id)
    .select()
    .single();
  if (error) {
    return { success: false, error: 'DB_ERROR', message: error.message };
  }
  revalidatePath('/dashboard/feedbacks');
  return { success: true, data };
}
