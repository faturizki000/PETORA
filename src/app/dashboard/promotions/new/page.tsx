'use client';

import { useRouter } from 'next/navigation';
import { PromotionForm } from '@/components/domain/promotion/promotion-form';

export default function NewPromotionPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">New Promotion</h1>
        <p className="text-muted-foreground">Create a new promotion</p>
      </div>
      <PromotionForm onSuccess={() => router.push('/dashboard/promotions')} />
    </div>
  );
}
