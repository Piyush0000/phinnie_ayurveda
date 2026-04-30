import type { NextAuthConfig } from 'next-auth'

export default {
  trustHost: true,
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: 'CUSTOMER' | 'ADMIN' }).role ?? 'CUSTOMER'
        token.id = (user as { id?: string }).id ?? token.sub
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
} satisfies NextAuthConfig
