'use server';
import { revalidatePath } from 'next/cache';
import { createSupabaseClient } from '@/lib/supabase/server';
import { createInvoiceSchema, invoiceItemSchema } from '@/schemas/invoice';
import type { Invoice, InvoiceItem } from '@/types/invoice';
import type { ActionResponse } from '@/types/base';

export async function createInvoiceAction(
  input: unknown
): Promise<ActionResponse<Invoice>> {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'AUTH_ERROR' };
  }
  const parsed = createInvoiceSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'VALIDATION_ERROR', details: parsed.error.flatten() };
  }
  const { items, ...invoiceData } = parsed.data;
  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unit_price - item.discount_amount,
    0
  );
  const totalAmount = subtotal + invoiceData.tax_amount + invoiceData.shipping_amount - invoiceData.discount_amount;
  const { data: invoice, error: invoiceError } = await supabase
    .from('invoices')
    .insert({
      ...invoiceData,
      subtotal,
      total_amount: totalAmount,
      paid_amount: 0,
      status: 'UNPAID',
      created_by: user.id,
    })
    .select()
    .single();
  if (invoiceError || !invoice) {
    return { success: false, error: 'DB_ERROR', message: invoiceError?.message };
  }
  const invoiceItems = items.map((item: InvoiceItem) => ({
    ...item,
    invoice_id: invoice.id,
    total_price: item.quantity * item.unit_price - item.discount_amount + item.tax_amount,
  }));
  const { error: itemsError } = await supabase
    .from('invoice_items')
    .insert(invoiceItems);
  if (itemsError) {
    await supabase.from('invoices').delete().eq('id', invoice.id);
    return { success: false, error: 'DB_ERROR', message: itemsError.message };
  }
  revalidatePath('/dashboard/invoices');
  return { success: true, data: invoice };
}

export async function cancelInvoiceAction(id: string): Promise<ActionResponse<Invoice>> {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'AUTH_ERROR' };
  }
  const { data, error } = await supabase
    .from('invoices')
    .update({ status: 'CANCELLED', updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) {
    return { success: false, error: 'DB_ERROR', message: error.message };
  }
  revalidatePath('/dashboard/invoices');
  return { success: true, data };
}

export async function refundInvoiceAction(
  id: string,
  amount: number
): Promise<ActionResponse<Invoice>> {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'AUTH_ERROR' };
  }
  const { data: invoice, error: fetchError } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', id)
    .single();
  if (fetchError || !invoice) {
    return { success: false, error: 'NOT_FOUND' };
  }
  if (amount > invoice.paid_amount) {
    return { success: false, error: 'PAYMENT_ERROR', message: 'Refund amount exceeds paid amount' };
  }
  const { data, error } = await supabase
    .from('invoices')
    .update({
      status: 'REFUNDED',
      paid_amount: invoice.paid_amount - amount,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();
  if (error) {
    return { success: false, error: 'DB_ERROR', message: error.message };
  }
  revalidatePath('/dashboard/invoices');
  return { success: true, data };
}
