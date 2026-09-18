# ticktock — Timesheet Management SaaS

A production-grade Timesheet Management SaaS web application built with **Next.js 16 (App Router)**, **TypeScript**, **Axios**, **TanStack Query (React Query)**, **Zod**, **TailwindCSS**, and **NextAuth**. Designed for high visual fidelity, rock-solid frontend architecture, and assessment readiness.

---

## Table of Contents
- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Demo Credentials](#demo-credentials)
- [Getting Started & Setup](#getting-started--setup)
- [Architecture & Data Flow](#architecture--data-flow)
- [Project Structure](#project-structure)
- [Validation Layer (Zod)](#validation-layer-zod)
- [Business Logic & Status Rules](#business-logic--status-rules)
- [Testing](#testing)
- [SEO & Metadata](#seo--metadata)

---

## Project Overview

**ticktock** is an employee work-hours tracking application built to match the technical assessment specification and visual design references. It features:
- A split-screen desktop authentication experience with demo auto-fill and route guards.
- A comprehensive timesheet dashboard with multi-week date range filtering, status filtering, column sorting, and pagination.
- A weekly timesheet detail view with a dynamic progress bar and vertical daily task breakdowns.
- Interactive modal dialogs with real-time Zod schema validation and numeric steppers for adding, editing, and deleting timesheet entries.
- A strict API architecture where frontend components communicate through TanStack Query hooks, domain services, and a centralized Axios client targeting internal Next.js API routes.

---

## Key Features

1. **Authentication & Route Protection (NextAuth)**
   - Dummy authentication via NextAuth credentials provider and JWT session strategy.
   - Pre-configured demo account with one-click auto-fill.
   - Route middleware guarding `/timesheets/:path*` (unauthenticated visitors are redirected to `/login`).
   - Profile dropdown with sign-out action and online status indicator.

2. **Timesheets Dashboard (`/timesheets`)**
   - Summary table displaying `WEEK #`, `DATE`, `STATUS`, and `ACTIONS`.
   - Distinct status badges:
     - `COMPLETED` (emerald pill badge)
     - `INCOMPLETE` (amber pill badge)
     - `MISSING` (rose pill badge)
   - Dynamic action links based on timesheet status:
     - `COMPLETED` → **View**
     - `INCOMPLETE` → **Update**
     - `MISSING` → **Create**
   - Interactive column sorting by week number, start date, and status.
   - Configurable pagination (5, 10, or 20 per page).

3. **Date Range & Status Filters**
   - **Multi-week Date Range Filtering**: Selecting a range surfaces all weeks that overlap or fall within that window.
   - Quick date presets (January 2024, February 2024, All Available) and custom `From` / `To` date pickers.
   - Status filtering (`All`, `Completed`, `Incomplete`, `Missing`).
   - Filters work seamlessly in tandem and can be cleared with a single click.

4. **Weekly Timesheet Detail (`/timesheets/[id]`)**
   - Visual progress indicator displaying `[Logged Hours] / 40 hrs` and percentage.
   - Progress bar dynamically transitions color based on completion (e.g. orange when in-progress, green when completed).
   - Vertical day-by-day task lists (Monday to Friday).
   - Task cards showing description, hours, project tag, and 3-dot dropdown menu for **Edit** and **Delete**.
   - Accessible **+ Add new task** trigger per day.

5. **Add / Edit Entry Modal (Zod Form Validation)**
   - Project selection dropdown (dynamically retrieved via `/api/projects`).
   - Type of Work dropdown (Bug fixes, Feature Development, Code Review, Testing, Meeting, Research, Other).
   - Task description textarea with helper note.
   - Custom numeric stepper (`[-] [hours] [+]`) with daily limit enforcement.
   - Field-level validation messages powered by Zod schemas.

6. **Delete Entry Confirmation**
   - Accessible confirmation modal showing entry summary before deletion to prevent accidental loss.

---

## Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **Next.js 16 (App Router)** | Modern React framework with server components and internal API routes |
| **TypeScript** | Strict type safety across domain entities, API contracts, and components |
| **TanStack Query (v5)** | Server state management, caching, optimistic invalidation, and query synchronization |
| **Axios** | Centralized API client with interceptors, standard headers, and normalized error handling |
| **Zod (v4)** | Schema-driven runtime validation for forms and API routes |
| **TailwindCSS v4** | Modern utility-first styling configured with pixel-accurate color palettes |
| **NextAuth v4** | Authentication session management, credentials provider, and route guarding |
| **Lucide React** | Lightweight, accessible iconography |
| **Vitest & Testing Library** | Unit and component testing suite with jsdom |
| **Google Fonts Inter** | Clean, modern typography loaded via `next/font/google` |

---

## Demo Credentials

You can sign in using the following demo account (or click the **Auto Fill** button on the login screen):

- **Email**: `john@example.com`
- **Password**: `password123`

---

## Getting Started & Setup

### 1. Prerequisites
- **Node.js**: v18.0.0 or later
- **npm**: v9.0.0 or later

### 2. Installation
Install dependencies:
```bash
npm install
```

### 3. Running Locally
Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Running Production Build
```bash
npm run build
npm run start
```

### 5. Running Tests & Linters
```bash
npm test         # Run unit & component test suite
npm run lint     # Run ESLint check
npx tsc --noEmit # Verify TypeScript compilation
```

---

## Architecture & Data Flow

Components never import mock data directly. The application adheres to a clean multi-tier architecture:

```
USER ACTION
    ↓
React Component (kebab-case file)
    ↓
TanStack Query Hook (useTimesheets, useTimesheet, useCreateTimesheetEntry)
    ↓
Domain Service Function (timesheet.service.ts)
    ↓
Common Axios Instance (src/lib/api/axios.ts)
    ↓
Next.js Internal API Route (/api/timesheets)
    ↓
Zod Validation Schema (timesheet-entry.schema.ts)
    ↓
Server Store Layer (src/server/timesheet-store.ts)
    ↓
Constants Data (src/constants/timesheets.ts)
    ↓
API Response
    ↓
TanStack Query Cache Invalidation & Update
    ↓
React UI Re-renders with Updated Hours & Status
```

### Internal API Endpoints

- `GET /api/timesheets`: Filtered and paginated timesheets list.
- `GET /api/timesheets/[id]`: Retrieve single timesheet with full entries.
- `POST /api/timesheets/[id]/entries`: Create a new entry and recalculate weekly hours/status.
- `PUT /api/timesheets/[id]/entries/[entryId]`: Update an entry and recalculate weekly hours/status.
- `DELETE /api/timesheets/[id]/entries/[entryId]`: Remove an entry and recalculate weekly hours/status.
- `GET /api/projects`: Retrieve list of available projects.
- `GET /api/user`: Retrieve current authenticated user profile.
- `ALL /api/auth/[...nextauth]`: NextAuth authentication handler.

---

## Project Structure

```
src/
├── app/
│   ├── api/                                # Internal Next.js API route handlers
│   │   ├── auth/[...nextauth]/route.ts     # NextAuth credentials handler
│   │   ├── projects/route.ts               # GET /api/projects
│   │   ├── timesheets/
│   │   │   ├── route.ts                    # GET /api/timesheets (Zod validated)
│   │   │   └── [id]/
│   │   │       ├── route.ts                # GET /api/timesheets/[id]
│   │   │       └── entries/
│   │   │           ├── route.ts            # POST /api/timesheets/[id]/entries
│   │   │           └── [entryId]/route.ts  # PUT & DELETE entry
│   │   └── user/route.ts                   # GET /api/user
│   ├── login/
│   │   └── page.tsx                        # Split-screen login page
│   ├── timesheets/
│   │   ├── page.tsx                        # Dashboard view with TanStack Query
│   │   └── [id]/
│   │       └── page.tsx                    # Detail view with TanStack Query mutations
│   ├── icon.svg                            # Custom ticktock brand favicon
│   ├── sitemap.ts                          # Next.js Metadata API sitemap
│   ├── layout.tsx                          # Root layout with QueryProvider & AuthProvider
│   ├── page.tsx                            # Root redirect (/timesheets or /login)
│   └── globals.css                         # Tailwind CSS & theme tokens
├── components/
│   ├── auth/
│   │   ├── auth-provider.tsx               # NextAuth SessionProvider wrapper
│   │   └── login-form.tsx                  # Zod validated login form with demo helper
│   ├── layout/
│   │   ├── header.tsx                      # Header with brand, nav, and user dropdown
│   │   └── footer.tsx                      # Page footer
│   ├── timesheets/
│   │   ├── add-entry-modal.tsx             # Zod validated add & edit task modal
│   │   ├── delete-confirm-modal.tsx        # Delete confirmation modal
│   │   ├── pagination.tsx                  # Pagination and items per page selector
│   │   ├── timesheet-filters.tsx           # Date range and status filter controls
│   │   ├── timesheet-status-badge.tsx      # Pill badges (COMPLETED, INCOMPLETE, MISSING)
│   │   ├── timesheet-table.tsx             # Main table with sortable columns
│   │   ├── timesheet-task-item.tsx         # Task row with 3-dot action dropdown
│   │   └── weekly-progress-bar.tsx         # Visual progress bar (hours / 40 hrs)
│   └── ui/
│       ├── button.tsx                      # Accessible Button with loading state
│       ├── input.tsx                       # Form text input
│       ├── modal.tsx                       # Accessible modal wrapper
│       ├── select.tsx                      # Custom select component
│       └── stepper.tsx                     # Numeric hours stepper
├── constants/
│   ├── projects.ts                         # Shared project definitions
│   ├── query-keys.ts                       # Centralized TanStack Query keys
│   ├── timesheets.ts                       # Initial timesheet seed data
│   ├── users.ts                            # Seed user credentials
│   └── work-types.ts                       # Work categories constant
├── hooks/
│   ├── use-projects.ts                     # Query hook for projects
│   ├── use-timesheets.ts                   # Queries & mutations for timesheets and entries
│   └── use-user.ts                         # Query hook for current user
├── lib/
│   ├── api/
│   │   └── axios.ts                        # Centralized Axios client & ApiError
│   ├── auth/
│   │   └── authOptions.ts                  # NextAuth credentials config
│   └── utils/
│       ├── date.ts                         # Date formatting & multi-week range overlap
│       └── status.ts                       # Business logic for status calculation
├── providers/
│   └── query-provider.tsx                  # TanStack QueryClient provider
├── schemas/
│   ├── auth.schema.ts                      # Zod schema for login
│   ├── timesheet.schema.ts                 # Zod schema for filters and query params
│   └── timesheet-entry.schema.ts           # Zod schema for add/edit entry
├── server/
│   ├── project-store.ts                    # Server-side project data store
│   ├── timesheet-store.ts                  # Server-side timesheet in-memory store
│   └── user-store.ts                       # Server-side user lookup
├── services/
│   ├── auth.service.ts                     # Client auth service
│   ├── project.service.ts                  # Client project service (Axios)
│   ├── timesheet.service.ts                # Client timesheet service (Axios)
│   └── user.service.ts                     # Client user service (Axios)
├── types/
│   ├── auth.ts                             # Auth & user types
│   ├── project.ts                          # Project model interface
│   └── timesheet.ts                        # Timesheet & entry interfaces
└── tests/
    ├── add-entry-modal.test.tsx            # Modal form validation & submit tests
    ├── button.test.tsx                     # Button variant & loading tests
    ├── filters.test.ts                     # Overlap & status filtering tests
    ├── status.test.ts                      # Business logic unit tests
    └── timesheet-table.test.tsx            # Table rendering & badge tests
```

---

## Validation Layer (Zod)

All validation is centralized using Zod schemas:
- **`loginSchema`**: Validates email format and non-empty password.
- **`createEntrySchema`**: Enforces required Project, Type of Work, Task Description, and positive Hours (<= 24).
- **`updateEntrySchema`**: Enforces schema rules for partial/optional updates.
- **`timesheetFilterSchema`**: Validates query parameters on the `/api/timesheets` route.

Both client-side forms and internal API routes use these schemas, guaranteeing UX responsiveness on the client and data integrity on the server.

---

## Business Logic & Status Rules

Timesheet status is calculated dynamically based on actual entries:

$$\text{Total Hours} = \sum \text{Entry Hours}$$

| Total Hours | Status Badge | Visual Indicator |
| :--- | :--- | :--- |
| **$\ge 40$ hours** | `COMPLETED` | Emerald green pill badge |
| **$> 0$ and $< 40$ hours** | `INCOMPLETE` | Amber pill badge |
| **$= 0$ hours** | `MISSING` | Rose pill badge |

When an entry is created, updated, or deleted, TanStack Query invalidates the timesheet query cache. The UI refreshes automatically with recalculated total hours and updated status badges.

---

## Testing

Comprehensive unit and component tests are run with **Vitest**:
- `npm test`: Runs all 5 test suites (15 tests).
- Tests cover status calculations, date range overlap detection, reusable buttons, table rendering, and modal validation.

---

## SEO & Metadata

- **Sitemap**: Generated dynamically via `src/app/sitemap.ts` at `/sitemap.xml`, indexing public routes (`/login`).
- **Favicon**: Modern brand SVG at `src/app/icon.svg` displaying the ticktock clock-badge logo.
- **Metadata**: Professional title and description configured in `src/app/layout.tsx`.
