# 📁 GuestPulse - Complete File Structure

## Project Overview
Event management platform with authentication, RSVP, check-in, and analytics.

---

## 📂 Root Directory Structure

```
guestpulse/
├── 📱 app/                          # Next.js 15 App Router
├── 🎨 components/                   # React components
├── 🛠️  lib/                         # Utilities and libraries
├── 🌍 public/                       # Static assets
├── 📜 scripts/                      # Build/deploy scripts
├── 📝 Documentation files           # MD files
└── ⚙️  Configuration files          # Config files
```

---

## 📱 App Directory (Routes & API)

```
app/
├── (public)/                        # Public-facing routes (no auth)
│   └── rsvp/
│       └── [slug]/
│           ├── page.tsx             # RSVP form page
│           └── success/
│               └── page.tsx         # RSVP success with QR code
│
├── organizer/                       # Protected organizer routes
│   ├── layout.tsx                   # 🔐 Sidebar layout (requires auth)
│   ├── page.tsx                     # 🔐 Dashboard overview
│   │
│   ├── analytics/
│   │   └── page.tsx                 # 🔐 Analytics dashboard
│   │
│   ├── check-in/
│   │   └── page.tsx                 # 🔐 QR scanner + manual check-in
│   │
│   └── events/
│       ├── page.tsx                 # 🔐 Events list
│       ├── new/
│       │   └── page.tsx             # 🔐 Create new event
│       └── [id]/
│           └── page.tsx             # 🔐 Event details & management
│
├── admin/                           # Admin tools
│   └── update-event/
│       └── page.tsx                 # Admin: Bulk update events
│
├── login/
│   └── page.tsx                     # ✅ Login page
│
├── signup/
│   └── page.tsx                     # ✅ Signup page
│
├── api/                             # API Routes
│   ├── admin/
│   │   └── update-event-date/
│   │       └── route.ts             # 🔐 POST: Bulk update event dates
│   │
│   ├── analytics/
│   │   ├── hourly/
│   │   │   └── route.ts             # 🔐 GET: Hourly check-in data
│   │   ├── rsvp-breakdown/
│   │   │   └── route.ts             # 🔐 GET: RSVP distribution
│   │   ├── show-rate/
│   │   │   └── route.ts             # 🔐 GET: Show rate trends
│   │   └── teams/
│   │       └── route.ts             # 🔐 GET: Team performance
│   │
│   ├── events/
│   │   ├── route.ts                 # 🔐 GET/POST: List/Create events
│   │   ├── [slug]/
│   │   │   └── route.ts             # GET: Public event by slug
│   │   └── [id]/
│   │       ├── route.ts             # 🔐 GET/PATCH/DELETE: Event CRUD
│   │       └── prediction/
│   │           └── route.ts         # 🔐 GET: Attendance prediction
│   │
│   ├── check-in/
│   │   └── route.ts                 # 🔐 POST: Check in guest
│   │
│   ├── commitment-score/
│   │   └── route.ts                 # 🔐 POST: Calculate guest score
│   │
│   ├── export/
│   │   └── route.ts                 # 🔐 GET: Export registrations CSV
│   │
│   └── rsvp/
│       └── route.ts                 # ✅ POST: Create registration (public)
│
├── api-test/
│   └── page.tsx                     # API testing page
│
├── test/
│   └── page.tsx                     # Test page
│
├── layout.tsx                       # Root layout
├── page.tsx                         # Landing page
└── globals.css                      # Global styles
```

**Legend:**
- 🔐 = Requires authentication (organizer only)
- ✅ = Public access (no auth required)

---

## 🎨 Components Directory

```
components/
├── organizer/                       # Organizer-specific components
│   ├── analytics-charts.tsx         # Analytics visualizations (Recharts)
│   ├── commitment-badge.tsx         # Guest reliability badge
│   ├── event-stats.tsx              # Event statistics cards
│   ├── guest-list.tsx               # Guest list table
│   ├── live-feed.tsx                # Real-time activity feed
│   ├── logout-button.tsx            # Logout functionality
│   ├── manual-checkin.tsx           # Manual check-in search
│   ├── prediction-card.tsx          # Attendance prediction display
│   ├── qr-scanner.tsx               # QR code scanner (camera)
│   ├── realtime-counter.tsx         # Live check-in counter
│   ├── registrations-table.tsx      # Full registrations table
│   ├── team-performance.tsx         # Team metrics display
│   └── teams-list.tsx               # Team cards with bulk check-in
│
├── public/                          # Public-facing components
│   ├── qr-code-display.tsx          # QR code display for guests
│   └── rsvp-form.tsx                # RSVP form component
│
├── ui/                              # Reusable UI components (shadcn/ui)
│   ├── alert.tsx                    # Alert with variants
│   ├── badge.tsx                    # Status badges
│   ├── button.tsx                   # Button component
│   ├── card.tsx                     # Card container
│   ├── checkbox.tsx                 # Checkbox input
│   ├── dialog.tsx                   # Modal dialogs
│   ├── form.tsx                     # Form wrapper
│   ├── input.tsx                    # Text input
│   ├── label.tsx                    # Form labels
│   ├── progress.tsx                 # Progress bars
│   ├── radio-group.tsx              # Radio buttons
│   ├── select.tsx                   # Dropdown select
│   ├── table.tsx                    # Data tables
│   ├── tabs.tsx                     # Tab navigation
│   └── textarea.tsx                 # Multi-line input
│
├── splash-screen.tsx                # Loading splash screen
└── components.json                  # shadcn/ui config
```

---

## 🛠️ Lib Directory (Utilities)

```
lib/
├── supabase.ts                      # Shared Supabase client
├── supabase-client.ts               # Client-side Supabase (browser)
├── supabase-server.ts               # Server-side Supabase (SSR)
├── utils.ts                         # Utility functions (cn, etc.)
└── types/
    └── database.ts                  # TypeScript types (Event, Registration)
```

---

## 🌍 Public Directory (Static Assets)

```
public/
├── check-in-success.mp3             # Success sound for check-in
├── file.svg                         # Icon
├── globe.svg                        # Icon
├── next.svg                         # Next.js logo
├── vercel.svg                       # Vercel logo
└── window.svg                       # Icon
```

---

## 📜 Scripts Directory

```
scripts/
└── (deployment scripts)             # Build/deploy automation
```

---

## 📝 Documentation Files

```
📄 Documentation & Guides:
├── AUTHENTICATION_COMPLETE.md       # ✨ Complete auth implementation guide
├── AUTH_FIX_SUMMARY.md              # Authentication bug fixes
├── COMMIT_SUMMARY.md                # Latest commit details
├── CONTEXT_FOR_GPT.md               # Project context for AI
├── DATABASE_MIGRATION.md            # SQL migration scripts
├── DEBUG_REGISTRATION.md            # RSVP debugging guide
├── DEPLOYMENT.md                    # Deployment instructions
├── DEPLOYMENT_FIXES.md              # Deployment error fixes
├── DEPLOYMENT_SUCCESS.md            # Deployment success status
├── ERRORS_AND_FIXES.md              # All bugs fixed log
├── FINAL_FIX.md                     # Latest fixes
├── IMPROVEMENTS.md                  # Feature improvements
├── NETLIFY_DEPLOY.md                # Netlify deployment
├── PROJECT_SUMMARY.md               # Complete project overview
├── QUICK_START_AUTH.md              # ✨ 10-minute auth setup
├── README.md                        # Project readme
├── REORGANIZATION_COMPLETE.md       # Structure reorganization
├── STRUCTURE_UPDATE.md              # Route structure updates
├── SUCCESS_SUMMARY.md               # ✨ Latest success summary
├── URGENT_FIX.md                    # Quick fixes guide
└── VERCEL_CHECKLIST.md              # Vercel deployment checklist

📊 Database:
└── check-database.sql               # ✨ Database verification script
```

---

## ⚙️ Configuration Files

```
Configuration:
├── .eslintrc.json                   # ESLint config
├── .gitignore                       # Git ignore rules
├── components.json                  # shadcn/ui configuration
├── eslint.config.mjs                # ESLint module config
├── middleware.ts                    # ✨ Auth middleware (route protection)
├── next.config.ts                   # Next.js configuration
├── next-env.d.ts                    # Next.js TypeScript definitions
├── package.json                     # Dependencies & scripts
├── package-lock.json                # Locked dependencies
├── postcss.config.mjs               # PostCSS config
├── tailwind.config.ts               # Tailwind CSS config
├── tsconfig.json                    # TypeScript config
└── netlify.toml                     # Netlify config

Environment:
└── .env.local                       # Environment variables (not in git)
    ├── NEXT_PUBLIC_SUPABASE_URL
    └── NEXT_PUBLIC_SUPABASE_ANON_KEY
```

---

## 📊 Key Statistics

### **Project Size:**
- **Total Files:** ~80+ files
- **Lines of Code:** ~5,000+ lines
- **Components:** 22 components
- **Pages:** 12 pages
- **API Routes:** 12 endpoints
- **Documentation:** 20 MD files

### **File Breakdown:**
- **TypeScript/TSX:** 60+ files
- **Documentation:** 20 MD files
- **Configuration:** 10+ files
- **Assets:** 6 files

### **Feature Distribution:**
- **Authentication:** 5 files (login, signup, middleware, logout)
- **Events:** 8 files (CRUD, display, management)
- **RSVP:** 4 files (form, API, success)
- **Check-in:** 4 files (QR scanner, manual, API)
- **Analytics:** 8 files (charts, APIs, dashboard)
- **UI Components:** 15 files (reusable)

---

## 🔑 Key Files

### **Most Important Files:**

1. **Authentication:**
   - `middleware.ts` - Route protection
   - `lib/supabase-server.ts` - Server auth
   - `lib/supabase-client.ts` - Client auth
   - `app/login/page.tsx` - Login page
   - `app/signup/page.tsx` - Signup page

2. **Core Features:**
   - `app/api/events/route.ts` - Event CRUD
   - `app/api/rsvp/route.ts` - Registration API
   - `app/api/check-in/route.ts` - Check-in API
   - `app/organizer/page.tsx` - Dashboard
   - `components/organizer/qr-scanner.tsx` - QR scanning

3. **Data Layer:**
   - `lib/types/database.ts` - TypeScript types
   - `lib/supabase.ts` - Database client
   - `DATABASE_MIGRATION.md` - Schema updates

4. **Documentation:**
   - `AUTHENTICATION_COMPLETE.md` - Auth guide
   - `PROJECT_SUMMARY.md` - Full overview
   - `QUICK_START_AUTH.md` - Quick setup

---

## 🎯 Routes Map

### **Public Routes (No Auth):**
```
/                           → Landing page
/login                      → Login page
/signup                     → Signup page
/rsvp/[slug]               → RSVP form
/rsvp/[slug]/success       → Success page with QR code
```

### **Protected Routes (Auth Required):**
```
/organizer                  → Dashboard overview
/organizer/events          → Events list
/organizer/events/new      → Create event
/organizer/events/[id]     → Event details
/organizer/check-in        → Check-in interface
/organizer/analytics       → Analytics dashboard
```

### **API Routes:**
```
Public:
POST /api/rsvp             → Create registration
GET  /api/events/[slug]    → Get event by slug

Protected:
GET    /api/events                  → List user's events
POST   /api/events                  → Create event
GET    /api/events/[id]             → Get event details
PATCH  /api/events/[id]             → Update event
DELETE /api/events/[id]             → Delete event
POST   /api/check-in                → Check in guest
GET    /api/export                  → Export CSV
POST   /api/commitment-score        → Calculate score
GET    /api/analytics/show-rate     → Show rate data
GET    /api/analytics/hourly        → Hourly check-ins
GET    /api/analytics/rsvp-breakdown → RSVP distribution
GET    /api/analytics/teams         → Team performance
```

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND LAYER                       │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐       │
│  │   Public   │  │ Organizer  │  │    Auth    │       │
│  │   Pages    │  │   Pages    │  │   Pages    │       │
│  └────────────┘  └────────────┘  └────────────┘       │
└─────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────┐
│                   MIDDLEWARE LAYER                      │
│              (Route Protection & Auth)                  │
└─────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────┐
│                     API LAYER                           │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐       │
│  │   Events   │  │    RSVP    │  │ Analytics  │       │
│  │    API     │  │    API     │  │    API     │       │
│  └────────────┘  └────────────┘  └────────────┘       │
└─────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────┐
│                   DATA LAYER                            │
│              Supabase (PostgreSQL + Auth)               │
│  ┌────────────┐  ┌────────────┐                        │
│  │   events   │  │registrations│                        │
│  │   table    │  │   table     │                        │
│  └────────────┘  └────────────┘                        │
└─────────────────────────────────────────────────────────┘
```

---

## 🎨 Component Hierarchy

```
App Layout (root)
├── Public Routes
│   ├── Landing Page
│   └── RSVP Flow
│       ├── RSVPForm
│       └── QRCodeDisplay
│
└── Organizer Routes (Protected)
    ├── Organizer Layout (Sidebar)
    │   └── LogoutButton
    │
    ├── Dashboard
    │   ├── EventStats
    │   ├── RecentActivity
    │   └── UpcomingEvents
    │
    ├── Events
    │   ├── EventsList
    │   └── Event Details
    │       ├── EventStats
    │       ├── GuestList
    │       ├── TeamsList
    │       └── DietaryPreferences
    │
    ├── Check-in
    │   ├── QRScanner
    │   ├── ManualCheckIn
    │   └── RealtimeCounter
    │
    └── Analytics
        ├── ShowRateChart
        ├── AttendanceByHourChart
        ├── RSVPBreakdownChart
        └── TeamPerformanceChart
```

---

## 📦 Dependencies Overview

### **Core:**
- Next.js 15.5.5
- React 19.1.0
- TypeScript 5.x

### **Authentication:**
- @supabase/ssr
- @supabase/supabase-js

### **UI:**
- Tailwind CSS 4.x
- Radix UI (primitives)
- Lucide React (icons)
- Recharts (analytics)

### **Forms:**
- react-hook-form
- zod (validation)
- @hookform/resolvers

### **QR Codes:**
- html5-qrcode (scanning)
- qrcode (generation)
- react-qr-code

### **Utilities:**
- date-fns
- nanoid
- clsx

---

## ✨ Recently Added (Latest Commit)

```
New Files:
✅ AUTHENTICATION_COMPLETE.md
✅ DATABASE_MIGRATION.md
✅ QUICK_START_AUTH.md
✅ AUTH_FIX_SUMMARY.md
✅ DEBUG_REGISTRATION.md
✅ SUCCESS_SUMMARY.md
✅ COMMIT_SUMMARY.md
✅ check-database.sql

Updated Files:
✅ All API routes (auth added)
✅ All organizer pages (auth checks)
✅ Analytics components (defensive checks)
✅ Database types (organizer_id)
```

---

## 🚀 Getting Started

### **Essential Files to Know:**

1. **Start Here:**
   - `README.md` - Basic overview
   - `PROJECT_SUMMARY.md` - Complete feature list
   - `AUTHENTICATION_COMPLETE.md` - Auth setup

2. **Development:**
   - `package.json` - Scripts and dependencies
   - `.env.local` - Environment variables
   - `next.config.ts` - Next.js settings

3. **Database:**
   - `DATABASE_MIGRATION.md` - SQL scripts
   - `check-database.sql` - Verification
   - `lib/types/database.ts` - TypeScript types

---

**Last Updated:** October 17, 2025  
**Total Files:** 80+ files  
**Lines of Code:** ~5,000+ lines  
**Status:** ✅ Production Ready

