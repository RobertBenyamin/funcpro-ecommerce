import { NextResponse } from 'next/server';
import * as productService from '../../../../../lib/product';
import prisma from '../../../../../lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    // Verify product exists
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Get all stock events for this product
    const events = await prisma.stockEvent.findMany({
      where: { productId: id },
      orderBy: { createdAt: 'asc' },
    });

    const currentStock = events.reduce((acc, event) => acc + event.quantity, 0);

    return NextResponse.json({
      productId: id,
      currentStock,
      totalEvents: events.length,
      events,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Failed to get stock events' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  const { type, quantity, reason } = body;

  // Validate input
  if (!type || !quantity) {
    return NextResponse.json({ error: 'type and quantity are required' }, { status: 400 });
  }

  if (typeof quantity !== 'number' || quantity === 0) {
    return NextResponse.json({ error: 'quantity must be a non-zero number' }, { status: 400 });
  }

  const validTypes = ['RESERVATION', 'CANCELLATION', 'RESTOCK'];
  if (!validTypes.includes(type)) {
    return NextResponse.json(
      { error: `type must be one of: ${validTypes.join(', ')}` },
      { status: 400 }
    );
  }

  try {
    // Verify product exists
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Record the stock event
    const event = await productService.recordStockEvent(id, type as any, quantity, reason);

    // Get updated current stock
    const currentStock = await productService.getCurrentStock(id);

    return NextResponse.json(
      {
        success: true,
        event,
        currentStock,
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Failed to record stock event' }, { status: 500 });
  }
}
