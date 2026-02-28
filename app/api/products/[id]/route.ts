import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Mock data - in production, fetch from database
  const product = {
    id: params.id,
    name: 'Classic Walnut Sunglasses',
    slug: 'classic-walnut',
    price: 79.99,
    rating: 4.8,
    reviews: 127,
    description: 'Handcrafted wooden sunglasses made from premium walnut wood.',
    variants: [
      { id: 'brown-dark', name: 'Brown Frame + Dark Lenses', priceAdd: 0 },
      { id: 'brown-light', name: 'Brown Frame + Light Lenses', priceAdd: 5 },
      { id: 'brown-polarized', name: 'Brown Frame + Polarized Lenses', priceAdd: 20 },
    ],
  }

  return NextResponse.json(product)
}
