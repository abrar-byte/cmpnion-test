import type { Order, OrderStatus, ServiceType } from "@/domain/types/order";
import { ORDER_STATUSES, SERVICE_TYPES } from "@/domain/types/order";

export type ActivityPeriod = "today" | "week";

export interface DashboardChartData {
  activity: {
    categories: string[];
    orders: number[];
    revenue: number[];
  };
  serviceOrders: {
    categories: string[];
    data: number[];
  };
  statusBreakdown: {
    labels: OrderStatus[];
    data: number[];
  };
  completionRate: number;
  revenueToday: number;
  dailyTarget: number;
}

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export class DashboardChartService {
  buildChartData(orders: Order[], period: ActivityPeriod = "week"): DashboardChartData {
    return {
      activity: this.buildActivity(orders, period),
      serviceOrders: this.buildServiceOrders(orders),
      statusBreakdown: this.buildStatusBreakdown(orders),
      completionRate: this.calculateCompletionRate(orders),
      revenueToday: this.calculateRevenueToday(orders),
      dailyTarget: 500,
    };
  }

  private buildActivity(orders: Order[], period: ActivityPeriod) {
    if (period === "today") {
      const slots = Array.from({ length: 12 }, (_, i) => i * 2);
      const now = new Date();
      const startOfDay = new Date(now);
      startOfDay.setHours(0, 0, 0, 0);

      const categories = slots.map((hour) => {
        const d = new Date(startOfDay);
        d.setHours(hour);
        return d.toLocaleTimeString("en-US", { hour: "numeric", hour12: true });
      });

      const ordersData = slots.map((hour) => {
        const slotStart = new Date(startOfDay);
        slotStart.setHours(hour);
        const slotEnd = new Date(startOfDay);
        slotEnd.setHours(hour + 2);
        return orders.filter((o) => {
          const t = new Date(o.orderTime);
          return t >= slotStart && t < slotEnd;
        }).length;
      });

      const revenueData = slots.map((hour) => {
        const slotStart = new Date(startOfDay);
        slotStart.setHours(hour);
        const slotEnd = new Date(startOfDay);
        slotEnd.setHours(hour + 2);
        return orders
          .filter((o) => {
            const t = new Date(o.orderTime);
            return (
              t >= slotStart &&
              t < slotEnd &&
              o.orderStatus === "Completed"
            );
          })
          .reduce((sum, o) => sum + o.amount, 0);
      });

      return { categories, orders: ordersData, revenue: revenueData };
    }

    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      d.setHours(0, 0, 0, 0);
      return d;
    });

    const categories = days.map((d) =>
      d.toLocaleDateString("en-US", { weekday: "short" }),
    );

    const ordersData = days.map((day) =>
      orders.filter((o) => isSameDay(new Date(o.orderTime), day)).length,
    );

    const revenueData = days.map((day) =>
      orders
        .filter(
          (o) =>
            isSameDay(new Date(o.orderTime), day) &&
            o.orderStatus === "Completed",
        )
        .reduce((sum, o) => sum + o.amount, 0),
    );

    return { categories, orders: ordersData, revenue: revenueData };
  }

  private buildServiceOrders(orders: Order[]) {
    const counts = new Map<ServiceType, number>();
    for (const type of SERVICE_TYPES) counts.set(type, 0);
    for (const order of orders) {
      counts.set(order.serviceType, (counts.get(order.serviceType) ?? 0) + 1);
    }
    return {
      categories: SERVICE_TYPES.map((t) =>
        t.length > 12 ? t.replace(" & ", "\n& ") : t,
      ),
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

  private calculateCompletionRate(orders: Order[]): number {
    if (orders.length === 0) return 0;
    const completed = orders.filter((o) => o.orderStatus === "Completed").length;
    return Math.round((completed / orders.length) * 100);
  }

  private calculateRevenueToday(orders: Order[]): number {
    const today = new Date();
    return orders
      .filter(
        (o) =>
          isSameDay(new Date(o.orderTime), today) &&
          o.orderStatus === "Completed",
      )
      .reduce((sum, o) => sum + o.amount, 0);
  }
}
