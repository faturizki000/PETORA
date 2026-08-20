'use client';

import { useRouter } from 'next/navigation';
import { CustomerForm } from '@/components/domain/customer/customer-form';

export default function NewCustomerPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">New Customer</h1>
        <p className="text-muted-foreground">Create a new customer</p>
      </div>
      <CustomerForm onSuccess={() => router.push('/dashboard/customers')} />
    </div>
  );
}
