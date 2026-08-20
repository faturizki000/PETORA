import { SettingsLayout } from '@/components/domain/settings/settings-layout';
import { PaymentSettingsForm } from '@/components/domain/settings/payment-settings-form';

export default function PaymentSettingsPage() {
  return (
    <SettingsLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Payment Settings</h1>
          <p className="text-muted-foreground">Konfigurasi metode pembayaran</p>
        </div>
        <PaymentSettingsForm />
      </div>
    </SettingsLayout>
  );
}
