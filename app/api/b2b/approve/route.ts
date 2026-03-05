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

    // ensure there is a User account for this email and mark it as B2B
    const user = await prisma.user.upsert({
      where: { email: updated.email },
      update: {
        isB2B: true,
        companyName: updated.companyName,
        vatNumber: updated.vatNumber,
        b2bApproved: true,
        role: 'B2B',
      },
      create: {
        email: updated.email,
        isB2B: true,
        companyName: updated.companyName,
        vatNumber: updated.vatNumber,
        b2bApproved: true,
        role: 'B2B',
      },
    })

    // send notification to applicant
    fetch(`${process.env.NEXTAUTH_URL}/api/emails/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: updated.email,
        subject: 'B2B Request Approved',
        text: 'Your business account has been approved. You can now log in.',
      }),
    }).catch(console.error)

    return NextResponse.json(updated)
  } catch (e) {
    return NextResponse.json({ error: 'Unable to approve' }, { status: 500 })
  }
}
