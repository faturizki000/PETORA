'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AppointmentService } from '@/lib/services/appointment.service';
import { AppointmentCard } from '@/components/domain/appointment/appointment-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Plus, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function AppointmentTableClient() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('');
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ['appointments', 'list', { search, status }],
    queryFn: () => AppointmentService.list({ search, status, limit: 50 }),
  });

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'SCHEDULED', label: 'Scheduled' },
    { value: 'WAITING', label: 'Waiting' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'DONE', label: 'Done' },
    { value: 'CANCELLED', label: 'Cancelled' },
    { value: 'NO_SHOW', label: 'No Show' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search appointments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-8 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm">
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <Button onClick={() => router.push('/dashboard/appointments/new')}>
          <Plus className="h-4 w-4 mr-2" />
          New Appointment
        </Button>
      </div>
      {isLoading ? (
        <Card className="p-6"><p className="text-muted-foreground">Loading...</p></Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data?.data.map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))}
          {data?.data.length === 0 && (
            <Card className="p-6 col-span-full">
              <p className="text-muted-foreground text-center">No appointments found</p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
