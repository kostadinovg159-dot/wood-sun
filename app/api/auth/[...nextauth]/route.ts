import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

// Next.js 15 requires dynamic rendering for auth routes
export const dynamic = 'force-dynamic'

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
