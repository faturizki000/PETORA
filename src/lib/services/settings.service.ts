import { createSupabaseClient } from '@/lib/supabase/server';
import type { Setting, SettingCategory, StoreSettings, PaymentSettings } from '@/types';
import { DEFAULT_SETTINGS } from '@/lib/constants/default-settings';

export class SettingsService {
  static async getAll(): Promise<Setting[]> {
    const supabase = await createSupabaseClient();
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .order('category')
      .order('key');
    if (error) throw error;
    return data as Setting[];
  }

  static async getByCategory(category: SettingCategory): Promise<Setting[]> {
    const supabase = await createSupabaseClient();
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('category', category);
    if (error) throw error;
    return data as Setting[];
  }

  static async getValue<T>(key: string): Promise<T> {
    const supabase = await createSupabaseClient();
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', key)
      .maybeSingle();
    if (error) throw error;
    if (!data && DEFAULT_SETTINGS[key as keyof typeof DEFAULT_SETTINGS]) {
      return DEFAULT_SETTINGS[key as keyof typeof DEFAULT_SETTINGS].value as T;
    }
    return data?.value as T;
  }

  static async getPublicSettings(): Promise<Record<string, any>> {
    const supabase = await createSupabaseClient();
    const { data, error } = await supabase
      .from('settings')
      .select('key, value')
      .eq('is_public', true);
    if (error) throw error;
    return data.reduce((acc, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {} as Record<string, any>);
  }

  static async update(key: string, value: any, updatedBy: string): Promise<void> {
    const supabase = await createSupabaseClient();
    const { error } = await supabase
      .from('settings')
      .upsert(
        { key, value, updated_by: updatedBy, updated_at: new Date().toISOString() },
        { onConflict: 'key' }
      );
    if (error) throw error;
  }

  static async updateBatch(
    updates: Array<{ key: string; value: any }>,
    updatedBy: string
  ): Promise<void> {
    const supabase = await createSupabaseClient();
    for (const { key, value } of updates) {
      await supabase
        .from('settings')
        .upsert(
          { key, value, updated_by: updatedBy, updated_at: new Date().toISOString() },
          { onConflict: 'key' }
        );
    }
  }

  static async seedDefaults(): Promise<void> {
    const supabase = await createSupabaseClient();
    const { count } = await supabase
      .from('settings')
      .select('*', { count: 'exact', head: true });
    if (count && count > 0) return;

    const defaults = Object.entries(DEFAULT_SETTINGS).map(([key, config]) => ({
      category: key.split('.')[0].toUpperCase() as SettingCategory,
      key,
      value: config.value,
      description: config.description,
      is_public: config.is_public ?? false,
    }));
    const { error } = await supabase.from('settings').insert(defaults);
    if (error) throw error;
  }
}
