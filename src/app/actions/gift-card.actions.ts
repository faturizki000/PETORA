'use server';
import { revalidatePath } from 'next/cache';
import { createSupabaseClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { uuidSchema, dateSchema } from '@/schemas/base';
import type { ActionResponse } from '@/types/base';

const createGiftCardSchema = z.object({
  code: z.string().min(1).max(50),
  initial_balance: z.number().positive(),
  current_balance: z.number().nonnegative(),
  currency: z.string().default('IDR'),
  expires_at: dateSchema.optional(),
  issued_to: uuidSchema.nullable().optional(),
  issued_by: uuidSchema.nullable().optional(),
  is_active: z.boolean().default(true),
  notes: z.string().optional(),
});

const redeemGiftCardSchema = z.object({
  gift_card_id: uuidSchema,
  amount: z.number().positive(),
  invoice_id: uuidSchema.nullable().optional(),
});

const topUpGiftCardSchema = z.object({
  gift_card_id: uuidSchema,
  amount: z.number().positive(),
  reason: z.string().max(500),
});

export async function createGiftCardAction(
  input: unknown
): Promise<ActionResponse> {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'AUTH_ERROR' };
  }
  const parsed = createGiftCardSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'VALIDATION_ERROR', details: parsed.error.flatten() };
  }
  const { data, error } = await supabase
    .from('gift_cards')
    .insert({ ...parsed.data, created_by: user.id })
    .select()
    .single();
  if (error) {
    return { success: false, error: 'DB_ERROR', message: error.message };
  }
  revalidatePath('/dashboard/gift-cards');
  return { success: true, data };
}

export async function redeemGiftCardAction(
  input: unknown
): Promise<ActionResponse> {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'AUTH_ERROR' };
  }
  const parsed = redeemGiftCardSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'VALIDATION_ERROR', details: parsed.error.flatten() };
  }
  const { gift_card_id, amount } = parsed.data;
  const { data: giftCard, error: fetchError } = await supabase
    .from('gift_cards')
    .select('*')
    .eq('id', gift_card_id)
    .single();
  if (fetchError || !giftCard) {
    return { success: false, error: 'NOT_FOUND' };
  }
  if (amount > giftCard.current_balance) {
    return { success: false, error: 'PAYMENT_ERROR', message: 'Insufficient gift card balance' };
  }
  const { data, error } = await supabase
    .from('gift_cards')
    .update({ current_balance: giftCard.current_balance - amount, updated_at: new Date().toISOString() })
    .eq('id', gift_card_id)
    .select()
    .single();
  if (error) {
    return { success: false, error: 'DB_ERROR', message: error.message };
  }
  revalidatePath('/dashboard/gift-cards');
  return { success: true, data };
}

export async function topUpGiftCardAction(
  input: unknown
): Promise<ActionResponse> {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'AUTH_ERROR' };
  }
  const parsed = topUpGiftCardSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'VALIDATION_ERROR', details: parsed.error.flatten() };
  }
  const { gift_card_id, amount } = parsed.data;
  const { data: giftCard, error: fetchError } = await supabase
    .from('gift_cards')
    .select('*')
    .eq('id', gift_card_id)
    .single();
  if (fetchError || !giftCard) {
    return { success: false, error: 'NOT_FOUND' };
  }
  const { data, error } = await supabase
    .from('gift_cards')
    .update({ current_balance: giftCard.current_balance + amount, updated_at: new Date().toISOString() })
    .eq('id', gift_card_id)
    .select()
    .single();
  if (error) {
    return { success: false, error: 'DB_ERROR', message: error.message };
  }
  revalidatePath('/dashboard/gift-cards');
  return { success: true, data };
}
