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
import type { Referral } from '@/types/marketing';

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  COMPLETED: 'bg-green-100 text-green-800',
  EXPIRED: 'bg-gray-100 text-gray-800',
};

export function ReferralTable() {
  const [search, setSearch] = useState('');
  const router = useRouter();

  const data = useMemo(() => [] as Referral[], []);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search referrals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button onClick={() => router.push('/dashboard/marketing/referrals/new')}>
          <Plus className="h-4 w-4 mr-2" />
          New Referral
        </Button>
      </div>
      {data.length === 0 ? (
        <Card className="p-6">
          <p className="text-muted-foreground text-center">No referrals found</p>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Referrer</TableHead>
                <TableHead>Referred</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reward</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((referral) => (
                <TableRow key={referral.id}>
                  <TableCell className="font-medium">{referral.referrer_id}</TableCell>
                  <TableCell>{referral.referred_id}</TableCell>
                  <TableCell>{referral.code}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[referral.status] || 'bg-gray-100 text-gray-800'}>{referral.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {referral.reward_points ? `${referral.reward_points} pts` : referral.reward_amount ? `Rp ${referral.reward_amount.toLocaleString()}` : '-'}
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
