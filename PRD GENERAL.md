# Product Requirements Document (PRD)
## Petora — Sistem Manajemen Terpadu Petshop & Petcare
**Versi Final | 20 Agustus 2026**

---

## Daftar Isi

1. [Executive Summary](#1-executive-summary)
2. [Product Vision & Goals](#2-product-vision--goals)
3. [Target Users & Personas](#3-target-users--personas)
4. [Problem Statement](#4-problem-statement)
5. [Solution Overview](#5-solution-overview)
6. [Feature Specifications](#6-feature-specifications)
7. [User Flows](#7-user-flows)
8. [Information Architecture](#8-information-architecture)
9. [User Interface Requirements](#9-user-interface-requirements)
10. [Non-Functional Requirements](#10-non-functional-requirements)
11. [Success Metrics & KPIs](#11-success-metrics--kpis)
12. [Release Scope](#12-release-scope)
13. [Out of Scope](#13-out-of-scope)
14. [Risks & Mitigations](#14-risks--mitigations)
15. [Glossary](#15-glossary)

---

## 1. Executive Summary

**Petora** adalah sistem manajemen terpadu (all-in-one) yang dirancang khusus untuk bisnis Petshop & Petcare di Indonesia. Sistem ini mengintegrasikan seluruh operasional bisnis — mulai dari manajemen customer & hewan, janji temu, rekam medis, pet hotel, grooming, POS, inventori, keuangan, hingga pemasaran — dalam satu platform modern yang mudah digunakan.

### Key Differentiators

| Aspek | Petora | Sistem Konvensional |
|---|---|---|
| **Integrasi** | All-in-one, 20+ modul terintegrasi | Terpisah-pisah (POS, booking, inventory) |
| **Konfigurasi** | Owner-configurable (17 kategori setting) | Hardcoded, butuh developer |
| **Pembayaran** | Fleksibel (manual + gateway + split + gift card + poin) | Gateway wajib |
| **Setup** | One-command, zero manual config | Setup kompleks, butuh IT |
| **Multi-cabang** | Native support | Tidak ada |
| **Customer Experience** | Portal + Kiosk + Reminder otomatis | Manual |
| **Operasional** | Low stock alert, expiry alert, auto-report | Manual monitoring |
| **Stack** | Modern (Next.js 16 + Supabase) | Legacy |

### Value Proposition

**Untuk Owner:**
- Kontrol penuh bisnis dari satu dashboard
- Laporan real-time & auto-generated
- Konfigurasi tanpa perlu developer
- Skalabel dari 1 ke banyak cabang

**Untuk Staff:**
- Workflow terintegrasi, tidak perlu input ulang
- Keyboard shortcuts & quick actions
- Notifikasi & reminder otomatis
- UI modern yang mudah dipelajari

**Untuk Customer:**
- Booking online 24/7 via portal
- Riwayat kesehatan hewan transparan
- Program loyalitas otomatis
- Reminder vaksin/grooming via WhatsApp

---

## 2. Product Vision & Goals

### 2.1 Product Vision

> "Menjadi sistem operasi standar untuk bisnis Petshop & Petcare di Indonesia — yang membuat operasional harian lebih efisien, customer lebih bahagia, dan bisnis lebih berkembang."

### 2.2 Product Goals

| Goal | Target | Measurement |
|---|---|---|
| **Efisiensi Operasional** | Mengurangi waktu admin 60% | Time-per-transaction |
| **Customer Retention** | Meningkatkan repeat order 40% | Repeat customer rate |
| **Revenue Growth** | Meningkatkan revenue 25% | Average transaction value |
| **User Adoption** | 90% staff aktif harian | Daily active users |
| **Error Reduction** | Mengurangi human error 80% | Data entry errors |
| **Setup Time** | < 30 menit dari signup ke production | Time-to-first-transaction |

### 2.3 Success Criteria

**Technical:**
- 99.9% uptime
- < 2s page load time
- < 100ms API response
- WCAG 2.1 AA compliant
- Zero data loss

**Business:**
- 100+ petshop aktif dalam 6 bulan pertama
- NPS > 50
- Customer retention > 80%
- Monthly churn < 5%

---

## 3. Target Users & Personas

### 3.1 Primary Personas

#### Persona 1: Budi — Owner Petshop
- **Usia:** 35-50 tahun
- **Background:** Pemilik 1-3 cabang petshop, sibuk, tidak terlalu tech-savvy
- **Goals:** 
  - Monitor bisnis dari mana saja
  - Kontrol biaya & revenue
  - Tidak mau repot dengan IT
- **Pain Points:**
  - Data tersebar di banyak aplikasi
  - Tidak tahu kondisi real-time
  - Susah konfigurasi sistem
- **Needs:**
  - Dashboard ringkas & informatif
  - Setting via UI (bukan code)
  - Laporan otomatis

#### Persona 2: Sari — Admin/Manager
- **Usia:** 25-40 tahun
- **Background:** Mengelola operasional harian, multi-tasking
- **Goals:**
  - Operasional lancar tanpa bottleneck
  - Staff produktif
  - Customer puas
- **Pain Points:**
  - Input data berulang
  - Koordinasi antar staff ribet
  - Tracking stok manual
- **Needs:**
  - Workflow terintegrasi
  - Notifikasi & reminder
  - Quick actions

#### Persona 3: Dr. Andi — Dokter Hewan
- **Usia:** 28-45 tahun
- **Background:** Fokus pada pelayanan medis, butuh rekam medis lengkap
- **Goals:**
  - Rekam medis lengkap & mudah diakses
  - Tracking kesehatan hewan
  - Prescripsi digital
- **Pain Points:**
  - Rekam medis kertas hilang
  - Riwayat vaksin sulit dilacak
  - Tidak ada reminder vaksin
- **Needs:**
  - Medical record digital
  - Timeline kesehatan hewan
  - Template diagnosis

#### Persona 4: Rina — Kasir
- **Usia:** 20-35 tahun
- **Background:** Menangani transaksi, butuh cepat & akurat
- **Goals:**
  - Transaksi cepat tanpa error
  - Shift balance akurat
  - Customer puas
- **Pain Points:**
  - Hitung manual lama
  - Split payment ribet
  - Struk sering salah
- **Needs:**
  - POS cepat (barcode scanner)
  - Multi payment method
  - Auto-calculate

#### Persona 5: Dewi — Customer
- **Usia:** 25-45 tahun
- **Background:** Pemilik hewan peliharaan, mobile-first
- **Goals:**
  - Booking gampang
  - Tahu kondisi hewan saat di hotel
  - Dapat reward
- **Pain Points:**
  - Booking harus telepon
  - Tidak tahu status hewan
  - Lupa jadwal vaksin
- **Needs:**
  - Portal booking online
  - Update real-time
  - Reminder WhatsApp

### 3.2 Secondary Personas

- **Groomer** — Penata rambut hewan
- **Courier** — Pengantar pesanan
- **Supplier** — Pemasok produk

---

## 4. Problem Statement

### 4.1 Masalah yang Dipecahkan

#### Masalah 1: Fragmentasi Sistem
**Saat ini:** Petshop menggunakan 5-7 aplikasi terpisah (POS, booking, inventory, accounting, WhatsApp, dll). Data tidak terintegrasi, staff harus input ulang.

**Solusi Petora:** Satu platform terintegrasi. Data customer, hewan, transaksi, stok — semua terhubung otomatis.

#### Masalah 2: Konfigurasi Kaku
**Saat ini:** Sistem SaaS umum tidak bisa disesuaikan. Butuh developer untuk perubahan kecil (logo, struk, pajak).

**Solusi Petora:** 17 kategori setting bisa diatur Owner dari dashboard. Struk, pajak, loyalty, reminder — semua customizable.

#### Masalah 3: Pembayaran Ribet
**Saat ini:** Payment gateway wajib, biaya tinggi. Customer yang bayar tunai/transfer manual harus verifikasi ribet.

**Solusi Petora:** Manual payment default (gratis), gateway optional. Support split payment, gift card, loyalty points.

#### Masalah 4: Customer Experience Buruk
**Saat ini:** Booking harus telepon, tidak ada reminder, riwayat kesehatan tidak transparan.

**Solusi Petora:** Portal self-service, reminder WhatsApp otomatis, health timeline transparan.

#### Masalah 5: Monitoring Manual
**Saat ini:** Owner tidak tahu stok menipis, produk expired, payment pending sampai terjadi masalah.

**Solusi Petora:** Alert otomatis (low stock, expiry, pending payment), daily report via WhatsApp/email.

### 4.2 Impact

| Masalah | Impact Saat Ini | Impact dengan Petora |
|---|---|---|
| Fragmentasi | 2-3 jam/hari untuk admin | < 30 menit/hari |
| Konfigurasi kaku | Butuh developer, mahal | Self-service, gratis |
| Payment ribet | Kehilangan customer | Conversion +30% |
| CX buruk | Churn tinggi | Retention +40% |
| Monitoring manual | Kebocoran revenue | Loss prevention 80% |

---

## 5. Solution Overview

### 5.1 Product Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Petora Platform                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Dashboard  │  │    Portal    │  │    Kiosk     │     │
│  │   (Staff)    │  │  (Customer)  │  │ (Self-svc)   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Core Modules (20+)                       │  │
│  │  • Customer & Pet Management                          │  │
│  │  • Appointment & Queue                                │  │
│  │  • Medical Records & Prescriptions                    │  │
│  │  • Pet Hotel & Grooming                               │  │
│  │  • POS & Invoicing                                    │  │
│  │  • Inventory & Purchase Orders                        │  │
│  │  • Payment & Cash Shifts                              │  │
│  │  • Loyalty & Promotions                               │  │
│  │  • Subscriptions & Gift Cards                         │  │
│  │  • Telemedicine & Delivery                            │  │
│  │  • Marketing & Referrals                              │  │
│  │  • Reports & Analytics                                │  │
│  │  • Settings (17 categories)                           │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Integrations                             │  │
│  │  • WhatsApp (Fonnte) • Email (Resend) • SMS          │  │
│  │  • Payment Gateway (Midtrans/Xendit) — optional      │  │
│  │  • Video Call (telemedicine)                          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 Core Modules

| # | Module | Description |
|---|---|---|
| 1 | **Customer Management** | Data customer, tags, referral, custom fields |
| 2 | **Pet Management** | Data hewan, passport, microchip, health timeline |
| 3 | **Appointment & Queue** | Booking, calendar, queue real-time |
| 4 | **Medical Records** | Rekam medis, diagnosis, prescription, lab |
| 5 | **Pet Hotel** | Room management, booking, logs, photo updates |
| 6 | **Grooming** | Service, booking, before/after photo |
| 7 | **POS** | Point of Sale, barcode scanner, thermal printer |
| 8 | **Invoicing** | Invoice multi-type, PDF generation |
| 9 | **Payment** | Manual + gateway, split, proof verification |
| 10 | **Inventory** | Multi-warehouse, batch, expiry, stock opname |
| 11 | **Purchase Orders** | PO, supplier, receiving |
| 12 | **Loyalty Program** | Multi-tier, points, rewards |
| 13 | **Promotions** | Voucher, gift card, promo codes |
| 14 | **Subscriptions** | Recurring billing, auto-renew |
| 15 | **Expenses** | Expense tracking, approval workflow |
| 16 | **Employee & Commission** | Staff, performance, commission calculation |
| 17 | **Telemedicine** | Video consultation |
| 18 | **Delivery** | Zone, courier, tracking |
| 19 | **Marketing** | Campaigns, segments, broadcast |
| 20 | **Reports** | Sales, inventory, financial, custom |
| 21 | **Settings** | 17 kategori konfigurasi |
| 22 | **Customer Portal** | Self-service booking, history |
| 23 | **Kiosk** | Self-service check-in, booking |

### 5.3 User Interfaces

| Interface | Target | Access |
|---|---|---|
| **Dashboard** | Staff (Owner, Admin, Dokter, Kasir, Groomer, Courier) | Web, responsive |
| **Customer Portal** | Customer | Web, mobile-optimized |
| **Self-Service Kiosk** | Customer (di toko) | Touchscreen, tablet |
| **Public Pages** | Visitor | Web, SEO-optimized |

---

## 6. Feature Specifications

### 6.1 Customer Management

**Deskripsi:** Modul untuk mengelola data customer secara lengkap dengan fitur tagging, referral, dan custom fields.

**Fitur Utama:**
- CRUD customer dengan validasi lengkap
- Upload foto customer
- Tagging (VIP, REGULAR, NEW, BLACKLIST, WHOLESALE, BREEDER)
- Custom fields (Owner bisa tambah field sendiri)
- Referral system (kode referral unik per customer)
- Emergency contact
- Notes internal
- Soft delete (data tidak hilang permanen)
- Search & filter (nama, telepon, email, tag)
- Export CSV

**User Stories:**
- Sebagai Admin, saya bisa menambah customer baru dengan data lengkap agar data tersentralisasi
- Sebagai Kasir, saya bisa mencari customer berdasarkan nama/telepon agar transaksi cepat
- Sebagai Owner, saya bisa melihat customer VIP agar bisa kasih perlakuan khusus
- Sebagai Customer, saya bisa update data saya via portal agar data selalu update

**Acceptance Criteria:**
- ✅ Form customer validasi real-time
- ✅ Search response < 500ms
- ✅ Upload foto max 5MB, format JPG/PNG
- ✅ Tag bisa multiple
- ✅ Custom fields bisa tambah/hapus dari settings
- ✅ Referral code auto-generate unik

**Business Rules:**
- 1 customer bisa punya banyak hewan
- Customer bisa jadi guest (tanpa akun)
- Blacklisted customer tetap bisa transaksi tapi dengan warning
- Referral bonus diberikan saat referred customer transaksi pertama

---

### 6.2 Pet Management

**Deskripsi:** Modul untuk mengelola data hewan peliharaan dengan riwayat kesehatan lengkap.

**Fitur Utama:**
- CRUD pet (linked ke customer)
- Data lengkap: species, breed, birth date, gender, color, microchip, pedigree
- Photo upload
- Temperament, special needs, diet notes, behavior notes
- Custom fields
- Neutered status
- **Pet Passport** (dokumen digital)
- **Weight Logs** (tracking berat badan dengan chart)
- **Vaccines** (dengan due date & reminder)
- **Diseases & Allergies** (dengan severity)
- **Health Timeline** (visualisasi riwayat kesehatan)
- Soft delete

**User Stories:**
- Sebagai Dokter, saya bisa melihat riwayat lengkap hewan sebelum pemeriksaan
- Sebagai Admin, saya bisa tracking berat badan hewan untuk monitoring kesehatan
- Sebagai Owner, saya bisa lihat jadwal vaksin berikutnya via reminder
- Sebagai Customer, saya bisa lihat health timeline hewan saya via portal

**Acceptance Criteria:**
- ✅ Health timeline menampilkan semua events (vaksin, checkup, treatment, grooming)
- ✅ Weight chart interaktif (zoom, period selector)
- ✅ Vaccine due date warning (H-7, H-3, H-1)
- ✅ Allergy warning prominent di medical record
- ✅ Microchip number unique
- ✅ Pet passport PDF downloadable

**Business Rules:**
- 1 customer bisa punya banyak pet
- Pet tidak bisa dihapus jika punya transaksi (soft delete)
- Vaccine reminder otomatis via WhatsApp/email sesuai setting
- Weight log otomatis tercatat saat medical record dibuat

---

### 6.3 Appointment & Queue

**Deskripsi:** Modul untuk mengelola janji temu dengan dokter/groomer dengan sistem antrian real-time.

**Fitur Utama:**
- Create appointment (manual & via portal)
- Calendar view (day/week/month)
- Queue management (real-time)
- Drag & drop reschedule
- Status tracking (SCHEDULED → WAITING → IN_PROGRESS → DONE)
- No-show handling
- Cancellation dengan reason
- Doctor/groomer assignment
- Duration management
- Appointment types (consultation, vaccination, surgery, checkup, emergency)
- Real-time updates via Supabase Realtime
- Reminder otomatis (H-2, H-1)

**User Stories:**
- Sebagai Admin, saya bisa lihat jadwal hari ini dalam calendar view
- Sebagai Kasir, saya bisa buat appointment untuk customer yang datang
- Sebagai Customer, saya bisa booking online 24/7 via portal
- Sebagai Dokter, saya bisa lihat antrian saya real-time
- Sebagai Admin, saya bisa panggil pasien berikutnya dari queue

**Acceptance Criteria:**
- ✅ Calendar sync dengan appointment
- ✅ Queue real-time update (WebSocket)
- ✅ Drag & drop reschedule (day/week view)
- ✅ Conflict detection (double booking)
- ✅ Reminder otomatis sesuai setting
- ✅ No-show tracking

**Business Rules:**
- 1 dokter/groomer tidak bisa handle 2 appointment di waktu sama
- Duration default 30 menit (bisa diubah per type)
- Customer bisa cancel H-2 tanpa penalty
- No-show tercatat di history customer
- Queue number auto-increment per hari

---

### 6.4 Medical Records

**Deskripsi:** Modul untuk rekam medis digital dengan signature, attachments, dan integrasi prescription.

**Fitur Utama:**
- Create medical record (linked ke appointment)
- Chief complaint, history, physical exam
- Vital signs (weight, temperature, heart rate, respiratory rate)
- Diagnosis (dengan ICD code)
- Treatment & prescription
- Lab results (dengan reference range)
- Attachments (foto, PDF, hasil lab)
- **E-signature** dokter
- Record number auto-generate
- Status (OPEN/CLOSED)
- Soft delete
- Search & filter

**User Stories:**
- Sebagai Dokter, saya bisa buat rekam medis lengkap dengan template
- Sebagai Dokter, saya bisa sign rekam medis secara digital
- Sebagai Admin, saya bisa lihat riwayat medis hewan
- Sebagai Customer, saya bisa lihat rekam medis hewan saya via portal

**Acceptance Criteria:**
- ✅ Medical record linked ke appointment
- ✅ E-signature dengan timestamp
- ✅ Attachment max 10MB per file
- ✅ Record number format: MR-YYYYMMDD-XXXX
- ✅ Vital signs validation (range normal)
- ✅ Diagnosis code searchable

**Business Rules:**
- 1 appointment = 1 medical record
- Hanya dokter yang bisa create/edit medical record
- Medical record yang sudah closed tidak bisa diedit
- Customer bisa view tapi tidak bisa edit
- Attachments disimpan di Supabase Storage

---

### 6.5 Prescriptions

**Deskripsi:** Modul untuk resep obat digital dengan tracking refill.

**Fitur Utama:**
- Create prescription (linked ke medical record)
- Prescription items (obat, dosis, frekuensi, durasi)
- Refills allowed tracking
- E-signature dokter
- Valid until date
- Status (DRAFT, ACTIVE, COMPLETED, CANCELLED)
- Prescription number auto-generate
- PDF generation
- Linked ke product inventory (auto stock deduction saat fulfill)

**User Stories:**
- Sebagai Dokter, saya bisa buat resep digital dengan detail lengkap
- Sebagai Kasir, saya bisa fulfill resep dan auto-deduct stok
- Sebagai Customer, saya bisa lihat resep aktif via portal
- Sebagai Admin, saya bisa tracking penggunaan obat

**Acceptance Criteria:**
- ✅ Prescription linked ke medical record
- ✅ Refill tracking (allowed vs used)
- ✅ Auto stock deduction saat fulfill
- ✅ PDF downloadable
- ✅ E-signature dokter
- ✅ Valid until date enforcement

**Business Rules:**
- 1 medical record bisa punya 1 prescription
- Refill hanya bisa dilakukan sebelum valid until
- Stock deduction otomatis saat fulfill
- Fulfill hanya bisa dilakukan oleh kasir/admin

---

### 6.6 Pet Hotel

**Deskripsi:** Modul untuk manajemen penitipan hewan dengan room management dan daily logs.

**Fitur Utama:**
- Room management (tipe, harga, capacity, amenities)
- Room status (AVAILABLE, RESERVED, OCCUPIED, MAINTENANCE)
- Cleanliness tracking (CLEAN, DIRTY, UNDER_CLEANING)
- Booking management (BOOKED → CHECKED_IN → CHECKED_OUT)
- Price per night calculation
- Feeding & medication schedule
- **Daily logs** (feeding, medicine, walk, play, note, photo)
- Photo updates untuk customer
- Special notes
- Portal booking

**User Stories:**
- Sebagai Admin, saya bisa lihat status semua kamar real-time
- Sebagai Staff, saya bisa catat aktivitas harian hewan (makan, obat, jalan)
- Sebagai Staff, saya bisa upload foto hewan untuk customer
- Sebagai Customer, saya bisa lihat update harian hewan saya via portal
- Sebagai Customer, saya bisa booking online

**Acceptance Criteria:**
- ✅ Room status real-time
- ✅ Daily log dengan photo upload
- ✅ Feeding schedule reminder
- ✅ Price calculation otomatis (check-in to check-out)
- ✅ Portal update real-time
- ✅ Conflict detection (room double booking)

**Business Rules:**
- 1 kamar bisa untuk multiple hewan (sesuai capacity)
- Check-in otomatis update room status ke OCCUPIED
- Check-out otomatis update room status ke CLEAN
- Daily log wajib diisi minimal 1x per hari
- Photo update otomatis notify customer via WhatsApp

---

### 6.7 Grooming

**Deskripsi:** Modul untuk manajemen layanan grooming dengan before/after photo.

**Fitur Utama:**
- Service management (nama, harga, durasi)
- Booking management
- Groomer assignment
- **Before/after photo** upload
- Skin condition notes
- Flea/tick check
- Recommendations
- Products used tracking
- Gallery per pet
- Status tracking (BOOKED → IN_PROGRESS → DONE)
- Portal booking

**User Stories:**
- Sebagai Groomer, saya bisa catat kondisi kulit hewan
- Sebagai Groomer, saya bisa upload before/after photo
- Sebagai Admin, saya bisa lihat galeri grooming per hewan
- Sebagai Customer, saya bisa lihat hasil grooming via portal

**Acceptance Criteria:**
- ✅ Before/after photo side-by-side view
- ✅ Gallery per pet
- ✅ Products used tracking
- ✅ Status real-time
- ✅ Portal view hasil grooming

**Business Rules:**
- 1 groomer tidak bisa handle 2 booking di waktu sama
- Before photo wajib, after photo optional
- Flea/tick found = warning ke customer
- Products used auto-deduct stock (jika produk linked)

---

### 6.8 POS (Point of Sale)

**Deskripsi:** Modul kasir cepat dengan barcode scanner, thermal printer, dan multi-payment.

**Fitur Utama:**
- Product grid dengan category tabs
- Search produk (nama, SKU, barcode)
- **Barcode scanner** support
- Cart management (add, remove, update qty)
- Customer selection (linked ke loyalty)
- Discount per item atau total
- Tax calculation (auto)
- **Promotion code** apply
- **Loyalty points** redeem
- **Gift card** redemption
- **Split payment** (multi-method)
- **Partial payment** (DP)
- **Thermal printer** support (58mm, 80mm)
- **Barcode printing** untuk produk
- Hold/recall cart
- Recent transactions
- Price check mode
- Keyboard shortcuts (F1-F12)

**User Stories:**
- Sebagai Kasir, saya bisa scan barcode produk agar transaksi cepat
- Sebagai Kasir, saya bisa terima pembayaran split (cash + QRIS)
- Sebagai Kasir, saya bisa cetak struk thermal otomatis
- Sebagai Kasir, saya bisa hold cart dan recall nanti
- Sebagai Kasir, saya bisa gunakan keyboard shortcuts agar cepat

**Acceptance Criteria:**
- ✅ Scan to add to cart (< 500ms)
- ✅ Auto-calculate total (discount, tax, points)
- ✅ Split payment validation (total = sum of payments)
- ✅ Thermal print layout correct
- ✅ Keyboard shortcuts work
- ✅ Hold/recall cart works
- ✅ Offline mode (queue transactions)

**Business Rules:**
- Stock auto-deduct saat transaksi
- Low stock warning saat add to cart
- Loyalty points auto-calculate berdasarkan setting
- Promotion code validation (expired, max usage, min purchase)
- Gift card balance validation
- Cash shift tracking (opening, closing, difference)

**Keyboard Shortcuts:**
- F1: Focus search
- F2: Quick customer
- F3: Quick product
- F4: Payment
- F5: Hold cart
- F12: Clear cart
- Esc: Cancel

---

### 6.9 Invoicing

**Deskripsi:** Modul invoice multi-type dengan PDF generation.

**Fitur Utama:**
- Multi-type invoice (POS, CLINICAL, PET_HOTEL, GROOMING, MIXED, SUBSCRIPTION, TELEMEDICINE)
- Invoice number auto-generate
- Linked ke customer, products, services, bookings
- Discount, tax, shipping calculation
- Promotion & loyalty integration
- Status tracking (DRAFT, UNPAID, PARTIAL, PAID, CANCELLED, REFUNDED)
- PDF generation
- Email invoice ke customer
- Print invoice
- Due date tracking
- Notes

**User Stories:**
- Sebagai Kasir, saya bisa buat invoice dari POS
- Sebagai Admin, saya bisa lihat semua invoice dengan filter
- Sebagai Customer, saya bisa download invoice PDF via portal
- Sebagai Admin, saya bisa email invoice ke customer

**Acceptance Criteria:**
- ✅ Invoice number unique & sequential
- ✅ PDF generation < 2s
- ✅ Email delivery < 5s
- ✅ Status auto-update saat payment
- ✅ Refund workflow works

**Business Rules:**
- Invoice number format: INV-YYYYMMDD-XXXX (per type)
- Paid invoice tidak bisa diedit
- Refund hanya bisa dilakukan oleh Owner/Admin
- Invoice linked ke loyalty points (earn & redeem)

---

### 6.10 Payment

**Deskripsi:** Modul pembayaran fleksibel dengan manual & gateway support.

**Fitur Utama:**
- **Manual payment** (default):
  - CASH (auto-verified)
  - TRANSFER (butuh verifikasi)
  - QRIS (butuh verifikasi)
  - E_WALLET (butuh verifikasi)
  - DEBIT_CARD (auto-verified)
  - GIFT_CARD (auto-verified)
  - LOYALTY_POINTS (auto-verified)
  - OTHER (butuh verifikasi)
- **Gateway payment** (optional):
  - Midtrans
  - Xendit
- **Split payment** (multi-method)
- **Partial payment** (DP)
- **Payment proof** upload (untuk manual)
- **Payment verification** workflow (Owner/Admin)
- Refund
- Payment history
- Cash shift integration

**User Stories:**
- Sebagai Kasir, saya bisa terima pembayaran cash dengan cepat
- Sebagai Kasir, saya bisa terima split payment (cash + QRIS)
- Sebagai Admin, saya bisa verifikasi pembayaran transfer
- Sebagai Customer, saya bisa upload bukti transfer via portal
- Sebagai Owner, saya bisa lihat semua payment history

**Acceptance Criteria:**
- ✅ Cash payment auto-verified
- ✅ Non-cash payment butuh verifikasi
- ✅ Payment proof upload (max 5MB)
- ✅ Verification workflow (approve/reject)
- ✅ Split payment validation
- ✅ Refund workflow
- ✅ Gateway integration (jika diaktifkan)

**Business Rules:**
- Cash payment langsung verified
- Non-cash payment status PENDING sampai verified
- Owner/Admin bisa verify payment
- Split payment total harus = invoice total
- Refund hanya bisa dilakukan oleh Owner/Admin
- Gateway payment auto-verified via webhook

---

### 6.11 Inventory

**Deskripsi:** Modul inventori lengkap dengan multi-warehouse, batch tracking, dan expiry alerts.

**Fitur Utama:**
- Product management (SKU, barcode, harga, stok)
- Category management (hierarchical)
- Supplier management
- **Multi-warehouse** support
- **Batch tracking** (batch number, expiry date)
- **Serial number tracking** (optional)
- Stock movements (IN, OUT, RETURN, ADJUSTMENT, DAMAGED, EXPIRED, OPNAME, TRANSFER)
- Stock opname (physical count)
- **Low stock alerts**
- **Expiry alerts** (H-30, H-7, H-1)
- Reorder point & auto-reorder
- Product variants (size, color, dll)
- Product bundles
- Costing methods (FIFO, LIFO, AVERAGE)
- Barcode printing
- Import/Export CSV

**User Stories:**
- Sebagai Admin, saya bisa lihat stok real-time per warehouse
- Sebagai Admin, saya bisa terima warning stok menipis
- Sebagai Admin, saya bisa tahu produk yang akan expired
- Sebagai Admin, saya bisa lakukan stock opname
- Sebagai Admin, saya bisa transfer stok antar warehouse

**Acceptance Criteria:**
- ✅ Stock real-time update
- ✅ Low stock alert (sesuai threshold)
- ✅ Expiry alert (H-30, H-7, H-1)
- ✅ Batch tracking dengan expiry
- ✅ Stock opname dengan variance report
- ✅ Transfer antar warehouse
- ✅ Barcode print

**Business Rules:**
- Stock tidak boleh negatif
- Batch dengan expiry terdekat yang dipakai duluan (FEFO)
- Stock opname harus di-approve Owner/Admin
- Transfer antar warehouse butuh approval
- Auto-reorder create PO otomatis saat stock <= reorder point

---

### 6.12 Purchase Orders

**Deskripsi:** Modul pembelian dari supplier dengan approval workflow.

**Fitur Utama:**
- Create PO
- PO number auto-generate
- Multi-item PO
- Supplier selection
- Expected arrival date
- Receiving workflow (partial/full)
- Batch & expiry tracking saat receiving
- Status (DRAFT, SENT, PARTIAL_RECEIVED, RECEIVED, CANCELLED)
- Approval workflow
- Auto-update stock saat receiving
- Supplier rating

**User Stories:**
- Sebagai Admin, saya bisa buat PO ke supplier
- Sebagai Owner, saya bisa approve PO
- Sebagai Staff, saya bisa terima barang dan update stok
- Sebagai Admin, saya bisa lihat riwayat PO per supplier

**Acceptance Criteria:**
- ✅ PO number unique
- ✅ Approval workflow works
- ✅ Receiving updates stock
- ✅ Batch tracking saat receiving
- ✅ Supplier rating calculation

**Business Rules:**
- PO butuh approval dari Owner/Admin (jika > threshold)
- Partial receiving allowed
- Stock auto-update saat receiving
- Supplier rating berdasarkan on-time delivery & quality

---

### 6.13 Loyalty Program

**Deskripsi:** Modul program loyalitas multi-tier dengan poin dan rewards.

**Fitur Utama:**
- Multi-tier (BRONZE, SILVER, GOLD, PLATINUM, DIAMOND)
- Points earning (per rupiah spent)
- Points redemption (untuk discount)
- Tier auto-upgrade berdasarkan points & spending
- Point multiplier per tier
- **Birthday bonus** points
- **Referral bonus** points
- Points expiry tracking
- Transaction history
- Member dashboard (portal)

**User Stories:**
- Sebagai Customer, saya bisa kumpulkan poin dari setiap transaksi
- Sebagai Customer, saya bisa redeem poin untuk discount
- Sebagai Customer, saya bisa lihat tier & poin saya via portal
- Sebagai Owner, saya bisa atur rules loyalty dari settings
- Sebagai Kasir, saya bisa redeem poin customer saat transaksi

**Acceptance Criteria:**
- ✅ Points auto-calculate saat transaksi
- ✅ Tier auto-upgrade
- ✅ Birthday bonus auto-apply
- ✅ Referral bonus auto-apply
- ✅ Points expiry tracking
- ✅ Redemption validation

**Business Rules:**
- Points earning: 1 poin per Rp 1.000 (configurable)
- Points value: 1 poin = Rp 100 (configurable)
- Points expiry: 12 bulan (configurable)
- Tier upgrade: based on total points & spending
- Birthday bonus: 2x points di bulan ulang tahun
- Referral bonus: 100 poin per successful referral

---

### 6.14 Promotions

**Deskripsi:** Modul promosi & voucher dengan berbagai tipe.

**Fitur Utama:**
- Promotion types:
  - PERCENTAGE (diskon %)
  - FIXED (diskon nominal)
  - BUNDLE (paket produk)
  - HAPPY_HOUR (diskon di jam tertentu)
  - BIRTHDAY (diskon ulang tahun)
  - BOGO (buy 1 get 1)
  - FREE_SHIPPING (gratis ongkir)
- Voucher codes
- Usage limits (max usage, per customer limit)
- Min purchase requirement
- Max discount cap
- Date range
- Applicable products/categories
- Auto-apply promotion
- Usage tracking

**User Stories:**
- Sebagai Owner, saya bisa buat promo untuk tingkatkan penjualan
- Sebagai Kasir, saya bisa apply promo code saat transaksi
- Sebagai Customer, saya bisa lihat promo aktif via portal
- Sebagai Admin, saya bisa tracking usage promo

**Acceptance Criteria:**
- ✅ Promo code validation
- ✅ Usage limit enforcement
- ✅ Min purchase validation
- ✅ Date range enforcement
- ✅ Auto-apply jika eligible
- ✅ Usage tracking

**Business Rules:**
- 1 invoice hanya bisa pakai 1 promo code
- Promo tidak bisa stack (kecuali configured)
- Expired promo auto-inactive
- Max usage reached = auto-inactive

---

### 6.15 Gift Cards & Vouchers

**Deskripsi:** Modul gift card & voucher untuk pembayaran alternatif.

**Fitur Utama:**
- **Gift Cards:**
  - Create gift card (dengan nominal)
  - Card number & PIN
  - Balance tracking
  - Top-up
  - Redemption
  - Expiry date
  - Purchase history
- **Vouchers:**
  - Create voucher code
  - Discount type (percentage/fixed)
  - Usage limits
  - Applicable products
  - Redemption tracking

**User Stories:**
- Sebagai Owner, saya bisa jual gift card untuk tambahan revenue
- Sebagai Customer, saya bisa pakai gift card untuk bayar
- Sebagai Customer, saya bisa terima voucher dari promo
- Sebagai Kasir, saya bisa redeem gift card/voucher

**Acceptance Criteria:**
- ✅ Gift card balance tracking
- ✅ PIN validation
- ✅ Voucher code validation
- ✅ Expiry enforcement
- ✅ Usage limit enforcement

**Business Rules:**
- Gift card balance tidak boleh negatif
- Gift card bisa di-top-up
- Voucher 1x pakai (kecuali configured)
- Gift card & voucher tidak bisa digabung (kecuali configured)

---

### 6.16 Subscriptions

**Deskripsi:** Modul layanan berlangganan dengan auto-billing.

**Fitur Utama:**
- Subscription plans (daily, weekly, monthly, quarterly, yearly)
- Customer subscription
- Auto-renewal
- Grace period
- Billing cycle tracking
- Pause/cancel subscription
- Payment method binding
- Subscription history

**User Stories:**
- Sebagai Owner, saya bisa buat paket subscription (grooming bulanan, dll)
- Sebagai Customer, saya bisa subscribe layanan
- Sebagai Admin, saya bisa lihat subscription aktif
- Sebagai Kasir, saya bisa process renewal

**Acceptance Criteria:**
- ✅ Auto-renewal works
- ✅ Grace period enforcement
- ✅ Pause/cancel works
- ✅ Billing cycle tracking

**Business Rules:**
- Auto-renewal create invoice otomatis
- Grace period 3 hari (configurable)
- Failed payment = pause subscription
- Cancel = no refund untuk period berjalan

---

### 6.17 Expenses

**Deskripsi:** Modul pengeluaran bisnis dengan approval workflow.

**Fitur Utama:**
- Expense categories
- Create expense
- Receipt upload
- Recurring expenses
- Approval workflow
- Status (PENDING, APPROVED, REJECTED, REVERSED)
- Expense history
- Reports

**User Stories:**
- Sebagai Admin, saya bisa catat pengeluaran bisnis
- Sebagai Owner, saya bisa approve expense
- Sebagai Admin, saya bisa lihat laporan pengeluaran

**Acceptance Criteria:**
- ✅ Approval workflow works
- ✅ Receipt upload
- ✅ Recurring expenses auto-create
- ✅ Reports accurate

**Business Rules:**
- Expense > threshold butuh approval
- Recurring expense auto-create di tanggal yang sama setiap bulan
- Rejected expense tidak masuk laporan

---

### 6.18 Employee & Commission

**Deskripsi:** Modul manajemen staff dengan commission calculation.

**Fitur Utama:**
- Employee management
- Role-based access
- Commission rules (percentage, fixed, tiered)
- Commission calculation per period
- Performance tracking
- Commission payment tracking

**User Stories:**
- Sebagai Owner, saya bisa atur commission rules
- Sebagai Admin, saya bisa lihat performance staff
- Sebagai Staff, saya bisa lihat commission saya

**Acceptance Criteria:**
- ✅ Commission calculation accurate
- ✅ Performance tracking
- ✅ Payment tracking

**Business Rules:**
- Commission based on sales/services
- Tiered commission (target-based)
- Commission paid monthly

---

### 6.19 Telemedicine

**Deskripsi:** Modul konsultasi online via video call.

**Fitur Utama:**
- Schedule telemedicine session
- Video call integration
- Session recording (optional)
- Linked ke medical record
- Fee management
- Session history

**User Stories:**
- Sebagai Customer, saya bisa booking konsultasi online
- Sebagai Dokter, saya bisa konsultasi via video call
- Sebagai Admin, saya bisa lihat history telemedicine

**Acceptance Criteria:**
- ✅ Video call works
- ✅ Session recording
- ✅ Linked ke medical record
- ✅ Fee calculation

**Business Rules:**
- Telemedicine session = 30 menit default
- Recording optional (dengan consent)
- Fee configurable

---

### 6.20 Delivery

**Deskripsi:** Modul pengiriman pesanan dengan tracking.

**Fitur Utama:**
- Delivery zones (dengan postal code)
- Delivery fee calculation
- Courier assignment
- Status tracking (PENDING, ASSIGNED, PICKED_UP, IN_TRANSIT, DELIVERED, FAILED)
- Proof of delivery (photo + signature)
- Tracking number
- Customer notification
- Courier app (mobile)

**User Stories:**
- Sebagai Customer, saya bisa pilih delivery saat checkout
- Sebagai Admin, saya bisa assign courier
- Sebagai Courier, saya bisa lihat delivery tasks
- Sebagai Customer, saya bisa track delivery real-time

**Acceptance Criteria:**
- ✅ Zone-based fee calculation
- ✅ Courier assignment
- ✅ Status tracking real-time
- ✅ Proof of delivery
- ✅ Customer notification

**Business Rules:**
- Delivery fee based on zone
- Free delivery untuk min purchase (configurable)
- Failed delivery = retry atau refund

---

### 6.21 Marketing

**Deskripsi:** Modul kampanye pemasaran dengan broadcast.

**Fitur Utama:**
- Campaign creation
- Customer segmentation
- Multi-channel (WhatsApp, Email, SMS, Push)
- Message templates
- Scheduling
- Tracking (sent, opened, clicked, converted)
- Budget tracking

**User Stories:**
- Sebagai Owner, saya bisa buat kampanye promo
- Sebagai Admin, saya bisa segment customer
- Sebagai Admin, saya bisa broadcast via WhatsApp
- Sebagai Admin, saya bisa lihat performance kampanye

**Acceptance Criteria:**
- ✅ Segmentation works
- ✅ Multi-channel broadcast
- ✅ Template variables
- ✅ Tracking metrics

**Business Rules:**
- Broadcast butuh approval (jika > threshold)
- Customer bisa unsubscribe
- Rate limiting (max X broadcast per bulan)

---

### 6.22 Reports

**Deskripsi:** Modul laporan bisnis komprehensif.

**Fitur Utama:**
- **Sales Reports:**
  - Daily/Monthly/Yearly sales
  - Sales by product/category
  - Sales by customer
  - Sales by staff
- **Inventory Reports:**
  - Stock levels
  - Low stock
  - Expiry tracking
  - Stock movements
  - Valuation
- **Financial Reports:**
  - Profit & Loss
  - Cash flow
  - Expense breakdown
  - Commission summary
- **Customer Reports:**
  - Customer acquisition
  - Customer retention
  - Lifetime value
  - Churn analysis
- **Operational Reports:**
  - Appointment statistics
  - Pet hotel occupancy
  - Grooming utilization
- **Custom Reports:**
  - Custom filters
  - Export CSV/PDF

**User Stories:**
- Sebagai Owner, saya bisa lihat laporan penjualan harian
- Sebagai Owner, saya bisa lihat profit & loss bulanan
- Sebagai Admin, saya bisa export laporan ke Excel
- Sebagai Admin, saya bisa buat custom report

**Acceptance Criteria:**
- ✅ Reports accurate
- ✅ Export CSV/PDF works
- ✅ Custom filters
- ✅ Date range selection

**Business Rules:**
- Reports based on verified payments only
- Date range max 1 year
- Export max 100.000 rows

---

### 6.23 Settings

**Deskripsi:** Modul konfigurasi lengkap (17 kategori).

**Categories:**
1. **General** — Store info, branches, operating hours, logo
2. **Branches** — Multi-branch management
3. **Payment** — Methods, gateway, manual instructions
4. **Tax** — PPN, PPh, tax rules
5. **Loyalty** — Points, tiers, rewards
6. **Notification** — WhatsApp, Email, SMS, Push
7. **Printer** — Receipt, barcode, thermal, label
8. **Reminder** — Vaccine, grooming, hotel, expiry
9. **Receipt** — Template, header, footer
10. **Security** — Session, PIN, 2FA, IP whitelist
11. **Integration** — API tokens (Fonnte, Resend, Midtrans)
12. **Backup** — Auto backup schedule
13. **Employees** — Commission rules, performance
14. **Subscription** — Plans, billing
15. **Delivery** — Zones, pricing
16. **Inventory** — Warehouses, costing, reorder
17. **Custom Fields** — Customer, pet fields
18. **Advanced** — Debug, maintenance, i18n

**User Stories:**
- Sebagai Owner, saya bisa ubah nama toko & logo
- Sebagai Owner, saya bisa atur pajak
- Sebagai Owner, saya bisa aktifkan/nonaktifkan payment gateway
- Sebagai Owner, saya bisa atur reminder WhatsApp

**Acceptance Criteria:**
- ✅ All settings configurable via UI
- ✅ Settings validation
- ✅ Real-time apply
- ✅ Audit log for changes

**Business Rules:**
- Hanya Owner/Admin yang bisa ubah settings
- Perubahan settings di-log
- Some settings butuh restart (maintenance mode)

---

### 6.24 Customer Portal

**Deskripsi:** Portal self-service untuk customer.

**Fitur Utama:**
- Dashboard (stats, upcoming appointments)
- Pet management (view, update)
- Health timeline
- Booking (appointment, pet hotel, grooming)
- Loyalty (points, tier, rewards)
- Subscription management
- Invoice history
- Profile management
- Referral code

**User Stories:**
- Sebagai Customer, saya bisa booking online 24/7
- Sebagai Customer, saya bisa lihat health timeline hewan saya
- Sebagai Customer, saya bisa lihat poin loyalty saya
- Sebagai Customer, saya bisa download invoice

**Acceptance Criteria:**
- ✅ Mobile-optimized
- ✅ Real-time updates
- ✅ Secure access
- ✅ Intuitive UI

**Business Rules:**
- Customer hanya bisa lihat data sendiri
- Booking butuh approval (optional)
- Referral code unik per customer

---

### 6.25 Kiosk

**Deskripsi:** Self-service kiosk untuk customer di toko.

**Fitur Utama:**
- QR check-in (untuk appointment)
- Quick booking
- Info toko (jam operasional, kontak)
- Touch-optimized UI
- Auto-sleep after inactivity

**User Stories:**
- Sebagai Customer, saya bisa check-in via QR
- Sebagai Customer, saya bisa booking cepat di kiosk

**Acceptance Criteria:**
- ✅ Touch-optimized
- ✅ QR scanner works
- ✅ Auto-sleep
- ✅ Fast response

**Business Rules:**
- Kiosk mode = simplified UI
- Auto-logout after 5 minutes inactivity

---

## 7. User Flows

### 7.1 Flow: Customer Datang ke Toko (Walk-in)

```
Customer datang
     ↓
Kasir sapa & cari data customer (by name/phone)
     ↓
[Customer baru?] → Ya → Buat customer baru
     ↓                    ↓
     ↓               [Buat hewan baru?] → Ya → Buat pet
     ↓                    ↓
     ↓               Pilih hewan
     ↓
Kasir tanya keperluan (beli produk / konsultasi / grooming / hotel)
     ↓
[Keperluan]
     ├─ Beli produk → POS → Scan produk → Payment → Struk
     ├─ Konsultasi → Buat appointment → Tunggu → Pemeriksaan → Invoice → Payment
     ├─ Grooming → Buat booking grooming → Tunggu → Grooming → Invoice → Payment
     └─ Hotel → Buat booking hotel → Check-in → Daily logs → Check-out → Invoice → Payment
     ↓
Loyalty points auto-calculate
     ↓
Payment (cash/transfer/QRIS/split/gift card/points)
     ↓
Cetak struk + Update stok + Notifikasi WhatsApp (optional)
     ↓
Selesai
```

### 7.2 Flow: Customer Booking Online (Portal)

```
Customer buka portal
     ↓
Login (atau register)
     ↓
Dashboard portal
     ↓
Pilih layanan (appointment / grooming / pet hotel)
     ↓
Pilih tanggal & waktu (lihat availability)
     ↓
Pilih hewan
     ↓
Konfirmasi booking
     ↓
Sistem kirim konfirmasi (WhatsApp/Email)
     ↓
Reminder H-2 & H-1 (WhatsApp/Email)
     ↓
Customer datang ke toko
     ↓
Check-in (QR code atau manual)
     ↓
Layanan diberikan
     ↓
Payment
     ↓
Loyalty points
     ↓
Selesai
```

### 7.3 Flow: Daily Operation (Staff)

```
Pagi: Kasir buka shift
     ↓
Input opening cash
     ↓
Sistem mulai tracking transaksi
     ↓
[Sepanjang hari]
     ├─ Transaksi POS
     ├─ Handle appointments
     ├─ Manage pet hotel (daily logs)
     ├─ Grooming sessions
     ├─ Receive stock (PO)
     └─ Handle expenses
     ↓
Sore/Malam: Kasir tutup shift
     ↓
Input closing cash
     ↓
Sistem hitung expected vs actual
     ↓
Report selisih (jika ada)
     ↓
Shift closed
     ↓
[Owner]
     ↓
Lihat daily report (auto-generated)
     ↓
Review low stock alerts
     ↓
Review pending payments
     ↓
Review pending approvals (PO, expense)
     ↓
Selesai
```

### 7.4 Flow: Payment Verification (Manual)

```
Customer bayar via transfer
     ↓
Customer upload bukti transfer (via portal atau kasih ke kasir)
     ↓
Payment status = PENDING
     ↓
Owner/Admin terima notifikasi
     ↓
Owner/Admin review bukti transfer
     ↓
[Valid?]
     ├─ Ya → Verify → Invoice status = PAID → Loyalty points awarded
     └─ Tidak → Reject → Notify customer → Customer re-upload
     ↓
Selesai
```

### 7.5 Flow: Stock Opname

```
Admin initiate stock opname
     ↓
Sistem generate list produk (per warehouse/category)
     ↓
Staff hitung fisik
     ↓
Input actual count
     ↓
Sistem hitung variance
     ↓
[Ada variance?]
     ├─ Ya → Investigate → Adjust (dengan approval)
     └─ Tidak → Confirm
     ↓
Stock updated
     ↓
Report generated
     ↓
Selesai
```

---

## 8. Information Architecture

### 8.1 Dashboard Navigation

```
📊 Dashboard
👥 Customers
   ├─ List
   ├─ Detail
   └─ Form (Create/Edit)
🐾 Pets
   ├─ List
   ├─ Detail
   └─ Form (Create/Edit)
📅 Appointments
   ├─ Calendar
   ├─ Queue
   └─ Detail
🏥 Medical Records
   ├─ List
   ├─ Detail
   ├─ Prescriptions
   └─ Lab Results
🏨 Pet Hotel
   ├─ Rooms Overview
   ├─ Bookings
   └─ Detail
✂️ Grooming
   ├─ Services
   ├─ Bookings
   └─ Detail
📦 Products
   ├─ List
   ├─ Categories
   └─ Detail
📊 Inventory
   ├─ Stock Overview
   ├─ Stock In
   ├─ Stock Out
   ├─ Stock Opname
   ├─ Low Stock
   ├─ Expiry
   ├─ Warehouses
   ├─ Transfers
   └─ Purchase Orders
💰 POS
💳 Invoices
   ├─ List
   └─ Detail
💵 Payments
   ├─ List
   ├─ Verification
   └─ Detail
🎁 Subscriptions
⭐ Loyalty
   ├─ Members
   ├─ Tiers
   └─ Transactions
🎯 Promotions
   ├─ Promos
   ├─ Gift Cards
   └─ Vouchers
💸 Expenses
   ├─ List
   ├─ Categories
   └─ Detail
👨‍💼 Employees
   ├─ List
   ├─ Commissions
   └─ Performance
📹 Telemedicine
🚚 Delivery
📢 Marketing
   ├─ Campaigns
   ├─ Segments
   └─ Referrals
💬 Feedback
   ├─ List
   └─ NPS
📈 Reports
   ├─ Sales
   ├─ Inventory
   ├─ Customers
   ├─ Employees
   ├─ Financial
   ├─ Profit & Loss
   ├─ Cash Flow
   └─ Custom
⚙️ Settings
   ├─ General
   ├─ Branches
   ├─ Payment
   ├─ Tax
   ├─ Loyalty
   ├─ Notification
   ├─ Printer
   ├─ Reminder
   ├─ Receipt
   ├─ Security
   ├─ Integration
   ├─ Backup
   ├─ Employees
   ├─ Subscription
   ├─ Delivery
   ├─ Inventory
   ├─ Custom Fields
   └─ Advanced
```

### 8.2 Portal Navigation (Customer)

```
🏠 Home (Dashboard)
📅 Bookings
   ├─ Appointments
   ├─ Pet Hotel
   └─ Grooming
🐾 My Pets
   ├─ List
   ├─ Detail
   └─ Health Timeline
⭐ Loyalty
   ├─ Points
   ├─ Tier
   └─ History
🎁 Subscriptions
💳 Invoices
👤 Profile
   ├─ Personal Info
   ├─ Referral Code
   └─ Notifications
```

---

## 9. User Interface Requirements

### 9.1 Design Principles

| Principle | Implementation |
|---|---|
| **Consistency** | Design tokens + shadcn/ui components |
| **Accessibility** | WCAG 2.1 AA compliant |
| **Responsiveness** | Mobile-first, tablet-optimized, desktop-enhanced |
| **Performance** | < 2s page load, skeleton loading |
| **Delight** | Micro-interactions, smooth animations |
| **Forgiveness** | Undo actions, confirm destructive ops |

### 9.2 Key UI Components

- **StatusBadge** — Color-coded status indicators
- **EmptyState** — Helpful empty states with CTAs
- **LoadingSkeleton** — Matching content shape
- **ConfirmDialog** — Destructive action confirmation
- **FileUpload** — Drag & drop with preview
- **GlobalSearch** — Cmd/Ctrl + K command palette
- **QuickActions** — Floating action button
- **OfflineBanner** — Network status indicator
- **DataTables** — Sortable, filterable, paginated
- **Forms** — Real-time validation, auto-save

### 9.3 Responsive Breakpoints

| Breakpoint | Width | Layout |
|---|---|---|
| Mobile | < 640px | Single column, drawer sidebar |
| Tablet | 640-1024px | 2 columns, collapsible sidebar |
| Desktop | > 1024px | Multi-column, full sidebar |

### 9.4 Accessibility Requirements

- Color contrast min 4.5:1 (text), 3:1 (UI)
- Keyboard navigation for all interactions
- Screen reader support (ARIA labels)
- Focus indicators visible
- Reduced motion support
- Touch targets min 44x44px

---

## 10. Non-Functional Requirements

### 10.1 Performance

| Metric | Target |
|---|---|
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Time to Interactive | < 3.5s |
| Cumulative Layout Shift | < 0.1 |
| First Input Delay | < 100ms |
| API Response Time | < 500ms (p95) |
| Page Load Time | < 2s |

### 10.2 Reliability

| Metric | Target |
|---|---|
| Uptime | 99.9% |
| Data Durability | 99.999% |
| Backup Frequency | Daily (auto) |
| Recovery Time Objective | < 1 hour |
| Recovery Point Objective | < 24 hours |

### 10.3 Security

| Aspect | Requirement |
|---|---|
| Authentication | Supabase Auth + PIN + optional 2FA |
| Authorization | RLS at database level |
| Data Encryption | At rest & in transit (TLS 1.3) |
| Session Management | Timeout configurable, secure cookies |
| Audit Logging | All critical actions logged |
| IP Whitelist | Optional for admin access |
| PIN Policy | Configurable length & complexity |
| Password Policy | Configurable (min length, complexity) |

### 10.4 Scalability

| Aspect | Target |
|---|---|
| Concurrent Users | 1.000+ per instance |
| Transactions/Day | 10.000+ per instance |
| Database Size | 100GB+ per instance |
| File Storage | 1TB+ per instance |
| Multi-Branch | 50+ branches per instance |

### 10.5 Maintainability

- Modular architecture
- Type-safe (TypeScript strict)
- Comprehensive documentation
- Automated testing (unit, integration, E2E)
- Code coverage > 80%
- CI/CD pipeline

### 10.6 Compatibility

| Browser | Version |
|---|---|
| Chrome | Latest 2 versions |
| Firefox | Latest 2 versions |
| Safari | Latest 2 versions |
| Edge | Latest 2 versions |
| Mobile Safari | iOS 14+ |
| Mobile Chrome | Android 8+ |

---

## 11. Success Metrics & KPIs

### 11.1 Product Metrics

| Metric | Definition | Target |
|---|---|---|
| **Daily Active Users** | Unique users logging in per day | 90% of staff |
| **Transactions/Day** | Total POS + invoice transactions | Baseline + 25% |
| **Time per Transaction** | Average time to complete transaction | < 3 minutes |
| **Feature Adoption** | % of users using each feature | > 70% for core features |
| **Error Rate** | % of transactions with errors | < 1% |

### 11.2 Business Metrics

| Metric | Definition | Target |
|---|---|---|
| **Customer Retention** | % of customers returning within 90 days | > 60% |
| **Average Transaction Value** | Average revenue per transaction | Baseline + 15% |
| **Repeat Purchase Rate** | % of customers with 2+ purchases | > 40% |
| **Loyalty Program Participation** | % of customers in loyalty program | > 50% |
| **Portal Adoption** | % of customers using portal | > 30% |

### 11.3 Operational Metrics

| Metric | Definition | Target |
|---|---|---|
| **Stock Accuracy** | % of stock count matching system | > 98% |
| **Low Stock Incidents** | Number of out-of-stock events | Baseline - 80% |
| **Expired Products** | Value of expired products written off | Baseline - 90% |
| **Payment Verification Time** | Average time to verify manual payment | < 2 hours |
| **Appointment No-Show Rate** | % of appointments with no-show | < 10% |

### 11.4 Customer Satisfaction

| Metric | Definition | Target |
|---|---|---|
| **NPS (Net Promoter Score)** | Customer willingness to recommend | > 50 |
| **CSAT (Customer Satisfaction)** | Satisfaction with service | > 4.5/5 |
| **Support Ticket Volume** | Number of support requests | Baseline - 50% |
| **Portal Rating** | App store rating | > 4.5/5 |

### 11.5 Technical Metrics

| Metric | Definition | Target |
|---|---|---|
| **Uptime** | System availability | > 99.9% |
| **Page Load Time** | Average page load | < 2s |
| **API Response Time** | Average API response | < 500ms |
| **Error Rate** | % of failed requests | < 0.1% |
| **Security Incidents** | Number of security breaches | 0 |

---

## 12. Release Scope

### 12.1 Included in Release

**Core Modules (25):**
1. ✅ Customer Management
2. ✅ Pet Management
3. ✅ Appointment & Queue
4. ✅ Medical Records
5. ✅ Prescriptions
6. ✅ Pet Hotel
7. ✅ Grooming
8. ✅ POS
9. ✅ Invoicing
10. ✅ Payment (Manual + Gateway)
11. ✅ Inventory
12. ✅ Purchase Orders
13. ✅ Loyalty Program
14. ✅ Promotions
15. ✅ Gift Cards & Vouchers
16. ✅ Subscriptions
17. ✅ Expenses
18. ✅ Employee & Commission
19. ✅ Telemedicine
20. ✅ Delivery
21. ✅ Marketing
22. ✅ Reports
23. ✅ Settings (17 categories)
24. ✅ Customer Portal
25. ✅ Self-Service Kiosk

**Integrations:**
- ✅ WhatsApp (Fonnte)
- ✅ Email (Resend)
- ✅ SMS (configurable)
- ✅ Payment Gateway (Midtrans, Xendit) — optional
- ✅ Video Call (telemedicine)

**Features:**
- ✅ Multi-branch support
- ✅ Real-time updates
- ✅ Barcode scanner
- ✅ Thermal printer
- ✅ PDF generation
- ✅ Import/Export CSV
- ✅ Keyboard shortcuts
- ✅ Global search
- ✅ Dark mode
- ✅ Multi-language (i18n)
- ✅ PWA support
- ✅ Push notifications
- ✅ Audit logs
- ✅ Backup & restore
- ✅ Automated setup

### 12.2 Technical Stack

| Layer | Technology |
|---|---|
| Frontend Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui + Radix Primitives |
| Backend | Supabase (PostgreSQL + Auth + RLS + Storage + Realtime) |
| Runtime Backend | Deno (Edge Functions) |
| Deployment | Vercel |
| State Client | Zustand + TanStack Query |
| Validation | Zod |
| Forms | React Hook Form |
| Charts | Recharts |
| PDF | @react-pdf/renderer |
| Barcode/QR | react-qr-code + jsbarcode |
| i18n | next-intl |

---

## 13. Out of Scope

### 13.1 Not Included in This Release

| Feature | Reason |
|---|---|
| **Mobile Native Apps** | Web PWA sudah cukup untuk MVP |
| **AI/ML Features** | Future enhancement |
| **Multi-currency** | Indonesia only (IDR) |
| **Multi-language beyond ID/EN** | Future enhancement |
| **Third-party marketplace integration** | Future enhancement |
| **IoT integration** (smart collar, etc.) | Future enhancement |
| **Veterinary lab equipment integration** | Future enhancement |
| **Accounting software integration** (Jurnal, Xero) | Future enhancement |
| **E-commerce website** | Portal sudah cukup |
| **Social media integration** | Future enhancement |

### 13.2 Future Enhancements (Post-Release)

- Mobile native apps (iOS & Android)
- AI-powered recommendations
- Predictive analytics
- Voice commands
- AR pet try-on
- Vet lab equipment integration
- Accounting software integration
- Marketplace integration (Tokopedia, Shopee)
- IoT integration
- Advanced AI features
- White-label solution

---

## 14. Risks & Mitigations

### 14.1 Technical Risks

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| **Supabase downtime** | Low | High | Multi-region backup, offline mode |
| **Data loss** | Very Low | Critical | Daily backups, point-in-time recovery |
| **Performance degradation** | Medium | Medium | Performance monitoring, optimization |
| **Security breach** | Low | Critical | RLS, encryption, audit logs, 2FA |
| **Third-party API failure** | Medium | Medium | Fallback mechanisms, retry logic |
| **Browser compatibility issues** | Low | Medium | Cross-browser testing |
| **Mobile responsiveness issues** | Medium | Low | Mobile-first design, testing |

### 14.2 Business Risks

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| **Low user adoption** | Medium | High | Training, onboarding, support |
| **Feature creep** | High | Medium | Strict scope management |
| **Competitor features** | Medium | Medium | Continuous improvement |
| **Customer churn** | Medium | High | Excellent support, regular updates |
| **Regulatory changes** | Low | Medium | Compliance monitoring |
| **Pricing pressure** | Medium | Medium | Value-based pricing |

### 14.3 Operational Risks

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| **Staff resistance to change** | Medium | High | Training, phased rollout |
| **Data migration issues** | Medium | Medium | Migration testing, rollback plan |
| **Integration failures** | Medium | Medium | Thorough testing, monitoring |
| **Support overload** | Medium | Medium | Comprehensive docs, self-service |
| **Training gaps** | Medium | Medium | Training materials, videos |

### 14.4 Mitigation Strategies

**Technical:**
- Comprehensive testing (unit, integration, E2E)
- Performance monitoring & alerting
- Security audits & penetration testing
- Disaster recovery plan
- Regular backups & testing restore

**Business:**
- Clear value proposition
- Competitive pricing
- Excellent customer support
- Regular feature updates
- Customer feedback loops

**Operational:**
- Comprehensive training program
- Phased rollout strategy
- Dedicated support team
- Documentation & knowledge base
- Community building

---

## 15. Glossary

### 15.1 Business Terms

| Term | Definition |
|---|---|
| **Petshop** | Toko yang menjual produk & layanan untuk hewan peliharaan |
| **Petcare** | Layanan perawatan hewan (grooming, hotel, medis) |
| **POS** | Point of Sale, sistem kasir |
| **SKU** | Stock Keeping Unit, kode unik produk |
| **COGS** | Cost of Goods Sold, harga pokok penjualan |
| **NPS** | Net Promoter Score, metrik kepuasan customer |
| **CSAT** | Customer Satisfaction Score |
| **Churn** | Customer yang berhenti berlangganan/membeli |
| **LTV** | Lifetime Value, total nilai customer sepanjang hubungan |
| **ARPU** | Average Revenue Per User |

### 15.2 Pet Terms

| Term | Definition |
|---|---|
| **Species** | Jenis hewan (dog, cat, bird, dll) |
| **Breed** | Ras hewan (Golden Retriever, Persian, dll) |
| **Microchip** | Chip identifikasi yang ditanam di hewan |
| **Pedigree** | Silsilah hewan (untuk hewan ras) |
| **Neutered** | Hewan yang sudah disteril |
| **Vaccine** | Vaksin untuk pencegahan penyakit |
| **Grooming** | Perawatan bulu & kebersihan hewan |
| **Pet Hotel** | Layanan penitipan hewan |

### 15.3 Technical Terms

| Term | Definition |
|---|---|
| **Next.js** | React framework untuk web applications |
| **Supabase** | Open-source Firebase alternative |
| **PostgreSQL** | Relational database |
| **RLS** | Row Level Security, otorisasi di level database |
| **Edge Functions** | Serverless functions di edge network |
| **PWA** | Progressive Web App, web app yang bisa di-install |
| **WCAG** | Web Content Accessibility Guidelines |
| **API** | Application Programming Interface |
| **WebSocket** | Protocol untuk real-time communication |
| **SSR** | Server-Side Rendering |

### 15.4 Petora-Specific Terms

| Term | Definition |
|---|---|
| **Health Timeline** | Visualisasi riwayat kesehatan hewan |
| **Pet Passport** | Dokumen digital identitas hewan |
| **Daily Log** | Catatan aktivitas harian hewan di hotel |
| **Queue** | Sistem antrian untuk appointment |
| **Split Payment** | Pembayaran dengan multi-method |
| **Proof of Delivery** | Bukti pengiriman (foto + signature) |
| **Commission Rule** | Aturan perhitungan komisi staff |
| **Custom Field** | Field tambahan yang bisa dibuat Owner |

---

## Penutup

Dokumen PRD ini merupakan acuan lengkap dan final untuk pengembangan sistem **Petora**. Setiap fitur, user flow, dan requirement yang tercantum di dokumen ini **wajib diimplementasikan** sesuai spesifikasi untuk memastikan:

✅ **Value delivery** — Memecahkan masalah nyata petshop & petcare
✅ **User satisfaction** — UX yang delightful untuk semua persona
✅ **Technical excellence** — Stack modern, performant, scalable
✅ **Business success** — KPI yang terukur dan achievable
✅ **Operational readiness** — Siap pakai dari hari pertama

### Key Success Factors

1. **Execution excellence** — Implementasi sesuai spesifikasi
2. **User-centric design** — Selalu prioritaskan user experience
3. **Quality assurance** — Testing komprehensif di setiap layer
4. **Customer support** — Support responsif & helpful
5. **Continuous improvement** — Feedback loop & iterasi

### Next Steps

1. Review & approval PRD oleh stakeholders
2. Setup development environment
3. Implementasi sesuai arsitektur & frontend contract
4. Testing komprehensif
5. Soft launch dengan beta users
6. Full launch
7. Monitoring & iteration

**Selamat membangun Petora — sistem manajemen terpadu terbaik untuk Petshop & Petcare Indonesia!** 🐾✨

---

*Dokumen PRD ini adalah acuan tunggal untuk pengembangan produk. Setiap perubahan harus melalui review dan update dokumen ini terlebih dahulu.*

**Dibuat:** 20 Agustus 2026
**Versi:** Final 1.0
**Status:** Approved for Implementation
