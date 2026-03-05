import NextAuth, { type NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import EmailProvider from 'next-auth/providers/email'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/db'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST || 'localhost',
        port: parseInt(process.env.EMAIL_SERVER_PORT || '465'),
        auth: {
          user: process.env.EMAIL_SERVER_USER || '',
          pass: process.env.EMAIL_SERVER_PASSWORD || '',
        },
      },
      from: process.env.EMAIL_FROM || 'noreply@woodsun.com',
      sendVerificationRequest: async ({ identifier, url }) => {
        if (process.env.NODE_ENV !== 'production') {
          // In development, print the magic link to the server terminal
          console.log(`\n========================================`)
          console.log(`🔑  MAGIC LINK for ${identifier}`)
          console.log(`👉  ${url}`)
          console.log(`========================================\n`)
          return
        }
        // Production: send via configured SMTP
        const { createTransport } = await import('nodemailer')
        const transport = createTransport({
          host: process.env.EMAIL_SERVER_HOST,
          port: parseInt(process.env.EMAIL_SERVER_PORT || '465'),
          auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD,
          },
        })
        await transport.sendMail({
          to: identifier,
          from: process.env.EMAIL_FROM || 'noreply@woodsun.com',
          subject: 'Sign in to WoodSun',
          text: `Sign in to WoodSun:\n\n${url}\n\nThis link expires in 24 hours.`,
          html: `<p>Click below to sign in to WoodSun:</p><p><a href="${url}">Sign in</a></p><p>This link expires in 24 hours.</p>`,
        })
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
        const isAdmin = !!(process.env.ADMIN_EMAIL && user.email === process.env.ADMIN_EMAIL)
        // on first login, ensure user record exists; promote to ADMIN if email matches
        await prisma.user.upsert({
          where: { email: user.email || '' },
          update: isAdmin ? { role: 'ADMIN' } : {},
          create: {
            email: user.email || '',
            name: user.name || '',
            image: user.image,
            role: isAdmin ? 'ADMIN' : 'CUSTOMER',
          },
        }).catch((e) => console.error('Failed to upsert user', e))
      }
      return token
    },
    async session({ session, token }) {
      try {
        if (session.user) {
          // token.sub holds user id
          const dbUser = await prisma.user.findUnique({
            where: { id: token.sub as string },
          })
          if (dbUser) {
            const u: any = session.user
            u.id = dbUser.id
            u.role = dbUser.role
            u.isB2B = dbUser.isB2B
            u.companyName = dbUser.companyName
            u.vatNumber = dbUser.vatNumber
            u.b2bApproved = dbUser.b2bApproved
          }
        }
      } catch (err) {
        console.error('session callback error', err)
      }
      return session
    },
  },
}

export default NextAuth(authOptions)
