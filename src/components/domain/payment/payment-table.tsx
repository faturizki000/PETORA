'use client';

import { useMemo, useState } from 'react';
import { PaymentVerificationDialog } from '@/components/domain/payment/payment-verification-dialog';
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
import type { Payment } from '@/types/invoice';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  VERIFIED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  EXPIRED: 'bg-gray-100 text-gray-800',
  REFUNDED: 'bg-purple-100 text-purple-800',
};

export function PaymentTable({
  payments,
  showVerify = true,
}: {
  payments: Payment[];
  showVerify?: boolean;
}) {
  const [search, setSearch] = useState('');
  const [verifying, setVerifying] = useState<Payment | null>(null);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return payments.filter(
      (p) =>
        p.payment_method.toLowerCase().includes(term) ||
        p.payment_status.toLowerCase().includes(term) ||
        (p.reference_number || '').toLowerCase().includes(term)
    );
  }, [payments, search]);

  return (
    <div className="space-y-4">
      <div className="relative max-w-md">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search payments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8"
        />
      </div>

      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Method</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reference</TableHead>
              {showVerify && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{new Date(payment.created_at).toLocaleDateString('id-ID')}</TableCell>
                <TableCell>{payment.payment_method}</TableCell>
                <TableCell className="text-right">{formatCurrency(payment.amount)}</TableCell>
                <TableCell>
                  <Badge className={statusColors[payment.payment_status] || 'bg-gray-100 text-gray-800'}>
                    {payment.payment_status}
                  </Badge>
                </TableCell>
                <TableCell>{payment.reference_number || '-'}</TableCell>
                {showVerify && (
                  <TableCell className="text-right">
                    {payment.payment_status === 'PENDING' ? (
                      <Button size="sm" onClick={() => setVerifying(payment)}>
                        Verify
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={showVerify ? 6 : 5} className="h-20 text-center text-muted-foreground">
                  No payments found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {verifying && (
        <PaymentVerificationDialog
          payment={verifying}
          open={!!verifying}
          onOpenChange={(open) => !open && setVerifying(null)}
        />
      )}
    </div>
  );
}
