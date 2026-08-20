export type CustomerTag = 'VIP' | 'REGULAR' | 'NEW' | 'BLACKLIST' | 'WHOLESALE' | 'BREEDER';

export interface Customer extends SoftDeletable {
  branch_id: UUID | null;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  emergency_contact: string | null;
  emergency_phone: string | null;
  photo_url: string | null;
  notes: string | null;
  is_guest: boolean;
  tags: CustomerTag[];
  custom_fields: Record<string, any>;
  referred_by: UUID | null;
  referral_code: string | null;
  birth_date: string | null;
  gender: string | null;
  is_active: boolean;
}
