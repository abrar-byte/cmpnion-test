import type { Order, OrderStatus } from "@/domain/types/order";

export interface IOrderRepository {
  getOrders(): Promise<Order[]>;
  getOrderById(id: string): Promise<Order | null>;
  updateOrderStatus(id: string, status: OrderStatus): Promise<Order>;
}
