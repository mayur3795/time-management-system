# TickTock - Time Management System

TickTock is a time management and timesheet application built to manage employee working hours and weekly timesheet entries. It includes a timesheet dashboard, filters, weekly details, entry management, and responsive UI for different screen sizes.

---

## 1. Project Setup

### Prerequisites

Before running the project, make sure you have:

* **Node.js:** `18.17.0+`
* **npm:** `9.0.0+`

### Installation

Clone the repository and install the dependencies:

```bash
git clone <repository-url>

cd time-management-system

npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key
```

Update the values according to the environment where the application is running.

### Run Locally

Start the development server:

```bash
npm run dev
```

The application will be available at:

```
http://localhost:3000
```

### Production

To create and run a production build:

```bash
npm run build
npm start
```

---

## 2. Frameworks & Libraries

The project uses the following main technologies:

* **Next.js 16** - Main application framework using the App Router.
* **React 19** - Used for building the UI and reusable components.
* **TypeScript** - Used for type safety across the application.
* **Tailwind CSS v4** - Used for styling and responsive layouts.
* **TanStack React Query v5** - Used for API requests, caching, and server data handling.
* **React Hook Form** - Used for handling forms.
* **Zod** - Used for form validation.
* **Axios** - Used for API communication.
* **Lucide React** - Used for icons throughout the application.
* **NextAuth.js** - Used for authentication and session handling.
* **Vitest** - Used for running tests.
* **React Testing Library** - Used for testing React components.

---

## 3. Features Implemented

### Timesheet Dashboard

* Displays the list of employee timesheets.
* Supports pagination.
* Supports filtering by timesheet status.
* Supports start and end date filters.
* Provides actions for viewing timesheet details.

### Weekly Timesheet Details

* Displays timesheet information week by week.
* Shows daily work/task entries.
* Displays weekly target and progress information.
* Allows users to add and update timesheet entries.
* Entry forms include validation before submission.

### Responsive UI

* Works across desktop, tablet, and mobile screen sizes.
* Dialog layouts are adjusted based on screen size.
* Desktop uses a standard modal layout.
* Mobile uses a bottom-sheet style layout.

### Reusable Components

Common UI elements have been separated into reusable components, including:

* Button
* Input
* Card
* Form
* Modal
* Responsive Dialog

This keeps the feature components smaller and makes common UI patterns easier to reuse.

### API Integration

* API communication is handled through a common Axios setup.
* API services are separated from UI components.
* TanStack React Query is used for client-side data fetching and caching.

### Loading & Error States

* Loading states are shown while data is being fetched.
* Skeleton placeholders are used for the main timesheet sections.
* Basic error handling is included for API and form operations.

---

## 4. Assumptions & Notes

* API endpoints are currently implemented/mocked within the project for the required timesheet functionality.
* The API layer covers data such as timesheets, entries, projects, and session information.
* Dates are handled consistently to avoid differences between server and browser rendering.
* The application requires the configured environment variables to run correctly.
* Some data used in the UI may be static/mock data depending on API availability.
* The UI was implemented based on the provided requirements and design.
* If the actual backend API response structure changes, the API/service layer may need to be updated.
* The project uses reusable components so additional timesheet functionality can be added without making major changes to the existing UI.

---

## 5. Testing

Tests were added using **Vitest** and **React Testing Library**.

Run the test suite with:

```bash
npm run test
```

### Areas Covered

The following areas were tested:

* Button rendering and click handling.
* Button loading and disabled states.
* Timesheet table rendering.
* Timesheet status display.
* Timesheet action handling.
* Add-entry form validation.
* Invalid form submissions.
* Filter functionality.
* Date range handling.
* Status label formatting.

### Final Checks

The following commands were used to verify the application before completion:

```bash
npm run lint
npm run test
npm run build
```

---

## 6. Deployment

The application can be deployed to **Vercel** or another Node.js-compatible hosting platform.

### Deployment Steps

1. Add the required environment variables to the deployment environment.
2. Install the project dependencies.
3. Create the production build.
4. Start the application.

```bash
npm install
npm run build
npm start
```

For Vercel, the repository can be connected directly and the required environment variables can be added from the project settings.

---

## 7. Time Spent

The total implementation time was approximately **20 hours**.

| Task / Phase                                       |       Time |
| -------------------------------------------------- | ---------: |
| Project review and understanding requirements      |      2 hrs |
| Project setup and Next.js App Router configuration |      2 hrs |
| Axios setup and API/service structure              |      2 hrs |
| Reusable UI components and responsive dialog setup |      3 hrs |
| Timesheet dashboard and filtering                  |      3 hrs |
| Weekly timesheet details and entry functionality   |      3 hrs |
| Responsive UI improvements and loading states      |      2 hrs |
| Testing, debugging and final fixes                 |      2 hrs |
| Deployment setup and README documentation          |       1 hr |
| **Total**                                          | **20 hrs** |

---

## Notes

The main focus during the implementation was to keep the code structure simple and reusable while covering the required timesheet functionality.

Existing components were reused where possible, and the implementation was kept flexible so that real API integration can be added or updated without requiring major changes to the UI.
