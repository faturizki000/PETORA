'use server';
import { revalidatePath } from 'next/cache';
import { createSupabaseClient } from '@/lib/supabase/server';
import { createProductSchema } from '@/schemas/product';
import type { Product } from '@/types/product';
import type { ActionResponse } from '@/types/base';

export async function createProductAction(
  input: unknown
): Promise<ActionResponse<Product>> {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'AUTH_ERROR' };
  }
  const parsed = createProductSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'VALIDATION_ERROR', details: parsed.error.flatten() };
  }
  const { data, error } = await supabase
    .from('products')
    .insert({ ...parsed.data })
    .select()
    .single();
  if (error) {
    return { success: false, error: 'DB_ERROR', message: error.message };
  }
  revalidatePath('/dashboard/products');
  return { success: true, data };
}

export async function updateProductAction(
  id: string,
  input: unknown
): Promise<ActionResponse<Product>> {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'AUTH_ERROR' };
  }
  const parsed = createProductSchema.partial().safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'VALIDATION_ERROR', details: parsed.error.flatten() };
  }
  const { data, error } = await supabase
    .from('products')
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) {
    return { success: false, error: 'DB_ERROR', message: error.message };
  }
  revalidatePath('/dashboard/products');
  return { success: true, data };
}

export async function deleteProductAction(id: string): Promise<ActionResponse> {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'AUTH_ERROR' };
  }
  const { error } = await supabase
    .from('products')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id);
  if (error) {
    return { success: false, error: 'DB_ERROR', message: error.message };
  }
  revalidatePath('/dashboard/products');
  return { success: true };
}
