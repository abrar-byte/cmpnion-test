import type { IOrderRepository } from "@/domain/interfaces/IOrderRepository";
import type { Order, OrderStatus } from "@/domain/types/order";
import { MOCK_ORDERS } from "@/data/mock/orders";

const FETCH_DELAY_MS = 600;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class MockOrderRepository implements IOrderRepository {
  private orders: Order[] = [...MOCK_ORDERS];
  private shouldFail = false;

  setSimulateFailure(value: boolean) {
    this.shouldFail = value;
  }

  async getOrders(): Promise<Order[]> {
    await delay(FETCH_DELAY_MS);
    if (this.shouldFail) {
      throw new Error("Unable to fetch orders. Please try again.");
    }
    return [...this.orders];
  }

  async getOrderById(id: string): Promise<Order | null> {
    await delay(200);
    return this.orders.find((order) => order.id === id) ?? null;
  }

  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
    await delay(300);
    const index = this.orders.findIndex((order) => order.id === id);
    if (index === -1) {
      throw new Error(`Order ${id} not found`);
    }
    const updated = { ...this.orders[index], orderStatus: status };
    this.orders[index] = updated;
    return updated;
  }
}
