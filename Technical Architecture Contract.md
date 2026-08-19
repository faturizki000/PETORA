# Technical Architecture Contract — Baseline Final
## Petora — Sistem Manajemen Terpadu Petshop & Petcare
**Stack: Next.js 16 + Tailwind v4 + shadcn/ui + Supabase + Vercel**
**Dokumen Final | 19 Agustus 2026**

---

## 1. Ringkasan Eksekutif

**Petora** adalah sistem manajemen terpadu untuk Petshop & Petcare yang mengintegrasikan seluruh operasional bisnis dalam satu platform modern, owner-configurable, dan siap multi-cabang.

### Stack Final

| Layer | Teknologi |
|---|---|
| **Frontend** | Next.js 16 (App Router) + TypeScript strict |
| **Styling** | Tailwind CSS v4 (CSS-first) |
| **Components** | shadcn/ui + Radix Primitives |
| **Backend** | Supabase (PostgreSQL + Auth + RLS + Storage + Realtime) |
| **Runtime Backend** | Deno (Edge Functions) |
| **Deployment** | Vercel (Edge Network) |
| **State Client** | Zustand + TanStack Query |
| **Validation** | Zod |
| **Forms** | React Hook Form |
| **Charts** | Recharts |
| **PDF** | @react-pdf/renderer |
| **Barcode/QR** | react-qr-code + jsbarcode |
| **i18n** | next-intl |

### Prinsip Arsitektur

| Prinsip | Implementasi |
|---|---|
| **No Node.js Backend** | Semua backend di Supabase (Postgres + RLS + Edge Functions Deno) |
| **Server-First** | Server Components default, Client Components hanya bila perlu |
| **Server Actions** | Semua mutasi via Server Actions — no REST API |
| **RLS as Source of Truth** | Otorisasi utama di level database |
| **Owner-Configurable** | Semua setting bisa diatur Owner dari dashboard |
| **Payment Flexible** | Manual payment default, gateway optional |
| **Automated Setup** | One-command setup, zero manual config |
| **Type-safe End-to-End** | TypeScript strict + Zod + generated DB types |
| **Offline-First** | PWA support dengan service worker |
| **Accessibility** | WCAG 2.1 AA compliant |

---

## 2. Arsitektur Sistem End-to-End

### 2.1 Arsitektur High-Level

```
┌─────────────────────────────────────────────────────────────────┐
│                  Vercel Edge Network                             │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │            Next.js 16 App Router                           │  │
│  │  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐│  │
│  │  │ Server         │  │ Client         │  │ Server       ││  │
│  │  │ Components     │  │ Components     │  │ Actions      ││  │
│  │  └────────────────┘  └────────────────┘  └──────────────┘│  │
│  │  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐│  │
│  │  │ Middleware     │  │ shadcn/ui      │  │ Tailwind v4  ││  │
│  │  └────────────────┘  └────────────────┘  └──────────────┘│  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Supabase Platform                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ PostgreSQL   │  │ Auth         │  │ Storage              │  │
│  │ + RLS        │  │ (Sessions)   │  │ (File Uploads)       │  │
│  │ + Settings   │  │              │  │                      │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│  ┌──────────────┐  ┌──────────────────────────────────────┐    │
│  │ Realtime     │  │ Edge Functions (Deno) — OPTIONAL     │    │
│  │ (WebSocket)  │  │ - WhatsApp (Fonnte)                  │    │
│  │              │  │ - Email (Resend)                     │    │
│  │              │  │ - Payment Gateway (Midtrans)         │    │
│  │              │  │ - PDF Generation                     │    │
│  │              │  │ - Scheduled Tasks                    │    │
│  └──────────────┘  └──────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Routing Structure

```
app/
├── (auth)/
│   ├── login/page.tsx
│   ├── forgot-password/page.tsx
│   └── layout.tsx
├── (dashboard)/
│   ├── layout.tsx                    # Sidebar + Header
│   ├── page.tsx                      # Dashboard home
│   ├── customers/                    # CRUD customers + referral
│   ├── pets/                         # CRUD pets + passport
│   ├── appointments/                 # Calendar + queue
│   ├── medical-records/              # Records + prescriptions + labs
│   ├── pet-hotel/                    # Rooms + bookings + logs
│   ├── grooming/                     # Services + bookings + records
│   ├── products/                     # Products + categories + bundles
│   ├── inventory/                    # Stock + warehouses + PO + batch
│   ├── pos/                          # Point of Sale (barcode, thermal)
│   ├── invoices/                     # Invoice management
│   ├── payments/                     # Manual + gateway verification
│   ├── subscriptions/                # Subscription plans & billing
│   ├── loyalty/                      # Tiers + members + transactions
│   ├── promotions/                   # Promos + vouchers + gift cards
│   ├── expenses/                     # Expense tracking + approval
│   ├── employees/                    # Staff + commissions + performance
│   ├── telemedicine/                 # Video consultation
│   ├── delivery/                     # Delivery zones + tracking
│   ├── marketing/                    # Campaigns + segments + referrals
│   ├── feedback/                     # Customer feedback + NPS
│   ├── reports/                      # Sales + inventory + financial + custom
│   ├── kiosk/                        # Self-service kiosk
│   └── settings/                     # ⭐ All owner-configurable
│       ├── general/                  # Store info, branches, hours
│       ├── branches/                 # Multi-branch management
│       ├── payment/                  # Methods + gateway + manual
│       ├── tax/                      # PPN, PPh, tax rules
│       ├── loyalty/                  # Points, tiers, rewards
│       ├── notification/             # WhatsApp, Email, SMS, Push
│       ├── printer/                  # Receipt, barcode, thermal, label
│       ├── reminder/                 # Vaccine, grooming, hotel, expiry
│       ├── receipt/                  # Template, header, footer
│       ├── security/                 # Session, PIN, 2FA, IP whitelist
│       ├── integration/              # API tokens (Fonnte, Resend, Midtrans)
│       ├── backup/                   # Auto backup schedule
│       ├── employees/                # Commission rules, performance
│       ├── subscription/             # Plans, billing, auto-renew
│       ├── delivery/                 # Zones, pricing, courier
│       ├── inventory/                # Warehouses, costing, reorder
│       ├── custom-fields/            # Custom fields for customer/pet
│       └── advanced/                 # Debug, maintenance, i18n
├── (portal)/                         # Customer portal
│   ├── page.tsx                      # Portal home
│   ├── bookings/                     # Self-service booking
│   ├── pets/                         # Pet management
│   ├── medical-records/              # View medical history
│   ├── loyalty/                      # Points & rewards
│   ├── subscriptions/                # Active subscriptions
│   ├── invoices/                     # Invoice history
│   └── profile/                      # Profile + referral code
├── (kiosk)/                          # Self-service kiosk
│   ├── page.tsx                      # Kiosk home
│   ├── check-in/page.tsx             # QR check-in
│   └── booking/page.tsx              # Quick booking
├── actions/                          # Server Actions
├── api/webhook/                      # ONLY webhooks
│   ├── midtrans/route.ts
│   ├── fonnte/route.ts
│   └── resend/route.ts
└── layout.tsx
```

### 2.3 Data Flow

**Read (Server Component):**
```
Request → Route → Server Component → Supabase Client → PostgreSQL (RLS) → HTML
```

**Write (Server Action):**
```
Form Submit → Server Action → Zod Validation → Supabase Client → PostgreSQL → revalidatePath()
```

**Realtime (Client Component):**
```
Subscription → Supabase Realtime → React Query invalidate → Re-render
```

---

## 3. Settings & Configuration System

### 3.1 Settings Categories

```typescript
// types/settings.ts
export type SettingCategory = 
  | 'GENERAL'        // Store info, branches, operating hours
  | 'TAX'            // PPN, PPh, tax rules
  | 'LOYALTY'        // Points, tiers, rewards
  | 'NOTIFICATION'   // WhatsApp, Email, SMS, Push
  | 'PAYMENT'        // Methods, gateway, manual instructions
  | 'PRINTER'        // Receipt, barcode, thermal, label
  | 'REMINDER'       // Vaccine, grooming, hotel, appointment, expiry
  | 'RECEIPT'        // Template, header, footer, logo
  | 'SECURITY'       // Session, PIN, 2FA, IP whitelist
  | 'INTEGRATION'    // WhatsApp, Email, Payment, SMS tokens
  | 'BACKUP'         // Auto backup, retention, schedule
  | 'EMPLOYEE'       // Commission, performance, roles
  | 'SUBSCRIPTION'   // Plans, pricing, auto-renewal
  | 'DELIVERY'       // Zones, pricing, courier
  | 'INVENTORY'      // Warehouses, reorder points, FIFO/LIFO
  | 'CUSTOM_FIELD'   // Custom fields for customer/pet
  | 'ADVANCED';      // Debug, maintenance, i18n, currency
```

### 3.2 Default Settings (Seed Data)

```typescript
// lib/constants/default-settings.ts
export const DEFAULT_SETTINGS = {
  // GENERAL
  'general.store_name': { value: 'Petora Petshop', description: 'Nama toko', is_public: true },
  'general.address': { value: '', description: 'Alamat lengkap', is_public: true },
  'general.phone': { value: '', description: 'Nomor telepon', is_public: true },
  'general.email': { value: '', description: 'Email toko', is_public: true },
  'general.logo_url': { value: '', description: 'URL logo', is_public: true },
  'general.operating_hours': { 
    value: { open: '08:00', close: '20:00', days: [1,2,3,4,5,6] },
    description: 'Jam operasional', is_public: true,
  },
  'general.timezone': { value: 'Asia/Jakarta', description: 'Zona waktu' },
  'general.currency': { value: 'IDR', description: 'Mata uang' },
  'general.language': { value: 'id', description: 'Bahasa default' },
  'general.google_maps_url': { value: '', description: 'Google Maps URL', is_public: true },
  
  // BRANCHES
  'branches.enabled': { value: false, description: 'Aktifkan multi-cabang' },
  'branches.current_id': { value: null, description: 'Cabang aktif' },
  
  // TAX
  'tax.ppn_enabled': { value: false, description: 'Aktifkan PPN' },
  'tax.ppn_rate': { value: 11, description: 'Tarif PPN (%)' },
  'tax.pph_enabled': { value: false, description: 'Aktifkan PPh' },
  'tax.pph_rate': { value: 0, description: 'Tarif PPh (%)' },
  'tax.inclusive': { value: false, description: 'Pajak termasuk harga' },
  'tax.tax_id_number': { value: '', description: 'NPWP' },
  
  // LOYALTY
  'loyalty.enabled': { value: true, description: 'Aktifkan loyalty' },
  'loyalty.points_per_rupiah': { value: 1000, description: 'Rupiah per 1 poin' },
  'loyalty.point_value': { value: 100, description: 'Nilai 1 poin (rupiah)' },
  'loyalty.expiry_months': { value: 12, description: 'Masa berlaku poin' },
  'loyalty.birthday_bonus': { value: true, description: 'Bonus poin ulang tahun' },
  'loyalty.referral_bonus': { value: 100, description: 'Poin bonus referral' },
  
  // NOTIFICATION
  'notification.whatsapp_enabled': { value: false, description: 'WhatsApp on' },
  'notification.email_enabled': { value: false, description: 'Email on' },
  'notification.sms_enabled': { value: false, description: 'SMS on' },
  'notification.push_enabled': { value: false, description: 'Push on' },
  'notification.appointment_reminder': { value: true, description: 'Reminder janji' },
  'notification.vaccination_reminder': { value: true, description: 'Reminder vaksin' },
  'notification.grooming_reminder': { value: true, description: 'Reminder grooming' },
  'notification.hotel_reminder': { value: true, description: 'Reminder hotel' },
  'notification.payment_reminder': { value: true, description: 'Reminder bayar' },
  'notification.promotion_broadcast': { value: false, description: 'Broadcast promo' },
  
  // PAYMENT
  'payment.methods': { 
    value: ['CASH', 'TRANSFER', 'QRIS'],
    description: 'Metode pembayaran aktif',
  },
  'payment.gateway_enabled': { value: false, description: 'Gateway on' },
  'payment.gateway_provider': { value: '', description: 'Provider' },
  'payment.gateway_config': { value: {}, description: 'Config gateway' },
  'payment.manual_instructions': { 
    value: { bank_name: '', account_number: '', account_holder: '', qr_image_url: '' },
    description: 'Instruksi manual',
  },
  'payment.split_payment': { value: true, description: 'Izinkan split payment' },
  'payment.partial_payment': { value: true, description: 'Izinkan bayar parsial' },
  
  // PRINTER
  'printer.receipt_enabled': { value: true, description: 'Cetak struk' },
  'printer.barcode_enabled': { value: true, description: 'Cetak barcode' },
  'printer.thermal_printer': { value: false, description: 'Thermal printer' },
  'printer.paper_size': { value: '80mm', description: 'Ukuran kertas' },
  'printer.auto_print': { value: true, description: 'Auto cetak' },
  'printer.label_printer': { value: false, description: 'Label printer' },
  'printer.label_size': { value: '50x30mm', description: 'Ukuran label' },
  
  // REMINDER
  'reminder.vaccination_days_before': { value: 7, description: 'H- reminder vaksin' },
  'reminder.grooming_interval_days': { value: 30, description: 'Interval grooming' },
  'reminder.hotel_checkin_hours_before': { value: 24, description: 'H- check-in' },
  'reminder.appointment_hours_before': { value: 2, description: 'H- appointment' },
  'reminder.expiry_days_before': { value: 30, description: 'H- expiry produk' },
  'reminder.low_stock_threshold': { value: 10, description: 'Threshold low stock' },
  
  // RECEIPT
  'receipt.header_text': { value: 'Terima kasih!', description: 'Header struk' },
  'receipt.footer_text': { value: 'Simpan struk ini', description: 'Footer struk' },
  'receipt.show_logo': { value: true, description: 'Tampilkan logo' },
  'receipt.show_tax_id': { value: false, description: 'Tampilkan NPWP' },
  'receipt.show_qr_code': { value: false, description: 'QR di struk' },
  'receipt.show_loyalty_points': { value: true, description: 'Tampilkan poin' },
  'receipt.show_barcode': { value: true, description: 'Barcode invoice' },
  'receipt.template': { value: 'default', description: 'Template struk' },
  
  // SECURITY
  'security.session_timeout': { value: 30, description: 'Timeout sesi (menit)' },
  'security.pin_length': { value: 6, description: 'Panjang PIN' },
  'security.max_failed_attempts': { value: 5, description: 'Max gagal login' },
  'security.lockout_duration': { value: 15, description: 'Durasi lockout' },
  'security.require_2fa': { value: false, description: 'Wajib 2FA' },
  'security.ip_whitelist': { value: [], description: 'IP whitelist' },
  'security.password_policy': { 
    value: { min_length: 8, require_uppercase: true, require_number: true },
    description: 'Kebijakan password',
  },
  
  // INTEGRATION
  'integration.fonnte_token': { value: '', description: 'Token Fonnte' },
  'integration.fonnte_device': { value: '', description: 'Device Fonnte' },
  'integration.resend_api_key': { value: '', description: 'API key Resend' },
  'integration.from_email': { value: 'noreply@petora.app', description: 'Email pengirim' },
  'integration.sms_gateway': { value: '', description: 'SMS gateway' },
  'integration.sms_api_key': { value: '', description: 'SMS API key' },
  'integration.midtrans_server_key': { value: '', description: 'Midtrans server key' },
  'integration.midtrans_client_key': { value: '', description: 'Midtrans client key' },
  
  // BACKUP
  'backup.auto_enabled': { value: true, description: 'Auto backup' },
  'backup.schedule': { value: '02:00', description: 'Jam backup' },
  'backup.retention_days': { value: 30, description: 'Retensi backup' },
  'backup.include_storage': { value: false, description: 'Backup storage' },
  
  // EMPLOYEE
  'employee.commission_enabled': { value: true, description: 'Komisi aktif' },
  'employee.commission_type': { value: 'percentage', description: 'Tipe komisi' },
  'employee.commission_rate': { value: 5, description: 'Rate komisi (%)' },
  'employee.performance_tracking': { value: true, description: 'Tracking performa' },
  
  // SUBSCRIPTION
  'subscription.enabled': { value: false, description: 'Subscription aktif' },
  'subscription.auto_renewal': { value: true, description: 'Auto renew' },
  'subscription.grace_period_days': { value: 3, description: 'Grace period' },
  
  // DELIVERY
  'delivery.enabled': { value: false, description: 'Delivery aktif' },
  'delivery.zones': { value: [], description: 'Zona delivery' },
  'delivery.pricing_type': { value: 'flat', description: 'Tipe harga' },
  'delivery.free_minimum': { value: 0, description: 'Min gratis ongkir' },
  'delivery.courier_integration': { value: '', description: 'Integrasi kurir' },
  
  // INVENTORY
  'inventory.costing_method': { value: 'AVERAGE', description: 'Metode costing' },
  'inventory.auto_reorder': { value: false, description: 'Auto reorder' },
  'inventory.batch_tracking': { value: true, description: 'Batch tracking' },
  'inventory.expiry_tracking': { value: true, description: 'Expiry tracking' },
  'inventory.serial_tracking': { value: false, description: 'Serial tracking' },
  'inventory.warehouses': { value: ['main'], description: 'Daftar gudang' },
  
  // CUSTOM FIELDS
  'custom_fields.customer': { value: [], description: 'Custom fields customer' },
  'custom_fields.pet': { value: [], description: 'Custom fields pet' },
  
  // ADVANCED
  'advanced.debug_mode': { value: false, description: 'Debug mode' },
  'advanced.maintenance_mode': { value: false, description: 'Maintenance' },
  'advanced.analytics_enabled': { value: true, description: 'Analytics on' },
  'advanced.telemetry': { value: false, description: 'Telemetry' },
};
```

### 3.3 Settings Service

```typescript
// lib/services/settings.service.ts
import { createClient } from '@/lib/supabase/server';
import type { Setting, SettingCategory } from '@/types';
import { DEFAULT_SETTINGS } from '@/lib/constants/default-settings';

export class SettingsService {
  static async getAll(): Promise<Setting[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .order('category')
      .order('key');
    if (error) throw error;
    return data as Setting[];
  }
  
  static async getByCategory(category: SettingCategory): Promise<Setting[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('category', category);
    if (error) throw error;
    return data as Setting[];
  }
  
  static async getValue<T>(key: string): Promise<T> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', key)
      .maybeSingle();
    if (error) throw error;
    
    if (!data && DEFAULT_SETTINGS[key as keyof typeof DEFAULT_SETTINGS]) {
      return DEFAULT_SETTINGS[key as keyof typeof DEFAULT_SETTINGS].value as T;
    }
    return data?.value as T;
  }
  
  static async getPublicSettings(): Promise<Record<string, any>> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('settings')
      .select('key, value')
      .eq('is_public', true);
    if (error) throw error;
    return data.reduce((acc, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {} as Record<string, any>);
  }
  
  static async update(key: string, value: any, updatedBy: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
      .from('settings')
      .upsert(
        { key, value, updated_by: updatedBy, updated_at: new Date().toISOString() },
        { onConflict: 'key' }
      );
    if (error) throw error;
  }
  
  static async updateBatch(
    updates: Array<{ key: string; value: any }>, 
    updatedBy: string
  ): Promise<void> {
    const supabase = await createClient();
    for (const { key, value } of updates) {
      await supabase
        .from('settings')
        .upsert(
          { key, value, updated_by: updatedBy, updated_at: new Date().toISOString() },
          { onConflict: 'key' }
        );
    }
  }
  
  static async seedDefaults(): Promise<void> {
    const supabase = await createClient();
    const { count } = await supabase
      .from('settings')
      .select('*', { count: 'exact', head: true });
    if (count && count > 0) return;
    
    const defaults = Object.entries(DEFAULT_SETTINGS).map(([key, config]) => ({
      category: key.split('.')[0].toUpperCase() as SettingCategory,
      key,
      value: config.value,
      description: config.description,
      is_public: config.is_public ?? false,
    }));
    const { error } = await supabase.from('settings').insert(defaults);
    if (error) throw error;
  }
}
```

---

## 4. Database Schema

### 4.1 Naming Conventions

| Aspek | Konvensi | Contoh |
|---|---|---|
| Tabel | snake_case, plural | `customers`, `medical_records` |
| Kolom | snake_case | `created_at`, `customer_id` |
| Primary Key | `id UUID DEFAULT gen_random_uuid()` | — |
| Foreign Key | `<table_singular>_id` | `customer_id`, `pet_id` |
| Timestamp | `created_at`, `updated_at`, `deleted_at` | — |
| Enum | snake_case | `appointment_status` |
| Index | `idx_<table>_<column>` | `idx_customers_phone` |
| Unique | `uniq_<table>_<column>` | `uniq_users_username` |
| Function | `fn_<action>_<entity>` | `fn_calculate_loyalty_points` |
| Trigger | `trg_<table>_<action>` | `trg_users_before_insert` |

### 4.2 Complete Schema

```sql
-- ============================================
-- ENUMS
-- ============================================
CREATE TYPE user_role AS ENUM ('OWNER', 'ADMIN', 'MANAGER', 'DOKTER', 'KASIR', 'GROOMER', 'COURIER', 'CUSTOMER');
CREATE TYPE appointment_status AS ENUM ('SCHEDULED', 'WAITING', 'IN_PROGRESS', 'DONE', 'CANCELLED', 'NO_SHOW');
CREATE TYPE medical_record_status AS ENUM ('OPEN', 'CLOSED');
CREATE TYPE prescription_status AS ENUM ('DRAFT', 'ACTIVE', 'COMPLETED', 'CANCELLED');
CREATE TYPE room_status AS ENUM ('AVAILABLE', 'RESERVED', 'OCCUPIED', 'MAINTENANCE', 'INACTIVE');
CREATE TYPE room_cleanliness AS ENUM ('CLEAN', 'DIRTY', 'UNDER_CLEANING');
CREATE TYPE pet_hotel_booking_status AS ENUM ('BOOKED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED');
CREATE TYPE grooming_booking_status AS ENUM ('BOOKED', 'IN_PROGRESS', 'DONE', 'CANCELLED');
CREATE TYPE product_status AS ENUM ('ACTIVE', 'ARCHIVED');
CREATE TYPE stock_movement_type AS ENUM ('IN', 'OUT', 'RETURN', 'ADJUSTMENT', 'DAMAGED', 'EXPIRED', 'OPNAME', 'TRANSFER');
CREATE TYPE invoice_type AS ENUM ('POS', 'CLINICAL', 'PET_HOTEL', 'GROOMING', 'MIXED', 'SUBSCRIPTION', 'TELEMEDICINE');
CREATE TYPE invoice_status AS ENUM ('DRAFT', 'UNPAID', 'PARTIAL_PAYMENT', 'PAID', 'CANCELLED', 'REFUNDED');
CREATE TYPE payment_method AS ENUM ('CASH', 'QRIS', 'TRANSFER', 'E_WALLET', 'CREDIT_CARD', 'DEBIT_CARD', 'GIFT_CARD', 'LOYALTY_POINTS', 'MIXED', 'OTHER');
CREATE TYPE payment_status AS ENUM ('PENDING', 'VERIFIED', 'REJECTED', 'EXPIRED', 'REFUNDED');
CREATE TYPE purchase_order_status AS ENUM ('DRAFT', 'SENT', 'PARTIAL_RECEIVED', 'RECEIVED', 'CANCELLED');
CREATE TYPE loyalty_tier AS ENUM ('BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND');
CREATE TYPE loyalty_transaction_type AS ENUM ('EARN', 'REDEEM', 'EXPIRE', 'ADJUST', 'REFERRAL', 'BIRTHDAY');
CREATE TYPE promotion_type AS ENUM ('PERCENTAGE', 'FIXED', 'BUNDLE', 'HAPPY_HOUR', 'BIRTHDAY', 'BOGO', 'FREE_SHIPPING');
CREATE TYPE promotion_status AS ENUM ('ACTIVE', 'EXPIRED', 'CANCELLED', 'SCHEDULED');
CREATE TYPE expense_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'REVERSED');
CREATE TYPE feedback_rating AS ENUM ('1', '2', '3', '4', '5');
CREATE TYPE pet_hotel_log_type AS ENUM ('FEEDING', 'MEDICINE', 'WALK', 'PLAY', 'NOTE', 'PHOTO');
CREATE TYPE customer_tag AS ENUM ('VIP', 'REGULAR', 'NEW', 'BLACKLIST', 'WHOLESALE', 'BREEDER');
CREATE TYPE setting_category AS ENUM ('GENERAL', 'TAX', 'LOYALTY', 'NOTIFICATION', 'PAYMENT', 'PRINTER', 'REMINDER', 'RECEIPT', 'SECURITY', 'INTEGRATION', 'BACKUP', 'EMPLOYEE', 'SUBSCRIPTION', 'DELIVERY', 'INVENTORY', 'CUSTOM_FIELD', 'ADVANCED');
CREATE TYPE subscription_status AS ENUM ('ACTIVE', 'PAUSED', 'CANCELLED', 'EXPIRED');
CREATE TYPE delivery_status AS ENUM ('PENDING', 'ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'FAILED', 'CANCELLED');
CREATE TYPE commission_type AS ENUM ('PERCENTAGE', 'FIXED', 'TIERED');
CREATE TYPE telemedicine_status AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW');

-- ============================================
-- SETTINGS (Owner-Configurable)
-- ============================================
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category setting_category NOT NULL,
  key VARCHAR(100) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES users(id)
);
CREATE INDEX idx_settings_category ON settings(category);
CREATE INDEX idx_settings_key ON settings(key);

-- ============================================
-- BRANCHES (Multi-cabang)
-- ============================================
CREATE TABLE branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  code VARCHAR(20) UNIQUE NOT NULL,
  address TEXT,
  phone VARCHAR(20),
  email VARCHAR(100),
  logo_url TEXT,
  operating_hours JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  is_headquarter BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- USERS & AUTH
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID REFERENCES branches(id),
  username VARCHAR(50) UNIQUE NOT NULL,
  pin_hash TEXT NOT NULL,
  email VARCHAR(100) UNIQUE,
  phone VARCHAR(20),
  role user_role NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  photo_url TEXT,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  failed_login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  last_login_at TIMESTAMPTZ,
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  two_factor_secret TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_branch_id ON users(branch_id);

-- ============================================
-- CUSTOMERS
-- ============================================
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID REFERENCES branches(id),
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(100),
  address TEXT,
  city VARCHAR(100),
  postal_code VARCHAR(10),
  emergency_contact VARCHAR(100),
  emergency_phone VARCHAR(20),
  photo_url TEXT,
  notes TEXT,
  is_guest BOOLEAN DEFAULT FALSE,
  tags customer_tag[] DEFAULT '{}',
  custom_fields JSONB DEFAULT '{}',
  referred_by UUID REFERENCES customers(id),
  referral_code VARCHAR(20) UNIQUE,
  birth_date DATE,
  gender VARCHAR(10),
  id_number VARCHAR(50),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);
CREATE INDEX idx_customers_name ON customers(name);
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_branch_id ON customers(branch_id);
CREATE INDEX idx_customers_referral_code ON customers(referral_code);

-- ============================================
-- PETS
-- ============================================
CREATE TABLE pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  species VARCHAR(50) NOT NULL,
  breed VARCHAR(50),
  birth_date DATE,
  gender VARCHAR(10),
  color VARCHAR(50),
  photo_url TEXT,
  microchip_number VARCHAR(50) UNIQUE,
  pedigree_number VARCHAR(50),
  temperament TEXT,
  special_needs TEXT,
  diet_notes TEXT,
  behavior_notes TEXT,
  custom_fields JSONB DEFAULT '{}',
  is_neutered BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);
CREATE INDEX idx_pets_customer_id ON pets(customer_id);
CREATE INDEX idx_pets_species ON pets(species);
CREATE INDEX idx_pets_microchip ON pets(microchip_number);

-- ============================================
-- PET WEIGHT LOGS
-- ============================================
CREATE TABLE pet_weight_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  weight_kg DECIMAL(5,2) NOT NULL,
  recorded_at DATE NOT NULL DEFAULT CURRENT_DATE,
  recorded_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PET VACCINES
-- ============================================
CREATE TABLE pet_vaccines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  vaccine_name VARCHAR(100) NOT NULL,
  vaccine_type VARCHAR(50),
  batch_number VARCHAR(50),
  manufacturer VARCHAR(100),
  vaccination_date DATE NOT NULL,
  due_date DATE,
  administered_by UUID REFERENCES users(id),
  notes TEXT,
  certificate_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_pet_vaccines_pet_id ON pet_vaccines(pet_id);
CREATE INDEX idx_pet_vaccines_due_date ON pet_vaccines(due_date);

-- ============================================
-- PET DISEASES & ALLERGIES
-- ============================================
CREATE TABLE pet_diseases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  disease_name VARCHAR(100) NOT NULL,
  diagnosed_date DATE,
  diagnosed_by UUID REFERENCES users(id),
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE pet_allergies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  allergen VARCHAR(100) NOT NULL,
  severity VARCHAR(20),
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PET PASSPORT
-- ============================================
CREATE TABLE pet_passports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  passport_number VARCHAR(50) UNIQUE NOT NULL,
  issued_date DATE NOT NULL,
  expiry_date DATE,
  issued_by UUID REFERENCES users(id),
  document_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- APPOINTMENTS
-- ============================================
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID REFERENCES branches(id),
  customer_id UUID NOT NULL REFERENCES customers(id),
  pet_id UUID NOT NULL REFERENCES pets(id),
  doctor_id UUID REFERENCES users(id),
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  queue_number INTEGER,
  status appointment_status DEFAULT 'SCHEDULED',
  appointment_type VARCHAR(50),
  complaint TEXT,
  notes TEXT,
  is_from_portal BOOLEAN DEFAULT FALSE,
  check_in_at TIMESTAMPTZ,
  check_out_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_appointments_customer_id ON appointments(customer_id);
CREATE INDEX idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_branch_id ON appointments(branch_id);

-- ============================================
-- MEDICAL RECORDS
-- ============================================
CREATE TABLE medical_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  record_number VARCHAR(20) UNIQUE NOT NULL,
  branch_id UUID REFERENCES branches(id),
  appointment_id UUID NOT NULL REFERENCES appointments(id),
  doctor_id UUID NOT NULL REFERENCES users(id),
  chief_complaint TEXT,
  history TEXT,
  physical_exam TEXT,
  weight_kg DECIMAL(5,2),
  temperature_c DECIMAL(4,1),
  heart_rate_bpm INTEGER,
  respiratory_rate_bpm INTEGER,
  diagnosis TEXT,
  diagnosis_code VARCHAR(20),
  treatment TEXT,
  prescription TEXT,
  lab_results TEXT,
  additional_notes TEXT,
  attachments TEXT[],
  status medical_record_status DEFAULT 'OPEN',
  signed_at TIMESTAMPTZ,
  signature_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- ============================================
-- PRESCRIPTIONS
-- ============================================
CREATE TABLE prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prescription_number VARCHAR(20) UNIQUE NOT NULL,
  medical_record_id UUID NOT NULL REFERENCES medical_records(id),
  doctor_id UUID NOT NULL REFERENCES users(id),
  customer_id UUID NOT NULL REFERENCES customers(id),
  pet_id UUID NOT NULL REFERENCES pets(id),
  status prescription_status DEFAULT 'DRAFT',
  instructions TEXT,
  dosage TEXT,
  duration_days INTEGER,
  refills_allowed INTEGER DEFAULT 0,
  refills_used INTEGER DEFAULT 0,
  signed_at TIMESTAMPTZ,
  signature_url TEXT,
  valid_until DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE prescription_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prescription_id UUID NOT NULL REFERENCES prescriptions(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  medicine_name VARCHAR(200) NOT NULL,
  dosage TEXT,
  frequency VARCHAR(100),
  duration TEXT,
  notes TEXT,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- LAB RESULTS
-- ============================================
CREATE TABLE lab_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medical_record_id UUID NOT NULL REFERENCES medical_records(id),
  lab_type VARCHAR(50) NOT NULL,
  test_name VARCHAR(200) NOT NULL,
  result_value TEXT,
  result_unit VARCHAR(50),
  reference_range VARCHAR(100),
  is_abnormal BOOLEAN DEFAULT FALSE,
  notes TEXT,
  attachment_url TEXT,
  tested_at TIMESTAMPTZ,
  tested_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PROCEDURES (Master Data)
-- ============================================
CREATE TABLE procedures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(12,2) NOT NULL,
  category VARCHAR(50),
  duration_minutes INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- ============================================
-- PET HOTEL ROOMS
-- ============================================
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID REFERENCES branches(id),
  name VARCHAR(50) NOT NULL,
  room_number VARCHAR(20),
  room_type VARCHAR(20) NOT NULL,
  size VARCHAR(20),
  price_per_night DECIMAL(12,2) NOT NULL,
  capacity INTEGER DEFAULT 1,
  amenities JSONB DEFAULT '[]',
  photo_urls TEXT[],
  status room_status DEFAULT 'AVAILABLE',
  cleanliness room_cleanliness DEFAULT 'CLEAN',
  maintenance_status BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- ============================================
-- PET HOTEL BOOKINGS
-- ============================================
CREATE TABLE pet_hotel_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_number VARCHAR(20) UNIQUE NOT NULL,
  branch_id UUID REFERENCES branches(id),
  pet_id UUID NOT NULL REFERENCES pets(id),
  customer_id UUID NOT NULL REFERENCES customers(id),
  room_id UUID REFERENCES rooms(id),
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  actual_check_in_at TIMESTAMPTZ,
  actual_check_out_at TIMESTAMPTZ,
  price_per_night DECIMAL(12,2),
  total_price DECIMAL(12,2),
  status pet_hotel_booking_status DEFAULT 'BOOKED',
  special_notes TEXT,
  feeding_schedule JSONB,
  medication_schedule JSONB,
  is_from_portal BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PET HOTEL LOGS
-- ============================================
CREATE TABLE pet_hotel_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES pet_hotel_bookings(id) ON DELETE CASCADE,
  log_type pet_hotel_log_type NOT NULL,
  description TEXT,
  photo_urls TEXT[],
  logged_by UUID REFERENCES users(id),
  logged_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- GROOMING SERVICES
-- ============================================
CREATE TABLE grooming_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  base_price DECIMAL(12,2) NOT NULL,
  duration_minutes INTEGER,
  category VARCHAR(50),
  photo_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- ============================================
-- GROOMING BOOKINGS
-- ============================================
CREATE TABLE grooming_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_number VARCHAR(20) UNIQUE NOT NULL,
  branch_id UUID REFERENCES branches(id),
  pet_id UUID NOT NULL REFERENCES pets(id),
  customer_id UUID NOT NULL REFERENCES customers(id),
  groomer_id UUID REFERENCES users(id),
  service_id UUID NOT NULL REFERENCES grooming_services(id),
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  duration_minutes INTEGER,
  status grooming_booking_status DEFAULT 'BOOKED',
  total_price DECIMAL(12,2),
  notes TEXT,
  is_from_portal BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- GROOMING RECORDS
-- ============================================
CREATE TABLE grooming_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES grooming_bookings(id),
  skin_condition TEXT,
  flea_tick_found BOOLEAN DEFAULT FALSE,
  coat_condition TEXT,
  recommendations TEXT,
  products_used JSONB,
  before_photo_url TEXT,
  after_photo_url TEXT,
  gallery_urls TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CATEGORIES & SUPPLIERS
-- ============================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES categories(id),
  photo_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  contact_person VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(100),
  address TEXT,
  notes TEXT,
  lead_time_days INTEGER,
  payment_terms INTEGER,
  rating DECIMAL(3,2),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- WAREHOUSES
-- ============================================
CREATE TABLE warehouses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID REFERENCES branches(id),
  name VARCHAR(100) NOT NULL,
  code VARCHAR(20) UNIQUE NOT NULL,
  location TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PRODUCTS & INVENTORY
-- ============================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID REFERENCES branches(id),
  sku VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  category_id UUID REFERENCES categories(id),
  supplier_id UUID REFERENCES suppliers(id),
  barcode VARCHAR(100),
  description TEXT,
  purchase_price DECIMAL(12,2) NOT NULL,
  selling_price DECIMAL(12,2) NOT NULL,
  wholesale_price DECIMAL(12,2),
  cost_price DECIMAL(12,2),
  stock_quantity INTEGER DEFAULT 0,
  stock_minimum INTEGER DEFAULT 0,
  stock_maximum INTEGER DEFAULT 0,
  reorder_point INTEGER DEFAULT 0,
  reorder_quantity INTEGER DEFAULT 0,
  photo_url TEXT,
  photo_urls TEXT[],
  expiry_date DATE,
  batch_number VARCHAR(50),
  unit VARCHAR(20),
  weight_kg DECIMAL(8,3),
  dimensions JSONB,
  is_serialized BOOLEAN DEFAULT FALSE,
  is_batch_tracked BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  status product_status DEFAULT 'ACTIVE',
  custom_fields JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_barcode ON products(barcode);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_stock_quantity ON products(stock_quantity);
CREATE INDEX idx_products_expiry_date ON products(expiry_date);
CREATE INDEX idx_products_branch_id ON products(branch_id);

CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_name VARCHAR(100) NOT NULL,
  variant_value VARCHAR(100) NOT NULL,
  sku VARCHAR(50),
  barcode VARCHAR(100),
  price_adjustment DECIMAL(12,2) DEFAULT 0,
  stock_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE product_bundles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  bundle_price DECIMAL(12,2) NOT NULL,
  original_price DECIMAL(12,2),
  photo_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE product_bundle_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bundle_id UUID NOT NULL REFERENCES product_bundles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL DEFAULT 1
);

-- ============================================
-- BATCH TRACKING
-- ============================================
CREATE TABLE product_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id),
  batch_number VARCHAR(50) NOT NULL,
  quantity INTEGER NOT NULL,
  remaining_quantity INTEGER NOT NULL,
  expiry_date DATE,
  purchase_price DECIMAL(12,2),
  received_date DATE,
  supplier_id UUID REFERENCES suppliers(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_product_batches_product_id ON product_batches(product_id);
CREATE INDEX idx_product_batches_expiry_date ON product_batches(expiry_date);

-- ============================================
-- STOCK MOVEMENTS
-- ============================================
CREATE TABLE stock_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id),
  warehouse_id UUID REFERENCES warehouses(id),
  batch_id UUID REFERENCES product_batches(id),
  movement_type stock_movement_type NOT NULL,
  quantity INTEGER NOT NULL,
  reference_type VARCHAR(50),
  reference_id UUID,
  notes TEXT,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PURCHASE ORDERS
-- ============================================
CREATE TABLE purchase_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  po_number VARCHAR(20) UNIQUE NOT NULL,
  branch_id UUID REFERENCES branches(id),
  supplier_id UUID NOT NULL REFERENCES suppliers(id),
  order_date DATE NOT NULL,
  expected_arrival_date DATE,
  actual_arrival_date DATE,
  subtotal DECIMAL(12,2),
  tax_amount DECIMAL(12,2),
  total_amount DECIMAL(12,2),
  status purchase_order_status DEFAULT 'DRAFT',
  notes TEXT,
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMPTZ,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE purchase_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  po_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(12,2) NOT NULL,
  received_quantity INTEGER DEFAULT 0,
  batch_number VARCHAR(50),
  expiry_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INVOICES & PAYMENTS
-- ============================================
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number VARCHAR(20) UNIQUE NOT NULL,
  branch_id UUID REFERENCES branches(id),
  invoice_type invoice_type NOT NULL,
  customer_id UUID REFERENCES customers(id),
  subtotal DECIMAL(12,2) NOT NULL,
  discount_amount DECIMAL(12,2) DEFAULT 0,
  discount_type VARCHAR(20),
  tax_amount DECIMAL(12,2) DEFAULT 0,
  shipping_amount DECIMAL(12,2) DEFAULT 0,
  total_amount DECIMAL(12,2) NOT NULL,
  paid_amount DECIMAL(12,2) DEFAULT 0,
  status invoice_status DEFAULT 'DRAFT',
  promotion_id UUID REFERENCES promotions(id),
  gift_card_id UUID REFERENCES gift_cards(id),
  voucher_id UUID REFERENCES vouchers(id),
  loyalty_points_earned INTEGER DEFAULT 0,
  loyalty_points_redeemed INTEGER DEFAULT 0,
  notes TEXT,
  due_date DATE,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_invoices_customer_id ON invoices(customer_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_created_at ON invoices(created_at);
CREATE INDEX idx_invoices_branch_id ON invoices(branch_id);

CREATE TABLE invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  item_type VARCHAR(50) NOT NULL,
  product_id UUID REFERENCES products(id),
  procedure_id UUID REFERENCES procedures(id),
  pet_hotel_booking_id UUID REFERENCES pet_hotel_bookings(id),
  grooming_booking_id UUID REFERENCES grooming_bookings(id),
  prescription_id UUID REFERENCES prescriptions(id),
  description VARCHAR(200) NOT NULL,
  quantity INTEGER DEFAULT 1,
  unit_price DECIMAL(12,2) NOT NULL,
  discount_amount DECIMAL(12,2) DEFAULT 0,
  tax_amount DECIMAL(12,2) DEFAULT 0,
  total_price DECIMAL(12,2) NOT NULL,
  batch_number VARCHAR(50),
  expiry_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES invoices(id),
  payment_method payment_method NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  payment_status payment_status DEFAULT 'PENDING',
  proof_url TEXT,
  reference_number VARCHAR(100),
  gateway_transaction_id VARCHAR(200),
  gateway_response JSONB,
  gift_card_id UUID REFERENCES gift_cards(id),
  notes TEXT,
  verified_by UUID REFERENCES users(id),
  verified_at TIMESTAMPTZ,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_payments_invoice_id ON payments(invoice_id);
CREATE INDEX idx_payments_status ON payments(payment_status);

-- ============================================
-- GIFT CARDS & VOUCHERS
-- ============================================
CREATE TABLE gift_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_number VARCHAR(50) UNIQUE NOT NULL,
  pin VARCHAR(20),
  initial_amount DECIMAL(12,2) NOT NULL,
  current_balance DECIMAL(12,2) NOT NULL,
  customer_id UUID REFERENCES customers(id),
  purchased_by UUID REFERENCES customers(id),
  status VARCHAR(20) DEFAULT 'ACTIVE',
  expiry_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE vouchers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  discount_type VARCHAR(20) NOT NULL,
  discount_value DECIMAL(12,2) NOT NULL,
  min_purchase DECIMAL(12,2) DEFAULT 0,
  max_discount DECIMAL(12,2),
  max_usage INTEGER,
  current_usage INTEGER DEFAULT 0,
  per_customer_limit INTEGER DEFAULT 1,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  applicable_products UUID[],
  applicable_categories UUID[],
  status VARCHAR(20) DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE voucher_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  voucher_id UUID NOT NULL REFERENCES vouchers(id),
  invoice_id UUID NOT NULL REFERENCES invoices(id),
  customer_id UUID REFERENCES customers(id),
  discount_applied DECIMAL(12,2) NOT NULL,
  used_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CASH SHIFTS
-- ============================================
CREATE TABLE cash_shifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID REFERENCES branches(id),
  kasir_id UUID NOT NULL REFERENCES users(id),
  open_time TIMESTAMPTZ NOT NULL,
  close_time TIMESTAMPTZ,
  opening_cash DECIMAL(12,2) NOT NULL,
  closing_cash DECIMAL(12,2),
  expected_cash DECIMAL(12,2),
  difference DECIMAL(12,2),
  cash_in DECIMAL(12,2) DEFAULT 0,
  cash_out DECIMAL(12,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- LOYALTY PROGRAM
-- ============================================
CREATE TABLE loyalty_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tier_name loyalty_tier NOT NULL,
  min_points INTEGER NOT NULL,
  min_spending DECIMAL(12,2) NOT NULL,
  point_multiplier DECIMAL(3,2) DEFAULT 1.0,
  benefits JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE loyalty_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) UNIQUE,
  tier_id UUID REFERENCES loyalty_tiers(id),
  total_points INTEGER DEFAULT 0,
  available_points INTEGER DEFAULT 0,
  total_spending DECIMAL(12,2) DEFAULT 0,
  points_expiry_date DATE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE loyalty_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES loyalty_members(id),
  transaction_type loyalty_transaction_type NOT NULL,
  points INTEGER NOT NULL,
  invoice_id UUID REFERENCES invoices(id),
  description TEXT,
  expiry_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PROMOTIONS
-- ============================================
CREATE TABLE promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  promotion_type promotion_type NOT NULL,
  discount_value DECIMAL(12,2) NOT NULL,
  min_purchase DECIMAL(12,2) DEFAULT 0,
  max_discount DECIMAL(12,2),
  max_usage INTEGER,
  current_usage INTEGER DEFAULT 0,
  per_customer_limit INTEGER DEFAULT 1,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  applicable_products UUID[],
  applicable_categories UUID[],
  applicable_days INTEGER[],
  applicable_hours JSONB,
  auto_apply BOOLEAN DEFAULT FALSE,
  status promotion_status DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SUBSCRIPTIONS
-- ============================================
CREATE TABLE subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(12,2) NOT NULL,
  billing_cycle VARCHAR(20) NOT NULL,
  features JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_number VARCHAR(20) UNIQUE NOT NULL,
  customer_id UUID NOT NULL REFERENCES customers(id),
  plan_id UUID NOT NULL REFERENCES subscription_plans(id),
  pet_id UUID REFERENCES pets(id),
  status subscription_status DEFAULT 'ACTIVE',
  start_date DATE NOT NULL,
  end_date DATE,
  next_billing_date DATE,
  auto_renew BOOLEAN DEFAULT TRUE,
  payment_method payment_method,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- EXPENSES
-- ============================================
CREATE TABLE expense_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID REFERENCES branches(id),
  expense_date DATE NOT NULL,
  category_id UUID NOT NULL REFERENCES expense_categories(id),
  amount DECIMAL(12,2) NOT NULL,
  description TEXT,
  receipt_url TEXT,
  receipt_number VARCHAR(100),
  status expense_status DEFAULT 'PENDING',
  is_recurring BOOLEAN DEFAULT FALSE,
  recurring_day INTEGER,
  payment_method payment_method,
  created_by UUID NOT NULL REFERENCES users(id),
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- EMPLOYEE COMMISSIONS
-- ============================================
CREATE TABLE commission_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  commission_type commission_type NOT NULL,
  rate DECIMAL(5,2) NOT NULL,
  applicable_services UUID[],
  applicable_products UUID[],
  min_target DECIMAL(12,2),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE commission_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  invoice_id UUID REFERENCES invoices(id),
  amount DECIMAL(12,2) NOT NULL,
  description TEXT,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  paid BOOLEAN DEFAULT FALSE,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TELEMEDICINE
-- ============================================
CREATE TABLE telemedicine_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_number VARCHAR(20) UNIQUE NOT NULL,
  customer_id UUID NOT NULL REFERENCES customers(id),
  pet_id UUID NOT NULL REFERENCES pets(id),
  doctor_id UUID NOT NULL REFERENCES users(id),
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  status telemedicine_status DEFAULT 'SCHEDULED',
  meeting_url TEXT,
  meeting_id VARCHAR(100),
  notes TEXT,
  recording_url TEXT,
  fee DECIMAL(12,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- DELIVERY
-- ============================================
CREATE TABLE delivery_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID REFERENCES branches(id),
  name VARCHAR(100) NOT NULL,
  postal_codes TEXT[],
  fee DECIMAL(12,2) NOT NULL,
  estimated_time_minutes INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_number VARCHAR(20) UNIQUE NOT NULL,
  invoice_id UUID NOT NULL REFERENCES invoices(id),
  customer_id UUID NOT NULL REFERENCES customers(id),
  courier_id UUID REFERENCES users(id),
  delivery_address TEXT NOT NULL,
  delivery_zone_id UUID REFERENCES delivery_zones(id),
  delivery_fee DECIMAL(12,2),
  status delivery_status DEFAULT 'PENDING',
  scheduled_at TIMESTAMPTZ,
  picked_up_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  failed_reason TEXT,
  notes TEXT,
  proof_photo_url TEXT,
  signature_url TEXT,
  tracking_number VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CUSTOMER FEEDBACK
-- ============================================
CREATE TABLE customer_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id),
  invoice_id UUID REFERENCES invoices(id),
  appointment_id UUID REFERENCES appointments(id),
  rating feedback_rating NOT NULL,
  comment TEXT,
  nps_score INTEGER,
  categories JSONB,
  response_text TEXT,
  responded_by UUID REFERENCES users(id),
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- REFERRALS
-- ============================================
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES customers(id),
  referred_id UUID NOT NULL REFERENCES customers(id),
  status VARCHAR(20) DEFAULT 'PENDING',
  reward_points INTEGER,
  reward_issued_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- MARKETING CAMPAIGNS
-- ============================================
CREATE TABLE marketing_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  campaign_type VARCHAR(50) NOT NULL,
  channel VARCHAR(50) NOT NULL,
  target_segment JSONB,
  message_template TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  budget DECIMAL(12,2),
  spent DECIMAL(12,2) DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  opened_count INTEGER DEFAULT 0,
  clicked_count INTEGER DEFAULT 0,
  converted_count INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'DRAFT',
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- AUDIT LOGS
-- ============================================
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  branch_id UUID REFERENCES branches(id),
  action VARCHAR(50) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address VARCHAR(50),
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- ============================================
-- NOTIFICATIONS
-- ============================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  data JSONB,
  action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- ============================================
-- EMAIL TEMPLATES
-- ============================================
CREATE TABLE email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  subject VARCHAR(200) NOT NULL,
  body TEXT NOT NULL,
  variables JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BACKUPS
-- ============================================
CREATE TABLE backups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  backup_type VARCHAR(20) NOT NULL,
  file_url TEXT NOT NULL,
  file_size BIGINT,
  status VARCHAR(20) DEFAULT 'COMPLETED',
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 5. TypeScript Types

### 5.1 Base Types

```typescript
// types/base.ts
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
```

### 5.2 Domain Types

```typescript
// types/user.ts
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

// types/customer.ts
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

// types/pet.ts
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
  custom_fields: Record<string, any>;
  is_neutered: boolean;
  is_active: boolean;
}

// types/appointment.ts
export type AppointmentStatus = 'SCHEDULED' | 'WAITING' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED' | 'NO_SHOW';

export interface Appointment extends BaseEntity {
  branch_id: UUID | null;
  customer_id: UUID;
  pet_id: UUID;
  doctor_id: UUID | null;
  appointment_date: string;
  appointment_time: string;
  duration_minutes: number;
  queue_number: number | null;
  status: AppointmentStatus;
  appointment_type: string | null;
  complaint: string | null;
  notes: string | null;
  is_from_portal: boolean;
  check_in_at: Timestamp | null;
  check_out_at: Timestamp | null;
  cancellation_reason: string | null;
}

// types/medical-record.ts
export interface MedicalRecord extends SoftDeletable {
  record_number: string;
  branch_id: UUID | null;
  appointment_id: UUID;
  doctor_id: UUID;
  chief_complaint: string | null;
  history: string | null;
  physical_exam: string | null;
  weight_kg: number | null;
  temperature_c: number | null;
  heart_rate_bpm: number | null;
  respiratory_rate_bpm: number | null;
  diagnosis: string | null;
  diagnosis_code: string | null;
  treatment: string | null;
  prescription: string | null;
  lab_results: string | null;
  additional_notes: string | null;
  attachments: string[];
  status: 'OPEN' | 'CLOSED';
  signed_at: Timestamp | null;
  signature_url: string | null;
}

// types/prescription.ts
export interface Prescription extends BaseEntity {
  prescription_number: string;
  medical_record_id: UUID;
  doctor_id: UUID;
  customer_id: UUID;
  pet_id: UUID;
  status: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  instructions: string | null;
  dosage: string | null;
  duration_days: number | null;
  refills_allowed: number;
  refills_used: number;
  signed_at: Timestamp | null;
  signature_url: string | null;
  valid_until: string | null;
}

// types/invoice.ts
export type InvoiceType = 'POS' | 'CLINICAL' | 'PET_HOTEL' | 'GROOMING' | 'MIXED' | 'SUBSCRIPTION' | 'TELEMEDICINE';
export type InvoiceStatus = 'DRAFT' | 'UNPAID' | 'PARTIAL_PAYMENT' | 'PAID' | 'CANCELLED' | 'REFUNDED';
export type PaymentMethod = 'CASH' | 'QRIS' | 'TRANSFER' | 'E_WALLET' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'GIFT_CARD' | 'LOYALTY_POINTS' | 'MIXED' | 'OTHER';

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

// types/product.ts
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
  dimensions: Record<string, any> | null;
  is_serialized: boolean;
  is_batch_tracked: boolean;
  is_active: boolean;
  status: 'ACTIVE' | 'ARCHIVED';
  custom_fields: Record<string, any>;
}

// types/subscription.ts
export interface Subscription extends BaseEntity {
  subscription_number: string;
  customer_id: UUID;
  plan_id: UUID;
  pet_id: UUID | null;
  status: 'ACTIVE' | 'PAUSED' | 'CANCELLED' | 'EXPIRED';
  start_date: string;
  end_date: string | null;
  next_billing_date: string | null;
  auto_renew: boolean;
  payment_method: PaymentMethod | null;
  notes: string | null;
}

// types/delivery.ts
export interface Delivery extends BaseEntity {
  delivery_number: string;
  invoice_id: UUID;
  customer_id: UUID;
  courier_id: UUID | null;
  delivery_address: string;
  delivery_zone_id: UUID | null;
  delivery_fee: number | null;
  status: 'PENDING' | 'ASSIGNED' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED' | 'FAILED' | 'CANCELLED';
  scheduled_at: Timestamp | null;
  picked_up_at: Timestamp | null;
  delivered_at: Timestamp | null;
  failed_reason: string | null;
  notes: string | null;
  proof_photo_url: string | null;
  signature_url: string | null;
  tracking_number: string | null;
}

// types/telemedicine.ts
export interface TelemedicineSession extends BaseEntity {
  session_number: string;
  customer_id: UUID;
  pet_id: UUID;
  doctor_id: UUID;
  scheduled_at: Timestamp;
  duration_minutes: number;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  meeting_url: string | null;
  meeting_id: string | null;
  notes: string | null;
  recording_url: string | null;
  fee: number | null;
}

// types/branch.ts
export interface Branch extends BaseEntity {
  name: string;
  code: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  logo_url: string | null;
  operating_hours: Record<string, any> | null;
  is_active: boolean;
  is_headquarter: boolean;
}
```

---

## 6. Zod Validation Schemas

### 6.1 Base Schemas

```typescript
// schemas/base.ts
import { z } from 'zod';

export const uuidSchema = z.string().uuid();
export const timestampSchema = z.string().datetime();
export const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
export const timeSchema = z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/);
export const phoneSchema = z.string().regex(/^[+]?[0-9]{10,15}$/);
export const emailSchema = z.string().email();
```

### 6.2 Settings Schemas

```typescript
// schemas/settings.ts
import { z } from 'zod';

export const operatingHoursSchema = z.object({
  open: z.string().regex(/^\d{2}:\d{2}$/),
  close: z.string().regex(/^\d{2}:\d{2}$/),
  days: z.array(z.number().min(1).max(7)).min(1),
  is_24h: z.boolean().optional(),
});

export const storeSettingsSchema = z.object({
  store_name: z.string().min(1).max(100),
  address: z.string().max(500),
  phone: z.string().max(20),
  email: z.string().email().max(100),
  logo_url: z.string().url().optional().or(z.literal('')),
  operating_hours: operatingHoursSchema,
  timezone: z.string().default('Asia/Jakarta'),
  currency: z.string().default('IDR'),
  language: z.string().default('id'),
  google_maps_url: z.string().url().optional().or(z.literal('')),
});

export const taxSettingsSchema = z.object({
  ppn_enabled: z.boolean(),
  ppn_rate: z.number().min(0).max(100),
  pph_enabled: z.boolean(),
  pph_rate: z.number().min(0).max(100),
  inclusive: z.boolean(),
  tax_id_number: z.string().optional(),
});

export const paymentSettingsSchema = z.object({
  methods: z.array(z.enum(['CASH', 'QRIS', 'TRANSFER', 'E_WALLET', 'CREDIT_CARD', 'DEBIT_CARD', 'GIFT_CARD', 'LOYALTY_POINTS', 'MIXED', 'OTHER'])),
  gateway_enabled: z.boolean(),
  gateway_provider: z.enum(['manual', 'midtrans', 'xendit', '']).default('manual'),
  gateway_config: z.object({
    server_key: z.string().optional(),
    client_key: z.string().optional(),
    merchant_id: z.string().optional(),
    is_production: z.boolean().optional(),
  }).optional(),
  manual_payment_instructions: z.object({
    bank_name: z.string().optional(),
    account_number: z.string().optional(),
    account_holder: z.string().optional(),
    qr_image_url: z.string().url().optional().or(z.literal('')),
  }).optional(),
  split_payment: z.boolean(),
  partial_payment: z.boolean(),
});

export const notificationSettingsSchema = z.object({
  whatsapp_enabled: z.boolean(),
  email_enabled: z.boolean(),
  sms_enabled: z.boolean(),
  push_enabled: z.boolean(),
  appointment_reminder: z.boolean(),
  vaccination_reminder: z.boolean(),
  grooming_reminder: z.boolean(),
  hotel_reminder: z.boolean(),
  payment_reminder: z.boolean(),
  promotion_broadcast: z.boolean(),
});

export const loyaltySettingsSchema = z.object({
  enabled: z.boolean(),
  points_per_rupiah: z.number().int().positive(),
  point_value: z.number().positive(),
  expiry_months: z.number().int().min(1).max(120),
  birthday_bonus: z.boolean(),
  referral_bonus: z.number().int().nonnegative(),
});

export const updateSettingSchema = z.object({
  key: z.string().min(1),
  value: z.any(),
});

export const updateSettingsBatchSchema = z.object({
  updates: z.array(updateSettingSchema).min(1),
});
```

### 6.3 Payment Schemas

```typescript
// schemas/payment.ts
import { z } from 'zod';
import { uuidSchema } from './base';

export const manualPaymentSchema = z.object({
  invoice_id: uuidSchema,
  payment_method: z.enum(['CASH', 'QRIS', 'TRANSFER', 'E_WALLET', 'DEBIT_CARD', 'CREDIT_CARD', 'GIFT_CARD', 'LOYALTY_POINTS', 'OTHER']),
  amount: z.number().positive(),
  reference_number: z.string().max(100).optional(),
  proof_url: z.string().url().optional(),
  notes: z.string().max(500).optional(),
});

export const verifyPaymentSchema = z.object({
  payment_id: uuidSchema,
  status: z.enum(['VERIFIED', 'REJECTED']),
  notes: z.string().optional(),
});

export const splitPaymentSchema = z.object({
  invoice_id: uuidSchema,
  payments: z.array(z.object({
    payment_method: z.enum(['CASH', 'QRIS', 'TRANSFER', 'E_WALLET', 'DEBIT_CARD', 'CREDIT_CARD', 'GIFT_CARD', 'LOYALTY_POINTS']),
    amount: z.number().positive(),
    reference_number: z.string().optional(),
    proof_url: z.string().url().optional(),
  })).min(2),
});

export const refundPaymentSchema = z.object({
  payment_id: uuidSchema,
  amount: z.number().positive(),
  reason: z.string().max(500),
});
```

### 6.4 Domain Schemas

```typescript
// schemas/customer.ts
import { z } from 'zod';
import { uuidSchema, dateSchema } from './base';

export const customerTagSchema = z.enum(['VIP', 'REGULAR', 'NEW', 'BLACKLIST', 'WHOLESALE', 'BREEDER']);

export const createCustomerSchema = z.object({
  name: z.string().min(1).max(100),
  phone: z.string().max(20).optional(),
  email: z.string().email().max(100).optional(),
  address: z.string().optional(),
  city: z.string().max(100).optional(),
  postal_code: z.string().max(10).optional(),
  emergency_contact: z.string().max(100).optional(),
  emergency_phone: z.string().max(20).optional(),
  photo_url: z.string().url().optional(),
  notes: z.string().optional(),
  is_guest: z.boolean().default(false),
  tags: z.array(customerTagSchema).default([]),
  custom_fields: z.record(z.any()).optional(),
  referred_by: uuidSchema.optional(),
  birth_date: dateSchema.optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  id_number: z.string().max(50).optional(),
  create_account: z.boolean().default(false),
  username: z.string().min(3).max(50).optional(),
  pin: z.string().length(6).regex(/^\d+$/).optional(),
});

// schemas/pet.ts
export const createPetSchema = z.object({
  customer_id: uuidSchema,
  name: z.string().min(1).max(100),
  species: z.string().min(1).max(50),
  breed: z.string().max(50).optional(),
  birth_date: dateSchema.optional(),
  gender: z.enum(['male', 'female', 'unknown']).optional(),
  color: z.string().max(50).optional(),
  photo_url: z.string().url().optional(),
  microchip_number: z.string().max(50).optional(),
  pedigree_number: z.string().max(50).optional(),
  temperament: z.string().optional(),
  special_needs: z.string().optional(),
  diet_notes: z.string().optional(),
  behavior_notes: z.string().optional(),
  custom_fields: z.record(z.any()).optional(),
  is_neutered: z.boolean().default(false),
});

// schemas/appointment.ts
export const appointmentStatusSchema = z.enum(['SCHEDULED', 'WAITING', 'IN_PROGRESS', 'DONE', 'CANCELLED', 'NO_SHOW']);

export const createAppointmentSchema = z.object({
  customer_id: uuidSchema,
  pet_id: uuidSchema,
  doctor_id: uuidSchema.nullable().optional(),
  appointment_date: dateSchema,
  appointment_time: z.string().regex(/^\d{2}:\d{2}$/),
  duration_minutes: z.number().int().positive().default(30),
  appointment_type: z.enum(['consultation', 'vaccination', 'grooming', 'surgery', 'checkup', 'emergency']).optional(),
  complaint: z.string().optional(),
  notes: z.string().optional(),
  is_from_portal: z.boolean().default(false),
});

// schemas/invoice.ts
export const invoiceTypeSchema = z.enum(['POS', 'CLINICAL', 'PET_HOTEL', 'GROOMING', 'MIXED', 'SUBSCRIPTION', 'TELEMEDICINE']);
export const paymentMethodSchema = z.enum(['CASH', 'QRIS', 'TRANSFER', 'E_WALLET', 'CREDIT_CARD', 'DEBIT_CARD', 'GIFT_CARD', 'LOYALTY_POINTS', 'MIXED', 'OTHER']);

export const invoiceItemSchema = z.object({
  item_type: z.string(),
  product_id: uuidSchema.nullable().optional(),
  procedure_id: uuidSchema.nullable().optional(),
  pet_hotel_booking_id: uuidSchema.nullable().optional(),
  grooming_booking_id: uuidSchema.nullable().optional(),
  prescription_id: uuidSchema.nullable().optional(),
  description: z.string().min(1).max(200),
  quantity: z.number().int().positive().default(1),
  unit_price: z.number().nonnegative(),
  discount_amount: z.number().nonnegative().default(0),
  tax_amount: z.number().nonnegative().default(0),
  batch_number: z.string().optional(),
  expiry_date: dateSchema.optional(),
});

export const createInvoiceSchema = z.object({
  invoice_type: invoiceTypeSchema,
  customer_id: uuidSchema.nullable().optional(),
  items: z.array(invoiceItemSchema).min(1),
  discount_amount: z.number().nonnegative().default(0),
  discount_type: z.enum(['percentage', 'fixed']).optional(),
  tax_amount: z.number().nonnegative().default(0),
  shipping_amount: z.number().nonnegative().default(0),
  promotion_id: uuidSchema.nullable().optional(),
  gift_card_id: uuidSchema.nullable().optional(),
  voucher_code: z.string().optional(),
  loyalty_points_to_redeem: z.number().int().nonnegative().default(0),
  notes: z.string().optional(),
  due_date: dateSchema.optional(),
});

// schemas/product.ts
export const createProductSchema = z.object({
  sku: z.string().min(1).max(50),
  name: z.string().min(1).max(200),
  category_id: uuidSchema.nullable().optional(),
  supplier_id: uuidSchema.nullable().optional(),
  barcode: z.string().max(100).optional(),
  description: z.string().optional(),
  purchase_price: z.number().nonnegative(),
  selling_price: z.number().nonnegative(),
  wholesale_price: z.number().nonnegative().optional(),
  stock_quantity: z.number().int().nonnegative().default(0),
  stock_minimum: z.number().int().nonnegative().default(0),
  stock_maximum: z.number().int().nonnegative().default(0),
  reorder_point: z.number().int().nonnegative().default(0),
  reorder_quantity: z.number().int().nonnegative().default(0),
  photo_url: z.string().url().optional(),
  photo_urls: z.array(z.string().url()).optional(),
  expiry_date: dateSchema.optional(),
  batch_number: z.string().max(50).optional(),
  unit: z.string().max(20).optional(),
  weight_kg: z.number().nonnegative().optional(),
  dimensions: z.record(z.any()).optional(),
  is_serialized: z.boolean().default(false),
  is_batch_tracked: z.boolean().default(false),
  custom_fields: z.record(z.any()).optional(),
});
```

---

## 7. Supabase Client Layer

### 7.1 Client Initialization

```typescript
// lib/supabase/server.ts — Server Components & Server Actions
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookies) {
          cookies.forEach(cookie => {
            cookieStore.set(cookie.name, cookie.value, cookie.options);
          });
        },
      },
    }
  );
}

// lib/supabase/client.ts — Client Components
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// lib/supabase/middleware.ts — Middleware
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export function createClient(request: NextRequest) {
  let response = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookies) {
          cookies.forEach(c => {
            request.cookies.set(c.name, c.value);
            response.cookies.set(c.name, c.value, c.options);
          });
        },
      },
    }
  );
  return { supabase, response };
}

// lib/supabase/admin.ts — Edge Functions (Service Role)
import { createClient } from '@supabase/supabase-js';

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
```

### 7.2 Middleware

```typescript
// middleware.ts
import { createClient } from '@/lib/supabase/middleware';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request);
  const { data: { session } } = await supabase.auth.getSession();
  
  const isAuthRoute = request.nextUrl.pathname.startsWith('/login');
  const isPortalRoute = request.nextUrl.pathname.startsWith('/portal');
  const isKioskRoute = request.nextUrl.pathname.startsWith('/kiosk');
  const isDashboardRoute = !isPortalRoute && !isKioskRoute && !isAuthRoute;
  
  if (!session && (isDashboardRoute || isPortalRoute)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  if (session && isAuthRoute) {
    const role = session.user.user_metadata.role;
    return NextResponse.redirect(
      new URL(role === 'CUSTOMER' ? '/portal' : '/dashboard', request.url)
    );
  }
  
  if (session) {
    const role = session.user.user_metadata.role;
    if (isPortalRoute && role !== 'CUSTOMER') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    if (isDashboardRoute && role === 'CUSTOMER') {
      return NextResponse.redirect(new URL('/portal', request.url));
    }
  }
  
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
```

### 7.3 Domain Services

```typescript
// lib/services/customer.service.ts
import { createClient } from '@/lib/supabase/server';
import type { Customer, CreateCustomerInput, PaginatedResponse } from '@/types';

export class CustomerService {
  static async list(params: {
    page?: number;
    limit?: number;
    search?: string;
    tags?: string[];
    is_active?: boolean;
    branch_id?: string;
  }): Promise<PaginatedResponse<Customer>> {
    const supabase = await createClient();
    const { page = 1, limit = 20, search, tags, is_active = true, branch_id } = params;
    
    let query = supabase
      .from('customers')
      .select('*', { count: 'exact' })
      .eq('is_active', is_active)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);
    
    if (branch_id) query = query.eq('branch_id', branch_id);
    if (search) query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%`);
    if (tags?.length) query = query.overlaps('tags', tags);
    
    const { data, error, count } = await query;
    if (error) throw error;
    
    return {
      data: data as Customer[],
      total: count ?? 0,
      page,
      limit,
      totalPages: Math.ceil((count ?? 0) / limit),
    };
  }
  
  static async getById(id: string): Promise<Customer | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('customers')
      .select(`*, pets(*), loyalty_members(*)`)
      .eq('id', id)
      .is('deleted_at', null)
      .single();
    if (error) throw error;
    return data as Customer;
  }
  
  static async create(input: CreateCustomerInput): Promise<Customer> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('customers')
      .insert(input)
      .select()
      .single();
    if (error) throw error;
    return data as Customer;
  }
}

// lib/services/product.service.ts
import { createClient } from '@/lib/supabase/server';
import type { Product, PaginatedResponse } from '@/types';

export class ProductService {
  static async list(params: {
    page?: number;
    limit?: number;
    search?: string;
    category_id?: string;
    status?: string;
    low_stock?: boolean;
    expiring_soon?: boolean;
    branch_id?: string;
  }): Promise<PaginatedResponse<Product>> {
    const supabase = await createClient();
    const { page = 1, limit = 20, search, category_id, status = 'ACTIVE', low_stock, expiring_soon, branch_id } = params;
    
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' })
      .eq('status', status)
      .is('deleted_at', null)
      .order('name', { ascending: true })
      .range((page - 1) * limit, page * limit - 1);
    
    if (branch_id) query = query.eq('branch_id', branch_id);
    if (search) query = query.or(`name.ilike.%${search}%,sku.ilike.%${search}%,barcode.ilike.%${search}%`);
    if (category_id) query = query.eq('category_id', category_id);
    if (low_stock) query = query.lte('stock_quantity', supabase.rpc('get_reorder_point'));
    if (expiring_soon) {
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      query = query.lte('expiry_date', thirtyDaysFromNow.toISOString()).not('expiry_date', 'is', null);
    }
    
    const { data, error, count } = await query;
    if (error) throw error;
    
    return {
      data: data as Product[],
      total: count ?? 0,
      page,
      limit,
      totalPages: Math.ceil((count ?? 0) / limit),
    };
  }
  
  static async getLowStock(branch_id?: string): Promise<Product[]> {
    const supabase = await createClient();
    let query = supabase
      .from('products')
      .select('*')
      .eq('status', 'ACTIVE')
      .is('deleted_at', null)
      .lte('stock_quantity', supabase.rpc('get_reorder_point'));
    
    if (branch_id) query = query.eq('branch_id', branch_id);
    
    const { data, error } = await query;
    if (error) throw error;
    return data as Product[];
  }
  
  static async getExpiringSoon(days: number = 30, branch_id?: string): Promise<Product[]> {
    const supabase = await createClient();
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + days);
    
    let query = supabase
      .from('products')
      .select('*')
      .eq('status', 'ACTIVE')
      .is('deleted_at', null)
      .lte('expiry_date', expiryDate.toISOString())
      .gt('expiry_date', new Date().toISOString());
    
    if (branch_id) query = query.eq('branch_id', branch_id);
    
    const { data, error } = await query;
    if (error) throw error;
    return data as Product[];
  }
}
```

---

## 8. Server Actions

### 8.1 Pattern Standar

```typescript
// app/actions/[domain].actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import type { ActionResponse } from '@/types';

export async function [actionName]Action(
  input: unknown
): Promise<ActionResponse<T>> {
  // 1. Validate
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'VALIDATION_ERROR', details: parsed.error.flatten() };
  }
  
  // 2. Auth check
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'AUTH_ERROR' };
  
  // 3. Execute
  const { data, error } = await supabase
    .from('[table]')
    .[operation](parsed.data)
    .select()
    .single();
  
  if (error) {
    return { success: false, error: 'DB_ERROR', message: error.message };
  }
  
  // 4. Revalidate
  revalidatePath('[path]');
  
  return { success: true, data };
}
```

### 8.2 Settings Actions

```typescript
// app/actions/settings.actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { SettingsService } from '@/lib/services/settings.service';
import { storeSettingsSchema, paymentSettingsSchema, updateSettingsBatchSchema } from '@/schemas/settings';
import type { ActionResponse } from '@/types';

export async function updateStoreSettingsAction(input: unknown): Promise<ActionResponse> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'AUTH_ERROR' };
  
  const parsed = storeSettingsSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'VALIDATION_ERROR', details: parsed.error.flatten() };
  }
  
  const updates = Object.entries(parsed.data).map(([key, value]) => ({
    key: `general.${key}`,
    value,
  }));
  
  try {
    await SettingsService.updateBatch(updates, user.id);
    revalidatePath('/settings');
    return { success: true, message: 'Pengaturan toko berhasil diperbarui' };
  } catch (error: any) {
    return { success: false, error: 'DB_ERROR', message: error.message };
  }
}

export async function updatePaymentSettingsAction(input: unknown): Promise<ActionResponse> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'AUTH_ERROR' };
  
  const parsed = paymentSettingsSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'VALIDATION_ERROR', details: parsed.error.flatten() };
  }
  
  try {
    await SettingsService.update('payment.methods', parsed.data.methods, user.id);
    await SettingsService.update('payment.gateway_enabled', parsed.data.gateway_enabled, user.id);
    await SettingsService.update('payment.gateway_provider', parsed.data.gateway_provider, user.id);
    await SettingsService.update('payment.gateway_config', parsed.data.gateway_config ?? {}, user.id);
    await SettingsService.update('payment.manual_instructions', parsed.data.manual_payment_instructions ?? {}, user.id);
    
    revalidatePath('/settings/payment');
    return { success: true, message: 'Pengaturan pembayaran berhasil diperbarui' };
  } catch (error: any) {
    return { success: false, error: 'DB_ERROR', message: error.message };
  }
}

export async function updateSettingsBatchAction(input: unknown): Promise<ActionResponse> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'AUTH_ERROR' };
  
  const parsed = updateSettingsBatchSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'VALIDATION_ERROR', details: parsed.error.flatten() };
  }
  
  try {
    await SettingsService.updateBatch(parsed.data.updates, user.id);
    revalidatePath('/settings');
    return { success: true, message: 'Pengaturan berhasil diperbarui' };
  } catch (error: any) {
    return { success: false, error: 'DB_ERROR', message: error.message };
  }
}
```

### 8.3 Payment Actions

```typescript
// app/actions/payment.actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { manualPaymentSchema, verifyPaymentSchema, splitPaymentSchema } from '@/schemas/payment';
import type { ActionResponse } from '@/types';

export async function recordManualPaymentAction(input: unknown): Promise<ActionResponse> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'AUTH_ERROR' };
  
  const parsed = manualPaymentSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'VALIDATION_ERROR', details: parsed.error.flatten() };
  }
  
  const { data: invoice } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', parsed.data.invoice_id)
    .single();
  
  if (!invoice) {
    return { success: false, error: 'NOT_FOUND', message: 'Invoice tidak ditemukan' };
  }
  
  try {
    const isCash = parsed.data.payment_method === 'CASH';
    const { data: payment, error } = await supabase
      .from('payments')
      .insert({
        invoice_id: parsed.data.invoice_id,
        payment_method: parsed.data.payment_method,
        amount: parsed.data.amount,
        payment_status: isCash ? 'VERIFIED' : 'PENDING',
        proof_url: parsed.data.proof_url ?? null,
        reference_number: parsed.data.reference_number ?? null,
        notes: parsed.data.notes ?? null,
        verified_by: isCash ? user.id : null,
        verified_at: isCash ? new Date().toISOString() : null,
        created_by: user.id,
      })
      .select()
      .single();
    
    if (error) throw error;
    
    if (isCash) {
      await updateInvoicePaymentStatus(supabase, invoice.id);
    }
    
    revalidatePath('/pos');
    revalidatePath('/invoices');
    return { success: true, data: payment };
  } catch (error: any) {
    return { success: false, error: 'DB_ERROR', message: error.message };
  }
}

export async function verifyPaymentAction(input: unknown): Promise<ActionResponse> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'AUTH_ERROR' };
  
  const parsed = verifyPaymentSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'VALIDATION_ERROR', details: parsed.error.flatten() };
  }
  
  try {
    const { error } = await supabase
      .from('payments')
      .update({
        payment_status: parsed.data.status,
        verified_by: user.id,
        verified_at: new Date().toISOString(),
        notes: parsed.data.notes ?? null,
      })
      .eq('id', parsed.data.payment_id);
    
    if (error) throw error;
    
    const { data: payment } = await supabase
      .from('payments')
      .select('invoice_id')
      .eq('id', parsed.data.payment_id)
      .single();
    
    if (payment && parsed.data.status === 'VERIFIED') {
      await updateInvoicePaymentStatus(supabase, payment.invoice_id);
    }
    
    revalidatePath('/invoices');
    revalidatePath('/payments');
    return { success: true, message: 'Pembayaran berhasil diverifikasi' };
  } catch (error: any) {
    return { success: false, error: 'DB_ERROR', message: error.message };
  }
}

export async function splitPaymentAction(input: unknown): Promise<ActionResponse> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'AUTH_ERROR' };
  
  const parsed = splitPaymentSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'VALIDATION_ERROR', details: parsed.error.flatten() };
  }
  
  try {
    const payments = [];
    for (const p of parsed.data.payments) {
      const isCash = p.payment_method === 'CASH';
      const { data, error } = await supabase
        .from('payments')
        .insert({
          invoice_id: parsed.data.invoice_id,
          payment_method: p.payment_method,
          amount: p.amount,
          payment_status: isCash ? 'VERIFIED' : 'PENDING',
          proof_url: p.proof_url ?? null,
          reference_number: p.reference_number ?? null,
          verified_by: isCash ? user.id : null,
          verified_at: isCash ? new Date().toISOString() : null,
          created_by: user.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      payments.push(data);
    }
    
    await updateInvoicePaymentStatus(supabase, parsed.data.invoice_id);
    
    revalidatePath('/pos');
    revalidatePath('/invoices');
    return { success: true, data: payments };
  } catch (error: any) {
    return { success: false, error: 'DB_ERROR', message: error.message };
  }
}

async function updateInvoicePaymentStatus(supabase: any, invoiceId: string) {
  const { data: payments } = await supabase
    .from('payments')
    .select('amount')
    .eq('invoice_id', invoiceId)
    .eq('payment_status', 'VERIFIED');
  
  const totalPaid = payments?.reduce((sum: number, p: any) => sum + p.amount, 0) ?? 0;
  
  const { data: invoice } = await supabase
    .from('invoices')
    .select('total_amount')
    .eq('id', invoiceId)
    .single();
  
  let status = 'UNPAID';
  if (totalPaid >= invoice.total_amount) status = 'PAID';
  else if (totalPaid > 0) status = 'PARTIAL_PAYMENT';
  
  await supabase
    .from('invoices')
    .update({ paid_amount: totalPaid, status })
    .eq('id', invoiceId);
}
```

### 8.4 Daftar Server Actions

| Domain | Actions |
|---|---|
| **Auth** | `loginAction`, `logoutAction`, `updatePinAction`, `enable2FAAction` |
| **Customer** | `createCustomerAction`, `updateCustomerAction`, `deleteCustomerAction`, `assignReferralAction` |
| **Pet** | `createPetAction`, `updatePetAction`, `deletePetAction`, `addVaccineAction`, `addWeightLogAction`, `createPassportAction` |
| **Appointment** | `createAppointmentAction`, `updateStatusAction`, `assignDoctorAction`, `checkInAction` |
| **Medical Record** | `createMedicalRecordAction`, `updateMedicalRecordAction`, `closeRecordAction`, `signRecordAction` |
| **Prescription** | `createPrescriptionAction`, `updatePrescriptionStatusAction`, `fulfillPrescriptionAction` |
| **Pet Hotel** | `createBookingAction`, `checkInAction`, `checkOutAction`, `addLogAction` |
| **Grooming** | `createBookingAction`, `updateStatusAction`, `createRecordAction` |
| **Product** | `createProductAction`, `updateProductAction`, `createStockMovementAction`, `createBatchAction` |
| **Invoice** | `createInvoiceAction`, `cancelInvoiceAction`, `refundInvoiceAction` |
| **Payment** | `recordManualPaymentAction`, `verifyPaymentAction`, `splitPaymentAction`, `refundPaymentAction`, `createGatewayPaymentAction` |
| **Settings** | `updateStoreSettingsAction`, `updatePaymentSettingsAction`, `updateSettingsBatchAction` |
| **Loyalty** | `redeemPointsAction`, `adjustPointsAction`, `issueReferralBonusAction` |
| **Promotion** | `createPromotionAction`, `deactivatePromotionAction`, `applyVoucherAction` |
| **Gift Card** | `createGiftCardAction`, `redeemGiftCardAction`, `topUpGiftCardAction` |
| **Subscription** | `createSubscriptionAction`, `pauseSubscriptionAction`, `cancelSubscriptionAction`, `renewSubscriptionAction` |
| **Expense** | `createExpenseAction`, `approveExpenseAction`, `rejectExpenseAction` |
| **Commission** | `createCommissionRuleAction`, `calculateCommissionAction`, `payCommissionAction` |
| **Telemedicine** | `createSessionAction`, `updateSessionStatusAction`, `generateMeetingUrlAction` |
| **Delivery** | `createDeliveryAction`, `assignCourierAction`, `updateDeliveryStatusAction` |
| **Marketing** | `createCampaignAction`, `launchCampaignAction`, `trackCampaignAction` |
| **Feedback** | `createFeedbackAction`, `respondFeedbackAction` |

---

## 9. React Query Hooks

### 9.1 Query Key Factory

```typescript
// lib/query-keys.ts
export const queryKeys = {
  settings: {
    all: ['settings'] as const,
    byCategory: (category: string) => [...queryKeys.settings.all, category] as const,
    key: (key: string) => [...queryKeys.settings.all, 'key', key] as const,
    public: [...queryKeys.settings.all, 'public'] as const,
  },
  payments: {
    all: ['payments'] as const,
    byInvoice: (invoiceId: string) => [...queryKeys.payments.all, invoiceId] as const,
    pending: [...queryKeys.payments.all, 'pending'] as const,
  },
  customers: {
    all: ['customers'] as const,
    lists: () => [...queryKeys.customers.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.customers.lists(), filters] as const,
    details: () => [...queryKeys.customers.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.customers.details(), id] as const,
  },
  pets: {
    all: ['pets'] as const,
    lists: () => [...queryKeys.pets.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.pets.lists(), filters] as const,
    details: () => [...queryKeys.pets.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.pets.details(), id] as const,
    byCustomer: (customerId: string) => [...queryKeys.pets.all, 'byCustomer', customerId] as const,
    healthTimeline: (petId: string) => [...queryKeys.pets.all, 'healthTimeline', petId] as const,
  },
  appointments: {
    all: ['appointments'] as const,
    lists: () => [...queryKeys.appointments.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.appointments.lists(), filters] as const,
    details: () => [...queryKeys.appointments.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.appointments.details(), id] as const,
    byDate: (date: string) => [...queryKeys.appointments.all, 'byDate', date] as const,
    byDoctor: (doctorId: string, date: string) => 
      [...queryKeys.appointments.all, 'byDoctor', doctorId, date] as const,
  },
  medicalRecords: { /* ... */ },
  prescriptions: { /* ... */ },
  petHotel: { /* ... */ },
  grooming: { /* ... */ },
  products: {
    all: ['products'] as const,
    lists: () => [...queryKeys.products.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.products.lists(), filters] as const,
    details: () => [...queryKeys.products.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.products.details(), id] as const,
    lowStock: (branchId?: string) => [...queryKeys.products.all, 'lowStock', branchId] as const,
    expiringSoon: (days: number, branchId?: string) => 
      [...queryKeys.products.all, 'expiringSoon', days, branchId] as const,
  },
  invoices: {
    all: ['invoices'] as const,
    lists: () => [...queryKeys.invoices.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.invoices.lists(), filters] as const,
    details: () => [...queryKeys.invoices.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.invoices.details(), id] as const,
  },
  subscriptions: { /* ... */ },
  loyalty: { /* ... */ },
  promotions: { /* ... */ },
  giftCards: { /* ... */ },
  vouchers: { /* ... */ },
  expenses: { /* ... */ },
  commissions: { /* ... */ },
  telemedicine: { /* ... */ },
  deliveries: { /* ... */ },
  marketing: { /* ... */ },
  feedback: { /* ... */ },
  notifications: {
    all: ['notifications'] as const,
    unread: [...queryKeys.notifications.all, 'unread'] as const,
  },
  branches: {
    all: ['branches'] as const,
    current: [...queryKeys.branches.all, 'current'] as const,
  },
};
```

### 9.2 Settings Hooks

```typescript
// hooks/use-settings.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { SettingsService } from '@/lib/services/settings.service';
import { 
  updateStoreSettingsAction, 
  updatePaymentSettingsAction,
  updateSettingsBatchAction 
} from '@/app/actions/settings.actions';
import type { SettingCategory, StoreSettingsInput, PaymentSettingsInput } from '@/types';

export function useSettings() {
  return useQuery({
    queryKey: queryKeys.settings.all,
    queryFn: () => SettingsService.getAll(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useSettingsByCategory(category: SettingCategory) {
  return useQuery({
    queryKey: queryKeys.settings.byCategory(category),
    queryFn: () => SettingsService.getByCategory(category),
  });
}

export function useSetting<T>(key: string) {
  return useQuery({
    queryKey: queryKeys.settings.key(key),
    queryFn: () => SettingsService.getValue<T>(key),
    staleTime: 5 * 60 * 1000,
  });
}

export function usePublicSettings() {
  return useQuery({
    queryKey: queryKeys.settings.public,
    queryFn: () => SettingsService.getPublicSettings(),
    staleTime: 10 * 60 * 1000,
  });
}

export function useUpdateStoreSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: StoreSettingsInput) => updateStoreSettingsAction(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.all });
    },
  });
}

export function useUpdatePaymentSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: PaymentSettingsInput) => updatePaymentSettingsAction(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.all });
    },
  });
}

export function useUpdateSettingsBatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updates: Array<{ key: string; value: any }>) => 
      updateSettingsBatchAction({ updates }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.all });
    },
  });
}
```

### 9.3 Payment Hooks

```typescript
// hooks/use-payments.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { 
  recordManualPaymentAction, 
  verifyPaymentAction,
  splitPaymentAction,
  createGatewayPaymentAction
} from '@/app/actions/payment.actions';
import type { ManualPaymentInput, VerifyPaymentInput, SplitPaymentInput, GatewayPaymentInput } from '@/types';

export function useRecordManualPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ManualPaymentInput) => recordManualPaymentAction(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.all });
    },
  });
}

export function useVerifyPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: VerifyPaymentInput) => verifyPaymentAction(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.all });
    },
  });
}

export function useSplitPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: SplitPaymentInput) => splitPaymentAction(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.all });
    },
  });
}

export function useCreateGatewayPayment() {
  return useMutation({
    mutationFn: (input: GatewayPaymentInput) => createGatewayPaymentAction(input),
  });
}
```

---

## 10. Component Props Contracts

### 10.1 Settings Components

```typescript
// components/domain/settings/store-settings-form.tsx
interface StoreSettingsFormProps {
  initialData: StoreSettingsInput;
}

// components/domain/settings/payment-settings-form.tsx
interface PaymentSettingsFormProps {
  initialData: PaymentSettingsInput;
}

// components/domain/settings/setting-toggle.tsx
interface SettingToggleProps {
  settingKey: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

// components/domain/settings/setting-input.tsx
interface SettingInputProps {
  settingKey: string;
  label: string;
  description?: string;
  type?: 'text' | 'number' | 'email' | 'url';
  placeholder?: string;
}
```

### 10.2 Payment Components

```typescript
// components/domain/payment/manual-payment-form.tsx
interface ManualPaymentFormProps {
  invoiceId: string;
  totalAmount: number;
  availableMethods: PaymentMethod[];
  onSuccess?: () => void;
}

// components/domain/payment/payment-verification-dialog.tsx
interface PaymentVerificationDialogProps {
  paymentId: string;
  proofUrl: string | null;
  amount: number;
  referenceNumber: string | null;
  onVerified?: () => void;
}

// components/domain/payment/payment-method-selector.tsx
interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod | null;
  availableMethods: PaymentMethod[];
  onChange: (method: PaymentMethod) => void;
  showGatewayOption?: boolean;
  allowSplit?: boolean;
}

// components/domain/payment/cash-shift-summary.tsx
interface CashShiftSummaryProps {
  shiftId: string;
  kasirName: string;
  openingCash: number;
  expectedCash: number;
  actualCash?: number;
  difference?: number;
}

// components/domain/payment/split-payment-form.tsx
interface SplitPaymentFormProps {
  invoiceId: string;
  totalAmount: number;
  availableMethods: PaymentMethod[];
  onSuccess?: () => void;
}
```

### 10.3 Domain Components

```typescript
// components/domain/customer/customer-form.tsx
interface CustomerFormProps {
  customer?: Customer;
  onSuccess?: (customer: Customer) => void;
  onCancel?: () => void;
}

// components/domain/customer/customer-table.tsx
interface CustomerTableProps {
  data: Customer[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    onPageChange: (page: number) => void;
  };
  sorting: {
    column: string;
    direction: 'asc' | 'desc';
    onSort: (column: string) => void;
  };
  onRowClick?: (customer: Customer) => void;
  isLoading?: boolean;
}

// components/domain/pet/pet-health-timeline.tsx
interface PetHealthTimelineProps {
  petId: string;
}

// components/domain/appointment/appointment-calendar.tsx
interface AppointmentCalendarProps {
  doctorId?: string;
  date: string;
  onDateChange: (date: string) => void;
}

// components/domain/appointment/appointment-queue.tsx
interface AppointmentQueueProps {
  date: string;
  doctorId?: string;
}

// components/domain/pos/pos-cart.tsx
interface POSCartProps {
  items: InvoiceItem[];
  onAddItem: (product: Product, qty: number) => void;
  onRemoveItem: (productId: string) => void;
  onUpdateQty: (productId: string, qty: number) => void;
  onClear: () => void;
}

// components/domain/pos/pos-product-grid.tsx
interface POSProductGridProps {
  categoryId?: string;
  search?: string;
  onProductSelect: (product: Product) => void;
}

// components/shared/status-badge.tsx
type StatusVariant = 
  | 'appointment' | 'medical-record' | 'invoice' 
  | 'booking' | 'stock-movement' | 'expense' | 'payment'
  | 'delivery' | 'subscription' | 'telemedicine';

interface StatusBadgeProps {
  status: string;
  variant: StatusVariant;
  size?: 'sm' | 'md';
}
```

---

## 11. Row Level Security (RLS)

### 11.1 Prinsip

- **RLS adalah satu-satunya layer otorisasi** — jangan validasi role di aplikasi
- **Setiap table harus enable RLS** — tidak ada pengecualian
- **Policy per role** — OWNER, ADMIN, MANAGER, DOKTER, KASIR, GROOMER, COURIER, CUSTOMER
- **Branch isolation** — data per-cabang diisolasi via `branch_id`

### 11.2 Settings RLS

```sql
CREATE POLICY "Settings viewable by authenticated staff"
ON settings FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role IN ('OWNER', 'ADMIN', 'MANAGER', 'DOKTER', 'KASIR', 'GROOMER')
  )
);

CREATE POLICY "Settings updatable by owner/admin only"
ON settings FOR UPDATE
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role IN ('OWNER', 'ADMIN')
  )
);

CREATE POLICY "Public settings viewable by anyone authenticated"
ON settings FOR SELECT
TO authenticated
USING (is_public = true);
```

### 11.3 Branch Isolation

```sql
-- Customers: staff lihat cabang sendiri, customer lihat data sendiri
CREATE POLICY "Customers viewable by staff of same branch"
ON customers FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role IN ('OWNER', 'ADMIN', 'MANAGER', 'DOKTER', 'KASIR')
    AND (users.branch_id = customers.branch_id OR customers.branch_id IS NULL)
  )
  OR EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.customer_id = customers.id
  )
);

-- Invoices: branch isolation
CREATE POLICY "Invoices viewable by staff of same branch"
ON invoices FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role IN ('OWNER', 'ADMIN', 'MANAGER', 'DOKTER', 'KASIR')
    AND (users.branch_id = invoices.branch_id OR invoices.branch_id IS NULL)
  )
);

-- Products: branch isolation
CREATE POLICY "Products viewable by staff of same branch"
ON products FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role IN ('OWNER', 'ADMIN', 'MANAGER', 'DOKTER', 'KASIR', 'GROOMER')
    AND (users.branch_id = products.branch_id OR products.branch_id IS NULL)
  )
);
```

### 11.4 Payment RLS

```sql
CREATE POLICY "Payments insertable by kasir+"
ON payments FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role IN ('OWNER', 'ADMIN', 'MANAGER', 'KASIR')
  )
);

CREATE POLICY "Payments viewable by staff"
ON payments FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role IN ('OWNER', 'ADMIN', 'MANAGER', 'DOKTER', 'KASIR')
  )
);

CREATE POLICY "Payments updatable by owner/admin (verification)"
ON payments FOR UPDATE
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role IN ('OWNER', 'ADMIN', 'MANAGER')
  )
);
```

### 11.5 Medical Records RLS

```sql
CREATE POLICY "Medical records viewable by medical staff"
ON medical_records FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role IN ('OWNER', 'ADMIN', 'MANAGER', 'DOKTER')
    AND (users.branch_id = medical_records.branch_id OR medical_records.branch_id IS NULL)
  )
  OR EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.customer_id IN (
      SELECT customer_id FROM appointments WHERE appointments.id = medical_records.appointment_id
    )
  )
);
```

---

## 12. State Management

### 12.1 State Layers

| Layer | Tool | Use Case |
|---|---|---|
| **Server State** | TanStack Query | Data dari Supabase, cache, refetch |
| **Global UI State** | Zustand | Sidebar, theme, notifications, branch |
| **Settings Cache** | Zustand + React Query | Settings yang sering diakses |
| **Local Form State** | React Hook Form | Form inputs, validation |
| **URL State** | Next.js `searchParams` | Filters, pagination, sorting |

### 12.2 Settings Store

```typescript
// stores/settings-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { StoreSettings, PaymentSettings, LoyaltySettings } from '@/types';

interface SettingsStore {
  store: StoreSettings | null;
  payment: PaymentSettings | null;
  loyalty: LoyaltySettings | null;
  
  setStore: (settings: StoreSettings) => void;
  setPayment: (settings: PaymentSettings) => void;
  setLoyalty: (settings: LoyaltySettings) => void;
  reset: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      store: null,
      payment: null,
      loyalty: null,
      setStore: (settings) => set({ store: settings }),
      setPayment: (settings) => set({ payment: settings }),
      setLoyalty: (settings) => set({ loyalty: settings }),
      reset: () => set({ store: null, payment: null, loyalty: null }),
    }),
    { 
      name: 'petora-settings',
      partialize: (state) => ({ 
        store: state.store,
        payment: state.payment,
        loyalty: state.loyalty,
      }),
    }
  )
);
```

### 12.3 POS Store

```typescript
// stores/pos-store.ts
import { create } from 'zustand';
import type { Product, InvoiceItem } from '@/types';

interface POSStore {
  cart: InvoiceItem[];
  selectedCustomerId: string | null;
  selectedPromotionId: string | null;
  selectedVoucherId: string | null;
  selectedGiftCardId: string | null;
  pointsToRedeem: number;
  splitPayments: Array<{ method: string; amount: number }>;
  
  addItem: (product: Product, qty: number) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  setCustomer: (id: string | null) => void;
  setPromotion: (id: string | null) => void;
  setVoucher: (id: string | null) => void;
  setGiftCard: (id: string | null) => void;
  setPointsToRedeem: (points: number) => void;
  addSplitPayment: (method: string, amount: number) => void;
  removeSplitPayment: (index: number) => void;
  clearSplitPayments: () => void;
}
```

### 12.4 UI Store

```typescript
// stores/ui-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIStore {
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  currentBranchId: string | null;
  language: string;
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setCurrentBranch: (id: string | null) => void;
  setLanguage: (lang: string) => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      theme: 'system',
      currentBranchId: null,
      language: 'id',
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setTheme: (theme) => set({ theme }),
      setCurrentBranch: (id) => set({ currentBranchId: id }),
      setLanguage: (lang) => set({ language: lang }),
    }),
    { name: 'petora-ui' }
  )
);
```

---

## 13. Error Handling

### 13.1 Error Types

```typescript
// lib/errors.ts
export class AppError extends Error {
  constructor(
    public code: 'VALIDATION' | 'AUTH' | 'FORBIDDEN' | 'NOT_FOUND' | 'DB' | 'NETWORK' | 'SETTINGS' | 'PAYMENT' | 'UNKNOWN',
    message: string,
    public details?: Record<string, any>
  ) {
    super(message);
  }
}

export class SettingsError extends AppError {
  constructor(message: string, details?: Record<string, any>) {
    super('SETTINGS', message, details);
  }
}

export class PaymentError extends AppError {
  constructor(message: string, details?: Record<string, any>) {
    super('PAYMENT', message, details);
  }
}
```

### 13.2 Error Boundaries

```typescript
// app/error.tsx (global)
'use client';

export default function GlobalError({ error, reset }: { 
  error: Error & { digest?: string }; 
  reset: () => void 
}) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">Terjadi Kesalahan</h1>
        <p className="text-muted-foreground">{error.message}</p>
        <Button onClick={reset}>Coba Lagi</Button>
      </div>
    </div>
  );
}
```

### 13.3 Toast Helper

```typescript
// lib/toast.ts
import { toast } from 'sonner';
import type { ActionResponse } from '@/types';

export function handleActionResponse<T>(response: ActionResponse<T>) {
  if (response.success) {
    toast.success('Berhasil', { 
      description: response.message ?? 'Operasi berhasil' 
    });
  } else {
    const messages: Record<string, string> = {
      VALIDATION_ERROR: 'Data tidak valid, silakan periksa kembali',
      DB_ERROR: 'Gagal menyimpan data',
      AUTH_ERROR: 'Sesi berakhir, silakan login ulang',
      FORBIDDEN: 'Anda tidak memiliki akses',
      NOT_FOUND: 'Data tidak ditemukan',
      SETTINGS_ERROR: 'Gagal memuat pengaturan',
      PAYMENT_ERROR: 'Gagal memproses pembayaran',
      UNKNOWN: 'Terjadi kesalahan',
    };
    toast.error(messages[response.error ?? 'UNKNOWN'], {
      description: response.message,
    });
  }
}
```

---

## 14. File Structure

```
petora/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   └── layout.tsx
│   │
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── customers/
│   │   ├── pets/
│   │   ├── appointments/
│   │   ├── medical-records/
│   │   ├── pet-hotel/
│   │   ├── grooming/
│   │   ├── products/
│   │   ├── inventory/
│   │   ├── pos/
│   │   ├── invoices/
│   │   ├── payments/
│   │   ├── subscriptions/
│   │   ├── loyalty/
│   │   ├── promotions/
│   │   ├── expenses/
│   │   ├── employees/
│   │   ├── telemedicine/
│   │   ├── delivery/
│   │   ├── marketing/
│   │   ├── feedback/
│   │   ├── reports/
│   │   ├── kiosk/
│   │   └── settings/
│   │       ├── page.tsx
│   │       ├── general/page.tsx
│   │       ├── branches/page.tsx
│   │       ├── payment/page.tsx
│   │       ├── tax/page.tsx
│   │       ├── loyalty/page.tsx
│   │       ├── notification/page.tsx
│   │       ├── printer/page.tsx
│   │       ├── reminder/page.tsx
│   │       ├── receipt/page.tsx
│   │       ├── security/page.tsx
│   │       ├── integration/page.tsx
│   │       ├── backup/page.tsx
│   │       ├── employees/page.tsx
│   │       ├── subscription/page.tsx
│   │       ├── delivery/page.tsx
│   │       ├── inventory/page.tsx
│   │       ├── custom-fields/page.tsx
│   │       └── advanced/page.tsx
│   │
│   ├── (portal)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── bookings/
│   │   ├── pets/
│   │   ├── medical-records/
│   │   ├── loyalty/
│   │   ├── subscriptions/
│   │   ├── invoices/
│   │   └── profile/
│   │
│   ├── (kiosk)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── check-in/page.tsx
│   │   └── booking/page.tsx
│   │
│   ├── actions/
│   │   ├── auth.actions.ts
│   │   ├── customer.actions.ts
│   │   ├── pet.actions.ts
│   │   ├── appointment.actions.ts
│   │   ├── medical-record.actions.ts
│   │   ├── prescription.actions.ts
│   │   ├── pet-hotel.actions.ts
│   │   ├── grooming.actions.ts
│   │   ├── product.actions.ts
│   │   ├── invoice.actions.ts
│   │   ├── payment.actions.ts
│   │   ├── settings.actions.ts
│   │   ├── loyalty.actions.ts
│   │   ├── promotion.actions.ts
│   │   ├── gift-card.actions.ts
│   │   ├── voucher.actions.ts
│   │   ├── subscription.actions.ts
│   │   ├── expense.actions.ts
│   │   ├── commission.actions.ts
│   │   ├── telemedicine.actions.ts
│   │   ├── delivery.actions.ts
│   │   ├── marketing.actions.ts
│   │   └── feedback.actions.ts
│   │
│   ├── api/webhook/
│   │   ├── midtrans/route.ts
│   │   ├── fonnte/route.ts
│   │   └── resend/route.ts
│   │
│   ├── layout.tsx
│   ├── globals.css
│   ├── not-found.tsx
│   ├── error.tsx
│   └── loading.tsx
│
├── components/
│   ├── ui/                               # shadcn/ui
│   ├── shared/
│   │   ├── data-table/
│   │   ├── search-input.tsx
│   │   ├── status-badge.tsx
│   │   ├── empty-state.tsx
│   │   ├── loading-skeleton.tsx
│   │   ├── error-boundary.tsx
│   │   ├── confirm-dialog.tsx
│   │   ├── file-upload.tsx
│   │   ├── global-search.tsx
│   │   ├── quick-actions.tsx
│   │   ├── offline-banner.tsx
│   │   ├── payment-proof-viewer.tsx
│   │   ├── barcode-scanner.tsx
│   │   ├── thermal-printer.tsx
│   │   ├── signature-pad.tsx
│   │   └── pdf-viewer.tsx
│   │
│   ├── domain/
│   │   ├── customer/
│   │   ├── pet/
│   │   ├── appointment/
│   │   ├── medical-record/
│   │   ├── prescription/
│   │   ├── pet-hotel/
│   │   ├── grooming/
│   │   ├── product/
│   │   ├── invoice/
│   │   ├── payment/
│   │   ├── subscription/
│   │   ├── loyalty/
│   │   ├── promotion/
│   │   ├── gift-card/
│   │   ├── voucher/
│   │   ├── expense/
│   │   ├── employee/
│   │   ├── telemedicine/
│   │   ├── delivery/
│   │   ├── marketing/
│   │   ├── feedback/
│   │   ├── reports/
│   │   ├── settings/
│   │   ├── pos/
│   │   ├── kiosk/
│   │   └── dashboard/
│   │
│   └── layout/
│       ├── sidebar.tsx
│       ├── header.tsx
│       ├── mobile-nav.tsx
│       ├── branch-switcher.tsx
│       └── user-menu.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── server.ts
│   │   ├── client.ts
│   │   ├── middleware.ts
│   │   └── admin.ts
│   ├── services/
│   │   ├── customer.service.ts
│   │   ├── pet.service.ts
│   │   ├── product.service.ts
│   │   ├── invoice.service.ts
│   │   ├── settings.service.ts
│   │   ├── payment.service.ts
│   │   ├── loyalty.service.ts
│   │   ├── subscription.service.ts
│   │   ├── delivery.service.ts
│   │   ├── telemedicine.service.ts
│   │   ├── expiry.service.ts
│   │   ├── upload.service.ts
│   │   └── pdf.service.ts
│   ├── constants/
│   │   └── default-settings.ts
│   ├── utils/
│   │   ├── cn.ts
│   │   ├── format-date.ts
│   │   ├── format-currency.ts
│   │   ├── smart-defaults.ts
│   │   ├── barcode.ts
│   │   └── pdf.ts
│   ├── query-keys.ts
│   ├── errors.ts
│   ├── toast.ts
│   └── constants.ts
│
├── hooks/
│   ├── use-auth.ts
│   ├── use-customers.ts
│   ├── use-pets.ts
│   ├── use-appointments.ts
│   ├── use-products.ts
│   ├── use-invoices.ts
│   ├── use-settings.ts
│   ├── use-payments.ts
│   ├── use-subscriptions.ts
│   ├── use-loyalty.ts
│   ├── use-delivery.ts
│   ├── use-telemedicine.ts
│   ├── use-online-status.ts
│   ├── use-keyboard-shortcuts.ts
│   ├── use-low-stock-alert.ts
│   ├── use-realtime-appointments.ts
│   └── use-realtime-notifications.ts
│
├── stores/
│   ├── ui-store.ts
│   ├── pos-store.ts
│   ├── settings-store.ts
│   └── notification-store.ts
│
├── types/
│   ├── base.ts
│   ├── user.ts
│   ├── customer.ts
│   ├── pet.ts
│   ├── appointment.ts
│   ├── medical-record.ts
│   ├── prescription.ts
│   ├── product.ts
│   ├── invoice.ts
│   ├── payment.ts
│   ├── subscription.ts
│   ├── delivery.ts
│   ├── telemedicine.ts
│   ├── branch.ts
│   ├── settings.ts
│   └── ...
│
├── schemas/
│   ├── base.ts
│   ├── user.ts
│   ├── customer.ts
│   ├── pet.ts
│   ├── appointment.ts
│   ├── medical-record.ts
│   ├── prescription.ts
│   ├── product.ts
│   ├── invoice.ts
│   ├── payment.ts
│   ├── subscription.ts
│   ├── delivery.ts
│   ├── telemedicine.ts
│   ├── settings.ts
│   └── ...
│
├── supabase/
│   ├── functions/
│   │   ├── _shared/
│   │   │   ├── supabase.ts
│   │   │   ├── cors.ts
│   │   │   └── types.ts
│   │   ├── send-whatsapp/
│   │   ├── send-email/
│   │   ├── send-sms/
│   │   ├── send-appointment-reminder/
│   │   ├── send-vaccination-reminder/
│   │   ├── generate-daily-report/
│   │   ├── create-gateway-payment/
│   │   ├── process-webhook/
│   │   ├── generate-pdf/
│   │   ├── process-subscription-billing/
│   │   └── run-backup/
│   ├── migrations/
│   │   ├── 0001_initial_schema.sql
│   │   ├── 0002_settings_table.sql
│   │   ├── 0003_seed_default_settings.sql
│   │   ├── 0004_branches_and_multi_tenant.sql
│   │   ├── 0005_payment_enhancements.sql
│   │   ├── 0006_subscriptions_and_gift_cards.sql
│   │   ├── 0007_telemedicine_and_delivery.sql
│   │   └── 0008_rls_policies.sql
│   └── seed/
│       ├── default-settings.sql
│       ├── loyalty-tiers.sql
│       └── default-owner.sql
│
├── scripts/
│   ├── setup.sh
│   ├── deploy.sh
│   └── seed.ts
│
├── messages/                              # i18n
│   ├── id.json
│   └── en.json
│
├── public/
│   ├── manifest.json                      # PWA
│   ├── sw.js                              # Service Worker
│   └── icons/
│
├── middleware.ts
├── next.config.ts
├── vercel.json
├── package.json
├── tsconfig.json
├── components.json
├── i18n.ts
├── .env.example
└── README.md
```

---

## 15. Environment Variables

```bash
# .env.example

# ============ Supabase (WAJIB) ============
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # Hanya untuk Edge Functions

# ============ App Config ============
NEXT_PUBLIC_APP_URL=https://petora.vercel.app
NEXT_PUBLIC_APP_NAME=Petora
NEXT_PUBLIC_APP_ENV=production

# ============ Payment Gateway (OPSIONAL) ============
MIDTRANS_SERVER_KEY=
MIDTRANS_CLIENT_KEY=
MIDTRANS_MERCHANT_ID=
MIDTRANS_IS_PRODUCTION=false

# ============ Integration (OPSIONAL) ============
FONNTE_TOKEN=
FONNTE_DEVICE=
RESEND_API_KEY=
RESEND_FROM_EMAIL=noreply@petora.app
SMS_GATEWAY=
SMS_API_KEY=

# ============ Feature Flags ============
NEXT_PUBLIC_ENABLE_LOYALTY=true
NEXT_PUBLIC_ENABLE_PORTAL=true
NEXT_PUBLIC_ENABLE_KIOSK=true
NEXT_PUBLIC_ENABLE_TELEMEDICINE=true
NEXT_PUBLIC_ENABLE_DELIVERY=true
NEXT_PUBLIC_ENABLE_SUBSCRIPTION=true
NEXT_PUBLIC_ENABLE_GATEWAY=false

# ============ Security ============
NEXTAUTH_SECRET=
WEBHOOK_SECRET=
ENCRYPTION_KEY=
```

### 15.1 Rules

- **`NEXT_PUBLIC_*`** → terekspos ke browser (anon key, config)
- **Tanpa prefix** → hanya di server/edge (service role, API keys)
- **JANGAN** commit `.env.local` ke git
- **Selalu** tambahkan ke Vercel dashboard untuk production
- **Payment gateway & integration keys** bersifat OPSIONAL — hanya diisi jika Owner mengaktifkan

---

## 16. Payment System

### 16.1 Arsitektur Payment

```
┌─────────────────────────────────────────────────────────────┐
│                    Payment Flow                              │
└─────────────────────────────────────────────────────────────┘

                    ┌──────────────────┐
                    │   POS / Invoice  │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  Payment Method  │
                    │    Selector      │
                    └────────┬─────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
    ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
    │ Manual       │ │ Split        │ │ Gateway      │
    │ Payment      │ │ Payment      │ │ Payment      │
    └──────┬───────┘ └──────┬───────┘ └──────┬───────┘
           │                │                │
           ▼                ▼                ▼
    ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
    │ - CASH       │ │ - Multiple   │ │ - Midtrans   │
    │ - TRANSFER   │ │   methods    │ │ - Xendit     │
    │ - QRIS       │ │ - Auto calc  │ │ - dll        │
    │ - E_WALLET   │ │              │ │              │
    │ - GIFT_CARD  │ │              │ │              │
    │ - LOYALTY    │ │              │ │              │
    └──────┬───────┘ └──────┬───────┘ └──────┬───────┘
           │                │                │
           └────────────────┼────────────────┘
                            │
                            ▼
                   ┌──────────────────┐
                   │  Payment Record  │
                   │  (PENDING/       │
                   │   VERIFIED)      │
                   └────────┬─────────┘
                            │
                            ▼
                   ┌──────────────────┐
                   │  Invoice Status  │
                   │  Update          │
                   └──────────────────┘
```

### 16.2 Payment Methods Matrix

| Method | Type | Auto Verify | Proof Required | Use Case |
|---|---|---|---|---|
| **CASH** | Manual | ✅ Ya | ❌ Tidak | Transaksi tunai di kasir |
| **QRIS** | Manual | ❌ Tidak | ✅ Ya (screenshot) | Scan QR di kasir |
| **TRANSFER** | Manual | ❌ Tidak | ✅ Ya (bukti transfer) | Transfer bank |
| **E_WALLET** | Manual | ❌ Tidak | ✅ Ya (screenshot) | GoPay, OVO, Dana |
| **CREDIT_CARD** | Gateway | ✅ Ya | ❌ Tidak | Kartu kredit via gateway |
| **DEBIT_CARD** | Manual | ✅ Ya | ❌ Tidak | Kartu debit EDC |
| **GIFT_CARD** | Internal | ✅ Ya | ❌ Tidak | Gift card Petora |
| **LOYALTY_POINTS** | Internal | ✅ Ya | ❌ Tidak | Tukar poin loyalitas |
| **MIXED** | Mixed | ⚠️ Partial | ⚠️ Partial | Gabungan beberapa metode |
| **OTHER** | Manual | ❌ Tidak | ✅ Ya | Metode custom |

### 16.3 Payment Service

```typescript
// lib/services/payment.service.ts
import { createClient } from '@/lib/supabase/server';
import { SettingsService } from './settings.service';
import type { PaymentSettings, PaymentMethod } from '@/types';

export class PaymentService {
  static async getAvailableMethods(): Promise<PaymentMethod[]> {
    const settings = await SettingsService.getValue<PaymentSettings>('payment.settings');
    return settings?.methods ?? ['CASH'];
  }
  
  static async isGatewayEnabled(): Promise<boolean> {
    const settings = await SettingsService.getValue<PaymentSettings>('payment.settings');
    return settings?.gateway_enabled ?? false;
  }
  
  static async getManualInstructions() {
    const settings = await SettingsService.getValue<PaymentSettings>('payment.settings');
    return settings?.manual_payment_instructions ?? null;
  }
  
  static async calculatePaymentStatus(invoiceId: string): Promise<{
    total_paid: number;
    total_amount: number;
    status: 'UNPAID' | 'PARTIAL_PAYMENT' | 'PAID';
  }> {
    const supabase = await createClient();
    
    const { data: payments } = await supabase
      .from('payments')
      .select('amount')
      .eq('invoice_id', invoiceId)
      .eq('payment_status', 'VERIFIED');
    
    const { data: invoice } = await supabase
      .from('invoices')
      .select('total_amount')
      .eq('id', invoiceId)
      .single();
    
    const total_paid = payments?.reduce((sum, p) => sum + p.amount, 0) ?? 0;
    const total_amount = invoice?.total_amount ?? 0;
    
    let status: 'UNPAID' | 'PARTIAL_PAYMENT' | 'PAID' = 'UNPAID';
    if (total_paid >= total_amount) status = 'PAID';
    else if (total_paid > 0) status = 'PARTIAL_PAYMENT';
    
    return { total_paid, total_amount, status };
  }
}
```

---

## 17. Advanced Features

### 17.1 Telemedicine

```typescript
// lib/services/telemedicine.service.ts
export class TelemedicineService {
  static async createSession(input: CreateTelemedicineSessionInput): Promise<TelemedicineSession> {
    const supabase = await createClient();
    
    // Generate meeting URL via Edge Function
    const { data: meetingData } = await supabase.functions.invoke('create-video-meeting', {
      body: { scheduled_at: input.scheduled_at, duration: input.duration_minutes }
    });
    
    const { data, error } = await supabase
      .from('telemedicine_sessions')
      .insert({
        ...input,
        session_number: await generateSessionNumber(),
        meeting_url: meetingData?.url,
        meeting_id: meetingData?.id,
      })
      .select()
      .single();
    
    if (error) throw error;
    return data as TelemedicineSession;
  }
  
  static async joinSession(sessionId: string): Promise<{ url: string }> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('telemedicine_sessions')
      .select('meeting_url')
      .eq('id', sessionId)
      .single();
    
    if (error) throw error;
    return { url: data.meeting_url };
  }
}
```

### 17.2 Delivery Management

```typescript
// lib/services/delivery.service.ts
export class DeliveryService {
  static async createDelivery(input: CreateDeliveryInput): Promise<Delivery> {
    const supabase = await createClient();
    
    // Auto-assign courier based on zone
    const courier = await this.autoAssignCourier(input.delivery_zone_id);
    
    const { data, error } = await supabase
      .from('deliveries')
      .insert({
        ...input,
        delivery_number: await generateDeliveryNumber(),
        courier_id: courier?.id ?? null,
        status: courier ? 'ASSIGNED' : 'PENDING',
      })
      .select()
      .single();
    
    if (error) throw error;
    return data as Delivery;
  }
  
  static async autoAssignCourier(zoneId: string): Promise<User | null> {
    const supabase = await createClient();
    
    // Find courier with least active deliveries in this zone
    const { data } = await supabase
      .from('users')
      .select(`
        *,
        active_deliveries:deliveries(count)
      `)
      .eq('role', 'COURIER')
      .eq('is_active', true)
      .order('active_deliveries', { ascending: true })
      .limit(1)
      .single();
    
    return data as User | null;
  }
  
  static async updateStatus(deliveryId: string, status: DeliveryStatus, proof?: string): Promise<void> {
    const supabase = await createClient();
    
    const updateData: any = { status };
    if (status === 'PICKED_UP') updateData.picked_up_at = new Date().toISOString();
    if (status === 'DELIVERED') updateData.delivered_at = new Date().toISOString();
    if (proof) updateData.proof_photo_url = proof;
    
    const { error } = await supabase
      .from('deliveries')
      .update(updateData)
      .eq('id', deliveryId);
    
    if (error) throw error;
  }
}
```

### 17.3 Subscription Management

```typescript
// lib/services/subscription.service.ts
export class SubscriptionService {
  static async createSubscription(input: CreateSubscriptionInput): Promise<Subscription> {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('subscriptions')
      .insert({
        ...input,
        subscription_number: await generateSubscriptionNumber(),
        next_billing_date: this.calculateNextBillingDate(input.start_date, input.plan.billing_cycle),
      })
      .select()
      .single();
    
    if (error) throw error;
    return data as Subscription;
  }
  
  static async processRenewal(subscriptionId: string): Promise<void> {
    const supabase = await createClient();
    
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*, subscription_plans(*)')
      .eq('id', subscriptionId)
      .single();
    
    if (!subscription || !subscription.auto_renew) return;
    
    // Create renewal invoice
    const invoice = await InvoiceService.create({
      invoice_type: 'SUBSCRIPTION',
      customer_id: subscription.customer_id,
      items: [{
        item_type: 'subscription',
        description: `${subscription.subscription_plans.name} - Renewal`,
        quantity: 1,
        unit_price: subscription.subscription_plans.price,
      }],
    }, subscription.customer_id);
    
    // Update next billing date
    const nextBillingDate = this.calculateNextBillingDate(
      subscription.next_billing_date,
      subscription.subscription_plans.billing_cycle
    );
    
    await supabase
      .from('subscriptions')
      .update({ next_billing_date: nextBillingDate })
      .eq('id', subscriptionId);
  }
  
  static calculateNextBillingDate(currentDate: string, cycle: string): string {
    const date = new Date(currentDate);
    switch (cycle) {
      case 'daily': date.setDate(date.getDate() + 1); break;
      case 'weekly': date.setDate(date.getDate() + 7); break;
      case 'monthly': date.setMonth(date.getMonth() + 1); break;
      case 'quarterly': date.setMonth(date.getMonth() + 3); break;
      case 'yearly': date.setFullYear(date.getFullYear() + 1); break;
    }
    return date.toISOString().slice(0, 10);
  }
}
```

### 17.4 Loyalty Program

```typescript
// lib/services/loyalty.service.ts
export class LoyaltyService {
  static async earnPoints(customerId: string, invoiceId: string, amount: number): Promise<void> {
    const supabase = await createClient();
    const settings = await SettingsService.getValue<any>('loyalty.settings');
    
    if (!settings?.enabled) return;
    
    // Get or create loyalty member
    let { data: member } = await supabase
      .from('loyalty_members')
      .select('*')
      .eq('customer_id', customerId)
      .maybeSingle();
    
    if (!member) {
      const { data } = await supabase
        .from('loyalty_members')
        .insert({ customer_id: customerId })
        .select()
        .single();
      member = data;
    }
    
    // Calculate points
    const points = Math.floor(amount / settings.points_per_rupiah);
    const tierMultiplier = await this.getTierMultiplier(member.tier_id);
    const finalPoints = Math.floor(points * tierMultiplier);
    
    // Birthday bonus
    const customer = await CustomerService.getById(customerId);
    const isBirthday = this.isBirthday(customer?.birth_date);
    const birthdayBonus = isBirthday && settings.birthday_bonus ? finalPoints : 0;
    
    const totalPoints = finalPoints + birthdayBonus;
    
    // Record transaction
    await supabase.from('loyalty_transactions').insert({
      member_id: member.id,
      transaction_type: 'EARN',
      points: totalPoints,
      invoice_id: invoiceId,
      description: isBirthday ? 'Earned points + birthday bonus' : 'Earned points from purchase',
      expiry_date: this.calculateExpiryDate(settings.expiry_months),
    });
    
    // Update member
    await supabase
      .from('loyalty_members')
      .update({
        total_points: member.total_points + totalPoints,
        available_points: member.available_points + totalPoints,
        total_spending: member.total_spending + amount,
      })
      .eq('id', member.id);
    
    // Check tier upgrade
    await this.checkTierUpgrade(member.id);
    
    // Update invoice
    await supabase
      .from('invoices')
      .update({ loyalty_points_earned: totalPoints })
      .eq('id', invoiceId);
  }
  
  static async redeemPoints(customerId: string, points: number, invoiceId: string): Promise<void> {
    const supabase = await createClient();
    const settings = await SettingsService.getValue<any>('loyalty.settings');
    
    const { data: member } = await supabase
      .from('loyalty_members')
      .select('*')
      .eq('customer_id', customerId)
      .single();
    
    if (member.available_points < points) {
      throw new Error('Insufficient points');
    }
    
    const discountValue = points * settings.point_value;
    
    await supabase.from('loyalty_transactions').insert({
      member_id: member.id,
      transaction_type: 'REDEEM',
      points: -points,
      invoice_id: invoiceId,
      description: `Redeemed ${points} points for Rp ${discountValue} discount`,
    });
    
    await supabase
      .from('loyalty_members')
      .update({
        available_points: member.available_points - points,
      })
      .eq('id', member.id);
    
    await supabase
      .from('invoices')
      .update({ loyalty_points_redeemed: points })
      .eq('id', invoiceId);
  }
  
  static async checkTierUpgrade(memberId: string): Promise<void> {
    const supabase = await createClient();
    
    const { data: member } = await supabase
      .from('loyalty_members')
      .select('*')
      .eq('id', memberId)
      .single();
    
    const { data: tiers } = await supabase
      .from('loyalty_tiers')
      .select('*')
      .order('min_points', { ascending: true });
    
    const newTier = tiers?.find(tier => 
      member.total_points >= tier.min_points && 
      member.total_spending >= tier.min_spending
    );
    
    if (newTier && newTier.id !== member.tier_id) {
      await supabase
        .from('loyalty_members')
        .update({ tier_id: newTier.id })
        .eq('id', memberId);
    }
  }
  
  static async getTierMultiplier(tierId: string | null): Promise<number> {
    if (!tierId) return 1.0;
    
    const supabase = await createClient();
    const { data } = await supabase
      .from('loyalty_tiers')
      .select('point_multiplier')
      .eq('id', tierId)
      .single();
    
    return data?.point_multiplier ?? 1.0;
  }
  
  static isBirthday(birthDate: string | null): boolean {
    if (!birthDate) return false;
    const today = new Date();
    const birth = new Date(birthDate);
    return today.getMonth() === birth.getMonth() && today.getDate() === birth.getDate();
  }
  
  static calculateExpiryDate(months: number): string {
    const date = new Date();
    date.setMonth(date.getMonth() + months);
    return date.toISOString().slice(0, 10);
  }
}
```

### 17.5 Gift Cards & Vouchers

```typescript
// lib/services/gift-card.service.ts
export class GiftCardService {
  static async create(input: { amount: number; customer_id?: string }): Promise<GiftCard> {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('gift_cards')
      .insert({
        card_number: this.generateCardNumber(),
        pin: this.generatePin(),
        initial_amount: input.amount,
        current_balance: input.amount,
        customer_id: input.customer_id ?? null,
        purchased_by: input.customer_id ?? null,
      })
      .select()
      .single();
    
    if (error) throw error;
    return data as GiftCard;
  }
  
  static async redeem(cardNumber: string, pin: string, amount: number): Promise<void> {
    const supabase = await createClient();
    
    const { data: card, error } = await supabase
      .from('gift_cards')
      .select('*')
      .eq('card_number', cardNumber)
      .eq('pin', pin)
      .eq('status', 'ACTIVE')
      .single();
    
    if (error || !card) throw new Error('Invalid gift card');
    if (card.current_balance < amount) throw new Error('Insufficient balance');
    if (card.expiry_date && new Date(card.expiry_date) < new Date()) {
      throw new Error('Gift card expired');
    }
    
    await supabase
      .from('gift_cards')
      .update({ current_balance: card.current_balance - amount })
      .eq('id', card.id);
  }
  
  static generateCardNumber(): string {
    const prefix = 'GC';
    const random = Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0');
    return `${prefix}${random}`;
  }
  
  static generatePin(): string {
    return Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  }
}

// lib/services/voucher.service.ts
export class VoucherService {
  static async apply(code: string, customerId: string | null, subtotal: number): Promise<{
    valid: boolean;
    discount: number;
    message?: string;
  }> {
    const supabase = await createClient();
    
    const { data: voucher, error } = await supabase
      .from('vouchers')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('status', 'ACTIVE')
      .single();
    
    if (error || !voucher) {
      return { valid: false, discount: 0, message: 'Voucher tidak ditemukan' };
    }
    
    // Check date
    const now = new Date();
    if (now < new Date(voucher.start_date) || now > new Date(voucher.end_date)) {
      return { valid: false, discount: 0, message: 'Voucher tidak berlaku' };
    }
    
    // Check usage limit
    if (voucher.max_usage && voucher.current_usage >= voucher.max_usage) {
      return { valid: false, discount: 0, message: 'Voucher sudah habis digunakan' };
    }
    
    // Check per-customer limit
    if (customerId && voucher.per_customer_limit) {
      const { count } = await supabase
        .from('voucher_usage')
        .select('*', { count: 'exact', head: true })
        .eq('voucher_id', voucher.id)
        .eq('customer_id', customerId);
      
      if (count && count >= voucher.per_customer_limit) {
        return { valid: false, discount: 0, message: 'Anda sudah menggunakan voucher ini' };
      }
    }
    
    // Check minimum purchase
    if (subtotal < voucher.min_purchase) {
      return { valid: false, discount: 0, message: `Minimum pembelian Rp ${voucher.min_purchase}` };
    }
    
    // Calculate discount
    let discount = 0;
    if (voucher.discount_type === 'percentage') {
      discount = (subtotal * voucher.discount_value) / 100;
    } else {
      discount = voucher.discount_value;
    }
    
    if (voucher.max_discount && discount > voucher.max_discount) {
      discount = voucher.max_discount;
    }
    
    return { valid: true, discount };
  }
}
```

### 17.6 Commission Calculation

```typescript
// lib/services/commission.service.ts
export class CommissionService {
  static async calculate(userId: string, periodStart: string, periodEnd: string): Promise<number> {
    const supabase = await createClient();
    
    // Get commission rules for this user
    const { data: rules } = await supabase
      .from('commission_rules')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true);
    
    if (!rules || rules.length === 0) return 0;
    
    let totalCommission = 0;
    
    for (const rule of rules) {
      // Get invoices in period where this user was involved
      let query = supabase
        .from('invoices')
        .select(`
          id,
          total_amount,
          invoice_items(*)
        `)
        .eq('status', 'PAID')
        .gte('created_at', periodStart)
        .lte('created_at', periodEnd);
      
      // Filter by applicable services/products
      if (rule.applicable_services?.length) {
        query = query.in('invoice_items.procedure_id', rule.applicable_services);
      }
      if (rule.applicable_products?.length) {
        query = query.in('invoice_items.product_id', rule.applicable_products);
      }
      
      const { data: invoices } = await query;
      
      // Calculate commission based on type
      for (const invoice of invoices ?? []) {
        let commissionBase = 0;
        
        if (rule.commission_type === 'PERCENTAGE') {
          commissionBase = invoice.total_amount;
          totalCommission += (commissionBase * rule.rate) / 100;
        } else if (rule.commission_type === 'FIXED') {
          totalCommission += rule.rate;
        } else if (rule.commission_type === 'TIERED') {
          // Tiered logic
          if (invoice.total_amount >= (rule.min_target ?? 0)) {
            totalCommission += (invoice.total_amount * rule.rate) / 100;
          }
        }
      }
    }
    
    // Record commission transaction
    await supabase.from('commission_transactions').insert({
      user_id: userId,
      amount: totalCommission,
      description: `Commission for ${periodStart} to ${periodEnd}`,
      period_start: periodStart,
      period_end: periodEnd,
    });
    
    return totalCommission;
  }
}
```

### 17.7 Marketing Campaigns

```typescript
// lib/services/marketing.service.ts
export class MarketingService {
  static async launchCampaign(campaignId: string): Promise<void> {
    const supabase = await createClient();
    
    const { data: campaign } = await supabase
      .from('marketing_campaigns')
      .select('*')
      .eq('id', campaignId)
      .single();
    
    if (!campaign) throw new Error('Campaign not found');
    
    // Get target customers based on segment
    const customers = await this.getTargetCustomers(campaign.target_segment);
    
    // Send messages via appropriate channel
    for (const customer of customers) {
      const message = this.replaceVariables(campaign.message_template, customer);
      
      switch (campaign.channel) {
        case 'whatsapp':
          await supabase.functions.invoke('send-whatsapp', {
            body: { phone: customer.phone, message }
          });
          break;
        case 'email':
          await supabase.functions.invoke('send-email', {
            body: { email: customer.email, subject: campaign.name, body: message }
          });
          break;
        case 'sms':
          await supabase.functions.invoke('send-sms', {
            body: { phone: customer.phone, message }
          });
          break;
      }
      
      await supabase
        .from('marketing_campaigns')
        .update({ sent_count: campaign.sent_count + 1 })
        .eq('id', campaignId);
    }
  }
  
  static async getTargetCustomers(segment: Record<string, any>): Promise<Customer[]> {
    const supabase = await createClient();
    
    let query = supabase.from('customers').select('*').eq('is_active', true);
    
    if (segment.tags?.length) {
      query = query.overlaps('tags', segment.tags);
    }
    if (segment.min_spending) {
      query = query.gte('total_spending', segment.min_spending);
    }
    if (segment.has_pets) {
      query = query.in('id', supabase.from('pets').select('customer_id'));
    }
    if (segment.birthday_month) {
      query = query.eq('birth_month', segment.birthday_month);
    }
    
    const { data } = await query;
    return data as Customer[];
  }
  
  static replaceVariables(template: string, customer: Customer): string {
    return template
      .replace(/\{\{name\}\}/g, customer.name)
      .replace(/\{\{phone\}\}/g, customer.phone ?? '')
      .replace(/\{\{email\}\}/g, customer.email ?? '');
  }
}
```

---

## 18. UX & Micro-Interactions

### 18.1 Smart Defaults & Auto-Complete

```typescript
// lib/utils/smart-defaults.ts
export function generateInvoiceNumber(type: InvoiceType): string {
  const prefix = {
    POS: 'INV',
    CLINICAL: 'MED',
    PET_HOTEL: 'HTL',
    GROOMING: 'GRM',
    MIXED: 'MIX',
    SUBSCRIPTION: 'SUB',
    TELEMEDICINE: 'TLM',
  }[type] ?? 'INV';
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}-${date}-${random}`;
}

export function calculatePetAge(birthDate: string): string {
  const birth = new Date(birthDate);
  const now = new Date();
  const years = now.getFullYear() - birth.getFullYear();
  const months = now.getMonth() - birth.getMonth();
  
  if (years > 0) return `${years} tahun ${months} bulan`;
  return `${months} bulan`;
}

export function getDefaultAppointmentTime(date: Date): string {
  return '09:00';
}
```

### 18.2 Keyboard Shortcuts

```typescript
// hooks/use-keyboard-shortcuts.ts
'use client';

import { useEffect } from 'react';

export function useKeyboardShortcuts() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K = Quick search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // Open command palette
      }
      
      // Ctrl/Cmd + N = New customer
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        // Navigate to new customer
      }
      
      // F2 = Quick POS
      if (e.key === 'F2') {
        e.preventDefault();
        // Navigate to POS
      }
      
      // F3 = Quick appointment
      if (e.key === 'F3') {
        e.preventDefault();
        // Navigate to appointments
      }
    };
    
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);
}
```

### 18.3 Quick Actions (Floating Action Button)

```typescript
// components/shared/quick-actions.tsx
'use client';

export function QuickActions() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="lg" className="h-14 w-14 rounded-full shadow-lg">
            <Plus className="h-6 w-6" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => router.push('/customers/new')}>
            <UserPlus className="mr-2" /> Customer Baru
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/appointments/new')}>
            <Calendar className="mr-2" /> Janji Temu
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/pos')}>
            <ShoppingCart className="mr-2" /> Transaksi POS
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/pets/new')}>
            <PawPrint className="mr-2" /> Hewan Baru
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
```

### 18.4 Global Search (Command Palette)

```typescript
// components/shared/global-search.tsx
'use client';

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  
  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput 
        placeholder="Cari customer, hewan, produk, invoice..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>Tidak ada hasil</CommandEmpty>
        <CommandGroup heading="Customers">
          {/* Customer results */}
        </CommandGroup>
        <CommandGroup heading="Hewan">
          {/* Pet results */}
        </CommandGroup>
        <CommandGroup heading="Produk">
          {/* Product results */}
        </CommandGroup>
        <CommandGroup heading="Invoice">
          {/* Invoice results */}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
```

### 18.5 Offline-First Indicators

```typescript
// hooks/use-online-status.ts
'use client';

import { useEffect, useState } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOnline(navigator.onLine);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return isOnline;
}

// components/shared/offline-banner.tsx
export function OfflineBanner() {
  const isOnline = useOnlineStatus();
  
  if (isOnline) return null;
  
  return (
    <div className="bg-amber-500 text-white px-4 py-2 text-center text-sm">
      <WifiOff className="inline mr-2" />
      Anda sedang offline. Beberapa fitur mungkin tidak tersedia.
    </div>
  );
}
```

### 18.6 Realtime Subscriptions

```typescript
// hooks/use-realtime-appointments.ts
'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { queryKeys } from '@/lib/query-keys';

export function useRealtimeAppointments(date: string) {
  const queryClient = useQueryClient();
  
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel('appointments-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments',
          filter: `appointment_date=eq.${date}`,
        },
        () => {
          queryClient.invalidateQueries({ 
            queryKey: queryKeys.appointments.byDate(date) 
          });
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [date, queryClient]);
}

// hooks/use-realtime-notifications.ts
export function useRealtimeNotifications(userId: string) {
  const queryClient = useQueryClient();
  
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel('notifications-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
          toast.info(payload.new.title, { description: payload.new.message });
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);
}
```

### 18.7 Barcode Scanner Integration

```typescript
// components/shared/barcode-scanner.tsx
'use client';

import { useEffect, useRef } from 'react';

export function BarcodeScanner({ onScan }: { onScan: (barcode: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const buffer = useRef('');
  const timeout = useRef<NodeJS.Timeout>();
  
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        onScan(buffer.current);
        buffer.current = '';
      } else {
        buffer.current += e.key;
        clearTimeout(timeout.current);
        timeout.current = setTimeout(() => {
          buffer.current = '';
        }, 100);
      }
    };
    
    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [onScan]);
  
  return <input ref={inputRef} className="sr-only" autoFocus />;
}
```

### 18.8 Thermal Printer Support

```typescript
// lib/utils/thermal-printer.ts
export class ThermalPrinter {
  static async printReceipt(invoice: Invoice, settings: ReceiptSettings): Promise<void> {
    const content = this.buildReceiptContent(invoice, settings);
    
    // Use browser print API
    const printWindow = window.open('', '', 'width=300,height=600');
    if (!printWindow) return;
    
    printWindow.document.write(`
      <html>
        <head>
          <style>
            body { font-family: monospace; width: 80mm; padding: 5mm; }
            .center { text-align: center; }
            .bold { font-weight: bold; }
            .line { border-top: 1px dashed #000; margin: 5px 0; }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  }
  
  static buildReceiptContent(invoice: Invoice, settings: ReceiptSettings): string {
    let content = '';
    
    if (settings.show_logo) {
      content += `<div class="center"><img src="${settings.logo_url}" width="100" /></div>`;
    }
    
    content += `<div class="center bold">${settings.store_name}</div>`;
    content += `<div class="center">${settings.address}</div>`;
    content += `<div class="center">${settings.phone}</div>`;
    content += `<div class="line"></div>`;
    
    content += `<div>No: ${invoice.invoice_number}</div>`;
    content += `<div>Tanggal: ${formatDate(invoice.created_at)}</div>`;
    content += `<div class="line"></div>`;
    
    for (const item of invoice.items) {
      content += `<div>${item.description}</div>`;
      content += `<div>${item.quantity} x ${formatCurrency(item.unit_price)}</div>`;
      content += `<div class="bold">${formatCurrency(item.total_price)}</div>`;
    }
    
    content += `<div class="line"></div>`;
    content += `<div>Subtotal: ${formatCurrency(invoice.subtotal)}</div>`;
    if (invoice.discount_amount > 0) {
      content += `<div>Diskon: -${formatCurrency(invoice.discount_amount)}</div>`;
    }
    if (invoice.tax_amount > 0) {
      content += `<div>Pajak: ${formatCurrency(invoice.tax_amount)}</div>`;
    }
    content += `<div class="bold">TOTAL: ${formatCurrency(invoice.total_amount)}</div>`;
    content += `<div class="line"></div>`;
    content += `<div class="center">${settings.footer_text}</div>`;
    
    if (settings.show_barcode) {
      content += `<div class="center"><img src="data:image/png;base64,${generateBarcode(invoice.invoice_number)}" /></div>`;
    }
    
    return content;
  }
}
```

### 18.9 Dashboard Widgets

```typescript
// components/domain/dashboard/dashboard-widgets.tsx
export function DashboardWidgets() {
  const [widgets, setWidgets] = useLocalStorage('dashboard-widgets', [
    'today-appointments',
    'revenue-chart',
    'low-stock',
    'pending-payments',
  ]);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {widgets.includes('today-appointments') && <TodayAppointmentsWidget />}
      {widgets.includes('revenue-chart') && <RevenueChartWidget />}
      {widgets.includes('low-stock') && <LowStockWidget />}
      {widgets.includes('pending-payments') && <PendingPaymentsWidget />}
      {widgets.includes('upcoming-hotel') && <UpcomingHotelWidget />}
      {widgets.includes('recent-customers') && <RecentCustomersWidget />}
      {widgets.includes('active-subscriptions') && <ActiveSubscriptionsWidget />}
      {widgets.includes('active-deliveries') && <ActiveDeliveriesWidget />}
    </div>
  );
}
```

### 18.10 Low Stock & Expiry Alerts

```typescript
// hooks/use-low-stock-alert.ts
export function useLowStockAlert() {
  const { data: products } = useQuery({
    queryKey: ['products', 'low-stock'],
    queryFn: () => ProductService.getLowStock(),
    refetchInterval: 5 * 60 * 1000,
  });
  
  useEffect(() => {
    if (products && products.length > 0) {
      toast.warning(`${products.length} produk stok menipis`, {
        description: 'Klik untuk melihat detail',
        action: {
          label: 'Lihat',
          onClick: () => router.push('/inventory/low-stock'),
        },
      });
    }
  }, [products]);
}
```

---

## 19. Automated Setup & Deployment

### 19.1 One-Command Setup Script

```bash
#!/bin/bash
# scripts/setup.sh
set -e

echo "🐾 Petora Setup — Starting..."

# 1. Check prerequisites
command -v node >/dev/null 2>&1 || { echo "❌ Node.js required"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ npm required"; exit 1; }

# 2. Install dependencies
echo "📦 Installing dependencies..."
npm install

# 3. Setup environment
if [ ! -f .env.local ]; then
  cp .env.example .env.local
  echo "✅ Created .env.local"
fi

# 4. Setup shadcn/ui
echo "🎨 Setting up shadcn/ui..."
npx shadcn@latest init --defaults --force

# 5. Install shadcn components
echo "🧩 Installing shadcn components..."
npx shadcn@latest add \
  button card input label textarea select checkbox radio-group \
  dialog sheet drawer dropdown-menu popover tooltip \
  table pagination form toast sonner calendar date-picker \
  tabs separator scroll-area avatar badge command combobox \
  alert-dialog accordion progress skeleton switch chart \
  signature-pad

# 6. Setup Supabase
if command -v supabase >/dev/null 2>&1; then
  supabase init
  supabase start
fi

# 7. Seed default data
npm run seed

# 8. Build check
npm run build

echo "✅ Petora setup complete!"
```

### 19.2 Deployment Script

```bash
#!/bin/bash
# scripts/deploy.sh
set -e

echo "🚀 Petora Deployment — Starting..."

command -v vercel >/dev/null 2>&1 || { echo "❌ Vercel CLI required"; exit 1; }

npm run build

BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$BRANCH" != "main" ]; then
  vercel --prod=false
else
  vercel --prod
fi

if command -v supabase >/dev/null 2>&1; then
  supabase db push
fi

echo "✅ Deployment complete!"
```

### 19.3 Seed Script

```typescript
// scripts/seed.ts
import { createClient } from '@supabase/supabase-js';
import { DEFAULT_SETTINGS } from '../lib/constants/default-settings';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function seed() {
  console.log('🌱 Seeding database...');
  
  // 1. Seed settings
  const settings = Object.entries(DEFAULT_SETTINGS).map(([key, config]) => ({
    category: key.split('.')[0].toUpperCase(),
    key,
    value: config.value,
    description: config.description,
    is_public: config.is_public ?? false,
  }));
  await supabase.from('settings').insert(settings);
  console.log('✅ Settings seeded');
  
  // 2. Seed loyalty tiers
  const tiers = [
    { tier_name: 'BRONZE', min_points: 0, min_spending: 0, point_multiplier: 1.0, benefits: {} },
    { tier_name: 'SILVER', min_points: 1000, min_spending: 1000000, point_multiplier: 1.2, benefits: { discount: 5 } },
    { tier_name: 'GOLD', min_points: 5000, min_spending: 5000000, point_multiplier: 1.5, benefits: { discount: 10 } },
    { tier_name: 'PLATINUM', min_points: 10000, min_spending: 10000000, point_multiplier: 2.0, benefits: { discount: 15, free_grooming: true } },
    { tier_name: 'DIAMOND', min_points: 25000, min_spending: 25000000, point_multiplier: 3.0, benefits: { discount: 20, free_grooming: true, priority_service: true } },
  ];
  await supabase.from('loyalty_tiers').insert(tiers);
  console.log('✅ Loyalty tiers seeded');
  
  // 3. Seed default owner
  const ownerPin = '123456';
  const pinHash = await bcrypt.hash(ownerPin, 10);
  await supabase.from('users').insert({
    username: 'owner',
    pin_hash: pinHash,
    role: 'OWNER',
    full_name: 'Default Owner',
    is_active: true,
  });
  console.log('✅ Default owner created (username: owner, PIN: 123456)');
  
  console.log('✅ Seed complete!');
}

seed().catch(console.error);
```

### 19.4 Vercel Config

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["sin1"],
  "env": {
    "NEXT_PUBLIC_APP_NAME": "Petora"
  }
}
```

### 19.5 Next.js Config

```typescript
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;
```

---

## 20. Naming Conventions

### 20.1 File Naming

| Type | Convention | Example |
|---|---|---|
| Page (Next.js) | `page.tsx` | `app/customers/page.tsx` |
| Layout | `layout.tsx` | `app/(dashboard)/layout.tsx` |
| Server Action | `[domain].actions.ts` | `app/actions/customer.actions.ts` |
| Service | `[domain].service.ts` | `lib/services/customer.service.ts` |
| Hook | `use-[domain].ts` | `hooks/use-customers.ts` |
| Component | `[Name].tsx` | `components/domain/customer/CustomerForm.tsx` |
| Utility | `kebab-case.ts` | `lib/utils/format-date.ts` |
| Type | `[domain].ts` | `types/customer.ts` |
| Schema | `[domain].ts` | `schemas/customer.ts` |
| Migration | `[number]_[name].sql` | `0001_initial_schema.sql` |

### 20.2 Code Naming

| Element | Convention | Example |
|---|---|---|
| Component | PascalCase | `CustomerForm` |
| Function | camelCase | `createCustomer` |
| Server Action | camelCase + `Action` | `createCustomerAction` |
| Hook | camelCase + `use` | `useCustomers` |
| Type/Interface | PascalCase | `Customer`, `CreateCustomerInput` |
| Constant | UPPER_SNAKE | `MAX_RETRY_ATTEMPTS` |
| Enum value | UPPER_SNAKE | `'WAITING'`, `'IN_PROGRESS'` |
| CSS class | Tailwind utility | `flex items-center gap-2` |
| DB table | snake_case, plural | `customers`, `medical_records` |
| DB column | snake_case | `created_at`, `customer_id` |

---

## Penutup

Dokumen ini adalah **baseline final** untuk arsitektur Petora dengan fokus pada:

✅ **Owner-Configurable** — Semua setting bisa diatur dari dashboard (17 kategori)
✅ **Payment Flexible** — Manual payment default, split payment, gift cards, loyalty points, gateway optional
✅ **Automated Setup** — One-command setup, zero manual config
✅ **Multi-Branch Ready** — Branch isolation di level database
✅ **Comprehensive Features** — Telemedicine, delivery, subscription, commission, marketing, referral, kiosk, custom fields
✅ **Detail-Oriented** — UX micro-interactions, smart defaults, keyboard shortcuts, global search, offline indicators
✅ **Operational Excellence** — Low stock alerts, expiry alerts, daily reports, auto backup
✅ **Customer Comfort** — Portal, health timeline, reminders, self-service kiosk
✅ **Modern Stack** — Next.js 16 + Tailwind v4 + shadcn/ui + Supabase + Vercel
✅ **Type-safe End-to-End** — TypeScript strict + Zod + generated DB types
✅ **Secure by Default** — RLS di level database, 2FA support, IP whitelist

### Key Differentiators

| Aspek | Petora | Sistem Lain |
|---|---|---|
| **Setup** | One-command | Manual setup kompleks |
| **Payment** | Flexible (manual + split + gateway + gift card + loyalty) | Gateway wajib |
| **Settings** | 17 kategori owner-configurable | Hardcoded |
| **Stack** | Modern (Next.js 16 + Supabase) | Legacy |
| **Features** | 20+ modul terintegrasi | Terpisah-pisah |
| **UX** | Detail-oriented + keyboard shortcuts | Basic |
| **Deployment** | Automated | Manual |
| **Multi-Branch** | Native support | Tidak ada |

### Prinsip Utama

1. **Keep it Simple** — Hindari kompleksitas yang tidak perlu
2. **Owner in Control** — Semua konfigurasi di tangan Owner
3. **Customer First** — UX customer adalah prioritas
4. **Operational Ready** — Fitur operasional lengkap dari hari pertama
5. **Future-Proof** — Siap untuk multi-cabang dan scaling
6. **Type-safe Always** — TypeScript strict di setiap layer
7. **Secure by Default** — RLS sebagai source of truth

**Selamat membangun Petora!** 🐾

---

*Dokumen ini adalah acuan tunggal untuk implementasi. Setiap perubahan harus melalui review dan update dokumen ini terlebih dahulu.*
