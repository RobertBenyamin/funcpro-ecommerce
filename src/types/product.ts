import { Product } from '@prisma/client';
import type { User } from './user';

// Re-export Prisma types
export type { Product };

// Extended types with relations
export type ProductWithSeller = Product & {
  seller: User;
};

// Request DTOs
export type CreateProductRequest = {
  name: string;
  description: string;
  price: number;
  stock: number;
};
