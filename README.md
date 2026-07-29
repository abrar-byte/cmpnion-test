# CMPNION Hotel Service Management Dashboard

A web dashboard for hotel operational staff to monitor guest service requests, track KPIs, and manage orders from a single interface.

## Project Overview

CMPNION helps front office, concierge, room service, and housekeeping teams respond to guest requests faster. The dashboard provides:

- **Dashboard overview** — KPI cards (active guests, pending orders, revenue, completed orders, average order value, top-selling services) and charts for service volume and order status breakdown
- **Order management** — searchable, filterable, sortable order list with pagination
- **Order details** — view guest, room, service, and payment information
- **Status workflow** — update orders through `NEW → ACKNOWLEDGED → IN_PROGRESS → COMPLETED` or `CANCELLED`
- **SLA highlighting** — visual warning when an order exceeds the 15-minute threshold
- **Authentication** — protected routes via Supabase Auth


## Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime & package manager | [Bun](https://bun.sh) |
| Framework | React 19 + TypeScript |
| Build tool | Vite 6 |
| Styling | Tailwind CSS v4 |
| Routing | React Router 7 |
| Server state | TanStack Query v5 |
| Forms & validation | React Hook Form + Zod |
| Backend / database | Supabase (PostgreSQL + Auth) |
| Charts | ApexCharts |

## Prerequisites

- [Bun](https://bun.sh) 1.0 or later
- A Supabase project with the required tables (`orders`, `customers`) and Auth enabled

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd cmpconion
```

2. Install dependencies:

```bash
bun install
```

3. Create environment variables from the example file:

```bash
cp .env.example .env
```

4. Fill in your Supabase credentials in `.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

## Running Locally with Bun

Start the development server:

```bash
bun run dev
```

The app runs at `http://localhost:5173` by default.

Other available scripts:

```bash
bun run build    # Type-check and build for production
bun run preview  # Preview the production build locally
bun run lint     # Run ESLint
```

Sign in at `/signin` with your Supabase credentials. Protected routes (`/` and `/orders`) redirect unauthenticated users to the sign-in page.

## Tests

No automated test suite is configured yet. The project is structured to support unit and integration tests — service functions are plain async functions with no React dependencies, making them straightforward to test in isolation.

To add tests in the future, a common setup would be:

```bash
bun add -d vitest @testing-library/react @testing-library/jest-dom jsdom
```

## Architectural Decisions

### API Abstraction Layer

Components never call Supabase directly. Data flows through three layers per feature:

```
React Component
      ↓
TanStack Query hooks  (*.query.ts)
      ↓
Service layer         (*.service.ts)
      ↓
Supabase client
      ↓
Database
```

This keeps the UI decoupled from the data source. Replacing Supabase with a REST or GraphQL API would only require changes in the service layer.

### Feature-based folder structure

Each domain feature lives under `src/services/` with a consistent trio of files:

```
src/services/
├── dashboard/
│   ├── dashboard.service.ts   # Supabase queries & data mapping
│   ├── dashboard.query.ts     # TanStack Query hooks
│   └── dashboard.types.ts     # Feature-specific types
└── orders/
    ├── orders.service.ts
    ├── orders.query.ts
    └── orders.types.ts
```

Shared domain types (e.g. `Order`, `OrderStatus`) live in `src/domain/types/`. UI components consume only query hooks and domain types — never service functions or Supabase imports.

### Separation of concerns

| Concern | Location |
|---------|----------|
| Data fetching & caching | `*.query.ts` + TanStack Query |
| Database access & mapping | `*.service.ts` |
| UI rendering | `src/components/`, `src/pages/` |
| Local UI state (filters, modals) | Custom hooks (`useOrderFilters`, `useModal`) |
| Auth session | `useAuth` hook |
| Layout & navigation | `src/layout/` |

### Protected routes

`AppLayout` wraps all authenticated pages. It uses `useAuth` to check the Supabase session and redirects to `/signin` when unauthenticated.

## State Management Approach

The app uses a layered state strategy rather than a global store:

### Server state — TanStack Query

All remote data (dashboard metrics, order lists, order details, mutations) is managed by TanStack Query. The `QueryProvider` configures defaults:

- `staleTime`: 1 minute
- `gcTime`: 10 minutes
- `retry`: 1

Query hooks handle loading, error, and cache invalidation. Mutations (create, update, status change) invalidate related query keys so the dashboard and order list stay in sync.

### UI state — React Context

React Context is used only for cross-cutting UI concerns:

- **ThemeContext** — light/dark mode, persisted to `localStorage`
- **SidebarContext** — sidebar expand/collapse and mobile open state

### Local state — `useState` + custom hooks

Component-scoped and feature-scoped state uses `useState` via custom hooks:

- `useOrderFilters` — search text, status/service filters, sort order
- `useModal` — modal open/close
- `useAuth` — authentication session and loading state

Form state is handled by React Hook Form with Zod schemas for validation (e.g. sign-in form).

## API / Data Approach

### Supabase as backend

The app connects to Supabase through a single client initialized in `src/utils/supabase.ts` using `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`.

### Data model

Key entities:

- **orders** — guest service requests with status, payment status, service type, amount, room number, and timestamps
- **customers** — guest records linked to orders; active guests are those without a `check_out` date

### Service layer responsibilities

Service functions (`orders.service.ts`, `dashboard.service.ts`):

- Execute Supabase queries (`.from()`, `.select()`, filters, pagination)
- Map database rows to domain types (e.g. `OrderRow` → `Order`)
- Throw typed errors for the query layer to surface

### Query layer responsibilities

Query hooks (`orders.query.ts`, `dashboard.query.ts`):

- Wrap service functions with `useQuery` / `useMutation`
- Define query keys for cache management
- Invalidate related queries on mutation success
- Never import or call Supabase directly

### Example data flow

```ts
// Component
const { data, isLoading, error } = useOrdersList({ page: 1, pageSize: 10 });

// Query hook (orders.query.ts)
export function useOrdersList(params) {
  return useQuery({
    queryKey: getOrdersListQueryKey(params),
    queryFn: () => getOrdersList(params),
  });
}

// Service (orders.service.ts)
export async function getOrdersList(params) {
  const { data, error } = await supabase.from("orders").select(...);
  // map rows → Order[], return paginated result
}
```

## Project Structure

```
src/
├── components/       # Reusable UI and feature components
├── context/          # React Context providers (theme, sidebar, query)
├── data/             # Constants and mock data
├── domain/           # Shared types and interfaces
├── hooks/            # Custom React hooks
├── layout/           # App shell (header, sidebar, layout)
├── pages/            # Route-level page components
├── services/         # Feature services + query hooks
│   ├── dashboard/
│   └── orders/
└── utils/            # Helpers (Supabase client, formatters, date ranges)
```

## License

MIT
