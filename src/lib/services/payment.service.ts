import { createSupabaseClient } from '@/lib/supabase/server';
import { SettingsService } from './settings.service';
import type { PaymentSettings, PaymentMethod } from '@/types';

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
}
