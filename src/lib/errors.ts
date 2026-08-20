import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';
import type { ActionResponse } from '@/types';

export function handleActionResponse<T>(response: ActionResponse<T>) {
  if (response.success) {
    return { success: true, message: response.message ?? 'Operasi berhasil' };
  }
  const messages: Record<string, string> = {
    VALIDATION_ERROR: 'Data tidak valid, silakan periksa kembali',
    DB_ERROR: 'Gagal menyimpan data',
    AUTH_ERROR: 'Sesi berakhir, silakan login ulang',
    FORBIDDEN: 'Anda tidak memiliki akses',
    NOT_FOUND: 'Data tidak ditemukan',
    SETTINGS_ERROR: 'Gagal memuat pengaturan',
    PAYMENT_ERROR: 'Gagal memproses pembayaran',
    UNKNOWN: 'Terjadi kesalahan',
  };
  return { success: false, message: messages[response.error ?? 'UNKNOWN'], details: response.details };
}
