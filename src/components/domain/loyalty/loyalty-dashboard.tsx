'use client';

import { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Users, Gift, TrendingUp } from 'lucide-react';

const stats = [
  { title: 'Total Members', value: '0', icon: Users, trend: '+0' },
  { title: 'Points Issued', value: '0', icon: Gift, trend: '+0' },
  { title: 'Points Redeemed', value: '0', icon: TrendingUp, trend: '-0' },
  { title: 'Total Value', value: 'Rp 0', icon: DollarSign, trend: '+0%' },
];

export function LoyaltyDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold mt-2">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.trend} from last month</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
