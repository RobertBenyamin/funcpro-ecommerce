import { Cart, CartItem } from '@prisma/client';
import type { Product } from './product';

// Re-export Prisma types
export type { Cart, CartItem };

// Extended types with relations
export type CartWithItems = Cart & {
  items: (CartItem & {
    product: Product;
  })[];
};

// Validation types
export type ValidatedCart = {
  items: ValidatedCartItem[];
  totalAmount: number;
};

export type ValidatedCartItem = {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
  availableStock: number;
};

// Request DTOs
export type AddToCartRequest = {
  productId: string;
  quantity: number;
};

export type UpdateCartItemRequest = {
  quantity: number;
};
