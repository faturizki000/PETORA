'use server';
import { revalidatePath } from 'next/cache';
import { createSupabaseClient } from '@/lib/supabase/server';
import type { ActionResponse } from '@/types/base';

export async function loginAction(
  email: string,
  password: string
): Promise<ActionResponse> {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    return { success: false, error: 'AUTH_ERROR', message: error.message };
  }
  revalidatePath('/dashboard');
  return { success: true, data: data.user };
}

export async function logoutAction(): Promise<ActionResponse> {
  const supabase = await createSupabaseClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    return { success: false, error: 'AUTH_ERROR', message: error.message };
  }
  revalidatePath('/dashboard');
  return { success: true };
}

export async function updatePinAction(
  userId: string,
  pin: string
): Promise<ActionResponse> {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'AUTH_ERROR' };
  }
  const { error } = await supabase
    .from('users')
    .update({ pin_hash: pin, updated_at: new Date().toISOString() })
    .eq('id', userId);
  if (error) {
    return { success: false, error: 'DB_ERROR', message: error.message };
  }
  revalidatePath('/dashboard/settings');
  return { success: true };
}
