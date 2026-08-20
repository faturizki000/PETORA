export type PromotionType = 'PERCENTAGE' | 'FIXED' | 'BUY_X_GET_Y';
export type PromotionStatus = 'ACTIVE' | 'INACTIVE' | 'SCHEDULED' | 'EXPIRED';

export interface Promotion {
  id: string;
  name: string;
  description: string | null;
  code: string;
  discount_type: PromotionType;
  discount_value: number;
  min_purchase_amount: number | null;
  max_discount_amount: number | null;
  start_date: string;
  end_date: string;
  usage_limit: number | null;
  usage_count: number;
  applicable_products: string[];
  applicable_categories: string[];
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Voucher {
  id: string;
  code: string;
  name: string;
  description: string | null;
  discount_type: PromotionType;
  discount_value: number;
  min_purchase_amount: number | null;
  max_discount_amount: number | null;
  start_date: string;
  end_date: string;
  usage_limit: number | null;
  usage_count: number;
  applicable_products: string[];
  applicable_categories: string[];
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface GiftCard {
  id: string;
  code: string;
  initial_balance: number;
  current_balance: number;
  currency: string;
  expires_at: string | null;
  issued_to: string | null;
  issued_by: string | null;
  is_active: boolean;
  notes: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}
