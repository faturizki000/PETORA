'use client';

import { useRouter } from 'next/navigation';
import { SubscriptionForm } from '@/components/domain/subscription/subscription-form';

export default function NewSubscriptionPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">New Subscription</h1>
        <p className="text-muted-foreground">Create a new subscription</p>
      </div>
      <SubscriptionForm onSuccess={() => router.push('/dashboard/subscriptions')} />
    </div>
  );
}
