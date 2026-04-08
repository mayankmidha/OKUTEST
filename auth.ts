import NextAuth, { DefaultSession } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import Apple from "next-auth/providers/apple"
import { CredentialsSignin } from "next-auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import speakeasy from "speakeasy"
import { ensureUserAppSetup, getAuthUserState, hasPendingEmailVerification, normalizeAuthEmail } from "@/lib/auth-user"

class EmailNotVerifiedError extends CredentialsSignin {
  code = "email_not_verified"
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      hasSignedConsent: boolean
      adhdDiagnosed: boolean
      practitionerVerified: boolean
      practitionerOnboarded: boolean
      isDeleted: boolean
      emailVerified: boolean
    } & DefaultSession["user"]
  }
  
  interface User {
    role: string
    hasSignedConsent: boolean
    adhdDiagnosed: boolean
    practitionerVerified: boolean
    practitionerOnboarded: boolean
    isDeleted: boolean
    emailVerified: boolean
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: process.env.NODE_ENV === 'development',
  adapter: PrismaAdapter(prisma) as any,
  session: {
    strategy: 'jwt',
    maxAge: 15 * 60, // 15 minutes (HIPAA compliance)
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Apple({
      clientId: process.env.APPLE_ID,
      clientSecret: process.env.APPLE_SECRET,
      allowDangerousEmailAccountLinking: true,
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

        const email = normalizeAuthEmail(credentials.email as string)
        const password = credentials.password as string
        const twoFactorCode = credentials.twoFactorCode as string | undefined

        try {
          const user = await prisma.user.findUnique({
            where: { email },
            include: {
              clientProfile: true,
              practitionerProfile: {
                select: {
                  isVerified: true,
                  isOnboarded: true,
                },
              },
            }
          })

          if (!user || !user.password || user.deletionRequestedAt) {
            return null
          }

          if (!user.emailVerified && await hasPendingEmailVerification(email)) {
            throw new EmailNotVerifiedError()
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
            adhdDiagnosed: !!user.clientProfile?.adhdDiagnosed,
            practitionerVerified: !!user.practitionerProfile?.isVerified,
            practitionerOnboarded: !!user.practitionerProfile?.isOnboarded,
            isDeleted: !!user.deletionRequestedAt,
            emailVerified: !!user.emailVerified,
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
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  callbacks: {
    async signIn({ user, account }: { user: any, account?: any }) {
      if (!user?.id) {
        return false
      }

      const authState = await getAuthUserState(user.id)

      if (authState?.isDeleted) {
        return false
      }

      if (account?.provider && account.provider !== 'credentials') {
        await ensureUserAppSetup(user.id, {
          name: user.name,
          markEmailVerified: true,
        })
      }

      return true
    },
    async session({ session, token }: { session: any, token: any }) {
        if (session.user) {
          session.user.id = token.id || token.sub;
          session.user.role = token.role;
          session.user.hasSignedConsent = !!token.hasSignedConsent;
          session.user.adhdDiagnosed = !!token.adhdDiagnosed;
          session.user.practitionerVerified = !!token.practitionerVerified;
          session.user.practitionerOnboarded = !!token.practitionerOnboarded;
          session.user.isDeleted = !!token.isDeleted;
          session.user.emailVerified = !!token.emailVerified;
        }
        return session;
    },
    async jwt({ token, user, trigger, session }: { token: any, user?: any, trigger?: string, session?: any }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.hasSignedConsent = !!user.hasSignedConsent;
        token.adhdDiagnosed = !!user.adhdDiagnosed;
        token.practitionerVerified = !!user.practitionerVerified;
        token.practitionerOnboarded = !!user.practitionerOnboarded;
        token.isDeleted = !!user.isDeleted;
        token.emailVerified = !!user.emailVerified;
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

      // Secondary safety: hydrate mutable flags from the database.
      if (
        token.id &&
        (
          token.role === undefined ||
          token.hasSignedConsent === undefined ||
          token.adhdDiagnosed === undefined ||
          token.practitionerVerified === undefined ||
          token.practitionerOnboarded === undefined ||
          token.emailVerified === undefined ||
          token.role === 'THERAPIST' ||
          token.isDeleted === undefined
        )
      ) {
          const u = await getAuthUserState(token.id)
          token.role = u?.role
          token.hasSignedConsent = !!u?.hasSignedConsent;
          token.adhdDiagnosed = !!u?.adhdDiagnosed;
          token.practitionerVerified = !!u?.practitionerVerified;
          token.practitionerOnboarded = !!u?.practitionerOnboarded;
          token.isDeleted = !!u?.isDeleted;
          token.emailVerified = !!u?.emailVerified;
      }
      
      return token;
    }
  }
})
