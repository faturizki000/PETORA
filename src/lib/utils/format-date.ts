import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

export function formatDate(date: string | Date, pattern = 'dd MMMM yyyy'): string {
  return format(new Date(date), pattern, { locale: localeId });
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), 'dd MMMM yyyy HH:mm', { locale: localeId });
}

export function formatTime(date: string | Date): string {
  return format(new Date(date), 'HH:mm');
}
