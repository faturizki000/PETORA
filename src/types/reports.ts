export type ReportType = 'SALES' | 'INVENTORY' | 'FINANCIAL' | 'CUSTOMER' | 'EMPLOYEE' | 'SERVICE';

export interface Report {
  id: string;
  type: ReportType;
  name: string;
  params: Record<string, unknown>;
  generated_by: string;
  generated_at: string;
  file_url: string | null;
}

export interface SalesReport {
  period_start: string;
  period_end: string;
  total_revenue: number;
  total_invoices: number;
  average_order_value: number;
  payment_methods: Record<string, number>;
  top_products: Array<{ product_name: string; total_sales: number }>;
}

export interface InventoryReport {
  period_start: string;
  period_end: string;
  total_products: number;
  low_stock_count: number;
  expired_count: number;
  total_value: number;
  turnover_rate: number;
}

export interface FinancialReport {
  period_start: string;
  period_end: string;
  total_revenue: number;
  total_expenses: number;
  gross_profit: number;
  net_profit: number;
  tax_amount: number;
  outstanding_receivables: number;
}
