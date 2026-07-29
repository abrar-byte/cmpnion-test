import { useEffect, useMemo, useState } from "react";
import debounce from "debounce";
import type { Order, OrderStatus, PaymentStatus } from "@/domain/types/order";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import OrderFiltersBar from "@/components/dashboard/OrderFiltersBar";
import OrderDetailModal from "@/components/dashboard/OrderDetailModal";
import OrdersPagination from "@/components/dashboard/OrdersPagination";
import SlaIndicator from "@/components/dashboard/SlaIndicator";
import {
  LoadingState,
  EmptyState,
  ErrorState,
} from "@/components/dashboard/DataStates";
import { useOrderFilters } from "@/hooks/useOrderFilters";
import {
  useOrdersList,
  useUpdateOrder,
  useUpdateOrderStatus,
} from "@/services/orders/orders.query";
import { slaService } from "@/infrastructure/di/container";
import {
  formatServiceType,
  formatOrderTime,
  formatOrderStatus,
  formatPaymentStatus,
  getOrderStatusColor,
  getPaymentStatusColor,
} from "@/utils/orderFormatters";
import { useModal } from "@/hooks/useModal";

const PAGE_SIZE = 10;

function getQueryErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }
  return "Something went wrong while fetching orders. Please try again.";
}

export default function OrderListSection() {
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const updateStatus = useUpdateOrderStatus();
  const updateOrder = useUpdateOrder();
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const {
    filters,
    setSearch,
    toggleOrderStatus,
    toggleServiceType,
    setSortOrder,
    clearFilters,
    hasActiveFilters,
    orderStatusOptions,
    serviceTypeOptions,
  } = useOrderFilters();

  const debouncedSetSearch = useMemo(
    () => debounce((value: string) => setDebouncedSearch(value), 400),
    [],
  );

  useEffect(() => () => debouncedSetSearch.clear(), [debouncedSetSearch]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    debouncedSetSearch(value);
    setPage(1);
  };

  const handleClearFilters = () => {
    debouncedSetSearch.clear();
    setDebouncedSearch("");
    clearFilters();
  };

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filters.orderStatuses, filters.serviceTypes, filters.sortOrder]);

  const hasSearch = Boolean(debouncedSearch.trim());

  const queryParams = useMemo(
    () => ({
      take: PAGE_SIZE,
      page,
      search: hasSearch ? debouncedSearch.trim() : undefined,
      statuses:
        !hasSearch && filters.orderStatuses.length > 0
          ? filters.orderStatuses
          : undefined,
      services:
        !hasSearch && filters.serviceTypes.length > 0
          ? filters.serviceTypes
          : undefined,
      sort: filters.sortOrder === "newest" ? "-order_time" : "order_time",
    }),
    [page, debouncedSearch, hasSearch, filters.orderStatuses, filters.serviceTypes, filters.sortOrder],
  );

  const { data, isLoading, isError, error, refetch, isFetching } =
    useOrdersList(queryParams);

  const orders = data?.data ?? [];
  const meta = data?.meta;

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    openModal();
  };

  const handleStatusUpdate = (id: string, status: OrderStatus) => {
    updateStatus.mutate(
      { id, status },
      {
        onSuccess: (updated) => {
          setSelectedOrder(updated);
        },
      },
    );
  };

  const handlePaymentStatusUpdate = (
    id: string,
    paymentStatus: PaymentStatus,
  ) => {
    updateOrder.mutate(
      { id, updates: { paymentStatus } },
      {
        onSuccess: (updated) => {
          setSelectedOrder(updated);
        },
      },
    );
  };

  const handleCloseModal = () => {
    closeModal();
    setSelectedOrder(null);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-4 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <OrderFiltersBar
        search={filters.search}
        onSearchChange={handleSearchChange}
        orderStatuses={filters.orderStatuses}
        serviceTypes={filters.serviceTypes}
        orderStatusOptions={orderStatusOptions}
        serviceTypeOptions={serviceTypeOptions}
        onToggleOrderStatus={toggleOrderStatus}
        onToggleServiceType={toggleServiceType}
        sortOrder={filters.sortOrder}
        onSortChange={setSortOrder}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      <div className="mt-4">
        {isLoading && !data ? (
          <LoadingState />
        ) : isError ? (
          <ErrorState
            title="Failed to load orders"
            description={getQueryErrorMessage(error)}
            action={
              <Button size="sm" onClick={() => refetch()}>
                Retry
              </Button>
            }
          />
        ) : orders.length === 0 ? (
          <EmptyState
            title="No orders found"
            description={
              hasActiveFilters
                ? "No orders match your current search or filters. Try adjusting your criteria."
                : "There are no guest service orders at the moment."
            }
            action={
              hasActiveFilters ? (
                <Button size="sm" variant="outline" onClick={handleClearFilters}>
                  Clear Filters
                </Button>
              ) : undefined
            }
          />
        ) : (
          <>
            {isFetching && (
              <p className="mb-2 text-theme-xs text-gray-400">Updating...</p>
            )}
            <div className="max-w-full overflow-x-auto">
              <Table>
                <TableHeader className="border-y border-gray-100 dark:border-gray-800">
                  <TableRow>
                    {[
                      "Order ID",
                      "Guest",
                      "Room",
                      "Service",
                      "Qty",
                      "Order Time",
                      "Status",
                      "Payment",
                      "",
                    ].map((header) => (
                      <TableCell
                        key={header}
                        isHeader
                        className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                      >
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {orders.map((order) => {
                  const overdue = slaService.isOverdue(order);
                  return (
                    <TableRow
                      key={order.id}
                      className={
                        overdue
                          ? "border-l-4 border-l-error-500 bg-error-50/30 dark:bg-error-500/5"
                          : ""
                      }
                    >
                      <TableCell className="py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-theme-sm text-gray-800 dark:text-white/90">
                            {order.id}
                          </span>
                          {overdue && (
                            <SlaIndicator
                              overdueMinutes={slaService.getOverdueMinutes(order)}
                            />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-3 text-theme-sm text-gray-800 dark:text-white/90">
                        {order.guestName}
                      </TableCell>
                      <TableCell className="py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                        {order.roomNumber}
                      </TableCell>
                      <TableCell className="py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                        {formatServiceType(order.serviceType)}
                      </TableCell>
                      <TableCell className="py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                        {order.quantity}
                      </TableCell>
                      <TableCell className="py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                        {formatOrderTime(order.orderTime)}
                      </TableCell>
                      <TableCell className="py-3">
                        <Badge
                          color={getOrderStatusColor(order.orderStatus)}
                          size="sm"
                        >
                          {formatOrderStatus(order.orderStatus)}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3">
                        <Badge
                          color={getPaymentStatusColor(order.paymentStatus)}
                          size="sm"
                        >
                          {formatPaymentStatus(order.paymentStatus)}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewOrder(order)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                </TableBody>
              </Table>
            </div>
            {meta && (
              <OrdersPagination
                currentPage={meta.page}
                totalPages={meta.pageCount}
                onPageChange={setPage}
              />
            )}
          </>
        )}
      </div>

      <OrderDetailModal
        order={selectedOrder}
        isOpen={isOpen}
        onClose={handleCloseModal}
        onStatusUpdate={handleStatusUpdate}
        onPaymentStatusUpdate={handlePaymentStatusUpdate}
        isUpdating={updateStatus.isPending || updateOrder.isPending}
        isOverdue={selectedOrder ? slaService.isOverdue(selectedOrder) : false}
        overdueMinutes={
          selectedOrder ? slaService.getOverdueMinutes(selectedOrder) : 0
        }
      />
    </div>
  );
}
