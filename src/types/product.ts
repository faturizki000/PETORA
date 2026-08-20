import { BaseEntity, SoftDeletable, UUID } from './base';

export interface Product extends SoftDeletable {
  branch_id: UUID | null;
  sku: string;
  name: string;
  category_id: UUID | null;
  supplier_id: UUID | null;
  barcode: string | null;
  description: string | null;
  purchase_price: number;
  selling_price: number;
  wholesale_price: number | null;
  cost_price: number | null;
  stock_quantity: number;
  stock_minimum: number;
  stock_maximum: number;
  reorder_point: number;
  reorder_quantity: number;
  photo_url: string | null;
  photo_urls: string[];
  expiry_date: string | null;
  batch_number: string | null;
  unit: string | null;
  weight_kg: number | null;
  dimensions: Record<string, unknown> | null;
  is_serialized: boolean;
  is_batch_tracked: boolean;
  is_active: boolean;
  status: 'ACTIVE' | 'ARCHIVED';
  custom_fields: Record<string, unknown>;
}

export interface Category extends BaseEntity {
  name: string;
  description: string | null;
  parent_id: UUID | null;
  photo_url: string | null;
  is_active: boolean;
}

export interface Supplier extends BaseEntity {
  name: string;
  contact_person: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  notes: string | null;
  lead_time_days: number | null;
  payment_terms: number | null;
  rating: number | null;
  is_active: boolean;
}
