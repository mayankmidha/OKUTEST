import NextAuth, { DefaultSession } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import Apple from "next-auth/providers/apple"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import speakeasy from "speakeasy"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      hasSignedConsent: boolean
      adhdDiagnosed: boolean
    } & DefaultSession["user"]
  }
  
  interface User {
    role: string
    hasSignedConsent: boolean
    adhdDiagnosed: boolean
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: 'jwt',
    maxAge: 15 * 60, // 15 minutes (HIPAA compliance)
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Apple({
      clientId: process.env.APPLE_ID,
      clientSecret: process.env.APPLE_SECRET,
    }),
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
            where: { email },
            include: { clientProfile: true }
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
            hasSignedConsent: user.hasSignedConsent,
            adhdDiagnosed: !!user.clientProfile?.adhdDiagnosed
          }
        } catch (error) {
          console.error("Auth error:", error)
          throw error 
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
          session.user.adhdDiagnosed = !!token.adhdDiagnosed;
        }
        return session;
    },
    async jwt({ token, user, trigger, session }: { token: any, user?: any, trigger?: string, session?: any }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.hasSignedConsent = !!user.hasSignedConsent;
        token.adhdDiagnosed = !!user.adhdDiagnosed;
      }
      
      // Handle session updates
      if (trigger === "update" && session) {
        if (typeof session.hasSignedConsent === 'boolean') {
          token.hasSignedConsent = session.hasSignedConsent;
        }
        if (typeof session.adhdDiagnosed === 'boolean') {
          token.adhdDiagnosed = session.adhdDiagnosed;
        }
        if (session.role) {
          token.role = session.role;
        }
      }

      // Secondary safety: If hasSignedConsent or adhdDiagnosed is missing, fetch from DB once
      if (token.id && (token.hasSignedConsent === undefined || token.adhdDiagnosed === undefined)) {
          const u = await prisma.user.findUnique({ 
            where: { id: token.id }, 
            select: { hasSignedConsent: true, clientProfile: { select: { adhdDiagnosed: true } } } 
          });
          token.hasSignedConsent = !!u?.hasSignedConsent;
          token.adhdDiagnosed = !!u?.clientProfile?.adhdDiagnosed;
      }
      
      return token;
    }
  }
})
