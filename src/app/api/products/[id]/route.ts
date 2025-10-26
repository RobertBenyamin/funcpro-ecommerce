import { NextResponse } from 'next/server';
import * as productService from '../../../../lib/product';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = await productService.getProductById(id);
  if (!p) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  return NextResponse.json(p);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  try {
    const updated = await productService.updateProduct(id, body);
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Failed to update' }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await productService.deleteProduct(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Failed to delete' }, { status: 400 });
  }
}
