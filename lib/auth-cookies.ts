/**
 * lib/auth-cookies.ts
 * 
 * Simple utility to manage the 'vocaris_token' cookie 
 * for server-side middleware access.
 */

export const AUTH_COOKIE_NAME = "vocaris_token";

export function setAuthCookie(token: string) {
  if (typeof document === "undefined") return;
  
  // Set cookie with 7 day expiry
  const maxAge = 7 * 24 * 60 * 60;
  document.cookie = `${AUTH_COOKIE_NAME}=${token}; path=/; max-age=${maxAge}; SameSite=Lax; Secure`;
  console.log("[Auth] Cookie set for Middleware.");
}

export function clearAuthCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; Secure`;
  console.log("[Auth] Cookie cleared.");
}
