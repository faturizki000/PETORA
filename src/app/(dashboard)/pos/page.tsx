'use client';

import { useEffect, useState } from 'react';
import { createSupabaseClient } from '@/lib/supabase/client';
import { PosLayout } from './components/pos-layout';
import { RefreshCw } from 'lucide-react';
import type { Product, Category } from '@/types/product';

export default function PosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const supabase = createSupabaseClient();
      const [{ data: productsData }, { data: categoriesData }] = await Promise.all([
        supabase
          .from('products')
          .select('*')
          .eq('status', 'ACTIVE')
          .is('deleted_at', null)
          .order('name'),
        supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('name'),
      ]);
      setProducts((productsData || []) as Product[]);
      setCategories((categoriesData || []) as Category[]);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Point of Sale</h1>
        <p className="text-muted-foreground">Sell products quickly</p>
      </div>
      <PosLayout products={products} categories={categories} />
    </div>
  );
}
