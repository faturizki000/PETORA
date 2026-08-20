export type ExpenseStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID';

export interface ExpenseCategory {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Expense {
  id: string;
  branch_id: string | null;
  category: string;
  amount: number;
  description: string;
  expense_date: string;
  receipt_url: string | null;
  approved_by: string | null;
  status: ExpenseStatus;
  rejection_reason: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}
