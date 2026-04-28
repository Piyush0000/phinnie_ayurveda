import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import connectDB, { isDatabaseConfigured } from './mongodb'
import User from '@/models/User'

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!isDatabaseConfigured()) return null
        const email = String(credentials?.email ?? '').toLowerCase().trim()
        const password = String(credentials?.password ?? '')
        if (!email || !password) return null
        await connectDB()
        const user = await User.findOne({ email }).lean()
        if (!user || !user.password) return null
        const ok = await bcrypt.compare(password, user.password)
        if (!ok) return null
        return {
          id: String(user._id),
          email: user.email,
          name: user.name ?? user.email,
          image: user.image ?? null,
          role: user.role,
        }
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google' && user.email && isDatabaseConfigured()) {
        await connectDB()
        const existing = await User.findOne({ email: user.email })
        if (!existing) {
          await User.create({
            email: user.email,
            name: user.name,
            image: user.image,
            role: 'CUSTOMER',
            emailVerified: new Date(),
          })
        }
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: 'CUSTOMER' | 'ADMIN' }).role ?? 'CUSTOMER'
        token.id = (user as { id?: string }).id ?? token.sub
      } else if (token.email && isDatabaseConfigured() && !token.role) {
        try {
          await connectDB()
          const dbUser = await User.findOne({ email: token.email }).lean()
          if (dbUser) {
            token.role = dbUser.role
            token.id = String(dbUser._id)
          }
        } catch {
          // ignore — token will still work for the session
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) ?? token.sub ?? ''
        session.user.role = (token.role as 'CUSTOMER' | 'ADMIN') ?? 'CUSTOMER'
      }
      return session
    },
  },
})

declare module 'next-auth' {
  interface User {
    role?: 'CUSTOMER' | 'ADMIN'
  }
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      role: 'CUSTOMER' | 'ADMIN'
    }
  }
}

