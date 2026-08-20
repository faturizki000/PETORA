import { createSupabaseClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Plus, ShoppingCart } from 'lucide-react';
import type { BaseEntity } from '@/types/base';

interface SupplierRef { name: string; }
interface PurchaseOrder extends BaseEntity {
  po_number: string;
  supplier_id: string | null;
  suppliers?: SupplierRef;
  status: string;
  currency: string;
  total_amount: number | null;
  paid_amount: number | null;
  created_by: string;
}

const statusColors: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-800',
  PENDING: 'bg-yellow-100 text-yellow-800',
  ORDERED: 'bg-blue-100 text-blue-800',
  RECEIVED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
}

export default async function PurchaseOrdersPage() {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase
    .from('purchase_orders')
    .select('id, po_number, supplier_id, suppliers(name), status, total_amount, paid_amount, currency, created_at, created_by')
    .order('created_at', { ascending: false })
    .range(0, 99);

  const orders = (data || []) as PurchaseOrder[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Purchase Orders</h1>
          <p className="text-muted-foreground">Kelola pesanan pembelian ke pemasok</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Purchase Order
        </Button>
      </div>

      {error ? (
        <p className="text-destructive">Failed to load purchase orders: {error.message}</p>
      ) : (
        <Card className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PO Number</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Paid</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{order.po_number}</span>
                    </div>
                  </TableCell>
                  <TableCell>{order.suppliers?.name || order.supplier_id || '-'}</TableCell>
                  <TableCell>{new Date(order.created_at).toLocaleDateString('id-ID')}</TableCell>
                  <TableCell>
                    <span className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(order.total_amount ?? 0)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(order.paid_amount ?? 0)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">View</Button>
                  </TableCell>
                </TableRow>
              ))}
              {orders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-20 text-center text-muted-foreground">
                    No purchase orders found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
