# Vercel Deployment Checklist ✅

## Pre-Deployment Verification

### ✅ Build Status
- [x] Production build succeeds (`npm run build`)
- [x] No TypeScript errors
- [x] ESLint configured for production
- [x] All critical dependencies installed

### ✅ Environment Variables Prepared

Copy these to your Vercel project settings under **Settings → Environment Variables**:

| Variable | Value | Required |
|----------|-------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | ✅ Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key | ✅ Yes |
| `NEXT_PUBLIC_APP_URL` | Your Vercel domain | ⚠️ Optional* |

*Auto-set by Vercel, but you can override if needed

### ✅ Code Quality
- [x] Debug console.log statements removed
- [x] Production-ready error handling
- [x] Type safety maintained
- [x] No hardcoded secrets

### ✅ Next.js Configuration
- [x] Build without Turbopack (Vercel compatible)
- [x] Middleware configured correctly
- [x] Route handlers properly typed
- [x] Server/client components separated

## Vercel Deployment Steps

### Step 1: Connect GitHub Repository

1. Go to https://vercel.com/new
2. Select "Import Git Repository"
3. Choose your `guestpulse` repository
4. Click **Import**

### Step 2: Configure Project

**Framework Preset**: Next.js (auto-detected ✓)

**Root Directory**: `./` (default ✓)

**Build Command**: `npm run build` (default ✓)

**Output Directory**: `.next` (default ✓)

**Install Command**: `npm install` (default ✓)

### Step 3: Add Environment Variables

Click **Add Environment Variable** and add each one:

```bash
# Variable 1
Name: NEXT_PUBLIC_SUPABASE_URL
Value: [paste your Supabase URL]
Environment: Production, Preview, Development

# Variable 2
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: [paste your Supabase anon key]
Environment: Production, Preview, Development
```

### Step 4: Deploy

1. Click **Deploy**
2. Wait 2-3 minutes for build to complete
3. Your app will be live at `https://your-project.vercel.app`

## Post-Deployment Testing

### Critical Paths to Test

- [ ] Home page loads (`/`)
- [ ] Login page works (`/login`)
- [ ] Signup page works (`/signup`)
- [ ] Can create an event (`/organizer/events/new`)
- [ ] RSVP form loads for an event (`/rsvp/[slug]`)
- [ ] QR code displays after RSVP
- [ ] Check-in page works (`/organizer/check-in`)
- [ ] Analytics loads (`/organizer/analytics`)

### Test Authentication Flow

1. Go to `/signup`
2. Create a test account
3. Verify redirect to `/organizer`
4. Try accessing `/organizer` without auth → should redirect to `/login`
5. Logout and login again

### Test Event Flow

1. Create a new event
2. Copy the RSVP link
3. Open in incognito/private window
4. Submit an RSVP
5. Verify QR code appears
6. Check event dashboard shows the registration

## Common Deployment Issues & Solutions

### Issue: Build Fails on Vercel

**Symptoms**: Red X on deployment, build logs show errors

**Solutions**:
1. Check if all environment variables are set
2. Verify Node.js version (should be 18+ or 20+)
3. Look at the specific error in Vercel logs
4. Compare with local build (`npm run build`)

### Issue: "Missing environment variables" Error

**Symptoms**: App builds but crashes with missing env vars

**Solutions**:
1. Go to Vercel dashboard → Settings → Environment Variables
2. Ensure both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
3. Click **Redeploy** after adding variables

### Issue: Authentication Not Working

**Symptoms**: Can't login or signup, redirects don't work

**Solutions**:
1. Check Supabase Auth settings
2. Add your Vercel domain to Supabase allowed redirect URLs:
   - Go to Supabase → Authentication → URL Configuration
   - Add `https://your-project.vercel.app` to Site URL
   - Add `https://your-project.vercel.app/**` to Redirect URLs

### Issue: Database Connection Errors

**Symptoms**: "Failed to fetch", timeout errors

**Solutions**:
1. Verify Supabase project is active
2. Check API keys are correct
3. Ensure RLS policies allow anon access where needed
4. Test connection using Supabase client logs

### Issue: Middleware Redirect Loop

**Symptoms**: Page keeps redirecting

**Solutions**:
1. Clear browser cookies
2. Check middleware.ts matcher config
3. Verify `/login` and `/signup` pages exist

## Vercel-Specific Optimizations

### Enable Analytics (Optional)

1. Go to Vercel dashboard → Analytics
2. Click **Enable Analytics**
3. Monitor page load times and user metrics

### Set Up Custom Domain (Optional)

1. Go to Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Update `NEXT_PUBLIC_APP_URL` if needed

### Enable Edge Caching

Already configured! Next.js automatically uses Vercel Edge Network.

### Monitor Performance

- Visit Vercel dashboard → Insights
- Check function execution times
- Monitor cold start performance

## Rollback Plan

If something goes wrong:

1. Go to Vercel → Deployments
2. Find the last working deployment
3. Click **...** → **Promote to Production**

Or redeploy from a previous commit:

```bash
git log --oneline  # Find the commit hash
git checkout <commit-hash>
git push origin main --force  # Only if necessary
```

## Success Indicators

### ✅ Deployment Successful If:

- [x] Build completes without errors
- [x] All routes return 200 OK
- [x] Authentication works
- [x] Database queries succeed
- [x] QR codes generate properly
- [x] No console errors in browser

### 🎉 You're Live!

Your app is successfully deployed when:

1. You can access it at your Vercel URL
2. All features work as in development
3. No error messages in Vercel logs
4. Test users can signup/login/create events

---

## Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **Deployment Logs**: Check Vercel dashboard for detailed errors

---

**Last Updated**: Ready for deployment!
**Build Status**: ✅ Passing
**Environment**: Production-ready

