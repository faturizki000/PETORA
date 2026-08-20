# Product Requirements Document (PRD)
## Petora — Hak Akses & Otorisasi End-to-End
**Versi Final | 20 Agustus 2026**

---

## Daftar Isi

1. [Ringkasan Eksekutif](#1-ringkasan-eksekutif)
2. [Prinsip Otorisasi](#2-prinsip-otorisasi)
3. [Definisi Role](#3-definisi-role)
4. [Matrix Akses per Modul](#4-matrix-akses-per-modul)
5. [Row Level Security (RLS) Policies](#5-row-level-security-rls-policies)
6. [UI/UX Implications](#6-uiux-implications)
7. [Special Workflows](#7-special-workflows)
8. [Multi-Branch Access](#8-multi-branch-access)
9. [Audit & Compliance](#9-audit--compliance)
10. [Edge Cases & Exceptions](#10-edge-cases--exceptions)
11. [Testing Scenarios](#11-testing-scenarios)
12. [Implementation Checklist](#12-implementation-checklist)

---

## 1. Ringkasan Eksekutif

Dokumen ini mendefinisikan **kontrak hak akses final** untuk seluruh sistem Petora. Menjadi acuan tunggal bagi developer untuk mengimplementasikan otorisasi yang **konsisten, secure, dan maintainable** di setiap layer aplikasi.

### Key Principles

| Prinsip | Implementasi |
|---|---|
| **RLS as Source of Truth** | Otorisasi utama di level database (Supabase RLS) |
| **Defense in Depth** | Validasi di 3 layer: UI → Server Action → RLS |
| **Least Privilege** | Setiap role hanya dapat akses yang dibutuhkan |
| **Explicit Deny** | Default = no access, harus di-explisit-kan |
| **Audit Everything** | Semua aksi kritis di-log |
| **Branch Isolation** | Data per-cabang terisolasi via `branch_id` |

### Role Overview

| Role | Count | Scope |
|---|---|---|
| **OWNER** | 1+ per branch | Full access, konfigurasi sistem |
| **ADMIN** | 0+ per branch | Operasional penuh, tanpa konfigurasi kritis |
| **MANAGER** | 0+ per branch | Supervisi operasional, approval |
| **DOKTER** | 0+ per branch | Medis & klinis |
| **KASIR** | 0+ per branch | Transaksi & pembayaran |
| **GROOMER** | 0+ per branch | Layanan grooming |
| **COURIER** | 0+ per branch | Delivery |
| **CUSTOMER** | Unlimited | Data sendiri saja |

---

## 2. Prinsip Otorisasi

### 2.1 Layer Otorisasi

```
┌─────────────────────────────────────────────────┐
│ Layer 1: UI (Client-side)                        │
│ - Hide/show menu berdasarkan role                │
│ - Disable button tanpa permission                │
│ - Redirect dari halaman terlarang                │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ Layer 2: Server Actions (Next.js)                │
│ - Validasi role sebelum execute                  │
│ - Check ownership (customer data sendiri)        │
│ - Branch isolation check                         │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ Layer 3: RLS (Database) — SOURCE OF TRUTH        │
│ - Policy per table per role                      │
│ - Branch isolation enforced                      │
│ - Bypass TIDAK MUNGKIN                           │
└─────────────────────────────────────────────────┘
```

### 2.2 Permission Matrix Notation

| Symbol | Arti |
|---|---|
| ✅ **C** | Create (boleh buat baru) |
| ✅ **R** | Read (boleh lihat) |
| ✅ **U** | Update (boleh edit) |
| ✅ **D** | Delete (boleh hapus/soft-delete) |
| ✅ **A** | Approve (boleh approve) |
| ✅ **V** | Verify (boleh verifikasi) |
| ✅ **E** | Export (boleh export data) |
| ⚠️ **Own** | Hanya data sendiri |
| ⚠️ **Branch** | Hanya data cabang sendiri |
| ❌ **—** | Tidak ada akses |

### 2.3 Security Rules

1. **Jangan pernah trust client** — semua validasi harus di server
2. **RLS adalah benteng terakhir** — jika Layer 1 & 2 dibypass, RLS tetap melindungi
3. **Service role key** hanya untuk Edge Functions, jangan expose ke client
4. **Audit log** untuk semua aksi kritis (delete, approve, verify, settings change)
5. **Session timeout** configurable, default 30 menit
6. **Failed login lockout** setelah 5x percobaan

---

## 3. Definisi Role

### 3.1 OWNER

**Deskripsi:** Pemilik bisnis, memiliki kontrol penuh atas sistem dan konfigurasi.

**Scope:**
- Full access ke semua modul
- Konfigurasi sistem (17 kategori settings)
- Manajemen user & role
- Approval untuk transaksi kritis
- Akses ke laporan finansial lengkap
- Multi-branch management

**Trust Level:** 🔴 **Critical** — Dapat melakukan apa saja

**Contoh Persona:** Budi, pemilik 3 cabang Petora

---

### 3.2 ADMIN

**Deskripsi:** Administrator operasional, mengelola operasional harian tanpa akses ke konfigurasi kritis.

**Scope:**
- Akses penuh ke modul operasional
- **TIDAK bisa** ubah settings kritis (payment gateway, security, integration)
- Bisa manage user (kecuali OWNER)
- Approval untuk PO & expense
- Akses laporan lengkap

**Trust Level:** 🟠 **High** — Operasional penuh, tanpa konfigurasi sistem

**Contoh Persona:** Sari, manager operasional

---

### 3.3 MANAGER

**Deskripsi:** Supervisor cabang, fokus pada approval dan monitoring.

**Scope:**
- Read access ke semua modul di cabangnya
- Approval untuk expense & PO
- Override untuk kasus khusus (discount, refund)
- Laporan cabang
- **TIDAK bisa** ubah settings

**Trust Level:** 🟡 **Medium-High** — Supervisi, tanpa konfigurasi

**Contoh Persona:** Joko, supervisor cabang Bandung

---

### 3.4 DOKTER

**Deskripsi:** Dokter hewan, fokus pada layanan medis & klinis.

**Scope:**
- Medical records (create, read, update, sign)
- Prescriptions
- Appointments (assigned to them)
- Telemedicine sessions
- Lab results
- **TIDAK bisa** akses POS, inventory, financial

**Trust Level:** 🟢 **Medium** — Medis only

**Contoh Persona:** Dr. Andi, dokter hewan

---

### 3.5 KASIR

**Deskripsi:** Staff kasir, fokus pada transaksi & pembayaran.

**Scope:**
- POS (create invoice, record payment)
- Customer (create, read, update — terbatas)
- Products (read only)
- Cash shift management
- **TIDAK bisa** akses medical records, settings, reports lengkap

**Trust Level:** 🟢 **Medium** — Transaksi only

**Contoh Persona:** Rina, kasir

---

### 3.6 GROOMER

**Deskripsi:** Penata rambut hewan, fokus pada layanan grooming.

**Scope:**
- Grooming bookings (assigned to them)
- Grooming records (create, update)
- Pets (read only, untuk grooming)
- **TIDAK bisa** akses modul lain

**Trust Level:** 🟢 **Medium** — Grooming only

**Contoh Persona:** Lisa, groomer

---

### 3.7 COURIER

**Deskripsi:** Pengantar pesanan, fokus pada delivery.

**Scope:**
- Delivery tasks (assigned to them)
- Update delivery status
- Upload proof of delivery
- **TIDAK bisa** akses modul lain

**Trust Level:** 🔵 **Low** — Delivery only

**Contoh Persona:** Budi, kurir

---

### 3.8 CUSTOMER

**Deskripsi:** Customer/pemilik hewan, hanya akses data sendiri via portal.

**Scope:**
- Data sendiri (customer, pets, appointments)
- Booking via portal
- Loyalty points
- Invoice history
- **TIDAK bisa** akses data customer lain

**Trust Level:** 🔵 **External** — Data sendiri only

**Contoh Persona:** Dewi, customer

---

## 4. Matrix Akses per Modul

### 4.1 User Management

| Action | OWNER | ADMIN | MANAGER | DOKTER | KASIR | GROOMER | COURIER | CUSTOMER |
|---|---|---|---|---|---|---|---|---|
| List users | ✅ | ✅ | ⚠️ Branch | ❌ | ❌ | ❌ | ❌ | ❌ |
| Create user | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Update user | ✅ | ✅ (non-OWNER) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Delete user | ✅ | ✅ (non-OWNER) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Change role | ✅ | ✅ (non-OWNER) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Reset PIN | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Update own profile | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Own |

**Catatan:**
- ADMIN tidak bisa manage OWNER (proteksi hierarki)
- MANAGER hanya lihat user di cabangnya
- CUSTOMER hanya update profil sendiri

---

### 4.2 Customer Management

| Action | OWNER | ADMIN | MANAGER | DOKTER | KASIR | GROOMER | COURIER | CUSTOMER |
|---|---|---|---|---|---|---|---|---|
| List customers | ✅ | ✅ | ⚠️ Branch | ✅ | ✅ | ✅ (limited) | ❌ | ❌ |
| Create customer | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Read customer detail | ✅ | ✅ | ⚠️ Branch | ✅ | ✅ | ⚠️ Assigned | ❌ | ✅ Own |
| Update customer | ✅ | ✅ | ✅ | ❌ | ✅ (limited) | ❌ | ❌ | ✅ Own |
| Delete customer | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Assign tags | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Export customers | ✅ | ✅ | ⚠️ Branch | ❌ | ❌ | ❌ | ❌ | ❌ |
| View referral code | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ Own |

**Catatan:**
- KASIR hanya bisa update data dasar (phone, address), tidak bisa ubah tags
- GROOMER hanya lihat customer yang punya appointment dengan mereka
- CUSTOMER hanya lihat & update data sendiri

---

### 4.3 Pet Management

| Action | OWNER | ADMIN | MANAGER | DOKTER | KASIR | GROOMER | COURIER | CUSTOMER |
|---|---|---|---|---|---|---|---|---|
| List pets | ✅ | ✅ | ⚠️ Branch | ✅ | ✅ | ✅ (limited) | ❌ | ✅ Own |
| Create pet | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ Own |
| Read pet detail | ✅ | ✅ | ⚠️ Branch | ✅ | ✅ | ⚠️ Assigned | ❌ | ✅ Own |
| Update pet | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ Own |
| Delete pet | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Add vaccine | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Add weight log | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |
| Add disease/allergy | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Create passport | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| View health timeline | ✅ | ✅ | ⚠️ Branch | ✅ | ❌ | ⚠️ Assigned | ❌ | ✅ Own |

**Catatan:**
- GROOMER hanya lihat pet yang di-groom oleh mereka
- DOKTER punya akses penuh ke medical data
- CUSTOMER hanya lihat pet milik mereka

---

### 4.4 Appointment & Queue

| Action | OWNER | ADMIN | MANAGER | DOKTER | KASIR | GROOMER | COURIER | CUSTOMER |
|---|---|---|---|---|---|---|---|---|
| List appointments | ✅ | ✅ | ⚠️ Branch | ⚠️ Own | ✅ | ⚠️ Own | ❌ | ✅ Own |
| Create appointment | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ Own |
| Read appointment | ✅ | ✅ | ⚠️ Branch | ⚠️ Own | ✅ | ⚠️ Own | ❌ | ✅ Own |
| Update appointment | ✅ | ✅ | ✅ | ⚠️ Own | ✅ | ⚠️ Own | ❌ | ⚠️ Own (cancel) |
| Delete appointment | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Assign doctor | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Update status | ✅ | ✅ | ✅ | ⚠️ Own | ✅ | ⚠️ Own | ❌ | ❌ |
| Check-in | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| View queue | ✅ | ✅ | ⚠️ Branch | ⚠️ Own | ✅ | ⚠️ Own | ❌ | ❌ |
| Call next | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |

**Catatan:**
- DOKTER & GROOMER hanya lihat appointment mereka
- CUSTOMER hanya bisa cancel appointment sendiri (H-2)
- Queue real-time visible untuk semua staff

---

### 4.5 Medical Records

| Action | OWNER | ADMIN | MANAGER | DOKTER | KASIR | GROOMER | COURIER | CUSTOMER |
|---|---|---|---|---|---|---|---|---|
| List medical records | ✅ | ✅ | ⚠️ Branch | ⚠️ Own | ❌ | ❌ | ❌ | ✅ Own |
| Create medical record | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Read medical record | ✅ | ✅ | ⚠️ Branch | ⚠️ Own | ❌ | ❌ | ❌ | ✅ Own |
| Update medical record | ✅ | ❌ | ❌ | ⚠️ Own (OPEN) | ❌ | ❌ | ❌ | ❌ |
| Delete medical record | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Sign medical record | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Close medical record | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Add attachments | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| View lab results | ✅ | ✅ | ⚠️ Branch | ⚠️ Own | ❌ | ❌ | ❌ | ✅ Own |

**Catatan:**
- **HANYA DOKTER** yang bisa create/update medical record
- OWNER bisa lihat tapi tidak bisa edit (audit trail)
- CUSTOMER bisa lihat medical record hewan mereka (read-only)
- Closed records tidak bisa diedit oleh siapapun

---

### 4.6 Prescriptions

| Action | OWNER | ADMIN | MANAGER | DOKTER | KASIR | GROOMER | COURIER | CUSTOMER |
|---|---|---|---|---|---|---|---|---|
| List prescriptions | ✅ | ✅ | ⚠️ Branch | ⚠️ Own | ⚠️ Fulfill | ❌ | ❌ | ✅ Own |
| Create prescription | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Read prescription | ✅ | ✅ | ⚠️ Branch | ⚠️ Own | ⚠️ Fulfill | ❌ | ❌ | ✅ Own |
| Update prescription | ✅ | ❌ | ❌ | ⚠️ Own (DRAFT) | ❌ | ❌ | ❌ | ❌ |
| Sign prescription | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Fulfill prescription | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Cancel prescription | ✅ | ✅ | ❌ | ⚠️ Own (DRAFT) | ❌ | ❌ | ❌ | ❌ |
| View prescription (portal) | ✅ | ✅ | ⚠️ Branch | ⚠️ Own | ❌ | ❌ | ❌ | ✅ Own |

**Catatan:**
- KASIR bisa fulfill (auto-deduct stock)
- CUSTOMER bisa lihat resep mereka via portal

---

### 4.7 Pet Hotel

| Action | OWNER | ADMIN | MANAGER | DOKTER | KASIR | GROOMER | COURIER | CUSTOMER |
|---|---|---|---|---|---|---|---|---|
| List rooms | ✅ | ✅ | ⚠️ Branch | ❌ | ✅ | ❌ | ❌ | ❌ |
| Manage rooms | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| List bookings | ✅ | ✅ | ⚠️ Branch | ❌ | ✅ | ❌ | ❌ | ✅ Own |
| Create booking | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ Own |
| Read booking | ✅ | ✅ | ⚠️ Branch | ❌ | ✅ | ❌ | ❌ | ✅ Own |
| Update booking | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Check-in | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Check-out | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Add daily log | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Upload photo log | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| View logs (portal) | ✅ | ✅ | ⚠️ Branch | ❌ | ❌ | ❌ | ❌ | ✅ Own |
| Cancel booking | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ⚠️ Own |

**Catatan:**
- CUSTOMER bisa lihat daily logs hewan mereka via portal
- Check-in/out hanya staff

---

### 4.8 Grooming

| Action | OWNER | ADMIN | MANAGER | DOKTER | KASIR | GROOMER | COURIER | CUSTOMER |
|---|---|---|---|---|---|---|---|---|
| List services | ✅ | ✅ | ⚠️ Branch | ❌ | ✅ | ✅ | ❌ | ❌ |
| Manage services | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| List bookings | ✅ | ✅ | ⚠️ Branch | ❌ | ✅ | ⚠️ Own | ❌ | ✅ Own |
| Create booking | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ | ✅ Own |
| Read booking | ✅ | ✅ | ⚠️ Branch | ❌ | ✅ | ⚠️ Own | ❌ | ✅ Own |
| Update booking | ✅ | ✅ | ✅ | ❌ | ✅ | ⚠️ Own | ❌ | ❌ |
| Update status | ✅ | ✅ | ✅ | ❌ | ✅ | ⚠️ Own | ❌ | ❌ |
| Create record | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Upload before/after | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| View gallery (portal) | ✅ | ✅ | ⚠️ Branch | ❌ | ❌ | ❌ | ❌ | ✅ Own |
| Cancel booking | ✅ | ✅ | ✅ | ❌ | ✅ | ⚠️ Own | ❌ | ⚠️ Own |

**Catatan:**
- GROOMER hanya lihat & update booking mereka
- CUSTOMER bisa lihat hasil grooming via portal

---

### 4.9 Products & Inventory

| Action | OWNER | ADMIN | MANAGER | DOKTER | KASIR | GROOMER | COURIER | CUSTOMER |
|---|---|---|---|---|---|---|---|---|
| List products | ✅ | ✅ | ⚠️ Branch | ✅ | ✅ | ✅ (limited) | ❌ | ❌ |
| Create product | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Read product | ✅ | ✅ | ⚠️ Branch | ✅ | ✅ | ⚠️ Assigned | ❌ | ❌ |
| Update product | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Delete product | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage categories | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage suppliers | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View stock levels | ✅ | ✅ | ⚠️ Branch | ❌ | ✅ | ❌ | ❌ | ❌ |
| Stock movements | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Stock opname | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View low stock alerts | ✅ | ✅ | ⚠️ Branch | ❌ | ❌ | ❌ | ❌ | ❌ |
| View expiry alerts | ✅ | ✅ | ⚠️ Branch | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage warehouses | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Transfer stock | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Print barcode | ✅ | ✅ | ⚠️ Branch | ❌ | ✅ | ❌ | ❌ | ❌ |
| Export products | ✅ | ✅ | ⚠️ Branch | ❌ | ❌ | ❌ | ❌ | ❌ |

**Catatan:**
- GROOMER hanya lihat produk yang terkait grooming
- KASIR hanya read-only untuk produk
- Stock opname butuh approval OWNER/ADMIN

---

### 4.10 Purchase Orders

| Action | OWNER | ADMIN | MANAGER | DOKTER | KASIR | GROOMER | COURIER | CUSTOMER |
|---|---|---|---|---|---|---|---|---|
| List POs | ✅ | ✅ | ⚠️ Branch | ❌ | ❌ | ❌ | ❌ | ❌ |
| Create PO | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Read PO | ✅ | ✅ | ⚠️ Branch | ❌ | ❌ | ❌ | ❌ | ❌ |
| Update PO | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Delete PO | ✅ | ✅ (DRAFT) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Approve PO | ✅ | ✅ | ⚠️ Own branch | ❌ | ❌ | ❌ | ❌ | ❌ |
| Receive goods | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Cancel PO | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

**Catatan:**
- PO butuh approval (threshold configurable)
- MANAGER bisa approve PO di cabangnya

---

### 4.11 POS & Invoicing

| Action | OWNER | ADMIN | MANAGER | DOKTER | KASIR | GROOMER | COURIER | CUSTOMER |
|---|---|---|---|---|---|---|---|---|
| Create invoice | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| List invoices | ✅ | ✅ | ⚠️ Branch | ⚠️ Own | ⚠️ Own | ❌ | ❌ | ✅ Own |
| Read invoice | ✅ | ✅ | ⚠️ Branch | ⚠️ Own | ⚠️ Own | ❌ | ❌ | ✅ Own |
| Update invoice | ✅ (DRAFT) | ✅ (DRAFT) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Cancel invoice | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Refund invoice | ✅ | ✅ (approve) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Apply discount | ✅ | ✅ | ✅ (override) | ❌ | ⚠️ Limited | ❌ | ❌ | ❌ |
| Void transaction | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Print invoice | ✅ | ✅ | ⚠️ Branch | ⚠️ Own | ⚠️ Own | ❌ | ❌ | ✅ Own |
| Email invoice | ✅ | ✅ | ⚠️ Branch | ❌ | ⚠️ Own | ❌ | ❌ | ✅ Own |
| Download PDF | ✅ | ✅ | ⚠️ Branch | ⚠️ Own | ⚠️ Own | ❌ | ❌ | ✅ Own |

**Catatan:**
- KASIR hanya lihat invoice yang mereka buat
- Refund butuh approval OWNER/ADMIN
- Discount override oleh MANAGER harus di-log

---

### 4.12 Payment

| Action | OWNER | ADMIN | MANAGER | DOKTER | KASIR | GROOMER | COURIER | CUSTOMER |
|---|---|---|---|---|---|---|---|---|
| List payments | ✅ | ✅ | ⚠️ Branch | ❌ | ⚠️ Own | ❌ | ❌ | ✅ Own |
| Record payment | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Read payment | ✅ | ✅ | ⚠️ Branch | ❌ | ⚠️ Own | ❌ | ❌ | ✅ Own |
| Verify payment | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Reject payment | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Refund payment | ✅ | ✅ (approve) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Split payment | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Upload proof (portal) | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ Own |
| View cash shift | ✅ | ✅ | ⚠️ Branch | ❌ | ⚠️ Own | ❌ | ❌ | ❌ |
| Close cash shift | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |

**Catatan:**
- Verifikasi payment manual hanya OWNER/ADMIN
- CUSTOMER bisa upload bukti transfer via portal
- Cash shift hanya untuk KASIR yang bersangkutan

---

### 4.13 Loyalty Program

| Action | OWNER | ADMIN | MANAGER | DOKTER | KASIR | GROOMER | COURIER | CUSTOMER |
|---|---|---|---|---|---|---|---|---|
| Configure loyalty | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| List members | ✅ | ✅ | ⚠️ Branch | ❌ | ✅ | ❌ | ❌ | ❌ |
| Read member | ✅ | ✅ | ⚠️ Branch | ❌ | ✅ | ❌ | ❌ | ✅ Own |
| Adjust points | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Redeem points | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ Own |
| View transactions | ✅ | ✅ | ⚠️ Branch | ❌ | ⚠️ Own | ❌ | ❌ | ✅ Own |
| Manage tiers | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Export members | ✅ | ✅ | ⚠️ Branch | ❌ | ❌ | ❌ | ❌ | ❌ |

**Catatan:**
- Points auto-earn saat transaksi
- Adjust points hanya OWNER/ADMIN (manual correction)
- CUSTOMER hanya lihat poin mereka sendiri

---

### 4.14 Promotions, Vouchers & Gift Cards

| Action | OWNER | ADMIN | MANAGER | DOKTER | KASIR | GROOMER | COURIER | CUSTOMER |
|---|---|---|---|---|---|---|---|---|
| Create promotion | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| List promotions | ✅ | ✅ | ⚠️ Branch | ✅ | ✅ | ❌ | ❌ | ✅ |
| Update promotion | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Deactivate promotion | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Apply promo code | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ |
| Create gift card | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Redeem gift card | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Top-up gift card | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Create voucher | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Redeem voucher | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ |
| View usage | ✅ | ✅ | ⚠️ Branch | ❌ | ❌ | ❌ | ❌ | ❌ |

---

### 4.15 Subscriptions

| Action | OWNER | ADMIN | MANAGER | DOKTER | KASIR | GROOMER | COURIER | CUSTOMER |
|---|---|---|---|---|---|---|---|---|
| Manage plans | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| List subscriptions | ✅ | ✅ | ⚠️ Branch | ❌ | ✅ | ❌ | ❌ | ✅ Own |
| Create subscription | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ |
| Read subscription | ✅ | ✅ | ⚠️ Branch | ❌ | ✅ | ❌ | ❌ | ✅ Own |
| Update subscription | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Pause subscription | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ Own |
| Cancel subscription | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ Own |
| Renew subscription | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |

---

### 4.16 Expenses

| Action | OWNER | ADMIN | MANAGER | DOKTER | KASIR | GROOMER | COURIER | CUSTOMER |
|---|---|---|---|---|---|---|---|---|
| List expenses | ✅ | ✅ | ⚠️ Branch | ❌ | ❌ | ❌ | ❌ | ❌ |
| Create expense | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Read expense | ✅ | ✅ | ⚠️ Branch | ❌ | ⚠️ Own | ❌ | ❌ | ❌ |
| Update expense | ✅ | ✅ (PENDING) | ⚠️ Own (PENDING) | ❌ | ⚠️ Own (PENDING) | ❌ | ❌ | ❌ |
| Delete expense | ✅ | ✅ (PENDING) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Approve expense | ✅ | ✅ | ⚠️ Own branch | ❌ | ❌ | ❌ | ❌ | ❌ |
| Reject expense | ✅ | ✅ | ⚠️ Own branch | ❌ | ❌ | ❌ | ❌ | ❌ |
| Export expenses | ✅ | ✅ | ⚠️ Branch | ❌ | ❌ | ❌ | ❌ | ❌ |

**Catatan:**
- Expense butuh approval (threshold configurable)
- Creator bisa edit selama status PENDING

---

### 4.17 Employee & Commission

| Action | OWNER | ADMIN | MANAGER | DOKTER | KASIR | GROOMER | COURIER | CUSTOMER |
|---|---|---|---|---|---|---|---|---|
| Configure commission rules | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| List employees | ✅ | ✅ | ⚠️ Branch | ❌ | ❌ | ❌ | ❌ | ❌ |
| Read employee | ✅ | ✅ | ⚠️ Branch | ⚠️ Own | ⚠️ Own | ⚠️ Own | ⚠️ Own | ❌ |
| View performance | ✅ | ✅ | ⚠️ Branch | ⚠️ Own | ⚠️ Own | ⚠️ Own | ⚠️ Own | ❌ |
| Calculate commission | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View own commission | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Pay commission | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

### 4.18 Telemedicine

| Action | OWNER | ADMIN | MANAGER | DOKTER | KASIR | GROOMER | COURIER | CUSTOMER |
|---|---|---|---|---|---|---|---|---|
| List sessions | ✅ | ✅ | ⚠️ Branch | ⚠️ Own | ❌ | ❌ | ❌ | ✅ Own |
| Create session | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Read session | ✅ | ✅ | ⚠️ Branch | ⚠️ Own | ❌ | ❌ | ❌ | ✅ Own |
| Join video call | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ Own |
| Update status | ✅ | ✅ | ✅ | ⚠️ Own | ❌ | ❌ | ❌ | ❌ |
| View recording | ✅ | ✅ | ⚠️ Branch | ⚠️ Own | ❌ | ❌ | ❌ | ✅ Own |
| Cancel session | ✅ | ✅ | ✅ | ⚠️ Own | ✅ | ❌ | ❌ | ⚠️ Own |

---

### 4.19 Delivery

| Action | OWNER | ADMIN | MANAGER | DOKTER | KASIR | GROOMER | COURIER | CUSTOMER |
|---|---|---|---|---|---|---|---|---|
| Manage zones | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| List deliveries | ✅ | ✅ | ⚠️ Branch | ❌ | ✅ | ❌ | ⚠️ Own | ✅ Own |
| Create delivery | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Read delivery | ✅ | ✅ | ⚠️ Branch | ❌ | ✅ | ❌ | ⚠️ Own | ✅ Own |
| Assign courier | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Update status | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ⚠️ Own | ❌ |
| Upload proof | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ⚠️ Own | ❌ |
| Track delivery | ✅ | ✅ | ⚠️ Branch | ❌ | ✅ | ❌ | ⚠️ Own | ✅ Own |
| Cancel delivery | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |

---

### 4.20 Marketing & Referrals

| Action | OWNER | ADMIN | MANAGER | DOKTER | KASIR | GROOMER | COURIER | CUSTOMER |
|---|---|---|---|---|---|---|---|---|
| Create campaign | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| List campaigns | ✅ | ✅ | ⚠️ Branch | ❌ | ❌ | ❌ | ❌ | ❌ |
| Launch campaign | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View analytics | ✅ | ✅ | ⚠️ Branch | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage segments | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View referrals | ✅ | ✅ | ⚠️ Branch | ❌ | ❌ | ❌ | ❌ | ✅ Own |
| Get referral code | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Redeem referral | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

---

### 4.21 Feedback & NPS

| Action | OWNER | ADMIN | MANAGER | DOKTER | KASIR | GROOMER | COURIER | CUSTOMER |
|---|---|---|---|---|---|---|---|---|
| List feedback | ✅ | ✅ | ⚠️ Branch | ⚠️ Own | ⚠️ Own | ⚠️ Own | ⚠️ Own | ❌ |
| Read feedback | ✅ | ✅ | ⚠️ Branch | ⚠️ Own | ⚠️ Own | ⚠️ Own | ⚠️ Own | ✅ Own |
| Respond feedback | ✅ | ✅ | ✅ | ⚠️ Own | ❌ | ⚠️ Own | ❌ | ❌ |
| Submit feedback | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| View NPS | ✅ | ✅ | ⚠️ Branch | ❌ | ❌ | ❌ | ❌ | ❌ |

---

### 4.22 Reports

| Action | OWNER | ADMIN | MANAGER | DOKTER | KASIR | GROOMER | COURIER | CUSTOMER |
|---|---|---|---|---|---|---|---|---|
| Sales reports | ✅ | ✅ | ⚠️ Branch | ❌ | ⚠️ Own | ❌ | ❌ | ❌ |
| Inventory reports | ✅ | ✅ | ⚠️ Branch | ❌ | ❌ | ❌ | ❌ | ❌ |
| Financial reports | ✅ | ✅ | ⚠️ Branch | ❌ | ❌ | ❌ | ❌ | ❌ |
| Customer reports | ✅ | ✅ | ⚠️ Branch | ❌ | ❌ | ❌ | ❌ | ❌ |
| Employee reports | ✅ | ✅ | ⚠️ Branch | ⚠️ Own | ⚠️ Own | ⚠️ Own | ⚠️ Own | ❌ |
| Medical reports | ✅ | ✅ | ⚠️ Branch | ⚠️ Own | ❌ | ❌ | ❌ | ❌ |
| Operational reports | ✅ | ✅ | ⚠️ Branch | ⚠️ Own | ⚠️ Own | ⚠️ Own | ⚠️ Own | ❌ |
| Custom reports | ✅ | ✅ | ⚠️ Branch | ❌ | ❌ | ❌ | ❌ | ❌ |
| Export reports | ✅ | ✅ | ⚠️ Branch | ❌ | ❌ | ❌ | ❌ | ❌ |

**Catatan:**
- Financial reports (P&L, cash flow) hanya OWNER/ADMIN
- MANAGER hanya lihat laporan cabangnya

---

### 4.23 Settings (17 Kategori)

| Setting Category | OWNER | ADMIN | MANAGER | DOKTER | KASIR | GROOMER | COURIER | CUSTOMER |
|---|---|---|---|---|---|---|---|---|
| General | ✅ RW | ✅ RW | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Branches | ✅ RW | ✅ R | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Payment | ✅ RW | ✅ R | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Tax | ✅ RW | ✅ R | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Loyalty | ✅ RW | ✅ R | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Notification | ✅ RW | ✅ R | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Printer | ✅ RW | ✅ R | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Reminder | ✅ RW | ✅ R | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Receipt | ✅ RW | ✅ R | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Security | ✅ RW | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Integration | ✅ RW | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Backup | ✅ RW | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Employees | ✅ RW | ✅ R | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Subscription | ✅ RW | ✅ R | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Delivery | ✅ RW | ✅ R | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Inventory | ✅ RW | ✅ R | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Custom Fields | ✅ RW | ✅ R | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Advanced | ✅ RW | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

**Catatan:**
- **CRITICAL:** Security, Integration, Backup, Advanced — hanya OWNER
- ADMIN bisa lihat (read) hampir semua settings, tapi tidak bisa edit yang kritis
- Semua perubahan settings di-audit log

---

### 4.24 Customer Portal

| Action | OWNER | ADMIN | MANAGER | DOKTER | KASIR | GROOMER | COURIER | CUSTOMER |
|---|---|---|---|---|---|---|---|---|
| View dashboard | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Own |
| View own profile | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Own |
| Update own profile | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Own |
| Manage own pets | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Own |
| Book appointment | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Cancel own booking | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Own |
| View own invoices | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Own |
| Pay invoice | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Own |
| Upload payment proof | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Own |
| View loyalty points | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Own |
| Redeem points | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Own |
| View subscriptions | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Own |
| Manage subscriptions | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Own |
| View health timeline | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Own |
| View medical records | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Own |
| View pet hotel logs | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Own |
| View grooming gallery | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Own |
| Submit feedback | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Get referral code | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| View notifications | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Own |

---

### 4.25 Kiosk (Self-Service)

| Action | OWNER | ADMIN | MANAGER | DOKTER | KASIR | GROOMER | COURIER | CUSTOMER |
|---|---|---|---|---|---|---|---|---|
| QR check-in | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Quick booking | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| View store info | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| View queue status | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 5. Row Level Security (RLS) Policies

### 5.1 Prinsip RLS

1. **Enable RLS di semua tabel** — tidak ada pengecualian
2. **Default deny** — jika tidak ada policy matching, akses ditolak
3. **Policy per role** — setiap role punya policy sendiri
4. **Branch isolation** — data per-cabang diisolasi via `branch_id`
5. **Ownership check** — customer hanya lihat data sendiri

### 5.2 Helper Functions

```sql
-- Function untuk cek role user
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
  SELECT role FROM users WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Function untuk cek branch user
CREATE OR REPLACE FUNCTION get_user_branch_id()
RETURNS UUID AS $$
  SELECT branch_id FROM users WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Function untuk cek customer_id dari user (untuk CUSTOMER role)
CREATE OR REPLACE FUNCTION get_user_customer_id()
RETURNS UUID AS $$
  SELECT customer_id FROM users WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Function untuk cek apakah user adalah staff
CREATE OR REPLACE FUNCTION is_staff()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('OWNER', 'ADMIN', 'MANAGER', 'DOKTER', 'KASIR', 'GROOMER', 'COURIER')
    AND is_active = TRUE
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Function untuk cek apakah user adalah owner/admin
CREATE OR REPLACE FUNCTION is_owner_or_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('OWNER', 'ADMIN')
    AND is_active = TRUE
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;
```

### 5.3 Users Table RLS

```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Semua staff bisa lihat users di branch yang sama
CREATE POLICY "Staff can view users in same branch"
ON users FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.is_active = TRUE
    AND (
      u.branch_id = users.branch_id 
      OR u.role = 'OWNER'
    )
  )
);

-- User bisa lihat data sendiri
CREATE POLICY "Users can view own profile"
ON users FOR SELECT
TO authenticated
USING (id = auth.uid());

-- Hanya OWNER yang bisa create user
CREATE POLICY "Only owners can create users"
ON users FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.role = 'OWNER'
    AND u.is_active = TRUE
  )
);

-- OWNER bisa update semua, ADMIN bisa update non-OWNER
CREATE POLICY "Owners can update all users"
ON users FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.role = 'OWNER'
    AND u.is_active = TRUE
  )
);

CREATE POLICY "Admins can update non-owner users"
ON users FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.role = 'ADMIN'
    AND u.is_active = TRUE
  )
  AND users.role != 'OWNER'
  AND (users.branch_id = get_user_branch_id() OR get_user_branch_id() IS NULL)
);

-- User bisa update profil sendiri (kecuali role)
CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Hanya OWNER yang bisa delete user
CREATE POLICY "Only owners can delete users"
ON users FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.role = 'OWNER'
    AND u.is_active = TRUE
  )
  AND users.role != 'OWNER'  -- OWNER tidak bisa dihapus
);
```

### 5.4 Customers Table RLS

```sql
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Staff bisa lihat semua customers di branch yang sama
CREATE POLICY "Staff can view customers in branch"
ON customers FOR SELECT
TO authenticated
USING (
  is_staff()
  AND (branch_id = get_user_branch_id() OR branch_id IS NULL)
);

-- Customer bisa lihat data sendiri
CREATE POLICY "Customers can view own data"
ON customers FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.role = 'CUSTOMER'
    AND u.customer_id = customers.id
  )
);

-- Staff bisa create customers
CREATE POLICY "Staff can create customers"
ON customers FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.role IN ('OWNER', 'ADMIN', 'MANAGER', 'DOKTER', 'KASIR')
    AND u.is_active = TRUE
    AND (u.branch_id = customers.branch_id OR customers.branch_id IS NULL)
  )
);

-- Staff bisa update customers
CREATE POLICY "Staff can update customers"
ON customers FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.role IN ('OWNER', 'ADMIN', 'MANAGER', 'KASIR')
    AND u.is_active = TRUE
    AND (u.branch_id = customers.branch_id OR customers.branch_id IS NULL)
  )
);

-- Customer bisa update data sendiri
CREATE POLICY "Customers can update own data"
ON customers FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.role = 'CUSTOMER'
    AND u.customer_id = customers.id
  )
);

-- Hanya OWNER/ADMIN yang bisa delete
CREATE POLICY "Owners and admins can delete customers"
ON customers FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.role IN ('OWNER', 'ADMIN')
    AND u.is_active = TRUE
    AND (u.branch_id = customers.branch_id OR customers.branch_id IS NULL)
  )
);
```

### 5.5 Pets Table RLS

```sql
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;

-- Staff bisa lihat semua pets di branch customer
CREATE POLICY "Staff can view pets in branch"
ON pets FOR SELECT
TO authenticated
USING (
  is_staff()
  AND EXISTS (
    SELECT 1 FROM customers c
    JOIN users u ON u.branch_id = c.branch_id OR u.role = 'OWNER'
    WHERE c.id = pets.customer_id
    AND u.id = auth.uid()
    AND u.is_active = TRUE
  )
);

-- Customer bisa lihat pets mereka sendiri
CREATE POLICY "Customers can view own pets"
ON pets FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM customers c
    JOIN users u ON u.customer_id = c.id
    WHERE c.id = pets.customer_id
    AND u.id = auth.uid()
    AND u.role = 'CUSTOMER'
  )
);

-- GROOMER hanya lihat pets yang di-groom oleh mereka
CREATE POLICY "Groomers can view assigned pets"
ON pets FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.role = 'GROOMER'
    AND u.is_active = TRUE
    AND EXISTS (
      SELECT 1 FROM grooming_bookings gb
      WHERE gb.pet_id = pets.id
      AND gb.groomer_id = u.id
    )
  )
);

-- Staff bisa create pets
CREATE POLICY "Staff can create pets"
ON pets FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.role IN ('OWNER', 'ADMIN', 'MANAGER', 'DOKTER', 'KASIR')
    AND u.is_active = TRUE
  )
  AND EXISTS (
    SELECT 1 FROM customers c
    WHERE c.id = pets.customer_id
    AND (c.branch_id = get_user_branch_id() OR get_user_branch_id() IS NULL)
  )
);

-- Customer bisa create pets untuk diri sendiri
CREATE POLICY "Customers can create own pets"
ON pets FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.role = 'CUSTOMER'
    AND u.customer_id = pets.customer_id
  )
);

-- Staff bisa update pets
CREATE POLICY "Staff can update pets"
ON pets FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.role IN ('OWNER', 'ADMIN', 'MANAGER', 'DOKTER')
    AND u.is_active = TRUE
  )
);

-- Customer bisa update pets sendiri
CREATE POLICY "Customers can update own pets"
ON pets FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.role = 'CUSTOMER'
    AND u.customer_id = pets.customer_id
  )
);

-- Hanya OWNER/ADMIN yang bisa delete
CREATE POLICY "Owners and admins can delete pets"
ON pets FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.role IN ('OWNER', 'ADMIN')
    AND u.is_active = TRUE
  )
);
```

### 5.6 Medical Records RLS (Strict)

```sql
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;

-- Hanya medical staff yang bisa lihat
CREATE POLICY "Medical staff can view records"
ON medical_records FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.role IN ('OWNER', 'ADMIN', 'MANAGER', 'DOKTER')
    AND u.is_active = TRUE
    AND (u.branch_id = medical_records.branch_id OR medical_records.branch_id IS NULL)
  )
);

-- Customer bisa lihat rekam medis hewan mereka
CREATE POLICY "Customers can view own pet records"
ON medical_records FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users u
    JOIN customers c ON c.id = u.customer_id
    JOIN appointments a ON a.id = medical_records.appointment_id
    WHERE u.id = auth.uid()
    AND u.role = 'CUSTOMER'
    AND a.customer_id = c.id
  )
);

-- HANYA DOKTER yang bisa create medical record
CREATE POLICY "Only doctors can create medical records"
ON medical_records FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.role = 'DOKTER'
    AND u.is_active = TRUE
    AND u.id = medical_records.doctor_id
  )
);

-- DOKTER bisa update record mereka sendiri (jika OPEN)
CREATE POLICY "Doctors can update own open records"
ON medical_records FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.role = 'DOKTER'
    AND u.is_active = TRUE
    AND u.id = medical_records.doctor_id
    AND medical_records.status = 'OPEN'
  )
);

-- OWNER bisa update semua (audit)
CREATE POLICY "Owners can update all records"
ON medical_records FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.role = 'OWNER'
    AND u.is_active = TRUE
  )
);

-- Hanya OWNER yang bisa delete
CREATE POLICY "Only owners can delete medical records"
ON medical_records FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.role = 'OWNER'
    AND u.is_active = TRUE
  )
);
```

### 5.7 Invoices RLS

```sql
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Staff bisa lihat invoices di branch
CREATE POLICY "Staff can view invoices in branch"
ON invoices FOR SELECT
TO authenticated
USING (
  is_staff()
  AND (branch_id = get_user_branch_id() OR branch_id IS NULL)
  AND (
    get_user_role() IN ('OWNER', 'ADMIN', 'MANAGER')
    OR created_by = auth.uid()  -- KASIR hanya lihat invoice mereka
  )
);

-- DOKTER hanya lihat invoice terkait appointment mereka
CREATE POLICY "Doctors can view own appointment invoices"
ON invoices FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.role = 'DOKTER'
    AND u.is_active = TRUE
    AND EXISTS (
      SELECT 1 FROM medical_records mr
      JOIN appointments a ON a.id = mr.appointment_id
      JOIN invoice_items ii ON ii.procedure_id = mr.id
      WHERE ii.invoice_id = invoices.id
      AND a.doctor_id = u.id
    )
  )
);

-- Customer bisa lihat invoice mereka
CREATE POLICY "Customers can view own invoices"
ON invoices FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.role = 'CUSTOMER'
    AND u.customer_id = invoices.customer_id
  )
);

-- KASIR bisa create invoice
CREATE POLICY "Kasir can create invoices"
ON invoices FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.role IN ('OWNER', 'ADMIN', 'KASIR')
    AND u.is_active = TRUE
  )
);

-- Hanya OWNER/ADMIN yang bisa delete/cancel
CREATE POLICY "Owners and admins can cancel invoices"
ON invoices FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.role IN ('OWNER', 'ADMIN')
    AND u.is_active = TRUE
  )
  AND invoices.status = 'DRAFT'
);
```

### 5.8 Payments RLS

```sql
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Staff bisa lihat payments di branch
CREATE POLICY "Staff can view payments in branch"
ON payments FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.role IN ('OWNER', 'ADMIN', 'MANAGER')
    AND u.is_active = TRUE
  )
  OR EXISTS (
    SELECT 1 FROM invoices i
    JOIN users u ON u.id = auth.uid()
    WHERE i.id = payments.invoice_id
    AND i.created_by = u.id
    AND u.role = 'KASIR'
  )
);

-- Customer bisa lihat payments mereka
CREATE POLICY "Customers can view own payments"
ON payments FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM invoices i
    JOIN users u ON u.customer_id = i.customer_id
    WHERE i.id = payments.invoice_id
    AND u.id = auth.uid()
    AND u.role = 'CUSTOMER'
  )
);

-- KASIR bisa create payments
CREATE POLICY "Kasir can create payments"
ON payments FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.role IN ('OWNER', 'ADMIN', 'KASIR')
    AND u.is_active = TRUE
  )
);

-- Customer bisa create payment (upload proof)
CREATE POLICY "Customers can create own payments"
ON payments FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM invoices i
    JOIN users u ON u.customer_id = i.customer_id
    WHERE i.id = payments.invoice_id
    AND u.id = auth.uid()
    AND u.role = 'CUSTOMER'
  )
);

-- HANYA OWNER/ADMIN yang bisa verify payment
CREATE POLICY "Only owners/admins can verify payments"
ON payments FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.role IN ('OWNER', 'ADMIN')
    AND u.is_active = TRUE
  )
);
```

### 5.9 Settings RLS

```sql
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Staff bisa lihat settings
CREATE POLICY "Staff can view settings"
ON settings FOR SELECT
TO authenticated
USING (is_staff());

-- Public settings bisa dilihat customer
CREATE POLICY "Public settings viewable by customers"
ON settings FOR SELECT
TO authenticated
USING (is_public = TRUE);

-- HANYA OWNER yang bisa update settings kritis
CREATE POLICY "Only owners can update critical settings"
ON settings FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.role = 'OWNER'
    AND u.is_active = TRUE
  )
)
WITH CHECK (
  category IN ('SECURITY', 'INTEGRATION', 'BACKUP', 'ADVANCED')
);

-- OWNER & ADMIN bisa update operational settings
CREATE POLICY "Owners and admins can update operational settings"
ON settings FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.role IN ('OWNER', 'ADMIN')
    AND u.is_active = TRUE
  )
  AND category NOT IN ('SECURITY', 'INTEGRATION', 'BACKUP', 'ADVANCED')
);
```

### 5.10 Audit Logs RLS

```sql
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Hanya OWNER/ADMIN yang bisa lihat audit logs
CREATE POLICY "Only owners/admins can view audit logs"
ON audit_logs FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.role IN ('OWNER', 'ADMIN')
    AND u.is_active = TRUE
    AND (u.branch_id = audit_logs.branch_id OR audit_logs.branch_id IS NULL)
  )
);

-- System bisa insert audit logs (via trigger)
CREATE POLICY "System can insert audit logs"
ON audit_logs FOR INSERT
TO authenticated
WITH CHECK (TRUE);

-- Tidak ada yang bisa update/delete audit logs
-- (immutable by design)
```

### 5.11 Branch Isolation Pattern

```sql
-- Pattern untuk semua tabel dengan branch_id
-- Contoh: appointments table

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Staff hanya lihat appointments di branch mereka
CREATE POLICY "Staff can view appointments in branch"
ON appointments FOR SELECT
TO authenticated
USING (
  is_staff()
  AND (
    get_user_role() IN ('OWNER', 'ADMIN')  -- OWNER/ADMIN bisa lihat semua
    OR branch_id = get_user_branch_id()
    OR branch_id IS NULL
  )
  AND (
    get_user_role() IN ('OWNER', 'ADMIN', 'MANAGER', 'KASIR')
    OR doctor_id = auth.uid()  -- DOKTER hanya lihat appointment mereka
  )
);

-- Customer hanya lihat appointment mereka
CREATE POLICY "Customers can view own appointments"
ON appointments FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.role = 'CUSTOMER'
    AND u.customer_id = appointments.customer_id
  )
);
```

---

## 6. UI/UX Implications

### 6.1 Navigation Visibility

```typescript
// lib/navigation.ts
export const NAVIGATION_ITEMS = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['OWNER', 'ADMIN', 'MANAGER', 'DOKTER', 'KASIR', 'GROOMER', 'COURIER'],
  },
  {
    label: 'Customers',
    href: '/customers',
    icon: Users,
    roles: ['OWNER', 'ADMIN', 'MANAGER', 'DOKTER', 'KASIR'],
  },
  {
    label: 'Medical Records',
    href: '/medical-records',
    icon: FileText,
    roles: ['OWNER', 'ADMIN', 'MANAGER', 'DOKTER'],
  },
  {
    label: 'POS',
    href: '/pos',
    icon: ShoppingCart,
    roles: ['OWNER', 'ADMIN', 'KASIR'],
  },
  {
    label: 'Reports',
    href: '/reports',
    icon: BarChart,
    roles: ['OWNER', 'ADMIN', 'MANAGER'],
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
    roles: ['OWNER', 'ADMIN'],
  },
  // ... other items
];

// Hook untuk filter navigation berdasarkan role
export function useNavigation() {
  const { user } = useAuth();
  return NAVIGATION_ITEMS.filter(item => 
    item.roles.includes(user?.role)
  );
}
```

### 6.2 Permission-Based UI Components

```typescript
// components/shared/permission-guard.tsx
interface PermissionGuardProps {
  roles?: UserRole[];
  permission?: 'create' | 'read' | 'update' | 'delete' | 'approve' | 'verify';
  entity?: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PermissionGuard({ 
  roles, 
  permission, 
  entity,
  children, 
  fallback = null 
}: PermissionGuardProps) {
  const { user } = useAuth();
  
  if (!user) return fallback;
  if (roles && !roles.includes(user.role)) return fallback;
  
  // Additional permission check via API/RLS
  // ...
  
  return <>{children}</>;
}

// Usage
<PermissionGuard roles={['OWNER', 'ADMIN']} permission="delete" entity="customer">
  <Button variant="destructive">Hapus Customer</Button>
</PermissionGuard>
```

### 6.3 Button Disable Pattern

```typescript
// components/shared/action-button.tsx
interface ActionButtonProps extends ButtonProps {
  requiredRoles?: UserRole[];
  requiredPermission?: string;
  entity?: any;
}

export function ActionButton({ 
  requiredRoles, 
  requiredPermission,
  entity,
  disabled,
  children,
  ...props 
}: ActionButtonProps) {
  const { user } = useAuth();
  const hasPermission = checkPermission(user, requiredRoles, requiredPermission, entity);
  
  return (
    <Button
      {...props}
      disabled={disabled || !hasPermission}
      title={!hasPermission ? 'Anda tidak memiliki akses' : undefined}
    >
      {children}
    </Button>
  );
}
```

### 6.4 Role-Based Redirect

```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request);
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  const role = session.user.user_metadata.role;
  const pathname = request.nextUrl.pathname;
  
  // Role-based route protection
  const protectedRoutes: Record<string, UserRole[]> = {
    '/settings': ['OWNER', 'ADMIN'],
    '/settings/security': ['OWNER'],
    '/settings/integration': ['OWNER'],
    '/reports/financial': ['OWNER', 'ADMIN'],
    '/medical-records': ['OWNER', 'ADMIN', 'MANAGER', 'DOKTER'],
    '/pos': ['OWNER', 'ADMIN', 'KASIR'],
  };
  
  for (const [route, allowedRoles] of Object.entries(protectedRoutes)) {
    if (pathname.startsWith(route) && !allowedRoles.includes(role)) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }
  
  return response;
}
```

### 6.5 Loading States for Permission Checks

```typescript
// hooks/use-permission.ts
export function usePermission(
  entity: string, 
  action: 'create' | 'read' | 'update' | 'delete' | 'approve' | 'verify',
  entityId?: string
) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['permission', entity, action, entityId, user?.id],
    queryFn: async () => {
      const { data } = await supabase.rpc('check_permission', {
        p_entity: entity,
        p_action: action,
        p_entity_id: entityId,
      });
      return data as boolean;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });
}

// Usage
const { data: canEdit, isLoading } = usePermission('customer', 'update', customerId);

if (isLoading) return <Skeleton />;
if (!canEdit) return <AccessDenied />;

return <CustomerForm />;
```

---

## 7. Special Workflows

### 7.1 Approval Workflow (PO & Expense)

```
┌──────────────┐
│   Creator    │ → Create (status: PENDING)
│ (KASIR/ADMIN)│
└──────┬───────┘
       ↓
┌──────────────┐
│   Approver   │ → Review
│(OWNER/ADMIN/ │
│   MANAGER)   │
└──────┬───────┘
       ↓
   ┌───┴───┐
   │       │
   ↓       ↓
┌─────┐ ┌──────┐
│APPROVED│ │REJECTED│
└─────┘ └──────┘
```

**Rules:**
- Creator tidak bisa approve own request (self-approval prevention)
- Approval butuh 1 approver (configurable)
- Rejected items bisa di-revise oleh creator
- Semua approval di-audit log

### 7.2 Payment Verification Workflow

```
┌──────────────┐
│   Customer   │ → Upload proof (status: PENDING)
│   / Kasir    │
└──────┬───────┘
       ↓
┌──────────────┐
│   Verifier   │ → Review proof
│(OWNER/ADMIN) │
└──────┬───────┘
       ↓
   ┌───┴───┐
   │       │
   ↓       ↓
┌─────────┐ ┌─────────┐
│VERIFIED │ │REJECTED │
└─────────┘ └─────────┘
```

**Rules:**
- Cash payment auto-verified (no workflow)
- Non-cash payment butuh verifikasi
- Verifier tidak bisa verify own payment
- Rejected payment notify customer

### 7.3 Stock Opname Approval

```
┌──────────────┐
│   Counter    │ → Input actual count
│   (Staff)    │
└──────┬───────┘
       ↓
┌──────────────┐
│   System     │ → Calculate variance
└──────┬───────┘
       ↓
   ┌───┴───┐
   │       │
   ↓       ↓
┌──────┐ ┌────────┐
│Match │ │Variance│
└──────┘ └───┬────┘
             ↓
        ┌──────────┐
        │ Approver │ → Approve adjustment
        │(OWNER/   │
        │ ADMIN)   │
        └──────────┘
```

### 7.4 Refund Workflow

```
┌──────────────┐
│   Requester  │ → Request refund (with reason)
│   (KASIR)    │
└──────┬───────┘
       ↓
┌──────────────┐
│   Approver   │ → Review & approve
│(OWNER/ADMIN) │
└──────┬───────┘
       ↓
┌──────────────┐
│   System     │ → Process refund
│              │   - Reverse payment
│              │   - Restore stock
│              │   - Reverse loyalty points
└──────────────┘
```

**Rules:**
- Refund hanya untuk invoice PAID
- Refund butuh approval OWNER/ADMIN
- Refund di-audit log dengan detail
- Stock auto-restore saat refund

### 7.5 Discount Override

```
┌──────────────┐
│   Kasir      │ → Apply discount > limit
└──────┬───────┘
       ↓
┌──────────────┐
│   System     │ → Check threshold
└──────┬───────┘
       ↓
   ┌───┴───┐
   │       │
   ↓       ↓
┌──────┐ ┌──────────┐
│Within│ │ Exceeds  │
│limit │ │ limit    │
└──────┘ └────┬─────┘
              ↓
         ┌──────────┐
         │ Manager  │ → Approve override
         │ approval │
         └──────────┘
```

**Rules:**
- Kasir bisa kasih discount sampai X% (configurable)
- Discount > X% butuh approval MANAGER/ADMIN
- Discount > Y% butuh approval OWNER
- Semua discount override di-audit log

---

## 8. Multi-Branch Access

### 8.1 Branch Isolation Principles

1. **Data isolation** — Data cabang A tidak bisa diakses staff cabang B
2. **OWNER exception** — OWNER bisa akses semua cabang
3. **MANAGER scope** — MANAGER hanya lihat cabang yang di-assign
4. **Customer scope** — Customer terikat ke 1 cabang

### 8.2 Branch Assignment

```typescript
// types/user.ts
export interface User {
  id: string;
  branch_id: string | null;  // null = bisa akses semua (OWNER)
  role: UserRole;
  // ...
}

// types/branch.ts
export interface Branch {
  id: string;
  name: string;
  code: string;
  is_headquarter: boolean;
  // ...
}
```

### 8.3 Branch Switcher

```typescript
// components/layout/branch-switcher.tsx
export function BranchSwitcher() {
  const { user } = useAuth();
  const { data: branches } = useBranches();
  const [currentBranch, setCurrentBranch] = useUIStore(s => [
    s.currentBranchId, 
    s.setCurrentBranch
  ]);
  
  // OWNER bisa switch branch
  if (user.role !== 'OWNER') {
    return <span>{branches.find(b => b.id === user.branch_id)?.name}</span>;
  }
  
  return (
    <Select value={currentBranch} onValueChange={setCurrentBranch}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Semua Cabang</SelectItem>
        {branches.map(branch => (
          <SelectItem key={branch.id} value={branch.id}>
            {branch.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
```

### 8.4 Branch Filter di Queries

```typescript
// lib/services/base.service.ts
export class BaseService {
  static applyBranchFilter<T>(
    query: SupabaseQueryBuilder<T>,
    branchId?: string
  ) {
    if (!branchId || branchId === 'all') return query;
    return query.eq('branch_id', branchId);
  }
  
  static async list<T>(params: {
    branch_id?: string;
    // ... other filters
  }) {
    const { user } = await getAuthUser();
    
    // Non-OWNER hanya bisa lihat branch sendiri
    let effectiveBranchId = params.branch_id;
    if (user.role !== 'OWNER' && user.role !== 'ADMIN') {
      effectiveBranchId = user.branch_id;
    }
    
    let query = supabase.from('table').select('*');
    query = this.applyBranchFilter(query, effectiveBranchId);
    
    // ... rest of query
  }
}
```

### 8.5 Cross-Branch Operations

**Tidak diperbolehkan:**
- Transfer customer antar cabang (manual process)
- Share inventory antar cabang (kecuali via transfer workflow)
- Merge reports antar cabang (kecuali OWNER view)

**Diperbolehkan:**
- OWNER lihat semua cabang
- Transfer stock antar cabang (dengan approval)
- Centralized reporting untuk OWNER

---

## 9. Audit & Compliance

### 9.1 Audit Log Requirements

**Actions yang WAJIB di-log:**

| Category | Actions |
|---|---|
| **Authentication** | Login, logout, failed login, PIN change, 2FA enable/disable |
| **User Management** | Create user, update user, delete user, role change |
| **Customer Data** | Create customer, update customer, delete customer |
| **Financial** | Create invoice, cancel invoice, refund, verify payment |
| **Inventory** | Stock adjustment, stock opname, delete product |
| **Settings** | All settings changes |
| **Approvals** | All approval/rejection actions |
| **Discount** | Discount override |
| **Loyalty** | Points adjustment |
| **Medical** | Medical record sign, close, delete |

### 9.2 Audit Log Structure

```typescript
// types/audit.ts
export interface AuditLog {
  id: string;
  user_id: string | null;
  branch_id: string | null;
  action: string;           // e.g., 'customer.create', 'payment.verify'
  entity_type: string;      // e.g., 'customers', 'payments'
  entity_id: string | null;
  old_values: Record<string, any> | null;
  new_values: Record<string, any> | null;
  ip_address: string | null;
  user_agent: string | null;
  metadata: Record<string, any> | null;  // Additional context
  created_at: string;
}
```

### 9.3 Audit Trigger Pattern

```sql
-- Generic audit trigger function
CREATE OR REPLACE FUNCTION fn_audit_log()
RETURNS TRIGGER AS $$
DECLARE
  v_action TEXT;
  v_old_values JSONB;
  v_new_values JSONB;
BEGIN
  IF TG_OP = 'INSERT' THEN
    v_action := TG_TABLE_NAME || '.create';
    v_new_values := to_jsonb(NEW);
  ELSIF TG_OP = 'UPDATE' THEN
    v_action := TG_TABLE_NAME || '.update';
    v_old_values := to_jsonb(OLD);
    v_new_values := to_jsonb(NEW);
  ELSIF TG_OP = 'DELETE' THEN
    v_action := TG_TABLE_NAME || '.delete';
    v_old_values := to_jsonb(OLD);
  END IF;
  
  INSERT INTO audit_logs (
    user_id,
    branch_id,
    action,
    entity_type,
    entity_id,
    old_values,
    new_values,
    ip_address,
    user_agent,
    created_at
  ) VALUES (
    auth.uid(),
    COALESCE(NEW.branch_id, OLD.branch_id),
    v_action,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    v_old_values,
    v_new_values,
    inet_client_addr()::TEXT,
    current_setting('request.headers', true)::jsonb->>'user-agent',
    NOW()
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply to critical tables
CREATE TRIGGER trg_customers_audit
AFTER INSERT OR UPDATE OR DELETE ON customers
FOR EACH ROW EXECUTE FUNCTION fn_audit_log();

CREATE TRIGGER trg_payments_audit
AFTER INSERT OR UPDATE OR DELETE ON payments
FOR EACH ROW EXECUTE FUNCTION fn_audit_log();

CREATE TRIGGER trg_settings_audit
AFTER UPDATE ON settings
FOR EACH ROW EXECUTE FUNCTION fn_audit_log();
```

### 9.4 Audit Log Viewer

```typescript
// app/(dashboard)/audit-logs/page.tsx
// Hanya OWNER/ADMIN yang bisa akses

interface AuditLogsPageProps {}

// Features:
// - Filter by user, action, entity, date range
// - View old vs new values (diff view)
// - Export to CSV
// - Search by entity_id
// - IP address tracking
```

### 9.5 Compliance Requirements

| Requirement | Implementation |
|---|---|
| **Data retention** | Audit logs retained 7 years (configurable) |
| **Immutability** | Audit logs tidak bisa di-update/delete |
| **Access control** | Hanya OWNER/ADMIN bisa lihat audit logs |
| **Encryption** | Audit logs encrypted at rest |
| **Backup** | Daily backup audit logs |
| **Export** | Audit logs bisa di-export untuk audit eksternal |

---

## 10. Edge Cases & Exceptions

### 10.1 Emergency Access (Break-Glass)

**Skenario:** OWNER tidak tersedia, butuh akses urgent.

**Solusi:**
- ADMIN bisa request temporary elevated access
- Butuh approval dari 2 ADMIN lain (atau OWNER jika available)
- Akses temporary (max 24 jam)
- Semua aksi di-audit dengan flag "emergency"
- Notifikasi ke OWNER setelah akses digunakan

```typescript
// Emergency access request
interface EmergencyAccessRequest {
  requester_id: string;
  reason: string;
  duration_hours: number;
  approvers: string[];  // Min 2 approvers
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
}
```

### 10.2 Orphaned Data

**Skenario:** User dihapus, tapi punya data terkait.

**Solusi:**
- Soft delete user (tidak benar-benar dihapus)
- Reassign data ke user lain (OWNER decision)
- Audit log mencatat reassignment
- Data historis tetap ada

### 10.3 Role Transition

**Skenario:** User berubah role (misal KASIR → ADMIN).

**Solusi:**
- Akses baru langsung aktif
- Akses lama langsung non-aktif
- Audit log mencatat role change
- Notifikasi ke user & relevant parties

### 10.4 Concurrent Access

**Skenario:** 2 user edit data yang sama bersamaan.

**Solusi:**
- Optimistic locking via `updated_at`
- Conflict detection di Server Action
- User notification jika ada conflict
- Manual merge atau override

```typescript
// Optimistic locking pattern
export async function updateCustomerAction(input: {
  id: string;
  data: UpdateCustomerInput;
  expectedUpdatedAt: string;
}) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('customers')
    .update(input.data)
    .eq('id', input.id)
    .eq('updated_at', input.expectedUpdatedAt)  // Optimistic lock
    .select()
    .single();
  
  if (error || !data) {
    return { 
      success: false, 
      error: 'CONFLICT',
      message: 'Data telah diubah oleh user lain. Silakan refresh dan coba lagi.'
    };
  }
  
  return { success: true, data };
}
```

### 10.5 Session Hijacking Prevention

**Skenario:** Session token dicuri.

**Solusi:**
- Session binding ke IP address (optional)
- Session binding ke user agent
- Auto logout setelah timeout
- 2FA untuk akses kritis
- Real-time session monitoring

### 10.6 Data Export Restrictions

**Skenario:** User export data sensitif.

**Solusi:**
- Export hanya untuk OWNER/ADMIN
- Export di-audit log
- Sensitive data masked (phone, email)
- Watermark dengan user info
- Rate limit export (max X per hari)

### 10.7 Multi-Device Login

**Skenario:** User login di banyak device.

**Solusi:**
- Allow multi-device (configurable)
- Max 3 devices per user (default)
- Device management UI
- Force logout dari device lain
- Notification untuk login baru

### 10.8 Deleted User References

**Skenario:** User yang create data sudah dihapus.

**Solusi:**
- Foreign key `ON DELETE SET NULL` untuk created_by
- Display "Unknown User" di UI
- Audit log tetap ada (user_id di-log sebagai string)
- Data historis tidak hilang

---

## 11. Testing Scenarios

### 11.1 Role-Based Access Tests

```typescript
// tests/access/role-access.test.ts

describe('Role-Based Access Control', () => {
  describe('OWNER role', () => {
    it('can access all modules', async () => {
      const owner = await createTestUser('OWNER');
      const modules = await getUserAccessibleModules(owner);
      expect(modules).toContain('settings.security');
      expect(modules).toContain('reports.financial');
    });
    
    it('can update critical settings', async () => {
      const owner = await createTestUser('OWNER');
      const result = await updateSetting('security.session_timeout', 60, owner.id);
      expect(result.success).toBe(true);
    });
  });
  
  describe('ADMIN role', () => {
    it('cannot access critical settings', async () => {
      const admin = await createTestUser('ADMIN');
      const result = await updateSetting('security.session_timeout', 60, admin.id);
      expect(result.success).toBe(false);
      expect(result.error).toBe('FORBIDDEN');
    });
    
    it('cannot manage OWNER users', async () => {
      const admin = await createTestUser('ADMIN');
      const owner = await createTestUser('OWNER');
      const result = await deleteUser(owner.id, admin.id);
      expect(result.success).toBe(false);
    });
  });
  
  describe('DOKTER role', () => {
    it('can create medical records', async () => {
      const doctor = await createTestUser('DOKTER');
      const result = await createMedicalRecord({ doctor_id: doctor.id }, doctor.id);
      expect(result.success).toBe(true);
    });
    
    it('cannot access POS', async () => {
      const doctor = await createTestUser('DOKTER');
      const modules = await getUserAccessibleModules(doctor);
      expect(modules).not.toContain('pos');
    });
  });
  
  describe('KASIR role', () => {
    it('can create invoices', async () => {
      const kasir = await createTestUser('KASIR');
      const result = await createInvoice({}, kasir.id);
      expect(result.success).toBe(true);
    });
    
    it('cannot view other kasir invoices', async () => {
      const kasir1 = await createTestUser('KASIR');
      const kasir2 = await createTestUser('KASIR');
      const invoice = await createInvoice({}, kasir1.id);
      
      const invoices = await listInvoices(kasir2.id);
      expect(invoices.data.find(i => i.id === invoice.id)).toBeUndefined();
    });
  });
  
  describe('CUSTOMER role', () => {
    it('can only view own data', async () => {
      const customer1 = await createTestCustomer();
      const customer2 = await createTestCustomer();
      
      const customers = await listCustomers(customer1.id);
      expect(customers.data).toHaveLength(1);
      expect(customers.data[0].id).toBe(customer1.id);
    });
    
    it('cannot access dashboard', async () => {
      const customer = await createTestCustomer();
      const modules = await getUserAccessibleModules(customer);
      expect(modules).not.toContain('dashboard');
    });
  });
});
```

### 11.2 Branch Isolation Tests

```typescript
// tests/access/branch-isolation.test.ts

describe('Branch Isolation', () => {
  it('staff cannot view data from other branches', async () => {
    const branch1 = await createTestBranch();
    const branch2 = await createTestBranch();
    
    const staff1 = await createTestUser('KASIR', { branch_id: branch1.id });
    const customer2 = await createTestCustomer({ branch_id: branch2.id });
    
    const customers = await listCustomers(staff1.id);
    expect(customers.data.find(c => c.id === customer2.id)).toBeUndefined();
  });
  
  it('OWNER can view all branches', async () => {
    const branch1 = await createTestBranch();
    const branch2 = await createTestBranch();
    
    const owner = await createTestUser('OWNER');
    const customer1 = await createTestCustomer({ branch_id: branch1.id });
    const customer2 = await createTestCustomer({ branch_id: branch2.id });
    
    const customers = await listCustomers(owner.id);
    expect(customers.data.find(c => c.id === customer1.id)).toBeDefined();
    expect(customers.data.find(c => c.id === customer2.id)).toBeDefined();
  });
  
  it('MANAGER can only view own branch', async () => {
    const branch1 = await createTestBranch();
    const branch2 = await createTestBranch();
    
    const manager = await createTestUser('MANAGER', { branch_id: branch1.id });
    const customer1 = await createTestCustomer({ branch_id: branch1.id });
    const customer2 = await createTestCustomer({ branch_id: branch2.id });
    
    const customers = await listCustomers(manager.id);
    expect(customers.data.find(c => c.id === customer1.id)).toBeDefined();
    expect(customers.data.find(c => c.id === customer2.id)).toBeUndefined();
  });
});
```

### 11.3 RLS Policy Tests

```typescript
// tests/access/rls-policies.test.ts

describe('RLS Policies', () => {
  it('enforces RLS on all tables', async () => {
    const tables = await getAllTables();
    
    for (const table of tables) {
      const rlsEnabled = await checkRLSEnabled(table);
      expect(rlsEnabled).toBe(true);
    }
  });
  
  it('blocks direct SQL access without proper role', async () => {
    const customer = await createTestCustomer();
    
    // Try to access other customer's data via direct SQL
    const result = await supabase
      .from('customers')
      .select('*')
      .neq('id', customer.id);
    
    expect(result.data).toHaveLength(0);
  });
  
  it('prevents privilege escalation', async () => {
    const kasir = await createTestUser('KASIR');
    
    // Try to update own role
    const result = await supabase
      .from('users')
      .update({ role: 'OWNER' })
      .eq('id', kasir.id);
    
    expect(result.error).toBeDefined();
  });
});
```

### 11.4 Audit Log Tests

```typescript
// tests/access/audit-logs.test.ts

describe('Audit Logging', () => {
  it('logs all critical actions', async () => {
    const owner = await createTestUser('OWNER');
    
    await createCustomer({}, owner.id);
    await updateSetting('general.store_name', 'New Name', owner.id);
    await verifyPayment('payment-123', owner.id);
    
    const logs = await getAuditLogs({ user_id: owner.id });
    
    expect(logs.find(l => l.action === 'customers.create')).toBeDefined();
    expect(logs.find(l => l.action === 'settings.update')).toBeDefined();
    expect(logs.find(l => l.action === 'payments.verify')).toBeDefined();
  });
  
  it('prevents audit log tampering', async () => {
    const owner = await createTestUser('OWNER');
    const log = await createAuditLog({ user_id: owner.id });
    
    // Try to update audit log
    const result = await supabase
      .from('audit_logs')
      .update({ action: 'tampered' })
      .eq('id', log.id);
    
    expect(result.error).toBeDefined();
  });
});
```

### 11.5 Integration Tests

```typescript
// tests/access/integration.test.ts

describe('Access Control Integration', () => {
  it('complete workflow: customer creates appointment', async () => {
    const customer = await createTestCustomer();
    const pet = await createTestPet({ customer_id: customer.id });
    
    // Customer books appointment
    const appointment = await createAppointment({
      customer_id: customer.id,
      pet_id: pet.id,
    }, customer.id);
    
    expect(appointment.success).toBe(true);
    
    // Doctor sees appointment
    const doctor = await createTestUser('DOKTER');
    const appointments = await listAppointments(doctor.id);
    expect(appointments.data.find(a => a.id === appointment.data.id)).toBeDefined();
    
    // Other customer cannot see appointment
    const otherCustomer = await createTestCustomer();
    const otherAppointments = await listAppointments(otherCustomer.id);
    expect(otherAppointments.data.find(a => a.id === appointment.data.id)).toBeUndefined();
  });
  
  it('complete workflow: kasir processes payment', async () => {
    const kasir = await createTestUser('KASIR');
    const customer = await createTestCustomer();
    
    // Kasir creates invoice
    const invoice = await createInvoice({
      customer_id: customer.id,
      items: [{ description: 'Product', quantity: 1, unit_price: 100000 }],
    }, kasir.id);
    
    // Kasir records cash payment
    const payment = await recordPayment({
      invoice_id: invoice.data.id,
      payment_method: 'CASH',
      amount: 100000,
    }, kasir.id);
    
    expect(payment.success).toBe(true);
    expect(payment.data.payment_status).toBe('VERIFIED');  // Cash auto-verified
    
    // Customer sees payment
    const customerPayments = await listPayments(customer.id);
    expect(customerPayments.data.find(p => p.id === payment.data.id)).toBeDefined();
  });
});
```

---

## 12. Implementation Checklist

### 12.1 Database Layer

- [ ] Enable RLS di semua tabel
- [ ] Create helper functions (`get_user_role`, `is_staff`, dll)
- [ ] Implement RLS policies untuk semua tabel
- [ ] Test RLS policies dengan berbagai role
- [ ] Setup audit triggers untuk tabel kritis
- [ ] Verify branch isolation di semua tabel dengan `branch_id`
- [ ] Test privilege escalation prevention
- [ ] Setup immutable audit logs

### 12.2 Server Actions Layer

- [ ] Add role check di setiap Server Action
- [ ] Add branch isolation check
- [ ] Add ownership check untuk customer data
- [ ] Implement approval workflows
- [ ] Implement verification workflows
- [ ] Add audit logging di setiap critical action
- [ ] Add optimistic locking untuk concurrent updates
- [ ] Test semua Server Actions dengan berbagai role

### 12.3 UI Layer

- [ ] Implement navigation filtering by role
- [ ] Implement `PermissionGuard` component
- [ ] Implement `ActionButton` with permission check
- [ ] Add role-based redirects di middleware
- [ ] Implement branch switcher untuk OWNER
- [ ] Add loading states untuk permission checks
- [ ] Add "Access Denied" page
- [ ] Test UI visibility untuk semua role

### 12.4 Testing

- [ ] Unit tests untuk RLS policies
- [ ] Integration tests untuk workflows
- [ ] Role-based access tests
- [ ] Branch isolation tests
- [ ] Audit logging tests
- [ ] Privilege escalation tests
- [ ] Concurrent access tests
- [ ] Emergency access tests

### 12.5 Documentation

- [ ] Document all roles & permissions
- [ ] Document RLS policies
- [ ] Document approval workflows
- [ ] Document audit log structure
- [ ] Create user guide per role
- [ ] Create admin guide for access management
- [ ] Create troubleshooting guide

### 12.6 Monitoring

- [ ] Setup monitoring untuk failed access attempts
- [ ] Setup alerting untuk privilege escalation attempts
- [ ] Setup dashboard untuk audit log review
- [ ] Setup report untuk access patterns
- [ ] Setup alert untuk unusual access patterns

### 12.7 Security Review

- [ ] Penetration testing untuk access control
- [ ] Code review untuk RLS policies
- [ ] Security audit untuk approval workflows
- [ ] Review audit log completeness
- [ ] Test emergency access procedures
- [ ] Review session management
- [ ] Test multi-device handling

---

## Penutup

Dokumen PRD hak akses ini adalah **acuan final** untuk implementasi otorisasi di sistem Petora. Setiap developer **wajib mengikuti** kontrak ini untuk memastikan:

✅ **Security** — Data terlindungi di semua layer
✅ **Consistency** — Akses yang sama di UI, Server Action, dan RLS
✅ **Auditability** — Semua aksi kritis ter-log
✅ **Scalability** — Siap untuk multi-branch & multi-role
✅ **Maintainability** — Konvensi yang jelas & konsisten

### Key Success Factors

1. **RLS as Source of Truth** — Jangan pernah bypass RLS
2. **Defense in Depth** — Validasi di 3 layer
3. **Audit Everything** — Semua critical actions di-log
4. **Test Extensively** — Test semua role & edge cases
5. **Document Clearly** — Dokumentasi yang jelas untuk semua permission

### Critical Reminders

⚠️ **JANGAN PERNAH:**
- Bypass RLS dengan service role key di client
- Trust client-side permission checks
- Store sensitive data di client
- Log sensitive data (PIN, password)
- Allow self-approval untuk critical actions

✅ **SELALU:**
- Validate di server
- Check RLS policies
- Audit critical actions
- Test dengan berbagai role
- Document permission changes

**Selamat mengimplementasikan sistem otorisasi yang secure & scalable!** 🔐🐾

---

*Dokumen PRD hak akses ini adalah acuan tunggal untuk implementasi otorisasi. Setiap perubahan harus melalui review security dan update dokumen ini terlebih dahulu.*

**Dibuat:** 20 Agustus 2026
**Versi:** Final 1.0
**Status:** Approved for Implementation
