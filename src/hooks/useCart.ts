'use client';
import { useCartStore } from '@/stores/cart-store';
export const useCart = () => {
  const store = useCartStore();
  return {
    ...store,
    total: store.getTotal(),
    count: store.getCount(),
  };
};