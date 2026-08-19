# Technical Frontend Contract — Baseline Final
## Petora — Frontend & UI/UX Specification
**Stack: Next.js 16 + Tailwind v4 + shadcn/ui + Radix Primitives**
**Dokumen Final | 19 Agustus 2026**

---

## Daftar Isi

1. [Ringkasan Eksekutif](#1-ringkasan-eksekutif)
2. [Design System Foundation](#2-design-system-foundation)
3. [Component Library Contract](#3-component-library-contract)
4. [Layout System Contract](#4-layout-system-contract)
5. [Page Contracts](#5-page-contracts)
6. [Form Contracts](#6-form-contracts)
7. [Data Display Contracts](#7-data-display-contracts)
8. [Feedback & Notification Contracts](#8-feedback--notification-contracts)
9. [Navigation Contracts](#9-navigation-contracts)
10. [Responsive & Accessibility](#10-responsive--accessibility)
11. [Animation & Motion](#11-animation--motion)
12. [UX Patterns](#12-ux-patterns)
13. [Performance Budgets](#13-performance-budgets)
14. [File Structure & Naming](#14-file-structure--naming)

---

## 1. Ringkasan Eksekutif

Dokumen ini mendefinisikan **kontrak frontend & UI/UX final** untuk seluruh sistem Petora. Menjadi acuan tunggal bagi developer frontend untuk membangun antarmuka yang **konsisten, accessible, performant, dan delightful**.

### Prinsip UI/UX

| Prinsip | Implementasi |
|---|---|
| **Consistency First** | Design tokens + component library terstandar |
| **Server-First Rendering** | Server Components default, Client Components hanya bila perlu |
| **Progressive Disclosure** | Tampilkan informasi sesuai konteks, hindari overload |
| **Accessible by Default** | WCAG 2.1 AA compliant, keyboard-first navigation |
| **Responsive Everywhere** | Mobile-first, tablet-optimized, desktop-enhanced |
| **Fast by Design** | Skeleton loading, optimistic updates, lazy loading |
| **Forgiving UX** | Undo actions, confirm destructive ops, clear error messages |
| **Delightful Details** | Micro-interactions, smooth transitions, contextual feedback |

### Teknologi Frontend

| Layer | Teknologi |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript (strict mode) |
| **Styling** | Tailwind CSS v4 (CSS-first config) |
| **Components** | shadcn/ui + Radix Primitives |
| **Forms** | React Hook Form + Zod |
| **Data Fetching** | TanStack Query |
| **State** | Zustand (global) + React state (local) |
| **Charts** | Recharts |
| **Calendar** | react-day-picker |
| **Icons** | Lucide React |
| **Animations** | Framer Motion (optional) + CSS transitions |
| **PDF** | @react-pdf/renderer |
| **Barcode/QR** | react-qr-code + jsbarcode |
| **i18n** | next-intl |
| **Toast** | Sonner |

---

## 2. Design System Foundation

### 2.1 Color Tokens (Tailwind v4 CSS-first)

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  /* ============ Brand Colors ============ */
  --color-brand-50: #f0fdf4;
  --color-brand-100: #dcfce7;
  --color-brand-200: #bbf7d0;
  --color-brand-300: #86efac;
  --color-brand-400: #4ade80;
  --color-brand-500: #22c55e;   /* Primary brand */
  --color-brand-600: #16a34a;
  --color-brand-700: #15803d;
  --color-brand-800: #166534;
  --color-brand-900: #14532d;
  
  /* ============ Pet Type Colors ============ */
  --color-pet-dog: #f59e0b;
  --color-pet-cat: #8b5cf6;
  --color-pet-bird: #06b6d4;
  --color-pet-rabbit: #ec4899;
  --color-pet-other: #6b7280;
  
  /* ============ Status Colors ============ */
  --color-status-success: #22c55e;
  --color-status-warning: #f59e0b;
  --color-status-error: #ef4444;
  --color-status-info: #3b82f6;
  --color-status-neutral: #6b7280;
  
  /* ============ Spacing Scale ============ */
  --spacing-18: 4.5rem;
  --spacing-88: 22rem;
  --spacing-sidebar: 16rem;
  --spacing-header: 4rem;
  
  /* ============ Typography ============ */
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;
  
  /* ============ Border Radius ============ */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-2xl: 1.5rem;
  
  /* ============ Shadows ============ */
  --shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
  
  /* ============ Animations ============ */
  --animate-fade-in: fade-in 0.2s ease-out;
  --animate-slide-up: slide-up 0.2s ease-out;
  --animate-slide-down: slide-down 0.2s ease-out;
  --animate-scale-in: scale-in 0.15s ease-out;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-up {
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes slide-down {
  from { transform: translateY(-10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes scale-in {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
```

### 2.2 Semantic Color System (shadcn/ui)

```css
/* app/globals.css — shadcn/ui variables */
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 240 10% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 240 10% 3.9%;
    --primary: 142 72% 29%;        /* Brand green */
    --primary-foreground: 355 100% 97%;
    --secondary: 240 4.8% 95.9%;
    --secondary-foreground: 240 5.9% 10%;
    --muted: 240 4.8% 95.9%;
    --muted-foreground: 240 3.8% 46.1%;
    --accent: 240 4.8% 95.9%;
    --accent-foreground: 240 5.9% 10%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --success: 142 72% 29%;
    --success-foreground: 0 0% 100%;
    --warning: 38 92% 50%;
    --warning-foreground: 0 0% 100%;
    --info: 217 91% 60%;
    --info-foreground: 0 0% 100%;
    --border: 240 5.9% 90%;
    --input: 240 5.9% 90%;
    --ring: 142 72% 29%;
    --radius: 0.5rem;
  }
  
  .dark {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;
    --card: 240 10% 5.9%;
    --card-foreground: 0 0% 98%;
    --primary: 142 72% 45%;
    --primary-foreground: 0 0% 100%;
    --destructive: 0 62.8% 50%;
    --border: 240 3.7% 15.9%;
    --input: 240 3.7% 15.9%;
  }
}
```

### 2.3 Typography Scale

| Token | Size | Line Height | Use Case |
|---|---|---|---|
| `text-xs` | 0.75rem | 1rem | Metadata, badges, timestamps |
| `text-sm` | 0.875rem | 1.25rem | Secondary text, form labels |
| `text-base` | 1rem | 1.5rem | Body text (default) |
| `text-lg` | 1.125rem | 1.75rem | Emphasized body, card titles |
| `text-xl` | 1.25rem | 1.75rem | Section headings |
| `text-2xl` | 1.5rem | 2rem | Page headings |
| `text-3xl` | 1.875rem | 2.25rem | Dashboard stats |
| `text-4xl` | 2.25rem | 2.5rem | Hero headings |

**Font Weights:**
- `font-normal` (400) — body text
- `font-medium` (500) — labels, buttons, emphasized
- `font-semibold` (600) — headings, card titles
- `font-bold` (700) — page titles, stats

### 2.4 Spacing System

```
Base unit: 0.25rem (4px)

Spacing scale:
- 0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96

Component spacing rules:
- Card padding: p-6 (24px)
- Section gap: space-y-6 (24px)
- Form field gap: space-y-4 (16px)
- Button group gap: gap-2 (8px)
- Icon + text gap: gap-2 (8px)
- List item gap: space-y-2 (8px)
```

### 2.5 Breakpoints

```css
Tailwind v4 default breakpoints:
- sm: 640px   (mobile landscape)
- md: 768px   (tablet portrait)
- lg: 1024px  (tablet landscape / small laptop)
- xl: 1280px  (desktop)
- 2xl: 1536px (large desktop)

Mobile-first approach:
- Default styles = mobile
- sm: enhanced mobile
- md: tablet layout
- lg: desktop layout
- xl: wide desktop
```

### 2.6 Z-Index Scale

| Layer | Z-Index | Use Case |
|---|---|---|
| `z-0` | 0 | Default content |
| `z-10` | 10 | Dropdowns, popovers |
| `z-20` | 20 | Sticky headers |
| `z-30` | 30 | Fixed sidebars |
| `z-40` | 40 | Modal overlays |
| `z-50` | 50 | Modals, dialogs |
| `z-[60]` | 60 | Toast notifications |
| `z-[70]` | 70 | Command palette |
| `z-[100]` | 100 | Tooltip, quick actions |

---

## 3. Component Library Contract

### 3.1 Component Hierarchy

```
components/
├── ui/                    # shadcn/ui primitives (auto-generated, DO NOT EDIT)
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── dialog.tsx
│   └── ...
│
├── shared/                # Reusable cross-feature components
│   ├── data-table/
│   ├── search-input.tsx
│   ├── status-badge.tsx
│   ├── empty-state.tsx
│   ├── loading-skeleton.tsx
│   ├── error-boundary.tsx
│   ├── confirm-dialog.tsx
│   ├── file-upload.tsx
│   ├── global-search.tsx
│   ├── quick-actions.tsx
│   ├── offline-banner.tsx
│   ├── barcode-scanner.tsx
│   ├── thermal-printer.tsx
│   ├── signature-pad.tsx
│   └── pdf-viewer.tsx
│
├── domain/                # Feature-specific components
│   ├── customer/
│   ├── pet/
│   ├── appointment/
│   ├── medical-record/
│   ├── pet-hotel/
│   ├── grooming/
│   ├── product/
│   ├── invoice/
│   ├── payment/
│   ├── settings/
│   ├── pos/
│   ├── dashboard/
│   └── ...
│
└── layout/                # Layout components
    ├── sidebar.tsx
    ├── header.tsx
    ├── mobile-nav.tsx
    ├── branch-switcher.tsx
    └── user-menu.tsx
```

### 3.2 shadcn/ui Components (Required)

```bash
npx shadcn@latest add \
  button card input label textarea select checkbox radio-group \
  dialog sheet drawer dropdown-menu popover tooltip \
  table pagination form toast sonner calendar date-picker \
  tabs separator scroll-area avatar badge command combobox \
  alert-dialog accordion progress skeleton switch chart \
  signature-pad context-menu hover-card menubar navigation-menu \
  resizable slider toggle toggle-group toolbar
```

### 3.3 Shared Component Contracts

#### 3.3.1 StatusBadge

```typescript
// components/shared/status-badge.tsx
type StatusVariant = 
  | 'appointment' 
  | 'medical-record' 
  | 'invoice' 
  | 'booking' 
  | 'stock-movement' 
  | 'expense' 
  | 'payment'
  | 'delivery' 
  | 'subscription' 
  | 'telemedicine';

interface StatusBadgeProps {
  status: string;
  variant: StatusVariant;
  size?: 'sm' | 'md';
  showDot?: boolean;
}

// Status color mapping
const STATUS_COLORS: Record<StatusVariant, Record<string, string>> = {
  appointment: {
    SCHEDULED: 'bg-blue-100 text-blue-700 border-blue-200',
    WAITING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    IN_PROGRESS: 'bg-purple-100 text-purple-700 border-purple-200',
    DONE: 'bg-green-100 text-green-700 border-green-200',
    CANCELLED: 'bg-red-100 text-red-700 border-red-200',
    NO_SHOW: 'bg-gray-100 text-gray-700 border-gray-200',
  },
  invoice: {
    DRAFT: 'bg-gray-100 text-gray-700 border-gray-200',
    UNPAID: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    PARTIAL_PAYMENT: 'bg-orange-100 text-orange-700 border-orange-200',
    PAID: 'bg-green-100 text-green-700 border-green-200',
    CANCELLED: 'bg-red-100 text-red-700 border-red-200',
    REFUNDED: 'bg-purple-100 text-purple-700 border-purple-200',
  },
  payment: {
    PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    VERIFIED: 'bg-green-100 text-green-700 border-green-200',
    REJECTED: 'bg-red-100 text-red-700 border-red-200',
    EXPIRED: 'bg-gray-100 text-gray-700 border-gray-200',
    REFUNDED: 'bg-purple-100 text-purple-700 border-purple-200',
  },
  // ... other variants
};
```

#### 3.3.2 EmptyState

```typescript
// components/shared/empty-state.tsx
interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ComponentType<{ className?: string }>;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

// Usage example
<EmptyState
  icon={Package}
  title="Belum ada produk"
  description="Tambahkan produk pertama Anda untuk mulai berjualan"
  action={{
    label: "Tambah Produk",
    onClick: () => router.push('/products/new'),
    icon: Plus,
  }}
/>
```

#### 3.3.3 LoadingSkeleton

```typescript
// components/shared/loading-skeleton.tsx
interface SkeletonProps {
  variant: 'card' | 'table' | 'list' | 'form' | 'stat' | 'profile';
  count?: number;
}

// Predefined skeletons
export function CustomerListSkeleton() { /* ... */ }
export function ProductTableSkeleton() { /* ... */ }
export function DashboardStatsSkeleton() { /* ... */ }
export function FormSkeleton() { /* ... */ }
```

#### 3.3.4 ConfirmDialog

```typescript
// components/shared/confirm-dialog.tsx
interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'destructive' | 'warning';
  onConfirm: () => void | Promise<void>;
  isLoading?: boolean;
}

// Usage
<ConfirmDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  title="Hapus customer?"
  description="Tindakan ini tidak dapat dibatalkan. Semua data terkait akan dihapus."
  confirmLabel="Hapus"
  variant="destructive"
  onConfirm={handleDelete}
/>
```

#### 3.3.5 FileUpload

```typescript
// components/shared/file-upload.tsx
interface FileUploadProps {
  accept?: string;
  maxSize?: number; // in bytes
  maxFiles?: number;
  bucket: string;
  path: string;
  onUploadComplete: (urls: string[]) => void;
  onUploadError?: (error: Error) => void;
  preview?: boolean;
  multiple?: boolean;
  disabled?: boolean;
}
```

#### 3.3.6 GlobalSearch (Command Palette)

```typescript
// components/shared/global-search.tsx
interface GlobalSearchProps {
  shortcut?: string; // default: '⌘K'
}

// Searchable entities
type SearchableEntity = 
  | 'customer' 
  | 'pet' 
  | 'product' 
  | 'invoice' 
  | 'appointment'
  | 'medical-record'
  | 'page';

// Keyboard shortcut: Cmd/Ctrl + K
```

#### 3.3.7 QuickActions (FAB)

```typescript
// components/shared/quick-actions.tsx
interface QuickActionsProps {
  actions: Array<{
    label: string;
    icon: React.ComponentType;
    onClick: () => void;
    shortcut?: string;
  }>;
}

// Default actions:
// - Customer Baru (N)
// - Janji Temu (A)
// - Transaksi POS (P)
// - Hewan Baru (H)
```

#### 3.3.8 OfflineBanner

```typescript
// components/shared/offline-banner.tsx
// Automatically shows when navigator.onLine === false
// Sticky top, amber background, dismissible
```

### 3.4 Domain Component Contracts

#### 3.4.1 Customer Components

```typescript
// components/domain/customer/customer-form.tsx
interface CustomerFormProps {
  customer?: Customer;  // undefined = create mode
  mode?: 'create' | 'edit' | 'view';
  onSuccess?: (customer: Customer) => void;
  onCancel?: () => void;
  showAccountCreation?: boolean;
}

// components/domain/customer/customer-card.tsx
interface CustomerCardProps {
  customer: Customer;
  showStats?: boolean;
  onClick?: () => void;
  actions?: React.ReactNode;
}

// components/domain/customer/customer-table.tsx
interface CustomerTableProps {
  data: Customer[];
  pagination: PaginationProps;
  sorting: SortingProps;
  filters?: CustomerFilters;
  onRowClick?: (customer: Customer) => void;
  isLoading?: boolean;
  selectable?: boolean;
  onSelectionChange?: (ids: string[]) => void;
}

// components/domain/customer/customer-tags.tsx
interface CustomerTagsProps {
  tags: CustomerTag[];
  editable?: boolean;
  onTagsChange?: (tags: CustomerTag[]) => void;
}

// components/domain/customer/customer-detail-header.tsx
interface CustomerDetailHeaderProps {
  customer: Customer;
  pets: Pet[];
  loyalty?: LoyaltyMember;
  onEdit: () => void;
  onDelete: () => void;
}
```

#### 3.4.2 Pet Components

```typescript
// components/domain/pet/pet-form.tsx
interface PetFormProps {
  customerId: string;
  pet?: Pet;
  mode?: 'create' | 'edit';
  onSuccess?: (pet: Pet) => void;
  onCancel?: () => void;
}

// components/domain/pet/pet-card.tsx
interface PetCardProps {
  pet: Pet;
  showOwner?: boolean;
  onClick?: () => void;
}

// components/domain/pet/pet-health-timeline.tsx
interface PetHealthTimelineProps {
  petId: string;
  filter?: 'all' | 'vaccine' | 'checkup' | 'treatment' | 'grooming';
}

// components/domain/pet/pet-vaccine-list.tsx
interface PetVaccineListProps {
  petId: string;
  editable?: boolean;
}

// components/domain/pet/pet-weight-chart.tsx
interface PetWeightChartProps {
  petId: string;
  period?: '3m' | '6m' | '1y' | 'all';
}
```

#### 3.4.3 Appointment Components

```typescript
// components/domain/appointment/appointment-calendar.tsx
interface AppointmentCalendarProps {
  doctorId?: string;
  date: string;
  onDateChange: (date: string) => void;
  view?: 'day' | 'week' | 'month';
}

// components/domain/appointment/appointment-queue.tsx
interface AppointmentQueueProps {
  date: string;
  doctorId?: string;
  onStatusChange?: (id: string, status: AppointmentStatus) => void;
}

// components/domain/appointment/appointment-form.tsx
interface AppointmentFormProps {
  appointment?: Appointment;
  defaultDate?: string;
  defaultTime?: string;
  customerId?: string;
  onSuccess?: (appointment: Appointment) => void;
  onCancel?: () => void;
}

// components/domain/appointment/appointment-card.tsx
interface AppointmentCardProps {
  appointment: Appointment;
  customer?: Customer;
  pet?: Pet;
  onClick?: () => void;
  draggable?: boolean;
}
```

#### 3.4.4 POS Components

```typescript
// components/domain/pos/pos-layout.tsx
interface POSLayoutProps {
  children: React.ReactNode;
}
// Two-column layout: left = product grid, right = cart

// components/domain/pos/pos-product-grid.tsx
interface POSProductGridProps {
  categoryId?: string;
  search?: string;
  onProductSelect: (product: Product) => void;
  viewMode?: 'grid' | 'list';
}

// components/domain/pos/pos-cart.tsx
interface POSCartProps {
  items: InvoiceItem[];
  customer?: Customer | null;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  onAddItem: (product: Product, qty: number) => void;
  onRemoveItem: (itemId: string) => void;
  onUpdateQty: (itemId: string, qty: number) => void;
  onClear: () => void;
  onCheckout: () => void;
  onCustomerSelect: (customer: Customer | null) => void;
  onApplyPromo: (code: string) => void;
  onRedeemPoints: (points: number) => void;
}

// components/domain/pos/pos-payment-modal.tsx
interface POSPaymentModalProps {
  invoice: Invoice;
  availableMethods: PaymentMethod[];
  onSuccess: (payment: Payment) => void;
  onCancel: () => void;
  allowSplit?: boolean;
  allowPartial?: boolean;
}

// components/domain/pos/pos-category-tabs.tsx
interface POSCategoryTabsProps {
  categories: Category[];
  selectedId?: string;
  onSelect: (id: string) => void;
}
```

#### 3.4.5 Settings Components

```typescript
// components/domain/settings/settings-layout.tsx
interface SettingsLayoutProps {
  children: React.ReactNode;
}
// Sidebar navigation + content area

// components/domain/settings/store-settings-form.tsx
interface StoreSettingsFormProps {
  initialData: StoreSettingsInput;
}

// components/domain/settings/payment-settings-form.tsx
interface PaymentSettingsFormProps {
  initialData: PaymentSettingsInput;
  onTestGateway?: () => Promise<boolean>;
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
  type?: 'text' | 'number' | 'email' | 'url' | 'password';
  placeholder?: string;
}

// components/domain/settings/setting-select.tsx
interface SettingSelectProps {
  settingKey: string;
  label: string;
  description?: string;
  options: Array<{ value: string; label: string }>;
}
```

#### 3.4.6 Dashboard Components

```typescript
// components/domain/dashboard/dashboard-widgets.tsx
interface DashboardWidgetsProps {
  customizable?: boolean;
}

// components/domain/dashboard/stat-card.tsx
interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    trend: 'up' | 'down' | 'neutral';
  };
  icon?: React.ComponentType;
  trend?: 'up' | 'down' | 'neutral';
  onClick?: () => void;
}

// components/domain/dashboard/revenue-chart.tsx
interface RevenueChartProps {
  period: '7d' | '30d' | '90d' | '1y';
  onPeriodChange: (period: string) => void;
}

// components/domain/dashboard/today-appointments-widget.tsx
interface TodayAppointmentsWidgetProps {
  limit?: number;
}

// components/domain/dashboard/low-stock-widget.tsx
interface LowStockWidgetProps {
  limit?: number;
}

// components/domain/dashboard/pending-payments-widget.tsx
interface PendingPaymentsWidgetProps {
  limit?: number;
}
```

---

## 4. Layout System Contract

### 4.1 Layout Groups

```
app/
├── (auth)/         # Login, forgot-password — full screen, centered
├── (dashboard)/    # Staff dashboard — sidebar + header
├── (portal)/       # Customer portal — simplified nav
├── (kiosk)/        # Self-service kiosk — touch-optimized
```

### 4.2 Auth Layout

```typescript
// app/(auth)/layout.tsx
// - Full-screen centered
// - Logo + tagline
// - Background: subtle pattern or gradient
// - Max width: 400px
// - No sidebar, no header

interface AuthLayoutProps {
  children: React.ReactNode;
}

// Structure:
// ┌─────────────────────────────────┐
// │                                 │
// │         [Logo Petora]           │
// │      Sistem Manajemen Pet       │
// │                                 │
// │   ┌───────────────────────┐    │
// │   │                       │    │
// │   │    Login Form         │    │
// │   │                       │    │
// │   └───────────────────────┘    │
// │                                 │
// │         © 2026 Petora           │
// └─────────────────────────────────┘
```

### 4.3 Dashboard Layout

```typescript
// app/(dashboard)/layout.tsx
// - Sidebar (collapsible, 256px / 64px)
// - Header (64px height)
// - Main content area
// - Mobile: sidebar as drawer

interface DashboardLayoutProps {
  children: React.ReactNode;
}

// Structure:
// ┌──────────────────────────────────────────────┐
// │ [Logo] [Branch Switcher]    [Search] [User]  │ ← Header (64px)
// ├────────┬─────────────────────────────────────┤
// │        │                                     │
// │ Side   │                                     │
// │ bar    │         Main Content                │
// │        │                                     │
// │ (256px)│                                     │
// │        │                                     │
// └────────┴─────────────────────────────────────┘
```

**Sidebar Contract:**

```typescript
// components/layout/sidebar.tsx
interface SidebarProps {
  items: SidebarItem[];
  collapsed?: boolean;
  onToggle?: () => void;
}

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ComponentType;
  badge?: string | number;
  children?: SidebarItem[];
  requiresRole?: UserRole[];
}

// Sidebar sections:
// - Dashboard
// - Customers
// - Pets
// - Appointments
// - Medical Records
// - Services (Pet Hotel, Grooming)
// - Inventory (Products, Stock, PO)
// - Sales (POS, Invoices, Payments)
// - Financial (Expenses, Reports)
// - Marketing (Promotions, Loyalty)
// - HR (Employees, Commissions)
// - Settings
```

**Header Contract:**

```typescript
// components/layout/header.tsx
interface HeaderProps {
  breadcrumbs?: BreadcrumbItem[];
  showBranchSwitcher?: boolean;
  showSearch?: boolean;
  showNotifications?: boolean;
  showUserMenu?: boolean;
}

// Header components (left to right):
// 1. Mobile menu toggle (hamburger)
// 2. Breadcrumbs
// 3. Spacer
// 4. Branch switcher (if multi-branch)
// 5. Global search (⌘K)
// 6. Notification bell (with unread count)
// 7. User menu (avatar + dropdown)
```

### 4.4 Portal Layout

```typescript
// app/(portal)/layout.tsx
// - Simplified header (logo + user menu)
// - No sidebar
// - Bottom navigation on mobile
// - Max width: 1024px centered

// Structure:
// ┌──────────────────────────────────────────────┐
// │ [Logo]                    [Notifications] [User] │
// ├──────────────────────────────────────────────┤
// │                                              │
// │         Portal Content                       │
// │         (max-w-4xl mx-auto)                  │
// │                                              │
// ├──────────────────────────────────────────────┤
// │ [Home] [Bookings] [Pets] [Loyalty] [Profile] │ ← Mobile bottom nav
// └──────────────────────────────────────────────┘
```

### 4.5 Kiosk Layout

```typescript
// app/(kiosk)/layout.tsx
// - Full-screen touch-optimized
// - Large buttons (min 48px tap target)
// - No scroll (single viewport)
// - Auto-sleep after inactivity
// - QR code scanner prominent

// Structure:
// ┌──────────────────────────────────────────────┐
// │                                              │
// │           [Welcome Message]                  │
// │                                              │
// │   ┌──────────┐  ┌──────────┐  ┌──────────┐ │
// │   │ Check-In │  │ Booking  │  │ Info     │ │
// │   │  (QR)    │  │          │  │          │ │
// │   └──────────┘  └──────────┘  └──────────┘ │
// │                                              │
// │   [Large touch buttons, high contrast]       │
// │                                              │
// └──────────────────────────────────────────────┘
```

### 4.6 Page Layout Patterns

#### Pattern A: List Page

```typescript
// Standard list page structure
// ┌──────────────────────────────────────────────┐
// │ Page Title                    [+ New Button] │
// │ Description / subtitle                       │
// ├──────────────────────────────────────────────┤
// │ [Search] [Filters] [Sort] [View Toggle]      │
// ├──────────────────────────────────────────────┤
// │                                              │
// │         Data Table / Card Grid               │
// │                                              │
// ├──────────────────────────────────────────────┤
// │ [Pagination]              [Items per page]   │
// └──────────────────────────────────────────────┘
```

#### Pattern B: Detail Page

```typescript
// Standard detail page structure
// ┌──────────────────────────────────────────────┐
// │ [Back] Page Title          [Edit] [Delete]   │
// ├──────────────────────────────────────────────┤
// │                                              │
// │  ┌────────────────────────────────────────┐ │
// │  │  Main Info Card                         │ │
// │  └────────────────────────────────────────┘ │
// │                                              │
// │  ┌──────────┐ ┌──────────┐ ┌──────────┐   │
// │  │ Tab 1    │ │ Tab 2    │ │ Tab 3    │   │
// │  └──────────┘ └──────────┘ └──────────┘   │
// │  ┌────────────────────────────────────────┐ │
// │  │                                        │ │
// │  │         Tab Content                    │ │
// │  │                                        │ │
// │  └────────────────────────────────────────┘ │
// └──────────────────────────────────────────────┘
```

#### Pattern C: Form Page

```typescript
// Standard form page structure
// ┌──────────────────────────────────────────────┐
// │ [Back] Page Title                            │
// ├──────────────────────────────────────────────┤
// │                                              │
// │  ┌────────────────────────────────────────┐ │
// │  │  Section 1: Basic Info                 │ │
// │  │  [Form fields]                         │ │
// │  └────────────────────────────────────────┘ │
// │                                              │
// │  ┌────────────────────────────────────────┐ │
// │  │  Section 2: Details                    │ │
// │  │  [Form fields]                         │ │
// │  └────────────────────────────────────────┘ │
// │                                              │
// │                              [Cancel] [Save] │
// └──────────────────────────────────────────────┘
```

#### Pattern D: Settings Page

```typescript
// Standard settings page structure
// ┌──────────────────────────────────────────────┐
// │ Settings                                     │
// ├────────────┬─────────────────────────────────┤
// │            │                                 │
// │ Category   │     Setting Form                │
// │ Navigation │                                 │
// │            │     [Save] [Reset]              │
// │ - General  │                                 │
// │ - Payment  │                                 │
// │ - Tax      │                                 │
// │ - ...      │                                 │
// │            │                                 │
// └────────────┴─────────────────────────────────┘
```

---

## 5. Page Contracts

### 5.1 Auth Pages

#### Login Page

```typescript
// app/(auth)/login/page.tsx
// Client Component

interface LoginPageProps {}

// Layout:
// - Centered card (max-w-md)
// - Logo at top
// - Username input
// - PIN input (6 digits, numeric keypad on mobile)
// - "Remember me" checkbox
// - Login button (full width)
// - "Forgot PIN?" link

// Interactions:
// - Auto-focus username on load
// - Auto-focus PIN after username filled
// - Enter key submits form
// - Show error message inline
// - Lockout after 5 failed attempts (show countdown)
// - Redirect based on role after login

// Validation:
// - Username: 3-50 chars, alphanumeric
// - PIN: exactly 6 digits
```

### 5.2 Dashboard Pages

#### Dashboard Home

```typescript
// app/(dashboard)/page.tsx
// Server Component (data fetching) + Client Components (widgets)

interface DashboardPageProps {}

// Layout:
// - Welcome message with user name
// - Date & time display
// - Quick stats row (4 cards):
//   - Today's revenue
//   - Today's appointments
//   - Low stock items
//   - Pending payments
// - Customizable widgets grid (2-3 columns)
// - Recent activity feed

// Widgets:
// - TodayAppointmentsWidget
// - RevenueChartWidget (7d/30d/90d/1y)
// - LowStockWidget
// - PendingPaymentsWidget
// - UpcomingHotelWidget
// - RecentCustomersWidget
// - ActiveSubscriptionsWidget
// - ActiveDeliveriesWidget

// Interactions:
// - Drag to reorder widgets (owner only)
// - Click stat card to navigate
// - Auto-refresh every 60 seconds
```

### 5.3 Customer Pages

#### Customer List

```typescript
// app/(dashboard)/customers/page.tsx
// Server Component

// Features:
// - Search by name, phone, email
// - Filter by tags (VIP, REGULAR, NEW, BLACKLIST)
// - Filter by active/inactive
// - Sort by name, created_at, total_spending
// - Pagination (default 20 per page)
// - Bulk actions (delete, tag, export)
// - View toggle (table / card grid)
// - Export to CSV

// URL State:
// - ?search=xxx
// - ?tags=VIP,REGULAR
// - ?status=active
// - ?sort=name:asc
// - ?page=1
// - ?limit=20
// - ?view=table
```

#### Customer Detail

```typescript
// app/(dashboard)/customers/[id]/page.tsx
// Server Component

// Layout:
// - Header with photo, name, tags, contact info
// - Action buttons: Edit, Delete, New Appointment, New Invoice
// - Tabs:
//   - Overview (stats, recent activity)
//   - Pets (list of pets)
//   - Appointments (history)
//   - Medical Records (if accessible)
//   - Invoices (history)
//   - Loyalty (points, tier, transactions)
//   - Notes (internal notes)

// Stats cards:
// - Total pets
// - Total visits
// - Total spending
// - Loyalty tier & points
// - Last visit date
```

#### Customer Form

```typescript
// app/(dashboard)/customers/new/page.tsx
// app/(dashboard)/customers/[id]/edit/page.tsx
// Client Component

// Sections:
// 1. Basic Info
//    - Name (required)
//    - Phone
//    - Email
//    - Address
//    - City, Postal Code
// 
// 2. Emergency Contact
//    - Name
//    - Phone
// 
// 3. Additional Info
//    - Photo upload
//    - Tags (multi-select)
//    - Notes (textarea)
//    - Birth date
//    - Gender
//    - ID Number
// 
// 4. Account Creation (optional)
//    - Create portal account? (toggle)
//    - Username (if yes)
//    - PIN (if yes, 6 digits)

// Validation:
// - Real-time validation
// - Show errors inline
// - Disable submit until valid
// - Confirm before discard changes
```

### 5.4 Pet Pages

#### Pet List

```typescript
// app/(dashboard)/pets/page.tsx

// Features:
// - Search by name, species, breed, microchip
// - Filter by species, customer
// - Sort by name, birth_date
// - Card grid view (default) / table view
// - Each card shows: photo, name, species, breed, age, owner
```

#### Pet Detail

```typescript
// app/(dashboard)/pets/[id]/page.tsx

// Layout:
// - Header: photo, name, species, breed, age, gender
// - Owner info card (clickable)
// - Quick stats: weight, last visit, next vaccine
// - Tabs:
//   - Overview (summary)
//   - Medical Records
//   - Vaccines (with due dates)
//   - Weight History (chart)
//   - Diseases & Allergies
//   - Appointments
//   - Pet Passport
//   - Photos

// Special features:
// - Weight chart (line chart with trend)
// - Vaccine timeline
// - Health timeline (combined view)
// - Allergy warnings (prominent display)
```

### 5.5 Appointment Pages

#### Appointment Calendar

```typescript
// app/(dashboard)/appointments/page.tsx

// Views:
// - Day view (hourly slots)
// - Week view (7 days)
// - Month view (calendar grid)
// - List view (table)

// Features:
// - Filter by doctor, status, type
// - Color-coded by status
// - Drag & drop to reschedule (day/week view)
// - Click to view/edit
// - Quick create on empty slot
// - Real-time updates via Supabase Realtime
```

#### Appointment Queue

```typescript
// app/(dashboard)/appointments/queue/page.tsx

// Features:
// - Real-time queue display
// - Status columns: Waiting, In Progress, Done
// - Drag between columns
// - Call next button
// - Queue number display
// - Estimated wait time
// - Patient info card
```

### 5.6 POS Page

```typescript
// app/(dashboard)/pos/page.tsx
// Client Component (heavy interaction)

// Layout:
// ┌──────────────────────────────────────────────┐
// │ [Customer Search]    [Hold] [History] [Menu] │
// ├──────────────────────┬───────────────────────┤
// │                      │                       │
// │  Category Tabs       │  Cart                 │
// │                      │  - Customer info      │
// │  Product Grid        │  - Items list         │
// │  (with search)       │  - Subtotal           │
// │                      │  - Discount           │
// │                      │  - Tax                │
// │                      │  - Total              │
// │                      │                       │
// │                      │  [Promo Code]         │
// │                      │  [Redeem Points]      │
// │                      │                       │
// │                      │  [Payment Button]     │
// │                      │                       │
// └──────────────────────┴───────────────────────┘

// Keyboard shortcuts:
// - F1: Focus search
// - F2: Quick customer
// - F3: Quick product
// - F4: Payment
// - F5: Hold cart
// - F12: Clear cart
// - Esc: Cancel

// Features:
// - Barcode scanner support
// - Quick customer add
// - Split payment
// - Hold/recall carts
// - Recent transactions
// - Price check mode
// - Discount by item or total
// - Tax calculation (auto)
// - Loyalty points auto-calc
```

### 5.7 Settings Pages

```typescript
// app/(dashboard)/settings/*

// Layout:
// - Left sidebar: category navigation
// - Right: setting form
// - Save button sticky at bottom
// - Unsaved changes warning

// Categories (17 total):
// 1. General (store info, hours, logo)
// 2. Branches (multi-branch setup)
// 3. Payment (methods, gateway, manual)
// 4. Tax (PPN, PPh)
// 5. Loyalty (points, tiers)
// 6. Notification (WhatsApp, Email, SMS, Push)
// 7. Printer (receipt, barcode, thermal)
// 8. Reminder (vaccine, grooming, hotel)
// 9. Receipt (template, header, footer)
// 10. Security (session, PIN, 2FA)
// 11. Integration (API tokens)
// 12. Backup (schedule, retention)
// 13. Employees (commission, performance)
// 14. Subscription (plans, billing)
// 15. Delivery (zones, pricing)
// 16. Inventory (warehouses, costing)
// 17. Custom Fields (customer, pet)
// 18. Advanced (debug, maintenance)

// UX rules:
// - Group related settings
// - Provide descriptions & help text
// - Show default values
// - Confirm destructive changes
// - Test buttons for integrations
// - Preview for receipt template
```

---

## 6. Form Contracts

### 6.1 Form Pattern Standar

```typescript
// Pattern untuk semua form
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormStatus } from 'react-dom';

interface FormProps<T> {
  defaultValues?: Partial<T>;
  onSubmit: (data: T) => Promise<void>;
  onCancel?: () => void;
  schema: ZodSchema<T>;
}

export function BaseForm<T>({ defaultValues, onSubmit, onCancel, schema }: FormProps<T>) {
  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  });
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Form fields */}
        
        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Batal
            </Button>
          )}
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Loader2 className="mr-2 animate-spin" />}
            Simpan
          </Button>
        </div>
      </form>
    </Form>
  );
}
```

### 6.2 Form Field Contracts

```typescript
// All form fields must follow these rules:

interface FormFieldProps {
  label: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
}

// Field types:
// - Text input (single line)
// - Textarea (multi-line)
// - Number input (with min/max/step)
// - Select (dropdown)
// - Combobox (searchable dropdown)
// - Checkbox (single)
// - Checkbox group (multiple)
// - Radio group
// - Switch (toggle)
// - Date picker
// - Time picker
// - Date-time picker
// - File upload
// - Signature pad
// - Color picker
// - Tag input
// - Currency input
// - Phone input (with country code)
```

### 6.3 Validation UX

```typescript
// Validation rules:
// 1. Real-time validation on blur (not on every keystroke)
// 2. Show error message below field (red text, small)
// 3. Error icon on field (red border + icon)
// 4. Disable submit until form is valid
// 5. Show success state after submit
// 6. Scroll to first error on submit failure
// 7. Preserve form data on navigation (with confirmation)

// Error messages:
// - Required: "Field ini wajib diisi"
// - Invalid email: "Format email tidak valid"
// - Invalid phone: "Format nomor telepon tidak valid"
// - Too short: "Minimal {min} karakter"
// - Too long: "Maksimal {max} karakter"
// - Invalid format: "Format tidak valid"
// - Unique constraint: "{field} sudah digunakan"
```

### 6.4 Form Submission UX

```typescript
// Submission states:
// 1. Idle: Button shows "Simpan"
// 2. Submitting: Button shows spinner + "Menyimpan..."
// 3. Success: Toast notification + redirect/close
// 4. Error: Toast error + keep form data

// Confirmation dialogs:
// - Before discard unsaved changes
// - Before delete action
// - Before submit destructive action

// Auto-save:
// - Draft auto-save every 30 seconds
// - Show "Draft saved" indicator
// - Restore draft on page reload
```

### 6.5 Form Layout Patterns

```typescript
// Pattern 1: Single column (simple forms)
// ┌────────────────────────┐
// │ Label                  │
// │ [Input field]          │
// │ Error message          │
// └────────────────────────┘

// Pattern 2: Two columns (complex forms)
// ┌──────────────────┬──────────────────┐
// │ Label            │ Label            │
// │ [Input]          │ [Input]          │
// └──────────────────┴──────────────────┘

// Pattern 3: Sectioned (very complex forms)
// ┌──────────────────────────────────────┐
// │ Section Title                        │
// │ Description                          │
// ├──────────────────────────────────────┤
// │ [Fields...]                          │
// └──────────────────────────────────────┘

// Responsive rules:
// - Mobile: single column
// - Tablet: two columns for related fields
// - Desktop: two or three columns
```

---

## 7. Data Display Contracts

### 7.1 Table Contract

```typescript
// components/shared/data-table/data-table.tsx

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    onPageChange: (page: number) => void;
    onLimitChange?: (limit: number) => void;
  };
  sorting?: {
    column: string;
    direction: 'asc' | 'desc';
    onSort: (column: string) => void;
  };
  filters?: React.ReactNode;
  onRowClick?: (row: T) => void;
  selectable?: boolean;
  onSelectionChange?: (ids: string[]) => void;
  isLoading?: boolean;
  emptyState?: React.ReactNode;
  stickyHeader?: boolean;
}

// Table features:
// - Sortable columns (click header)
// - Resizable columns (drag edge)
// - Column visibility toggle
// - Row selection (checkbox)
// - Bulk actions toolbar
// - Pagination (with page size selector)
// - Loading skeleton
// - Empty state
// - Sticky header on scroll
// - Responsive: horizontal scroll on mobile
```

### 7.2 Card Contract

```typescript
// components/shared/card.tsx (extends shadcn/ui Card)

interface CardProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'filled';
  hoverable?: boolean;
  onClick?: () => void;
}

// Card sizes:
// - sm: p-4 (compact)
// - md: p-6 (default)
// - lg: p-8 (spacious)
```

### 7.3 List Contract

```typescript
// components/shared/list.tsx

interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string;
  emptyState?: React.ReactNode;
  loadingState?: React.ReactNode;
  loadMore?: () => void;
  hasMore?: boolean;
}

// List variants:
// - Simple list (text items)
// - Rich list (with avatar, subtitle, action)
// - Grouped list (with section headers)
// - Virtualized list (for large datasets)
```

### 7.4 Chart Contract

```typescript
// components/shared/chart.tsx

interface ChartProps {
  type: 'line' | 'bar' | 'pie' | 'area' | 'donut';
  data: any[];
  config: ChartConfig;
  height?: number;
  showLegend?: boolean;
  showTooltip?: boolean;
  showGrid?: boolean;
  interactive?: boolean;
}

// Chart use cases:
// - Revenue over time (line/area)
// - Sales by category (bar)
// - Customer distribution (pie)
// - Inventory levels (bar)
// - Appointment trends (line)
```

### 7.5 Stat Card Contract

```typescript
// components/shared/stat-card.tsx

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    trend: 'up' | 'down' | 'neutral';
    label?: string;
  };
  icon?: React.ComponentType;
  iconColor?: string;
  onClick?: () => void;
  loading?: boolean;
}

// Layout:
// ┌────────────────────────┐
// │ [Icon]     Title       │
// │                        │
// │ Value                  │
// │ ↑ 12% from last month  │
// └────────────────────────┘
```

### 7.6 Timeline Contract

```typescript
// components/shared/timeline.tsx

interface TimelineProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  orientation?: 'vertical' | 'horizontal';
  showDate?: boolean;
  showIcon?: boolean;
}

// Use cases:
// - Pet health timeline
// - Order history
// - Activity log
// - Audit trail
```

---

## 8. Feedback & Notification Contracts

### 8.1 Toast Notifications

```typescript
// Using Sonner library

// Toast types:
// - success: green, check icon
// - error: red, x icon
// - warning: amber, alert icon
// - info: blue, info icon
// - loading: gray, spinner

// Toast positions:
// - Default: bottom-right
// - Mobile: bottom-center

// Toast duration:
// - Success: 3s
// - Error: 5s
// - Warning: 4s
// - Info: 3s
// - Loading: until resolved

// Toast with action:
toast.success('Data berhasil disimpan', {
  description: 'Customer baru telah ditambahkan',
  action: {
    label: 'Lihat Detail',
    onClick: () => router.push(`/customers/${id}`),
  },
});

// Toast rules:
// - Max 3 toasts visible at once
// - Stack from bottom
// - Dismissible (click X or swipe)
// - Auto-dismiss (except loading)
// - Don't use for critical errors (use dialog)
```

### 8.2 Dialog Contract

```typescript
// Dialog types:
// 1. Alert Dialog (simple confirm)
// 2. Confirm Dialog (with description)
// 3. Form Dialog (with form inside)
// 4. Detail Dialog (view-only info)
// 5. Warning Dialog (destructive action)

// Dialog rules:
// - Focus trap inside dialog
// - Close on Esc
// - Close on backdrop click (optional)
// - Scroll lock on body
// - Animated entrance/exit
// - Max width: 640px (default), 900px (large)
// - Mobile: full screen on small devices
```

### 8.3 Drawer Contract

```typescript
// Drawer types:
// 1. Side drawer (from right, for detail view)
// 2. Bottom drawer (mobile, for actions)
// 3. Filter drawer (for complex filters)

// Drawer rules:
// - Overlay backdrop
// - Swipe to close (mobile)
// - Focus trap
// - Animated slide
// - Max width: 480px (side), 100% (bottom)
```

### 8.4 Loading States

```typescript
// Loading state types:
// 1. Page loading: full-page skeleton
// 2. Section loading: skeleton for section
// 3. Button loading: spinner in button
// 4. Inline loading: spinner + text
// 5. Progress bar: for long operations
// 6. Skeleton: placeholder shapes

// Loading rules:
// - Show skeleton after 200ms (avoid flash)
// - Use skeleton matching content shape
// - Show progress for operations > 3s
// - Allow cancel for long operations
// - Don't block UI unnecessarily
```

### 8.5 Error States

```typescript
// Error state types:
// 1. Field error: inline below field
// 2. Form error: banner at top
// 3. Page error: full-page error with retry
// 4. Network error: offline banner
// 5. Permission error: access denied page
// 6. Not found: 404 page

// Error message rules:
// - User-friendly language
// - Explain what went wrong
// - Suggest next action
// - Provide contact support option
// - Log error details for debugging
```

### 8.6 Empty States

```typescript
// Empty state types:
// 1. First-time use: onboarding message
// 2. No results: after search/filter
// 3. No data: empty list
// 4. Error loading: with retry
// 5. Permission denied: with explanation

// Empty state structure:
// ┌────────────────────────┐
// │                        │
// │      [Large Icon]      │
// │                        │
// │      Title             │
// │                        │
// │   Description text     │
// │                        │
// │   [Primary Action]     │
// │   [Secondary Action]   │
// │                        │
// └────────────────────────┘
```

---

## 9. Navigation Contracts

### 9.1 Sidebar Navigation

```typescript
// Sidebar structure:
// - Logo (top, clickable to dashboard)
// - Main navigation items
// - Collapsible sub-menus
// - Badge for unread counts
// - Role-based visibility
// - Collapsed mode (icons only)

// Navigation items:
interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
  children?: NavItem[];
  requiresRole?: UserRole[];
  isActive?: (pathname: string) => boolean;
}

// Active state:
// - Background: primary/10
// - Text: primary
// - Left border: 3px primary
// - Icon: primary
```

### 9.2 Breadcrumbs

```typescript
// components/layout/breadcrumbs.tsx

interface BreadcrumbsProps {
  items: Array<{
    label: string;
    href?: string;
  }>;
}

// Rules:
// - Show current page (non-clickable)
// - Separator: / or >
// - Truncate long labels
// - Mobile: show only parent + current
// - Schema.org markup for SEO
```

### 9.3 Tabs

```typescript
// Tab variants:
// 1. Underline tabs (default)
// 2. Pills tabs
// 3. Boxed tabs
// 4. Icon tabs
// 5. Vertical tabs (for settings)

// Tab rules:
// - URL-synced (use searchParams)
// - Keyboard navigable (arrow keys)
// - Lazy load tab content
// - Remember last active tab
// - Show loading state per tab
```

### 9.4 Command Palette

```typescript
// components/shared/global-search.tsx

// Trigger: Cmd/Ctrl + K

// Features:
// - Search across all entities
// - Recent items
// - Quick actions
// - Navigation shortcuts
// - Fuzzy matching

// Result groups:
// 1. Pages (navigation)
// 2. Customers
// 3. Pets
// 4. Products
// 5. Invoices
// 6. Appointments
// 7. Actions (quick create)

// Keyboard navigation:
// - ↑↓ navigate results
// - Enter select
// - Esc close
// - Tab switch groups
```

### 9.5 Context Menu

```typescript
// Right-click menu for:
// - Table rows
// - Cards
// - List items

// Menu items:
// - View details
// - Edit
// - Duplicate
// - Delete
// - Quick actions (context-specific)

// Rules:
// - Keyboard accessible
// - Close on click outside
// - Nested submenus supported
```

---

## 10. Responsive & Accessibility

### 10.1 Responsive Design

```typescript
// Breakpoint strategy:
// Mobile-first approach

// Mobile (< 640px):
// - Single column layout
// - Sidebar as drawer
// - Bottom navigation
// - Stacked cards
// - Full-width modals
// - Touch-optimized buttons (min 44px)

// Tablet (640px - 1024px):
// - Two column where appropriate
// - Sidebar collapsible
// - Grid layouts (2 cols)
// - Side drawer modals

// Desktop (> 1024px):
// - Full sidebar
// - Multi-column layouts
// - Hover states
// - Keyboard shortcuts
// - Dense information display

// Responsive utilities:
// - hidden sm:block (hide on mobile)
// - grid-cols-1 md:grid-cols-2 lg:grid-cols-3
// - flex-col md:flex-row
```

### 10.2 Accessibility (WCAG 2.1 AA)

```typescript
// Accessibility rules:

// 1. Color contrast:
// - Text: min 4.5:1 ratio
// - Large text: min 3:1 ratio
// - UI components: min 3:1 ratio
// - Don't rely on color alone

// 2. Keyboard navigation:
// - All interactive elements focusable
// - Visible focus indicators
// - Logical tab order
// - Skip to content link
// - Keyboard shortcuts documented

// 3. Screen readers:
// - Semantic HTML
// - ARIA labels where needed
// - Alt text for images
// - Form labels associated
// - Live regions for dynamic content

// 4. Motion:
// - Respect prefers-reduced-motion
// - No auto-playing animations
// - Pause/stop controls

// 5. Forms:
// - Clear labels
// - Error messages announced
// - Required fields indicated
// - Autocomplete attributes

// 6. Focus management:
// - Focus trap in modals
// - Return focus on close
// - Manage focus on route change

// Testing:
// - axe-core automated tests
// - Manual keyboard testing
// - Screen reader testing (NVDA, VoiceOver)
// - Color contrast checker
```

### 10.3 Touch Targets

```typescript
// Minimum touch target sizes:
// - Buttons: 44x44px
// - Links: 44x44px
// - Form controls: 44x44px
// - Checkbox/radio: 24x24px (with 44px tap area)
// - Icon buttons: 44x44px

// Spacing between touch targets:
// - Min 8px gap
// - Recommended 12px gap
```

---

## 11. Animation & Motion

### 11.1 Animation Principles

```typescript
// Principles:
// 1. Purposeful: every animation has a reason
// 2. Fast: 150-300ms for most transitions
// 3. Natural: ease-out for entrance, ease-in for exit
// 4. Consistent: same animation for same action
// 5. Accessible: respect prefers-reduced-motion

// Duration guidelines:
// - Micro-interactions: 100-150ms
// - Component transitions: 200-300ms
// - Page transitions: 300-400ms
// - Complex animations: 400-600ms

// Easing functions:
// - ease-out: entrance animations
// - ease-in: exit animations
// - ease-in-out: state changes
// - spring: playful interactions
```

### 11.2 Common Animations

```typescript
// 1. Page transitions:
// - Fade in on route change
// - Slide up for modals
// - Slide in for drawers

// 2. Component animations:
// - Fade in on mount
// - Scale in for dropdowns
// - Slide for accordions

// 3. Micro-interactions:
// - Button press (scale down)
// - Hover states (color/shadow)
// - Focus states (ring)
// - Loading spinners
// - Success checkmarks

// 4. Data animations:
// - Chart transitions
// - Number counting
// - Progress bars
// - Skeleton loading

// 5. Feedback animations:
// - Toast slide in/out
// - Dialog scale in
// - Error shake
// - Success bounce
```

### 11.3 Reduced Motion

```typescript
// CSS:
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

// Implementation:
// - Check prefers-reduced-motion
// - Disable non-essential animations
// - Keep functional transitions (fast)
// - Provide alternative feedback
```

---

## 12. UX Patterns

### 12.1 Search Pattern

```typescript
// Search types:
// 1. Global search (command palette)
// 2. Page search (filter data)
// 3. Inline search (within component)

// Search UX:
// - Debounce input (300ms)
// - Show loading state
// - Highlight matches
// - Recent searches
// - Search suggestions
// - Clear button
// - Keyboard shortcut (Cmd/Ctrl + K)
// - Empty state with suggestions
```

### 12.2 Filter Pattern

```typescript
// Filter types:
// 1. Quick filters (chips/tabs)
// 2. Advanced filters (drawer/modal)
// 3. Faceted filters (sidebar)

// Filter UX:
// - URL-synced (shareable)
// - Clear all button
// - Active filter count
// - Filter preview
// - Save filter presets
// - Responsive: drawer on mobile
```

### 12.3 Sort Pattern

```typescript
// Sort UX:
// - Click column header to sort
// - Toggle asc/desc
// - Show sort indicator
// - Multi-column sort (advanced)
// - URL-synced
// - Remember preference
```

### 12.4 Pagination Pattern

```typescript
// Pagination UX:
// - Page numbers (with ellipsis)
// - Previous/Next buttons
// - Page size selector (10, 20, 50, 100)
// - Total count display
// - Jump to page
// - URL-synced
// - Infinite scroll (alternative)

// Rules:
// - Default 20 items per page
// - Max 100 items per page
// - Show "1-20 of 150" format
```

### 12.5 Bulk Actions Pattern

```typescript
// Bulk actions UX:
// 1. Select items (checkbox)
// 2. Action toolbar appears
// 3. Choose action
// 4. Confirm if destructive
// 5. Show progress
// 6. Show results

// Actions:
// - Delete
// - Export
// - Tag/untag
// - Status change
// - Assign
```

### 12.6 Optimistic Updates

```typescript
// Optimistic update pattern:
// 1. User action (e.g., toggle status)
// 2. Update UI immediately
// 3. Send request to server
// 4. On success: keep UI state
// 5. On error: rollback UI + show error

// Use cases:
// - Toggle switches
// - Like/favorite
// - Status changes
// - Quantity updates
```

### 12.7 Undo Pattern

```typescript
// Undo UX:
// 1. User performs action
// 2. Show toast with undo button
// 3. Wait 5 seconds
// 4. Execute action
// 5. Or rollback if undo clicked

// Use cases:
// - Delete item
// - Archive item
// - Move item
// - Bulk actions

// Toast with undo:
toast.success('Customer dihapus', {
  action: {
    label: 'Undo',
    onClick: () => restoreCustomer(id),
  },
  duration: 5000,
});
```

### 12.8 Drag & Drop Pattern

```typescript
// Drag & drop use cases:
// - Reorder list items
// - Move between columns (Kanban)
// - Resize columns
// - Drag files to upload

// UX rules:
// - Visual feedback (ghost element)
// - Drop zones highlighted
// - Keyboard alternative
// - Snap to grid
// - Cancel on Esc
```

### 12.9 Keyboard Shortcuts

```typescript
// Global shortcuts:
// Cmd/Ctrl + K: Global search
// Cmd/Ctrl + N: New (context-aware)
// Cmd/Ctrl + S: Save
// Cmd/Ctrl + Z: Undo
// Cmd/Ctrl + Shift + Z: Redo
// Esc: Close modal/drawer
// ?: Show shortcuts help

// Page-specific shortcuts:
// POS:
// - F1: Focus search
// - F2: Quick customer
// - F3: Quick product
// - F4: Payment
// - F12: Clear cart

// Navigation:
// G then D: Go to Dashboard
// G then C: Go to Customers
// G then P: Go to Products
// G then S: Go to Settings

// Rules:
// - Don't conflict with browser shortcuts
// - Show in UI (tooltips, help modal)
// - Respect user preferences
// - Platform-aware (Cmd vs Ctrl)
```

### 12.10 Progressive Disclosure

```typescript
// Progressive disclosure principles:
// 1. Show essential info first
// 2. Hide advanced options
// 3. Reveal on demand
// 4. Use expandable sections
// 5. Use tabs for related content

// Examples:
// - Customer form: basic info visible, advanced in collapsible
// - Product detail: main info visible, history in tab
// - Settings: common settings visible, advanced in separate page
```

---

## 13. Performance Budgets

### 13.1 Bundle Size

```typescript
// Budget targets:
// - Initial JS: < 200KB (gzipped)
// - Per-route JS: < 50KB (gzipped)
// - CSS: < 50KB (gzipped)
// - Images: optimized, WebP/AVIF
// - Fonts: subset, preload critical

// Code splitting:
// - Route-based splitting (automatic)
// - Component lazy loading
// - Dynamic imports for heavy components
// - Prefetch on hover/link
```

### 13.2 Loading Performance

```typescript
// Targets:
// - First Contentful Paint: < 1.5s
// - Largest Contentful Paint: < 2.5s
// - Time to Interactive: < 3.5s
// - Cumulative Layout Shift: < 0.1
// - First Input Delay: < 100ms

// Techniques:
// - Server Components for data fetching
// - Streaming SSR
// - Image optimization (next/image)
// - Font optimization
// - Static generation where possible
// - Edge caching
```

### 13.3 Runtime Performance

```typescript
// Rules:
// - Memoize expensive computations
// - Virtualize long lists (> 100 items)
// - Debounce expensive operations
// - Throttle scroll/resize handlers
// - Use web workers for heavy tasks
// - Avoid unnecessary re-renders

// Monitoring:
// - React DevTools Profiler
// - Lighthouse CI
// - Web Vitals tracking
// - Bundle analyzer
```

### 13.4 Image Optimization

```typescript
// Image rules:
// - Use next/image for all images
// - Specify width/height (avoid CLS)
// - Use proper sizes attribute
// - Lazy load below-fold images
// - Use WebP/AVIF formats
// - Provide blur placeholder
// - Optimize for retina (2x)

// Image sizes:
// - Avatars: 40x40, 80x80, 120x120
// - Product photos: 300x300, 600x600
// - Hero images: 1200x600, 1920x960
// - Thumbnails: 100x100, 200x200
```

---

## 14. File Structure & Naming

### 14.1 Component File Structure

```typescript
// components/
// ├── ui/                    # shadcn/ui (auto-generated)
// ├── shared/                # Reusable cross-feature
// │   ├── data-table/
// │   │   ├── data-table.tsx
// │   │   ├── data-table-column-header.tsx
// │   │   ├── data-table-pagination.tsx
// │   │   ├── data-table-toolbar.tsx
// │   │   └── index.ts
// │   ├── search-input.tsx
// │   ├── status-badge.tsx
// │   └── ...
// ├── domain/                # Feature-specific
// │   ├── customer/
// │   │   ├── customer-form.tsx
// │   │   ├── customer-card.tsx
// │   │   ├── customer-table.tsx
// │   │   ├── customer-detail-header.tsx
// │   │   └── index.ts
// │   └── ...
// └── layout/                # Layout components
//     ├── sidebar.tsx
//     ├── header.tsx
//     └── ...

// Rules:
// - One component per file
// - Co-locate related files
// - Index.ts for public exports
// - PascalCase for component files
// - kebab-case for utilities
```

### 14.2 Naming Conventions

```typescript
// Components: PascalCase
// CustomerForm.tsx
// StatusBadge.tsx

// Hooks: camelCase with 'use' prefix
// useCustomers.ts
// useSettings.ts

// Utils: kebab-case
// format-date.ts
// format-currency.ts

// Types: PascalCase
// Customer.ts
// CreateCustomerInput.ts

// Constants: UPPER_SNAKE_CASE
// MAX_RETRY_ATTEMPTS
// DEFAULT_PAGE_SIZE

// CSS classes: Tailwind utilities
// flex items-center gap-2

// Files:
// - Pages: page.tsx
// - Layouts: layout.tsx
// - Loading: loading.tsx
// - Error: error.tsx
// - Not found: not-found.tsx
```

### 14.3 Import Order

```typescript
// Import order (enforced by ESLint):
// 1. React & Next.js
// 2. External libraries
// 3. Internal aliases (@/...)
// 4. Relative imports
// 5. Types (import type)
// 6. Styles

// Example:
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { CustomerForm } from '@/components/domain/customer';
import { createCustomerAction } from '@/app/actions/customer.actions';
import { createCustomerSchema } from '@/schemas/customer';

import type { Customer } from '@/types';

import './styles.css';
```

---

## Penutup

Dokumen ini adalah **kontrak frontend final** untuk seluruh sistem Petora. Setiap developer frontend **wajib mengikuti** kontrak ini untuk memastikan:

✅ **Konsistensi UI/UX** di seluruh aplikasi
✅ **Accessibility** (WCAG 2.1 AA)
✅ **Performance** optimal
✅ **Maintainability** tinggi
✅ **Developer experience** menyenangkan

### Checklist Implementasi

- [ ] Design tokens di-setup (Tailwind v4)
- [ ] shadcn/ui components ter-install
- [ ] Layout system implemented (auth, dashboard, portal, kiosk)
- [ ] Shared components dibuat (StatusBadge, EmptyState, dll)
- [ ] Domain components dibuat per fitur
- [ ] Form pattern standar diterapkan
- [ ] Data display components (table, card, list, chart)
- [ ] Feedback system (toast, dialog, loading, error, empty)
- [ ] Navigation system (sidebar, breadcrumbs, tabs, command palette)
- [ ] Responsive design di semua breakpoint
- [ ] Accessibility audit (axe-core)
- [ ] Animation & motion sesuai prinsip
- [ ] UX patterns (search, filter, sort, pagination, bulk actions)
- [ ] Performance budgets dipantau
- [ ] File structure & naming conventions diikuti

**Selamat membangun UI/UX Petora yang luar biasa!** 🐾✨

---

*Dokumen ini adalah acuan tunggal untuk implementasi frontend. Setiap perubahan harus melalui review dan update dokumen ini terlebih dahulu.*
