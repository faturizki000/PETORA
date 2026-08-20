'use server';
import { revalidatePath } from 'next/cache';
import { createSupabaseClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { uuidSchema, dateSchema } from '@/schemas/base';
import type { ActionResponse } from '@/types/base';

const createVoucherSchema = z.object({
  code: z.string().min(1).max(50),
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  discount_type: z.enum(['percentage', 'fixed']),
  discount_value: z.number().positive(),
  min_purchase_amount: z.number().nonnegative().optional(),
  max_discount_amount: z.number().nonnegative().optional(),
  start_date: dateSchema,
  end_date: dateSchema,
  usage_limit: z.number().int().positive().optional(),
  usage_count: z.number().int().nonnegative().default(0),
  applicable_products: z.array(uuidSchema).optional(),
  applicable_categories: z.array(uuidSchema).optional(),
  is_active: z.boolean().default(true),
});

const applyVoucherSchema = z.object({
  voucher_id: uuidSchema,
  invoice_id: uuidSchema,
});

export async function createVoucherAction(
  input: unknown
): Promise<ActionResponse> {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'AUTH_ERROR' };
  }
  const parsed = createVoucherSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'VALIDATION_ERROR', details: parsed.error.flatten() };
  }
  const { data, error } = await supabase
    .from('vouchers')
    .insert({ ...parsed.data, created_by: user.id })
    .select()
    .single();
  if (error) {
    return { success: false, error: 'DB_ERROR', message: error.message };
  }
  revalidatePath('/dashboard/vouchers');
  return { success: true, data };
}

export async function applyVoucherAction(
  input: unknown
): Promise<ActionResponse> {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'AUTH_ERROR' };
  }
  const parsed = applyVoucherSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'VALIDATION_ERROR', details: parsed.error.flatten() };
  }
  const { data, error } = await supabase
    .from('voucher_usages')
    .insert({ ...parsed.data, used_by: user.id })
    .select()
    .single();
  if (error) {
    return { success: false, error: 'DB_ERROR', message: error.message };
  }
  revalidatePath('/dashboard/vouchers');
  revalidatePath('/dashboard/invoices');
  return { success: true, data };
}
