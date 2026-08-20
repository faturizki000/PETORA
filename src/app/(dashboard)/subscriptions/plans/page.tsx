import { SubscriptionService } from '@/lib/services/subscription.service';
import { PlanTable } from '@/components/domain/subscription/plan-table';

export default async function SubscriptionPlansPage() {
  const plans = await SubscriptionService.listPlans();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Subscription Plans</h1>
        <p className="text-muted-foreground">Manage subscription plans</p>
      </div>
      <PlanTable plans={plans} />
    </div>
  );
}
