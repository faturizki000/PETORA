import { BaseEntity, UUID, Timestamp } from './base';

export type AppointmentStatus = 'SCHEDULED' | 'WAITING' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED' | 'NO_SHOW';

export interface Appointment extends BaseEntity {
  branch_id: UUID | null;
  customer_id: UUID;
  pet_id: UUID;
  doctor_id: UUID | null;
  appointment_date: string;
  appointment_time: string;
  duration_minutes: number;
  queue_number: number | null;
  status: AppointmentStatus;
  appointment_type: string | null;
  complaint: string | null;
  notes: string | null;
  is_from_portal: boolean;
  check_in_at: Timestamp | null;
  check_out_at: Timestamp | null;
  cancellation_reason: string | null;
}
