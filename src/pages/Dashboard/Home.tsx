import { useMemo, useState } from "react";
import PageMeta from "@/components/common/PageMeta";
import KpiCards from "@/components/dashboard/KpiCards";
import OrderActivityChart from "@/components/dashboard/charts/OrderActivityChart";
import ServiceOrdersChart from "@/components/dashboard/charts/ServiceOrdersChart";
import OrderStatusChart from "@/components/dashboard/charts/OrderStatusChart";
import CompletionRateChart from "@/components/dashboard/charts/CompletionRateChart";
import { LoadingState, ErrorState } from "@/components/dashboard/DataStates";
import { useOrders } from "@/hooks/useOrders";
import {
  dashboardMetricsService,
  dashboardChartService,
} from "@/infrastructure/di/container";
import type { ActivityPeriod } from "@/services/DashboardChartService";
import Button from "@/components/ui/button/Button";

export default function Home() {
  const { data: orders, isLoading, isError, refetch } = useOrders();
  const [activityPeriod, setActivityPeriod] = useState<ActivityPeriod>("week");

  const metrics = useMemo(
    () => (orders ? dashboardMetricsService.calculate(orders) : null),
    [orders],
  );

  const chartData = useMemo(
    () =>
      orders
        ? dashboardChartService.buildChartData(orders, activityPeriod)
        : null,
    [orders, activityPeriod],
  );

  return (
    <>
      <PageMeta
        title="Dashboard | CMPNION Hotel Service Management"
        description="Hotel operational status and performance overview"
      />

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState
          title="Failed to load dashboard"
          description="Unable to load dashboard data. Please try again."
          action={
            <Button size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          }
        />
      ) : metrics && chartData ? (
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          <div className="col-span-12">
            <div className="mb-2">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
                Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Hotel operational status at a glance
              </p>
            </div>
          </div>

          <div className="col-span-12">
            <KpiCards metrics={metrics} />
          </div>

          <div className="col-span-12 space-y-6 xl:col-span-7">
            <OrderActivityChart
              data={chartData.activity}
              period={activityPeriod}
              onPeriodChange={setActivityPeriod}
            />
          </div>

          <div className="col-span-12 xl:col-span-5">
            <CompletionRateChart
              completionRate={chartData.completionRate}
              revenueToday={chartData.revenueToday}
              dailyTarget={chartData.dailyTarget}
            />
          </div>

          <div className="col-span-12 md:col-span-6">
            <ServiceOrdersChart data={chartData.serviceOrders} />
          </div>

          <div className="col-span-12 md:col-span-6">
            <OrderStatusChart data={chartData.statusBreakdown} />
          </div>
        </div>
      ) : null}
    </>
  );
}
