# NextAuth.js Google OAuth Setup Guide

## Overview
This project uses NextAuth.js with Google OAuth2 for authentication. This guide covers local development and production deployment.

## Prerequisites
- Google Cloud Console account
- Node.js 16+ installed
- Vercel account (for deployment)

## Local Development Setup

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project:
   - Click the project dropdown at the top
   - Click "New Project"
   - Enter "Vocaris" as the project name
   - Click "Create"

3. Enable Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click on it and click "Enable"

4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - If prompted, configure the OAuth consent screen first:
     - Choose "External" user type
     - Fill in the required fields
     - Add your email as a test user
     - Click "Save and Continue"
   - Choose "Web application" as the application type
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google`
     - `http://127.0.0.1:3000/api/auth/callback/google`
   - Click "Create"
   - Copy the **Client ID** and **Client Secret**

### 2. Set Environment Variables

#### In v0:
1. Click **Vars** in the left sidebar
2. Add these environment variables:

\`\`\`
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_here
\`\`\`

#### Generate NEXTAUTH_SECRET:
\`\`\`bash
openssl rand -base64 32
\`\`\`

Or use an online generator: https://generate-secret.vercel.app/32

### 3. Install Dependencies

The project already includes NextAuth.js, but if you need to install it:

\`\`\`bash
npm install next-auth
\`\`\`

### 4. Test Locally

1. Click **Preview** in v0
2. Navigate to `http://localhost:3000/auth`
3. Click "Continue with Google"
4. Sign in with your Google account
5. You should be redirected to `/dashboard`

## Production Deployment (Vercel)

### 1. Update Google OAuth Credentials

1. Go back to Google Cloud Console
2. Go to "APIs & Services" > "Credentials"
3. Click on your OAuth 2.0 client ID
4. Add your production redirect URI:
   - `https://yourdomain.com/api/auth/callback/google`
5. Click "Save"

### 2. Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. In "Environment Variables", add:
   - `GOOGLE_CLIENT_ID` (from Google Cloud Console)
   - `GOOGLE_CLIENT_SECRET` (from Google Cloud Console)
   - `NEXTAUTH_URL` (your production domain, e.g., `https://vocaris.vercel.app`)
   - `NEXTAUTH_SECRET` (generate a new one: `openssl rand -base64 32`)
6. Click "Deploy"

### 3. Update NEXTAUTH_URL

After deployment, update the `NEXTAUTH_URL` environment variable to your production domain:
- Go to Vercel project settings
- Go to "Environment Variables"
- Update `NEXTAUTH_URL` to your production domain
- Redeploy

## File Structure

\`\`\`
app/
├── api/auth/[...nextauth]/route.ts     # NextAuth configuration
├── auth/page.tsx                        # Sign-in page
└── (app)/
    └── dashboard/page.tsx               # Protected dashboard

components/
├── auth/
│   ├── google-sign-in-button.tsx        # Google sign-in button
│   ├── demo-sign-in-button.tsx          # Demo sign-in button
│   └── user-menu.tsx                    # User dropdown menu
└── layout/
    └── topbar.tsx                       # Topbar with user menu

lib/
└── auth.ts                              # Auth utility functions

middleware.ts                            # Protected route middleware
\`\`\`

## Configuration Details

### NextAuth.js Configuration
Located in `app/api/auth/[...nextauth]/route.ts`:

- **Providers**: Google OAuth2 and Demo (Credentials)
- **Session Strategy**: JWT (JSON Web Tokens)
- **Session Max Age**: 30 days
- **Redirect**: After sign-in, users are redirected to `/dashboard`

### Middleware
Located in `middleware.ts`:

- Protects `/dashboard` and `/app/*` routes
- Redirects unauthenticated users to `/auth`
- Allows public access to landing page and auth pages

### User Menu
Located in `components/auth/user-menu.tsx`:

- Shows user avatar and name
- Dropdown menu with logout option
- Accessible via topbar in dashboard

## Troubleshooting

### "Invalid redirect_uri" Error
**Problem**: Google returns "redirect_uri_mismatch" error

**Solution**:
1. Go to Google Cloud Console
2. Go to "APIs & Services" > "Credentials"
3. Click on your OAuth 2.0 client ID
4. Verify the redirect URI matches exactly:
   - Local: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`
5. Note: `http://localhost:3000` and `http://127.0.0.1:3000` are different URIs

### "NEXTAUTH_SECRET not set" Error
**Problem**: NextAuth.js requires a secret for JWT signing

**Solution**:
1. Generate a secret: `openssl rand -base64 32`
2. Add it to your environment variables as `NEXTAUTH_SECRET`
3. Restart your development server

### Session Not Persisting
**Problem**: User is logged out after page refresh

**Solution**:
1. Check that `NEXTAUTH_SECRET` is set correctly
2. Verify cookies are enabled in your browser
3. Check browser console for errors
4. Clear browser cookies and try again

### User Not Redirected to Dashboard
**Problem**: After sign-in, user stays on auth page

**Solution**:
1. Check that `/dashboard` route exists
2. Verify middleware is configured correctly in `middleware.ts`
3. Check browser console for errors
4. Verify `NEXTAUTH_URL` is set correctly

### Demo Sign-In Not Working
**Problem**: Demo button doesn't work

**Solution**:
1. Ensure `NEXTAUTH_SECRET` is set
2. Check that CredentialsProvider is configured in `app/api/auth/[...nextauth]/route.ts`
3. Try clearing browser cookies
4. Check browser console for errors

## Security Best Practices

1. **Never commit secrets**: Use environment variables for all sensitive data
2. **Use HTTPS in production**: Always use HTTPS for production deployments
3. **Rotate secrets regularly**: Change `NEXTAUTH_SECRET` periodically
4. **Validate user input**: Always validate and sanitize user input
5. **Use Row Level Security**: If using Supabase, enable RLS on all tables
6. **Keep dependencies updated**: Regularly update NextAuth.js and other dependencies

## Advanced Configuration

### Add GitHub OAuth
\`\`\`typescript
import GitHubProvider from "next-auth/providers/github"

providers: [
  GitHubProvider({
    clientId: process.env.GITHUB_ID || "",
    clientSecret: process.env.GITHUB_SECRET || "",
  }),
]
\`\`\`

### Add Email Sign-In
\`\`\`typescript
import EmailProvider from "next-auth/providers/email"

providers: [
  EmailProvider({
    server: process.env.EMAIL_SERVER,
    from: process.env.EMAIL_FROM,
  }),
]
\`\`\`

### Customize Session Callback
\`\`\`typescript
async session({ session, token }) {
  // Add custom properties to session
  if (session.user) {
    session.user.id = token.sub
    session.user.role = token.role // Custom property
  }
  return session
}
\`\`\`

## Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Deployment Guide](https://vercel.com/docs)
