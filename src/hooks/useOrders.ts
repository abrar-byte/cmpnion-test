import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { OrderStatus } from "@/domain/types/order";
import { orderRepository, orderService } from "@/infrastructure/di/container";

export const ORDERS_QUERY_KEY = ["orders"] as const;

export function useOrders() {
  return useQuery({
    queryKey: ORDERS_QUERY_KEY,
    queryFn: () => orderService.fetchOrders(),
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      orderService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
    },
  });
}

export function useSimulateOrderFetchError() {
  return () => {
    orderRepository.setSimulateFailure(true);
  };
}
