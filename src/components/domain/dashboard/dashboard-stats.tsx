'use client';

import { DollarSign, Calendar, Package, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';

const stats = [
  { title: 'Pendapatan Hari Ini', value: 'Rp 2.450.000', icon: DollarSign, trend: '+12%' },
  { title: 'Janji Temu Hari Ini', value: '8', icon: Calendar, trend: '+2' },
  { title: 'Stok Menipis', value: '3', icon: Package, trend: '-1' },
  { title: 'Pembayaran Pending', value: '5', icon: Clock, trend: '+1' },
];

export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold mt-2">{stat.value}</p>
          <p className="text-xs text-muted-foreground mt-1">{stat.trend} dari kemarin</p>
        </Card>
      ))}
    </div>
  );
}
