import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { OrderStatus } from "@/domain/types/order";
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  updateOrderStatus,
} from "./orders.service";
import type {
  CreateOrderInput,
  OrderPeriod,
  UpdateOrderInput,
} from "./orders.types";
import { DASHBOARD_QUERY_KEY } from "../dashboard/dashboard.query";

export const ORDERS_QUERY_KEY = ["orders"] as const;

export function useOrders(period: OrderPeriod = "today") {
  return useQuery({
    queryKey: [...ORDERS_QUERY_KEY, period],
    queryFn: () => getOrders(period),
    placeholderData: (previousData) => previousData,
    throwOnError: false,
    refetchOnWindowFocus: false,
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: [...ORDERS_QUERY_KEY, id],
    queryFn: () => getOrderById(id),
    enabled: !!id,
    throwOnError: false,
    refetchOnWindowFocus: false,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (order: CreateOrderInput) => createOrder(order),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
    },
    throwOnError: false,
  });
}

export function useUpdateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: UpdateOrderInput;
    }) => updateOrder(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
    },
    throwOnError: false,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
    },
    throwOnError: false,
  });
}
