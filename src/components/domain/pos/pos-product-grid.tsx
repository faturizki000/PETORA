'use client';

import { ProductCard } from '@/components/domain/product/product-card';
import type { Product } from '@/types/product';

export function PosProductGrid({
  products,
  selectedCategory,
  onAddItem,
}: {
  products: Product[];
  selectedCategory: string | null;
  onAddItem: (product: Product) => void;
}) {
  const filtered = selectedCategory
    ? products.filter((p) => p.category_id === selectedCategory)
    : products;

  if (filtered.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No products found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {filtered.map((product) => (
        <ProductCard key={product.id} product={product} onAdd={onAddItem} />
      ))}
    </div>
  );
}
