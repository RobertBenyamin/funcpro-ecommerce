import { BalanceEvent, BalanceEventType } from '@prisma/client';

// Re-export Prisma types
export { BalanceEventType };
export type { BalanceEvent };

// Balance types
export type BalanceInfo = {
  userId: string;
  currentBalance: number;
  events: BalanceEvent[];
};

export type BalanceTransaction = {
  type: BalanceEventType;
  amount: number;
};

// Request DTOs
export type DepositRequest = {
  amount: number;
};

export type WithdrawRequest = {
  amount: number;
};
