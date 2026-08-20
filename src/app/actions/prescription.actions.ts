'use server';
import { revalidatePath } from 'next/cache';
import { createSupabaseClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { uuidSchema } from '@/schemas/base';
import type { Prescription } from '@/types/prescription';
import type { ActionResponse } from '@/types/base';

const createPrescriptionSchema = z.object({
  medical_record_id: uuidSchema,
  doctor_id: uuidSchema,
  customer_id: uuidSchema,
  pet_id: uuidSchema,
  status: z.enum(['DRAFT', 'ACTIVE', 'COMPLETED', 'CANCELLED']).default('DRAFT'),
  instructions: z.string().optional(),
  dosage: z.string().optional(),
  duration_days: z.number().int().positive().optional(),
  refills_allowed: z.number().int().nonnegative().default(0),
  refills_used: z.number().int().nonnegative().default(0),
  valid_until: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

const updatePrescriptionStatusSchema = z.object({
  prescription_id: uuidSchema,
  status: z.enum(['DRAFT', 'ACTIVE', 'COMPLETED', 'CANCELLED']),
});

export async function createPrescriptionAction(
  input: unknown
): Promise<ActionResponse<Prescription>> {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'AUTH_ERROR' };
  }
  const parsed = createPrescriptionSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'VALIDATION_ERROR', details: parsed.error.flatten() };
  }
  const { data, error } = await supabase
    .from('prescriptions')
    .insert({ ...parsed.data })
    .select()
    .single();
  if (error) {
    return { success: false, error: 'DB_ERROR', message: error.message };
  }
  revalidatePath('/dashboard/prescriptions');
  return { success: true, data };
}

export async function updatePrescriptionStatusAction(
  input: unknown
): Promise<ActionResponse<Prescription>> {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'AUTH_ERROR' };
  }
  const parsed = updatePrescriptionStatusSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'VALIDATION_ERROR', details: parsed.error.flatten() };
  }
  const { prescription_id, status } = parsed.data;
  const { data, error } = await supabase
    .from('prescriptions')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', prescription_id)
    .select()
    .single();
  if (error) {
    return { success: false, error: 'DB_ERROR', message: error.message };
  }
  revalidatePath('/dashboard/prescriptions');
  return { success: true, data };
}
