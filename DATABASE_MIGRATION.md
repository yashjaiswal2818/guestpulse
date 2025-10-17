# Database Migration for Authentication

## Required Changes to Supabase Database

### 1. Add `organizer_id` Column to Events Table

Run this SQL in your Supabase SQL Editor:

```sql
-- Add organizer_id column to events table
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS organizer_id UUID REFERENCES auth.users(id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_events_organizer_id ON events(organizer_id);

-- Update existing events (if any) to set organizer_id
-- Replace 'your-user-id' with an actual user ID from auth.users table
-- Or leave NULL if you want to manually assign later
UPDATE events 
SET organizer_id = (SELECT id FROM auth.users LIMIT 1)
WHERE organizer_id IS NULL;

-- Make organizer_id required for new events (optional)
ALTER TABLE events 
ALTER COLUMN organizer_id SET NOT NULL;
```

### 2. Enable Row Level Security (RLS)

Protect your data with RLS policies:

```sql
-- Enable RLS on events table
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own events
CREATE POLICY "Users can view their own events"
ON events FOR SELECT
USING (auth.uid() = organizer_id);

-- Policy: Users can insert events for themselves
CREATE POLICY "Users can create events"
ON events FOR INSERT
WITH CHECK (auth.uid() = organizer_id);

-- Policy: Users can update their own events
CREATE POLICY "Users can update their own events"
ON events FOR UPDATE
USING (auth.uid() = organizer_id)
WITH CHECK (auth.uid() = organizer_id);

-- Policy: Users can delete their own events
CREATE POLICY "Users can delete their own events"
ON events FOR DELETE
USING (auth.uid() = organizer_id);

-- Policy: Allow public read access for RSVP pages (by slug only)
CREATE POLICY "Public can view events by slug"
ON events FOR SELECT
USING (true);
```

### 3. Enable RLS on Registrations (Optional but Recommended)

```sql
-- Enable RLS on registrations table
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Policy: Event organizers can view registrations for their events
CREATE POLICY "Organizers can view registrations for their events"
ON registrations FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM events 
    WHERE events.id = registrations.event_id 
    AND events.organizer_id = auth.uid()
  )
);

-- Policy: Anyone can create a registration (for public RSVP)
CREATE POLICY "Anyone can create registrations"
ON registrations FOR INSERT
WITH CHECK (true);

-- Policy: Organizers can update registrations for their events (for check-in)
CREATE POLICY "Organizers can update registrations"
ON registrations FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM events 
    WHERE events.id = registrations.event_id 
    AND events.organizer_id = auth.uid()
  )
);

-- Policy: Organizers can delete registrations for their events
CREATE POLICY "Organizers can delete registrations"
ON registrations FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM events 
    WHERE events.id = registrations.event_id 
    AND events.organizer_id = auth.uid()
  )
);
```

### 4. Verify Authentication Setup

Ensure Supabase Auth is properly configured:

1. Go to **Authentication** → **Settings** in Supabase Dashboard
2. Enable **Email** provider
3. Configure **Site URL**: `http://localhost:3000` (for dev) or your production URL
4. Configure **Redirect URLs**: Add your production domain

### 5. Test the Migration

After running the SQL:

1. **Check the schema**:
```sql
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'events';
```

2. **Verify RLS policies**:
```sql
SELECT * FROM pg_policies WHERE tablename = 'events';
SELECT * FROM pg_policies WHERE tablename = 'registrations';
```

3. **Test authentication**:
- Sign up at `/signup`
- Login at `/login`
- Create an event at `/organizer/events/new`
- Verify you can only see your own events

---

## What Changed in the Code

### 1. Database Types (`lib/types/database.ts`)
- ✅ Added `organizer_id: string` to `Event` interface

### 2. API Routes
- ✅ `/api/events` - Filters by `organizer_id` for authenticated users
- ✅ `/api/events/[id]` - Added ownership verification for PATCH/DELETE
- ✅ Uses `createClient` from `supabase-server` for proper SSR auth

### 3. Pages Already Implemented
- ✅ `/login` - Login page with email/password
- ✅ `/signup` - Signup page with email/password
- ✅ Middleware - Protects `/organizer` routes
- ✅ Logout button - Signs out and redirects to login

---

## Security Notes

### Current Security Level

**Without RLS Policies (Current State)**:
- ⚠️ Data filtering happens at application level
- ⚠️ If someone bypasses the app, they can access any event
- ⚠️ Supabase anon key has full access to tables

**With RLS Policies (Recommended)**:
- ✅ Database-level security
- ✅ Even with direct Supabase access, users can only see their data
- ✅ Multi-tenant isolation guaranteed

### Implementation Options

**Option A: Quick Start (No RLS)**
- Run only Step 1 (add organizer_id column)
- Security handled by API routes
- Faster to implement
- Good for MVP/testing

**Option B: Production Ready (With RLS)**
- Run all steps
- Database-level security
- Better for production
- Industry best practice

### Recommended Approach

For **development/testing**: Start with Option A
For **production**: Implement Option B before launch

---

## Rollback Plan

If you need to remove these changes:

```sql
-- Remove RLS policies
DROP POLICY IF EXISTS "Users can view their own events" ON events;
DROP POLICY IF EXISTS "Users can create events" ON events;
DROP POLICY IF EXISTS "Users can update their own events" ON events;
DROP POLICY IF EXISTS "Users can delete their own events" ON events;
DROP POLICY IF EXISTS "Public can view events by slug" ON events;

-- Disable RLS
ALTER TABLE events DISABLE ROW LEVEL SECURITY;
ALTER TABLE registrations DISABLE ROW LEVEL SECURITY;

-- Remove organizer_id column (careful - this deletes data!)
-- ALTER TABLE events DROP COLUMN organizer_id;
```

---

## Next Steps

1. ✅ Run SQL migration in Supabase
2. ✅ Test signup/login flow
3. ✅ Create test events
4. ✅ Verify data isolation
5. ✅ Deploy to production

---

**Last Updated**: October 17, 2025
**Status**: Ready to Execute
**Required Time**: 5-10 minutes

