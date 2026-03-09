import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { variants: true },
  })
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(product)
}

export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const body = await request.json()
  const { name, description, price, b2bPrice, images, videoEmbedUrl, videoFileUrl, material, style, isPolarized } = body

  const product = await prisma.product.update({
    where: { slug },
    data: {
      name,
      description,
      price: parseFloat(price),
      b2bPrice: b2bPrice ? parseFloat(b2bPrice) : null,
      images: images || [],
      videoEmbedUrl: videoEmbedUrl || null,
      videoFileUrl: videoFileUrl || null,
      material,
      style,
      isPolarized: !!isPolarized,
    },
    include: { variants: true },
  })

  return NextResponse.json(product)
}

export async function DELETE(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { variants: true },
  })
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const variantIds = product.variants.map((v) => v.id)

  // Remove cart items referencing these variants first
  if (variantIds.length > 0) {
    await prisma.cartItem.deleteMany({ where: { variantId: { in: variantIds } } })
  }

  await prisma.product.delete({ where: { slug } })
  return NextResponse.json({ ok: true })
}
