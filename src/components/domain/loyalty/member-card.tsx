'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { LoyaltyMember } from '@/types/loyalty';

const tierColors: Record<string, string> = {
  BRONZE: 'bg-orange-100 text-orange-800',
  SILVER: 'bg-gray-100 text-gray-800',
  GOLD: 'bg-yellow-100 text-yellow-800',
  PLATINUM: 'bg-purple-100 text-purple-800',
};

export function MemberCard({ member }: { member: LoyaltyMember }) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold">Member #{member.id.slice(0, 8)}</h3>
          <p className="text-sm text-muted-foreground">Customer ID: {member.customer_id.slice(0, 8)}</p>
        </div>
        <Badge className={tierColors['BRONZE'] || 'bg-gray-100 text-gray-800'}>BRONZE</Badge>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Total Points</span>
          <span className="font-medium">{member.total_points}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Available Points</span>
          <span className="font-medium">{member.available_points}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Total Spending</span>
          <span className="font-medium">Rp {member.total_spending.toLocaleString()}</span>
        </div>
      </div>
    </Card>
  );
}
