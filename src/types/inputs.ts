import { z } from 'zod';
import { createCustomerSchema } from '@/schemas/customer';
import { createInvoiceSchema } from '@/schemas/invoice';
import { manualPaymentSchema, verifyPaymentSchema, splitPaymentSchema } from '@/schemas/payment';
import { storeSettingsSchema, paymentSettingsSchema } from '@/schemas/settings';
import { createPetSchema } from '@/schemas/pet';
import { createAppointmentSchema } from '@/schemas/appointment';
import type { MedicalRecord } from './medical-record';
import type { Prescription } from './prescription';
import type { SoftDeletable, BaseEntity } from './base';

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
export type CreatePetInput = z.infer<typeof createPetSchema>;
export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type ManualPaymentInput = z.infer<typeof manualPaymentSchema>;
export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>;
export type SplitPaymentInput = z.infer<typeof splitPaymentSchema>;
export type StoreSettingsInput = z.infer<typeof storeSettingsSchema>;
export type PaymentSettingsInput = z.infer<typeof paymentSettingsSchema>;

export type CreateMedicalRecordInput = Omit<MedicalRecord, keyof SoftDeletable>;
export type CreatePrescriptionInput = Omit<Prescription, keyof BaseEntity>;
