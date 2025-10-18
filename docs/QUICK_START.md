# Vocaris Frontend - Quick Start Guide

## 🚀 Get Started in 2 Minutes

### Option 1: Try Demo Mode (No Setup Required)
1. Click **Preview** in v0
2. Click **"Sign In"** button in the header
3. Click **"Try Demo"** button
4. You're in! Explore the dashboard with demo data

### Option 2: Set Up Google OAuth (5 Minutes)

#### Step 1: Get Google Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API (search in "APIs & Services" > "Library")
4. Go to "Credentials" > "Create Credentials" > "OAuth client ID"
5. Choose "Web application"
6. Add redirect URI: `http://localhost:3000/api/auth/callback/google`
7. Copy your **Client ID** and **Client Secret**

#### Step 2: Add Environment Variables
In v0, click **Vars** in the left sidebar and add:
\`\`\`
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_here
\`\`\`

Generate a secret:
\`\`\`bash
openssl rand -base64 32
\`\`\`

#### Step 3: Test It
1. Click **Preview**
2. Click **"Sign In"**
3. Click **"Continue with Google"**
4. Sign in with your Google account
5. You'll be redirected to the dashboard

## 📁 Project Structure

\`\`\`
app/
├── api/auth/[...nextauth]/route.ts    # NextAuth configuration
├── auth/page.tsx                       # Sign-in page
├── (app)/
│   ├── dashboard/page.tsx              # Main dashboard
│   ├── meetings/page.tsx               # Meetings page
│   ├── scrum/page.tsx                  # Scrum automation
│   ├── settings/page.tsx               # Settings
│   └── chatbot/page.tsx                # Chatbot interface
├── onboarding/page.tsx                 # Onboarding form
└── onboarding-chat/page.tsx            # Onboarding chat (coming soon)

components/
├── auth/
│   ├── google-sign-in-button.tsx       # Google sign-in button
│   ├── demo-sign-in-button.tsx         # Demo sign-in button
│   └── user-menu.tsx                   # User dropdown menu
├── landing/
│   ├── hero.tsx                        # Landing hero section
│   ├── features.tsx                    # Features section
│   ├── how-it-works.tsx                # How it works section
│   └── contact-us.tsx                  # Contact form
└── layout/
    ├── sidebar.tsx                     # App sidebar
    └── topbar.tsx                      # App topbar

lib/
├── auth.ts                             # Auth utilities
└── utils.ts                            # General utilities

middleware.ts                           # Protected route middleware
\`\`\`

## 🔐 Authentication Flow

1. **Landing Page** → User clicks "Sign In"
2. **Auth Page** → User chooses Google or Demo
3. **Google/Demo Auth** → NextAuth.js handles authentication
4. **Dashboard** → User is redirected to dashboard after sign-in
5. **Protected Routes** → Middleware protects `/dashboard` and `/app` routes

## 🛠️ Customization

### Change Redirect After Sign-In
Edit `app/api/auth/[...nextauth]/route.ts`:
\`\`\`typescript
async redirect({ url, baseUrl }) {
  return baseUrl + "/your-custom-page"
}
\`\`\`

### Add More Sign-In Methods
Edit `app/api/auth/[...nextauth]/route.ts` and add more providers:
\`\`\`typescript
providers: [
  GoogleProvider({ ... }),
  GitHubProvider({ ... }),
  // Add more providers here
]
\`\`\`

### Customize Demo User
Edit `app/api/auth/[...nextauth]/route.ts` in the CredentialsProvider:
\`\`\`typescript
if (credentials?.email === "demo@vocaris.ai") {
  return {
    id: "demo-user-123",
    name: "Your Name",
    email: "demo@vocaris.ai",
    image: "your-image-url",
  }
}
\`\`\`

## 🐛 Troubleshooting

### "Invalid redirect_uri" Error
- Ensure redirect URI matches in Google Cloud Console
- Local: `http://localhost:3000/api/auth/callback/google`
- Production: `https://yourdomain.com/api/auth/callback/google`

### Demo Sign-In Not Working
- Ensure `NEXTAUTH_SECRET` is set in environment variables
- Check browser console for errors

### Session Not Persisting
- Clear browser cookies and try again
- Verify `NEXTAUTH_SECRET` is set correctly

## 📚 Learn More

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
- [Next.js Documentation](https://nextjs.org/docs)

## 🚀 Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your GitHub repository
4. Add environment variables in project settings
5. Deploy!

For detailed setup, see `docs/NEXTAUTH_SETUP.md`
