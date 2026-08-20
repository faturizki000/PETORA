'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';

const widgets = [
  'today-appointments',
  'revenue-chart',
  'low-stock',
  'pending-payments',
] as const;

type Widget = typeof widgets[number];

export function DashboardWidgets() {
  const [activeWidgets, setActiveWidgets] = useState<Widget[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('dashboard-widgets');
      if (stored) {
        try {
          return JSON.parse(stored) as Widget[];
        } catch {
          return [...widgets];
        }
      }
    }
    return [...widgets];
  });

  useEffect(() => {
    localStorage.setItem('dashboard-widgets', JSON.stringify(activeWidgets));
  }, [activeWidgets]);

  const toggleWidget = (widget: Widget) => {
    setActiveWidgets((prev) =>
      prev.includes(widget) ? prev.filter((w) => w !== widget) : [...prev, widget]
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {widgets.map((widget) => (
          <button
            key={widget}
            onClick={() => toggleWidget(widget)}
            className={`px-3 py-1 text-sm rounded-full border ${
              activeWidgets.includes(widget)
                ? 'bg-primary text-primary-foreground'
                : 'bg-background hover:bg-accent'
            }`}
          >
            {widget.replace('-', ' ')}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeWidgets.includes('today-appointments') && (
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Janji Temu Hari Ini</h3>
            <p className="text-muted-foreground text-sm">8 janji temu menunggu</p>
          </Card>
        )}
        {activeWidgets.includes('revenue-chart') && (
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Pendapatan</h3>
            <p className="text-muted-foreground text-sm">Grafik pendapatan 7 hari terakhir</p>
          </Card>
        )}
        {activeWidgets.includes('low-stock') && (
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Stok Menipis</h3>
            <p className="text-muted-foreground text-sm">3 produk perlu restok</p>
          </Card>
        )}
        {activeWidgets.includes('pending-payments') && (
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Pembayaran Pending</h3>
            <p className="text-muted-foreground text-sm">5 pembayaran menunggu verifikasi</p>
          </Card>
        )}
      </div>
    </div>
  );
}
