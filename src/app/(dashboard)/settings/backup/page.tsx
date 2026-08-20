import { SettingsLayout } from '@/components/domain/settings/settings-layout';
import { Card } from '@/components/ui/card';

export default function BackupSettingsPage() {
  return (
    <SettingsLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Backup Settings</h1>
          <p className="text-muted-foreground">Konfigurasi backup data</p>
        </div>
        <Card className="p-6">
          <p className="text-muted-foreground">Backup configuration coming soon</p>
        </Card>
      </div>
    </SettingsLayout>
  );
}
