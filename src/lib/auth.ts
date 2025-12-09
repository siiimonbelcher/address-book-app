import type { NextAuthOptions } from 'next-auth'
import NextAuth, { getServerSession } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import { verifyPassword } from './security/password'
import { loginSchema } from './validators'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const { email, password } = loginSchema.parse(credentials)

          const user = await prisma.user.findUnique({
            where: { email },
          })

          if (!user) {
            return null
          }

          const isValid = await verifyPassword(password, user.passwordHash)

          if (!isValid) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name || null,
          }
        } catch (error) {
          console.error('Authorization error:', error)
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export function auth() {
  return getServerSession(authOptions)
}

export default NextAuth(authOptions)
