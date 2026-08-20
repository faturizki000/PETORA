export type UUID = string;
export type Timestamp = string;

export interface BaseEntity {
  id: UUID;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface SoftDeletable extends BaseEntity {
  deleted_at: Timestamp | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ActionResponse<T = void> {
  success: boolean;
  data?: T;
  error?: 'VALIDATION_ERROR' | 'DB_ERROR' | 'AUTH_ERROR' | 'FORBIDDEN' | 'NOT_FOUND' | 'SETTINGS_ERROR' | 'PAYMENT_ERROR' | 'UNKNOWN';
  message?: string;
  details?: Record<string, any>;
}
