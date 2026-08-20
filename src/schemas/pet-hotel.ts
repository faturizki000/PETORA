import { z } from 'zod';
import { uuidSchema, dateSchema } from './base';

export const roomStatusSchema = z.enum(['AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'RESERVED']);

export const createRoomSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  capacity: z.number().int().positive().default(1),
  price_per_night: z.number().nonnegative(),
  amenities: z.array(z.string()).default([]),
  status: roomStatusSchema.default('AVAILABLE'),
  branch_id: uuidSchema.nullable().optional(),
});

export const updateRoomSchema = createRoomSchema.partial();

export const createPetHotelBookingSchema = z.object({
  room_id: uuidSchema,
  pet_id: uuidSchema,
  customer_id: uuidSchema,
  check_in_date: dateSchema,
  check_out_date: dateSchema,
  status: z.enum(['PENDING', 'CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED']).default('PENDING'),
  notes: z.string().optional(),
  special_requirements: z.string().optional(),
  branch_id: uuidSchema.nullable().optional(),
});

export const updatePetHotelBookingSchema = createPetHotelBookingSchema.partial();
