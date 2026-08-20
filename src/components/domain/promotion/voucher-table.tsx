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
import type { Voucher } from '@/types/promotion';

export function VoucherTable() {
  const [search, setSearch] = useState('');
  const router = useRouter();

  const data = useMemo(() => [] as Voucher[], []);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search vouchers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button onClick={() => router.push('/dashboard/vouchers/new')}>
          <Plus className="h-4 w-4 mr-2" />
          New Voucher
        </Button>
      </div>
      {data.length === 0 ? (
        <Card className="p-6">
          <p className="text-muted-foreground text-center">No vouchers found</p>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((voucher) => (
                <TableRow key={voucher.id}>
                  <TableCell className="font-medium">{voucher.code}</TableCell>
                  <TableCell>{voucher.name}</TableCell>
                  <TableCell>{voucher.discount_type === 'percentage' ? `${voucher.discount_value}%` : `Rp ${voucher.discount_value.toLocaleString()}`}</TableCell>
                  <TableCell>{voucher.usage_count} / {voucher.usage_limit || '∞'}</TableCell>
                  <TableCell>
                    <Badge className={voucher.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {voucher.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
