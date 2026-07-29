import { useMemo, useState } from "react";
import PageMeta from "@/components/common/PageMeta";
import KpiCards from "@/components/dashboard/KpiCards";
import ServiceOrdersChart from "@/components/dashboard/charts/ServiceOrdersChart";
import OrderStatusChart from "@/components/dashboard/charts/OrderStatusChart";
import { LoadingState, ErrorState } from "@/components/dashboard/DataStates";
import { useOrders } from "@/services/orders/orders.query";
import type { OrderPeriod } from "@/services/orders/orders.types";
import { useDashboardSummary } from "@/services/dashboard/dashboard.query";
import { DashboardChartService } from "@/services/DashboardChartService";
import Button from "@/components/ui/button/Button";

const chartService = new DashboardChartService();

const PERIOD_OPTIONS: { value: OrderPeriod; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "this_week", label: "This Week" },
  { value: "this_month", label: "This Month" },
  { value: "all", label: "All Time" },
];

export default function Home() {
  const [period, setPeriod] = useState<OrderPeriod>("today");
  const { data: orders, isSuccess: ordersSuccess, isLoading: ordersLoading, error: ordersErrorData, isError: ordersError, refetch: refetchOrders } = useOrders(period);
  const { data: metrics, isSuccess, isLoading: metricsLoading, error: metricsErrorData, isError: metricsError, refetch: refetchMetrics } = useDashboardSummary();

  const chartData = useMemo(
    () =>
      orders
        ? chartService.buildChartData(orders)
        : null,
    [orders],
  );

  const tabClass = (active: boolean) =>
    active
      ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
      : "text-gray-500 dark:text-gray-400";

  return (
    <>
      <PageMeta
        title="Dashboard | CMPNION Hotel Service Management"
        description="Hotel operational status and performance overview"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12">
          <div className="mb-2 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
                Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Hotel operational status at a glance
              </p>
            </div>
            <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
              {PERIOD_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setPeriod(value)}
                  className={`rounded-md px-3 py-2 text-theme-sm font-medium hover:text-gray-900 dark:hover:text-white ${tabClass(period === value)}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {metricsLoading && <LoadingState className="col-span-12" />}
        {metricsError && <ErrorState className="col-span-12 w-full" title="Failed to load metrics" description={metricsErrorData?.message || "Unable to load metrics data. Please try again."} action={<Button size="sm" onClick={refetchMetrics}>Retry</Button>} />}
        {isSuccess && metrics && (
          <div className="col-span-12">
            <KpiCards metrics={metrics} />
          </div>
        )}

        {ordersLoading && <LoadingState title="metrics" className="col-span-12" />}
        {ordersError && <ErrorState className="col-span-12 w-full" title="Failed to load charts" description={ordersErrorData?.message || "Unable to load chart data. Please try again."} action={<Button size="sm" onClick={refetchOrders}>Retry</Button>} />}
        {ordersSuccess && chartData && (
          <>




            <div className="col-span-12 md:col-span-6">
              <ServiceOrdersChart data={chartData.serviceOrders} />
            </div>

            <div className="col-span-12 md:col-span-6">
              <OrderStatusChart data={chartData.statusBreakdown} />
            </div>
          </>
        )}
      </div>
    </>
  );
}
