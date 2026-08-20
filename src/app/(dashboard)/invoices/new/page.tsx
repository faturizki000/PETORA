import { Suspense } from 'react';
import { InvoiceForm } from '@/components/domain/invoice/invoice-form';
import { CustomerService } from '@/lib/services/customer.service';
import { ProductService } from '@/lib/services/product.service';

export default async function NewInvoicePage() {
  const [customerResult, productResult] = await Promise.all([
    CustomerService.list({ limit: 100 }),
    ProductService.list({ limit: 100 }),
  ]);

  const customers = customerResult.data.map((c) => ({ id: c.id, name: c.name, phone: c.phone }));
  const products = productResult.data.map((p) => ({ id: p.id, name: p.name, sku: p.sku, selling_price: p.selling_price }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">New Invoice</h1>
        <p className="text-muted-foreground">Create a new invoice</p>
      </div>
      <InvoiceForm customers={customers} products={products} />
    </div>
  );
}
