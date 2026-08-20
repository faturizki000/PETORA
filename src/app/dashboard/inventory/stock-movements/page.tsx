import { createSupabaseClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Package, ArrowUpFromLine, ArrowDownToLine, AlertCircle } from 'lucide-react';
import type { BaseEntity } from '@/types/base';

interface StockMovement extends BaseEntity {
  product_id: string | null;
  products?: { name?: string };
  type: 'IN' | 'OUT' | 'ADJUSTMENT' | string;
  quantity: number;
  reference: string | null;
  notes: string | null;
  user_id: string | null;
}

const typeIcons: Record<string, React.ElementType> = {
  IN: ArrowUpFromLine,
  OUT: ArrowDownToLine,
  ADJUSTMENT: AlertCircle,
};

const typeColors: Record<string, string> = {
  IN: 'bg-green-100 text-green-800',
  OUT: 'bg-red-100 text-red-800',
  ADJUSTMENT: 'bg-blue-100 text-blue-800',
};

export default async function StockMovementsPage() {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase
    .from('stock_movements')
    .select('id, product_id, products(name), type, quantity, reference, notes, created_at, updated_at, user_id, created_by')
    .order('created_at', { ascending: false })
    .range(0, 99);

  const movements = (data || []) as StockMovement[];
  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Stock Movements</h1>
        <p className="text-destructive">Failed to load stock movements: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Stock Movements</h1>
        <p className="text-muted-foreground">Riwayat pergerakan stok</p>
      </div>

      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Product</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movements.map((movement) => {
              const Icon = typeIcons[movement.type] || Package;
              return (
                <TableRow key={movement.id}>
                  <TableCell>{new Date(movement.created_at).toLocaleDateString('id-ID')}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1">
                      <Icon className="h-4 w-4" />
                      <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${typeColors[movement.type] || 'bg-gray-100 text-gray-800'}`}>
                        {movement.type}
                      </span>
                    </span>
                  </TableCell>
                  <TableCell>{movement.products?.name || movement.product_id || '-'}</TableCell>
                  <TableCell className="text-right">{movement.quantity}</TableCell>
                  <TableCell>{movement.reference || '-'}</TableCell>
                  <TableCell>{movement.notes || '-'}</TableCell>
                </TableRow>
              );
            })}
            {movements.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-20 text-center text-muted-foreground">
                  No stock movements found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
