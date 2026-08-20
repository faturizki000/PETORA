# AGENTS.md — Petora AI Development Guide

## Project Overview

**Petora** adalah sistem manajemen terpadu (all-in-one) untuk bisnis Petshop & Petcare di Indonesia. Sistem ini mengintegrasikan seluruh operasional bisnis dalam satu platform modern yang mudah digunakan.

### Core Features
- Customer & Pet Management
- Appointment & Queue System
- Medical Records & Prescriptions
- Pet Hotel & Grooming
- POS & Invoicing
- Inventory Management
- Payment System (Manual + Gateway)
- Loyalty Program & Promotions
- Multi-branch Support
- Customer Portal & Self-Service Kiosk

---

## Tech Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4 (CSS-first config)
- **Components:** shadcn/ui + Radix Primitives
- **State Management:** Zustand + TanStack Query
- **Forms:** React Hook Form + Zod
- **Charts:** Recharts
- **PDF:** @react-pdf/renderer
- **Icons:** Lucide React

### Backend
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth + Custom PIN
- **Authorization:** Row Level Security (RLS)
- **Storage:** Supabase Storage
- **Realtime:** Supabase Realtime
- **Edge Functions:** Deno (for external integrations)

### Deployment
- **Platform:** Vercel
- **CI/CD:** GitHub Actions (optional)

---

## Project Structure

```
petora/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth routes (login, forgot-password)
│   ├── (dashboard)/              # Staff dashboard
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
│   │   ├── reports/
│   │   └── settings/             # 17 kategori settings
│   ├── (portal)/                 # Customer portal
│   ├── (kiosk)/                  # Self-service kiosk
│   ├── actions/                  # Server Actions
│   └── api/                      # Webhooks only
│
├── components/
│   ├── ui/                       # shadcn/ui (auto-generated)
│   ├── shared/                   # Reusable components
│   ├── domain/                   # Feature-specific components
│   └── layout/                   # Layout components
│
├── lib/
│   ├── supabase/                 # Supabase clients
│   │   ├── server.ts             # Server client
│   │   ├── client.ts             # Browser client
│   │   └── middleware.ts         # Middleware client
│   ├── services/                 # Domain services
│   ├── utils/                    # Utility functions
│   ├── constants/                # Constants & default settings
│   ├── query-keys.ts             # React Query keys
│   ├── errors.ts                 # Error classes
│   └── toast.ts                  # Toast helpers
│
├── hooks/                        # Custom React hooks
├── stores/                       # Zustand stores
├── types/                        # TypeScript types
├── schemas/                      # Zod schemas
│
├── supabase/
│   ├── functions/                # Edge Functions (Deno)
│   ├── migrations/               # Database migrations
│   └── seed/                     # Seed data
│
├── scripts/                      # Setup & deployment scripts
├── messages/                     # i18n translations
└── public/                       # Static assets
```

---

## Coding Conventions

### TypeScript
- **Strict mode** enabled
- **No `any`** — use `unknown` and type guards
- **Explicit return types** for all functions
- **Prefer interfaces** over types for object shapes
- **Use `type`** for unions, intersections, and utilities

```typescript
// ✅ Good
interface Customer {
  id: string;
  name: string;
  email: string | null;
}

function getCustomer(id: string): Promise<Customer | null> {
  // ...
}

// ❌ Bad
function getCustomer(id: any): any {
  // ...
}
```

### Naming Conventions

| Element | Convention | Example |
|---|---|---|
| Components | PascalCase | `CustomerForm.tsx` |
| Functions | camelCase | `createCustomer` |
| Server Actions | camelCase + `Action` | `createCustomerAction` |
| Hooks | camelCase + `use` | `useCustomers` |
| Types/Interfaces | PascalCase | `Customer`, `CreateCustomerInput` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRY_ATTEMPTS` |
| Files (components) | PascalCase | `CustomerForm.tsx` |
| Files (utils/hooks) | kebab-case | `format-date.ts` |
| DB tables | snake_case, plural | `customers`, `medical_records` |
| DB columns | snake_case | `created_at`, `customer_id` |

### Component Structure

```typescript
// components/domain/customer/customer-form.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createCustomerSchema, type CreateCustomerInput } from '@/schemas/customer';
import type { Customer } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CustomerFormProps {
  customer?: Customer;
  onSuccess?: (customer: Customer) => void;
  onCancel?: () => void;
}

export function CustomerForm({ customer, onSuccess, onCancel }: CustomerFormProps) {
  const form = useForm<CreateCustomerInput>({
    resolver: zodResolver(createCustomerSchema),
    defaultValues: customer ?? {
      name: '',
      phone: '',
      is_guest: false,
    },
  });

  const onSubmit = async (data: CreateCustomerInput) => {
    // ...
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {/* Form fields */}
    </form>
  );
}
```

### Server Actions Pattern

```typescript
// app/actions/customer.actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createCustomerSchema } from '@/schemas/customer';
import type { ActionResponse, Customer } from '@/types';

export async function createCustomerAction(
  input: unknown
): Promise<ActionResponse<Customer>> {
  // 1. Validate
  const parsed = createCustomerSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: 'VALIDATION_ERROR',
      details: parsed.error.flatten(),
    };
  }

  // 2. Auth check
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'AUTH_ERROR' };
  }

  // 3. Execute
  const { data, error } = await supabase
    .from('customers')
    .insert(parsed.data)
    .select()
    .single();

  if (error) {
    return { success: false, error: 'DB_ERROR', message: error.message };
  }

  // 4. Revalidate
  revalidatePath('/customers');

  return { success: true, data };
}
```

### React Query Hooks Pattern

```typescript
// hooks/use-customers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { CustomerService } from '@/lib/services/customer.service';
import { createCustomerAction } from '@/app/actions/customer.actions';
import type { CreateCustomerInput } from '@/schemas/customer';

export function useCustomers(filters: Record<string, any>) {
  return useQuery({
    queryKey: queryKeys.customers.list(filters),
    queryFn: () => CustomerService.list(filters),
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateCustomerInput) => createCustomerAction(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.lists() });
    },
  });
}
```

---

## Database Conventions

### Table Naming
- **Plural:** `customers`, `pets`, `appointments`
- **Snake case:** `medical_records`, `pet_hotel_bookings`
- **Prefix for related tables:** `pet_vaccines`, `pet_weight_logs`

### Column Naming
- **Snake case:** `created_at`, `customer_id`, `is_active`
- **Timestamps:** `created_at`, `updated_at`, `deleted_at`
- **Foreign keys:** `<table_singular>_id` (e.g., `customer_id`, `pet_id`)
- **Booleans:** Prefix with `is_` (e.g., `is_active`, `is_guest`)

### Indexes
- **Format:** `idx_<table>_<column>`
- **Example:** `idx_customers_phone`, `idx_appointments_date`

### Enums
- **Snake case:** `appointment_status`, `payment_method`
- **Values:** UPPER_SNAKE_CASE (`WAITING`, `IN_PROGRESS`, `DONE`)

---

## Security Guidelines

### Row Level Security (RLS)
- **Enable RLS** on all tables
- **No exceptions** — every table must have RLS
- **Test policies** with different roles
- **Branch isolation** via `branch_id`

### Authentication
- **Supabase Auth** for session management
- **Custom PIN** for staff login (6 digits)
- **Session timeout** configurable (default 30 minutes)
- **Failed login lockout** after 5 attempts

### Authorization
- **Role-based:** OWNER, ADMIN, MANAGER, DOKTER, KASIR, GROOMER, COURIER, CUSTOMER
- **Least privilege:** Only grant necessary permissions
- **Audit logging:** Log all critical actions

### Sensitive Data
- **Never log** PINs, passwords, or tokens
- **Encrypt** sensitive fields at rest
- **Use HTTPS** for all communications
- **Validate** all inputs with Zod

---

## Testing Guidelines

### Unit Tests
- **Coverage target:** 80%+
- **Test utilities** in `lib/utils/`
- **Test services** in `lib/services/`
- **Mock Supabase** client

```typescript
// tests/services/customer.service.test.ts
import { CustomerService } from '@/lib/services/customer.service';
import { createClient } from '@/lib/supabase/server';

jest.mock('@/lib/supabase/server');

describe('CustomerService', () => {
  it('should list customers', async () => {
    const mockSupabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      range: jest.fn().mockResolvedValue({
        data: [{ id: '1', name: 'John' }],
        error: null,
        count: 1,
      }),
    };
    (createClient as jest.Mock).mockResolvedValue(mockSupabase);

    const result = await CustomerService.list({ page: 1, limit: 20 });
    expect(result.data).toHaveLength(1);
  });
});
```

### Integration Tests
- **Test Server Actions** end-to-end
- **Test RLS policies** with different roles
- **Test workflows** (e.g., payment verification)

### E2E Tests
- **Critical user flows** (login, create customer, POS transaction)
- **Use Playwright** for browser automation
- **Test on multiple browsers** (Chrome, Firefox, Safari)

---

## Performance Guidelines

### Bundle Size
- **Initial JS:** < 200KB (gzipped)
- **Per-route JS:** < 50KB (gzipped)
- **CSS:** < 50KB (gzipped)

### Loading Performance
- **First Contentful Paint:** < 1.5s
- **Largest Contentful Paint:** < 2.5s
- **Time to Interactive:** < 3.5s

### Optimization Techniques
- **Server Components** for data fetching
- **Streaming SSR** for faster TTFB
- **Image optimization** with `next/image`
- **Code splitting** with dynamic imports
- **Lazy loading** for below-fold content
- **Memoization** with `useMemo` and `useCallback`

---

## Accessibility Guidelines

### WCAG 2.1 AA Compliance
- **Color contrast:** Min 4.5:1 for text, 3:1 for UI components
- **Keyboard navigation:** All interactive elements focusable
- **Screen readers:** Semantic HTML, ARIA labels
- **Focus indicators:** Visible focus rings
- **Reduced motion:** Respect `prefers-reduced-motion`

### Testing
- **axe-core** for automated testing
- **Manual keyboard testing**
- **Screen reader testing** (NVDA, VoiceOver)

---

## Common Commands

### Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Format code
npm run format
```

### Database
```bash
# Start local Supabase
supabase start

# Run migrations
supabase db push

# Reset database
supabase db reset

# Generate types
supabase gen types typescript --local > types/database.ts
```

### Deployment
```bash
# Deploy to Vercel (preview)
vercel

# Deploy to Vercel (production)
vercel --prod

# Setup project (first time)
./scripts/setup.sh
```

---

## Environment Variables

### Required
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # Edge Functions only
```

### Optional
```bash
# Payment Gateway
MIDTRANS_SERVER_KEY=
MIDTRANS_CLIENT_KEY=

# Integrations
FONNTE_TOKEN=
RESEND_API_KEY=

# Feature Flags
NEXT_PUBLIC_ENABLE_LOYALTY=true
NEXT_PUBLIC_ENABLE_PORTAL=true
```

---

## Troubleshooting

### Common Issues

**Issue:** RLS policy blocking access
- **Solution:** Check user role and branch_id in policy

**Issue:** Type mismatch in Server Action
- **Solution:** Validate input with Zod schema first

**Issue:** React Query not refetching
- **Solution:** Check query key matches, call `invalidateQueries`

**Issue:** Build fails with TypeScript errors
- **Solution:** Run `npm run type-check` to see all errors

**Issue:** Supabase connection timeout
- **Solution:** Check URL and anon key in `.env.local`

---

## Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [TanStack Query](https://tanstack.com/query/latest)
- [Zustand](https://github.com/pmndrs/zustand)
- [Zod](https://zod.dev)

### Internal Docs
- Technical Architecture Contract
- Frontend Contract
- PRD (Product Requirements Document)
- Access Control PRD

---

## Support

For questions or issues:
1. Check this AGENTS.md first
2. Review internal documentation
3. Search existing issues in repository
4. Contact technical lead

---

**Last Updated:** 20 Agustus 2026  
**Version:** 1.0  
**Maintained by:** Petora Development Team
