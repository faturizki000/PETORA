'use client';

import { CustomerForm } from '@/components/domain/customer/customer-form';

export default function EditCustomerPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Customer</h1>
        <p className="text-muted-foreground">Update customer information</p>
      </div>
      <CustomerForm customer={{ id: params.id }} />
    </div>
  );
}
