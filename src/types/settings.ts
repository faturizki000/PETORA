import { BaseEntity, UUID, Timestamp } from './base';
import { PaymentMethod } from './invoice';

export interface Branch extends BaseEntity {
  name: string;
  code: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  logo_url: string | null;
  operating_hours: Record<string, unknown> | null;
  is_active: boolean;
  is_headquarter: boolean;
}

export interface Setting {
  id: UUID;
  category: string;
  key: string;
  value: unknown;
  description: string | null;
  is_public: boolean;
  updated_at: Timestamp;
  updated_by: UUID | null;
}

export type SettingCategory = 
  | 'GENERAL'
  | 'TAX'
  | 'LOYALTY'
  | 'NOTIFICATION'
  | 'PAYMENT'
  | 'PRINTER'
  | 'REMINDER'
  | 'RECEIPT'
  | 'SECURITY'
  | 'INTEGRATION'
  | 'BACKUP'
  | 'EMPLOYEE'
  | 'SUBSCRIPTION'
  | 'DELIVERY'
  | 'INVENTORY'
  | 'CUSTOM_FIELD'
  | 'ADVANCED';

export type StoreSettings = {
  store_name: string;
  address: string;
  phone: string;
  email: string;
  logo_url: string;
  operating_hours: { open: string; close: string; days: number[] };
  timezone: string;
  currency: string;
  language: string;
  google_maps_url: string;
};

export type PaymentSettings = {
  methods: PaymentMethod[];
  gateway_enabled: boolean;
  gateway_provider: string;
  gateway_config: Record<string, unknown>;
  manual_payment_instructions: {
    bank_name: string;
    account_number: string;
    account_holder: string;
    qr_image_url: string;
  };
  split_payment: boolean;
  partial_payment: boolean;
};

export type LoyaltySettings = {
  enabled: boolean;
  points_per_rupiah: number;
  point_value: number;
  expiry_months: number;
  birthday_bonus: boolean;
  referral_bonus: number;
};
