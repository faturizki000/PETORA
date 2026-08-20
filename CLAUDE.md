@AGENTS.md
# CLAUDE.md — Petora Development Guide for Claude Code

> **Petora** — Sistem Manajemen Terpadu Petshop & Petcare
> Stack: Next.js 16 + Tailwind v4 + shadcn/ui + Supabase + Vercel

---

## 🎯 Project Identity

**Petora** adalah all-in-one platform manajemen untuk bisnis Petshop & Petcare di Indonesia. Sistem ini mengintegrasikan 25+ modul operasional dalam satu aplikasi modern yang owner-configurable dan siap multi-cabang.

**Core Value:**
- Owner bisa konfigurasi semua setting dari dashboard (17 kategori)
- Payment fleksibel (manual default, gateway optional)
- One-command setup, zero manual config
- Type-safe end-to-end (TypeScript + Zod + RLS)

---

## 🚀 Quick Start Commands

```bash
# Development
npm install                    # Install dependencies
npm run dev                    # Start dev server (http://localhost:3000)
npm run build                  # Production build
npm run start                  # Start production server

# Code Quality
npm run lint                   # ESLint check
npm run lint:fix               # Auto-fix lint errors
npm run type-check             # TypeScript strict check
npm run format                 # Prettier format

# Testing
npm test                       # Run unit tests (Vitest)
npm run test:watch             # Watch mode
npm run test:coverage          # Coverage report (>80% required)
npm run test:e2e               # E2E tests (Playwright)

# Database (Supabase)
supabase start                 # Start local Supabase
supabase stop                  # Stop local Supabase
supabase db reset              # Reset database
supabase db push               # Push migrations
supabase gen types typescript  # Generate DB types

# Deployment
vercel                         # Deploy preview
vercel --prod                  # Deploy production
./scripts/setup.sh             # First-time setup
./scripts/deploy.sh            # Automated deployment
./scripts/seed.ts              # Seed default data
```

---

## 📚 Tech Stack (FINAL — DO NOT CHANGE)

| Layer | Technology | Notes |
|---|---|---|
| **Framework** | Next.js 16 (App Router) | Server Components default |
| **Language** | TypeScript (strict) | No `any`, explicit types |
| **Styling** | Tailwind CSS v4 | CSS-first config, NO tailwind.config.js |
| **Components** | shadcn/ui + Radix | Copy-paste, fully customizable |
| **Backend** | Supabase (Full Stack) | PostgreSQL + Auth + RLS + Storage + Realtime |
| **Backend Runtime** | Deno (Edge Functions) | **NO Node.js backend** |
| **State (Server)** | TanStack Query | Cache, refetch, optimistic updates |
| **State (Client)** | Zustand | Global UI state only |
| **Forms** | React Hook Form + Zod | Always validate with Zod |
| **Charts** | Recharts | |
| **PDF** | @react-pdf/renderer | |
| **Icons** | Lucide React | |
| **i18n** | next-intl | ID + EN |
| **Deployment** | Vercel | Edge network |

### ❌ BANNED Technologies
- ❌ Node.js backend (Express, Fastify, NestJS)
- ❌ REST API manual (gunakan Server Actions)
- ❌ tRPC
- ❌ Prisma ORM (gunakan Supabase JS Client langsung)
- ❌ Redux
- ❌ Tailwind v3 config file
- ❌ Wajib payment gateway (manual default)

---

## 🏗️ Architecture Principles

### 1. Server-First Rendering
```tsx
// ✅ DEFAULT: Server Component
export default async function CustomersPage() {
  const customers = await CustomerService.list({ page: 1 });
  return <CustomerTable data={customers.data} />;
}

// ⚠️ HANYA jika perlu interaksi
'use client';
export function CustomerForm() { /* ... */ }
```

### 2. Server Actions for Mutations
```tsx
// ✅ CORRECT: Server Action
'use server';
export async function createCustomerAction(input: unknown): Promise<ActionResponse<Customer>> {
  const parsed = createCustomerSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: 'VALIDATION_ERROR' };
  
  const supabase = await createClient();
  const { data, error } = await supabase.from('customers').insert(parsed.data).select().single();
  if (error) return { success: false, error: 'DB_ERROR' };
  
  revalidatePath('/customers');
  return { success: true, data };
}

// ❌ WRONG: REST API
// app/api/customers/route.ts — JANGAN LAKUKAN INI
```

### 3. RLS as Source of Truth
```sql
-- ✅ Otorisasi WAJIB di database
CREATE POLICY "Staff can view customers in branch"
ON customers FOR SELECT
TO authenticated
USING (
  is_staff()
  AND (branch_id = get_user_branch_id() OR branch_id IS NULL)
);

-- ❌ JANGAN validasi role hanya di aplikasi
```

### 4. Defense in Depth (3 Layer Validation)
```
Layer 1: UI        → Hide/show berdasarkan role (UX only)
Layer 2: Server    → Validasi role di Server Action
Layer 3: RLS       → Policy di database (SOURCE OF TRUTH)
```

---

## 📁 Project Structure

```
petora/
├── app/
│   ├── (auth)/              # Login, forgot-password
│   ├── (dashboard)/         # Staff dashboard (sidebar + header)
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
│   │   └── settings/        # 17 kategori settings
│   ├── (portal)/            # Customer portal
│   ├── (kiosk)/             # Self-service kiosk
│   ├── actions/             # Server Actions
│   └── api/webhook/         # HANYA webhook external
│
├── components/
│   ├── ui/                  # shadcn/ui (auto-generated, JANGAN EDIT)
│   ├── shared/              # Reusable cross-feature
│   ├── domain/              # Feature-specific
│   └── layout/              # Sidebar, header, nav
│
├── lib/
│   ├── supabase/
│   │   ├── server.ts        # Server Components & Actions
│   │   ├── client.ts        # Client Components
│   │   ├── middleware.ts    # Middleware
│   │   └── admin.ts         # Edge Functions only
│   ├── services/            # Domain services
│   ├── utils/               # Utility functions
│   ├── constants/           # Constants & default settings
│   ├── query-keys.ts        # React Query keys factory
│   ├── errors.ts            # Error classes
│   └── toast.ts             # Toast helpers
│
├── hooks/                   # Custom React hooks
├── stores/                  # Zustand stores
├── types/                   # TypeScript types
├── schemas/                 # Zod schemas
├── supabase/
│   ├── functions/           # Edge Functions (Deno)
│   ├── migrations/          # SQL migrations
│   └── seed/                # Seed data
└── scripts/                 # Setup & deploy scripts
```

---

## 🔑 Critical Rules (MUST FOLLOW)

### ✅ DO
- ✅ Gunakan Server Components sebagai default
- ✅ Validasi semua input dengan Zod sebelum DB operation
- ✅ Selalu panggil `revalidatePath()` setelah mutation
- ✅ Gunakan `ActionResponse<T>` envelope untuk semua Server Actions
- ✅ Enable RLS di SEMUA tabel (tidak ada pengecualian)
- ✅ Audit log untuk semua critical actions
- ✅ Gunakan `createClient()` dari `@/lib/supabase/server` di Server Actions
- ✅ Branch isolation via `branch_id` di semua query
- ✅ Type-safe dengan TypeScript strict mode
- ✅ Test RLS policies dengan berbagai role

### ❌ DON'T
- ❌ JANGAN gunakan `any` — gunakan `unknown` + type guards
- ❌ JANGAN bypass RLS dengan service role key di client
- ❌ JANGAN trust client-side permission checks
- ❌ JANGAN log PIN, password, atau token
- ❌ JANGAN allow self-approval untuk critical actions
- ❌ JANGAN edit files di `components/ui/` (auto-generated)
- ❌ JANGAN buat REST API routes (kecuali webhook)
- ❌ JANGAN hardcode settings — gunakan `SettingsService`
- ❌ JANGAN skip Zod validation di Server Actions
- ❌ JANGAN commit `.env.local` ke git

---

## 🎨 Code Patterns

### Pattern 1: Server Action Standard

```typescript
// app/actions/[domain].actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import type { ActionResponse } from '@/types';

const schema = z.object({ /* ... */ });

export async function createXxxAction(
  input: unknown
): Promise<ActionResponse<Xxx>> {
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
    .from('xxx')
    .insert(parsed.data)
    .select()
    .single();
  
  if (error) return { success: false, error: 'DB_ERROR', message: error.message };
  
  // 4. Revalidate
  revalidatePath('/xxx');
  
  return { success: true, data };
}
```

### Pattern 2: React Query Hook

```typescript
// hooks/use-xxx.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { XxxService } from '@/lib/services/xxx.service';
import { createXxxAction } from '@/app/actions/xxx.actions';

export function useXxxList(filters: Record<string, any>) {
  return useQuery({
    queryKey: queryKeys.xxx.list(filters),
    queryFn: () => XxxService.list(filters),
  });
}

export function useCreateXxx() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateXxxInput) => createXxxAction(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.xxx.lists() });
    },
  });
}
```

### Pattern 3: Form Component

```tsx
// components/domain/xxx/xxx-form.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createXxxSchema, type CreateXxxInput } from '@/schemas/xxx';

interface XxxFormProps {
  initialData?: Xxx;
  onSuccess?: (data: Xxx) => void;
  onCancel?: () => void;
}

export function XxxForm({ initialData, onSuccess, onCancel }: XxxFormProps) {
  const form = useForm<CreateXxxInput>({
    resolver: zodResolver(createXxxSchema),
    defaultValues: initialData ?? { /* defaults */ },
  });

  const onSubmit = async (data: CreateXxxInput) => {
    const result = await createXxxAction(data);
    if (result.success) onSuccess?.(result.data!);
    else handleActionResponse(result);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* fields */}
        <div className="flex justify-end gap-2">
          {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Batal</Button>}
          <Button type="submit" disabled={form.formState.isSubmitting}>Simpan</Button>
        </div>
      </form>
    </Form>
  );
}
```

### Pattern 4: Domain Service

```typescript
// lib/services/xxx.service.ts
import { createClient } from '@/lib/supabase/server';
import type { Xxx, PaginatedResponse } from '@/types';

export class XxxService {
  static async list(params: {
    page?: number;
    limit?: number;
    search?: string;
    branch_id?: string;
  }): Promise<PaginatedResponse<Xxx>> {
    const supabase = await createClient();
    const { page = 1, limit = 20, search, branch_id } = params;
    
    let query = supabase
      .from('xxx')
      .select('*', { count: 'exact' })
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);
    
    if (branch_id) query = query.eq('branch_id', branch_id);
    if (search) query = query.ilike('name', `%${search}%`);
    
    const { data, error, count } = await query;
    if (error) throw error;
    
    return {
      data: data as Xxx[],
      total: count ?? 0,
      page,
      limit,
      totalPages: Math.ceil((count ?? 0) / limit),
    };
  }
}
```

### Pattern 5: Settings Access

```typescript
// Get setting value
const storeName = await SettingsService.getValue<string>('general.store_name');
const paymentMethods = await SettingsService.getValue<PaymentSettings>('payment.settings');

// Update setting
await SettingsService.update('general.store_name', 'New Name', userId);

// Batch update
await SettingsService.updateBatch([
  { key: 'general.store_name', value: 'New Name' },
  { key: 'general.phone', value: '081234567890' },
], userId);
```

---

## 🗄️ Database Conventions

### Naming
- Tables: `snake_case`, plural (`customers`, `medical_records`)
- Columns: `snake_case` (`created_at`, `customer_id`)
- Foreign keys: `<table_singular>_id` (`customer_id`, `pet_id`)
- Timestamps: `created_at`, `updated_at`, `deleted_at`
- Booleans: prefix `is_` (`is_active`, `is_guest`)
- Indexes: `idx_<table>_<column>`
- Enums: `snake_case` values `UPPER_SNAKE`

### Required Columns (setiap tabel)
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW()
-- deleted_at TIMESTAMPTZ  -- jika soft-delete
-- branch_id UUID          -- jika multi-branch
```

### RLS Helper Functions
```sql
get_user_role()           -- Returns current user's role
get_user_branch_id()      -- Returns current user's branch_id
get_user_customer_id()    -- Returns customer_id (for CUSTOMER role)
is_staff()                -- Check if user is staff
is_owner_or_admin()       -- Check if user is OWNER/ADMIN
```

---

## 🔐 Roles & Permissions

| Role | Scope |
|---|---|
| **OWNER** | Full access + critical settings |
| **ADMIN** | Operational full, no critical settings |
| **MANAGER** | Branch supervision, approvals |
| **DOKTER** | Medical records, prescriptions |
| **KASIR** | POS, payments, cash shifts |
| **GROOMER** | Grooming bookings & records |
| **COURIER** | Delivery tasks |
| **CUSTOMER** | Own data only (portal) |

**Critical Settings (OWNER only):** Security, Integration, Backup, Advanced

---

## 🧪 Testing Strategy

### Unit Tests (Vitest)
- Target coverage: >80%
- Test utilities di `lib/utils/`
- Test services di `lib/services/`
- Mock Supabase client

### Integration Tests
- Test Server Actions end-to-end
- Test RLS policies dengan berbagai role
- Test approval workflows

### E2E Tests (Playwright)
- Critical user flows:
  - Login → Dashboard
  - Create customer → Create pet → Book appointment
  - POS transaction → Payment → Receipt
  - Settings update → Verify applied

### Test Naming
```typescript
describe('CustomerService', () => {
  describe('list', () => {
    it('should return paginated customers', async () => { /* ... */ });
    it('should filter by branch_id', async () => { /* ... */ });
    it('should exclude soft-deleted customers', async () => { /* ... */ });
  });
});
```

---

## 🎨 UI/UX Rules

### Design System
- **Primary color:** Brand green (`--color-brand-500: #22c55e`)
- **Border radius:** `--radius: 0.5rem`
- **Font:** Inter (sans), JetBrains Mono (mono)
- **Breakpoints:** Mobile-first (sm, md, lg, xl, 2xl)

### Component Rules
- Gunakan shadcn/ui sebagai base
- Extend via `components/shared/` atau `components/domain/`
- JANGAN edit `components/ui/` (auto-generated)
- Gunakan `StatusBadge` untuk semua status indicators
- Gunakan `EmptyState` untuk empty data
- Gunakan `LoadingSkeleton` untuk loading states

### Accessibility (WCAG 2.1 AA)
- Color contrast min 4.5:1
- Keyboard navigation untuk semua interactions
- Screen reader support (ARIA labels)
- Focus indicators visible
- Touch targets min 44x44px

---

## 📦 Key Files to Know

### Configuration
- `app/globals.css` — Tailwind v4 + shadcn vars
- `next.config.ts` — Next.js config
- `middleware.ts` — Auth & routing
- `components.json` — shadcn/ui config
- `vercel.json` — Vercel deployment

### Core Infrastructure
- `lib/supabase/server.ts` — Server client
- `lib/supabase/client.ts` — Browser client
- `lib/services/settings.service.ts` — Settings access
- `lib/query-keys.ts` — React Query keys
- `lib/errors.ts` — Error classes
- `lib/toast.ts` — Toast helpers

### Constants
- `lib/constants/default-settings.ts` — 100+ default settings

### Documentation
- `AGENTS.md` — General AI assistant guide
- `CLAUDE.md` — This file (Claude Code specific)

---

## 🚨 Common Pitfalls

### ❌ Wrong: Direct Supabase call in component
```tsx
// ❌ BAD
export default function Page() {
  const supabase = createBrowserClient();
  const { data } = await supabase.from('customers').select();
}

// ✅ GOOD: Use service
export default async function Page() {
  const customers = await CustomerService.list({});
}
```

### ❌ Wrong: Missing validation
```typescript
// ❌ BAD
export async function createAction(input: any) {
  await supabase.from('xxx').insert(input);
}

// ✅ GOOD
export async function createAction(input: unknown) {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { success: false, error: 'VALIDATION_ERROR' };
  await supabase.from('xxx').insert(parsed.data);
}
```

### ❌ Wrong: Missing revalidation
```typescript
// ❌ BAD
export async function createAction() {
  await supabase.from('xxx').insert(data);
  return { success: true };
}

// ✅ GOOD
export async function createAction() {
  await supabase.from('xxx').insert(data);
  revalidatePath('/xxx');
  return { success: true };
}
```

### ❌ Wrong: Hardcoded settings
```typescript
// ❌ BAD
const TAX_RATE = 11;

// ✅ GOOD
const taxSettings = await SettingsService.getValue<TaxSettings>('tax.settings');
const TAX_RATE = taxSettings.rate;
```

---

## 🔍 Debugging Tips

### RLS blocking access
```sql
-- Check current user's role & branch
SELECT get_user_role(), get_user_branch_id();

-- Test RLS policy
SET LOCAL ROLE authenticated;
SET request.jwt.claim.sub = 'user-uuid-here';
SELECT * FROM customers;
```

### Type mismatch
```bash
# Regenerate DB types
supabase gen types typescript --local > types/database.ts
```

### Server Action not working
- Check `revalidatePath()` dipanggil
- Check Zod validation
- Check auth user exists
- Check RLS policy

### React Query not refetching
- Check query key matches
- Call `queryClient.invalidateQueries()` dengan key yang benar
- Check `onSuccess` callback

---

## 📚 Reference Documents

| Document | Purpose |
|---|---|
| `AGENTS.md` | General AI assistant guide |
| `CLAUDE.md` | This file |
| Technical Architecture Contract | Full system architecture |
| Frontend Contract | UI/UX specifications |
| PRD (Product Requirements) | Feature specifications |
| Access Control PRD | Roles & permissions |

---

## 🤝 When Asking Claude for Help

### Good prompts:
- "Buatkan Server Action untuk create customer dengan pattern standar"
- "Implementasi RLS policy untuk medical records"
- "Buat komponen CustomerForm dengan validation"
- "Debug kenapa RLS blocking access untuk role KASIR"
- "Generate migration SQL untuk tabel baru"

### Provide context:
- Role yang sedang dikerjakan (OWNER/ADMIN/etc)
- Modul yang sedang diimplementasi
- Error message lengkap
- File yang sedang diedit

---

## 🎯 Success Criteria

Code yang ditulis Claude harus:
- ✅ Pass TypeScript strict check (`npm run type-check`)
- ✅ Pass ESLint (`npm run lint`)
- ✅ Follow semua patterns di dokumen ini
- ✅ Type-safe end-to-end
- ✅ RLS-compliant
- ✅ Test coverage >80%
- ✅ Accessible (WCAG 2.1 AA)
- ✅ Performant (<2s page load)

---

**Last Updated:** 20 Agustus 2026
**Version:** 1.0
**Maintained by:** Petora Development Team

🐾 *Selamat membangun Petora!*
