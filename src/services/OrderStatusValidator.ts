import type { IOrderStatusValidator } from "@/domain/interfaces/IOrderStatusValidator";
import type { OrderStatus } from "@/domain/types/order";

const WORKFLOW: Record<OrderStatus, OrderStatus[]> = {
  New: ["Acknowledged", "Cancelled"],
  Acknowledged: ["In Progress", "Cancelled"],
  "In Progress": ["Completed", "Cancelled"],
  Completed: [],
  Cancelled: [],
};

export class OrderStatusValidator implements IOrderStatusValidator {
  getNextStatuses(current: OrderStatus): OrderStatus[] {
    return WORKFLOW[current];
  }

  canTransition(from: OrderStatus, to: OrderStatus): boolean {
    return WORKFLOW[from].includes(to);
  }

  isFinalStatus(status: OrderStatus): boolean {
    return status === "Completed" || status === "Cancelled";
  }
}
