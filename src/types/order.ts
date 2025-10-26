import { Order, OrderItem, OrderStatus, PaymentMethod } from '@prisma/client';
import type { Product } from './product';
import type { User } from './user';

// Re-export Prisma types
export { OrderStatus, PaymentMethod };
export type { Order, OrderItem };

// Extended types with relations
export type OrderWithItems = Order & {
  items: (OrderItem & {
    product: Product;
  })[];
  user: User;
};

// Order State Machine Types
/**
 * Type-safe order state transitions
 * Discriminated union ensures only valid states exist
 */
export type OrderState =
  | { status: 'PENDING'; cartId: string; userId: string }
  | { status: 'PAYMENT_PAGE'; orderId: string; totalAmount: number }
  | { status: 'PAYMENT_SUCCESS'; orderId: string; paymentMethod: PaymentMethod }
  | { status: 'PAYMENT_FAILED'; orderId: string; reason: string };

// Request DTOs
export type CheckoutRequest = {
  userId: string;
};
