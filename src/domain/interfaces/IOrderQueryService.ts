import type { Order, OrderFilters } from "@/domain/types/order";

export interface IOrderQueryService {
  filterOrders(orders: Order[], filters: OrderFilters): Order[];
}
