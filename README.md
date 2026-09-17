# ticktock — Timesheet Management SaaS

A production-grade Timesheet Management SaaS web application built with **Next.js (App Router)**, **TypeScript**, **TailwindCSS**, and **NextAuth**. Designed for high visual fidelity and robust frontend architecture as part of the Frontend Developer Technical Assessment.

---

## Table of Contents
- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Demo Credentials](#demo-credentials)
- [Getting Started & Setup](#getting-started--setup)
- [Architecture & Data Isolation](#architecture--data-isolation)
- [Project Structure](#project-structure)
- [Business Logic & Status Rules](#business-logic--status-rules)
- [Testing](#testing)
- [Assumptions & Design Decisions](#assumptions--design-decisions)
- [Time Spent](#time-spent)

---

## Project Overview

**ticktock** is an employee work-hours tracking application built to match the assessment specification and design references. It features:
- A split-screen desktop authentication experience with demo auto-fill and route guards.
- A comprehensive timesheet dashboard with multi-week date range filtering, status filtering, column sorting, and pagination.
- A weekly timesheet detail view with a dynamic progress bar and vertical daily task breakdowns.
- Interactive modal dialogs with real-time validation and numeric steppers for adding, editing, and deleting timesheet entries.
- A strict API architecture where components communicate exclusively with internal Next.js API routes.

---

## Key Features

1. **Authentication & Route Protection (NextAuth)**
   - Dummy authentication via NextAuth credentials provider and JWT session strategy.
   - Pre-configured demo account with one-click auto-fill.
   - Session persistence and route middleware guarding `/timesheets/:path*` (unauthenticated visitors are redirected to `/login`).
   - Profile dropdown with sign-out action and online status indicator.

2. **Timesheets Dashboard (`/timesheets`)**
   - Summary table displaying `WEEK #`, `DATE`, `STATUS`, and `ACTIONS`.
   - Distinct status badges:
     - `COMPLETED` (green pill badge)
     - `INCOMPLETE` (amber pill badge)
     - `MISSING` (rose pill badge)
   - Dynamic action links based on timesheet status:
     - `COMPLETED` → **View**
     - `INCOMPLETE` → **Update**
     - `MISSING` → **Create**
   - Interactive column sorting by week number, start date, and status.
   - Configurable pagination (5, 10, or 20 per page).

3. **Date Range & Status Filters**
   - **Multi-week Date Range Filtering**: Selecting a range (e.g., *1 Jan - 31 Jan*) surfaces all weeks that overlap or fall within that window, rather than just the first matching record.
   - Quick date presets (January 2024, February 2024, All Available) and custom `From` / `To` date pickers.
   - Status filtering (`All`, `Completed`, `Incomplete`, `Missing`).
   - Filters work seamlessly in tandem and can be cleared with a single click.

4. **Weekly Timesheet Detail (`/timesheets/[id]`)**
   - Visual progress indicator displaying `[Logged Hours] / 40 hrs` and percentage.
   - Progress bar dynamically transitions color based on completion (e.g. orange when in-progress, green when completed).
   - Vertical day-by-day task lists (Monday to Friday).
   - Task cards showing description, hours, project tag, and 3-dot dropdown menu for **Edit** and **Delete**.
   - Accessible **+ Add new task** trigger per day.

5. **Add / Edit Entry Modal**
   - Modal matches reference screenshot hierarchy:
     - Project selection dropdown (dynamically retrieved via `/api/projects`).
     - Type of Work dropdown (Bug fixes, Feature Development, Code Review, Testing, Meeting, Research, Other).
     - Task description textarea with helper note.
     - Custom numeric stepper (`[-] [hours] [+]`) with daily limit enforcement.
   - Inline field-level error messages and loading states during submission.

6. **Delete Entry Confirmation**
   - Accessible confirmation modal showing entry summary before deletion to prevent accidental loss.

---

## Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **Next.js 16 (App Router)** | Modern React framework with server components and internal API routes |
| **TypeScript** | Strict type safety across domain entities, API contracts, and components |
| **TailwindCSS v4** | Modern utility-first styling configured with pixel-accurate color palettes |
| **NextAuth v4** | Authentication session management, credentials provider, and route guarding |
| **Lucide React** | Lightweight, accessible iconography |
| **Vitest & Testing Library** | Fast unit and component testing suite with jsdom |
| **Google Fonts Inter** | Clean, modern typography loaded via `next/font/google` |

---

## Demo Credentials

You can sign in using the following demo account (or click the **Auto Fill** button on the login screen):

- **Email**: `john@example.com`
- **Password**: `password123`

---

## Getting Started & Setup

### 1. Prerequisites
- **Node.js**: v18.0.0 or later (tested on Node v24)
- **npm**: v9.0.0 or later

### 2. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 3. Environment Configuration (Optional)
A default development secret is built-in. If you wish to specify an explicit NextAuth secret:
```bash
# Create a .env.local file
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

### 4. Running Locally
Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Running Production Build
```bash
npm run build
npm run start
```

---

## Architecture & Data Isolation

As strictly required by the technical assessment specification:
> **React components never import mock data directly.**

The data flow strictly adheres to a three-tier client-server architecture:

```
┌─────────────────────────────────┐
│     React Client Components     │
│   (Dashboard, Detail, Modals)   │
└──────────────┬──────────────────┘
               │ Calls domain API client
               ▼
┌─────────────────────────────────┐
│     lib/api/client.ts           │
│   (getTimesheets, addEntry...)  │
└──────────────┬──────────────────┘
               │ HTTP Requests (GET, POST, PUT, DELETE)
               ▼
┌─────────────────────────────────┐
│   Next.js Internal API Routes   │
│   (/api/timesheets, /api/...)   │
└──────────────┬──────────────────┘
               │ Service Calls
               ▼
┌─────────────────────────────────┐
│   lib/services/timesheetService │
│   (Filtering, Hours, Status)    │
└──────────────┬──────────────────┘
               │ Isolated Data Layer
               ▼
┌─────────────────────────────────┐
│       lib/mocks/*.ts            │
│   (Mock Store & Initial State)  │
└─────────────────────────────────┘
```

### Internal API Endpoints

- `GET /api/timesheets`: Filtered and paginated timesheets list.
  - Query parameters: `startDate`, `endDate`, `status`, `page`, `limit`.
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
│   │   │   ├── route.ts                    # GET /api/timesheets (filtering & pagination)
│   │   │   └── [id]/
│   │   │       ├── route.ts                # GET /api/timesheets/[id]
│   │   │       └── entries/
│   │   │           ├── route.ts            # POST /api/timesheets/[id]/entries
│   │   │           └── [entryId]/route.ts  # PUT & DELETE entry
│   │   └── user/route.ts                   # GET /api/user
│   ├── login/
│   │   └── page.tsx                        # Split-screen login page
│   ├── timesheets/
│   │   ├── page.tsx                        # Dashboard table view
│   │   └── [id]/
│   │       └── page.tsx                    # Weekly timesheet detail view
│   ├── layout.tsx                          # Root layout with Inter font & AuthProvider
│   ├── page.tsx                            # Root redirect (/timesheets or /login)
│   └── globals.css                         # Tailwind CSS & theme tokens
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx                   # Validated login form with demo helper
│   │   └── AuthProvider.tsx                # NextAuth SessionProvider wrapper
│   ├── layout/
│   │   ├── Header.tsx                      # Header with brand, nav, and user dropdown
│   │   └── Footer.tsx                      # Page footer
│   ├── timesheets/
│   │   ├── TimesheetTable.tsx              # Main table with sortable columns
│   │   ├── TimesheetFilters.tsx            # Date range and status filter controls
│   │   ├── TimesheetStatusBadge.tsx        # Pill badges (COMPLETED, INCOMPLETE, MISSING)
│   │   ├── Pagination.tsx                  # Pagination and items per page selector
│   │   ├── TimesheetTaskItem.tsx           # Individual task row with 3-dot dropdown
│   │   ├── AddEntryModal.tsx               # Add & edit task modal dialog
│   │   ├── DeleteConfirmModal.tsx          # Delete confirmation modal
│   │   └── WeeklyProgressBar.tsx           # Visual progress bar (hours / 40 hrs)
│   └── ui/
│       └── Stepper.tsx                     # [-] [input] [+] numeric stepper component
├── lib/
│   ├── api/
│   │   └── client.ts                       # Typed API client helper functions
│   ├── auth/
│   │   └── authOptions.ts                  # NextAuth credentials config
│   ├── services/
│   │   ├── timesheetService.ts             # In-memory service with business calculations
│   │   ├── projectService.ts               # Project data service
│   │   └── userService.ts                  # User lookup service
│   ├── mocks/
│   │   ├── users.ts                        # Demo user credentials
│   │   ├── projects.ts                     # Available projects
│   │   └── timesheets.ts                   # 10 weeks of initial mock timesheets
│   └── utils/
│       ├── status.ts                       # Business logic for timesheet status calculation
│       └── date.ts                         # Date formatting and multi-week overlap helpers
├── middleware.ts                           # Route guard redirecting unauthenticated users
├── tests/
│   ├── status.test.ts                      # Unit tests for status calculation
│   ├── filters.test.ts                     # Unit tests for date range & status filters
│   ├── AddEntryModal.test.tsx              # Component tests for modal form validation
│   └── TimesheetTable.test.tsx             # Component tests for table rendering
└── types/
    ├── auth.ts                             # User & AuthSession types
    ├── project.ts                          # Project interface
    └── timesheet.ts                        # Timesheet, entry, status, and filter types
```

---

## Business Logic & Status Rules

Timesheet status is calculated dynamically based on total logged hours:

```typescript
export function getTimesheetStatus(totalHours: number): TimesheetStatus {
  if (totalHours >= 40) {
    return 'COMPLETED';
  }
  if (totalHours > 0 && totalHours < 40) {
    return 'INCOMPLETE';
  }
  return 'MISSING';
}
```

- **`COMPLETED`**: 40 hours or more logged by the user.
- **`INCOMPLETE`**: More than 0 but less than 40 hours logged.
- **`MISSING`**: Exactly 0 hours logged.

When tasks are added, updated, or deleted via the internal API, the service layer automatically recalculates `totalHours` and updates the `status` accordingly.

---

## Testing

The project includes an automated test suite powered by **Vitest** and **React Testing Library**.

To run the tests:
```bash
npm test
```

To run the tests in interactive watch mode:
```bash
npm run test:watch
```

### Tested Areas
1. **Status Calculation**: Verifies that 40h yields `COMPLETED`, 20h yields `INCOMPLETE`, and 0h yields `MISSING`.
2. **Multi-Week Date Range Filtering**: Verifies that date ranges spanning multiple weeks return all overlapping weeks.
3. **Modal Form Validation**: Confirms that empty fields or invalid hours trigger validation errors and prevent API submission.
4. **Table Rendering**: Confirms that table headers, status badges, and appropriate action links ("View", "Update", "Create") render correctly.

---

## Assumptions & Design Decisions

1. **In-Memory Store Persistence**: To simulate a production database during local review, the service layer uses an in-memory mutable store attached to `globalThis` in development. Mutations (adding, editing, deleting entries) persist across requests without requiring an external database setup.
2. **Multi-Week Date Range Overlap**: Date ranges use an overlap formula (`weekStart <= filterEnd && weekEnd >= filterStart`), ensuring any week intersecting the selected range is displayed.
3. **Accessible Modal Stepper**: The hours input is implemented as a custom stepper component matching Screenshot 4 with decrement (`-`), increment (`+`), direct numerical input, and bounds enforcement (1 - 24 hours).
4. **Responsive Strategy**: On mobile screens (under 768px), the login page focuses on the form while preserving branding; the timesheets dashboard uses horizontal scroll for the table and stacks filters cleanly.

---

## Time Spent

| Phase / Activity | Time Allocated |
| :--- | :--- |
| **Requirements Analysis & Architecture Planning** | 45 minutes |
| **Project Setup, Next.js App Router, Tailwind 4 & NextAuth Configuration** | 45 minutes |
| **Domain Types, Mock Layer & In-Memory Service Engine** | 45 minutes |
| **Internal Next.js API Routes & Typed API Client** | 45 minutes |
| **Authentication Screen & Brand Marketing Split UI** | 40 minutes |
| **Timesheets Dashboard (Table, Sorting, Filters, Pagination)** | 60 minutes |
| **Weekly Detail Page, Vertical Task List & Dynamic Progress Bar** | 60 minutes |
| **Add / Edit Entry Modal, Stepper & Delete Confirmation Modal** | 45 minutes |
| **Automated Tests (Vitest & React Testing Library)** | 35 minutes |
| **Browser E2E Flow Verification & Documentation** | 40 minutes |
| **Total Development Time** | **~7.5 hours** |
