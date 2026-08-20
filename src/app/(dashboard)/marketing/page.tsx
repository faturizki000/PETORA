import { Suspense } from 'react';
import { CampaignTable } from '@/components/domain/marketing/campaign-table';

export default function MarketingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Marketing</h1>
        <p className="text-muted-foreground">Kelola kampanye pemasaran</p>
      </div>
      <Suspense fallback={<div>Loading campaigns...</div>}>
        <CampaignTable />
      </Suspense>
    </div>
  );
}
