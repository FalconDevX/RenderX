import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";


interface ProductState {
  selectedProductId: number | null;
  setSelectedProductId: (id: number) => void;
  clearSelectedProduct: () => void;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set) => ({
      selectedProductId: null,
      setSelectedProductId: (id) => set({ selectedProductId: id }),
      clearSelectedProduct: () => set({ selectedProductId: null }),
    }),
    {
      name: "product-storage",
      storage: createJSONStorage(() => localStorage)
    }
  )
);
