'use server';
import { revalidatePath } from 'next/cache';
import { createSupabaseClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { uuidSchema, dateSchema } from '@/schemas/base';
import type { MedicalRecord } from '@/types/medical-record';
import type { ActionResponse } from '@/types/base';

const createMedicalRecordSchema = z.object({
  appointment_id: uuidSchema,
  doctor_id: uuidSchema,
  branch_id: uuidSchema.nullable().optional(),
  chief_complaint: z.string().optional(),
  history: z.string().optional(),
  physical_exam: z.string().optional(),
  weight_kg: z.number().nonnegative().optional(),
  temperature_c: z.number().nonnegative().optional(),
  heart_rate_bpm: z.number().int().nonnegative().optional(),
  respiratory_rate_bpm: z.number().int().nonnegative().optional(),
  diagnosis: z.string().optional(),
  diagnosis_code: z.string().optional(),
  treatment: z.string().optional(),
  prescription: z.string().optional(),
  lab_results: z.string().optional(),
  additional_notes: z.string().optional(),
  attachments: z.array(z.string().url()).optional(),
  status: z.enum(['OPEN', 'CLOSED']).default('OPEN'),
});

const updateMedicalRecordSchema = createMedicalRecordSchema.partial();

export async function createMedicalRecordAction(
  input: unknown
): Promise<ActionResponse<MedicalRecord>> {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'AUTH_ERROR' };
  }
  const parsed = createMedicalRecordSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'VALIDATION_ERROR', details: parsed.error.flatten() };
  }
  const { data, error } = await supabase
    .from('medical_records')
    .insert({ ...parsed.data })
    .select()
    .single();
  if (error) {
    return { success: false, error: 'DB_ERROR', message: error.message };
  }
  revalidatePath('/dashboard/medical-records');
  return { success: true, data };
}

export async function updateMedicalRecordAction(
  id: string,
  input: unknown
): Promise<ActionResponse<MedicalRecord>> {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'AUTH_ERROR' };
  }
  const parsed = updateMedicalRecordSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'VALIDATION_ERROR', details: parsed.error.flatten() };
  }
  const { data, error } = await supabase
    .from('medical_records')
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) {
    return { success: false, error: 'DB_ERROR', message: error.message };
  }
  revalidatePath('/dashboard/medical-records');
  return { success: true, data };
}

export async function deleteMedicalRecordAction(id: string): Promise<ActionResponse> {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'AUTH_ERROR' };
  }
  const { error } = await supabase
    .from('medical_records')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id);
  if (error) {
    return { success: false, error: 'DB_ERROR', message: error.message };
  }
  revalidatePath('/dashboard/medical-records');
  return { success: true };
}
