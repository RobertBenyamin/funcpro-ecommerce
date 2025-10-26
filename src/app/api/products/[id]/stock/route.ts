import { NextResponse } from 'next/server';
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

    // Calculate current stock by summing all event quantities
    const currentStock = events.reduce((acc, event) => acc + event.quantity, 0);

    return NextResponse.json({
      productId: id,
      productName: product.name,
      currentStock,
      totalEvents: events.length,
      lastUpdated: events.length > 0 ? events[events.length - 1].createdAt : product.createdAt,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Failed to calculate stock' }, { status: 500 });
  }
}
