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

const statusColors: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-800',
  PAUSED: 'bg-yellow-100 text-yellow-800',
  CANCELLED: 'bg-red-100 text-red-800',
  EXPIRED: 'bg-gray-100 text-gray-800',
};

export function SubscriptionTable() {
  const [search, setSearch] = useState('');
  const router = useRouter();

  const data = useMemo(() => [], []);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search subscriptions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button onClick={() => router.push('/dashboard/subscriptions/new')}>
          <Plus className="h-4 w-4 mr-2" />
          New Subscription
        </Button>
      </div>
      {data.length === 0 ? (
        <Card className="p-6">
          <p className="text-muted-foreground text-center">No subscriptions found</p>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Number</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((sub: any) => (
                <TableRow key={sub.id}>
                  <TableCell>{sub.subscription_number}</TableCell>
                  <TableCell>{sub.customer_id}</TableCell>
                  <TableCell>{sub.plan_id}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[sub.status] || 'bg-gray-100 text-gray-800'}>{sub.status}</Badge>
                  </TableCell>
                  <TableCell>{sub.start_date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
