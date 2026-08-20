import { ProductService } from '@/lib/services/product.service';
import { notFound } from 'next/navigation';
import { ProductForm } from '@/components/domain/product/product-form';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await ProductService.getById(id);
  if (!product) {
    notFound();
  }

  const [categories, suppliers] = await Promise.all([
    ProductService.getCategories(),
    ProductService.getSuppliers(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Product</h1>
        <p className="text-muted-foreground">Update product information</p>
      </div>
      <ProductForm product={product} categories={categories} suppliers={suppliers} />
    </div>
  );
}
