import { BaseEntity, UUID } from './base';
import { PaymentMethod } from './invoice';

export type SubscriptionStatus = 'ACTIVE' | 'PAUSED' | 'CANCELLED' | 'EXPIRED';

export interface Subscription extends BaseEntity {
  subscription_number: string;
  customer_id: UUID;
  plan_id: UUID;
  pet_id: UUID | null;
  status: SubscriptionStatus;
  start_date: string;
  end_date: string | null;
  next_billing_date: string | null;
  auto_renew: boolean;
  payment_method: PaymentMethod | null;
  notes: string | null;
}

export interface SubscriptionPlan extends BaseEntity {
  name: string;
  description: string | null;
  price: number;
  billing_cycle: string;
  features: Record<string, unknown>;
  is_active: boolean;
}
