'use client';

import { usePOSStore } from '@/stores/pos-store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';
import type { InvoiceItem } from '@/types/invoice';

export function PosCart({
  onCheckout,
}: {
  onCheckout: () => void;
}) {
  const cart = usePOSStore((s) => s.cart);
  const removeItem = usePOSStore((s) => s.removeItem);
  const updateQty = usePOSStore((s) => s.updateQty);
  const clearCart = usePOSStore((s) => s.clearCart);

  const items = cart as InvoiceItem[];
  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unit_price - item.discount_amount,
    0
  );
  const tax = items.reduce((sum, item) => sum + item.tax_amount, 0);
  const total = subtotal + tax;

  return (
    <Card className="p-4 flex flex-col h-full">
      <h3 className="font-semibold mb-3">Order</h3>
      <div className="flex-1 overflow-y-auto space-y-2">
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-6">Cart is empty</p>
        )}
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-2">
            <div className="flex-1">
              <p className="font-medium text-sm">{item.description}</p>
              <p className="text-xs text-muted-foreground">{item.quantity} x {item.unit_price.toLocaleString()}</p>
            </div>
            <Input
              type="number"
              min={1}
              value={item.quantity}
              onChange={(e) => updateQty(item.product_id!, Number(e.target.value))}
              className="w-14 h-7 text-xs"
            />
            <Button variant="ghost" size="sm" onClick={() => removeItem(item.product_id!)} className="h-7 w-7 p-1">
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
      <div className="border-t pt-3 space-y-1 text-sm mt-3">
        <div className="flex justify-between"><span>Subtotal</span><span>{subtotal.toLocaleString()}</span></div>
        <div className="flex justify-between"><span>Tax</span><span>{tax.toLocaleString()}</span></div>
        <div className="flex justify-between font-semibold"><span>Total</span><span>{total.toLocaleString()}</span></div>
      </div>
      <div className="mt-3 flex gap-2">
        <Button variant="outline" size="sm" onClick={clearCart} className="flex-1">Clear</Button>
        <Button size="sm" onClick={onCheckout} className="flex-1" disabled={items.length === 0}>
          Checkout
        </Button>
      </div>
    </Card>
  );
}
