import type { Order, OrderStatus, ServiceType } from "@/domain/types/order";
import { ORDER_STATUSES, SERVICE_TYPES } from "@/domain/types/order";

export type ActivityPeriod = "today" | "week";

export interface DashboardChartData {
  serviceOrders: {
    categories: string[];
    data: number[];
  };
  statusBreakdown: {
    labels: OrderStatus[];
    data: number[];
  };
}

export class DashboardChartService {
  buildChartData(orders: Order[]): DashboardChartData {
    return {
      serviceOrders: this.buildServiceOrders(orders),
      statusBreakdown: this.buildStatusBreakdown(orders),
    };
  }

  private buildServiceOrders(orders: Order[]) {
    const counts = new Map<ServiceType, number>();
    for (const type of SERVICE_TYPES) counts.set(type, 0);
    for (const order of orders) {
      counts.set(order.serviceType, (counts.get(order.serviceType) ?? 0) + 1);
    }
    return {
      categories: [...SERVICE_TYPES],
      data: SERVICE_TYPES.map((t) => counts.get(t) ?? 0),
    };
  }

  private buildStatusBreakdown(orders: Order[]) {
    const counts = new Map<OrderStatus, number>();
    for (const status of ORDER_STATUSES) counts.set(status, 0);
    for (const order of orders) {
      counts.set(order.orderStatus, (counts.get(order.orderStatus) ?? 0) + 1);
    }
    return {
      labels: ORDER_STATUSES,
      data: ORDER_STATUSES.map((s) => counts.get(s) ?? 0),
    };
  }
}
