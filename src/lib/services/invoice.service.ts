import { createSupabaseClient } from '@/lib/supabase/server';
import type { Invoice, CreateInvoiceInput, PaginatedResponse } from '@/types';
import type { InvoiceItem } from '@/types/invoice';

export class InvoiceService {
  static async list(params: {
    page?: number;
    limit?: number;
    status?: string;
    customer_id?: string;
    branch_id?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<PaginatedResponse<Invoice>> {
    const supabase = await createSupabaseClient();
    const { page = 1, limit = 20, status, customer_id, branch_id, start_date, end_date } = params;

    let query = supabase
      .from('invoices')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (status) query = query.eq('status', status);
    if (customer_id) query = query.eq('customer_id', customer_id);
    if (branch_id) query = query.eq('branch_id', branch_id);
    if (start_date) query = query.gte('created_at', start_date);
    if (end_date) query = query.lte('created_at', end_date);

    const { data, error, count } = await query;
    if (error) throw error;

    return {
      data: data as Invoice[],
      total: count ?? 0,
      page,
      limit,
      totalPages: Math.ceil((count ?? 0) / limit),
    };
  }

  static async getById(id: string): Promise<Invoice | null> {
    const supabase = await createSupabaseClient();
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', id)
      .single();
    if (error) return null;
    return data as Invoice;
  }

  static async getItems(invoiceId: string): Promise<InvoiceItem[]> {
    const supabase = await createSupabaseClient();
    const { data, error } = await supabase
      .from('invoice_items')
      .select('*')
      .eq('invoice_id', invoiceId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return (data || []) as InvoiceItem[];
  }

  static async getByNumber(invoiceNumber: string): Promise<Invoice | null> {
    const supabase = await createSupabaseClient();
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('invoice_number', invoiceNumber)
      .maybeSingle();
    if (error) return null;
    return data as Invoice;
  }

  static async create(input: CreateInvoiceInput, userId: string): Promise<Invoice> {
    const supabase = await createSupabaseClient();
    const invoiceNumber = generateInvoiceNumber(input.invoice_type);

    const { data, error } = await supabase
      .from('invoices')
      .insert({
        ...input,
        invoice_number: invoiceNumber,
        created_by: userId,
      })
      .select()
      .single();
    if (error) throw error;
    return data as Invoice;
  }
}

function generateInvoiceNumber(type: string): string {
  const prefix: Record<string, string> = {
    POS: 'INV', CLINICAL: 'MED', PET_HOTEL: 'HTL', GROOMING: 'GRM',
    MIXED: 'MIX', SUBSCRIPTION: 'SUB', TELEMEDICINE: 'TLM',
  };
  const p = prefix[type] ?? 'INV';
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${p}-${date}-${random}`;
}
