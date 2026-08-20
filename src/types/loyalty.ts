export type LoyaltyTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';

export interface LoyaltyMember {
  id: string;
  customer_id: string;
  tier_id: string | null;
  total_points: number;
  available_points: number;
  total_spending: number;
  created_at: string;
  updated_at: string;
}

export interface LoyaltyTierConfig {
  id: string;
  name: string;
  min_points: number;
  min_spending: number;
  benefits: Record<string, unknown>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type LoyaltyTransactionType = 'EARN' | 'REDEEM' | 'ADJUSTMENT' | 'REFERRAL_BONUS' | 'EXPIRED';

export interface LoyaltyTransaction {
  id: string;
  member_id: string;
  transaction_type: LoyaltyTransactionType;
  points: number;
  description: string;
  expiry_date: string | null;
  invoice_id: string | null;
  created_by: string | null;
  created_at: string;
}
