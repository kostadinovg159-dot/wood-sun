import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
  const { id } = await request.json()
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  try {
    await prisma.b2BRequest.delete({ where: { id } })
    return NextResponse.json({ status: 'ok' })
  } catch (e) {
    return NextResponse.json({ error: 'Unable to reject' }, { status: 500 })
  }
}