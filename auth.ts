import NextAuth, { DefaultSession } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      hasSignedConsent: boolean
    } & DefaultSession["user"]
  }
  
  interface User {
    role: string
    hasSignedConsent: boolean
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: process.env.NODE_ENV === 'development',
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const email = credentials.email as string
        const password = credentials.password as string

        try {
          const user = await prisma.user.findUnique({
            where: { email }
          })

          if (!user || !user.password) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(password, user.password)

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            hasSignedConsent: user.hasSignedConsent
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  callbacks: {
    async session({ session, token }: { session: any, token: any }) {
        if (token.sub && session.user) {
          session.user.id = token.sub;
        }
        if (token.role && session.user) {
          session.user.role = token.role;
        }
        if (typeof token.hasSignedConsent === 'boolean' && session.user) {
          session.user.hasSignedConsent = token.hasSignedConsent;
        }
        return session;
    },
    async jwt({ token, user, trigger, session }: { token: any, user?: any, trigger?: string, session?: any }) {
      if (user) {
        token.role = user.role;
        token.hasSignedConsent = user.hasSignedConsent;
      }
      
      // Handle session updates (e.g. after signing consent)
      if (trigger === "update" && session) {
        if (typeof session.hasSignedConsent === 'boolean') {
          token.hasSignedConsent = session.hasSignedConsent;
        }
        if (session.role) {
          token.role = session.role;
        }
      }
      
      return token;
    }
  }
})
