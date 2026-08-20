import { ProductService } from '@/lib/services/product.service';
import { ProductTable } from '@/components/domain/product/product-table';

export default async function ProductsPage() {
  const result = await ProductService.list({ limit: 50 });
  const categories = await ProductService.getCategories();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Products</h1>
        <p className="text-muted-foreground">Kelola data produk dan barang</p>
      </div>
      <ProductTable products={result.data} categories={categories} />
    </div>
  );
}
