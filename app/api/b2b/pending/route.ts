import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const requests = await prisma.b2BRequest.findMany({
    where: { approved: false },
    orderBy: { submittedAt: 'desc' },
  })
  return NextResponse.json(requests)
}
