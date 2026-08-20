import { z } from 'zod';
import { uuidSchema, dateSchema } from './base';

export const createPetSchema = z.object({
  customer_id: uuidSchema,
  name: z.string().min(1).max(100),
  species: z.string().min(1).max(50),
  breed: z.string().max(50).optional(),
  birth_date: dateSchema.optional(),
  gender: z.enum(['male', 'female', 'unknown']).optional(),
  color: z.string().max(50).optional(),
  photo_url: z.string().url().optional(),
  microchip_number: z.string().max(50).optional(),
  pedigree_number: z.string().max(50).optional(),
  temperament: z.string().optional(),
  special_needs: z.string().optional(),
  diet_notes: z.string().optional(),
  behavior_notes: z.string().optional(),
  custom_fields: z.record(z.any()).optional(),
  is_neutered: z.boolean().default(false),
});
