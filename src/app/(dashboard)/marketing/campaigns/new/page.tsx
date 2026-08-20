'use client';

import { useRouter } from 'next/navigation';
import { CampaignForm } from '@/components/domain/marketing/campaign-form';

export default function NewCampaignPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">New Campaign</h1>
        <p className="text-muted-foreground">Create a new marketing campaign</p>
      </div>
      <CampaignForm onSuccess={() => router.push('/dashboard/marketing')} />
    </div>
  );
}
