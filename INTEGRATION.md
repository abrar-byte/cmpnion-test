# API Abstraction Layer

## Overview

Implement all data integrations using **Supabase** and **TanStack Query** while following an **API Abstraction Layer** architecture.

React components **must never communicate directly with Supabase**. All database operations must be encapsulated within the Service Layer.

The goal is to ensure the application remains independent of the underlying data source, making it easier to replace Supabase with another backend in the future.

---

# Folder Structure

Organize integrations by feature.

```
src/
└── services/
    ├── dashboard/
    │   ├── dashboard.service.ts
    │   ├── dashboard.query.ts
    │   └── dashboard.types.ts
    │
    └── orders/
        ├── orders.service.ts
        ├── orders.query.ts
        └── orders.types.ts
```

---

# Architecture

```
React Component
        │
        ▼
TanStack Query Hooks
        │
        ▼
Service Layer (API Abstraction)
        │
        ▼
Supabase Client
        │
        ▼
Database
```

---

# Responsibilities

## dashboard.service.ts

Acts as the **API Abstraction Layer**.

Responsibilities:

- Communicate directly with Supabase.
- Perform all database queries.
- Handle data transformation if needed.
- Return typed responses.
- Never import React or TanStack Query.

Example responsibilities:

- getDashboardSummary()
- getActiveGuests()
- getPendingOrders()
- getRevenueToday()
- getCompletedOrders()
- getAverageOrderValue()
- getTopSellingServices()

---

## dashboard.query.ts

Contains all TanStack Query hooks.

Responsibilities:

- Consume functions from `dashboard.service.ts`.
- Handle caching.
- Handle loading state.
- Handle error state.
- Handle background refetching.
- Expose reusable hooks for React components.

Example:

- useDashboardSummary()
- useTopSellingServices()

This file must never contain Supabase queries.

---

## dashboard.types.ts

Contains all TypeScript types for the Dashboard feature.

Examples:

- DashboardSummary
- DashboardCard
- TopSellingService

Avoid using `any`.

---

# Orders Module

Apply the same architecture.

```
orders.service.ts
```

Responsible for:

- getOrders()
- getOrderById()
- createOrder()
- updateOrder()
- cancelOrder()
- completeOrder()

Only this file communicates with Supabase.

---

```
orders.query.ts
```

Responsible for exposing hooks such as:

- useOrders()
- useOrder()
- useCreateOrder()
- useUpdateOrder()

No Supabase queries should exist in this file.

---

```
orders.types.ts
```

Contains all order-related interfaces and types.

---

# Development Rules

## Components

Components must only consume TanStack Query hooks.

✅ Correct

```ts
const { data } = useOrders();
```

❌ Incorrect

```ts
await supabase.from("orders").select("*");
```

---

## Service Layer

The Service Layer is the only place where Supabase can be accessed.

Example:

```ts
export async function getOrders() {
    return supabase
        .from("orders")
        .select("*");
}
```

If the backend changes in the future (REST API, GraphQL, etc.), only the Service Layer should require modifications.

---

## TanStack Query

All React Query hooks must call the Service Layer instead of communicating directly with Supabase.

```
Component
    ↓
useOrders()
    ↓
getOrders()
    ↓
Supabase
```

---

# Benefits

- Clear separation of concerns.
- Easy to maintain.
- Easier to test.
- Backend implementation is abstracted from the UI.
- Future backend migration requires changes only in the Service Layer.
- Consistent architecture across all features.