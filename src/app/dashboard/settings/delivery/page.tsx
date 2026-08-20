import { SettingsLayout } from '@/components/domain/settings/settings-layout';
import { Card } from '@/components/ui/card';

export default function DeliverySettingsPage() {
  return (
    <SettingsLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Delivery Settings</h1>
          <p className="text-muted-foreground">Konfigurasi pengiriman</p>
        </div>
        <Card className="p-6">
          <p className="text-muted-foreground">Delivery configuration coming soon</p>
        </Card>
      </div>
    </SettingsLayout>
  );
}
