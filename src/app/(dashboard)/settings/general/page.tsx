import { SettingsLayout } from '@/components/domain/settings/settings-layout';
import { StoreSettingsForm } from '@/components/domain/settings/store-settings-form';

export default function GeneralSettingsPage() {
  return (
    <SettingsLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">General Settings</h1>
          <p className="text-muted-foreground">Pengaturan umum toko</p>
        </div>
        <StoreSettingsForm />
      </div>
    </SettingsLayout>
  );
}
