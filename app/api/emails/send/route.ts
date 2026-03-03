import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { to, subject, text, html } = await request.json()
  // In demo mode just log
  console.log('Email send request:', { to, subject, text, html })
  // TODO: integrate real provider (SendGrid, Nodemailer, etc.)
  return NextResponse.json({ sent: true })
}
