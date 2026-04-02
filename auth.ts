import NextAuth, { DefaultSession } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import speakeasy from "speakeasy"

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
        twoFactorCode: { label: "2FA Code", type: "text" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const email = credentials.email as string
        const password = credentials.password as string
        const twoFactorCode = credentials.twoFactorCode as string | undefined

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

          if (user.twoFactorEnabled) {
            if (!twoFactorCode) {
              throw new Error("2FA code required")
            }
            if (!user.twoFactorSecret) {
              throw new Error("2FA is enabled but no secret is configured")
            }
            
            const isValidToken = speakeasy.totp.verify({
              secret: user.twoFactorSecret,
              encoding: 'base32',
              token: twoFactorCode
            })

            if (!isValidToken) {
              throw new Error("Invalid 2FA code")
            }
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
          throw error // Throw the error so the client can handle specific messages like "2FA code required"
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
        if (session.user) {
          session.user.id = token.id || token.sub;
          session.user.role = token.role;
          session.user.hasSignedConsent = !!token.hasSignedConsent;
        }
        return session;
    },
    async jwt({ token, user, trigger, session }: { token: any, user?: any, trigger?: string, session?: any }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.hasSignedConsent = !!user.hasSignedConsent;
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

      // Secondary safety: If hasSignedConsent is missing, fetch from DB once (optional but safer)
      if (token.id && token.hasSignedConsent === undefined) {
          const u = await prisma.user.findUnique({ where: { id: token.id }, select: { hasSignedConsent: true } });
          token.hasSignedConsent = !!u?.hasSignedConsent;
      }
      
      return token;
    }
  }
})
