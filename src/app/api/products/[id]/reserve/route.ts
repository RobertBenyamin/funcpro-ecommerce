import { NextResponse } from 'next/server';
import * as productService from '../../../../../lib/product';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const qty = body?.quantity ?? body?.qty ?? 0;

  if (!qty || typeof qty !== 'number' || qty <= 0) {
    return NextResponse.json({ error: 'quantity must be a positive number' }, { status: 400 });
  }

  try {
    const ok = await productService.reserveStock(id, qty);
    if (!ok) return NextResponse.json({ error: 'Insufficient stock' }, { status: 409 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Failed to reserve' }, { status: 500 });
  }
}
