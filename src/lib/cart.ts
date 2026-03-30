export type CartItem = {
  id: string;
  name: string;
  unitPrice: number;
  quantity: number;
  config: Record<string, string>;
};

export const CART_STORAGE_KEY = "qapi_cart_v1";
