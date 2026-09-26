'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '@/types';

type CartState = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantId: string | null) => void;
  updateQuantity: (productId: string, variantId: string | null, qty: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getCount: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const items = get().items;
        const existing = items.find(
          (i) => i.productId === item.productId && i.variantId === item.variantId
        );
        if (existing) {
          set({
            items: items.map((i) =>
              i.productId === item.productId && i.variantId === item.variantId
                ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.stock) }
                : i
            ),
          });
        } else {
          set({ items: [...items, item] });
        }
      },
      removeItem: (productId, variantId) =>
        set({
          items: get().items.filter(
            (i) => !(i.productId === productId && i.variantId === variantId)
          ),
        }),
      updateQuantity: (productId, variantId, qty) =>
        set({
          items: get().items.map((i) =>
            i.productId === productId && i.variantId === variantId
              ? { ...i, quantity: Math.max(1, Math.min(qty, i.stock)) }
              : i
          ),
        }),
      clearCart: () => set({ items: [] }),
      getTotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      getCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'sc-cart' }
  )
);