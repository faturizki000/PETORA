import { z } from 'zod';
import { uuidSchema, dateSchema } from './base';

export const invoiceTypeSchema = z.enum(['POS', 'CLINICAL', 'PET_HOTEL', 'GROOMING', 'MIXED', 'SUBSCRIPTION', 'TELEMEDICINE']);
export const paymentMethodSchema = z.enum(['CASH', 'QRIS', 'TRANSFER', 'E_WALLET', 'CREDIT_CARD', 'DEBIT_CARD', 'GIFT_CARD', 'LOYALTY_POINTS', 'MIXED', 'OTHER']);

export const invoiceItemSchema = z.object({
  item_type: z.string(),
  product_id: uuidSchema.nullable().optional(),
  procedure_id: uuidSchema.nullable().optional(),
  pet_hotel_booking_id: uuidSchema.nullable().optional(),
  grooming_booking_id: uuidSchema.nullable().optional(),
  prescription_id: uuidSchema.nullable().optional(),
  description: z.string().min(1).max(200),
  quantity: z.number().int().positive().default(1),
  unit_price: z.number().nonnegative(),
  discount_amount: z.number().nonnegative().default(0),
  tax_amount: z.number().nonnegative().default(0),
  batch_number: z.string().optional(),
  expiry_date: dateSchema.optional(),
});

export const createInvoiceSchema = z.object({
  invoice_type: invoiceTypeSchema,
  customer_id: uuidSchema.nullable().optional(),
  items: z.array(invoiceItemSchema).min(1),
  discount_amount: z.number().nonnegative().default(0),
  discount_type: z.enum(['percentage', 'fixed']).optional(),
  tax_amount: z.number().nonnegative().default(0),
  shipping_amount: z.number().nonnegative().default(0),
  promotion_id: uuidSchema.nullable().optional(),
  gift_card_id: uuidSchema.nullable().optional(),
  voucher_code: z.string().optional(),
  loyalty_points_to_redeem: z.number().int().nonnegative().default(0),
  notes: z.string().optional(),
  due_date: dateSchema.optional(),
});
