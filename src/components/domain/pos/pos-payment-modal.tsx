'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { usePOSStore } from '@/stores/pos-store';
import { PaymentMethodSelector } from '@/components/domain/payment/payment-method-selector';
import { SplitPaymentForm } from '@/components/domain/payment/split-payment-form';
import { createInvoiceAction } from '@/app/actions/invoice.actions';
import { recordManualPaymentAction } from '@/app/actions/payment.actions';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { InvoiceItem, PaymentMethod } from '@/types/invoice';

export function PosPaymentModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const cart = usePOSStore((s) => s.cart) as InvoiceItem[];
  const customerId = usePOSStore((s) => s.selectedCustomerId);
  const clearCart = usePOSStore((s) => s.clearCart);
  const clearSplitPayments = usePOSStore((s) => s.clearSplitPayments);

  const [method, setMethod] = useState<PaymentMethod>('CASH');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [splitMode, setSplitMode] = useState(false);
  const [splitInvoiceId, setSplitInvoiceId] = useState<string | null>(null);
  const [isPaying, setIsPaying] = useState(false);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.quantity * item.unit_price - item.discount_amount,
    0
  );
  const tax = cart.reduce((sum, item) => sum + item.tax_amount, 0);
  const total = subtotal + tax;

  async function createInvoiceFromCart() {
    const invoiceInput = {
      invoice_type: 'POS' as const,
      customer_id: customerId || null,
      items: cart.map((item) => ({
        item_type: 'product',
        product_id: item.product_id || null,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        discount_amount: item.discount_amount || 0,
        tax_amount: item.tax_amount || 0,
        batch_number: item.batch_number || null,
        expiry_date: item.expiry_date || null,
      })),
      discount_amount: 0,
      discount_type: 'fixed' as const,
      tax_amount: tax,
      shipping_amount: 0,
      promotion_id: null,
      gift_card_id: null,
      voucher_code: undefined,
      loyalty_points_to_redeem: 0,
      notes: notes || undefined,
    };

    const result = await createInvoiceAction(invoiceInput);
    if (!result.success || !result.data) {
      toast.error(result.message || 'Failed to create invoice');
      return null;
    }
    return result.data;
  }

  async function handlePay() {
    if (cart.length === 0) return;
    setIsPaying(true);
    try {
      const invoice = await createInvoiceFromCart();
      if (!invoice) return;

      const paymentResult = await recordManualPaymentAction({
        invoice_id: invoice.id,
        payment_method: method,
        amount: total,
        reference_number: referenceNumber || undefined,
        notes: notes || undefined,
      });

      if (paymentResult.success) {
        toast.success(`Payment recorded — Invoice ${invoice.invoice_number}`);
        clearCart();
        clearSplitPayments();
        onOpenChange(false);
      } else {
        toast.error(paymentResult.message || 'Failed to record payment');
      }
    } catch {
      toast.error('An error occurred during checkout');
    } finally {
      setIsPaying(false);
    }
  }

  async function startSplitPayment() {
    if (cart.length === 0) return;
    setIsPaying(true);
    try {
      const invoice = await createInvoiceFromCart();
      if (!invoice) return;
      setSplitInvoiceId(invoice.id);
      setSplitMode(true);
    } finally {
      setIsPaying(false);
    }
  }

  async function finishSplit() {
    if (splitInvoiceId) {
      toast.success(`Split payments recorded for invoice`);
      clearCart();
      clearSplitPayments();
      onOpenChange(false);
    }
  }

  function reset() {
    setSplitMode(false);
    setSplitInvoiceId(null);
    setMethod('CASH');
    setReferenceNumber('');
    setNotes('');
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { reset(); onOpenChange(o); }}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
          <DialogDescription>
            Total amount: <strong>{total.toLocaleString()}</strong>
          </DialogDescription>
        </DialogHeader>

        {splitMode && splitInvoiceId ? (
          <div className="space-y-4">
            <SplitPaymentForm
              invoiceId={splitInvoiceId}
              totalAmount={total}
              onCompleted={finishSplit}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <PaymentMethodSelector value={method} onChange={setMethod} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reference_number">Reference Number</Label>
                <Input
                  id="reference_number"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  placeholder="Receipt / bank reference"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input id="amount" type="number" value={total} readOnly className="bg-muted" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add a note..."
              />
            </div>
          </div>
        )}

        <DialogFooter>
          {splitMode && splitInvoiceId ? null : (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPaying}>
                Cancel
              </Button>
              <Button variant="outline" onClick={startSplitPayment} disabled={isPaying || cart.length === 0}>
                Split Payment
              </Button>
              <Button onClick={handlePay} disabled={isPaying || cart.length === 0}>
                {isPaying ? 'Processing...' : 'Pay'}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
