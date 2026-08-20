import { createSupabaseClient } from '@/lib/supabase/server';
import { SettingsService } from './settings.service';
import type { PaymentSettings, PaymentMethod, Payment, PaginatedResponse } from '@/types';

export class PaymentService {
  static async getAvailableMethods(): Promise<PaymentMethod[]> {
    const settings = await SettingsService.getValue<PaymentSettings>('payment.settings');
    return settings?.methods ?? ['CASH'];
  }

  static async isGatewayEnabled(): Promise<boolean> {
    const settings = await SettingsService.getValue<PaymentSettings>('payment.settings');
    return settings?.gateway_enabled ?? false;
  }

  static async getManualInstructions() {
    const settings = await SettingsService.getValue<PaymentSettings>('payment.settings');
    return settings?.manual_payment_instructions ?? null;
  }

  static async calculatePaymentStatus(invoiceId: string): Promise<{
    total_paid: number;
    total_amount: number;
    status: 'UNPAID' | 'PARTIAL_PAYMENT' | 'PAID';
  }> {
    const supabase = await createSupabaseClient();

    const { data: payments } = await supabase
      .from('payments')
      .select('amount')
      .eq('invoice_id', invoiceId)
      .eq('payment_status', 'VERIFIED');

    const { data: invoice } = await supabase
      .from('invoices')
      .select('total_amount')
      .eq('id', invoiceId)
      .single();

    const total_paid = payments?.reduce((sum, p) => sum + p.amount, 0) ?? 0;
    const total_amount = invoice?.total_amount ?? 0;

    let status: 'UNPAID' | 'PARTIAL_PAYMENT' | 'PAID' = 'UNPAID';
    if (total_paid >= total_amount) status = 'PAID';
    else if (total_paid > 0) status = 'PARTIAL_PAYMENT';

    return { total_paid, total_amount, status };
  }

  static async list(params: {
    page?: number;
    limit?: number;
    status?: string;
    payment_method?: string;
    invoice_id?: string;
  }): Promise<PaginatedResponse<Payment>> {
    const supabase = await createSupabaseClient();
    const { page = 1, limit = 20, status, payment_method, invoice_id } = params;

    let query = supabase
      .from('payments')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (status) query = query.eq('payment_status', status);
    if (payment_method) query = query.eq('payment_method', payment_method);
    if (invoice_id) query = query.eq('invoice_id', invoice_id);

    const { data, error, count } = await query;
    if (error) throw error;

    return {
      data: data as Payment[],
      total: count ?? 0,
      page,
      limit,
      totalPages: Math.ceil((count ?? 0) / limit),
    };
  }

  static async getById(id: string): Promise<Payment | null> {
    const supabase = await createSupabaseClient();
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('id', id)
      .single();
    if (error) return null;
    return data as Payment;
  }

  static async getByInvoice(invoiceId: string): Promise<Payment[]> {
    const supabase = await createSupabaseClient();
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('invoice_id', invoiceId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []) as Payment[];
  }

  static async getPending(invoiceId?: string): Promise<Payment[]> {
    const supabase = await createSupabaseClient();
    let query = supabase
      .from('payments')
      .select('*')
      .eq('payment_status', 'PENDING')
      .order('created_at', { ascending: false });
    if (invoiceId) query = query.eq('invoice_id', invoiceId);
    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as Payment[];
  }
}
