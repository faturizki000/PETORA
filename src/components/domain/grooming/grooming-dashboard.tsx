'use client';

import { useQuery } from '@tanstack/react-query';
import { GroomingService } from '@/lib/services/grooming.service';
import { Card } from '@/components/ui/card';
import { Scissors, Calendar, DollarSign } from 'lucide-react';

export function GroomingDashboard() {
  const { data: services, isLoading: servicesLoading } = useQuery({
    queryKey: ['grooming', 'services'],
    queryFn: () => GroomingService.listServices(),
  });

  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ['grooming', 'bookings'],
    queryFn: () => GroomingService.listBookings({ limit: 10 }),
  });

  const activeServices = (services || []).filter((s: Record<string, unknown>) => s.is_active).length;
  const todayBookings = (bookings?.data || []).length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Services</p>
              <p className="text-2xl font-bold">{activeServices}</p>
            </div>
            <Scissors className="h-8 w-8 text-muted-foreground" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Today&apos;s Bookings</p>
              <p className="text-2xl font-bold">{todayBookings}</p>
            </div>
            <Calendar className="h-8 w-8 text-muted-foreground" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Revenue</p>
              <p className="text-2xl font-bold">Rp 0</p>
            </div>
            <DollarSign className="h-8 w-8 text-muted-foreground" />
          </div>
        </Card>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Recent Services</h3>
          {servicesLoading ? (
            <p className="text-muted-foreground text-sm">Loading...</p>
          ) : (
            <div className="space-y-3">
              {(services || []).slice(0, 5).map((service: Record<string, unknown>) => (
                <div key={service.id as string} className="flex items-center justify-between text-sm">
                  <span>{service.name as string}</span>
                  <span className="text-muted-foreground">Rp {(service.price as number)?.toLocaleString('id-ID') || 0}</span>
                </div>
              ))}
              {(!services || services.length === 0) && (
                <p className="text-muted-foreground text-sm">No services</p>
              )}
            </div>
          )}
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Recent Bookings</h3>
          {bookingsLoading ? (
            <p className="text-muted-foreground text-sm">Loading...</p>
          ) : (
            <div className="space-y-3">
              {(bookings?.data || []).slice(0, 5).map((booking: Record<string, unknown>) => (
                <div key={booking.id as string} className="flex items-center justify-between text-sm">
                  <span>Booking {(booking.id as string)?.slice(0, 8)}</span>
                  <span className="text-muted-foreground">{(booking.status as string) || '-'}</span>
                </div>
              ))}
              {(!bookings?.data || bookings.data.length === 0) && (
                <p className="text-muted-foreground text-sm">No bookings</p>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
