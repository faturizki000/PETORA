'use client';

import { useRouter } from 'next/navigation';
import { SessionForm } from '@/components/domain/telemedicine/session-form';

export default function NewTelemedicinePage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">New Telemedicine Session</h1>
        <p className="text-muted-foreground">Create a new telemedicine session</p>
      </div>
      <SessionForm onSuccess={() => router.push('/dashboard/telemedicine')} />
    </div>
  );
}
