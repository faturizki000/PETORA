export type FeedbackCategory = 'SERVICE' | 'PRODUCT' | 'FACILITY' | 'STAFF' | 'DELIVERY' | 'GENERAL';
export type FeedbackStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export interface Feedback {
  id: string;
  customer_id: string | null;
  appointment_id: string | null;
  invoice_id: string | null;
  rating: number;
  category: FeedbackCategory | null;
  comment: string | null;
  is_anonymous: boolean;
  response: string | null;
  responded_by: string | null;
  responded_at: string | null;
  status: FeedbackStatus;
  created_by: string;
  created_at: string;
  updated_at: string;
}
