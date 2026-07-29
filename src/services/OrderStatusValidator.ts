import type { IOrderStatusValidator } from "@/domain/interfaces/IOrderStatusValidator";
import type { OrderStatus } from "@/domain/types/order";
import {
  ORDER_ACKNOWLEDGED_STATUS,
  ORDER_CANCELLED_STATUS,
  ORDER_COMPLETED_STATUS,
  ORDER_IN_PROGRESS_STATUS,
  ORDER_NEW_STATUS,
} from "@/data/constants";

const WORKFLOW: Record<OrderStatus, OrderStatus[]> = {
  [ORDER_NEW_STATUS]: [ORDER_ACKNOWLEDGED_STATUS, ORDER_CANCELLED_STATUS],
  [ORDER_ACKNOWLEDGED_STATUS]: [
    ORDER_IN_PROGRESS_STATUS,
    ORDER_CANCELLED_STATUS,
  ],
  [ORDER_IN_PROGRESS_STATUS]: [ORDER_COMPLETED_STATUS, ORDER_CANCELLED_STATUS],
  [ORDER_COMPLETED_STATUS]: [],
  [ORDER_CANCELLED_STATUS]: [],
};

export class OrderStatusValidator implements IOrderStatusValidator {
  getNextStatuses(current: OrderStatus): OrderStatus[] {
    return WORKFLOW[current];
  }

  canTransition(from: OrderStatus, to: OrderStatus): boolean {
    return WORKFLOW[from].includes(to);
  }

  isFinalStatus(status: OrderStatus): boolean {
    return (
      status === ORDER_COMPLETED_STATUS || status === ORDER_CANCELLED_STATUS
    );
  }
}
