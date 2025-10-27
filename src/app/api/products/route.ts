import { NextResponse } from 'next/server';
import * as productService from '../../../lib/product';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const skip = parseInt(url.searchParams.get('skip') || '0', 10) || 0;
  const take = parseInt(url.searchParams.get('take') || '50', 10) || 50;

  const products = await productService.listProducts(skip, take);
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const body = await request.json();

  // Expecting sellerId to be provided in the request body for now.
  const { sellerId } = body;
  if (!sellerId) {
    return NextResponse.json({ error: 'sellerId is required' }, { status: 400 });
  }

  try {
    const created = await productService.createProduct(body, sellerId);
    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Failed to create product' }, { status: 500 });
  }
}
