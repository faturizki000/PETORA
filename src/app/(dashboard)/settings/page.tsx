import { SettingsLayout } from '@/components/domain/settings/settings-layout';
import { Card } from '@/components/ui/card';

export default function SettingsPage() {
  return (
    <SettingsLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Kelola pengaturan toko Anda</p>
        </div>
        <Card className="p-6">
          <p className="text-muted-foreground">Pilih kategori pengaturan dari sidebar</p>
        </Card>
      </div>
    </SettingsLayout>
  );
}
