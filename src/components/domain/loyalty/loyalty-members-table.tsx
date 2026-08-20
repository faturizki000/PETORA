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
import type { LoyaltyMember } from '@/types/loyalty';

const tierColors: Record<string, string> = {
  BRONZE: 'bg-orange-100 text-orange-800',
  SILVER: 'bg-gray-100 text-gray-800',
  GOLD: 'bg-yellow-100 text-yellow-800',
  PLATINUM: 'bg-purple-100 text-purple-800',
};

export function LoyaltyMembersTable() {
  const [search, setSearch] = useState('');
  const router = useRouter();

  const data = useMemo(() => [] as LoyaltyMember[], []);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button onClick={() => router.push('/dashboard/loyalty/members/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Member
        </Button>
      </div>
      {data.length === 0 ? (
        <Card className="p-6">
          <p className="text-muted-foreground text-center">No loyalty members found</p>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer ID</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Total Points</TableHead>
                <TableHead>Available Points</TableHead>
                <TableHead>Total Spending</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>{member.customer_id}</TableCell>
                  <TableCell>
                    <Badge className={tierColors['BRONZE'] || 'bg-gray-100 text-gray-800'}>BRONZE</Badge>
                  </TableCell>
                  <TableCell>{member.total_points}</TableCell>
                  <TableCell>{member.available_points}</TableCell>
                  <TableCell>Rp {member.total_spending.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
