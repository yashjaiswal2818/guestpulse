
-- GuestPulse Database Check & Migration Script
-- Run this in Supabase SQL Editor
-- ==============================================

-- STEP 1: Check current database state
-- -------------------------------------
SELECT 'Database Status Check' as step;

-- Check if organizer_id column exists
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_name = 'events' 
            AND column_name = 'organizer_id'
        ) 
        THEN '✅ organizer_id column EXISTS'
        ELSE '❌ organizer_id column MISSING - migration needed!'
    END as column_status;

-- Count events
SELECT COUNT(*) as total_events FROM events;

-- Count users
SELECT COUNT(*) as total_users FROM auth.users;

-- Show users
SELECT id, email, created_at FROM auth.users ORDER BY created_at DESC;


-- STEP 2: Run Migration (ONLY if column is missing)
-- --------------------------------------------------
-- Uncomment these lines if column is missing:

-- ALTER TABLE events 
-- ADD COLUMN IF NOT EXISTS organizer_id UUID REFERENCES auth.users(id);

-- CREATE INDEX IF NOT EXISTS idx_events_organizer_id ON events(organizer_id);


-- STEP 3: Assign existing events to a user
-- -----------------------------------------
-- First, find your user ID from the results above
-- Then uncomment and run this, replacing 'YOUR-USER-ID':

-- UPDATE events 
-- SET organizer_id = 'YOUR-USER-ID-HERE'
-- WHERE organizer_id IS NULL;


-- STEP 4: Verify the fix
-- -----------------------
-- Check that all events now have an organizer_id:

-- SELECT 
--     id, 
--     name, 
--     organizer_id,
--     CASE 
--         WHEN organizer_id IS NULL THEN '❌ Missing organizer'
--         ELSE '✅ Has organizer'
--     END as status
-- FROM events;


-- STEP 5: Make column required (optional)
-- ----------------------------------------
-- Only run this after ALL events have an organizer_id:

-- ALTER TABLE events 
-- ALTER COLUMN organizer_id SET NOT NULL;


-- FINAL: Verify everything is correct
-- ------------------------------------
-- SELECT 
--     column_name, 
--     data_type, 
--     is_nullable,
--     CASE 
--         WHEN is_nullable = 'NO' THEN '✅ Required'
--         ELSE '⚠️ Optional'
--     END as requirement_status
-- FROM information_schema.columns 
-- WHERE table_name = 'events' 
-- AND column_name = 'organizer_id';

