'use client';

import { Button } from '@/components/ui/button';
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
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { SubscriptionPlan } from '@/types/subscription';

export function PlanTable({ plans }: { plans: SubscriptionPlan[] }) {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => router.push('/dashboard/subscriptions/plans/new')}>
          <Plus className="h-4 w-4 mr-2" />
          New Plan
        </Button>
      </div>
      {plans.length === 0 ? (
        <Card className="p-6">
          <p className="text-muted-foreground text-center">No plans found</p>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Billing Cycle</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell className="font-medium">{plan.name}</TableCell>
                  <TableCell>Rp {plan.price.toLocaleString()}</TableCell>
                  <TableCell>{plan.billing_cycle}</TableCell>
                  <TableCell>
                    <Badge className={plan.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {plan.is_active ? 'Active' : 'Inactive'}
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
