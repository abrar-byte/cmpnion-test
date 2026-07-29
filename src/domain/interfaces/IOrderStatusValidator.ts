import type { OrderStatus } from "@/domain/types/order";

export interface IOrderStatusValidator {
  getNextStatuses(current: OrderStatus): OrderStatus[];
  canTransition(from: OrderStatus, to: OrderStatus): boolean;
  isFinalStatus(status: OrderStatus): boolean;
}
