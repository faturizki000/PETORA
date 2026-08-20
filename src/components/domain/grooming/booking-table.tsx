'use client';

import { useQuery } from '@tanstack/react-query';
import { GroomingService } from '@/lib/services/grooming.service';
import { GroomingBookingCard } from '@/components/domain/grooming/booking-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Plus, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function GroomingBookingTable() {
  const [search, setSearch] = useState('');
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ['grooming', 'bookings', { search }],
    queryFn: () => GroomingService.listBookings({ search, limit: 50 }),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search grooming bookings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button onClick={() => router.push('/dashboard/grooming/bookings/new')}>
          <Plus className="h-4 w-4 mr-2" />
          New Booking
        </Button>
      </div>
      {isLoading ? (
        <Card className="p-6"><p className="text-muted-foreground">Loading...</p></Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {(data?.data || []).map((booking: Record<string, unknown>) => (
            <GroomingBookingCard key={booking.id as string} booking={booking} />
          ))}
          {(!data?.data || data.data.length === 0) && (
            <Card className="p-6 col-span-full">
              <p className="text-muted-foreground text-center">No grooming bookings found</p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
