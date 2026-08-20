'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Package, TrendingUp, Users } from 'lucide-react';

const stats = [
  { title: 'Total Revenue', value: 'Rp 0', icon: DollarSign, trend: '+0%' },
  { title: 'Total Orders', value: '0', icon: Package, trend: '+0' },
  { title: 'Avg Order Value', value: 'Rp 0', icon: TrendingUp, trend: '+0%' },
  { title: 'Customers', value: '0', icon: Users, trend: '+0' },
];

export function ReportsDashboard() {
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
            <p className="text-xs text-muted-foreground mt-1">{stat.trend} from last period</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
