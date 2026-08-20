import { BaseEntity, UUID, Timestamp } from './base';

export type TelemedicineStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';

export interface TelemedicineSession extends BaseEntity {
  session_number: string;
  customer_id: UUID;
  pet_id: UUID;
  doctor_id: UUID;
  scheduled_at: Timestamp;
  duration_minutes: number;
  status: TelemedicineStatus;
  meeting_url: string | null;
  meeting_id: string | null;
  notes: string | null;
  recording_url: string | null;
  fee: number | null;
}
