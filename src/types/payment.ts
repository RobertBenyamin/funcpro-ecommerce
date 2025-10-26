import { PaymentMethod } from '@prisma/client';

// Re-export enum
export { PaymentMethod };

// Payment types
export type PaymentRequest = {
  orderId: string;
  method: PaymentMethod;
};

export type PaymentResult =
  | { success: true; orderId: string; method: PaymentMethod }
  | { success: false; error: string };

// Request DTOs
export type ProcessPaymentRequest = {
  orderId: string;
  method: PaymentMethod;
};
