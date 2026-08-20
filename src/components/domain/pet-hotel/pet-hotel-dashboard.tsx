'use client';

import { useQuery } from '@tanstack/react-query';
import { PetHotelService } from '@/lib/services/pet-hotel.service';
import { Card } from '@/components/ui/card';
import { Bed, Users, Calendar } from 'lucide-react';

export function PetHotelDashboard() {
  const { data: rooms, isLoading: roomsLoading } = useQuery({
    queryKey: ['pet-hotel', 'rooms'],
    queryFn: () => PetHotelService.listRooms(),
  });

  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ['pet-hotel', 'bookings'],
    queryFn: () => PetHotelService.listBookings({ limit: 10 }),
  });

  const availableRooms = (rooms || []).filter((r: Record<string, unknown>) => r.status === 'AVAILABLE').length;
  const occupiedRooms = (rooms || []).filter((r: Record<string, unknown>) => r.status === 'OCCUPIED').length;
  const activeBookings = (bookings?.data || []).filter((b: Record<string, unknown>) => ['PENDING', 'CONFIRMED', 'CHECKED_IN'].includes(b.status as string)).length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Available Rooms</p>
              <p className="text-2xl font-bold">{availableRooms}</p>
            </div>
            <Bed className="h-8 w-8 text-muted-foreground" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Occupied Rooms</p>
              <p className="text-2xl font-bold">{occupiedRooms}</p>
            </div>
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Bookings</p>
              <p className="text-2xl font-bold">{activeBookings}</p>
            </div>
            <Calendar className="h-8 w-8 text-muted-foreground" />
          </div>
        </Card>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
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
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Room Status</h3>
          {roomsLoading ? (
            <p className="text-muted-foreground text-sm">Loading...</p>
          ) : (
            <div className="space-y-3">
              {(rooms || []).slice(0, 5).map((room: Record<string, unknown>) => (
                <div key={room.id as string} className="flex items-center justify-between text-sm">
                  <span>{room.name as string}</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    room.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                    room.status === 'OCCUPIED' ? 'bg-red-100 text-red-800' :
                    room.status === 'MAINTENANCE' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>{(room.status as string) || 'AVAILABLE'}</span>
                </div>
              ))}
              {(!rooms || rooms.length === 0) && (
                <p className="text-muted-foreground text-sm">No rooms</p>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
