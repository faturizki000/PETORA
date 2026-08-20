import { createSupabaseClient } from '@/lib/supabase/server';

export class UploadService {
  static async uploadFile(bucket: string, path: string, file: File) {
    const supabase = await createSupabaseClient();
    const { data, error } = await supabase.storage.from(bucket).upload(path, file);
    if (error) throw error;
    return data;
  }

  static async deleteFile(bucket: string, path: string) {
    const supabase = await createSupabaseClient();
    const { error } = await supabase.storage.from(bucket).remove([path]);
    if (error) throw error;
  }

  static getPublicUrl(bucket: string, path: string) {
    const { data } = createSupabaseClient().storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }
}
