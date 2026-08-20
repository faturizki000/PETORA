'use server';
import { revalidatePath } from 'next/cache';
import { createSupabaseClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { uuidSchema } from '@/schemas/base';
import type { Delivery } from '@/types/delivery';
import type { ActionResponse } from '@/types/base';

const createDeliverySchema = z.object({
  invoice_id: uuidSchema,
  customer_id: uuidSchema,
  delivery_address: z.string().min(1).max(500),
  delivery_zone_id: uuidSchema.nullable().optional(),
  delivery_fee: z.number().nonnegative().optional(),
  scheduled_at: z.string().datetime().optional(),
  notes: z.string().optional(),
  tracking_number: z.string().optional(),
});

const assignCourierSchema = z.object({
  delivery_id: uuidSchema,
  courier_id: uuidSchema,
});

const updateDeliveryStatusSchema = z.object({
  delivery_id: uuidSchema,
  status: z.enum(['PENDING', 'ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'FAILED', 'CANCELLED']),
  proof_photo_url: z.string().url().optional(),
  signature_url: z.string().url().optional(),
  failed_reason: z.string().optional(),
});

export async function createDeliveryAction(
  input: unknown
): Promise<ActionResponse<Delivery>> {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'AUTH_ERROR' };
  }
  const parsed = createDeliverySchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'VALIDATION_ERROR', details: parsed.error.flatten() };
  }
  const { data, error } = await supabase
    .from('deliveries')
    .insert({ ...parsed.data, status: 'PENDING' })
    .select()
    .single();
  if (error) {
    return { success: false, error: 'DB_ERROR', message: error.message };
  }
  revalidatePath('/dashboard/deliveries');
  return { success: true, data };
}

export async function assignCourierAction(
  input: unknown
): Promise<ActionResponse<Delivery>> {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'AUTH_ERROR' };
  }
  const parsed = assignCourierSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'VALIDATION_ERROR', details: parsed.error.flatten() };
  }
  const { data, error } = await supabase
    .from('deliveries')
    .update({ courier_id: parsed.data.courier_id, status: 'ASSIGNED', updated_at: new Date().toISOString() })
    .eq('id', parsed.data.delivery_id)
    .select()
    .single();
  if (error) {
    return { success: false, error: 'DB_ERROR', message: error.message };
  }
  revalidatePath('/dashboard/deliveries');
  return { success: true, data };
}

export async function updateDeliveryStatusAction(
  input: unknown
): Promise<ActionResponse<Delivery>> {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'AUTH_ERROR' };
  }
  const parsed = updateDeliveryStatusSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'VALIDATION_ERROR', details: parsed.error.flatten() };
  }
  const { delivery_id, status, ...rest } = parsed.data;
  const updates: Record<string, any> = { status, updated_at: new Date().toISOString() };
  if (status === 'PICKED_UP') updates.picked_up_at = new Date().toISOString();
  if (status === 'DELIVERED') updates.delivered_at = new Date().toISOString();
  Object.assign(updates, rest);
  const { data, error } = await supabase
    .from('deliveries')
    .update(updates)
    .eq('id', delivery_id)
    .select()
    .single();
  if (error) {
    return { success: false, error: 'DB_ERROR', message: error.message };
  }
  revalidatePath('/dashboard/deliveries');
  return { success: true, data };
}
