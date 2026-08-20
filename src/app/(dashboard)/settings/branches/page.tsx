import { SettingsLayout } from '@/components/domain/settings/settings-layout';
import { Card } from '@/components/ui/card';

export default function BranchesSettingsPage() {
  return (
    <SettingsLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Branches</h1>
          <p className="text-muted-foreground">Kelola cabang toko</p>
        </div>
        <Card className="p-6">
          <p className="text-muted-foreground">Branch management coming soon</p>
        </Card>
      </div>
    </SettingsLayout>
  );
}
