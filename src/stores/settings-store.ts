import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { StoreSettings, PaymentSettings, LoyaltySettings } from '@/types';

interface SettingsStore {
  store: StoreSettings | null;
  payment: PaymentSettings | null;
  loyalty: LoyaltySettings | null;
  setStore: (settings: StoreSettings) => void;
  setPayment: (settings: PaymentSettings) => void;
  setLoyalty: (settings: LoyaltySettings) => void;
  reset: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      store: null,
      payment: null,
      loyalty: null,
      setStore: (settings) => set({ store: settings }),
      setPayment: (settings) => set({ payment: settings }),
      setLoyalty: (settings) => set({ loyalty: settings }),
      reset: () => set({ store: null, payment: null, loyalty: null }),
    }),
    {
      name: 'petora-settings',
      partialize: (state) => ({
        store: state.store,
        payment: state.payment,
        loyalty: state.loyalty,
      }),
    }
  )
);
