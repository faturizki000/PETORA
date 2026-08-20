import { BaseEntity, UUID, Timestamp } from './base';

export type UserRole = 'OWNER' | 'ADMIN' | 'MANAGER' | 'DOKTER' | 'KASIR' | 'GROOMER' | 'COURIER' | 'CUSTOMER';

export interface User extends BaseEntity {
  branch_id: UUID | null;
  username: string;
  email: string | null;
  phone: string | null;
  pin_hash: string;
  role: UserRole;
  full_name: string;
  photo_url: string | null;
  customer_id: UUID | null;
  created_by: UUID | null;
  failed_login_attempts: number;
  locked_until: Timestamp | null;
  is_active: boolean;
  last_login_at: Timestamp | null;
  two_factor_enabled: boolean;
}
