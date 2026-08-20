export type CampaignType = 'EMAIL' | 'SMS' | 'WHATSAPP' | 'PUSH' | 'BROADCAST';
export type CampaignStatus = 'DRAFT' | 'SCHEDULED' | 'SENDING' | 'SENT' | 'FAILED';

export interface Campaign {
  id: string;
  name: string;
  type: CampaignType;
  subject: string;
  content: string;
  status: CampaignStatus;
  scheduled_at: string | null;
  sent_at: string | null;
  total_recipients: number;
  successful_deliveries: number;
  failed_deliveries: number;
  open_rate: number | null;
  click_rate: number | null;
  segment_id: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Segment {
  id: string;
  name: string;
  description: string | null;
  criteria: Record<string, unknown>;
  total_customers: number;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Referral {
  id: string;
  referrer_id: string;
  referred_id: string;
  code: string;
  status: 'PENDING' | 'COMPLETED' | 'EXPIRED';
  reward_points: number | null;
  reward_amount: number | null;
  completed_at: string | null;
  created_at: string;
}
