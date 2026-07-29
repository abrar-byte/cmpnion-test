import { supabase } from "@/utils/supabase";
import type { DashboardSummary, TopSellingService } from "./dashboard.types";
import { SERVICE_TYPES, type ServiceType } from "@/domain/types/order";
import { ACTIVE_STATUSES, ORDER_COMPLETED_STATUS } from "@/data/constants";
import { todayRange } from "@/utils";

export async function getDashboardSummary(): Promise<DashboardSummary> {
  try {
    const { start, end } = todayRange();

    const [
      activeResult,
      activeGuestsResult,
      completedTodayResult,
      revenueTodayResult,
    ] = await Promise.all([
      supabase
        .from("orders")
        .select("id", { count: "exact", head: true })
        .in("status", ACTIVE_STATUSES),

      supabase
        .from("customers")
        .select("id")
        .is("check_out", null),

      supabase
        .from("orders")
        .select("id", { count: "exact", head: true })
        .eq("status", ORDER_COMPLETED_STATUS)
        .gte("order_time", start)
        .lt("order_time", end),

      supabase
        .from("orders")
        .select("amount")
        .eq("status", ORDER_COMPLETED_STATUS)
        .gte("order_time", start)
        .lt("order_time", end),
    ]);

    if (activeResult.error) throw activeResult.error;
    if (activeGuestsResult.error) throw activeGuestsResult.error;
    if (completedTodayResult.error) throw completedTodayResult.error;
    if (revenueTodayResult.error) throw revenueTodayResult.error;

    const pendingOrders = activeResult.count ?? 0;

    const completedOrders = completedTodayResult.count ?? 0;
    const revenueToday = (revenueTodayResult.data ?? []).reduce(
      (sum: number, r: { amount: number }) => sum + r.amount,
      0,
    );
    const averageOrderValue =
      completedOrders > 0 ? revenueToday / completedOrders : 0;

    const topSellingServices = await getTopSellingServices();

    return {
      activeGuests: activeGuestsResult.data?.length ?? 0,
      pendingOrders,
      revenueToday,
      completedOrders,
      averageOrderValue,
      topSellingServices,
    };
  } catch (error) {
    console.error("[getDashboardSummary]", error);
    if (error instanceof Error) throw error;
    const message =
      typeof error === "object" &&
      error !== null &&
      "message" in error &&
      typeof error.message === "string"
        ? error.message
        : "Failed to load dashboard summary";
    throw new Error(message);
  }
}

export async function getTopSellingServices(): Promise<TopSellingService[]> {
  const { start, end } = todayRange();

  const { data, error } = await supabase.from("orders").select("service").gte("order_time", start).lt("order_time", end);
  if (error) throw error;

  const counts = new Map<ServiceType, number>();
  for (const row of data) {
    const serviceType = row.service;
    if (
      typeof serviceType !== "string" ||
      !SERVICE_TYPES.includes(serviceType as ServiceType)
    ) continue;
    const normalizedServiceType = serviceType as ServiceType;
    counts.set(
      normalizedServiceType,
      (counts.get(normalizedServiceType) ?? 0) + 1,
    );
  }

  return [...counts.entries()]
    .map(([serviceType, count]) => ({ serviceType, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
}
