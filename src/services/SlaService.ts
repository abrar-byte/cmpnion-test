import type { ISlaService } from "@/domain/interfaces/ISlaService";
import type { Order } from "@/domain/types/order";
import { SLA_THRESHOLD_MINUTES } from "@/domain/types/order";

export class SlaService implements ISlaService {
  isOverdue(order: Order): boolean {
    if (order.orderStatus !== "New") return false;
    return this.getOverdueMinutes(order) > SLA_THRESHOLD_MINUTES;
  }

  getOverdueMinutes(order: Order): number {
    const elapsed = Date.now() - new Date(order.orderTime).getTime();
    return Math.floor(elapsed / (60 * 1000));
  }
}
