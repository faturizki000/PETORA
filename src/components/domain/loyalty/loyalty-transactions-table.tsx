'use client';

import { useState, useMemo } from 'react';
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
import { Search } from 'lucide-react';
import type { LoyaltyTransaction } from '@/types/loyalty';

const typeColors: Record<string, string> = {
  EARN: 'bg-green-100 text-green-800',
  REDEEM: 'bg-red-100 text-red-800',
  ADJUSTMENT: 'bg-yellow-100 text-yellow-800',
  REFERRAL_BONUS: 'bg-blue-100 text-blue-800',
  EXPIRED: 'bg-gray-100 text-gray-800',
};

export function LoyaltyTransactionsTable() {
  const [search, setSearch] = useState('');

  const data = useMemo(() => [] as LoyaltyTransaction[], []);

  return (
    <div className="space-y-4">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search transactions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8"
        />
      </div>
      {data.length === 0 ? (
        <Card className="p-6">
          <p className="text-muted-foreground text-center">No transactions found</p>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>
                    <Badge className={typeColors[tx.transaction_type] || 'bg-gray-100 text-gray-800'}>{tx.transaction_type}</Badge>
                  </TableCell>
                  <TableCell>{tx.points > 0 ? '+' : ''}{tx.points}</TableCell>
                  <TableCell>{tx.description}</TableCell>
                  <TableCell>{new Date(tx.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
