'use client';

import { useMemo, useState } from 'react';
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
import type { Invoice } from '@/types/invoice';

const statusOptions: Array<{ value: string; label: string }> = [
  { value: '', label: 'All Status' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'UNPAID', label: 'Unpaid' },
  { value: 'PARTIAL_PAYMENT', label: 'Partial Payment' },
  { value: 'PAID', label: 'Paid' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'REFUNDED', label: 'Refunded' },
];

const statusColors: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-800',
  UNPAID: 'bg-yellow-100 text-yellow-800',
  PARTIAL_PAYMENT: 'bg-orange-100 text-orange-800',
  PAID: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  REFUNDED: 'bg-purple-100 text-purple-800',
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
}

export function InvoiceTable({ invoices }: { invoices: Invoice[] }) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('');
  const router = useRouter();

  const filtered = useMemo(() => {
    return invoices.filter((invoice) => {
      const matchesSearch = invoice.invoice_number.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = status ? invoice.status === status : true;
      return matchesSearch && matchesStatus;
    });
  }, [invoices, search, status]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search invoices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="h-9 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <Button onClick={() => router.push('/dashboard/invoices/new')}>
          <Plus className="h-4 w-4 mr-2" />
          New Invoice
        </Button>
      </div>

      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Subtotal</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Paid</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{invoice.invoice_number}</p>
                    <p className="text-sm text-muted-foreground">{invoice.customer_id || 'N/A'}</p>
                  </div>
                </TableCell>
                <TableCell>{new Date(invoice.created_at).toLocaleDateString('id-ID')}</TableCell>
                <TableCell className="text-right">{formatCurrency(invoice.subtotal)}</TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(invoice.total_amount)}</TableCell>
                <TableCell className="text-right">{formatCurrency(invoice.paid_amount)}</TableCell>
                <TableCell>
                  <Badge className={statusColors[invoice.status] || 'bg-gray-100 text-gray-800'}>
                    {invoice.status.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => router.push(`/dashboard/invoices/${invoice.id}`)}>
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-20 text-center text-muted-foreground">
                  No invoices found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
