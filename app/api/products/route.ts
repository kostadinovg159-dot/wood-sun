import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  // simple seed logic: if no products exist, create sample data
  const count = await prisma.product.count()
  if (count === 0) {
    const classicWalnut = await prisma.product.create({
      data: {
        name: 'Classic Walnut',
        slug: 'classic-walnut',
        description: 'Handcrafted walnut sunglasses with classic design',
        price: 79.99,
        b2bPrice: 49.99,
        images: [],
        material: 'Walnut',
        style: 'Classic',
        isPolarized: false,
      },
    })
    await prisma.productVariant.createMany({
      data: [
        { productId: classicWalnut.id, name: 'Natural Brown / Dark Lenses', sku: 'CW-NAT-DRK', color: 'Natural Brown', lensType: 'Regular', priceDifference: 0, stock: 50 },
        { productId: classicWalnut.id, name: 'Ebony / Amber Lenses', sku: 'CW-EBO-AMB', color: 'Ebony', lensType: 'UV Protection', priceDifference: 10, stock: 30 },
      ],
    })

    const modernBamboo = await prisma.product.create({
      data: {
        name: 'Modern Bamboo',
        slug: 'modern-bamboo',
        description: 'Eco-friendly bamboo with modern aesthetic',
        price: 89.99,
        b2bPrice: 54.99,
        images: [],
        material: 'Bamboo',
        style: 'Modern',
        isPolarized: false,
      },
    })
    await prisma.productVariant.createMany({
      data: [
        { productId: modernBamboo.id, name: 'Light Bamboo / Green Lenses', sku: 'MB-LGT-GRN', color: 'Light Bamboo', lensType: 'Regular', priceDifference: 0, stock: 40 },
        { productId: modernBamboo.id, name: 'Dark Bamboo / Smoke Lenses', sku: 'MB-DRK-SMK', color: 'Dark Bamboo', lensType: 'UV Protection', priceDifference: 10, stock: 25 },
      ],
    })

    const polarizedMaple = await prisma.product.create({
      data: {
        name: 'Polarized Maple',
        slug: 'polarized-maple',
        description: 'Premium maple with polarized lenses',
        price: 99.99,
        b2bPrice: 64.99,
        images: [],
        material: 'Maple',
        style: 'Classic',
        isPolarized: true,
      },
    })
    await prisma.productVariant.createMany({
      data: [
        { productId: polarizedMaple.id, name: 'Honey Maple / Polarized Brown', sku: 'PM-HON-POL', color: 'Honey Maple', lensType: 'Polarized', priceDifference: 0, stock: 35 },
        { productId: polarizedMaple.id, name: 'Red Maple / Polarized Grey', sku: 'PM-RED-POL', color: 'Red Maple', lensType: 'Polarized', priceDifference: 15, stock: 20 },
      ],
    })
  }

  const products = await prisma.product.findMany({
    include: { variants: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(products)
}

export async function POST(request: Request) {
  const body = await request.json()
  const { name, slug, description, price, b2bPrice, images, videoEmbedUrl, videoFileUrl, material, style, isPolarized, variants } = body

  if (!name || !slug || !price || !material || !style) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      description: description || '',
      price: parseFloat(price),
      b2bPrice: b2bPrice ? parseFloat(b2bPrice) : null,
      images: images || [],
      videoEmbedUrl: videoEmbedUrl || null,
      videoFileUrl: videoFileUrl || null,
      material,
      style,
      isPolarized: !!isPolarized,
    },
  })

  if (variants && variants.length > 0) {
    await prisma.productVariant.createMany({
      data: variants.map((v: any) => ({
        productId: product.id,
        name: v.name,
        sku: v.sku,
        color: v.color,
        lensType: v.lensType,
        priceDifference: parseFloat(v.priceDifference) || 0,
        stock: parseInt(v.stock) || 0,
      })),
    })
  }

  const full = await prisma.product.findUnique({ where: { id: product.id }, include: { variants: true } })
  return NextResponse.json(full, { status: 201 })
}
