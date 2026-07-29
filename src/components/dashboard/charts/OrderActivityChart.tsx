import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import type { DashboardChartData, ActivityPeriod } from "@/services/DashboardChartService";

interface OrderActivityChartProps {
  data: DashboardChartData["activity"];
  period: ActivityPeriod;
  onPeriodChange: (period: ActivityPeriod) => void;
}

export default function OrderActivityChart({
  data,
  period,
  onPeriodChange,
}: OrderActivityChartProps) {
  const options: ApexOptions = {
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit, sans-serif",
      labels: { colors: "#6B7280" },
    },
    colors: ["#465FFF", "#9CB9FF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "area",
      toolbar: { show: false },
    },
    stroke: {
      curve: "smooth",
      width: [2, 2],
    },
    fill: {
      type: "gradient",
      gradient: { opacityFrom: 0.55, opacityTo: 0 },
    },
    markers: {
      size: 0,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: { size: 5 },
    },
    grid: {
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    dataLabels: { enabled: false },
    tooltip: { enabled: true },
    xaxis: {
      type: "category",
      categories: data.categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: "#6B7280", fontSize: "12px" } },
    },
    yaxis: [
      {
        title: { text: "Orders" },
        labels: { style: { colors: ["#6B7280"], fontSize: "12px" } },
      },
      {
        opposite: true,
        title: { text: "Revenue ($)" },
        labels: {
          style: { colors: ["#6B7280"], fontSize: "12px" },
          formatter: (val) => `$${val}`,
        },
      },
    ],
  };

  const series = [
    { name: "Orders", data: data.orders },
    { name: "Revenue", data: data.revenue },
  ];

  const tabClass = (active: boolean) =>
    active
      ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
      : "text-gray-500 dark:text-gray-400";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Order Activity
          </h3>
          <p className="mt-1 text-theme-sm text-gray-500 dark:text-gray-400">
            Orders and revenue {period === "today" ? "throughout today" : "over the last 7 days"}
          </p>
        </div>
        <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
          <button
            onClick={() => onPeriodChange("today")}
            className={`rounded-md px-3 py-2 text-theme-sm font-medium hover:text-gray-900 dark:hover:text-white ${tabClass(period === "today")}`}
          >
            Today
          </button>
          <button
            onClick={() => onPeriodChange("week")}
            className={`rounded-md px-3 py-2 text-theme-sm font-medium hover:text-gray-900 dark:hover:text-white ${tabClass(period === "week")}`}
          >
            7 Days
          </button>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[600px] xl:min-w-full">
          <Chart options={options} series={series} type="area" height={310} />
        </div>
      </div>
    </div>
  );
}
