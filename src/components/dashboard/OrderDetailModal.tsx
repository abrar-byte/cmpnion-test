import { toast } from "sonner";
import type { Order, OrderStatus, PaymentStatus } from "@/domain/types/order";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import {
  formatCurrency,
  formatOrderStatus,
  formatOrderTime,
  formatPaymentStatus,
  formatServiceType,
  getAvailablePaymentTransitions,
  getOrderStatusColor,
  getPaymentStatusColor,
  requiresPaymentConfirmation,
} from "@/utils/orderFormatters";
import { orderService } from "@/infrastructure/di/container";
import SlaIndicator from "@/components/dashboard/SlaIndicator";
import {
  ORDER_CANCELLED_STATUS,
  PAYMENT_PAID_STATUS,
} from "@/data/constants";

interface OrderDetailModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (id: string, status: OrderStatus) => void;
  onPaymentStatusUpdate: (id: string, paymentStatus: PaymentStatus) => void;
  isUpdating: boolean;
  isOverdue: boolean;
  overdueMinutes: number;
}

export default function OrderDetailModal({
  order,
  isOpen,
  onClose,
  onStatusUpdate,
  onPaymentStatusUpdate,
  isUpdating,
  isOverdue,
  overdueMinutes,
}: OrderDetailModalProps) {
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  if (!order) return null;

  const transitions = orderService.getAvailableTransitions(order.orderStatus);
  const isFinal = orderService.isFinalStatus(order.orderStatus);
  const paymentOptions = getAvailablePaymentTransitions(order.paymentStatus);

  const handleStatusClick = (status: OrderStatus) => {
    if (status === ORDER_CANCELLED_STATUS) {
      toast.warning("Cancel this order?", {
        description:
          "This action cannot be undone. The order will be marked as cancelled.",
        action: {
          label: "Confirm",
          onClick: () => onStatusUpdate(order.id, ORDER_CANCELLED_STATUS),
        },
        cancel: {
          label: "Go back",
          onClick: () => {},
        },
      });
      return;
    }
    onStatusUpdate(order.id, status);
  };

  const handlePaymentStatusClick = (status: PaymentStatus) => {
    if (!requiresPaymentConfirmation(status)) {
      onPaymentStatusUpdate(order.id, status);
      return;
    }

    const isPaid = status === PAYMENT_PAID_STATUS;
    const title = isPaid
      ? "Mark this order as paid?"
      : "Mark this order payment as failed?";
    const description = `Payment status will be updated to ${formatPaymentStatus(status)}.`;

    toast.warning(title, {
      description,
      action: {
        label: "Confirm",
        onClick: () => onPaymentStatusUpdate(order.id, status),
      },
      cancel: {
        label: "Go back",
        onClick: () => {},
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange} modal={false}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between pr-8">
            <div>
              <DialogTitle>Order Details</DialogTitle>
              <DialogDescription>{order.id}</DialogDescription>
            </div>
            {isOverdue && <SlaIndicator overdueMinutes={overdueMinutes} />}
          </div>
        </DialogHeader>

        <div className="space-y-5">
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <DetailItem label="Guest Name" value={order.guestName} />
            <DetailItem label="Room Number" value={order.roomNumber} />
            <DetailItem
              label="Service Type"
              value={formatServiceType(order.serviceType)}
            />
            <DetailItem label="Quantity" value={String(order.quantity)} />
            <DetailItem
              label="Order Time"
              value={formatOrderTime(order.orderTime)}
            />
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
                <Badge
                  color={getPaymentStatusColor(order.paymentStatus)}
                  size="sm"
                >
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

          {paymentOptions.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-medium uppercase text-gray-400">
                Update Payment Status
              </p>
              <div className="flex flex-wrap gap-2">
                {paymentOptions.map((status) => (
                  <Button
                    key={status}
                    size="sm"
                    variant="outline"
                    disabled={isUpdating}
                    onClick={() => handlePaymentStatusClick(status)}
                  >
                    {formatPaymentStatus(status)}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
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
