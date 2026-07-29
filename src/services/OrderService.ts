import type { IOrderRepository } from "@/domain/interfaces/IOrderRepository";
import type { IOrderStatusValidator } from "@/domain/interfaces/IOrderStatusValidator";
import type { Order, OrderStatus } from "@/domain/types/order";

export class OrderService {
  constructor(
    private readonly repository: IOrderRepository,
    private readonly statusValidator: IOrderStatusValidator,
  ) {}

  async fetchOrders(): Promise<Order[]> {
    return this.repository.getOrders();
  }

  async fetchOrderById(id: string): Promise<Order | null> {
    return this.repository.getOrderById(id);
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const order = await this.repository.getOrderById(id);
    if (!order) {
      throw new Error(`Order ${id} not found`);
    }
    if (this.statusValidator.isFinalStatus(order.orderStatus)) {
      throw new Error(`Order ${id} is in final status and cannot be modified`);
    }
    if (!this.statusValidator.canTransition(order.orderStatus, status)) {
      throw new Error(
        `Invalid status transition from ${order.orderStatus} to ${status}`,
      );
    }
    return this.repository.updateOrderStatus(id, status);
  }

  getAvailableTransitions(status: OrderStatus): OrderStatus[] {
    return this.statusValidator.getNextStatuses(status);
  }

  isFinalStatus(status: OrderStatus): boolean {
    return this.statusValidator.isFinalStatus(status);
  }
}
