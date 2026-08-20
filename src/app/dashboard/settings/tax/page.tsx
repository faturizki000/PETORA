import { SettingsLayout } from '@/components/domain/settings/settings-layout';
import { Card } from '@/components/ui/card';

export default function TaxSettingsPage() {
  return (
    <SettingsLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Tax Settings</h1>
          <p className="text-muted-foreground">Konfigurasi pajak</p>
        </div>
        <Card className="p-6">
          <p className="text-muted-foreground">Tax configuration coming soon</p>
        </Card>
      </div>
    </SettingsLayout>
  );
}
