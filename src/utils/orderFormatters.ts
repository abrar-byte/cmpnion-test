import type { OrderStatus, PaymentStatus } from "@/domain/types/order";

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
    New: "info",
    Acknowledged: "primary",
    "In Progress": "warning",
    Completed: "success",
    Cancelled: "error",
  };
  return map[status];
}

export function getPaymentStatusColor(
  status: PaymentStatus,
): "primary" | "success" | "error" | "warning" | "info" | "light" | "dark" {
  const map: Record<PaymentStatus, "success" | "warning" | "error"> = {
    Paid: "success",
    Pending: "warning",
    Failed: "error",
  };
  return map[status];
}
