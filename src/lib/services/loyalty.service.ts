import { createSupabaseClient } from '@/lib/supabase/server';
import { SettingsService } from './settings.service';

export class LoyaltyService {
  static async earnPoints(customerId: string, invoiceId: string, amount: number): Promise<void> {
    const supabase = await createSupabaseClient();
    const settings = await SettingsService.getValue<any>('loyalty.settings');
    if (!settings?.enabled) return;

    let { data: member } = await supabase.from('loyalty_members').select('*').eq('customer_id', customerId).maybeSingle();
    if (!member) {
      const { data } = await supabase.from('loyalty_members').insert({ customer_id: customerId }).select().single();
      member = data;
    }

    const points = Math.floor(amount / settings.points_per_rupiah);
    const totalPoints = points;

    await supabase.from('loyalty_transactions').insert({
      member_id: member.id,
      transaction_type: 'EARN',
      points: totalPoints,
      invoice_id: invoiceId,
      description: 'Earned points from purchase',
      expiry_date: this.calculateExpiryDate(settings.expiry_months),
    });

    await supabase.from('loyalty_members').update({
      total_points: member.total_points + totalPoints,
      available_points: member.available_points + totalPoints,
      total_spending: member.total_spending + amount,
    }).eq('id', member.id);

    await this.checkTierUpgrade(member.id);
  }

  static async redeemPoints(customerId: string, points: number, invoiceId: string): Promise<void> {
    const supabase = await createSupabaseClient();
    const { data: member } = await supabase.from('loyalty_members').select('*').eq('customer_id', customerId).single();
    if (!member || member.available_points < points) throw new Error('Insufficient points');

    const settings = await SettingsService.getValue<any>('loyalty.settings');
    const discountValue = points * settings.point_value;

    await supabase.from('loyalty_transactions').insert({
      member_id: member.id,
      transaction_type: 'REDEEM',
      points: -points,
      invoice_id: invoiceId,
      description: `Redeemed ${points} points for Rp ${discountValue} discount`,
    });

    await supabase.from('loyalty_members').update({ available_points: member.available_points - points }).eq('id', member.id);
  }

  static async checkTierUpgrade(memberId: string): Promise<void> {
    const supabase = await createSupabaseClient();
    const { data: member } = await supabase.from('loyalty_members').select('*').eq('id', memberId).single();
    const { data: tiers } = await supabase.from('loyalty_tiers').select('*').order('min_points', { ascending: true });
    const newTier = tiers?.find((tier: any) => member.total_points >= tier.min_points && member.total_spending >= tier.min_spending);
    if (newTier && newTier.id !== member.tier_id) {
      await supabase.from('loyalty_members').update({ tier_id: newTier.id }).eq('id', memberId);
    }
  }

  static calculateExpiryDate(months: number): string {
    const date = new Date();
    date.setMonth(date.getMonth() + months);
    return date.toISOString().slice(0, 10);
  }
}
