import { z } from 'zod';
import { uuidSchema } from './base';

export const manualPaymentSchema = z.object({
  invoice_id: uuidSchema,
  payment_method: z.enum(['CASH', 'QRIS', 'TRANSFER', 'E_WALLET', 'DEBIT_CARD', 'CREDIT_CARD', 'GIFT_CARD', 'LOYALTY_POINTS', 'OTHER']),
  amount: z.number().positive(),
  reference_number: z.string().max(100).optional(),
  proof_url: z.string().url().optional(),
  notes: z.string().max(500).optional(),
});

export const verifyPaymentSchema = z.object({
  payment_id: uuidSchema,
  status: z.enum(['VERIFIED', 'REJECTED']),
  notes: z.string().optional(),
});

export const splitPaymentSchema = z.object({
  invoice_id: uuidSchema,
  payments: z.array(z.object({
    payment_method: z.enum(['CASH', 'QRIS', 'TRANSFER', 'E_WALLET', 'DEBIT_CARD', 'CREDIT_CARD', 'GIFT_CARD', 'LOYALTY_POINTS']),
    amount: z.number().positive(),
    reference_number: z.string().optional(),
    proof_url: z.string().url().optional(),
  })).min(2),
});

export const refundPaymentSchema = z.object({
  payment_id: uuidSchema,
  amount: z.number().positive(),
  reason: z.string().max(500),
});
