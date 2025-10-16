# GuestPulse - Deployment Guide

## ✅ Build Status
Your project is **deployment-ready**! All critical issues have been fixed.

## Required Environment Variables

### For Vercel Deployment

Add these environment variables in your Vercel project settings:

```bash
# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Where to Find These Values

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Optional Environment Variables

```bash
# App URL (automatically set by Vercel, only needed for local development)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Deploy to Vercel

### Option 1: Automatic Deployment (Recommended)

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. Go to [Vercel](https://vercel.com/new)
3. Import your GitHub repository
4. Add the environment variables listed above
5. Click **Deploy**

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY

# Deploy to production
vercel --prod
```

## Build Configuration

The project is configured to build **without Turbopack** for Vercel compatibility.

- **Development**: Uses Turbopack for faster builds
- **Production**: Uses standard Next.js build

## Post-Deployment Checklist

- [ ] Verify environment variables are set in Vercel
- [ ] Check that Supabase database is accessible
- [ ] Test authentication flow (login/signup)
- [ ] Test event creation
- [ ] Test RSVP submission
- [ ] Verify QR code generation works

## Database Setup

Ensure your Supabase database has these tables:

1. **events**
   - id (uuid, primary key)
   - slug (text, unique)
   - name (text)
   - description (text)
   - date (timestamp)
   - location (text)
   - capacity (integer)
   - organizer_id (uuid)
   - organizer_email (text)
   - created_at (timestamp)

2. **registrations**
   - id (uuid, primary key)
   - event_id (uuid, foreign key)
   - name (text)
   - email (text)
   - attendance (text: 'yes' | 'no' | 'maybe')
   - meal_preference (text)
   - dietary_restrictions (text)
   - team_name (text)
   - qr_code (text, unique)
   - checked_in (boolean)
   - checked_in_at (timestamp)
   - created_at (timestamp)

## Troubleshooting

### Build Fails on Vercel

1. Check environment variables are set correctly
2. Verify all dependencies are in `package.json`
3. Check Vercel build logs for specific errors

### Authentication Not Working

1. Verify Supabase URL and keys are correct
2. Check Supabase Auth settings
3. Ensure redirect URLs are configured in Supabase

### Database Connection Issues

1. Verify Supabase project is active
2. Check RLS (Row Level Security) policies
3. Ensure anon key has proper permissions

## Performance Optimizations Applied

- ✅ Removed debug console.log statements
- ✅ Fixed TypeScript strict mode errors
- ✅ Configured ESLint for production
- ✅ Optimized Next.js configuration
- ✅ Enabled middleware for route protection

## Security Checklist

- ✅ Environment variables properly prefixed with `NEXT_PUBLIC_`
- ✅ No hardcoded secrets in code
- ✅ Authentication middleware protecting organizer routes
- ✅ Supabase RLS should be enabled (verify in Supabase dashboard)

## Support

For issues or questions:
1. Check Vercel deployment logs
2. Review Supabase project settings
3. Verify all environment variables are set correctly

