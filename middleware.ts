import { withAuth } from "next-auth/middleware"

export const middleware = withAuth({
  pages: {
    signIn: "/auth",
  },
})

export const config = {
  matcher: ["/dashboard/:path*", "/meetings/:path*", "/scrum/:path*", "/settings/:path*", "/chatbot/:path*"],
}
