import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const schema = z.object({
  companyName: z.string().min(1),
  email: z.string().email(),
  vatNumber: z.string().optional(),
  message: z.string().optional(),
})

export async function POST(request: Request) {
  const json = await request.json()
  const data = schema.safeParse(json)
  if (!data.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const record = await prisma.b2BRequest.create({
    data: {
      companyName: data.data.companyName,
      email: data.data.email,
      vatNumber: data.data.vatNumber,
      message: data.data.message,
    },
  })

  // notify admin (async)
  fetch(`${process.env.NEXTAUTH_URL}/api/emails/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: 'admin@woodsun.com',
      subject: 'New B2B Registration',
      text: `Company: ${record.companyName}\nEmail: ${record.email}`,
    }),
  }).catch(console.error)

  return NextResponse.json({ success: true })
}
