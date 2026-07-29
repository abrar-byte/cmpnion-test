import type {
  Order,
  OrderStatus,
  OrderFilters,
  PaymentStatus,
  ServiceType,
  SortOrder,
} from "@/domain/types/order";

export type {
  Order,
  OrderStatus,
  OrderFilters,
  PaymentStatus,
  ServiceType,
  SortOrder,
};

export interface OrderCustomerRow {
  name: string;
}

export interface OrderRow {
  id: string;
  customer_id: string;
  service: ServiceType;
  quantity: number;
  amount: number | string;
  special_request: string | null;
  order_time: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  room_number: string;
  customers: OrderCustomerRow | OrderCustomerRow[] | null;
}

export type CreateOrderInput = Omit<Order, "id" | "guestName"> & {
  customerId: string;
};

export type UpdateOrderInput = Partial<
  Omit<Order, "id" | "guestName"> & { customerId: string }
>;

export type { OrderPeriod } from "@/utils";
