import { NextResponse } from 'next/server'

// optionally use nodemailer when environment is configured
let transporter: any = null
if (process.env.EMAIL_SERVER_HOST) {
  try {
    // lazy import to avoid dependency if unused
    const nodemailer = require('nodemailer')
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
      secure: process.env.EMAIL_SERVER_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    })
  } catch (e) {
    console.warn('nodemailer not available or failed to configure', e)
  }
}

export async function POST(request: Request) {
  const { to, subject, text, html } = await request.json()

  if (transporter) {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || 'noreply@woodsun.com',
        to,
        subject,
        text,
        html,
      })
      return NextResponse.json({ sent: true })
    } catch (err) {
      console.error('email send error', err)
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }
  }

  // fallback: log to console
  console.log('Email send request:', { to, subject, text, html })
  return NextResponse.json({ sent: true, demo: true })
}
