import { useMemo, useState } from "react";
import type { Order, OrderStatus } from "@/domain/types/order";
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
import SlaIndicator from "@/components/dashboard/SlaIndicator";
import {
  LoadingState,
  EmptyState,
  ErrorState,
} from "@/components/dashboard/DataStates";
import { useOrderFilters } from "@/hooks/useOrderFilters";
import { useOrders, useUpdateOrderStatus } from "@/hooks/useOrders";
import {
  orderQueryService,
  slaService,
} from "@/infrastructure/di/container";
import {
  formatOrderTime,
  getOrderStatusColor,
  getPaymentStatusColor,
} from "@/utils/orderFormatters";
import { useModal } from "@/hooks/useModal";

export default function OrderListSection() {
  const { data: orders, isLoading, isError, refetch } = useOrders();
  const updateStatus = useUpdateOrderStatus();
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

  const filteredOrders = useMemo(
    () => (orders ? orderQueryService.filterOrders(orders, filters) : []),
    [orders, filters],
  );

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

  const handleCloseModal = () => {
    closeModal();
    setSelectedOrder(null);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-4 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <OrderFiltersBar
        search={filters.search}
        onSearchChange={setSearch}
        orderStatuses={filters.orderStatuses}
        serviceTypes={filters.serviceTypes}
        orderStatusOptions={orderStatusOptions}
        serviceTypeOptions={serviceTypeOptions}
        onToggleOrderStatus={toggleOrderStatus}
        onToggleServiceType={toggleServiceType}
        sortOrder={filters.sortOrder}
        onSortChange={setSortOrder}
        onClearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      <div className="mt-4">
        {isLoading && !orders ? (
          <LoadingState />
        ) : isError ? (
          <ErrorState
            title="Failed to load orders"
            description="Something went wrong while fetching orders. Please try again."
            action={
              <Button size="sm" onClick={() => refetch()}>
                Retry
              </Button>
            }
          />
        ) : filteredOrders.length === 0 ? (
          <EmptyState
            title="No orders found"
            description={
              hasActiveFilters
                ? "No orders match your current search or filters. Try adjusting your criteria."
                : "There are no guest service orders at the moment."
            }
            action={
              hasActiveFilters ? (
                <Button size="sm" variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              ) : undefined
            }
          />
        ) : (
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
                {filteredOrders.map((order) => {
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
                        {order.serviceType}
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
                          {order.orderStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3">
                        <Badge
                          color={getPaymentStatusColor(order.paymentStatus)}
                          size="sm"
                        >
                          {order.paymentStatus}
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
        )}
      </div>

      <OrderDetailModal
        order={selectedOrder}
        isOpen={isOpen}
        onClose={handleCloseModal}
        onStatusUpdate={handleStatusUpdate}
        isUpdating={updateStatus.isPending}
        isOverdue={selectedOrder ? slaService.isOverdue(selectedOrder) : false}
        overdueMinutes={
          selectedOrder ? slaService.getOverdueMinutes(selectedOrder) : 0
        }
      />
    </div>
  );
}
