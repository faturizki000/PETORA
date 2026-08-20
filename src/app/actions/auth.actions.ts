'use server';
import bcrypt from 'bcryptjs';
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
    return { success: false, error: 'AUTH_ERROR', message: 'Invalid credentials' };
  }
  revalidatePath('/dashboard');
  return { success: true, data: data.user };
}

export async function logoutAction(): Promise<ActionResponse> {
  const supabase = await createSupabaseClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    return { success: false, error: 'AUTH_ERROR', message: 'Logout failed' };
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
  const pinHash = await bcrypt.hash(pin, 10);
  const { error } = await supabase
    .from('users')
    .update({ pin_hash: pinHash, updated_at: new Date().toISOString() })
    .eq('id', userId);
  if (error) {
    return { success: false, error: 'DB_ERROR', message: 'Failed to update PIN' };
  }
  revalidatePath('/dashboard/settings');
  return { success: true };
}

export async function verifyPinAction(
  username: string,
  pin: string
): Promise<ActionResponse<{ user: any }>> {
  const supabase = await createSupabaseClient();
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single();

  if (error || !user) {
    return { success: false, error: 'AUTH_ERROR', message: 'Invalid credentials' };
  }

  const isValid = await bcrypt.compare(pin, user.pin_hash);
  if (!isValid) {
    return { success: false, error: 'AUTH_ERROR', message: 'Invalid credentials' };
  }

  return { success: true, data: user };
}
