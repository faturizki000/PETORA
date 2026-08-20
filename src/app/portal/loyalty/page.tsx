'use client';

import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Gift, TrendingUp, Award } from 'lucide-react';
import type { LoyaltyMember, LoyaltyTierConfig, LoyaltyTransaction } from '@/types';

const tierColors: Record<string, string> = {
  BRONZE: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  SILVER: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  GOLD: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  PLATINUM: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
};

export default function LoyaltyPage() {
  const { data: member, isLoading: memberLoading } = useQuery({
    queryKey: ['portal', 'loyalty', 'member'],
    queryFn: async (): Promise<LoyaltyMember> => {
      const res = await fetch('/api/portal/loyalty/member');
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
  });

  const { data: transactions, isLoading: txLoading } = useQuery({
    queryKey: ['portal', 'loyalty', 'transactions'],
    queryFn: async (): Promise<LoyaltyTransaction[]> => {
      const res = await fetch('/api/portal/loyalty/transactions');
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
  });

  const { data: tierConfig } = useQuery({
    queryKey: ['portal', 'loyalty', 'tier'],
    queryFn: async (): Promise<LoyaltyTierConfig | null> => {
      const res = await fetch('/api/portal/loyalty/tier');
      if (!res.ok) return null;
      return res.json();
    },
  });

  if (memberLoading) {
    return (
      <div className="p-4 space-y-3">
        <h1 className="text-xl font-bold">Loyalty Points</h1>
        <Card className="p-6 h-32 animate-pulse bg-muted" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Loyalty Points</h1>

      <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Poin Tersedia</p>
            <p className="text-3xl font-bold">{member?.available_points ?? 0}</p>
          </div>
          {member && (
            <Badge className={cn('text-sm', tierColors[tierConfig?.name ?? 'BRONZE'])}>
              {tierConfig?.name ?? 'BRONZE'}
            </Badge>
          )}
        </div>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <TrendingUp className="size-4" />
            Total kumpul: {member?.total_points ?? 0}
          </span>
          <span className="flex items-center gap-1">
            <Award className="size-4" />
            Total belanja: Rp {(member?.total_spending ?? 0).toLocaleString('id-ID')}
          </span>
        </div>
      </Card>

      <section>
        <h2 className="text-lg font-semibold mb-3">Tier Benefits</h2>
        <Card className="p-4">
          <div className="space-y-2 text-sm">
            <p className="font-medium">{tierConfig?.name ?? 'BRONZE'} Member</p>
            {tierConfig?.benefits && typeof tierConfig.benefits === 'object' ? (
              Object.entries(tierConfig.benefits).map(([key, value]) => (
                <div key={key} className="flex justify-between text-muted-foreground">
                  <span>{key}</span>
                  <span className="font-medium text-foreground">{String(value)}</span>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">Kumpulkan poin untuk naik tier!</p>
            )}
          </div>
        </Card>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">Riwayat Transaksi</h2>
        {txLoading ? (
          <Card className="p-4 h-20 animate-pulse bg-muted" />
        ) : transactions && transactions.length > 0 ? (
          <div className="space-y-2">
            {transactions.map((tx) => (
              <Card key={tx.id} className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{tx.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(tx.created_at).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  <span className={cn(
                    'text-sm font-semibold',
                    tx.transaction_type === 'EARN' ? 'text-green-600' : 'text-red-600'
                  )}>
                    {tx.transaction_type === 'EARN' ? '+' : '-'}{tx.points}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-6 text-center">
            <Gift className="size-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground text-sm">Belum ada transaksi</p>
          </Card>
        )}
      </section>
    </div>
  );
}
