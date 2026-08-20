import { PaymentService } from '@/lib/services/payment.service';
import { PaymentTable } from '@/components/domain/payment/payment-table';
import { Card } from '@/components/ui/card';

export default async function PaymentVerificationPage() {
  const pending = await PaymentService.getPending();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payment Verification</h1>
        <p className="text-muted-foreground">Verify pending customer payments</p>
      </div>
      <Card className="p-4">
        <p className="text-sm text-muted-foreground">
          {pending.length} pending payment(s) awaiting verification.
        </p>
      </Card>
      <PaymentTable payments={pending} showVerify />
    </div>
  );
}
