import { z } from 'zod';
import { uuidSchema, dateSchema } from './base';

export const customerTagSchema = z.enum(['VIP', 'REGULAR', 'NEW', 'BLACKLIST', 'WHOLESALE', 'BREEDER']);

export const createCustomerSchema = z.object({
  name: z.string().min(1).max(100),
  phone: z.string().max(20).optional(),
  email: z.string().email().max(100).optional(),
  address: z.string().optional(),
  city: z.string().max(100).optional(),
  postal_code: z.string().max(10).optional(),
  emergency_contact: z.string().max(100).optional(),
  emergency_phone: z.string().max(20).optional(),
  photo_url: z.string().url().optional(),
  notes: z.string().optional(),
  is_guest: z.boolean().default(false),
  tags: z.array(customerTagSchema).default([]),
  custom_fields: z.record(z.any()).optional(),
  referred_by: uuidSchema.optional(),
  birth_date: dateSchema.optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  id_number: z.string().max(50).optional(),
  create_account: z.boolean().default(false),
  username: z.string().min(3).max(50).optional(),
  pin: z.string().length(6).regex(/^\d+$/).optional(),
});
