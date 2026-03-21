import NextAuth, { DefaultSession } from "next-auth"
import Credentials from "next-auth/providers/credentials"

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
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        // Demo mode - accept any email/password
        const email = credentials.email as string
        const password = credentials.password as string
        
        if (!email || !password) {
          throw new Error("Email and password required")
        }
        
        // Determine role based on email
        const isAdmin = email.includes('admin')
        const isTherapist = email.includes('therapist') || email.includes('doctor') || email.includes('dr.')
        
        let role = 'CLIENT'
        if (isAdmin) role = 'ADMIN'
        else if (isTherapist) role = 'THERAPIST'
        
        return {
          id: Math.random().toString(36).substr(2, 9),
          email,
          name: email.split('@')[0],
          role
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  secret: process.env.AUTH_SECRET || "demo-secret-key",
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
