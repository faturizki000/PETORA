'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { createProductSchema } from '@/schemas/product';
import { createProductAction, updateProductAction } from '@/app/actions/product.actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import type { Product } from '@/types/product';

type FormValues = z.input<typeof createProductSchema>;

const unitOptions = [
  { value: 'pcs', label: 'Pieces (pcs)' },
  { value: 'kg', label: 'Kilogram (kg)' },
  { value: 'gram', label: 'Gram (g)' },
  { value: 'liter', label: 'Liter (L)' },
  { value: 'bottle', label: 'Bottle' },
  { value: 'pack', label: 'Pack' },
];

export function ProductForm({
  product,
  categories = [],
  suppliers = [],
  onSuccess,
}: {
  product?: Product | null;
  categories?: Array<{ id: string; name: string }>;
  suppliers?: Array<{ id: string; name: string }>;
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      sku: product?.sku || '',
      name: product?.name || '',
      category_id: product?.category_id || '',
      supplier_id: product?.supplier_id || '',
      barcode: product?.barcode || '',
      description: product?.description || '',
      purchase_price: product?.purchase_price ?? 0,
      selling_price: product?.selling_price ?? 0,
      wholesale_price: product?.wholesale_price ?? undefined,
      stock_quantity: product?.stock_quantity ?? 0,
      stock_minimum: product?.stock_minimum ?? 0,
      stock_maximum: product?.stock_maximum ?? 0,
      reorder_point: product?.reorder_point ?? 0,
      reorder_quantity: product?.reorder_quantity ?? 0,
      photo_url: product?.photo_url || '',
      photo_urls: product?.photo_urls || [],
      expiry_date: product?.expiry_date || '',
      batch_number: product?.batch_number || '',
      unit: product?.unit || '',
      weight_kg: product?.weight_kg ?? undefined,
      dimensions: product?.dimensions || {},
      is_serialized: product?.is_serialized ?? false,
      is_batch_tracked: product?.is_batch_tracked ?? false,
      custom_fields: product?.custom_fields || {},
    },
  });

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    try {
      const result = product
        ? await updateProductAction(product.id, data)
        : await createProductAction(data);
      if (result.success) {
        toast.success(product ? 'Product updated successfully' : 'Product created successfully');
        onSuccess?.();
        if (product) {
          router.push(`/dashboard/products/${product.id}`);
        } else {
          router.push('/dashboard/products');
        }
      } else {
        toast.error(result.message || 'An error occurred');
      }
    } catch {
      toast.error('An error occurred while saving the product');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sku">SKU *</Label>
            <Input id="sku" {...form.register('sku')} />
            {form.formState.errors.sku && (
              <p className="text-sm text-destructive">{form.formState.errors.sku.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input id="name" {...form.register('name')} />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="category_id">Category</Label>
            <select id="category_id" {...form.register('category_id')} className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm">
              <option value="">No category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="supplier_id">Supplier</Label>
            <select id="supplier_id" {...form.register('supplier_id')} className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm">
              <option value="">No supplier</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="barcode">Barcode</Label>
            <Input id="barcode" {...form.register('barcode')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="unit">Unit</Label>
            <select id="unit" {...form.register('unit')} className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm">
              <option value="">Select unit</option>
              {unitOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="purchase_price">Purchase Price *</Label>
            <Input id="purchase_price" type="number" step="0.01" {...form.register('purchase_price', { valueAsNumber: true })} />
            {form.formState.errors.purchase_price && (
              <p className="text-sm text-destructive">{form.formState.errors.purchase_price.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="selling_price">Selling Price *</Label>
            <Input id="selling_price" type="number" step="0.01" {...form.register('selling_price', { valueAsNumber: true })} />
            {form.formState.errors.selling_price && (
              <p className="text-sm text-destructive">{form.formState.errors.selling_price.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="wholesale_price">Wholesale Price</Label>
            <Input id="wholesale_price" type="number" step="0.01" {...form.register('wholesale_price', { valueAsNumber: true })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stock_quantity">Stock Quantity</Label>
            <Input id="stock_quantity" type="number" {...form.register('stock_quantity', { valueAsNumber: true })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stock_minimum">Minimum Stock</Label>
            <Input id="stock_minimum" type="number" {...form.register('stock_minimum', { valueAsNumber: true })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stock_maximum">Maximum Stock</Label>
            <Input id="stock_maximum" type="number" {...form.register('stock_maximum', { valueAsNumber: true })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reorder_point">Reorder Point</Label>
            <Input id="reorder_point" type="number" {...form.register('reorder_point', { valueAsNumber: true })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reorder_quantity">Reorder Quantity</Label>
            <Input id="reorder_quantity" type="number" {...form.register('reorder_quantity', { valueAsNumber: true })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight_kg">Weight (kg)</Label>
            <Input id="weight_kg" type="number" step="0.001" {...form.register('weight_kg', { valueAsNumber: true })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="photo_url">Photo URL</Label>
            <Input id="photo_url" {...form.register('photo_url')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expiry_date">Expiry Date</Label>
            <Input id="expiry_date" type="date" {...form.register('expiry_date')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="batch_number">Batch Number</Label>
            <Input id="batch_number" {...form.register('batch_number')} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" {...form.register('description')} />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <input type="checkbox" id="is_serialized" {...form.register('is_serialized')} className="rounded border-border" />
            <Label htmlFor="is_serialized">Serialized (track by serial number)</Label>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="is_batch_tracked" {...form.register('is_batch_tracked')} className="rounded border-border" />
            <Label htmlFor="is_batch_tracked">Batch tracked</Label>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : product ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
