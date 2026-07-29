import type { Order } from "@/domain/types/order";

export interface ISlaService {
  isOverdue(order: Order): boolean;
  getOverdueMinutes(order: Order): number;
}
