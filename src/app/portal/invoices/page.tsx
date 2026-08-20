'use client';

import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InvoiceService } from '@/lib/services/invoice.service';
import type { Invoice } from '@/types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Receipt, Download } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  DRAFT: 'outline',
  UNPAID: 'destructive',
  PARTIAL_PAYMENT: 'secondary',
  PAID: 'default',
  CANCELLED: 'destructive',
  REFUNDED: 'outline',
};

export default function InvoicesPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['portal', 'invoices'],
    queryFn: () => InvoiceService.list({}),
  });

  if (isLoading) {
    return (
      <div className="p-4 space-y-3">
        <h1 className="text-xl font-bold">Tagihan</h1>
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-4 h-20 animate-pulse bg-muted" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <p className="text-destructive">Gagal memuat data tagihan.</p>
      </div>
    );
  }

  const invoices = data?.data ?? [];

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Riwayat Tagihan</h1>

      {invoices.length === 0 ? (
        <Card className="p-8 text-center">
          <Receipt className="size-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Belum ada tagihan</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {invoices.map((inv: Invoice) => (
            <Card key={inv.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-sm truncate">{inv.invoice_number}</p>
                    <Badge variant={statusVariant[inv.status] || 'outline'} className="text-[10px]">
                      {inv.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(inv.created_at), 'dd MMMM yyyy', { locale: id })}
                  </p>
                </div>
                <div className="text-right flex items-center gap-3">
                  <div>
                    <p className="font-semibold">
                      Rp {inv.total_amount.toLocaleString('id-ID')}
                    </p>
                    {inv.status === 'PARTIAL_PAYMENT' && (
                      <p className="text-xs text-muted-foreground">
                        Dibayar: Rp {inv.paid_amount.toLocaleString('id-ID')}
                      </p>
                    )}
                  </div>
                  <Link href={`/(portal)/invoices/${inv.id}`}>
                    <Button variant="ghost" size="icon" className="size-8">
                      <Download className="size-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
