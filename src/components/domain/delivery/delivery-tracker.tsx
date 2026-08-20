'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Delivery } from '@/types/delivery';

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  ASSIGNED: 'bg-blue-100 text-blue-800',
  PICKED_UP: 'bg-purple-100 text-purple-800',
  IN_TRANSIT: 'bg-indigo-100 text-indigo-800',
  DELIVERED: 'bg-green-100 text-green-800',
  FAILED: 'bg-red-100 text-red-800',
  CANCELLED: 'bg-gray-100 text-gray-800',
};

export function DeliveryTracker({ delivery }: { delivery: Delivery }) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold">{delivery.delivery_number}</h3>
          <p className="text-sm text-muted-foreground">{delivery.delivery_address}</p>
        </div>
        <Badge className={statusColors[delivery.status] || 'bg-gray-100 text-gray-800'}>{delivery.status}</Badge>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tracking Number</span>
          <span className="font-medium">{delivery.tracking_number || '-'}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Delivery Fee</span>
          <span className="font-medium">Rp {(delivery.delivery_fee || 0).toLocaleString()}</span>
        </div>
        {delivery.scheduled_at && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Scheduled At</span>
            <span className="font-medium">{new Date(delivery.scheduled_at).toLocaleString()}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
