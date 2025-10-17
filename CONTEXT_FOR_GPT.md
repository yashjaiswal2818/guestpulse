# 🤖 Context for GPT: GuestPulse Project

## Quick Summary
You're helping build **GuestPulse**, an event management platform that solves the "flaky guest" problem. It tracks RSVPs, manages check-ins via QR codes, and calculates "commitment scores" for guests based on their attendance history.

---

## Tech Stack
- **Framework:** Next.js 15.5.5 (App Router) + React 19 + TypeScript
- **Database:** Supabase (PostgreSQL)
- **Styling:** Tailwind CSS 4 + Radix UI
- **QR Codes:** html5-qrcode (scanning) + qrcode (generation)
- **Forms:** react-hook-form + zod

---

## Project Structure (Simplified)

```
app/
├── (public)/rsvp/[slug]/          # Public RSVP form
├── organizer/                      # Dashboard for organizers
│   ├── events/[id]/               # Event details
│   ├── check-in/                  # QR scanner + manual check-in
│   └── analytics/                 # Analytics dashboard
├── api/                           # API routes
│   ├── rsvp/, check-in/          # Core APIs
│   ├── events/[id]/              # CRUD
│   └── export/, commitment-score/ # Data & scoring
└── admin/update-event/            # Admin tools

components/
├── organizer/                     # Dashboard components
└── ui/                           # Reusable UI (shadcn style)

lib/
├── supabase.ts                   # DB client
└── types/database.ts             # TypeScript types
```

---

## Database Schema

### events
- id, slug, name, description, date, location, capacity, organizer_email

### registrations
- id, event_id, name, email, attendance (yes/no/maybe)
- meal_preference, dietary_restrictions, team_name
- qr_code (unique), checked_in, checked_in_at

---

## Key Features Built

✅ **Event Management**
- Create/read/update/delete events
- Unique slugs for shareable links
- Capacity tracking

✅ **RSVP System**
- Public form with 3 options: Yes, No, Maybe
- Team registrations (group sign-up)
- QR code generation for each guest

✅ **Check-in System**
- QR scanner (camera-based)
- Manual search (by name/email)
- Team bulk check-in
- Sound/vibration feedback

✅ **Dashboard**
- Event stats and analytics
- Guest list with search/filter
- CSV export
- Team view with progress bars

✅ **APIs Built**
- `/api/rsvp` - Create registration
- `/api/check-in` - Check in guest (QR or bulk)
- `/api/events/[id]` - CRUD operations
- `/api/export` - CSV export
- `/api/commitment-score` - Calculate reliability

---

## Recent Work Done

### Last Session Fixes:
1. ✅ Created missing Alert component
2. ✅ Fixed QR scanner JSX structure
3. ✅ Added TypeScript types throughout
4. ✅ Fixed API parameter mismatches
5. ✅ Reorganized routes from `/dashboard/*` to `/organizer/*`
6. ✅ Added manual check-in component
7. ✅ Improved team list with progress bars
8. ✅ Added CSV export functionality

### Files Modified (not committed):
- `app/admin/update-event/page.tsx`
- `app/api/admin/update-event-date/route.ts`
- `app/api/commitment-score/route.ts`
- `app/api/export/route.ts`
- `components/organizer/manual-checkin.tsx`
- `components/organizer/registrations-table.tsx`
- `components/ui/alert.tsx`
- Documentation files (.md)

---

## What Still Needs Work

### 🚧 Priority Features:
1. **Authentication** - Organizer routes currently unprotected
2. **Email notifications** - RSVP confirmations & check-in alerts
3. **Real-time updates** - Live check-in counter using Supabase realtime
4. **Commitment score UI** - Display guest reliability in dashboard
5. **Advanced analytics** - Charts for attendance trends

### 🎨 UI Improvements:
1. Loading skeletons for data fetching
2. Better error messages
3. Toast notifications instead of alerts
4. Mobile optimization

### 🧪 Testing:
1. Add unit tests
2. E2E tests for critical flows
3. API endpoint testing

---

## Important Design Patterns

### 1. **File Naming:**
- `page.tsx` = Route pages
- `route.ts` = API endpoints
- Components = kebab-case files, PascalCase exports

### 2. **Component Types:**
- Server Components by default (no 'use client')
- Add 'use client' only for interactivity (forms, scanners)

### 3. **Data Fetching:**
- Use Supabase client from `lib/supabase.ts`
- Server-side fetching in page components
- Client-side for real-time updates

### 4. **Type Safety:**
- Import types from `lib/types/database.ts`
- Never use `any[]` - use proper types (Registration[], Event, etc.)

### 5. **API Responses:**
```typescript
// Success
{ success: true, data: {...} }

// Error
{ error: "Message" }
```

---

## Common Issues & Solutions

### Issue 1: "Cannot find module '@/components/ui/X'"
**Solution:** Component doesn't exist. Check `components/ui/` or create it using shadcn pattern.

### Issue 2: QR scanner camera not working
**Solution:** Requires HTTPS or localhost. Check browser permissions.

### Issue 3: Type errors with Supabase data
**Solution:** Use proper types from `database.ts`, handle null cases.

### Issue 4: Route not found
**Solution:** All organizer routes are `/organizer/*` (not `/dashboard/*`).

---

## Useful Commands

```bash
# Development
npm run dev

# Check types
npx tsc --noEmit

# Lint
npm run lint

# Build
npm run build
```

---

## API Examples

### Create Registration:
```typescript
POST /api/rsvp
Body: {
  eventId, name, email, attendance,
  mealPreference?, dietaryRestrictions?, teamName?
}
Response: { qrCode, registrationId }
```

### Check-in:
```typescript
POST /api/check-in
Body: { qrCode: "xxx" }  // Individual
  OR  { memberIds: ["id1", "id2"] }  // Team bulk
Response: { success: true, checkedIn: [...] }
```

### Export CSV:
```typescript
GET /api/export?eventId=xxx
Response: CSV file download
```

---

## Key Files to Know

### Most Edited:
1. `app/organizer/events/[id]/page.tsx` - Event dashboard
2. `components/organizer/qr-scanner.tsx` - QR scanning logic
3. `app/api/check-in/route.ts` - Check-in backend
4. `components/organizer/registrations-table.tsx` - Guest list
5. `app/api/rsvp/route.ts` - RSVP backend

### Database:
- `lib/supabase.ts` - Client setup
- `lib/types/database.ts` - All types

### UI:
- `components/ui/*` - Reusable components
- `app/globals.css` - Global styles

---

## Current Status

**What Works:** ✅
- Complete event lifecycle (create → RSVP → check-in → analytics)
- QR code system (generation + scanning)
- Manual check-in with search
- Team registrations and bulk check-in
- CSV export
- Dashboard with stats
- All API endpoints

**What's Missing:** 🚧
- Authentication/authorization
- Email notifications
- Real-time updates
- Commitment score display
- Advanced analytics charts
- Mobile app

**Known Bugs:** 🐛
- None currently! All 25+ linter errors fixed.

---

## Style Guide

### Colors:
- Green: Confirmed/Checked-in
- Yellow: Maybe
- Red: Declined/Errors
- Blue: Primary actions
- Gray: Pending

### Icons (Lucide):
- CheckCircle ✅ - Success/Checked-in
- XCircle ❌ - Declined
- Users 👥 - Teams
- BarChart 📊 - Analytics
- QrCode - QR features
- Search 🔍 - Search
- Download 📥 - Export

---

## Pro Tips

1. **Always check types first** - Most errors are type-related
2. **Test QR scanner on mobile** - Desktop cameras are flaky
3. **Use Server Components** - Only add 'use client' when needed
4. **Check Supabase docs** - For query syntax
5. **Read ERRORS_AND_FIXES.md** - Learn from past issues

---

## Questions to Ask When Stuck

1. Is this a Server or Client Component?
2. Are the TypeScript types correct?
3. Is the route path correct? (`/organizer/*` not `/dashboard/*`)
4. Is Supabase query correct? (check null handling)
5. Are all imports present?

---

**Project Goal:** Make event attendance predictable by tracking commitment patterns.

**Current Phase:** ✅ MVP Complete → 🚧 Adding Auth & Notifications

**Total Code:** ~1,500+ lines, 22 components, 7 API routes, 9 pages

---

Good luck! 🚀



