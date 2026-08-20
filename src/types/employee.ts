export interface Employee {
  id: string;
  branch_id: string | null;
  username: string;
  email: string | null;
  phone: string | null;
  pin_hash: string;
  role: string;
  full_name: string;
  photo_url: string | null;
  customer_id: string | null;
  created_by: string | null;
  failed_login_attempts: number;
  locked_until: string | null;
  is_active: boolean;
  last_login_at: string | null;
  two_factor_enabled: boolean;
  hire_date: string | null;
  salary: number | null;
  address: string | null;
  emergency_contact: string | null;
  created_at: string;
  updated_at: string;
}

export interface CommissionRule {
  id: string;
  name: string;
  description: string | null;
  employee_id: string;
  commission_type: 'PERCENTAGE' | 'FIXED';
  commission_value: number;
  applicable_services: string[];
  applicable_products: string[];
  min_amount: number | null;
  max_amount: number | null;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CommissionCalculation {
  id: string;
  employee_id: string;
  start_date: string;
  end_date: string;
  total_sales: number;
  commission_amount: number;
  calculated_by: string;
  calculated_at: string;
}

export interface PerformanceMetric {
  employee_id: string;
  period_start: string;
  period_end: string;
  total_appointments: number;
  total_services: number;
  total_sales: number;
  customer_rating: number | null;
  attendance_rate: number | null;
}
