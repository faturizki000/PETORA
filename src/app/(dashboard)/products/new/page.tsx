import { ProductService } from '@/lib/services/product.service';
import { ProductForm } from '@/components/domain/product/product-form';

export default async function NewProductPage() {
  const [categories, suppliers] = await Promise.all([
    ProductService.getCategories(),
    ProductService.getSuppliers(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">New Product</h1>
        <p className="text-muted-foreground">Create a new product</p>
      </div>
      <ProductForm categories={categories} suppliers={suppliers} />
    </div>
  );
}
