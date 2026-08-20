export interface MedicalRecord extends SoftDeletable {
  record_number: string;
  branch_id: UUID | null;
  appointment_id: UUID;
  doctor_id: UUID;
  chief_complaint: string | null;
  history: string | null;
  physical_exam: string | null;
  weight_kg: number | null;
  temperature_c: number | null;
  heart_rate_bpm: number | null;
  respiratory_rate_bpm: number | null;
  diagnosis: string | null;
  diagnosis_code: string | null;
  treatment: string | null;
  prescription: string | null;
  lab_results: string | null;
  additional_notes: string | null;
  attachments: string[];
  status: 'OPEN' | 'CLOSED';
  signed_at: Timestamp | null;
  signature_url: string | null;
}
