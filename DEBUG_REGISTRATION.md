# 🔍 Debug: Registration Error

## Error Message
"Failed to create registration" / "error while registering"

## Most Likely Causes

### 1. **Event ID Doesn't Exist**
The event you're trying to RSVP to doesn't exist in the database.

**Solution:**
- Make sure you created an event first at `/organizer/events/new`
- Make sure you ran the database migration for `organizer_id`

---

### 2. **Database Constraint Violation**
The registrations table might have constraints that are failing.

**Check:**
```sql
-- Run this in Supabase SQL Editor
SELECT * FROM registrations LIMIT 1;

-- Check constraints
SELECT
    con.conname as constraint_name,
    con.contype as constraint_type
FROM pg_constraint con
WHERE con.conrelid = 'registrations'::regclass;
```

---

### 3. **Missing Required Columns**
The INSERT might be failing because required columns are missing values.

**Verify table structure:**
```sql
-- Run in Supabase SQL Editor
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'registrations';
```

Should show:
- event_id (uuid, NOT NULL)
- name (text, NOT NULL)
- email (text, NOT NULL)
- attendance (text, NOT NULL)
- meal_preference (text, nullable)
- dietary_restrictions (text, nullable)
- team_name (text, nullable)
- qr_code (text, NOT NULL)
- checked_in (boolean, default false)
- checked_in_at (timestamp, nullable)

---

## 🔧 Quick Fix Steps

### Step 1: Check Browser Console
1. Open DevTools (F12)
2. Go to Console tab
3. Look for errors
4. Check Network tab → Find the `/api/rsvp` request
5. Look at the Response to see the actual error

### Step 2: Check Server Logs
In your terminal where `npm run dev` is running, look for error messages like:
```
Insert error: { message: "...", details: "...", code: "..." }
```

### Step 3: Test With Simple Data
Try submitting the RSVP form with minimal data:
- Name: "Test User"
- Email: "test@example.com"
- Attendance: "Yes"
- Leave everything else blank

---

## 🚨 Most Common Issue

**The event doesn't exist or doesn't have registrations enabled.**

### To Fix:
1. Make sure you ran the database migration:
```sql
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS organizer_id UUID REFERENCES auth.users(id);
```

2. Make sure you're logged in and created an event

3. Make sure you're visiting the correct RSVP URL:
```
http://localhost:3000/rsvp/YOUR-EVENT-SLUG
```

Not:
```
http://localhost:3000/rsvp/some-random-slug  ← Won't work!
```

---

## 🧪 Test Full Flow

### Step A: Create Event
```bash
# 1. Login
http://localhost:3000/login

# 2. Create Event
http://localhost:3000/organizer/events/new

# 3. Fill form and submit
# 4. Copy the RSVP link shown
```

### Step B: Test RSVP
```bash
# 1. Open RSVP link in INCOGNITO/PRIVATE window
# (So you're not logged in as organizer)

# 2. Fill RSVP form
# 3. Submit

# Should work! ✅
```

---

## 🔍 Advanced Debugging

### Add Detailed Logging

Update `/app/api/rsvp/route.ts` line 68-74:

```typescript
if (insertError) {
    console.error('Insert error:', insertError)
    console.error('Insert error details:', {
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint,
        code: insertError.code,
    })
    return NextResponse.json(
        { 
            error: 'Failed to create registration',
            debug: insertError.message  // Add this for debugging
        },
        { status: 500 }
    )
}
```

Then check your terminal for detailed error info.

---

## 📋 Checklist

Before testing RSVP:

- [ ] Database migration completed (`organizer_id` column exists)
- [ ] You're logged in as an organizer
- [ ] You created at least one event
- [ ] You copied the correct RSVP URL
- [ ] You're testing in a different browser/incognito (not logged in)
- [ ] Browser console is open to see errors
- [ ] Dev server terminal is visible to see server logs

---

## 💡 Quick Test

Run this SQL to check if everything is set up:

```sql
-- Check events exist
SELECT id, name, slug, organizer_id FROM events LIMIT 5;

-- Check event has organizer_id
SELECT 
    COUNT(*) as total_events,
    COUNT(organizer_id) as events_with_organizer,
    COUNT(*) - COUNT(organizer_id) as events_missing_organizer
FROM events;

-- If events_missing_organizer > 0, you need to assign them:
-- UPDATE events SET organizer_id = 'YOUR-USER-ID' WHERE organizer_id IS NULL;
```

---

## ✅ Expected Behavior

When RSVP works correctly:

1. User visits `/rsvp/event-slug`
2. Fills out form
3. Clicks Submit
4. Sees success page with QR code
5. Registration appears in `/organizer/events/[id]` guest list

---

Let me know what you see in:
1. Browser console (F12)
2. Server terminal logs
3. Network tab → /api/rsvp response

This will help me identify the exact issue! 🔍

