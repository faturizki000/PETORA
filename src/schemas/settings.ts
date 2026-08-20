import { z } from 'zod';
import { uuidSchema, dateSchema } from './base';

export const operatingHoursSchema = z.object({
  open: z.string().regex(/^\d{2}:\d{2}$/),
  close: z.string().regex(/^\d{2}:\d{2}$/),
  days: z.array(z.number().min(1).max(7)).min(1),
  is_24h: z.boolean().optional(),
});

export const storeSettingsSchema = z.object({
  store_name: z.string().min(1).max(100),
  address: z.string().max(500),
  phone: z.string().max(20),
  email: z.string().email().max(100),
  logo_url: z.string().url().optional().or(z.literal('')),
  operating_hours: operatingHoursSchema,
  timezone: z.string().default('Asia/Jakarta'),
  currency: z.string().default('IDR'),
  language: z.string().default('id'),
  google_maps_url: z.string().url().optional().or(z.literal('')),
});

export const taxSettingsSchema = z.object({
  ppn_enabled: z.boolean(),
  ppn_rate: z.number().min(0).max(100),
  pph_enabled: z.boolean(),
  pph_rate: z.number().min(0).max(100),
  inclusive: z.boolean(),
  tax_id_number: z.string().optional(),
});

export const paymentSettingsSchema = z.object({
  methods: z.array(z.enum(['CASH', 'QRIS', 'TRANSFER', 'E_WALLET', 'CREDIT_CARD', 'DEBIT_CARD', 'GIFT_CARD', 'LOYALTY_POINTS', 'MIXED', 'OTHER'])),
  gateway_enabled: z.boolean(),
  gateway_provider: z.enum(['manual', 'midtrans', 'xendit', '']).default('manual'),
  gateway_config: z.object({
    server_key: z.string().optional(),
    client_key: z.string().optional(),
    merchant_id: z.string().optional(),
    is_production: z.boolean().optional(),
  }).optional(),
  manual_payment_instructions: z.object({
    bank_name: z.string().optional(),
    account_number: z.string().optional(),
    account_holder: z.string().optional(),
    qr_image_url: z.string().url().optional().or(z.literal('')),
  }).optional(),
  split_payment: z.boolean(),
  partial_payment: z.boolean(),
});

export const notificationSettingsSchema = z.object({
  whatsapp_enabled: z.boolean(),
  email_enabled: z.boolean(),
  sms_enabled: z.boolean(),
  push_enabled: z.boolean(),
  appointment_reminder: z.boolean(),
  vaccination_reminder: z.boolean(),
  grooming_reminder: z.boolean(),
  hotel_reminder: z.boolean(),
  payment_reminder: z.boolean(),
  promotion_broadcast: z.boolean(),
});

export const loyaltySettingsSchema = z.object({
  enabled: z.boolean(),
  points_per_rupiah: z.number().int().positive(),
  point_value: z.number().positive(),
  expiry_months: z.number().int().min(1).max(120),
  birthday_bonus: z.boolean(),
  referral_bonus: z.number().int().nonnegative(),
});

export const updateSettingSchema = z.object({
  key: z.string().min(1),
  value: z.any(),
});

export const updateSettingsBatchSchema = z.object({
  updates: z.array(updateSettingSchema).min(1),
});
