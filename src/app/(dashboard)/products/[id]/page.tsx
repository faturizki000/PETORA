import { ProductService } from '@/lib/services/product.service';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { Tag, Weight, CalendarDays, PackageCheck } from 'lucide-react';

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await ProductService.getById(id);
  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-muted-foreground font-mono">{product.sku}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/products/${id}/edit`} className={buttonVariants({ variant: 'outline' })}>
            Edit
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1 space-y-6">
          <Card className="p-6">
            {product.photo_url ? (
              <img src={product.photo_url} alt={product.name} className="w-full rounded" />
            ) : (
              <div className="w-full aspect-square rounded bg-muted flex items-center justify-center">
                <PackageCheck className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Status</h3>
            <div className="space-y-2 text-sm">
              <div><span className="text-muted-foreground">Active:</span> {product.is_active ? 'Yes' : 'No'}</div>
              <div><span className="text-muted-foreground">Status:</span> {product.status}</div>
              <div><span className="text-muted-foreground">Serialized:</span> {product.is_serialized ? 'Yes' : 'No'}</div>
              <div><span className="text-muted-foreground">Batch tracked:</span> {product.is_batch_tracked ? 'Yes' : 'No'}</div>
            </div>
          </Card>
        </div>
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Overview</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-muted-foreground">Barcode:</span> {product.barcode || '-'}</div>
              <div><span className="text-muted-foreground">Unit:</span> {product.unit || '-'}</div>
              <div className="flex items-center gap-2"><Tag className="h-4 w-4 text-muted-foreground" /><span>{product.category_id || 'No category'}</span></div>
              <div><span className="text-muted-foreground">Supplier:</span> {product.supplier_id || '-'}</div>
              <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-muted-foreground" /><span>Expiry: {product.expiry_date || '-'}</span></div>
              <div><span className="text-muted-foreground">Batch:</span> {product.batch_number || '-'}</div>
              <div className="flex items-center gap-2"><Weight className="h-4 w-4 text-muted-foreground" /><span>Weight: {product.weight_kg ?? '-'} kg</span></div>
              <div><span className="text-muted-foreground">Dimensions:</span> {product.dimensions ? JSON.stringify(product.dimensions) : '-'}</div>
            </div>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Pricing & Stock</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-muted-foreground">Purchase Price:</span> {product.purchase_price?.toLocaleString()}</div>
              <div><span className="text-muted-foreground">Selling Price:</span> {product.selling_price?.toLocaleString()}</div>
              <div><span className="text-muted-foreground">Wholesale Price:</span> {product.wholesale_price?.toLocaleString() || '-'}</div>
              <div><span className="text-muted-foreground">Cost Price:</span> {product.cost_price?.toLocaleString() || '-'}</div>
              <div><span className="text-muted-foreground">Stock Quantity:</span> {product.stock_quantity}</div>
              <div><span className="text-muted-foreground">Minimum:</span> {product.stock_minimum}</div>
              <div><span className="text-muted-foreground">Maximum:</span> {product.stock_maximum}</div>
              <div><span className="text-muted-foreground">Reorder Point:</span> {product.reorder_point}</div>
            </div>
          </Card>
          {product.description && (
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Description</h3>
              <p className="text-sm text-muted-foreground">{product.description}</p>
            </Card>
          )}
          {product.custom_fields && Object.keys(product.custom_fields).length > 0 && (
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Custom Fields</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {Object.entries(product.custom_fields).map(([key, value]) => (
                  <div key={key}><span className="text-muted-foreground">{key}:</span> {String(value)}</div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
