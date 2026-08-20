'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { verifyPaymentSchema } from '@/schemas/payment';
import { verifyPaymentAction } from '@/app/actions/payment.actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import type { Payment } from '@/types/invoice';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
}

export function PaymentVerificationDialog({
  payment,
  open,
  onOpenChange,
  onVerified,
}: {
  payment: Payment;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerified?: () => void;
}) {
  const [status, setStatus] = useState<'VERIFIED' | 'REJECTED'>('VERIFIED');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function handleVerify() {
    const result = await verifyPaymentSchema.safeParse({ payment_id: payment.id, status, notes });
    if (!result.success) {
      toast.error('Invalid input');
      return;
    }
    setIsSubmitting(true);
    const response = await verifyPaymentAction(result.data);
    setIsSubmitting(false);
    if (response.success) {
      toast.success(`Payment ${status === 'VERIFIED' ? 'verified' : 'rejected'}`);
      onVerified?.();
      router.refresh();
      onOpenChange(false);
    } else {
      toast.error(response.message || 'Failed to update payment');
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Verify Payment</DialogTitle>
          <DialogDescription>
            Payment #{payment.id.slice(0, 8)} — {formatCurrency(payment.amount)} — {payment.payment_method}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant={payment.payment_status === 'VERIFIED' ? 'default' : payment.payment_status === 'PENDING' ? 'secondary' : 'destructive'}>
              {payment.payment_status}
            </Badge>
            <span className="text-sm text-muted-foreground">{payment.reference_number || 'No reference'}</span>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Action</label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={status === 'VERIFIED' ? 'default' : 'outline'}
                onClick={() => setStatus('VERIFIED')}
              >
                Verify
              </Button>
              <Button
                type="button"
                variant={status === 'REJECTED' ? 'destructive' : 'outline'}
                onClick={() => setStatus('REJECTED')}
              >
                Reject
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Notes</label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add verification notes..." />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleVerify} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Confirm'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
