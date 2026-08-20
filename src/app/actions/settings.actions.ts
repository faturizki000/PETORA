'use server';
import { revalidatePath } from 'next/cache';
import { createSupabaseClient } from '@/lib/supabase/server';
import { storeSettingsSchema, paymentSettingsSchema, updateSettingsBatchSchema } from '@/schemas/settings';
import type { ActionResponse } from '@/types/base';

export async function updateStoreSettingsAction(
  input: unknown
): Promise<ActionResponse> {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'AUTH_ERROR' };
  }
  const parsed = storeSettingsSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'VALIDATION_ERROR', details: parsed.error.flatten() };
  }
  const settingsEntries = Object.entries(parsed.data).map(([key, value]) => ({
    category: 'GENERAL',
    key,
    value,
    updated_by: user.id,
  }));
  const { error } = await supabase.from('settings').upsert(settingsEntries, {
    onConflict: 'category,key',
  });
  if (error) {
    return { success: false, error: 'SETTINGS_ERROR', message: error.message };
  }
  revalidatePath('/dashboard/settings');
  return { success: true, data: parsed.data };
}

export async function updatePaymentSettingsAction(
  input: unknown
): Promise<ActionResponse> {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'AUTH_ERROR' };
  }
  const parsed = paymentSettingsSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'VALIDATION_ERROR', details: parsed.error.flatten() };
  }
  const settingsEntries = Object.entries(parsed.data).map(([key, value]) => ({
    category: 'PAYMENT',
    key,
    value,
    updated_by: user.id,
  }));
  const { error } = await supabase.from('settings').upsert(settingsEntries, {
    onConflict: 'category,key',
  });
  if (error) {
    return { success: false, error: 'SETTINGS_ERROR', message: error.message };
  }
  revalidatePath('/dashboard/settings');
  return { success: true, data: parsed.data };
}

export async function updateSettingsBatchAction(
  input: unknown
): Promise<ActionResponse> {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'AUTH_ERROR' };
  }
  const parsed = updateSettingsBatchSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'VALIDATION_ERROR', details: parsed.error.flatten() };
  }
  const settingsEntries = parsed.data.updates.map((u) => ({
    ...u,
    updated_by: user.id,
  }));
  const { error } = await supabase.from('settings').upsert(settingsEntries, {
    onConflict: 'key',
  });
  if (error) {
    return { success: false, error: 'SETTINGS_ERROR', message: error.message };
  }
  revalidatePath('/dashboard/settings');
  return { success: true };
}
