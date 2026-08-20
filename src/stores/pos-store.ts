import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, InvoiceItem } from '@/types';

interface POSStore {
  cart: InvoiceItem[];
  selectedCustomerId: string | null;
  selectedPromotionId: string | null;
  selectedVoucherId: string | null;
  selectedGiftCardId: string | null;
  pointsToRedeem: number;
  splitPayments: Array<{ method: string; amount: number }>;
  addItem: (product: Product, qty: number) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  setCustomer: (id: string | null) => void;
  setPromotion: (id: string | null) => void;
  setVoucher: (id: string | null) => void;
  setGiftCard: (id: string | null) => void;
  setPointsToRedeem: (points: number) => void;
  addSplitPayment: (method: string, amount: number) => void;
  removeSplitPayment: (index: number) => void;
  clearSplitPayments: () => void;
}

export const usePOSStore = create<POSStore>()(
  persist(
    (set) => ({
      cart: [],
      selectedCustomerId: null,
      selectedPromotionId: null,
      selectedVoucherId: null,
      selectedGiftCardId: null,
      pointsToRedeem: 0,
      splitPayments: [],
      addItem: (product, qty) =>
        set((state) => {
          const existing = state.cart.find((item) => item.product_id === product.id);
          if (existing) {
            return {
              cart: state.cart.map((item) =>
                item.product_id === product.id ? { ...item, quantity: item.quantity + qty } : item
              ),
            };
          }
          return {
            cart: [
              ...state.cart,
              {
                id: crypto.randomUUID(),
                invoice_id: '',
                item_type: 'product',
                product_id: product.id,
                description: product.name,
                quantity: qty,
                unit_price: product.selling_price,
                discount_amount: 0,
                tax_amount: 0,
                total_price: product.selling_price * qty,
                created_at: new Date().toISOString(),
              } as InvoiceItem,
            ],
          };
        }),
      removeItem: (productId) =>
        set((state) => ({ cart: state.cart.filter((item) => item.product_id !== productId) })),
      updateQty: (productId, qty) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.product_id === productId ? { ...item, quantity: qty, total_price: item.unit_price * qty } : item
          ),
        })),
      clearCart: () => set({ cart: [], selectedCustomerId: null, splitPayments: [], pointsToRedeem: 0 }),
      setCustomer: (id) => set({ selectedCustomerId: id }),
      setPromotion: (id) => set({ selectedPromotionId: id }),
      setVoucher: (id) => set({ selectedVoucherId: id }),
      setGiftCard: (id) => set({ selectedGiftCardId: id }),
      setPointsToRedeem: (points) => set({ pointsToRedeem: points }),
      addSplitPayment: (method, amount) =>
        set((state) => ({ splitPayments: [...state.splitPayments, { method, amount }] })),
      removeSplitPayment: (index) =>
        set((state) => ({ splitPayments: state.splitPayments.filter((_, i) => i !== index) })),
      clearSplitPayments: () => set({ splitPayments: [] }),
    }),
    { name: 'petora-pos' }
  )
);
