// This file contains helper functions for authentication flows

import { signIn as nextAuthSignIn, signOut as nextAuthSignOut } from "next-auth/react"

/**
 * Sign in with Google using NextAuth.js
 */
export async function signInWithGoogle() {
  try {
    const result = await nextAuthSignIn("google", {
      redirect: true,
      redirectTo: "/dashboard",
    })
    return result
  } catch (error) {
    console.error("[v0] Google Sign-in error:", error)
    throw error
  }
}

/**
 * Add demo sign-in function for testing without Google credentials
 */
export async function signInWithDemo() {
  try {
    const result = await nextAuthSignIn("credentials", {
      email: "demo@vocaris.ai",
      redirect: true,
      redirectTo: "/dashboard",
    })
    return result
  } catch (error) {
    console.error("[v0] Demo sign-in error:", error)
    throw error
  }
}

/**
 * Sign out the current user
 */
export async function signOut() {
  try {
    await nextAuthSignOut({
      redirect: true,
      redirectTo: "/",
    })
    return { success: true }
  } catch (error) {
    console.error("[v0] Sign out error:", error)
    throw error
  }
}

/**
 * Get current user session (client-side)
 * Use useSession hook from next-auth/react for client components
 */
export async function getCurrentUser() {
  try {
    // This is a server-side function
    // For client-side, use useSession() hook from next-auth/react
    return null
  } catch (error) {
    console.error("[v0] Get current user error:", error)
    return null
  }
}
