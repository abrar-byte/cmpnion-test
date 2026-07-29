import { ORDER_IN_PROGRESS_STATUS, ORDER_COMPLETED_STATUS, ORDER_CANCELLED_STATUS, ORDER_ACKNOWLEDGED_STATUS, ORDER_NEW_STATUS, PAYMENT_PAID_STATUS, PAYMENT_PENDING_STATUS, PAYMENT_FAILED_STATUS } from "@/data/constants";

export type OrderStatus = typeof ORDER_NEW_STATUS
  | typeof ORDER_ACKNOWLEDGED_STATUS
  | typeof ORDER_IN_PROGRESS_STATUS
  | typeof ORDER_COMPLETED_STATUS
  | typeof ORDER_CANCELLED_STATUS;

export type PaymentStatus = typeof PAYMENT_PAID_STATUS | typeof PAYMENT_PENDING_STATUS | typeof PAYMENT_FAILED_STATUS;

export type ServiceType =
  | "ROOM_SERVICE"
  | "HOUSEKEEPING"
  | "LAUNDRY"
  | "EXTRA_BED"
  | "SPA_MASSAGE";


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
  ORDER_NEW_STATUS,
  ORDER_ACKNOWLEDGED_STATUS,
  ORDER_IN_PROGRESS_STATUS,
  ORDER_COMPLETED_STATUS,
  ORDER_CANCELLED_STATUS,
];

export const SERVICE_TYPES: ServiceType[] = [
  "ROOM_SERVICE",
  "HOUSEKEEPING",
  "LAUNDRY",
  "EXTRA_BED",
  "SPA_MASSAGE",
];

export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  ROOM_SERVICE: "Room Service",
  HOUSEKEEPING: "Housekeeping",
  LAUNDRY: "Laundry",
  EXTRA_BED: "Extra Bed",
  SPA_MASSAGE: "Spa & Massage",
};

export const PAYMENT_STATUSES: PaymentStatus[] = [PAYMENT_PAID_STATUS, PAYMENT_PENDING_STATUS, PAYMENT_FAILED_STATUS];

export const SLA_THRESHOLD_MINUTES = 15;
