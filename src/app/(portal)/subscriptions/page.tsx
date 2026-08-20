'use client';

import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SubscriptionService } from '@/lib/services/subscription.service';
import type { Subscription, SubscriptionPlan } from '@/types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { CreditCard, RefreshCw, X, Check } from 'lucide-react';

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  ACTIVE: 'default',
  PAUSED: 'secondary',
  CANCELLED: 'destructive',
  EXPIRED: 'destructive',
};

export default function SubscriptionsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['portal', 'subscriptions'],
    queryFn: () => SubscriptionService.listSubscriptions({}),
  });

  if (isLoading) {
    return (
      <div className="p-4 space-y-3">
        <h1 className="text-xl font-bold">Subscriptions</h1>
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="p-4 h-32 animate-pulse bg-muted" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <p className="text-destructive">Gagal memuat data subscription.</p>
      </div>
    );
  }

  const subscriptions = data?.data ?? [];

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Subscriptions</h1>

      {subscriptions.length === 0 ? (
        <Card className="p-8 text-center">
          <CreditCard className="size-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Belum ada subscription</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {subscriptions.map((sub: Subscription) => (
            <Card key={sub.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold">{(sub as unknown as { plan?: SubscriptionPlan }).plan?.name ?? 'Plan'}</p>
                  <p className="text-sm text-muted-foreground">
                    {sub.subscription_number}
                  </p>
                </div>
                <Badge variant={statusVariant[sub.status] || 'outline'}>
                  {sub.status}
                </Badge>
              </div>

              <div className="space-y-1 text-sm text-muted-foreground mb-3">
                <p>Mulai: {format(new Date(sub.start_date), 'dd MMM yyyy', { locale: id })}</p>
                {sub.end_date && (
                  <p>Berakhir: {format(new Date(sub.end_date), 'dd MMM yyyy', { locale: id })}</p>
                )}
                {sub.next_billing_date && (
                  <p>Tagihan berikutnya: {format(new Date(sub.next_billing_date), 'dd MMM yyyy', { locale: id })}</p>
                )}
              </div>

              <div className="flex gap-2">
                {sub.status === 'ACTIVE' && (
                  <>
                    <Button variant="outline" size="sm" className="flex-1">
                      <RefreshCw className="size-4 mr-1" />
                      Pause
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive">
                      <X className="size-4" />
                    </Button>
                  </>
                )}
                {sub.status === 'PAUSED' && (
                  <Button variant="default" size="sm" className="flex-1">
                    <Check className="size-4 mr-1" />
                    Lanjutkan
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
