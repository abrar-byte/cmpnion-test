import type { OrderPeriod } from "@/utils";
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
  room_number: string | null;
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
  customers: OrderCustomerRow | OrderCustomerRow[] | null;
}

export type CreateOrderInput = Omit<Order, "id" | "guestName"> & {
  customerId: string;
};

export type UpdateOrderInput = Partial<
  Omit<Order, "id" | "guestName"> & { customerId: string }
>;

export type { OrderPeriod };

export type OrdersQueryParams = {
  take?: number;
  page?: number;
  sort?: string;
  search?: string;
  period?: OrderPeriod;
  statuses?: OrderStatus[];
  services?: ServiceType[];
};

export type OrdersListMeta = {
  count: number;
  take: number;
  page: number;
  pageCount: number;
};

export type OrdersListResult = {
  data: Order[];
  meta: OrdersListMeta;
};
