import { notFound } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { InvoiceService } from '@/lib/services/invoice.service';
import { PaymentService } from '@/lib/services/payment.service';
import { cancelInvoiceAction, refundInvoiceAction } from '@/app/actions/invoice.actions';
import { PaymentForm } from '@/components/domain/payment/payment-form';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@/components/ui/table';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
}

async function cancelInvoice(formData: FormData) {
  'use server';
  const invoiceId = formData.get('invoice_id') as string;
  await cancelInvoiceAction(invoiceId);
  revalidatePath('/dashboard/invoices');
  revalidatePath(`/dashboard/invoices/${invoiceId}`);
}

async function refundInvoice(formData: FormData) {
  'use server';
  const invoiceId = formData.get('invoice_id') as string;
  const amount = Number(formData.get('amount'));
  await refundInvoiceAction(invoiceId, amount);
  revalidatePath('/dashboard/invoices');
  revalidatePath(`/dashboard/invoices/${invoiceId}`);
}

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const invoice = await InvoiceService.getById(id);
  if (!invoice) {
    notFound();
  }

  const items = await InvoiceService.getItems(id);
  const payments = await PaymentService.getByInvoice(id);
  const amountDue = invoice.total_amount - invoice.paid_amount;

  const canCancel = invoice.status !== 'CANCELLED' && invoice.status !== 'REFUNDED';
  const canRefund = amountDue <= 0 && canCancel;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{invoice.invoice_number}</h1>
          <p className="text-muted-foreground">
            Invoice details — {new Date(invoice.created_at).toLocaleDateString('id-ID')}
          </p>
        </div>
        <div className="flex gap-2">
          {canCancel && (
            <form action={cancelInvoice}>
              <input type="hidden" name="invoice_id" value={invoice.id} />
              <Button variant="outline" type="submit">Cancel Invoice</Button>
            </form>
          )}
          {canRefund && (
            <form action={refundInvoice}>
              <input type="hidden" name="invoice_id" value={invoice.id} />
              <input type="hidden" name="amount" value={invoice.paid_amount} />
              <Button variant="outline" type="submit">Refund</Button>
            </form>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Invoice Information</h3>
          <div className="space-y-2 text-sm">
            <div><span className="text-muted-foreground">Type:</span> {invoice.invoice_type}</div>
            <div><span className="text-muted-foreground">Customer:</span> {invoice.customer_id || '-'}</div>
            <div><span className="text-muted-foreground">Status:</span> <Badge>{invoice.status.replace('_', ' ')}</Badge></div>
            <div><span className="text-muted-foreground">Created by:</span> {invoice.created_by}</div>
            <div><span className="text-muted-foreground">Due Date:</span> {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('id-ID') : '-'}</div>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Financial Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(invoice.subtotal)}</span></div>
            <div className="flex justify-between"><span>Discount</span><span>-{formatCurrency(invoice.discount_amount)}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>+{formatCurrency(invoice.tax_amount)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>+{formatCurrency(invoice.shipping_amount)}</span></div>
            <div className="flex justify-between font-semibold"><span>Total</span><span>{formatCurrency(invoice.total_amount)}</span></div>
            <div className="flex justify-between"><span>Paid</span><span>{formatCurrency(invoice.paid_amount)}</span></div>
            <div className="flex justify-between text-lg font-bold text-primary"><span>Due</span><span>{formatCurrency(amountDue)}</span></div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Line Items</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead className="text-right">Unit Price</TableHead>
              <TableHead className="text-right">Discount</TableHead>
              <TableHead className="text-right">Tax</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.description}</TableCell>
                <TableCell className="text-right">{item.quantity}</TableCell>
                <TableCell className="text-right">{formatCurrency(item.unit_price)}</TableCell>
                <TableCell className="text-right">{formatCurrency(item.discount_amount)}</TableCell>
                <TableCell className="text-right">{formatCurrency(item.tax_amount)}</TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(item.total_price)}</TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No items
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {amountDue > 0 && canCancel && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Record Payment</h3>
          <PaymentForm invoiceId={invoice.id} maxAmount={amountDue} />
        </Card>
      )}

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Payments</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Method</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reference</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{new Date(payment.created_at).toLocaleDateString('id-ID')}</TableCell>
                <TableCell>{payment.payment_method}</TableCell>
                <TableCell className="text-right">{formatCurrency(payment.amount)}</TableCell>
                <TableCell>
                  <Badge
                    className={payment.payment_status === 'VERIFIED' ? 'bg-green-100 text-green-800' : payment.payment_status === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}
                  >
                    {payment.payment_status}
                  </Badge>
                </TableCell>
                <TableCell>{payment.reference_number || '-'}</TableCell>
              </TableRow>
            ))}
            {payments.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No payments recorded
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <p className="text-xs text-muted-foreground mt-2">
          Pending payments can be verified in{' '}
          <span className="font-medium">Payments → Verification</span>.
        </p>
      </Card>
    </div>
  );
}
