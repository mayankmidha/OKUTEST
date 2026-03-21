import NextAuth, { DefaultSession } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
    } & DefaultSession["user"]
  }
  
  interface User {
    role: string
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
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

        // REAL Authentication from DB
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
          role: user.role
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
  trustHost: true,
  callbacks: {
    async session({ session, token }: { session: any, token: any }) {
        if (token.sub && session.user) {
          session.user.id = token.sub;
        }
        if (token.role && session.user) {
          session.user.role = token.role;
        }
        return session;
    },
    async jwt({ token, user }: { token: any, user?: any }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    }
  }
})
