import type { ServiceType } from "@/domain/types/order";

export interface DashboardSummary {
  activeGuests: number;
  pendingOrders: number;
  revenueToday: number;
  completedOrders: number;
  averageOrderValue: number;
  topSellingServices: TopSellingService[];
}

export interface TopSellingService {
  serviceType: ServiceType;
  count: number;
}

export interface DashboardCard {
  label: string;
  value: string | number;
  trend?: number;
}
