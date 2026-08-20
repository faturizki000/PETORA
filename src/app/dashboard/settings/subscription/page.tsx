import { SettingsLayout } from '@/components/domain/settings/settings-layout';
import { Card } from '@/components/ui/card';

export default function SubscriptionSettingsPage() {
  return (
    <SettingsLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Subscription Settings</h1>
          <p className="text-muted-foreground">Konfigurasi langganan</p>
        </div>
        <Card className="p-6">
          <p className="text-muted-foreground">Subscription configuration coming soon</p>
        </Card>
      </div>
    </SettingsLayout>
  );
}
