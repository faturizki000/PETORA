import { z } from 'zod';
import { uuidSchema, dateSchema } from './base';

export const appointmentStatusSchema = z.enum(['SCHEDULED', 'WAITING', 'IN_PROGRESS', 'DONE', 'CANCELLED', 'NO_SHOW']);

export const createAppointmentSchema = z.object({
  customer_id: uuidSchema,
  pet_id: uuidSchema,
  doctor_id: uuidSchema.nullable().optional(),
  appointment_date: dateSchema,
  appointment_time: z.string().regex(/^\d{2}:\d{2}$/),
  duration_minutes: z.number().int().positive().default(30),
  appointment_type: z.enum(['consultation', 'vaccination', 'grooming', 'surgery', 'checkup', 'emergency']).optional(),
  complaint: z.string().optional(),
  notes: z.string().optional(),
  is_from_portal: z.boolean().default(false),
});
