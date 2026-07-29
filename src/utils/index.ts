import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export type OrderPeriod = "today" | "this_week" | "this_month" | "all";

export function todayRange(): { start: string; end: string } {
  return orderPeriodRange("today")!;
}

export function orderPeriodRange(
  period: OrderPeriod,
): { start: string; end: string } | null {
  if (period === "all") return null;

  const now = new Date();
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth();
  const d = now.getUTCDate();

  if (period === "today") {
    return {
      start: new Date(Date.UTC(y, m, d)).toISOString(),
      end: new Date(Date.UTC(y, m, d + 1)).toISOString(),
    };
  }

  if (period === "this_week") {
    const day = now.getUTCDay();
    const diffToMonday = day === 0 ? 6 : day - 1;
    const mondayDate = d - diffToMonday;
    return {
      start: new Date(Date.UTC(y, m, mondayDate)).toISOString(),
      end: new Date(Date.UTC(y, m, mondayDate + 7)).toISOString(),
    };
  }

  return {
    start: new Date(Date.UTC(y, m, 1)).toISOString(),
    end: new Date(Date.UTC(y, m + 1, 1)).toISOString(),
  };
}