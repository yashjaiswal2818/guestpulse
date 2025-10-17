# 🚀 Quick Start: Authentication Setup

## ⏱️ 10 Minute Setup

Everything is already coded! You just need to:
1. Run database migration
2. Test it works
3. Deploy

---

## Step 1: Run Database Migration (5 min)

Open your Supabase SQL Editor and run this:

```sql
-- 1. Add organizer_id column
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS organizer_id UUID REFERENCES auth.users(id);

-- 2. Create index for performance
CREATE INDEX IF NOT EXISTS idx_events_organizer_id ON events(organizer_id);

-- 3. If you have existing test events, assign them to a user
-- First, create a test user account via signup page
-- Then get your user ID:
SELECT id, email FROM auth.users;

-- Then assign existing events to that user:
UPDATE events 
SET organizer_id = 'YOUR-USER-ID-HERE'
WHERE organizer_id IS NULL;

-- 4. Make organizer_id required
ALTER TABLE events 
ALTER COLUMN organizer_id SET NOT NULL;
```

---

## Step 2: Test It Works (5 min)

### Test A: Unauthenticated Access
```bash
# Start dev server
npm run dev

# 1. Visit http://localhost:3000/organizer
# Expected: Redirects to /login ✅
```

### Test B: Signup & Login
```bash
# 1. Visit http://localhost:3000/signup
# 2. Create account: test@example.com / password123
# Expected: Redirects to /organizer ✅

# 3. Click "Logout"
# Expected: Redirects to /login ✅

# 4. Visit http://localhost:3000/login
# 5. Login with same credentials
# Expected: Redirects to /organizer ✅
```

### Test C: Multi-Tenant Isolation
```bash
# 1. As User A: Create an event
# 2. Note the event ID from URL: /organizer/events/[id]
# 3. Logout
# 4. Signup as User B (different email)
# 5. Try to visit User A's event URL
# Expected: 404 Not Found ✅

# 6. User B creates their own event
# Expected: Only User B's events visible ✅
```

---

## Step 3: Optional - Enable Row Level Security

For production, add database-level security:

```sql
-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Users can view their own events
CREATE POLICY "Users can view their own events"
ON events FOR SELECT
USING (auth.uid() = organizer_id);

-- Users can create events
CREATE POLICY "Users can create events"
ON events FOR INSERT
WITH CHECK (auth.uid() = organizer_id);

-- Users can update their own events
CREATE POLICY "Users can update their own events"
ON events FOR UPDATE
USING (auth.uid() = organizer_id);

-- Users can delete their own events
CREATE POLICY "Users can delete their own events"
ON events FOR DELETE
USING (auth.uid() = organizer_id);

-- Public can view events (for RSVP pages)
CREATE POLICY "Public can view events"
ON events FOR SELECT
USING (true);
```

---

## ✅ Done!

Your authentication is now live. Key features:

- ✅ Login/Signup pages
- ✅ Protected organizer routes
- ✅ Multi-tenant data isolation
- ✅ Logout functionality
- ✅ Ownership verification on all mutations

---

## 📋 Quick Reference

### Files Changed (Already Done)
- `lib/types/database.ts` - Added organizer_id
- `app/api/events/*` - Added auth checks
- `app/organizer/*` - Added auth checks
- `middleware.ts` - Route protection
- `app/login/page.tsx` - Login UI
- `app/signup/page.tsx` - Signup UI

### Environment Variables (Already Set)
```bash
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

### Routes
- `/login` - Login page
- `/signup` - Signup page
- `/organizer` - Protected dashboard
- `/organizer/events` - User's events only

---

## 🐛 Troubleshooting

**Can't login?**
- Check Supabase Auth is enabled
- Check environment variables
- Check browser console for errors

**Can't see events?**
- Check `organizer_id` column exists
- Check events have `organizer_id` set
- Check you're logged in (check cookies)

**404 on events?**
- Event might belong to different user
- Check ownership with: `SELECT * FROM events WHERE organizer_id = 'your-id';`

---

**Need help? Check `AUTHENTICATION_COMPLETE.md` for full details.**

