import { z } from 'zod';
import { uuidSchema, dateSchema } from './base';

export const createExpenseSchema = z.object({
  branch_id: uuidSchema.nullable().optional(),
  category: z.string().min(1),
  amount: z.number().positive(),
  description: z.string().max(500),
  expense_date: dateSchema,
  receipt_url: z.string().url().optional(),
  approved_by: uuidSchema.nullable().optional(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).default('PENDING'),
});

export const expenseCategorySchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  color: z.string().optional(),
  is_active: z.boolean().default(true),
});
