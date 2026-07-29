import { MockOrderRepository } from "@/data/repositories/MockOrderRepository";
import { DashboardMetricsService } from "@/services/DashboardMetricsService";
import { DashboardChartService } from "@/services/DashboardChartService";
import { OrderQueryService } from "@/services/OrderQueryService";
import { OrderService } from "@/services/OrderService";
import { OrderStatusValidator } from "@/services/OrderStatusValidator";
import { SlaService } from "@/services/SlaService";

const orderRepository = new MockOrderRepository();
const orderStatusValidator = new OrderStatusValidator();

export const orderService = new OrderService(
  orderRepository,
  orderStatusValidator,
);

export const orderQueryService = new OrderQueryService();
export const dashboardMetricsService = new DashboardMetricsService();
export const dashboardChartService = new DashboardChartService();
export const slaService = new SlaService();

export { orderRepository };
