export type InvoiceType = 'POS' | 'CLINICAL' | 'PET_HOTEL' | 'GROOMING' | 'MIXED' | 'SUBSCRIPTION' | 'TELEMEDICINE';
export type InvoiceStatus = 'DRAFT' | 'UNPAID' | 'PARTIAL_PAYMENT' | 'PAID' | 'CANCELLED' | 'REFUNDED';
export type PaymentMethod = 'CASH' | 'QRIS' | 'TRANSFER' | 'E_WALLET' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'GIFT_CARD' | 'LOYALTY_POINTS' | 'MIXED' | 'OTHER';
export type PaymentStatus = 'PENDING' | 'VERIFIED' | 'REJECTED' | 'EXPIRED' | 'REFUNDED';

export interface Invoice extends BaseEntity {
  invoice_number: string;
  branch_id: UUID | null;
  invoice_type: InvoiceType;
  customer_id: UUID | null;
  subtotal: number;
  discount_amount: number;
  discount_type: string | null;
  tax_amount: number;
  shipping_amount: number;
  total_amount: number;
  paid_amount: number;
  status: InvoiceStatus;
  promotion_id: UUID | null;
  gift_card_id: UUID | null;
  voucher_id: UUID | null;
  loyalty_points_earned: number;
  loyalty_points_redeemed: number;
  notes: string | null;
  due_date: string | null;
  created_by: UUID;
}

export interface InvoiceItem extends BaseEntity {
  invoice_id: UUID;
  item_type: string;
  product_id: UUID | null;
  procedure_id: UUID | null;
  pet_hotel_booking_id: UUID | null;
  grooming_booking_id: UUID | null;
  prescription_id: UUID | null;
  description: string;
  quantity: number;
  unit_price: number;
  discount_amount: number;
  tax_amount: number;
  total_price: number;
  batch_number: string | null;
  expiry_date: string | null;
}

export interface Payment extends BaseEntity {
  invoice_id: UUID;
  payment_method: PaymentMethod;
  amount: number;
  payment_status: PaymentStatus;
  proof_url: string | null;
  reference_number: string | null;
  gateway_transaction_id: string | null;
  gateway_response: Record<string, any> | null;
  gift_card_id: UUID | null;
  notes: string | null;
  verified_by: UUID | null;
  verified_at: Timestamp | null;
  created_by: UUID;
}
