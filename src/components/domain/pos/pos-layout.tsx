'use client';

import { useState } from 'react';
import { usePOSStore } from '@/stores/pos-store';
import { PosProductGrid } from '@/components/domain/pos/pos-product-grid';
import { PosCategoryTabs } from '@/components/domain/pos/pos-category-tabs';
import { PosCart } from '@/components/domain/pos/pos-cart';
import { PosPaymentModal } from '@/components/domain/pos/pos-payment-modal';
import type { Product, Category } from '@/types/product';

export function PosLayout({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const addItem = usePOSStore((s) => s.addItem);

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] gap-4">
      <PosCategoryTabs
        categories={categories.map((c) => ({ id: c.id, name: c.name, photo_url: c.photo_url }))}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 overflow-hidden">
        <div className="lg:col-span-2 overflow-y-auto">
          <PosProductGrid
            products={products}
            selectedCategory={selectedCategory}
             onAddItem={(product) => addItem(product, 1)}
          />
        </div>
        <div className="lg:col-span-1">
          <PosCart onCheckout={() => setPaymentOpen(true)} />
        </div>
      </div>

      <PosPaymentModal open={paymentOpen} onOpenChange={setPaymentOpen} />
    </div>
  );
}
