'use client';

import { useMemo } from 'react';
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
import type { CommissionRule } from '@/types/employee';

export function CommissionTable() {
  const data = useMemo(() => [] as CommissionRule[], []);

  return (
    <div className="space-y-4">
      {data.length === 0 ? (
        <Card className="p-6">
          <p className="text-muted-foreground text-center">No commission rules found</p>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell className="font-medium">{rule.name}</TableCell>
                  <TableCell>{rule.commission_type}</TableCell>
                  <TableCell>{rule.commission_type === 'PERCENTAGE' ? `${rule.commission_value}%` : `Rp ${rule.commission_value.toLocaleString()}`}</TableCell>
                  <TableCell>
                    <Badge className={rule.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {rule.is_active ? 'Active' : 'Inactive'}
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
