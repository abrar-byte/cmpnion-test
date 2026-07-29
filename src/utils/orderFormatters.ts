import {
  ORDER_ACKNOWLEDGED_STATUS,
  ORDER_CANCELLED_STATUS,
  ORDER_COMPLETED_STATUS,
  ORDER_IN_PROGRESS_STATUS,
  ORDER_NEW_STATUS,
  PAYMENT_FAILED_STATUS,
  PAYMENT_PAID_STATUS,
  PAYMENT_PENDING_STATUS,
} from "@/data/constants";
import {
  SERVICE_TYPE_LABELS,
  type OrderStatus,
  type PaymentStatus,
  type ServiceType,
} from "@/domain/types/order";

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatOrderTime(isoDate: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(isoDate));
}

export function getOrderStatusColor(
  status: OrderStatus,
): "primary" | "success" | "error" | "warning" | "info" | "light" | "dark" {
  const map: Record<
    OrderStatus,
    "primary" | "success" | "error" | "warning" | "info"
  > = {
    [ORDER_NEW_STATUS]: "info",
    [ORDER_ACKNOWLEDGED_STATUS]: "primary",
    [ORDER_IN_PROGRESS_STATUS]: "warning",
    [ORDER_COMPLETED_STATUS]: "success",
    [ORDER_CANCELLED_STATUS]: "error",
  };
  return map[status];
}

export function getPaymentStatusColor(
  status: PaymentStatus,
): "primary" | "success" | "error" | "warning" | "info" | "light" | "dark" {
  const map: Record<PaymentStatus, "success" | "warning" | "error"> = {
    [PAYMENT_PAID_STATUS]: "success",
    [PAYMENT_PENDING_STATUS]: "warning",
    [PAYMENT_FAILED_STATUS]: "error",
  };
  return map[status];
}

export function formatServiceType(serviceType: ServiceType): string {
  return SERVICE_TYPE_LABELS[serviceType];
}

const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [ORDER_NEW_STATUS]: "New",
  [ORDER_ACKNOWLEDGED_STATUS]: "Acknowledged",
  [ORDER_IN_PROGRESS_STATUS]: "In Progress",
  [ORDER_COMPLETED_STATUS]: "Completed",
  [ORDER_CANCELLED_STATUS]: "Cancelled",
};

const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  [PAYMENT_PAID_STATUS]: "Paid",
  [PAYMENT_PENDING_STATUS]: "Pending",
  [PAYMENT_FAILED_STATUS]: "Failed",
};

export function formatOrderStatus(status: OrderStatus): string {
  return ORDER_STATUS_LABELS[status];
}

export function formatPaymentStatus(status: PaymentStatus): string {
  return PAYMENT_STATUS_LABELS[status];
}

export function getAvailablePaymentTransitions(
  current: PaymentStatus,
): PaymentStatus[] {
  switch (current) {
    case PAYMENT_PENDING_STATUS:
      return [PAYMENT_PAID_STATUS, PAYMENT_FAILED_STATUS];
    case PAYMENT_PAID_STATUS:
      return [PAYMENT_FAILED_STATUS];
    case PAYMENT_FAILED_STATUS:
      return [PAYMENT_PAID_STATUS];
    default:
      return [];
  }
}

export function requiresPaymentConfirmation(status: PaymentStatus): boolean {
  return status === PAYMENT_PAID_STATUS || status === PAYMENT_FAILED_STATUS;
}
