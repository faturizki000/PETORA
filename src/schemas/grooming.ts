import { z } from 'zod';
import { uuidSchema, dateSchema } from './base';

export const groomingServiceCategorySchema = z.enum(['BASIC', 'PREMIUM', 'MEDICAL', 'SPECIAL']);

export const createGroomingServiceSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  category: groomingServiceCategorySchema.default('BASIC'),
  price: z.number().nonnegative(),
  duration_minutes: z.number().int().positive().default(60),
  is_active: z.boolean().default(true),
});

export const updateGroomingServiceSchema = createGroomingServiceSchema.partial();

export const createGroomingBookingSchema = z.object({
  service_id: uuidSchema,
  pet_id: uuidSchema,
  customer_id: uuidSchema,
  appointment_date: dateSchema,
  appointment_time: z.string().regex(/^\d{2}:\d{2}$/),
  status: z.enum(['SCHEDULED', 'IN_PROGRESS', 'DONE', 'CANCELLED']).default('SCHEDULED'),
  notes: z.string().optional(),
  branch_id: uuidSchema.nullable().optional(),
});

export const updateGroomingBookingSchema = createGroomingBookingSchema.partial();
