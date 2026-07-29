import { supabase } from "@/utils/supabase";
import type { Order, OrderStatus } from "@/domain/types/order";
import {
  ORDER_CANCELLED_STATUS,
  ORDER_COMPLETED_STATUS,
} from "@/data/constants";
import { getAvailablePaymentTransitions } from "@/utils/orderFormatters";
import { orderPeriodRange } from "@/utils";
import type {
  CreateOrderInput,
  OrderPeriod,
  OrderRow,
  OrdersListResult,
  OrdersQueryParams,
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
  customers ( name, room_number )
`;

function applySort<T extends { order: (col: string, opts: { ascending: boolean }) => T }>(
  query: T,
  sort?: string,
): T {
  if (sort) {
    const isDescending = sort.startsWith("-");
    const column = isDescending ? sort.substring(1) : sort;
    return query.order(column, { ascending: !isDescending });
  }
  return query.order("order_time", { ascending: false });
}

function applyPagination<T extends { range: (from: number, to: number) => T; limit: (n: number) => T }>(
  query: T,
  take?: number,
  page?: number,
): T {
  if (take && page) {
    const from = (page - 1) * take;
    const to = from + take - 1;
    return query.range(from, to);
  }
  if (take) {
    return query.limit(take);
  }
  return query;
}

function buildOrdersListResult(
  rows: OrderRow[],
  count: number,
  take?: number,
  page?: number,
): OrdersListResult {
  const totalCount = count;
  const takeValue = take ?? totalCount;
  const pageValue = page ?? 1;
  const pageCount = takeValue > 0 ? Math.ceil(totalCount / takeValue) : 0;

  return {
    data: rows.map(mapOrder),
    meta: {
      count: totalCount,
      take: takeValue,
      page: pageValue,
      pageCount,
    },
  };
}

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

function customerRoomNumber(
  customers: OrderRow["customers"],
): string {
  if (!customers) return "";
  if (Array.isArray(customers)) return customers[0]?.room_number ?? "";
  return customers.room_number ?? "";
}

function mapOrder(row: OrderRow): Order {
  return {
    id: row.id,
    guestName: customerName(row.customers),
    roomNumber: customerRoomNumber(row.customers),
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
  return db;
}

function applyPeriodFilter<T extends { gte: (col: string, val: string) => T; lt: (col: string, val: string) => T }>(
  query: T,
  period: OrderPeriod,
): T {
  const range = orderPeriodRange(period);
  if (!range) return query;
  return query.gte("order_time", range.start).lt("order_time", range.end);
}

function toIlikePattern(term: string): string {
  const escaped = term.replace(/\\/g, "\\\\").replace(/[%_]/g, (char) => `\\${char}`);
  return `%${escaped}%`;
}

async function findCustomerIdsBySearch(search: string): Promise<string[]> {
  const term = search.trim();
  const pattern = toIlikePattern(term);
  const filters = [`name.ilike.${pattern}`, `room_number.ilike.${pattern}`];

  if (/^\d+$/.test(term)) {
    filters.push(`room_number.eq.${term}`);
  }

  const { data, error } = await supabase
    .from("customers")
    .select("id")
    .or(filters.join(","));

  if (error) {
    console.error("[findCustomerIdsBySearch] Failed", { search: term, error });
    throw error;
  }

  return (data ?? []).map((customer) => customer.id);
}

function buildOrderSearchOrFilter(search: string, customerIds: string[]): string {
  const pattern = toIlikePattern(search.trim());
  const conditions = [`id.ilike.${pattern}`];

  if (customerIds.length > 0) {
    conditions.push(`customer_id.in.(${customerIds.join(",")})`);
  }

  return conditions.join(",");
}

export async function searchOrders(
  search: string,
  params: Pick<OrdersQueryParams, "take" | "page" | "sort"> = {},
): Promise<OrdersListResult> {
  try {
    const { take, page, sort } = params;
    const term = search.trim();

    if (!term) {
      return buildOrdersListResult([], 0, take, page);
    }

    const customerIds = await findCustomerIdsBySearch(term);
    const orFilter = buildOrderSearchOrFilter(term, customerIds);

    const { count, error: countError } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .or(orFilter);

    if (countError) {
      console.error("[searchOrders] Count query failed", { search: term, orFilter, countError });
      throw countError;
    }

    let dataQuery = supabase
      .from("orders")
      .select(ORDER_SELECT)
      .or(orFilter);

    dataQuery = applySort(dataQuery, sort);
    dataQuery = applyPagination(dataQuery, take, page);

    const { data, error } = await dataQuery;

    if (error) {
      console.error("[searchOrders] Data query failed", { search: term, orFilter, error });
      throw error;
    }

    return buildOrdersListResult((data ?? []) as OrderRow[], count ?? 0, take, page);
  } catch (error) {
    rethrow(error, "[searchOrders] Failed to search orders");
  }
}

export async function getOrdersList(
  params: OrdersQueryParams = {},
): Promise<OrdersListResult> {
  try {
    const {
      take,
      page,
      sort,
      search,
      period = "all",
      statuses,
      services,
    } = params;

    const hasSearch = Boolean(search?.trim());

    if (hasSearch) {
      return searchOrders(search!, { take, page, sort });
    }

    let countQuery = supabase
      .from("orders")
      .select("*", { count: "exact", head: true });

    let dataQuery = supabase.from("orders").select(ORDER_SELECT);

    countQuery = applyPeriodFilter(countQuery, period);
    dataQuery = applyPeriodFilter(dataQuery, period);

    if (statuses && statuses.length > 0) {
      countQuery = countQuery.in("status", statuses);
      dataQuery = dataQuery.in("status", statuses);
    }

    if (services && services.length > 0) {
      countQuery = countQuery.in("service", services);
      dataQuery = dataQuery.in("service", services);
    }

    const { count, error: countError } = await countQuery;

    if (countError) {
      console.error("[getOrdersList] Count query failed", {
        params,
        countError,
      });
      throw countError;
    }

    dataQuery = applySort(dataQuery, sort);
    dataQuery = applyPagination(dataQuery, take, page);

    const { data, error } = await dataQuery;

    if (error) {
      console.error("[getOrdersList] Data query failed", {
        params,
        error,
      });
      throw error;
    }

    return buildOrdersListResult((data ?? []) as OrderRow[], count ?? 0, take, page);
  } catch (error) {
    rethrow(error, "[getOrdersList] Failed to load orders");
  }
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
    if (updates.paymentStatus !== undefined) {
      const existing = await getOrderById(id);
      if (!existing) {
        throw new Error(`Order ${id} not found`);
      }
      const allowed = getAvailablePaymentTransitions(existing.paymentStatus);
      if (!allowed.includes(updates.paymentStatus)) {
        throw new Error(
          `Invalid payment status transition from ${existing.paymentStatus} to ${updates.paymentStatus}`,
        );
      }
    }

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
