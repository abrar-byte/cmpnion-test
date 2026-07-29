import { useMemo, useState } from "react";
import type { OrderFilters } from "@/domain/types/order";
import {
  ORDER_STATUSES,
  SERVICE_TYPES,
  type OrderStatus,
  type ServiceType,
} from "@/domain/types/order";

const DEFAULT_FILTERS: OrderFilters = {
  search: "",
  orderStatuses: [],
  serviceTypes: [],
  sortOrder: "newest",
};

export function useOrderFilters() {
  const [filters, setFilters] = useState<OrderFilters>(DEFAULT_FILTERS);

  const setSearch = (search: string) =>
    setFilters((prev) => ({ ...prev, search }));

  const toggleOrderStatus = (status: OrderStatus) =>
    setFilters((prev) => ({
      ...prev,
      orderStatuses: prev.orderStatuses.includes(status)
        ? prev.orderStatuses.filter((s) => s !== status)
        : [...prev.orderStatuses, status],
    }));

  const toggleServiceType = (serviceType: ServiceType) =>
    setFilters((prev) => ({
      ...prev,
      serviceTypes: prev.serviceTypes.includes(serviceType)
        ? prev.serviceTypes.filter((s) => s !== serviceType)
        : [...prev.serviceTypes, serviceType],
    }));

  const setSortOrder = (sortOrder: OrderFilters["sortOrder"]) =>
    setFilters((prev) => ({ ...prev, sortOrder }));

  const clearFilters = () => setFilters(DEFAULT_FILTERS);

  const hasActiveFilters = useMemo(
    () =>
      filters.search.trim() !== "" ||
      filters.orderStatuses.length > 0 ||
      filters.serviceTypes.length > 0,
    [filters],
  );

  return {
    filters,
    setSearch,
    toggleOrderStatus,
    toggleServiceType,
    setSortOrder,
    clearFilters,
    hasActiveFilters,
    orderStatusOptions: ORDER_STATUSES,
    serviceTypeOptions: SERVICE_TYPES,
  };
}
