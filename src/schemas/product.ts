import { z } from 'zod';
import { uuidSchema, dateSchema } from './base';

export const createProductSchema = z.object({
  sku: z.string().min(1).max(50),
  name: z.string().min(1).max(200),
  category_id: uuidSchema.nullable().optional(),
  supplier_id: uuidSchema.nullable().optional(),
  barcode: z.string().max(100).optional(),
  description: z.string().optional(),
  purchase_price: z.number().nonnegative(),
  selling_price: z.number().nonnegative(),
  wholesale_price: z.number().nonnegative().optional(),
  stock_quantity: z.number().int().nonnegative().default(0),
  stock_minimum: z.number().int().nonnegative().default(0),
  stock_maximum: z.number().int().nonnegative().default(0),
  reorder_point: z.number().int().nonnegative().default(0),
  reorder_quantity: z.number().int().nonnegative().default(0),
  photo_url: z.string().url().optional(),
  photo_urls: z.array(z.string().url()).optional(),
  expiry_date: dateSchema.optional(),
  batch_number: z.string().max(50).optional(),
  unit: z.string().max(20).optional(),
  weight_kg: z.number().nonnegative().optional(),
  dimensions: z.record(z.any()).optional(),
  is_serialized: z.boolean().default(false),
  is_batch_tracked: z.boolean().default(false),
  custom_fields: z.record(z.any()).optional(),
});
