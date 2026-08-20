import { ProductService } from '@/lib/services/product.service';
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
import { PackageCheck, AlertTriangle, CalendarDays, TrendingUp } from 'lucide-react';
import type { Product } from '@/types/product';

function daysUntil(date: string | null): number | null {
  if (!date) return null;
  const diff = new Date(date).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default async function InventoryDashboardPage() {
  const [totalResult, lowStock, expiringSoon] = await Promise.all([
    ProductService.list({ limit: 1 }),
    ProductService.getLowStock(),
    ProductService.getExpiringSoon(30),
  ]);

  const totalProducts = totalResult.total;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Inventory</h1>
        <p className="text-muted-foreground">Monitor stok dan persediaan barang</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4 flex items-center gap-3">
          <PackageCheck className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Total Products</p>
            <p className="text-2xl font-semibold">{totalProducts}</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <div>
            <p className="text-sm text-muted-foreground">Low Stock</p>
            <p className="text-2xl font-semibold">{lowStock.length}</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3">
          <CalendarDays className="h-5 w-5 text-warning" />
          <div>
            <p className="text-sm text-muted-foreground">Expiring Soon (30d)</p>
            <p className="text-2xl font-semibold">{expiringSoon.length}</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3">
          <TrendingUp className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">In Stock</p>
            <p className="text-2xl font-semibold">
              {totalProducts - lowStock.length}
            </p>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Low Stock Products</h3>
          <Button variant="outline" size="sm" asChild>
            <a href="/dashboard/inventory/stock-movements">View Stock Movements</a>
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead className="text-right">Current Stock</TableHead>
              <TableHead className="text-right">Reorder Point</TableHead>
              <TableHead className="text-right">Needed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lowStock.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                <TableCell className="text-right">{product.stock_quantity}</TableCell>
                <TableCell className="text-right">{product.reorder_point}</TableCell>
                <TableCell className="text-right text-destructive">
                  +{product.reorder_quantity - product.stock_quantity}
                </TableCell>
              </TableRow>
            ))}
            {lowStock.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-16 text-center text-muted-foreground">
                  No low stock products
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Expiring Soon</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Batch</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead className="text-right">Days Left</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expiringSoon.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.batch_number || '-'}</TableCell>
                <TableCell>{product.expiry_date ? new Date(product.expiry_date).toLocaleDateString('id-ID') : '-'}</TableCell>
                <TableCell className="text-right">
                  {product.expiry_date ? daysUntil(product.expiry_date) : '-'}
                </TableCell>
              </TableRow>
            ))}
            {expiringSoon.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="h-16 text-center text-muted-foreground">
                  No products expiring soon
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
