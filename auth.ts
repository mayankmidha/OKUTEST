import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        let user = null
 
        // logic to verify if user exists
        user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        })
 
        if (!user) {
          throw new Error("User not found.")
        }
        
        if (!user.password) {
            throw new Error("User has no password set.")
        }

        const passwordsMatch = await bcrypt.compare(credentials.password as string, user.password)

        if (!passwordsMatch) {
            throw new Error("Invalid password.")
        }
 
        // return user object with their profile data
        return user
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  secret: process.env.AUTH_SECRET,
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
    async jwt({ token }: { token: any }) {
      if (!token.sub) return token;
      const user = await prisma.user.findUnique({ where: { id: token.sub } });
      if (!user) return token;
      token.role = user.role;
      return token;
    },
    async redirect({ url, baseUrl }: { url: string, baseUrl: string }) {
      // If the user is just logging in and being sent to /dashboard (default), 
      // we can let the middleware or the page itself handle the refined redirect,
      // or we can try to influence it here. 
      // However, the cleanest way is often a middleware or a client-side check.
      // For now, let's ensure it at least returns to the baseUrl if it's an internal link.
      if (url.startsWith("/")) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    }
  }
})
