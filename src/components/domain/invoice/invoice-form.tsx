'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray, useWatch, Controller } from 'react-hook-form';
import type { Control, UseFormSetValue } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { createInvoiceSchema, invoiceItemSchema } from '@/schemas/invoice';
import { createInvoiceAction } from '@/app/actions/invoice.actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Trash2, Plus } from 'lucide-react';

type ProductOption = { id: string; name: string; sku: string; selling_price: number };
type CustomerOption = { id: string; name: string; phone: string | null };

const lineItemSchema = invoiceItemSchema.extend({
  description: z.string().min(1, 'Description is required'),
});
type LineItem = z.input<typeof lineItemSchema>;

type FormValues = z.input<typeof invoiceSchema>;

const invoiceSchema = createInvoiceSchema
  .omit({ discount_type: true, promotion_id: true, gift_card_id: true, voucher_code: true, loyalty_points_to_redeem: true })
  .extend({
    invoice_type: z.enum(['POS', 'CLINICAL', 'PET_HOTEL', 'GROOMING', 'MIXED', 'SUBSCRIPTION', 'TELEMEDICINE']).default('POS'),
    items: z.array(lineItemSchema).min(1, 'Add at least one item'),
  });

function LineItemInput({
  index,
  products,
  control,
  setValue,
  remove,
}: {
  index: number;
  products: ProductOption[];
  control: Control<FormValues>;
  setValue: UseFormSetValue<FormValues>;
  remove: (index: number) => void;
}) {
  return (
    <div className="grid grid-cols-12 gap-2 items-end">
      <div className="col-span-4 space-y-1">
        <Label>Product</Label>
        <Controller
          control={control}
          name={`items.${index}.product_id`}
          render={({ field }) => (
            <select
              name={field.name}
              value={field.value ?? ''}
              onBlur={field.onBlur}
              ref={field.ref}
              className="h-9 w-full rounded-lg border border-input bg-transparent px-2 text-sm"
              onChange={(e) => {
                const product = products.find((p) => p.id === e.target.value);
                if (product) {
                  field.onChange(e.target.value);
                  setValue(`items.${index}.unit_price`, product.selling_price, { shouldValidate: true });
                  setValue(`items.${index}.description`, product.name, { shouldValidate: true });
                }
              }}
            >
              <option value="">Select product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.sku})
                </option>
              ))}
            </select>
          )}
        />
      </div>
      <div className="col-span-3 space-y-1">
        <Label>Description</Label>
        <Controller
          control={control}
          name={`items.${index}.description`}
          render={({ field }) => <Input {...field} />}
        />
      </div>
      <div className="col-span-1 space-y-1">
        <Label>Qty</Label>
        <Controller
          control={control}
          name={`items.${index}.quantity`}
          render={({ field }) => <Input type="number" min={1} {...field} />}
        />
      </div>
      <div className="col-span-2 space-y-1">
        <Label>Unit Price</Label>
        <Controller
          control={control}
          name={`items.${index}.unit_price`}
          render={({ field }) => <Input type="number" min={0} {...field} />}
        />
      </div>
      <div className="col-span-1 space-y-1">
        <Label>Tax</Label>
        <Controller
          control={control}
          name={`items.${index}.tax_amount`}
          render={({ field }) => <Input type="number" min={0} {...field} />}
        />
      </div>
      <div className="col-span-1 space-y-1">
        <Button variant="ghost" size="sm" onClick={() => remove(index)} className="mb-1">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function InvoiceForm({
  customers = [],
  products = [],
  onSuccess,
}: {
  customers?: CustomerOption[];
  products?: ProductOption[];
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      invoice_type: 'POS',
      customer_id: '',
      notes: '',
      due_date: '',
      discount_amount: 0,
      tax_amount: 0,
      shipping_amount: 0,
      items: [{ description: '', quantity: 1, unit_price: 0, discount_amount: 0, tax_amount: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  function addItem() {
     append({ item_type: 'product', description: '', quantity: 1, unit_price: 0, discount_amount: 0, tax_amount: 0 });
  }

  const watchedItems = useWatch({ control: form.control, name: 'items' }) as LineItem[];
  const subtotal = watchedItems.reduce(
    (sum, item) => sum + (item.quantity || 0) * (item.unit_price || 0) - (item.discount_amount || 0),
    0
  );
  const discount = useWatch({ control: form.control, name: 'discount_amount' }) || 0;
  const tax = useWatch({ control: form.control, name: 'tax_amount' }) || 0;
  const shipping = useWatch({ control: form.control, name: 'shipping_amount' }) || 0;
  const total = subtotal + tax + shipping - discount;

  async function onSubmit(data: FormValues) {
    const input = {
      invoice_type: data.invoice_type,
      customer_id: data.customer_id || null,
      items: data.items.map((item) => ({
        item_type: 'product',
        product_id: item.product_id || null,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        discount_amount: item.discount_amount || 0,
        tax_amount: item.tax_amount || 0,
        batch_number: item.batch_number || undefined,
        expiry_date: item.expiry_date || undefined,
      })),
      discount_amount: discount,
      discount_type: 'fixed' as const,
      tax_amount: tax,
      shipping_amount: shipping,
      promotion_id: null,
      gift_card_id: null,
      voucher_code: undefined,
      loyalty_points_to_redeem: 0,
      notes: data.notes || undefined,
      due_date: data.due_date || undefined,
    };

    setIsSubmitting(true);
    try {
      const result = await createInvoiceAction(input);
      if (result.success) {
        toast.success('Invoice created successfully');
        onSuccess?.();
        router.push(`/dashboard/invoices/${result.data!.id}`);
      } else {
        toast.error(result.message || 'Failed to create invoice');
      }
    } catch {
      toast.error('An error occurred while creating the invoice');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="invoice_type">Invoice Type</Label>
            <select id="invoice_type" {...form.register('invoice_type')} className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm">
              <option value="POS">POS</option>
              <option value="CLINICAL">Clinical</option>
              <option value="PET_HOTEL">Pet Hotel</option>
              <option value="GROOMING">Grooming</option>
              <option value="MIXED">Mixed</option>
              <option value="SUBSCRIPTION">Subscription</option>
              <option value="TELEMEDICINE">Telemedicine</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="customer_id">Customer</Label>
            <select id="customer_id" {...form.register('customer_id')} className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm">
              <option value="">Walk-in customer</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.name} ({c.phone || '-'})</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="due_date">Due Date</Label>
            <Input id="due_date" type="date" {...form.register('due_date')} />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Line Items</h3>
            <Button type="button" variant="outline" size="sm" onClick={addItem}>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
          <div className="space-y-3">
            {fields.map((_, index) => (
              <LineItemInput
                key={fields[index]?.id || index}
                index={index}
                products={products}
                control={form.control}
                setValue={form.setValue}
                remove={remove}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" {...form.register('notes')} />
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-muted-foreground">Subtotal</div>
              <div className="text-right">{subtotal.toLocaleString()}</div>
              <div className="text-muted-foreground">Discount</div>
              <div className="text-right">
                <Input type="number" min={0} {...form.register('discount_amount', { valueAsNumber: true })} />
              </div>
              <div className="text-muted-foreground">Tax</div>
              <div className="text-right">
                <Input type="number" min={0} {...form.register('tax_amount', { valueAsNumber: true })} />
              </div>
              <div className="text-muted-foreground">Shipping</div>
              <div className="text-right">
                <Input type="number" min={0} {...form.register('shipping_amount', { valueAsNumber: true })} />
              </div>
              <div className="font-semibold">Total</div>
              <div className="text-right font-semibold">{total.toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Create Invoice'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
