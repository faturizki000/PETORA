'use server';
import { revalidatePath } from 'next/cache';
import { createSupabaseClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { uuidSchema, dateSchema } from '@/schemas/base';
import type { Subscription } from '@/types/subscription';
import type { ActionResponse } from '@/types/base';

const createSubscriptionSchema = z.object({
  customer_id: uuidSchema,
  plan_id: uuidSchema,
  pet_id: uuidSchema.nullable().optional(),
  status: z.enum(['ACTIVE', 'PAUSED', 'CANCELLED', 'EXPIRED']).default('ACTIVE'),
  start_date: dateSchema,
  end_date: dateSchema.nullable().optional(),
  next_billing_date: dateSchema.nullable().optional(),
  auto_renew: z.boolean().default(true),
  payment_method: z.enum(['CASH', 'QRIS', 'TRANSFER', 'E_WALLET', 'CREDIT_CARD', 'DEBIT_CARD', 'GIFT_CARD', 'LOYALTY_POINTS', 'MIXED', 'OTHER']).nullable().optional(),
  notes: z.string().optional(),
});

const subscriptionActionSchema = z.object({
  subscription_id: uuidSchema,
});

export async function createSubscriptionAction(
  input: unknown
): Promise<ActionResponse<Subscription>> {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'AUTH_ERROR' };
  }
  const parsed = createSubscriptionSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'VALIDATION_ERROR', details: parsed.error.flatten() };
  }
  const { data, error } = await supabase
    .from('subscriptions')
    .insert({ ...parsed.data })
    .select()
    .single();
  if (error) {
    return { success: false, error: 'DB_ERROR', message: error.message };
  }
  revalidatePath('/dashboard/subscriptions');
  return { success: true, data };
}

export async function pauseSubscriptionAction(
  input: unknown
): Promise<ActionResponse<Subscription>> {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'AUTH_ERROR' };
  }
  const parsed = subscriptionActionSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'VALIDATION_ERROR', details: parsed.error.flatten() };
  }
  const { data, error } = await supabase
    .from('subscriptions')
    .update({ status: 'PAUSED', updated_at: new Date().toISOString() })
    .eq('id', parsed.data.subscription_id)
    .select()
    .single();
  if (error) {
    return { success: false, error: 'DB_ERROR', message: error.message };
  }
  revalidatePath('/dashboard/subscriptions');
  return { success: true, data };
}

export async function cancelSubscriptionAction(
  input: unknown
): Promise<ActionResponse<Subscription>> {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'AUTH_ERROR' };
  }
  const parsed = subscriptionActionSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'VALIDATION_ERROR', details: parsed.error.flatten() };
  }
  const { data, error } = await supabase
    .from('subscriptions')
    .update({ status: 'CANCELLED', updated_at: new Date().toISOString() })
    .eq('id', parsed.data.subscription_id)
    .select()
    .single();
  if (error) {
    return { success: false, error: 'DB_ERROR', message: error.message };
  }
  revalidatePath('/dashboard/subscriptions');
  return { success: true, data };
}

export async function renewSubscriptionAction(
  input: unknown
): Promise<ActionResponse<Subscription>> {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'AUTH_ERROR' };
  }
  const parsed = subscriptionActionSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'VALIDATION_ERROR', details: parsed.error.flatten() };
  }
  const { data, error } = await supabase
    .from('subscriptions')
    .update({ status: 'ACTIVE', updated_at: new Date().toISOString() })
    .eq('id', parsed.data.subscription_id)
    .select()
    .single();
  if (error) {
    return { success: false, error: 'DB_ERROR', message: error.message };
  }
  revalidatePath('/dashboard/subscriptions');
  return { success: true, data };
}
