import { z } from 'zod';
import { uuidSchema, dateSchema } from './base';

export const createSubscriptionSchema = z.object({
  customer_id: uuidSchema,
  plan_id: uuidSchema,
  pet_id: uuidSchema.nullable().optional(),
  status: z.enum(['ACTIVE', 'PAUSED', 'CANCELLED', 'EXPIRED']).default('ACTIVE'),
  start_date: dateSchema,
  end_date: dateSchema.nullable().optional(),
  next_billing_date: dateSchema.nullable().optional(),
  auto_renew: z.boolean().default(true),
  payment_method: z.enum(['CASH', 'QRIS', 'TRANSFER', 'E_WALLET', 'CREDIT_CARD', 'DEBIT_CARD', 'GIFT_CARD', 'LOYALTY_POINTS', 'MIXED', 'OTHER']).nullable().optional(),
  notes: z.string().optional(),
});

export const subscriptionPlanSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  price: z.number().positive(),
  billing_cycle: z.string().min(1),
  features: z.record(z.any()).optional(),
  is_active: z.boolean().default(true),
});
