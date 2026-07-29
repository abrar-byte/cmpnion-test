import { useQuery } from "@tanstack/react-query";
import {
  getDashboardSummary,
  getTopSellingServices,
} from "./dashboard.service";

export const DASHBOARD_QUERY_KEY = ["dashboard"] as const;

export function useDashboardSummary() {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, "summary"],
    queryFn: getDashboardSummary,
    placeholderData: (previousData) => previousData,
    throwOnError: false,
    refetchOnWindowFocus: false,
  });
}

export function useTopSellingServices() {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, "topServices"],
    queryFn: getTopSellingServices,
    throwOnError: false,
    refetchOnWindowFocus: false,
  });
}
