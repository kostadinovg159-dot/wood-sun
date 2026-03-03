import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
  const { id } = await request.json()
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  try {
    const updated = await prisma.b2BRequest.update({
      where: { id },
      data: { approved: true },
    })
    return NextResponse.json(updated)
  } catch (e) {
    return NextResponse.json({ error: 'Unable to approve' }, { status: 500 })
  }
}
