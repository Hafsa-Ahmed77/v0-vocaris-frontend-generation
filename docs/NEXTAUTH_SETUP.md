# NextAuth.js Google OAuth Setup Guide

## Overview
This project uses NextAuth.js with Google OAuth2 for authentication. Follow these steps to set up Google authentication.

## Prerequisites
- Google Cloud Console account
- Vercel account (for deployment)

## Local Development Setup

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click "Enable"
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (local development)
     - `https://yourdomain.com/api/auth/callback/google` (production)
   - Copy the Client ID and Client Secret

### 2. Set Environment Variables

Create a `.env.local` file in the project root:

\`\`\`
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_here
\`\`\`

Generate a secure NEXTAUTH_SECRET:
\`\`\`bash
openssl rand -base64 32
\`\`\`

### 3. Install Dependencies

\`\`\`bash
npm install next-auth
\`\`\`

### 4. Test Locally

\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000/auth` and click "Continue with Google"

## Production Deployment (Vercel)

1. Go to your Vercel project settings
2. Add environment variables:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `NEXTAUTH_URL` (set to your production domain)
   - `NEXTAUTH_SECRET` (use a new secure secret)
3. Deploy your project

## File Structure

- `app/api/auth/[...nextauth]/route.ts` - NextAuth.js configuration
- `middleware.ts` - Protected route middleware
- `components/auth/google-sign-in-button.tsx` - Sign-in button component
- `components/auth/user-menu.tsx` - User dropdown menu with logout
- `lib/auth.ts` - Auth utility functions

## Troubleshooting

### "Invalid redirect_uri" error
- Ensure the redirect URI in Google Cloud Console matches your app URL
- For local: `http://localhost:3000/api/auth/callback/google`
- For production: `https://yourdomain.com/api/auth/callback/google`

### Session not persisting
- Check that `NEXTAUTH_SECRET` is set correctly
- Verify cookies are enabled in your browser
- Check browser console for errors

### User not redirected to dashboard
- Verify the redirect callback in `app/api/auth/[...nextauth]/route.ts`
- Check that `/dashboard` route exists and is protected by middleware
