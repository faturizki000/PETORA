'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Receipt } from 'lucide-react';
import type { Invoice } from '@/types/invoice';

export function InvoiceCard({ invoice }: { invoice: Invoice }) {
  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
  }

  const statusColors: Record<string, string> = {
    DRAFT: 'bg-gray-100 text-gray-800',
    UNPAID: 'bg-yellow-100 text-yellow-800',
    PARTIAL_PAYMENT: 'bg-orange-100 text-orange-800',
    PAID: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
    REFUNDED: 'bg-purple-100 text-purple-800',
  };

  return (
    <Card className="p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
            <Receipt className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold">{invoice.invoice_number}</h3>
            <p className="text-sm text-muted-foreground">
              {new Date(invoice.created_at).toLocaleDateString('id-ID')}
            </p>
          </div>
        </div>
        <Badge className={statusColors[invoice.status] || 'bg-gray-100 text-gray-800'}>
          {invoice.status.replace('_', ' ')}
        </Badge>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div><span className="text-muted-foreground">Total:</span> {formatCurrency(invoice.total_amount)}</div>
        <div><span className="text-muted-foreground">Paid:</span> {formatCurrency(invoice.paid_amount)}</div>
      </div>
    </Card>
  );
}
