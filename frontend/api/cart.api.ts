import api from "./index";

export interface CartItemResponse {
  id: number;
  product: {
    id: number;
    name: string;
    price: number;
    image?: string;
    brand?: string;
    category?: string;
  };
  quantity: number;
}

export const getCart = async () => {
  return api.get("/cart/");
};

export const addToCart = async (product_id: number, quantity: number = 1) => {
  return api.post("/cart/", { product_id, quantity });
};

export const removeFromCart = async (product_id: number) => {
  return api.delete(`/cart/remove/${product_id}/`);
};
