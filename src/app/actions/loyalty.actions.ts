'use server';
import { revalidatePath } from 'next/cache';
import { createSupabaseClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { uuidSchema } from '@/schemas/base';
import type { ActionResponse } from '@/types/base';

const redeemPointsSchema = z.object({
  customer_id: uuidSchema,
  points: z.number().int().positive(),
  invoice_id: uuidSchema.nullable().optional(),
});

const adjustPointsSchema = z.object({
  customer_id: uuidSchema,
  points: z.number().int(),
  reason: z.string().max(500),
  expires_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

const issueReferralBonusSchema = z.object({
  customer_id: uuidSchema,
  referred_customer_id: uuidSchema,
  points: z.number().int().positive().optional(),
});

export async function redeemPointsAction(
  input: unknown
): Promise<ActionResponse> {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'AUTH_ERROR' };
  }
  const parsed = redeemPointsSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'VALIDATION_ERROR', details: parsed.error.flatten() };
  }
  const { data, error } = await supabase
    .from('loyalty_transactions')
    .insert({ ...parsed.data, type: 'REDEMPTION', created_by: user.id })
    .select()
    .single();
  if (error) {
    return { success: false, error: 'DB_ERROR', message: error.message };
  }
  revalidatePath('/dashboard/loyalty');
  return { success: true, data };
}

export async function adjustPointsAction(
  input: unknown
): Promise<ActionResponse> {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'AUTH_ERROR' };
  }
  const parsed = adjustPointsSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'VALIDATION_ERROR', details: parsed.error.flatten() };
  }
  const { data, error } = await supabase
    .from('loyalty_transactions')
    .insert({ ...parsed.data, type: 'ADJUSTMENT', created_by: user.id })
    .select()
    .single();
  if (error) {
    return { success: false, error: 'DB_ERROR', message: error.message };
  }
  revalidatePath('/dashboard/loyalty');
  return { success: true, data };
}

export async function issueReferralBonusAction(
  input: unknown
): Promise<ActionResponse> {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'AUTH_ERROR' };
  }
  const parsed = issueReferralBonusSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'VALIDATION_ERROR', details: parsed.error.flatten() };
  }
  const { data, error } = await supabase
    .from('loyalty_transactions')
    .insert({ ...parsed.data, type: 'REFERRAL_BONUS', created_by: user.id })
    .select()
    .single();
  if (error) {
    return { success: false, error: 'DB_ERROR', message: error.message };
  }
  revalidatePath('/dashboard/loyalty');
  return { success: true, data };
}
