export type OrderStatus =
  | "New"
  | "Acknowledged"
  | "In Progress"
  | "Completed"
  | "Cancelled";

export type PaymentStatus = "Paid" | "Pending" | "Failed";

export type ServiceType =
  | "Room Service"
  | "Housekeeping"
  | "Laundry"
  | "Extra Bed"
  | "Spa & Massage";

export type SortOrder = "newest" | "oldest";

export interface Order {
  id: string;
  guestName: string;
  roomNumber: string;
  serviceType: ServiceType;
  quantity: number;
  specialRequest?: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  orderTime: string;
  amount: number;
}

export interface DashboardMetrics {
  activeGuests: number;
  pendingOrders: number;
  revenueToday: number;
  completedOrders: number;
  averageOrderValue: number;
  topSellingServices: { serviceType: ServiceType; count: number }[];
}

export interface OrderFilters {
  search: string;
  orderStatuses: OrderStatus[];
  serviceTypes: ServiceType[];
  sortOrder: SortOrder;
}

export const ORDER_STATUSES: OrderStatus[] = [
  "New",
  "Acknowledged",
  "In Progress",
  "Completed",
  "Cancelled",
];

export const SERVICE_TYPES: ServiceType[] = [
  "Room Service",
  "Housekeeping",
  "Laundry",
  "Extra Bed",
  "Spa & Massage",
];

export const PAYMENT_STATUSES: PaymentStatus[] = ["Paid", "Pending", "Failed"];

export const SLA_THRESHOLD_MINUTES = 15;
