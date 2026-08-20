export interface Prescription extends BaseEntity {
  prescription_number: string;
  medical_record_id: UUID;
  doctor_id: UUID;
  customer_id: UUID;
  pet_id: UUID;
  status: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  instructions: string | null;
  dosage: string | null;
  duration_days: number | null;
  refills_allowed: number;
  refills_used: number;
  signed_at: Timestamp | null;
  signature_url: string | null;
  valid_until: string | null;
}
