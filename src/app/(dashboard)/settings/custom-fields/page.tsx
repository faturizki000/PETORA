import { SettingsLayout } from '@/components/domain/settings/settings-layout';
import { Card } from '@/components/ui/card';

export default function CustomFieldsSettingsPage() {
  return (
    <SettingsLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Custom Fields</h1>
          <p className="text-muted-foreground">Kelola field kustom</p>
        </div>
        <Card className="p-6">
          <p className="text-muted-foreground">Custom fields configuration coming soon</p>
        </Card>
      </div>
    </SettingsLayout>
  );
}
