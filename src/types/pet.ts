import { SoftDeletable, UUID } from './base';

export interface Pet extends SoftDeletable {
  customer_id: UUID;
  name: string;
  species: string;
  breed: string | null;
  birth_date: string | null;
  gender: string | null;
  color: string | null;
  photo_url: string | null;
  microchip_number: string | null;
  pedigree_number: string | null;
  temperament: string | null;
  special_needs: string | null;
  diet_notes: string | null;
  behavior_notes: string | null;
  custom_fields: Record<string, unknown>;
  is_neutered: boolean;
  is_active: boolean;
}
