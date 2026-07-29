import type { OrderStatus, ServiceType } from "@/domain/types/order";
import {
  formatOrderStatus,
  formatServiceType,
} from "@/utils/orderFormatters";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";

interface OrderFiltersBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  orderStatuses: OrderStatus[];
  serviceTypes: ServiceType[];
  orderStatusOptions: OrderStatus[];
  serviceTypeOptions: ServiceType[];
  onToggleOrderStatus: (status: OrderStatus) => void;
  onToggleServiceType: (type: ServiceType) => void;
  sortOrder: "newest" | "oldest";
  onSortChange: (value: "newest" | "oldest") => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export default function OrderFiltersBar({
  search,
  onSearchChange,
  orderStatuses,
  serviceTypes,
  orderStatusOptions,
  serviceTypeOptions,
  onToggleOrderStatus,
  onToggleServiceType,
  sortOrder,
  onSortChange,
  onClearFilters,
  hasActiveFilters,
}: OrderFiltersBarProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search by guest name, order ID, or room number..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <select
          value={sortOrder}
          onChange={(e) =>
            onSortChange(e.target.value as "newest" | "oldest")
          }
          className="h-11 rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            Clear Filters
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-start">
        <div className="flex-1">
          <p className="mb-2 text-xs font-medium uppercase text-gray-400">
            Order Status
          </p>
          <div className="flex flex-wrap gap-2">
            {orderStatusOptions.map((status) => {
              const active = orderStatuses.includes(status);
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => onToggleOrderStatus(status)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    active
                      ? "bg-brand-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                >
                  {formatOrderStatus(status)}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1">
          <p className="mb-2 text-xs font-medium uppercase text-gray-400">
            Service Type
          </p>
          <div className="flex flex-wrap gap-2">
            {serviceTypeOptions.map((type) => {
              const active = serviceTypes.includes(type);
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => onToggleServiceType(type)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    active
                      ? "bg-brand-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                >
                  {formatServiceType(type)}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
