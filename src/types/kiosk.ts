export interface Kiosk {
  id: string;
  branch_id: string;
  device_name: string;
  device_id: string;
  is_active: boolean;
  last_heartbeat: string | null;
  ip_address: string | null;
  created_at: string;
  updated_at: string;
}

export interface KioskSession {
  id: string;
  kiosk_id: string;
  session_token: string;
  customer_id: string | null;
  started_at: string;
  ended_at: string | null;
  actions_performed: number;
}
