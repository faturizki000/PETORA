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
import type { PerformanceMetric } from '@/types/employee';

export function PerformanceTable() {
  const data = useMemo(() => [] as PerformanceMetric[], []);

  return (
    <div className="space-y-4">
      {data.length === 0 ? (
        <Card className="p-6">
          <p className="text-muted-foreground text-center">No performance data found</p>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee ID</TableHead>
                <TableHead>Appointments</TableHead>
                <TableHead>Services</TableHead>
                <TableHead>Sales</TableHead>
                <TableHead>Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((metric, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{metric.employee_id}</TableCell>
                  <TableCell>{metric.total_appointments}</TableCell>
                  <TableCell>{metric.total_services}</TableCell>
                  <TableCell>Rp {metric.total_sales.toLocaleString()}</TableCell>
                  <TableCell>
                    {metric.customer_rating ? (
                      <Badge className="bg-yellow-100 text-yellow-800">{metric.customer_rating}/5</Badge>
                    ) : (
                      '-'
                    )}
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
