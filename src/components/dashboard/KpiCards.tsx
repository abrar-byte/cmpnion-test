import type { DashboardMetrics } from "@/domain/types/order";
import TopSellingServices from "@/components/dashboard/TopSellingServices";
import {
  BoxIconLine,
  DollarLineIcon,
  GroupIcon,
  ShootingStarIcon,
} from "@/icons";
import { formatCurrency } from "@/utils/orderFormatters";

interface KpiCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

function KpiCard({ label, value, icon }: KpiCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
        {icon}
      </div>
      <div className="mt-5">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {label}
        </span>
        <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
          {value}
        </h4>
      </div>
    </div>
  );
}

interface KpiCardsProps {
  metrics: DashboardMetrics;
}

export default function KpiCards({ metrics }: KpiCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 md:gap-6">
      <KpiCard
        label="Active Guests"
        value={String(metrics.activeGuests)}
        icon={<GroupIcon className="size-6 text-gray-800 dark:text-white/90" />}
      />
      <KpiCard
        label="Pending Orders"
        value={String(metrics.pendingOrders)}
        icon={
          <BoxIconLine className="size-6 text-gray-800 dark:text-white/90" />
        }
      />
      <KpiCard
        label="Revenue Today"
        value={formatCurrency(metrics.revenueToday)}
        icon={
          <DollarLineIcon className="size-6 text-gray-800 dark:text-white/90" />
        }
      />
      <KpiCard
        label="Completed Orders"
        value={String(metrics.completedOrders)}
        icon={
          <ShootingStarIcon className="size-6 text-gray-800 dark:text-white/90" />
        }
      />
      <KpiCard
        label="Average Order Value"
        value={formatCurrency(metrics.averageOrderValue)}
        icon={
          <DollarLineIcon className="size-6 text-gray-800 dark:text-white/90" />
        }
      />
      <TopSellingServices services={metrics.topSellingServices} />
    </div>
  );
}
