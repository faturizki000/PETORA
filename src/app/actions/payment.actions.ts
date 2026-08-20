'use server';
import { revalidatePath } from 'next/cache';
import { createSupabaseClient } from '@/lib/supabase/server';
import { manualPaymentSchema, verifyPaymentSchema, splitPaymentSchema } from '@/schemas/payment';
import type { Payment } from '@/types/invoice';
import type { ActionResponse } from '@/types/base';

export async function recordManualPaymentAction(
  input: unknown
): Promise<ActionResponse<Payment>> {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'AUTH_ERROR' };
  }
  const parsed = manualPaymentSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'VALIDATION_ERROR', details: parsed.error.flatten() };
  }
  const { data, error } = await supabase
    .from('payments')
    .insert({ ...parsed.data, payment_status: 'PENDING', created_by: user.id })
    .select()
    .single();
  if (error) {
    return { success: false, error: 'DB_ERROR', message: error.message };
  }
  revalidatePath('/dashboard/payments');
  revalidatePath('/dashboard/invoices');
  return { success: true, data };
}

export async function verifyPaymentAction(
  input: unknown
): Promise<ActionResponse<Payment>> {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'AUTH_ERROR' };
  }
  const parsed = verifyPaymentSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'VALIDATION_ERROR', details: parsed.error.flatten() };
  }
  const { payment_id, status, notes } = parsed.data;
  const { data, error } = await supabase
    .from('payments')
    .update({
      payment_status: status,
      verified_by: user.id,
      verified_at: new Date().toISOString(),
      notes,
      updated_at: new Date().toISOString(),
    })
    .eq('id', payment_id)
    .select()
    .single();
  if (error) {
    return { success: false, error: 'DB_ERROR', message: error.message };
  }
  revalidatePath('/dashboard/payments');
  return { success: true, data };
}

export async function splitPaymentAction(
  input: unknown
): Promise<ActionResponse<Payment[]>> {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'AUTH_ERROR' };
  }
  const parsed = splitPaymentSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'VALIDATION_ERROR', details: parsed.error.flatten() };
  }
  const { invoice_id, payments } = parsed.data;
  const paymentRecords = payments.map((payment) => ({
    ...payment,
    invoice_id,
    payment_status: 'PENDING' as const,
    created_by: user.id,
  }));
  const { data, error } = await supabase
    .from('payments')
    .insert(paymentRecords)
    .select();
  if (error) {
    return { success: false, error: 'DB_ERROR', message: error.message };
  }
  revalidatePath('/dashboard/payments');
  revalidatePath('/dashboard/invoices');
  return { success: true, data };
}
