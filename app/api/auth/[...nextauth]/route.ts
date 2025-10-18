import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Demo",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "demo@vocaris.ai" },
      },
      async authorize(credentials) {
        // Demo user for testing
        if (credentials?.email === "demo@vocaris.ai") {
          return {
            id: "demo-user-123",
            name: "Demo User",
            email: "demo@vocaris.ai",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo",
          }
        }
        return null
      },
    }),
  ],
  pages: {
    signIn: "/auth",
    error: "/auth",
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub || ""
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Redirect to dashboard after sign-in
      if (url.startsWith(baseUrl)) {
        return url
      }
      return baseUrl + "/dashboard"
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }
