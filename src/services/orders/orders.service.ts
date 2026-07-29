import { supabase } from "@/utils/supabase";
import type { Order, OrderStatus } from "@/domain/types/order";
import {
  ORDER_CANCELLED_STATUS,
  ORDER_COMPLETED_STATUS,
} from "@/data/constants";
import { orderPeriodRange } from "@/utils";
import type {
  CreateOrderInput,
  OrderPeriod,
  OrderRow,
  UpdateOrderInput,
} from "./orders.types";

const ORDER_SELECT = `
  id,
  customer_id,
  service,
  quantity,
  amount,
  special_request,
  order_time,
  status,
  payment_status,
  customers ( name )
`;

function rethrow(error: unknown, fallback: string): never {
  console.error(fallback, error);
  if (error instanceof Error) throw error;
  const message =
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
      ? error.message
      : fallback;
  throw new Error(message);
}

function customerName(
  customers: OrderRow["customers"],
): string {
  if (!customers) return "Unknown";
  if (Array.isArray(customers)) return customers[0]?.name ?? "Unknown";
  return customers.name;
}

function mapOrder(row: OrderRow): Order {
  return {
    id: row.id,
    guestName: customerName(row.customers),
    roomNumber: row.room_number,
    serviceType: row.service,
    quantity: row.quantity,
    specialRequest: row.special_request ?? undefined,
    paymentStatus: row.payment_status,
    orderStatus: row.status,
    orderTime: row.order_time,
    amount: Number(row.amount),
  };
}

function toDbUpdates(updates: UpdateOrderInput): Record<string, unknown> {
  const db: Record<string, unknown> = {};
  if (updates.customerId !== undefined) db.customer_id = updates.customerId;
  if (updates.serviceType !== undefined) db.service = updates.serviceType;
  if (updates.quantity !== undefined) db.quantity = updates.quantity;
  if (updates.amount !== undefined) db.amount = updates.amount;
  if (updates.specialRequest !== undefined)
    db.special_request = updates.specialRequest;
  if (updates.orderTime !== undefined) db.order_time = updates.orderTime;
  if (updates.orderStatus !== undefined) db.status = updates.orderStatus;
  if (updates.paymentStatus !== undefined)
    db.payment_status = updates.paymentStatus;
  if (updates.roomNumber !== undefined) db.room_number = updates.roomNumber;
  return db;
}

export async function getOrders(
  period: OrderPeriod = "today",
): Promise<Order[]> {
  try {
    let query = supabase
      .from("orders")
      .select(ORDER_SELECT)
      .order("order_time", { ascending: false });

    const range = orderPeriodRange(period);
    if (range) {
      query = query
        .gte("order_time", range.start)
        .lt("order_time", range.end);
    }

    const { data, error } = await query;

    if (error) throw error;
    return ((data ?? []) as OrderRow[]).map(mapOrder);
  } catch (error) {
    rethrow(error, "[getOrders] Failed to load orders");
  }
}

export async function getOrderById(id: string): Promise<Order | null> {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select(ORDER_SELECT)
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw error;
    }
    return mapOrder(data as OrderRow);
  } catch (error) {
    rethrow(error, "[getOrderById] Failed to load order");
  }
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  try {
    const { data, error } = await supabase
      .from("orders")
      .insert({
        customer_id: input.customerId,
        service: input.serviceType,
        quantity: input.quantity,
        amount: input.amount,
        special_request: input.specialRequest ?? null,
        order_time: input.orderTime,
        status: input.orderStatus,
        payment_status: input.paymentStatus,
        room_number: input.roomNumber,
      })
      .select(ORDER_SELECT)
      .single();

    if (error) throw error;
    return mapOrder(data as OrderRow);
  } catch (error) {
    rethrow(error, "[createOrder] Failed to create order");
  }
}

export async function updateOrder(
  id: string,
  updates: UpdateOrderInput,
): Promise<Order> {
  try {
    const { data, error } = await supabase
      .from("orders")
      .update(toDbUpdates(updates))
      .eq("id", id)
      .select(ORDER_SELECT)
      .single();

    if (error) throw error;
    return mapOrder(data as OrderRow);
  } catch (error) {
    rethrow(error, "[updateOrder] Failed to update order");
  }
}

export async function cancelOrder(id: string): Promise<Order> {
  return updateOrder(id, { orderStatus: ORDER_CANCELLED_STATUS });
}

export async function completeOrder(id: string): Promise<Order> {
  return updateOrder(id, { orderStatus: ORDER_COMPLETED_STATUS });
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<Order> {
  return updateOrder(id, { orderStatus: status });
}
