import { SettingsLayout } from '@/components/domain/settings/settings-layout';
import { Card } from '@/components/ui/card';

export default function ReminderSettingsPage() {
  return (
    <SettingsLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Reminder Settings</h1>
          <p className="text-muted-foreground">Konfigurasi pengingat</p>
        </div>
        <Card className="p-6">
          <p className="text-muted-foreground">Reminder configuration coming soon</p>
        </Card>
      </div>
    </SettingsLayout>
  );
}
