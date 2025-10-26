import type { Product, StockEvent, StockEventType } from '@prisma/client';
import type { User } from './user';

// Re-export Prisma types
export type { Product, StockEvent, StockEventType };

// Extended types with relations
export type ProductWithSeller = Product & {
  seller: User;
};

export type ProductWithStockHistory = Product & {
  stockEvents: StockEvent[];
};

// Request DTOs
export type CreateProductRequest = {
  name: string;
  description: string;
  price: number;
  stock: number;
};

// Stock Event types for pure functional operations
export type StockEventRecord = {
  id: string;
  productId: string;
  type: StockEventType;
  quantity: number;
  reason?: string;
  createdAt: Date;
};

// Pure function to calculate current stock from events
export const calculateStockFromEvents = (events: StockEventRecord[]): number =>
  events.reduce((acc, event) => acc + event.quantity, 0);

// Pure function to get stock history metadata
export const getStockHistory = (events: StockEventRecord[]) => ({
  currentStock: calculateStockFromEvents(events),
  totalEvents: events.length,
  lastUpdated: events[events.length - 1]?.createdAt ?? new Date(),
  eventsByType: events.reduce(
    (acc, event) => ({
      ...acc,
      [event.type]: (acc[event.type] ?? 0) + 1,
    }),
    {} as Record<StockEventType, number>
  ),
});
