# 🚨 URGENT FIX: Database Migration Required

## The Problem

You're getting `Cannot read properties of undefined (reading 'id')` because:

**Your database is missing the `organizer_id` column!**

The code is trying to filter events by `organizer_id`, but the column doesn't exist in Supabase yet.

---

## ✅ Quick Fix (5 minutes)

### Step 1: Go to Supabase SQL Editor

1. Open [https://app.supabase.com](https://app.supabase.com)
2. Select your GuestPulse project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**

### Step 2: Run This SQL

Copy and paste this **EXACTLY**:

```sql
-- Step 1: Add the organizer_id column
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS organizer_id UUID REFERENCES auth.users(id);

-- Step 2: Create an index for performance
CREATE INDEX IF NOT EXISTS idx_events_organizer_id ON events(organizer_id);

-- Step 3: Check if you have any existing events
SELECT COUNT(*) as event_count FROM events;

-- Step 4: Check if you have any users
SELECT id, email FROM auth.users LIMIT 5;
```

Click **RUN** (or press Cmd/Ctrl + Enter)

---

### Step 3: Handle Existing Data

#### Option A: You Have NO Events Yet (Easiest)
If the query shows `event_count: 0`, **you're done!** ✅

Just restart your dev server and everything will work.

#### Option B: You Have Events But NO Users
If you have events but no users in `auth.users`:

```sql
-- Delete all test events (they can't be assigned to anyone)
DELETE FROM events;
```

Then sign up at `/signup` to create your first user.

#### Option C: You Have BOTH Events and Users
If you have both, assign existing events to your user:

```sql
-- First, find your user ID
SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';
-- Copy the 'id' value

-- Then assign all events to that user
UPDATE events 
SET organizer_id = 'PASTE-YOUR-USER-ID-HERE'
WHERE organizer_id IS NULL;
```

Replace `your-email@example.com` with your actual email and `PASTE-YOUR-USER-ID-HERE` with the actual UUID.

---

### Step 4: Make Column Required (Optional but Recommended)

After assigning all events to users:

```sql
-- Make organizer_id required for all new events
ALTER TABLE events 
ALTER COLUMN organizer_id SET NOT NULL;
```

---

## 🧪 Test It Works

```bash
# 1. Restart your dev server
npm run dev

# 2. Visit login page
http://localhost:3000/login

# 3. Login or signup

# 4. Visit dashboard
http://localhost:3000/organizer

# Should work now! ✅
```

---

## 🔍 Verify the Fix

Run this in Supabase SQL Editor to verify:

```sql
-- Check the events table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'events' 
AND column_name = 'organizer_id';

-- Should show:
-- organizer_id | uuid | YES (or NO if you made it required)
```

---

## ⚠️ Why This Happened

1. We added authentication code that filters by `organizer_id`
2. But the database column doesn't exist yet
3. Supabase errors when querying non-existent columns
4. This causes `user` to be undefined in some contexts

**Solution:** Add the column to the database = Everything works! ✅

---

## 🆘 Still Not Working?

### Debug Steps:

1. **Check environment variables:**
```bash
# In your terminal
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Should show your Supabase project URL and key.

2. **Check if column was added:**
```sql
-- In Supabase SQL Editor
\d events
```

Should show `organizer_id` in the column list.

3. **Check browser console:**
- Open DevTools (F12)
- Look for error messages
- Share the exact error if different

4. **Clear cookies and try again:**
- Logout
- Clear browser cookies for localhost:3000
- Login again

---

## 📞 Common Issues

### Issue: "relation already exists"
**Solution:** The column already exists! Move to Step 3.

### Issue: "violates foreign key constraint"
**Solution:** You're trying to set an invalid user ID. Make sure you copy the exact UUID from `auth.users`.

### Issue: "column does not exist" 
**Solution:** The migration didn't run successfully. Try running Step 2 again.

### Issue: Still getting undefined error
**Solution:** 
1. Clear your browser cache
2. Restart the dev server
3. Make sure you're logged in (check cookies)

---

## ✅ Success Checklist

After running the migration, you should have:

- [ ] `organizer_id` column exists in `events` table
- [ ] Index created on `organizer_id`
- [ ] All existing events have an `organizer_id` value
- [ ] Dev server restarted
- [ ] Can login without errors
- [ ] Dashboard shows events (or empty state if no events)
- [ ] Can create new events
- [ ] Analytics page loads without errors

---

## 🚀 Next Steps After Fix

1. ✅ Test authentication flow
2. ✅ Create a test event
3. ✅ Verify data isolation (create second user, check they can't see first user's events)
4. ✅ Test all features (check-in, analytics, export)
5. ✅ Deploy to production

---

**Status:** ⏳ WAITING FOR DATABASE MIGRATION  
**Time Required:** 5 minutes  
**Difficulty:** Easy (copy-paste SQL)

---

Let me know once you've run the migration and I'll help with any issues! 🚀

