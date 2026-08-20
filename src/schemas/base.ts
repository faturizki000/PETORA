import { z } from 'zod';

export const uuidSchema = z.string().uuid();
export const timestampSchema = z.string().datetime();
export const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
export const timeSchema = z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/);
export const phoneSchema = z.string().regex(/^[+]?[0-9]{10,15}$/);
export const emailSchema = z.string().email();
