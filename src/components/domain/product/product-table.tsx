'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteProductAction } from '@/app/actions/product.actions';
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
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react';
import type { Product } from '@/types/product';

export function ProductTable({
  products,
  categories = [],
}: {
  products: Product[];
  categories?: Array<{ id: string; name: string }>;
}) {
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [lowStock, setLowStock] = useState(false);
  const router = useRouter();

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.sku.toLowerCase().includes(search.toLowerCase()) ||
        (product.barcode || '').toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryId ? product.category_id === categoryId : true;
      const matchesLowStock = lowStock ? product.stock_quantity <= product.reorder_point : true;
      return matchesSearch && matchesCategory && matchesLowStock;
    });
  }, [products, search, categoryId, lowStock]);

  async function handleDelete(product: Product) {
    if (!confirm(`Delete ${product.name}?`)) return;
    const result = await deleteProductAction(product.id);
    if (result.success) {
      router.refresh();
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="h-9 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={lowStock}
            onChange={(e) => setLowStock(e.target.checked)}
            className="rounded border-border"
          />
          Low stock only
        </label>
        <Button onClick={() => router.push('/dashboard/products/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Prices</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {product.photo_url ? (
                      <img src={product.photo_url} alt={product.name} className="h-10 w-10 rounded object-cover" />
                    ) : (
                      <div className="h-10 w-10 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">
                        No photo
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.description?.slice(0, 40)}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span>{product.stock_quantity}</span>
                    {product.stock_quantity <= product.reorder_point && (
                      <Badge variant="destructive">Low</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="text-sm">
                    <p>Buy: {product.purchase_price?.toLocaleString()}</p>
                    <p>Sell: {product.selling_price?.toLocaleString()}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={product.is_active ? 'default' : 'secondary'}>
                    {product.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="sm" onClick={() => router.push(`/dashboard/products/${product.id}`)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => router.push(`/dashboard/products/${product.id}/edit`)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(product)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-20 text-center text-muted-foreground">
                  No products found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
