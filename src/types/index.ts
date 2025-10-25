/**
 * Type-safe domain models for the E-Commerce platform
 * These types extend Prisma models with additional business logic types
 */

import {
  User,
  Product,
  Cart,
  CartItem,
  Order,
  OrderItem,
  BalanceEvent,
  UserRole,
  OrderStatus,
  PaymentMethod,
  BalanceEventType
} from '@prisma/client';

// ============================================
// Re-export Prisma enums for convenience
// ============================================
export {
  UserRole,
  OrderStatus,
  PaymentMethod,
  BalanceEventType
};

// ============================================
// Re-export base Prisma models
// ============================================
export type {
  User,
  Product,
  Cart,
  CartItem,
  Order,
  OrderItem,
  BalanceEvent
};

// ============================================
// Extended types with relations
// ============================================

export type ProductWithSeller = Product & {
  seller: User;
};

export type CartWithItems = Cart & {
  items: (CartItem & {
    product: Product;
  })[];
};

export type OrderWithItems = Order & {
  items: (OrderItem & {
    product: Product;
  })[];
  user: User;
};

// ============================================
// Validation Types (Applicative Validation)
// ============================================

/**
 * Validation result type
 * Either Success with value or Failure with array of errors
 */
export type Validation<E, A> =
  | { type: 'Success'; value: A }
  | { type: 'Failure'; errors: E[] };

export type ValidationError = {
  field: string;
  message: string;
};

// ============================================
// Cart Validation Types
// ============================================

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

// ============================================
// Order State Machine Types
// ============================================

/**
 * Type-safe order state transitions
 * Discriminated union ensures only valid states exist
 */
export type OrderState =
  | { status: 'PENDING'; cartId: string; userId: string }
  | { status: 'PAYMENT_PAGE'; orderId: string; totalAmount: number }
  | { status: 'PAYMENT_SUCCESS'; orderId: string; paymentMethod: PaymentMethod }
  | { status: 'PAYMENT_FAILED'; orderId: string; reason: string };

// ============================================
// Payment Types
// ============================================

export type PaymentRequest = {
  orderId: string;
  method: PaymentMethod;
};

export type PaymentResult =
  | { success: true; orderId: string; method: PaymentMethod }
  | { success: false; error: string };

// ============================================
// Balance Types
// ============================================

export type BalanceInfo = {
  userId: string;
  currentBalance: number;
  events: BalanceEvent[];
};

export type BalanceTransaction = {
  type: BalanceEventType;
  amount: number;
};

// ============================================
// Analytics Types (Monoid-like aggregation)
// ============================================

export type SalesStatistics = {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  topProducts: ProductSalesInfo[];
  salesByHour: Map<number, number>;
  salesByDay: Map<string, number>;
};

export type ProductSalesInfo = {
  productId: string;
  productName: string;
  totalQuantitySold: number;
  totalRevenue: number;
};

// ============================================
// API Response Types
// ============================================

/**
 * Result type for functional error handling
 */
export type Result<T, E = string> =
  | { ok: true; data: T }
  | { ok: false; error: E };

export type ApiResponse<T> = Result<T, ApiError>;

export type ApiError = {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
};

// ============================================
// Request/Response DTOs
// ============================================

export type CreateProductRequest = {
  name: string;
  description: string;
  price: number;
  stock: number;
};

export type AddToCartRequest = {
  productId: string;
  quantity: number;
};

export type UpdateCartItemRequest = {
  quantity: number;
};

export type CheckoutRequest = {
  userId: string;
};

export type ProcessPaymentRequest = {
  orderId: string;
  method: PaymentMethod;
};

export type DepositRequest = {
  amount: number;
};

export type WithdrawRequest = {
  amount: number;
};

// ============================================
// Helper types
// ============================================

export type PaginationParams = {
  page: number;
  limit: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
