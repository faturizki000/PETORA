'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Search, Plus } from 'lucide-react';
import type { Delivery } from '@/types/delivery';

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  ASSIGNED: 'bg-blue-100 text-blue-800',
  PICKED_UP: 'bg-purple-100 text-purple-800',
  IN_TRANSIT: 'bg-indigo-100 text-indigo-800',
  DELIVERED: 'bg-green-100 text-green-800',
  FAILED: 'bg-red-100 text-red-800',
  CANCELLED: 'bg-gray-100 text-gray-800',
};

export function DeliveryTable() {
  const [search, setSearch] = useState('');
  const router = useRouter();

  const data = useMemo(() => [] as Delivery[], []);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search deliveries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button onClick={() => router.push('/dashboard/delivery/new')}>
          <Plus className="h-4 w-4 mr-2" />
          New Delivery
        </Button>
      </div>
      {data.length === 0 ? (
        <Card className="p-6">
          <p className="text-muted-foreground text-center">No deliveries found</p>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Number</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Scheduled</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((delivery) => (
                <TableRow key={delivery.id}>
                  <TableCell className="font-medium">{delivery.delivery_number}</TableCell>
                  <TableCell>{delivery.delivery_address}</TableCell>
                  <TableCell>Rp {(delivery.delivery_fee || 0).toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[delivery.status] || 'bg-gray-100 text-gray-800'}>{delivery.status}</Badge>
                  </TableCell>
                  <TableCell>{delivery.scheduled_at ? new Date(delivery.scheduled_at).toLocaleString() : '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
