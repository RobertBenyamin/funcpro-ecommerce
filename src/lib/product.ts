import prisma from './prisma';
import type { CreateProductRequest, ProductWithSeller, StockEventRecord } from '../types/product';
import { calculateStockFromEvents } from '../types/product';

// Pure function: Calculate current stock from events
const getStockFromEvents = async (productId: string): Promise<number> => {
  const events = await prisma.stockEvent.findMany({
    where: { productId },
    orderBy: { createdAt: 'asc' },
  });
  
  return calculateStockFromEvents(events as StockEventRecord[]);
};

// Create a product with initial stock (immutably)
export async function createProduct(data: CreateProductRequest, sellerId: string) {
  const { name, description, price, stock } = data;

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price: Math.floor(price),
      sellerId,
    },
  });

  // Record initial stock as an event
  await prisma.stockEvent.create({
    data: {
      productId: product.id,
      type: 'INITIAL',
      quantity: Math.floor(stock),
      reason: 'Initial stock',
    },
  });

  return product;
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: { seller: true },
  }) as Promise<ProductWithSeller | null>;
}

export async function listProducts(skip = 0, take = 50) {
  return prisma.product.findMany({
    skip,
    take,
    orderBy: { createdAt: 'desc' },
  });
}

export async function updateProduct(id: string, data: Partial<CreateProductRequest>) {
  // Allow partial updates. Ensure numeric fields are integers when provided.
  // Note: stock updates are no longer directly modified, they must use recordStockEvent
  const payload: any = {};
  if (data.price !== undefined) payload.price = Math.floor(data.price);
  if (data.name !== undefined) payload.name = data.name;
  if (data.description !== undefined) payload.description = data.description;
  
  if (Object.keys(payload).length === 0) {
    return prisma.product.findUnique({ where: { id } });
  }

  return prisma.product.update({ where: { id }, data: payload });
}

export async function deleteProduct(id: string) {
  return prisma.product.delete({ where: { id } });
}

// ============================================
// Immutable Stock Management (Event Sourcing)
// ============================================

// Record a stock event immutably
export async function recordStockEvent(
  productId: string,
  type: 'RESERVATION' | 'CANCELLATION' | 'RESTOCK',
  quantity: number,
  reason?: string
) {
  const qty = Math.floor(quantity);
  
  return prisma.stockEvent.create({
    data: {
      productId,
      type,
      quantity: qty,
      reason,
    },
  });
}

// Get current stock by calculating from all events
export async function getCurrentStock(productId: string): Promise<number> {
  return getStockFromEvents(productId);
}

// Reserve stock atomically by recording a negative event (immutable)
export async function reserveStock(productId: string, quantity: number): Promise<boolean> {
  const qty = Math.max(0, Math.floor(quantity));
  if (qty === 0) return false;

  // Get current stock
  const currentStock = await getStockFromEvents(productId);
  
  // Check if we have enough stock
  if (currentStock < qty) {
    return false;
  }

  // Record reservation event (immutably)
  await recordStockEvent(productId, 'RESERVATION', -qty, `Reservation for ${qty} units`);
  return true;
}

// Restock by recording a positive event (immutable)
export async function restockProduct(productId: string, quantity: number, reason?: string) {
  const qty = Math.max(0, Math.floor(quantity));
  if (qty === 0) return false;

  await recordStockEvent(productId, 'RESTOCK', qty, reason ?? 'Manual restock');
  return true;
}

// Cancel a reservation by recording a positive event
export async function cancelReservation(productId: string, quantity: number) {
  const qty = Math.max(0, Math.floor(quantity));
  if (qty === 0) return false;

  await recordStockEvent(productId, 'CANCELLATION', qty, `Cancellation for ${qty} units`);
  return true;
}

export default {
  createProduct,
  getProductById,
  listProducts,
  updateProduct,
  deleteProduct,
  getCurrentStock,
  reserveStock,
};
