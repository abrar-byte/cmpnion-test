import { useState } from "react";
import type { Order, OrderStatus } from "@/domain/types/order";
import { Modal } from "@/components/ui/modal";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import {
  formatCurrency,
  formatOrderStatus,
  formatOrderTime,
  formatPaymentStatus,
  formatServiceType,
  getOrderStatusColor,
  getPaymentStatusColor,
} from "@/utils/orderFormatters";
import { orderService } from "@/infrastructure/di/container";
import SlaIndicator from "@/components/dashboard/SlaIndicator";
import { ORDER_CANCELLED_STATUS } from "@/data/constants";

interface OrderDetailModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (id: string, status: OrderStatus) => void;
  isUpdating: boolean;
  isOverdue: boolean;
  overdueMinutes: number;
}

export default function OrderDetailModal({
  order,
  isOpen,
  onClose,
  onStatusUpdate,
  isUpdating,
  isOverdue,
  overdueMinutes,
}: OrderDetailModalProps) {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  if (!order) return null;

  const transitions = orderService.getAvailableTransitions(order.orderStatus);
  const isFinal = orderService.isFinalStatus(order.orderStatus);

  const handleStatusClick = (status: OrderStatus) => {
    if (status === ORDER_CANCELLED_STATUS) {
      setShowCancelConfirm(true);
      return;
    }
    onStatusUpdate(order.id, status);
  };

  const confirmCancel = () => {
    onStatusUpdate(order.id, ORDER_CANCELLED_STATUS);
    setShowCancelConfirm(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg p-6 m-4">
      <div className="space-y-5">
        <div className="flex items-start justify-between pr-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Order Details
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {order.id}
            </p>
          </div>
          {isOverdue && <SlaIndicator overdueMinutes={overdueMinutes} />}
        </div>

        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <DetailItem label="Guest Name" value={order.guestName} />
          <DetailItem label="Room Number" value={order.roomNumber} />
          <DetailItem label="Service Type" value={formatServiceType(order.serviceType)} />
          <DetailItem label="Quantity" value={String(order.quantity)} />
          <DetailItem label="Order Time" value={formatOrderTime(order.orderTime)} />
          <DetailItem label="Amount" value={formatCurrency(order.amount)} />
          <div>
            <dt className="text-xs text-gray-500 dark:text-gray-400">
              Order Status
            </dt>
            <dd className="mt-1">
              <Badge color={getOrderStatusColor(order.orderStatus)} size="sm">
                {formatOrderStatus(order.orderStatus)}
              </Badge>
            </dd>
          </div>
          <div>
            <dt className="text-xs text-gray-500 dark:text-gray-400">
              Payment Status
            </dt>
            <dd className="mt-1">
              <Badge color={getPaymentStatusColor(order.paymentStatus)} size="sm">
                {formatPaymentStatus(order.paymentStatus)}
              </Badge>
            </dd>
          </div>
        </dl>

        {order.specialRequest && (
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Special Request
            </p>
            <p className="mt-1 text-sm text-gray-800 dark:text-white/90">
              {order.specialRequest}
            </p>
          </div>
        )}

        {!isFinal && transitions.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-medium uppercase text-gray-400">
              Update Status
            </p>
            <div className="flex flex-wrap gap-2">
              {transitions.map((status) => (
                <Button
                  key={status}
                  size="sm"
                  variant={
                    status === ORDER_CANCELLED_STATUS ? "outline" : "primary"
                  }
                  disabled={isUpdating}
                  onClick={() => handleStatusClick(status)}
                  className={
                    status === ORDER_CANCELLED_STATUS
                      ? "text-error-600 ring-error-300 hover:bg-error-50 dark:text-error-400"
                      : ""
                  }
                >
                  {formatOrderStatus(status)}
                </Button>
              ))}
            </div>
          </div>
        )}

        {showCancelConfirm && (
          <div className="rounded-xl border border-error-200 bg-error-50 p-4 dark:border-error-500/30 dark:bg-error-500/10">
            <p className="text-sm font-medium text-error-700 dark:text-error-400">
              Are you sure you want to cancel this order?
            </p>
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="primary" onClick={confirmCancel} disabled={isUpdating}>
                Yes, Cancel Order
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowCancelConfirm(false)}
              >
                No, Go Back
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-gray-500 dark:text-gray-400">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-gray-800 dark:text-white/90">
        {value}
      </dd>
    </div>
  );
}
