import type { IOrderQueryService } from "@/domain/interfaces/IOrderQueryService";
import type { Order, OrderFilters } from "@/domain/types/order";

export class OrderQueryService implements IOrderQueryService {
  filterOrders(orders: Order[], filters: OrderFilters): Order[] {
    let result = [...orders];

    if (filters.search.trim()) {
      const query = filters.search.trim().toLowerCase();
      result = result.filter(
        (order) =>
          order.guestName.toLowerCase().includes(query) ||
          order.id.toLowerCase().includes(query) ||
          order.roomNumber.toLowerCase().includes(query),
      );
    }

    if (filters.orderStatuses.length > 0) {
      result = result.filter((order) =>
        filters.orderStatuses.includes(order.orderStatus),
      );
    }

    if (filters.serviceTypes.length > 0) {
      result = result.filter((order) =>
        filters.serviceTypes.includes(order.serviceType),
      );
    }

    result.sort((a, b) => {
      const timeA = new Date(a.orderTime).getTime();
      const timeB = new Date(b.orderTime).getTime();
      return filters.sortOrder === "newest" ? timeB - timeA : timeA - timeB;
    });

    return result;
  }
}
