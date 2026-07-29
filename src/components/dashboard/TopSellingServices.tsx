import type { DashboardMetrics } from "@/domain/types/order";
import Badge from "@/components/ui/badge/Badge";

interface TopSellingServicesProps {
  services: DashboardMetrics["topSellingServices"];
}

export default function TopSellingServices({
  services,
}: TopSellingServicesProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
        Top Selling Services
      </h3>
      {services.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No service data available
        </p>
      ) : (
        <ul className="space-y-3">
          {services.map((item, index) => (
            <li
              key={item.serviceType}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-500 dark:bg-brand-500/15 dark:text-brand-400">
                  {index + 1}
                </span>
                <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {item.serviceType}
                </span>
              </div>
              <Badge color="primary" size="sm">
                {item.count} orders
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
