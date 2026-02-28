import { NextResponse } from 'next/server'

// Mock database
const products = [
  {
    id: '1',
    name: 'Classic Walnut',
    slug: 'classic-walnut',
    price: 79.99,
    b2bPrice: 49.99,
    description: 'Handcrafted walnut sunglasses with classic design',
    material: 'Walnut',
    style: 'Classic',
    isPolarized: false,
    image: '😎',
  },
  {
    id: '2',
    name: 'Modern Bamboo',
    slug: 'modern-bamboo',
    price: 89.99,
    b2bPrice: 54.99,
    description: 'Eco-friendly bamboo with modern aesthetic',
    material: 'Bamboo',
    style: 'Modern',
    isPolarized: false,
    image: '😎',
  },
  {
    id: '3',
    name: 'Polarized Maple',
    slug: 'polarized-maple',
    price: 99.99,
    b2bPrice: 64.99,
    description: 'Premium maple with polarized lenses',
    material: 'Maple',
    style: 'Classic',
    isPolarized: true,
    image: '😎',
  },
]

export async function GET() {
  return NextResponse.json(products)
}
