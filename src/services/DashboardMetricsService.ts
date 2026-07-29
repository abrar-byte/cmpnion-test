import { ACTIVE_STATUSES, ORDER_COMPLETED_STATUS } from "@/data/constants";
import type { IDashboardMetricsService } from "@/domain/interfaces/IDashboardMetricsService";
import type { DashboardMetrics, Order, ServiceType } from "@/domain/types/order";

const isToday = (isoDate: string) => {
  const date = new Date(isoDate);
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
};

export class DashboardMetricsService implements IDashboardMetricsService {
  calculate(orders: Order[]): DashboardMetrics {
    const activeStatuses = new Set(ACTIVE_STATUSES);
    const activeOrders = orders.filter((o) => activeStatuses.has(o.orderStatus));
    const activeGuestRooms = new Set(activeOrders.map((o) => o.roomNumber));

    const completedToday = orders.filter(
      (o) => o.orderStatus === ORDER_COMPLETED_STATUS && isToday(o.orderTime),
    );

    const revenueToday = completedToday.reduce((sum, o) => sum + o.amount, 0);
    const completedCount = completedToday.length;
    const averageOrderValue =
      completedCount > 0 ? revenueToday / completedCount : 0;

    const serviceCounts = new Map<ServiceType, number>();
    for (const order of orders) {
      serviceCounts.set(
        order.serviceType,
        (serviceCounts.get(order.serviceType) ?? 0) + 1,
      );
    }

    const topSellingServices = [...serviceCounts.entries()]
      .map(([serviceType, count]) => ({ serviceType, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    return {
      activeGuests: activeGuestRooms.size,
      pendingOrders: activeOrders.length,
      revenueToday,
      completedOrders: completedCount,
      averageOrderValue,
      topSellingServices,
    };
  }
}
