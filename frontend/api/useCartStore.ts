import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { getCart, addToCart, removeFromCart, CartItemResponse } from "./cart.api";
import { useAuth } from "./useAuth.store";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  productId: number; 
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addItem: (item: Omit<CartItem, 'quantity' | 'productId'> & { productId: number }) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const convertCartItem = (item: CartItemResponse): CartItem => ({
  id: item.id,
  productId: item.product.id,
  name: item.product.name,
  price: item.product.price,
  image: item.product.image,
  quantity: item.quantity,
});

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      
      fetchCart: async () => {
        if (get().isLoading) {
          return;
        }
        const authState = useAuth.getState();
        if (!authState.user || !authState.accessToken) {
          set({ items: [] });
          return;
        }
        
        set({ isLoading: true });
        try {
          const response = await getCart();
          const cartItems: CartItemResponse[] = response.data;
          const convertedItems = cartItems.map(convertCartItem);
          set({ items: convertedItems });
        } catch (error: any) {
          if (error?.response?.status === 401) {
            const currentAuthState = useAuth.getState();
            if (currentAuthState.accessToken) {
              set({ items: [] });
            } else {
              set({ items: [] });
            }
          } else {
            console.error("Error fetching cart:", error);
            set({ items: [] });
          }
        } finally {
          set({ isLoading: false });
        }
      },
      
      addItem: async (item) => {
        const authState = useAuth.getState();
        if (!authState.user || !authState.accessToken) {
          console.warn("Cannot add to cart: user not authenticated");
          return;
        }
        
        try {
          await addToCart(item.productId, 1);
          await get().fetchCart();
        } catch (error: any) {
          console.error("Error adding to cart:", error);
          if (error?.response?.status === 401) {
            set({ items: [] });
            return;
          }
          const items = get().items;
          const existingItem = items.find(i => i.productId === item.productId);
          
          if (existingItem) {
            set({
              items: items.map(i =>
                i.productId === item.productId ? { ...i, quantity: i.quantity + 1 } : i
              )
            });
          } else {
            set({
              items: [...items, { ...item, quantity: 1 }]
            });
          }
        }
      },
      
      removeItem: async (productId) => {
        const authState = useAuth.getState();
        if (!authState.user || !authState.accessToken) {
          console.warn("Cannot remove from cart: user not authenticated");
          set({
            items: get().items.filter(item => item.productId !== productId)
          });
          return;
        }
        
        try {
          await removeFromCart(productId);
          await get().fetchCart();
        } catch (error: any) {
          console.error("Error removing from cart:", error);
          if (error?.response?.status === 401) {
            set({ items: [] });
            return;
          }
          set({
            items: get().items.filter(item => item.productId !== productId)
          });
        }
      },
      
      updateQuantity: async (productId, quantity) => {
        const authState = useAuth.getState();
        if (!authState.user || !authState.accessToken) {
          console.warn("Cannot update cart quantity: user not authenticated");
          return;
        }
        
        if (quantity <= 0) {
          await get().removeItem(productId);
          return;
        }
        
        try {
          const currentItem = get().items.find(i => i.productId === productId);
          if (currentItem) {
            const difference = quantity - currentItem.quantity;
            if (difference > 0) {
              await addToCart(productId, difference);
            } else if (difference < 0) {
              await removeFromCart(productId);
              await addToCart(productId, quantity);
            }
            await get().fetchCart();
          }
        } catch (error: any) {
          console.error("Error updating quantity:", error);
          if (error?.response?.status === 401) {
            set({ items: [] });
            return;
          }
          set({
            items: get().items.map(item =>
              item.productId === productId ? { ...item, quantity } : item
            )
          });
        }
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      }
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: [] })
    }
  )
);
