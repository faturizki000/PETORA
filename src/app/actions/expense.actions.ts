'use server';
import { revalidatePath } from 'next/cache';
import { createSupabaseClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { uuidSchema, dateSchema } from '@/schemas/base';
import type { ActionResponse } from '@/types/base';

const createExpenseSchema = z.object({
  branch_id: uuidSchema.nullable().optional(),
  category: z.string().min(1),
  amount: z.number().positive(),
  description: z.string().max(500),
  expense_date: dateSchema,
  receipt_url: z.string().url().optional(),
  approved_by: uuidSchema.nullable().optional(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).default('PENDING'),
});

const approveExpenseSchema = z.object({
  expense_id: uuidSchema,
});

const rejectExpenseSchema = z.object({
  expense_id: uuidSchema,
  reason: z.string().max(500).optional(),
});

export async function createExpenseAction(
  input: unknown
): Promise<ActionResponse> {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'AUTH_ERROR' };
  }
  const parsed = createExpenseSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'VALIDATION_ERROR', details: parsed.error.flatten() };
  }
  const { data, error } = await supabase
    .from('expenses')
    .insert({ ...parsed.data, created_by: user.id })
    .select()
    .single();
  if (error) {
    return { success: false, error: 'DB_ERROR', message: error.message };
  }
  revalidatePath('/dashboard/expenses');
  return { success: true, data };
}

export async function approveExpenseAction(
  input: unknown
): Promise<ActionResponse> {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'AUTH_ERROR' };
  }
  const parsed = approveExpenseSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'VALIDATION_ERROR', details: parsed.error.flatten() };
  }
  const { data, error } = await supabase
    .from('expenses')
    .update({ status: 'APPROVED', approved_by: user.id, updated_at: new Date().toISOString() })
    .eq('id', parsed.data.expense_id)
    .select()
    .single();
  if (error) {
    return { success: false, error: 'DB_ERROR', message: error.message };
  }
  revalidatePath('/dashboard/expenses');
  return { success: true, data };
}

export async function rejectExpenseAction(
  input: unknown
): Promise<ActionResponse> {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'AUTH_ERROR' };
  }
  const parsed = rejectExpenseSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'VALIDATION_ERROR', details: parsed.error.flatten() };
  }
  const { data, error } = await supabase
    .from('expenses')
    .update({
      status: 'REJECTED',
      approved_by: user.id,
      rejection_reason: parsed.data.reason,
      updated_at: new Date().toISOString(),
    })
    .eq('id', parsed.data.expense_id)
    .select()
    .single();
  if (error) {
    return { success: false, error: 'DB_ERROR', message: error.message };
  }
  revalidatePath('/dashboard/expenses');
  return { success: true, data };
}
