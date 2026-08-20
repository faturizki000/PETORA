import { Suspense } from 'react';
import { DashboardStats } from '@/components/domain/dashboard/dashboard-stats';
import { DashboardWidgets } from '@/components/domain/dashboard/dashboard-widgets';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Selamat datang di Petora</p>
      </div>
      <Suspense fallback={<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">Loading stats...</div>}>
        <DashboardStats />
      </Suspense>
      <DashboardWidgets />
    </div>
  );
}
