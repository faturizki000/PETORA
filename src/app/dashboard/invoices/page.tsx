import { InvoiceService } from '@/lib/services/invoice.service';
import { InvoiceTable } from '@/components/domain/invoice/invoice-table';

export default async function InvoicesPage() {
  const result = await InvoiceService.list({ limit: 50 });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Invoices</h1>
        <p className="text-muted-foreground">Kelola faktur penjualan</p>
      </div>
      <InvoiceTable invoices={result.data} />
    </div>
  );
}
