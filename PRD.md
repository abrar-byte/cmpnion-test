# Product Requirements Document (PRD)

# CMPNION Hotel Service Management Dashboard

---

# 1. Overview

CMPNION is a digital platform that helps hotels manage guest services more efficiently. This dashboard is designed for hotel operational staff to monitor, process, and manage guest service requests from a centralized interface.

The project focuses on building a frontend dashboard that provides visibility into hotel operations and enables staff to respond to guest requests quickly and efficiently.

---

# 2. Goals

The dashboard should enable hotel staff to:

- Monitor the hotel's operational status at a glance.
- Identify orders that require immediate attention.
- Process guest service requests efficiently.
- Reduce service delays.
- Quickly search and locate specific orders.

---

# 3. Target Users

### Primary Users

- Front Office Staff
- Concierge
- Room Service Staff
- Housekeeping Supervisor

---

# 4. Scope

## In Scope

- Dashboard Overview
- Order Management
- Order Details
- Search
- Filtering
- Sorting
- Order Status Updates
- SLA Highlighting

## Out of Scope

- Payment Processing
- Guest-facing Application
- Hotel Room Management
- Inventory Management

---

# 5. Functional Requirements

## 5.1 Dashboard Overview

Display a summary of hotel operations using KPI cards.

### Metrics

| Metric | Description |
|---------|-------------|
| Active Guests | Number of guests currently checked in |
| Pending Orders | Number of orders awaiting completion |
| Revenue Today | Total revenue generated today |
| Completed Orders | Number of completed orders today |
| Average Order Value | Average value of each order |
| Top Selling Services | Most frequently ordered services |

---

## 5.2 Order List

The dashboard should display a list of all guest service orders.

Each row should include:

- Order ID
- Guest Name
- Room Number
- Service Type
- Quantity
- Order Time
- Order Status
- Payment Status

### Service Types

- Room Service
- Housekeeping
- Laundry
- Extra Bed
- Spa & Massage

### Payment Status

- Paid
- Pending
- Failed

### Order Status

- New
- Acknowledged
- In Progress
- Completed
- Cancelled

---

## 5.3 Order Lifecycle

Hotel staff should be able to update the order status following the workflow below.

### Valid Workflow

```text
New
 ↓
Acknowledged
 ↓
In Progress
 ↓
Completed
```

### Cancellation Workflow

```text
New
Acknowledged
In Progress
      ↓
 Cancelled
```

### Business Rules

- Orders can only move to the next status in the workflow.
- Orders cannot skip directly from **New** to **Completed**.
- **Completed** is a final status and cannot be modified.
- **Cancelled** is a final status and cannot be modified.
- A confirmation dialog must be displayed before cancelling an order.

---

## 5.4 Search

Users should be able to search orders by:

- Guest Name
- Order ID
- Room Number

### Requirements

- Search must be **case-insensitive**.
- Search should work together with filtering and sorting.

---

## 5.5 Filtering

Users should be able to filter orders by:

### Order Status

- New
- Acknowledged
- In Progress
- Completed
- Cancelled

### Service Type

- Room Service
- Housekeeping
- Laundry
- Extra Bed
- Spa & Massage

### Requirements

- Multiple filters can be applied simultaneously.
- Filters should remain active while searching.
- Users should be able to clear all filters with a single action.

---

## 5.6 Sorting

Users should be able to sort orders by:

- Order Time (Newest First)
- Order Time (Oldest First)

Sorting should continue to work while search and filters are applied.

---

## 5.7 Order Details

Users should be able to view detailed information about an order.

Minimum information includes:

- Order ID
- Guest Name
- Room Number
- Service Type
- Quantity
- Special Request
- Payment Status
- Order Status
- Order Time

The detail view may be implemented using:

- Modal
- Drawer
- Dedicated Page

---

## 5.8 SLA Highlighting

Orders that remain in the **New** status for more than **15 minutes** must display a visual warning indicator.

Possible implementations include:

- Red badge
- Red border
- Warning background
- Alert icon

The goal is to help staff identify and process overdue orders more quickly.

---

# 6. Non-Functional Requirements

The dashboard should:

- Be responsive across Desktop, Tablet, and Mobile devices.
- Provide a Loading State.
- Provide an Empty State.
- Provide an Error State.
- Include a Retry action when data loading fails.
- Maintain good rendering performance with large datasets.
- Use reusable components.
- Follow a maintainable and scalable code structure.

---

# 7. Technical Requirements

## Mandatory

- React
- TypeScript
- Functional Components
- Bun Runtime

## Recommended

- Vite
- TanStack Query
- React Router
- React Hook Form
- Zod
- Tailwind CSS

## Code Quality

- SOLID Principles
- Clean Architecture
- Reusable Components
- Consistent Folder Structure
- Strong Type Safety

---

# 8. Assumptions

Since this assessment focuses on frontend development:

- Data may come from a Mock API or Static JSON.
- Authentication is not required.
- Payment Status is read-only.
- Backend integration is not required.
- Data persistence is not required.

---

# 9. Bonus Features

## User Experience

- Dark Mode
- Skeleton Loading
- Toast Notifications
- Keyboard Navigation

## Functionality

- Real-time Order Updates
- URL-based Filters
- Pagination
- Infinite Scrolling
- Optimistic UI Updates

## Engineering

- Unit Testing
- Integration Testing
- Event Tracking
- Protected Routes
- Reusable Design System

---

# 10. Acceptance Criteria

The application is considered complete when:

- All KPI cards are displayed correctly.
- The order list is displayed correctly.
- Search functionality works as expected.
- Multiple filters can be combined.
- Sorting functions correctly.
- Order details can be viewed.
- Order status can be updated according to the defined workflow.
- **Completed** and **Cancelled** orders cannot be modified.
- Orders exceeding the SLA display a visual warning.
- Loading, Empty, and Error states are implemented.
- The application is fully responsive across Desktop, Tablet, and Mobile devices.