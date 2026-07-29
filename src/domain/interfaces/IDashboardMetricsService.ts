import type { DashboardMetrics, Order } from "@/domain/types/order";

export interface IDashboardMetricsService {
  calculate(orders: Order[]): DashboardMetrics;
}
