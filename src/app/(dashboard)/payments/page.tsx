import { PaymentService } from '@/lib/services/payment.service';
import { PaymentTable } from '@/components/domain/payment/payment-table';

export default async function PaymentsPage() {
  const result = await PaymentService.list({ limit: 50 });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payments</h1>
        <p className="text-muted-foreground">Kelola pembayaran pelanggan</p>
      </div>
      <PaymentTable payments={result.data} showVerify />
    </div>
  );
}
