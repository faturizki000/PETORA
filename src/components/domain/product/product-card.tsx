'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import type { Product } from '@/types/product';

export function ProductCard({ product, onAdd }: { product: Product; onAdd?: (product: Product) => void }) {
  const isLowStock = product.stock_quantity <= product.reorder_point;

  return (
    <Card className="p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {product.photo_url ? (
            <img src={product.photo_url} alt={product.name} className="h-12 w-12 rounded object-cover" />
          ) : (
            <div className="h-12 w-12 rounded bg-muted flex items-center justify-center">
              <ShoppingCart className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
          <div>
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-sm text-muted-foreground font-mono">{product.sku}</p>
          </div>
        </div>
        {isLowStock && <Badge variant="destructive">Low stock</Badge>}
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-muted-foreground">Buy:</span> {product.purchase_price?.toLocaleString()}
        </div>
        <div>
          <span className="text-muted-foreground">Sell:</span> {product.selling_price?.toLocaleString()}
        </div>
        <div>
          <span className="text-muted-foreground">Stock:</span> {product.stock_quantity} {product.unit}
        </div>
        <div>
          <span className="text-muted-foreground">Status:</span> {product.is_active ? 'Active' : 'Inactive'}
        </div>
      </div>
      {onAdd && (
        <button
          className="mt-2 text-xs font-medium text-primary hover:underline"
          onClick={() => onAdd(product)}
        >
          Add to cart
        </button>
      )}
    </Card>
  );
}
