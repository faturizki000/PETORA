import { BaseEntity, UUID, Timestamp } from './base';

export type DeliveryStatus = 'PENDING' | 'ASSIGNED' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED' | 'FAILED' | 'CANCELLED';

export interface Delivery extends BaseEntity {
  delivery_number: string;
  invoice_id: UUID;
  customer_id: UUID;
  courier_id: UUID | null;
  delivery_address: string;
  delivery_zone_id: UUID | null;
  delivery_fee: number | null;
  status: DeliveryStatus;
  scheduled_at: Timestamp | null;
  picked_up_at: Timestamp | null;
  delivered_at: Timestamp | null;
  failed_reason: string | null;
  notes: string | null;
  proof_photo_url: string | null;
  signature_url: string | null;
  tracking_number: string | null;
}

export interface DeliveryZone extends BaseEntity {
  branch_id: UUID | null;
  name: string;
  postal_codes: string[];
  fee: number;
  estimated_time_minutes: number | null;
  is_active: boolean;
}
